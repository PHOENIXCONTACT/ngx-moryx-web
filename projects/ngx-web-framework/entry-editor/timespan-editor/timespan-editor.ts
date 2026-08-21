import { Component, computed, input, linkedSignal, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Entry } from '../models/entry';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
import { TranslationConstants } from '../translation-constants';

@Component({
  selector: 'entry-timespan-editor',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIcon,
    TranslatePipe,
  ],
  templateUrl: './timespan-editor.html',
  styleUrl: './timespan-editor.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class TimeSpanEditor {
  protected TranslationConstants = TranslationConstants;
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  protected readOnly = computed(() => {
    return this.entry().value?.isReadOnly ?? false
  });

  // .NET TimeSpan formats: "HH:mm:ss", "d.HH:mm:ss", "d.HH:mm:ss.fffffff"
  protected days = linkedSignal<Entry, number>({
    source: this.entry,
    computation: (entry) => {
      const raw = entry.value?.current ?? entry.value?.default ?? '';
      const match = raw?.match(/^(?:(?<days>\d+)\.)?/);
      return parseInt(match?.groups?.['days'] ?? '0');
    },
  });

  protected timeValue = linkedSignal<Entry, string>({
    source: this.entry,
    computation: (entry) => {
      const raw = entry.value?.current ?? entry.value?.default ?? '';
      const match = raw?.match(/^(?:(?:\d+)\.)?(?<time>\d{1,2}:\d{2}:\d{2})/);
      return match?.groups?.['time'] ?? '00:00:00';
    },
  });

  private formatTimeSpan(): string {
    const d = this.days();
    const time = this.timeValue() || '00:00:00';
    return d > 0 ? `${d}.${time}` : time;
  }

  protected onTimeChange(value: string) {
    this.timeValue.set(value || '00:00:00');
    this.emitChange();
  }

  protected onDaysChange(value: number) {
    this.days.set(Math.max(0, value || 0));
    this.emitChange();
  }

  protected onDaysBlur(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.value) {
      input.value = '0';
    }
  }

  private emitChange() {
    const value = this.formatTimeSpan();
    this.entry.update(e => {
      e.value.current = value;
      return { ...e };
    });
  }
}
