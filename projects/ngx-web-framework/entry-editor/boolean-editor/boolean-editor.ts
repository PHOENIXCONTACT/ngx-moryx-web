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
  checked = signal<boolean>(false);

  disabled = input<boolean>(false);
  reactiveEntry = input.required<ReactiveEntry>();

  constructor() {
    const reference = effect(() => {
      this.initialize(this.reactiveEntry());
      reference.destroy();
    });
  }

  private initialize(re: ReactiveEntry) {
    const entry = re.entry();
    const defaultChecked =
      (entry.value?.current ?? entry.value?.default)?.localeCompare('true', undefined, {
        sensitivity: 'base',
      }) === 0;
    this.checked.set(defaultChecked);
  }

  checkedUpdated(value: boolean) {
    this.checked.update(e => !e);
    this.reactiveEntry().setCurrent(this.checked() + '');
  }

  clickContainer(event: MouseEvent) {
    const re = this.reactiveEntry();
    if (!this.disabled() && !re.value?.isReadOnly) {
      this.checkedUpdated(!this.checked());
    }
  }
}
