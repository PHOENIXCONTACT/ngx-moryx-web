import { Component, effect, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Entry } from '../models/entry';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'entry-timespan-editor',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
  ],
  templateUrl: './timespan-editor.html',
  styleUrl: './timespan-editor.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TimeSpanEditor {
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  protected days = signal(0);
  protected timeValue = signal('');
  protected readOnly = signal(false);

  constructor() {
    effect(() => {
      const entry = this.entry();
      this.readOnly.set(entry.value?.isReadOnly ?? false);
      const raw = entry.value?.current ?? entry.value?.default ?? '';
      this.parseTimeSpan(raw);
    });
  }

  // .NET TimeSpan formats: "HH:mm:ss", "d.HH:mm:ss", "d.HH:mm:ss.fffffff"
  private parseTimeSpan(raw: string) {
    const match = raw?.match(/^(?:(?<days>\d+)\.)?(?<time>\d{1,2}:\d{2}:\d{2})/);
    const { days, time } = match?.groups ?? {};

    this.days.set(parseInt(days ?? '0'));
    this.timeValue.set(time ?? '00:00:00');
  }

  private formatTimeSpan(): string {
    const d = this.days();
    const time = this.timeValue() || '00:00:00';
    return d > 0 ? `${d}.${time}` : time;
  }

  protected onTimeChange(value: string) {
    this.timeValue.set(value);
    this.emitChange();
  }

  protected onDaysChange(value: number) {
    this.days.set(Math.max(0, value || 0));
    this.emitChange();
  }

  private emitChange() {
    const value = this.formatTimeSpan();
    this.entry.update(e => {
      e.value.current = value;
      return { ...e };
    });
  }
}
