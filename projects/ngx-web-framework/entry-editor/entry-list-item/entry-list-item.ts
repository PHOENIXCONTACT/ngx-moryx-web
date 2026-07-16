import { Component, EventEmitter, input, model, Output, ChangeDetectionStrategy } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';
import { FileEditor } from '../file-editor/file-editor';
import { EntryObject} from '../entry-object/entry-object';
import { BooleanEditor } from '../boolean-editor/boolean-editor';
import { InputEditor } from '../input-editor/input-editor';
import { EnumEditor } from '../enum-editor/enum-editor';
import { MatLine } from '@angular/material/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'entry-list-item',
  imports: [
    FileEditor,
    EntryObject,
    BooleanEditor,
    InputEditor,
    EnumEditor,
    MatLine,
    MatIconButton,
    MatIcon,
    MatListModule,
  ],
  templateUrl: './entry-list-item.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './entry-list-item.scss',
})
export class EntryListItem {
  entry = model.required<Entry>();
  editorId = input.required<number>();
  disabled = input<boolean>(false);
  @Output() deleteRequest: EventEmitter<Entry> = new EventEmitter<Entry>();

  EntryValueType = EntryValueType;

  onDelete() {
    this.deleteRequest.emit(this.entry());
  }
}
