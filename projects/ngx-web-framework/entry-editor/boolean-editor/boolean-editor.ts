import { Component, effect, input, signal, ViewEncapsulation } from '@angular/core';
import { ReactiveEntry } from '../reactive-entry';
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
  disabled = input<boolean>(false);
  reactiveEntry = input.required<ReactiveEntry>();

  checked = signal<boolean>(false);

  constructor() {
    const reference = effect(() => {
      this.initialize(this.reactiveEntry());
      reference.destroy();
    });
  }

  private initialize(reactiveEntry: ReactiveEntry) {
    const defaultChecked =
      (reactiveEntry.currentValue() ?? reactiveEntry.value.default)?.localeCompare('true', undefined, {
        sensitivity: 'base',
      }) === 0;
    this.checked.set(defaultChecked);
  }

  checkedUpdated(value: boolean) {
    this.checked.update(e => !e);
    this.reactiveEntry().setCurrentValue(this.checked() + '');
  }

  clickContainer(event: MouseEvent) {
    if (!this.disabled() && !this.reactiveEntry().value.isReadOnly) {
      this.checkedUpdated(!this.checked());
    }
  }
}
