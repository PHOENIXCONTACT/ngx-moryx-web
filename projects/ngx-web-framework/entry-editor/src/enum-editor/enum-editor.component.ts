import { Component, effect, input, model, } from '@angular/core';
import { Entry } from '../models/entry';
import { CommonModule } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'entry-enum-editor',
    templateUrl: './enum-editor.component.html',
    styleUrls: ['./enum-editor.component.scss'],
    standalone: true,
    imports:[CommonModule, MatFormField, MatLabel, MatSelect, MatOption, FormsModule]
})
export class EnumEditorComponent {
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  constructor() {
    const reference = effect(() => {
      this.initialize(this.entry());
      reference.destroy();
    });
  }

  initialize(entry: Entry) {
    this.entry.update(e => {
      let copy = Object.assign({}, e);
      copy.value.current = entry.value?.current ?? entry.value?.default;
      return copy;
    });
  }
}
