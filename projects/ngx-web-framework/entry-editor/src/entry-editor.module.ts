import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';

import { BooleanEditorComponent } from './boolean-editor/boolean-editor.component';
import { EntryEditorComponent } from './entry-editor/entry-editor.component';
import { EntryListItemComponent } from './entry-list-item/entry-list-item.component';
import { EntryObjectComponent } from './entry-object/entry-object.component';
import { EnumEditorComponent } from './enum-editor/enum-editor.component';
import { FileEditorComponent } from './file-editor/file-editor.component';
import { InputEditorComponent } from './input-editor/input-editor.component';
import { NavigableEntryEditorComponent } from './navigable-entry-editor/navigable-entry-editor.component';
import { MoryxSelectComponent } from './moryx-select/moryx-select.component';

@NgModule({
  declarations: [
    EntryEditorComponent,
    BooleanEditorComponent,
    InputEditorComponent,
    EnumEditorComponent,
    FileEditorComponent,
    NavigableEntryEditorComponent,
    EntryObjectComponent,
    EntryListItemComponent,
    MoryxSelectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
  ],
  exports: [EntryEditorComponent, NavigableEntryEditorComponent,MoryxSelectComponent],
})
export class EntryEditorModule {}
