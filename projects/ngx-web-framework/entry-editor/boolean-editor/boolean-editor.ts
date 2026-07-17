import { Component, effect, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { Entry } from '../models/entry';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'entry-boolean-editor',
  templateUrl: './boolean-editor.html',
  styleUrls: ['./boolean-editor.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [MatCheckbox, FormsModule, MatIcon],
})
export class BooleanEditor {
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  protected checked = signal<boolean>(false);
  protected name = signal<string>('');
  protected description = signal<string>('');

  constructor() {
    // Todo: Replace effect with computed
    effect(() => {
      this.initialize(this.entry());
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

  private checkedUpdated(value: boolean) {
    this.checked.update(e => !e);
    this.entry.update(e => {
      let copy = Object.assign({}, e);
      copy.value.current = this.checked() + '';
      return copy;
    });
  }

  protected clickContainer(event: MouseEvent) {
    if (!this.disabled() && !(this.entry().value.isReadOnly ?? false)) {
      this.checkedUpdated(!this.checked());
    }
  }
}
