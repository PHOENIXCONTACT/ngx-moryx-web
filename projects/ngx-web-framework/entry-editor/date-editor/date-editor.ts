import { Component, computed, input, linkedSignal, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'entry-date-editor',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIcon,
    MatIconButton,
  ],
  templateUrl: './date-editor.html',
  styleUrl: './date-editor.scss',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DateEditor {
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  protected readOnly = computed(() => {
    return this.entry().value?.isReadOnly ?? false;
  });

  protected isDateTime = computed(() => {
    return this.entry().value?.type === EntryValueType.DateTime;
  });

  protected dateValue = linkedSignal<Entry, Date | null>({
    source: this.entry,
    computation: (entry) => {
      const raw = entry.value?.current ?? entry.value?.default ?? '';
      if (!raw) {
        return null;
      }
      return new Date(raw);
    },
  });

  protected timeValue = linkedSignal<Entry, string>({
    source: this.entry,
    computation: (entry) => {
      const raw = entry.value?.current ?? entry.value?.default ?? '';
      if (!raw) {
        return '';
      }
      const parsed = new Date(raw);
      return this.entry().value?.type === EntryValueType.DateTime
        ? parsed.toTimeString().slice(0, 8)
        : '';
    },
  });

  protected onDateChange(date: Date | null) {
    if (!date && this.entry().validation?.isRequired) {
      return;
    }
    this.dateValue.set(date);
    this.emitChange();
  }

  protected onTimeChange(value: string) {
    this.timeValue.set(value);
    this.emitChange();
  }

  private emitChange() {
    this.entry.update(e => {
      if (!this.dateValue()) {
        e.value.current = null;
      } else if (this.isDateTime()) {
        // Set local time — toISOString() converts back to UTC for the server
        const timeParts = (this.timeValue() || '00:00:00').split(':');
        const d = new Date(this.dateValue()!);
        d.setHours(parseInt(timeParts[0]) || 0);
        d.setMinutes(parseInt(timeParts[1]) || 0);
        d.setSeconds(parseInt(timeParts[2]) || 0);
        e.value.current = d.toISOString();
      } else {
        e.value.current = this.dateValue()!.toISOString().split('T')[0];
      }
      return { ...e };
    });
  }
}
