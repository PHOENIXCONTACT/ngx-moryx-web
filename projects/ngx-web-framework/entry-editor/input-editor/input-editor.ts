import { Component, effect, input, model, OnDestroy, signal, untracked } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Entry } from '../models/entry';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';
import {
  invalidEntryValueValidator,
  maxEntryValueValidator,
  minEntryValueValidator,
  parseCultureIndependentFloat
} from '../validators/entry-editor.validators';
import { CommonModule } from '@angular/common';
import { MatError, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';

// ToDo: Format file
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
  entry = model.required<Entry>();
  private readonly INLINE_INPUT_RANGE_THRESHOLD = 100;

  constructor() {
    this.inputFormControl = new UntypedFormControl();

    // One-time initialization assuming a different entry (by identifier not only reference) 
    // creates a new component instance.
    const reference = effect(() => {
      this.initialize(this.entry());
      reference.destroy();
    });

    // Entry initialization & updates on every ref change
    effect(() => {
      const entry = this.entry();
      
      untracked(() => {
        // ToDo: Check emitEvent
        if (this.isSinglePossibleValue(entry)) {
          const singlePossibleValue = entry.value?.possible?.[0]?.key ?? '';
          
          if (this.inputFormControl.value !== singlePossibleValue) {
            this.inputFormControl.setValue(singlePossibleValue, { emitEvent: false });
          }          

          if (entry.value?.current !== singlePossibleValue) {
            this.entry.update(e => { 
              e.value.current = singlePossibleValue;
              return { ...e };
            });
          }
        } else {
          // Sync Control with Entry-Value:
          if (this.isNumber) {
            const num = parseCultureIndependentFloat(entry.value?.current ?? null);
            const controlVal = this.inputFormControl.value;
            if ((num ?? null) !== (controlVal ?? null)) {
              this.inputFormControl.setValue(num, { emitEvent: false });
            }
          } else if (entry.value?.current !== this.inputFormControl.value) {
            this.inputFormControl.setValue(entry.value?.current ?? '', { emitEvent: false });
          }
        }
      });
    });

    effect(() => {
      this.disableInputFormControl(this.inputFormControl, this.disabled());
    });
  }

  private initialize(entry: Entry) {
    this.readOnly.set(
      entry.value?.isReadOnly || this.isSinglePossibleValue(entry) || entry.value.type === EntryValueType.Exception
    );

    this.determineInputType();

    const validators = this.setupValidators(entry);
    this.inputFormControl = this.setupFormControl(entry, validators);
  }

  // ToDo: Check if anything like C# out variable for function exists and use here
  isSinglePossibleValue(entry: Entry): boolean {
    const result = entry.value.possible && entry.value.possible.length === 1;
    return result ?? false;
  }

  disableInputFormControl(control: UntypedFormControl, disable: boolean) {
    if (disable) control.disable();
    else control.enable();
  }

  setupValidators(entry: Entry): ValidatorFn[] {
    var validators = [] as ValidatorFn[];
    validators.push(invalidEntryValueValidator(entry.value.type));
    if (entry.validation?.isRequired) validators.push(Validators.required);
    if (this.isNumber) this.addNumberValidators(validators);
    else this.addTextValidators(validators);

    return validators;
  }

  private setupFormControl(entry: Entry, validators: ValidatorFn[]): UntypedFormControl {
    // Initialvalue: for numbers parse culture independent 
    const rawInitial = entry.value?.current ?? entry.value?.default ?? '';
    let initialValue;
    if (this.isNumber) {
          const num = parseCultureIndependentFloat(rawInitial);
      initialValue = Number.isFinite(num as number) ? num : null;
    } else {
      initialValue = rawInitial;
    }


    const controlOptions: any = this.isNumber ? { validators, updateOn: 'blur' as const } : { validators };  
    const result = new UntypedFormControl(
      {
        value: initialValue,
        disabled: this.disabled() || (entry.value.isReadOnly ?? false),
      },
      controlOptions
    );

    this.formControlSubscription = result.valueChanges.subscribe(value => {
  if (result.status === 'VALID') {
    this.entry.update(e => {
      if (this.isNumber) {
        const num = typeof value === 'number' ? value : parseCultureIndependentFloat(value);
        e.value.current = (num != null && Number.isFinite(num as number)) ? String(num) : null;
      } else {
        e.value.current = value;
      }
      return { ...e };
    });
  } else if (this.isNumber) {
    // For number inputs (updateOn: 'blur'): log on blur when parsing fails (ignore empty)
    const num = typeof value === 'number' ? value : parseCultureIndependentFloat(value);
    const parseFailed = !(num != null && Number.isFinite(num as number));
    const isEmpty = value == null || String(value).trim() === '';
    if (parseFailed && !isEmpty) {
      console.warn('number_parse_failed', {
        field: this.entry().identifier ?? null,
        valueType: this.entry().value?.type ?? null,
      });
    }
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

  setTextArea(value: boolean) {
    this.useTextArea.set(value);
  }

  shouldUseSlider(): boolean {
    return this.defaultSliderCheck(this.entry());
  }

  private defaultSliderCheck(entryData: Entry): boolean {
    if (!this.isNumber) return false;
    const min = entryData.validation?.minimum;
    const max = entryData.validation?.maximum;
    if (min == null || max == null) return false;

    const typeMin = this.getTypeSpecificMinimum(entryData.value.type);
    const typeMax = this.getTypeSpecificMaximum(entryData.value.type);

    return min > typeMin || max < typeMax;
  }

  getSliderStep(): number {
    switch (this.entry().value.type) {
      case EntryValueType.Single:
      case EntryValueType.Double:
        return 0.1;
      default:
        return 1;
    }
  }

  private getRange(): number {
    const min = this.entry().validation?.minimum ?? 0;
    const max = this.entry().validation?.maximum ?? 0;
    return max - min;
  }

  private maxDigits(): number {
    const minAbs = Math.abs(this.entry().validation?.minimum ?? 0);
    const maxAbs = Math.abs(this.entry().validation?.maximum ?? 0);
    return Math.max(minAbs, maxAbs).toString().length;
  }

  shouldShowInlineInput(): boolean {
    return this.isNumber && (this.getRange() > this.INLINE_INPUT_RANGE_THRESHOLD || this.maxDigits() > 3);
  }
}