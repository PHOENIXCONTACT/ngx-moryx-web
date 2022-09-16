import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormControl, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Entry } from '../models/entry';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';
import { invalidEntryValueValidator } from '../validators/entry-editor.validators';

@Component({
  selector: 'entry-input-editor',
  templateUrl: './input-editor.component.html',
  styleUrls: ['./input-editor.component.scss']
})
export class InputEditorComponent implements OnInit, OnDestroy {

  @Input() entry!: Entry;
<<<<<<< HEAD
    
=======

>>>>>>> 41e4b613fbaf32a21863267a2ccfa845d153f97c
  private _disabled: boolean = false;

  @Input() set disabled(value: boolean) {
    this._disabled = value;
    if(value || this.entry.value?.isReadOnly)
      this.inputFormControl?.disable();
    else
      this.inputFormControl?.enable();
  }
  get disabled(): boolean { return this._disabled; }

  inputFormControl!: FormControl;
  private formControlSubscription?: Subscription;
  inputType!: string;

  constructor() { }
  ngOnInit(): void {
    this.inputType = this.determineInputType()

    // Set up validators
    var validators = [] as ValidatorFn[];
    validators.push(invalidEntryValueValidator(this.entry.value.type));
    if (this.entry.validation?.isRequired)
      validators.push(Validators.required);
    if (this.inputType == "number")
<<<<<<< HEAD
      this.addNumberValidators(validators);   
=======
      this.addNumberValidators(validators);
>>>>>>> 41e4b613fbaf32a21863267a2ccfa845d153f97c
    if (this.inputType == "text")
      this.addTextValidators(validators);

    // Set up form control
    this.inputFormControl = new FormControl(
      {
        value: this.entry.value?.current ??  this.entry.value?.default ?? '',
        disabled: this.disabled || (this.entry.value?.isReadOnly ?? false)
      }, validators);

    this.formControlSubscription = this.inputFormControl.valueChanges.subscribe(value => {
      if(this.inputFormControl.status == 'VALID')
        this.entry.value.current = value;
    });
  }
<<<<<<< HEAD
    
=======

>>>>>>> 41e4b613fbaf32a21863267a2ccfa845d153f97c
  ngOnDestroy(): void {
    this.formControlSubscription?.unsubscribe()
  }

<<<<<<< HEAD
  addTextValidators(validators: ValidatorFn[]) {     
    if (this.entry.validation?.regex)  
=======
  addTextValidators(validators: ValidatorFn[]) {
    if (this.entry.validation?.regex)
>>>>>>> 41e4b613fbaf32a21863267a2ccfa845d153f97c
      validators.push(Validators.pattern(this.entry.validation?.regex))
  }

  addNumberValidators(validators: ValidatorFn[]) {
<<<<<<< HEAD
    var typeSpecificMaximum = this.getTypeSpecificMaximum(this.entry.value?.type)     
=======
    var typeSpecificMaximum = this.getTypeSpecificMaximum(this.entry.value?.type)
>>>>>>> 41e4b613fbaf32a21863267a2ccfa845d153f97c
    var typeSpecificMinimum = this.getTypeSpecificMinimum(this.entry.value?.type)

    validators.push(Validators.max(Math.min(typeSpecificMaximum, this.entry.validation?.maximum ?? typeSpecificMaximum)));
    validators.push(Validators.min(Math.max(typeSpecificMinimum, this.entry.validation?.minimum ?? typeSpecificMinimum)));
  }

  getTypeSpecificMaximum(type: EntryValueType | undefined) : number {
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
<<<<<<< HEAD
        return 3.4*10^38;  
      case EntryValueType.Double:
        return Number.MAX_VALUE;      
=======
        return 3.4*10^38;
      case EntryValueType.Double:
        return Number.MAX_VALUE;
>>>>>>> 41e4b613fbaf32a21863267a2ccfa845d153f97c
      default:
        return 0;
    }
  }

  getTypeSpecificMinimum(type: EntryValueType | undefined) : number {
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
        return -3.4*10^38;
      case EntryValueType.Double:
        return -Number.MAX_VALUE;
      default:
        return 0;
    }
  }

  determineInputType() : string {
    if (EntryValueType.Int16 === this.entry.value?.type || EntryValueType.UInt16 === this.entry.value?.type ||
          EntryValueType.Int32 === this.entry.value?.type || EntryValueType.UInt32 === this.entry.value?.type ||
          EntryValueType.Int64 === this.entry.value?.type || EntryValueType.UInt64 === this.entry.value?.type ||
          EntryValueType.Single === this.entry.value?.type || EntryValueType.Double === this.entry.value?.type ||
          EntryValueType.Byte === this.entry.value?.type)
      return "number";
    else if (EntryUnitType.Password === this.entry.value?.unitType)
      return "password";
<<<<<<< HEAD
    else  
=======
    else
>>>>>>> 41e4b613fbaf32a21863267a2ccfa845d153f97c
      return "text";
  }
}
