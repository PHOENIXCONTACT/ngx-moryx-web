import { Component, computed, input, linkedSignal, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Entry } from '../models/entry';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'entry-time-editor',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
  templateUrl: './time-editor.html',
  styleUrl: './time-editor.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TimeEditor {
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  protected readOnly = computed(() => {
    return this.entry().value?.isReadOnly ?? false
  });

  protected timeValue = linkedSignal<Entry, string>({
    source: this.entry,
    computation: (entry) => {
      const raw = entry.value?.current ?? entry.value?.default ?? '';
      // Strip fractional seconds from .NET formats like "14:30:00.0000000"
      return raw.split('.')[0];
    },
  });

  protected onTimeChange(value: string) {
    this.timeValue.set(value);
    this.entry.update(e => {
      e.value.current = value;
      return { ...e };
    });
  }
}
