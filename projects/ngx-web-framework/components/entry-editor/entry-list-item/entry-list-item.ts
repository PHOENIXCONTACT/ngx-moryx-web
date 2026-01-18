import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';
import { FileEditor } from '../file-editor/file-editor';
import { EntryObject} from '../entry-object/entry-object';
import { BooleanEditor } from '../boolean-editor/boolean-editor';
import { InputEditor } from '../input-editor/input-editor';
import { EnumEditor } from '../enum-editor/enum-editor';
import { CommonModule } from '@angular/common';
import { MatLine } from '@angular/material/core';
import { MatIconButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'entry-list-item',
  imports: [
    FileEditor,
    EntryObject,
    BooleanEditor,
    InputEditor,
    EnumEditor,
    CommonModule,
    MatLine,
    MatIconButton,
    MatListModule,
  ],
  templateUrl: './entry-list-item.html',
  styleUrl: './entry-list-item.scss',
})
export class EntryListItem {
  entry = input.required<Entry>();
  editorId = input.required<number>();
  disabled = input<boolean>(false);
  @Output() deleteRequest: EventEmitter<Entry> = new EventEmitter<Entry>();
  isObjectType = computed(() => {
    return EntryValueType.Class === this.entry().value?.type || EntryValueType.Collection === this.entry().value?.type;
  });

  EntryValueType = EntryValueType;
  EntryUnitType = EntryUnitType;
  constructor() {}

  onDelete() {
    this.deleteRequest.emit(this.entry());
  }
}
