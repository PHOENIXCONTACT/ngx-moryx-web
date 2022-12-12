import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EntryValueType } from '../models/entry-value-type';

export function invalidEntryValueValidator(entryType: EntryValueType | undefined): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const invalid = isInvalid(control.value, entryType);
    return invalid ? { invalidEntryValue: true } : null;
  };
}

export function isInvalid(value: any, entryType: EntryValueType | undefined): boolean {
  //integer, Single  Types
  if (
    entryType === EntryValueType.Int16 ||
    entryType === EntryValueType.Int32 ||
    entryType === EntryValueType.Int64
  ) {
    if (!Number.isInteger(Number(value))) return true;
  }
  //  Double types
  else if (entryType === EntryValueType.Double || entryType === EntryValueType.Single) {
    if (Number.isNaN(Number(value)) ) return true;
  }
  //Unsigned integers
  else if (
    entryType === EntryValueType.UInt16 ||
    entryType === EntryValueType.UInt32 ||
    entryType === EntryValueType.UInt64
  ) {
    if (!Number.isInteger(Number(value)) && !(Number(value) >= 0)) return true;
  }
  //boolean type
  else if (entryType === EntryValueType.Boolean) {
    if (!(typeof value === 'boolean')) return true;
  }

  return false;
}
