import { Component, effect, input, OnDestroy, signal } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ReactiveEntry } from '../reactive-entry';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';
import {
  invalidEntryValueValidator,
  maxEntryValueValidator,
  minEntryValueValidator,
} from '../validators/entry-editor.validators';
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

@Component({
  selector: 'entry-input-editor',
  imports: [
    CommonModule,
    FormsModule,
    MatError,
    MatLabel,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatSliderModule,
  ],
  templateUrl: './input-editor.html',
  styleUrl: './input-editor.scss',
})
export class InputEditor implements OnDestroy {
  inputFormControl!: UntypedFormControl;
  private formControlSubscription?: Subscription;
  isPassword!: boolean;
  isNumber!: boolean;
  useTextArea = signal(false);
  readOnly = signal<boolean>(false);
  disabled = input<boolean>(false);
  reactiveEntry = input.required<ReactiveEntry>();
  private readonly INLINE_INPUT_RANGE_THRESHOLD = 100;

  constructor() {
    this.inputFormControl = new UntypedFormControl();
    const reference = effect(() => {
      this.initialize(this.reactiveEntry());
      reference.destroy();
    });

    effect(() => {
      this.disableInputFormControl(this.inputFormControl, this.disabled());
    });
  }

  private initialize(re: ReactiveEntry) {
    const entryValue = re.value;
    this.readOnly.set(
      entryValue.isReadOnly || this.isSinglePossibleValue(re) || entryValue.type === EntryValueType.Exception
    );
    this.updateCurrentValue(re, entryValue.current);
    this.determineInputType(re);

    const validators = this.setupValidators(re);
    this.inputFormControl = this.setupFormControl(re, validators);
  }

  private updateCurrentValue(re: ReactiveEntry, value: any) {
    const entryValue = re.value;
    const newValue = this.isSinglePossibleValue(re)
      ? (entryValue.possible?.[0]?.key ?? '')
      : value ?? entryValue.default;

    re.setCurrentValue(newValue);
  }

  isSinglePossibleValue(re: ReactiveEntry): boolean {
    const result = re.value.possible && re.value.possible.length === 1;
    return result ?? false;
  }

  disableInputFormControl(control: UntypedFormControl, disable: boolean) {
    if (disable) {
      control.disable();
    }
    else {
      control.enable();
    }
  }

  setupValidators(re: ReactiveEntry): ValidatorFn[] {
    let validators = [] as ValidatorFn[];
    validators.push(invalidEntryValueValidator(re.value.type));

    if (re.validation?.isRequired) {
      validators.push(Validators.required);
    }

    if (this.isNumber) {
      this.addNumberValidators(validators, re);
    } else {
      this.addTextValidators(validators, re);
    }

    return validators;
  }

  private setupFormControl(re: ReactiveEntry, validators: ValidatorFn[]): UntypedFormControl {
    const entryValue = re.value;
    const result = new UntypedFormControl(
      {
        value: entryValue.current ?? entryValue.default ?? '',
        disabled: this.disabled() || (entryValue.isReadOnly ?? false),
      },
      validators
    );

    this.formControlSubscription = result.valueChanges.subscribe(value => {
      if (result.status == 'VALID') {
        this.updateCurrentValue(this.reactiveEntry(), value);
      }
    });

    return result;
  }

  ngOnDestroy(): void {
    this.formControlSubscription?.unsubscribe();
  }

  addTextValidators(validators: ValidatorFn[], re: ReactiveEntry) {
    const regex = re.validation?.regex;
    if (regex) {
      validators.push(Validators.pattern(regex));
    }
  }

  addNumberValidators(validators: ValidatorFn[], re: ReactiveEntry) {
    const typeSpecificMaximum = this.getTypeSpecificMaximum(re.value.type);
    const typeSpecificMinimum = this.getTypeSpecificMinimum(re.value.type);

    validators.push(
      maxEntryValueValidator(Math.min(typeSpecificMaximum, re.validation?.maximum ?? typeSpecificMaximum))
    );
    validators.push(
      minEntryValueValidator(Math.max(typeSpecificMinimum, re.validation?.minimum ?? typeSpecificMinimum))
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

  determineInputType(re: ReactiveEntry) {
    const value = re.value;
    if (
      EntryValueType.Int16 === value?.type ||
      EntryValueType.UInt16 === value?.type ||
      EntryValueType.Int32 === value?.type ||
      EntryValueType.UInt32 === value?.type ||
      EntryValueType.Int64 === value?.type ||
      EntryValueType.UInt64 === value?.type ||
      EntryValueType.Single === value?.type ||
      EntryValueType.Double === value?.type ||
      EntryValueType.Byte === value?.type
    )
      this.isNumber = true;
    else if (EntryUnitType.Password === value?.unitType) this.isPassword = true;
  }

  setTextArea(value: boolean) {
    this.useTextArea.set(value);
  }

  shouldUseSlider(): boolean {
    return this.defaultSliderCheck(this.reactiveEntry());
  }

  private defaultSliderCheck(re: ReactiveEntry): boolean {
    if (!this.isNumber) {
      return false;
    }

    const min = re.validation?.minimum;
    const max = re.validation?.maximum;

    if (min == null || max == null) {
      return false;
    }

    const typeMin = this.getTypeSpecificMinimum(re.value.type);
    const typeMax = this.getTypeSpecificMaximum(re.value.type);

    return min > typeMin || max < typeMax;
  }

  getSliderStep(): number {
    switch (this.reactiveEntry().value.type) {
      case EntryValueType.Single:
      case EntryValueType.Double:
        return 0.1;
      default:
        return 1;
    }
  }

  private getRange(): number {
    const re = this.reactiveEntry();
    const min = re.validation?.minimum ?? 0;
    const max = re.validation?.maximum ?? 0;

    return max - min;
  }

  private maxDigits(): number {
    const re = this.reactiveEntry();
    const minAbs = Math.abs(re.validation?.minimum ?? 0);
    const maxAbs = Math.abs(re.validation?.maximum ?? 0);

    return Math.max(minAbs, maxAbs).toString().length;
  }

  shouldShowInlineInput(): boolean {
    return this.isNumber && (this.getRange() > this.INLINE_INPUT_RANGE_THRESHOLD || this.maxDigits() > 3);
  }
}
