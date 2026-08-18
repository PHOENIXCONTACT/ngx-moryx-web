import { Component, effect, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
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

  protected timeValue = signal<string>('');

  constructor() {
    effect(() => {
      const entry = this.entry();
      const raw = entry.value?.current ?? entry.value?.default ?? '';
      // Strip fractional seconds from .NET formats like "14:30:00.0000000"
      this.timeValue.set(raw.split('.')[0]);
    });
  }

  protected onTimeChange(value: string) {
    this.timeValue.set(value);
    this.entry.update(e => {
      e.value.current = value || null;
      return { ...e };
    });
  }
}
