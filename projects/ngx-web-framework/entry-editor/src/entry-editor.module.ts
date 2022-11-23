import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatListModule } from '@angular/material/list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule} from '@angular/material/button';
import { MatIconModule} from '@angular/material/icon';

import { EntryEditorComponent } from './entry-editor/entry-editor.component';
import { BooleanEditorComponent } from './boolean-editor/boolean-editor.component';
import { InputEditorComponent } from './input-editor/input-editor.component';
import { EnumEditorComponent } from './enum-editor/enum-editor.component';
import { NavigableEntryEditorComponent } from './navigable-entry-editor/navigable-entry-editor.component';
import { EntryObjectComponent } from './entry-object/entry-object.component';
import { FileEditorComponent } from './file-editor/file-editor.component';
import { EntryListItemComponent } from './entry-list-item/entry-list-item.component';



@NgModule({
  declarations: [
    EntryEditorComponent,
    BooleanEditorComponent,
    InputEditorComponent,
    EnumEditorComponent,
    FileEditorComponent,
    NavigableEntryEditorComponent,
    EntryObjectComponent,
    EntryListItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule, ReactiveFormsModule,
    MatListModule, MatFormFieldModule, MatInputModule, MatCheckboxModule, MatSelectModule, MatCardModule,
    MatButtonModule, MatIconModule
  ],
  exports: [
    EntryEditorComponent,
    NavigableEntryEditorComponent
  ]
})
export class EntryEditorModule { }
