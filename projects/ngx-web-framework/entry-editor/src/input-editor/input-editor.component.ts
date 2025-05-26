import { Component, effect, input, model, OnDestroy, OnInit, signal} from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Entry } from '../models/entry';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';
import {
  invalidEntryValueValidator,
  maxEntryValueValidator,
  minEntryValueValidator,
} from '../validators/entry-editor.validators';
import { CommonModule } from '@angular/common';
import { EntryValue } from '../models/entry-value';
import { MatError,  MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'entry-input-editor',
  templateUrl: './input-editor.component.html',
  styleUrls: ['./input-editor.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, MatError, MatLabel, ReactiveFormsModule, MatFormFieldModule,
    MatInputModule
],
})
export class InputEditorComponent implements OnDestroy {
  inputFormControl!: UntypedFormControl;
  private formControlSubscription?: Subscription;
  isPassword!: boolean;
  isNumber!: boolean;
  
  readOnly = signal<boolean>(false);
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  constructor() {
    this.inputFormControl = new UntypedFormControl();
    const reference = effect(() => {
      this.initialize(this.entry());
      reference.destroy();
    });

    effect(() => {
      this.disableInputFormControl(this.inputFormControl, this.disabled());
    });
  }


  initialize(entry: Entry) {
    this.readOnly.set(entry.value?.isReadOnly || this.isSinglePossibleValue(entry) || entry.value.type === EntryValueType.Exception);
    this.updateCurrentValue(entry.value, entry.value.current);
    this.determineInputType();

    const validators = this.setupValidators(entry);
    this.inputFormControl = this.setupFormControl(entry, validators);
  }

  private updateCurrentValue(currentValue: EntryValue, value: any) {
    this.entry.update(e => {
      let copy = Object.assign({}, e);
      copy.value.current = this.isSinglePossibleValue(e) ? (e.value.possible ?? [''])[0] : value ?? currentValue?.default;
      return copy;
    });
  }

  isSinglePossibleValue(entry: Entry): boolean{
    const result =  entry.value.possible && entry.value.possible.length === 1
    return result ?? false;
  }

  disableInputFormControl(control: UntypedFormControl, disable: boolean) {
    if (disable)
      control.disable();
    else 
      control.enable();
  }

  setupValidators(entry: Entry): ValidatorFn[] {
    var validators = [] as ValidatorFn[];
    validators.push(invalidEntryValueValidator(entry.value.type));
    if (entry.validation?.isRequired)
      validators.push(Validators.required);
    if (this.isNumber)
      this.addNumberValidators(validators);

    else
      this.addTextValidators(validators);

    return validators;
  }

  private setupFormControl(entry: Entry, validators: ValidatorFn[]): UntypedFormControl {
    const result = new UntypedFormControl(
      {
        value: entry.value?.current ?? entry.value?.default ?? '',
        disabled: this.disabled() || (entry.value.isReadOnly ?? false)
      }, validators);

    this.formControlSubscription = result.valueChanges.subscribe(value => {
      if (result.status == 'VALID'){
        this.updateCurrentValue(this.entry().value, value);
      }
    });

    return result;
  }


  ngOnDestroy(): void {
    this.formControlSubscription?.unsubscribe();
  }

  addTextValidators(validators: ValidatorFn[]) {
    const regex = this.entry().validation?.regex;
    if (regex) {
      validators.push(Validators.pattern(regex));
    }
  }

  addNumberValidators(validators: ValidatorFn[]) {
    var typeSpecificMaximum = this.getTypeSpecificMaximum(this.entry().value?.type);
    var typeSpecificMinimum = this.getTypeSpecificMinimum(this.entry().value?.type);

    validators.push(
      maxEntryValueValidator(Math.min(typeSpecificMaximum, this.entry().validation?.maximum ?? typeSpecificMaximum))
    );
    validators.push(
      minEntryValueValidator(Math.max(typeSpecificMinimum, this.entry().validation?.minimum ?? typeSpecificMinimum))
    );
  }

  getTypeSpecificMaximum(type: EntryValueType | undefined): number {
    switch (type) {
      case EntryValueType.Byte:
        return 255;
      case EntryValueType.Int16:
        return 32767;
      case EntryValueType.UInt16:
        return 65535;
      case EntryValueType.Int32:
        return 2147483647;
      case EntryValueType.UInt32:
        return 4294967295;
      case EntryValueType.Int64:
        return Number.MAX_SAFE_INTEGER;
      case EntryValueType.UInt64:
        return Number.MAX_SAFE_INTEGER;
      case EntryValueType.Single:
        return Math.pow(3.4 * 10, 38);
      case EntryValueType.Double:
        return Number.MAX_VALUE;
      default:
        return 0;
    }
  }

  getTypeSpecificMinimum(type: EntryValueType | undefined): number {
    switch (type) {
      case EntryValueType.Byte:
        return 0;
      case EntryValueType.Int16:
        return -32768;
      case EntryValueType.UInt16:
        return 0;
      case EntryValueType.Int32:
        return -2147483648;
      case EntryValueType.UInt32:
        return 0;
      case EntryValueType.Int64:
        return Number.MIN_SAFE_INTEGER;
      case EntryValueType.UInt64:
        return 0;
      case EntryValueType.Single:
        return -Math.pow(3.4 * 10, 38);
      case EntryValueType.Double:
        return -Number.MAX_VALUE;
      default:
        return 0;
    }
  }

  determineInputType() {
    if (
      EntryValueType.Int16 === this.entry().value?.type ||
      EntryValueType.UInt16 === this.entry().value?.type ||
      EntryValueType.Int32 === this.entry().value?.type ||
      EntryValueType.UInt32 === this.entry().value?.type ||
      EntryValueType.Int64 === this.entry().value?.type ||
      EntryValueType.UInt64 === this.entry().value?.type ||
      EntryValueType.Single === this.entry().value?.type ||
      EntryValueType.Double === this.entry().value?.type ||
      EntryValueType.Byte === this.entry().value?.type
    )
      this.isNumber = true;
    else if (EntryUnitType.Password === this.entry().value?.unitType) this.isPassword = true;
  }
}
