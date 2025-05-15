import { Component, effect, input, model, untracked } from '@angular/core';
import { Entry } from '../models/entry';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { EntryUnitType } from '../models/entry-unit-type';

@Component({
  selector: 'entry-enum-editor',
  templateUrl: './enum-editor.component.html',
  styleUrls: ['./enum-editor.component.scss'],
  standalone: true,
  imports: [CommonModule, MatFormField, MatLabel, MatSelect, MatOption, FormsModule, ReactiveFormsModule],
})
export class EnumEditorComponent {
  disabled = input<boolean>(false);
  entry = model.required<Entry>();
  FormControl = new UntypedFormControl('');

  constructor() {
    effect(() => {
      const disabled = this.disabled();
      untracked(() => {
        const entry = Object.assign(this.entry());
        this.initialize(entry, disabled);
      });
    });
  }

  initialize(entry: Entry, disabled: boolean) {
    this.entry.update(e => {
      if (entry.value.unitType === EntryUnitType.Flags) {
        const list = entry.value.current?.split(',').map(str => str.trim()) ?? [];
        this.FormControl.patchValue(list);
      } else {
        this.FormControl.patchValue(entry.value.current);
      }

      let copy = Object.assign({}, e);
      copy.value.current = entry.value?.current ?? entry.value?.default;
      return copy;
    });

    if (disabled || (entry.value.isReadOnly ?? false)) this.FormControl.disable();
    else this.FormControl.enable();
  }

  changed(event: any) {
    if (Array.isArray(this.FormControl.value) && this.FormControl.value.length > 0) {
      this.entry.update(e => {
        e.value.current = this.FormControl.value.join(",");
        return e;
      });
    } else if (typeof this.FormControl.value === 'string' && this.FormControl.value.trim().length > 0) {
      this.entry.update(e => {
        e.value.current = this.FormControl.value;
        return e;
      });
    } else {
      this.entry.update(e => {
        e.value.current = "0";
        return e;
      });
    }
  }

  isFlagEnum(): boolean {
    return this.entry().value.unitType === EntryUnitType.Flags
  }
}
