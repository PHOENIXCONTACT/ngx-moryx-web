import { Component, effect, input, untracked } from '@angular/core';
import { ReactiveEntry } from '../reactive-entry';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { EntryUnitType } from '../models/entry-unit-type';

@Component({
  selector: 'entry-enum-editor',
  imports: [CommonModule, MatFormField, MatLabel, MatSelect, MatOption, FormsModule, ReactiveFormsModule, MatHint],
  templateUrl: './enum-editor.html',
  styleUrl: './enum-editor.scss',
})
export class EnumEditor {
  disabled = input<boolean>(false);
  reactiveEntry = input.required<ReactiveEntry>();
  formControl = new UntypedFormControl('');

  EntryUnitType = EntryUnitType;

  constructor() {
    effect(() => {
      const disabled = this.disabled();
      untracked(() => {
        const re = this.reactiveEntry();
        this.initialize(re, disabled);
      });
    });
  }

  private initialize(re: ReactiveEntry, disabled: boolean) {
    const entryValue = re.value;
    const value = entryValue.current ?? entryValue.default;

    if (entryValue.unitType === EntryUnitType.Flags) {
      const list = value?.split(',').map(str => str.trim()) ?? [];
      this.formControl.patchValue(list);
    } else {
      this.formControl.patchValue(value);
    }

    if (disabled || (entryValue.isReadOnly ?? false)) {
      this.formControl.disable();
    } else {
      this.formControl.enable();
    }
  }

  changed(event: any) {
    let newValue: string;

    if (Array.isArray(this.formControl.value) && this.formControl.value.length > 0) {
      newValue = this.formControl.value.join(',');
    } else if (typeof this.formControl.value === 'string' && this.formControl.value.trim().length > 0) {
      newValue = this.formControl.value;
    } else {
      console.warn('EnumEditor: No value selected, value is now set to 0');
      newValue = '0';
    }

    this.reactiveEntry().setCurrentValue(newValue);
  }
}
