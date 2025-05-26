import { Component, computed, EventEmitter, input, Output } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';
import { FileEditorComponent } from '../file-editor/file-editor.component';
import { EntryObjectComponent } from '../entry-object/entry-object.component';
import { BooleanEditorComponent } from '../boolean-editor/boolean-editor.component';
import { InputEditorComponent } from '../input-editor/input-editor.component';
import { EnumEditorComponent } from '../enum-editor/enum-editor.component';
import { CommonModule } from '@angular/common';
import { MatLine } from '@angular/material/core';
import { MatDivider } from '@angular/material/divider';
import { MatIconButton } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';

@Component({
    selector: 'entry-list-item',
    templateUrl: './entry-list-item.component.html',
    styleUrls: ['./entry-list-item.component.scss'],
    standalone: true,
    imports: [FileEditorComponent, EntryObjectComponent, BooleanEditorComponent, InputEditorComponent, EnumEditorComponent, CommonModule, MatLine, MatDivider, MatIconButton, MatListModule]
})
export class EntryListItemComponent {
  entry = input.required<Entry>();
  editorId = input.required<number>();
  disabled = input<boolean>(false);
  @Output() deleteRequest: EventEmitter<Entry> = new EventEmitter<Entry>();
  isObjectType = computed(() => {
    return EntryValueType.Class === this.entry().value?.type || 
           EntryValueType.Collection === this.entry().value?.type
  })
  
  EntryValueType = EntryValueType;
  EntryUnitType = EntryUnitType;
  constructor() { }

  onDelete(){
    this.deleteRequest.emit(this.entry());
  }

}
