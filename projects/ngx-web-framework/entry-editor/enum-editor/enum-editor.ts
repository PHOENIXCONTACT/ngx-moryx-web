import { Component, effect, input, model, untracked, ChangeDetectionStrategy } from '@angular/core';
import { Entry } from '../models/entry';
import { MatFormField, MatHint, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { EntryUnitType } from '../models/entry-unit-type';

@Component({
  selector: 'entry-enum-editor',
  imports: [MatFormField, MatLabel, MatSuffix, MatSelect, MatOption, FormsModule, ReactiveFormsModule, MatIcon, MatHint],
  templateUrl: './enum-editor.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './enum-editor.scss',
})
export class EnumEditor {
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  protected formControl = new UntypedFormControl('');

  constructor() {
    effect(() => {
      const disabled = this.disabled();
      untracked(() => {
        const entry = Object.assign(this.entry());
        this.initialize(entry, disabled);
      });
    });
  }

  private initialize(entry: Entry, disabled: boolean) {
    this.entry.update(e => {
      const value = entry.value?.current ?? entry.value?.default;
      if (entry.value.unitType === EntryUnitType.Flags) {
        const list = value?.split(',').map(str => str.trim()) ?? [];
        this.formControl.patchValue(list);
      } else {
        this.formControl.patchValue(value);
      }

      let copy = Object.assign({}, e);
      copy.value.current = value;
      return copy;
    });

    if (disabled) this.formControl.disable();
    else this.formControl.enable();
  }

  protected changed(event: any) {
    if (this.entry().value.isReadOnly) return;
    if (Array.isArray(this.formControl.value) && this.formControl.value.length > 0) {
      this.entry.update(e => {
        e.value.current = this.formControl.value.join(",");
        return e;
      });
    } else if (typeof this.formControl.value === 'string' && this.formControl.value.trim().length > 0) {
      this.entry.update(e => {
        e.value.current = this.formControl.value;
        return e;
      });
    } else {
      console.warn("EnumEditor: No value selected, value is now set to 0");
      this.entry.update(e => {
        e.value.current = "0";
        return e;
      });
    }
  }

  protected isFlagEnum(): boolean {
    return this.entry().value.unitType === EntryUnitType.Flags
  }
}
