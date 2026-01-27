import { Component, effect, input, model, signal, ViewEncapsulation } from '@angular/core';
import { Entry } from '../models/entry';
import { MatHint } from '@angular/material/form-field';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';

@Component({
  selector: 'entry-boolean-editor',
  templateUrl: './boolean-editor.html',
  styleUrls: ['./boolean-editor.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [CommonModule, MatHint, MatCheckbox, FormsModule, NgClass],
})
export class BooleanEditor {
  checked = signal<boolean>(false);
  name = signal<string>('');
  description = signal<string>('');

  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  constructor() {
    const reference = effect(() => {
      this.initialize(this.entry());
      reference.destroy();
    });
  }

  private initialize(entry: Entry) {
    const defaultChecked =
      (entry.value?.current ?? entry.value?.default)?.localeCompare('true', undefined, {
        sensitivity: 'base',
      }) === 0;
    this.checked.set(defaultChecked);
    this.description.set(entry.description ?? '');
    this.name.set(this.entry().displayName ?? '');
  }

  checkedUpdated(value: boolean) {
    this.checked.update(e => !e);
    this.entry.update(e => {
      let copy = Object.assign({}, e);
      copy.value.current = this.checked() + '';
      return copy;
    });
  }

  clickContainer(event: MouseEvent) {
    if (!this.disabled()) {
      this.checkedUpdated(!this.checked());
    }
  }
}
