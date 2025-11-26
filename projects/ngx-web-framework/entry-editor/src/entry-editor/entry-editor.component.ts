import { Component, effect, input, Input, model, OnInit, signal, untracked } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryPossible } from '../models/entry-possible';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';
import { PrototypeToEntryConverter } from '../prototype-to-entry-converter';
import { BooleanEditorComponent } from '../boolean-editor/boolean-editor.component';
import { MatLineModule, MatOption } from '@angular/material/core';
import { CommonModule, NgClass, NgFor, NgIf, NgSwitch } from '@angular/common';
import { MatList } from '@angular/material/list';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormsModule, NgModel } from '@angular/forms';
import { EnumEditorComponent } from '../enum-editor/enum-editor.component';
import { InputEditorComponent } from '../input-editor/input-editor.component';
import { FileEditorComponent } from '../file-editor/file-editor.component';
import { EntryObjectComponent } from '../entry-object/entry-object.component';
import { EntryListItemComponent } from '../entry-list-item/entry-list-item.component';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'entry-editor',
  templateUrl: './entry-editor.component.html',
  styleUrls: ['./entry-editor.component.scss'],
  standalone: true,
  imports: [
    BooleanEditorComponent,
    EnumEditorComponent,
    InputEditorComponent,
    FileEditorComponent,
    EntryObjectComponent,
    EntryListItemComponent,
    MatLineModule,
    NgSwitch,
    NgIf,
    NgClass,
    MatList,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    NgFor,
    CommonModule,
    FormsModule,
    MatIconButton
  ],
})
export class EntryEditorComponent {
  editorId = input<number | undefined>(undefined);
  disabled = input<boolean>(false);
  
  entry = model.required<Entry>();
  currentEntry: Entry | undefined = undefined;
  subEntries = signal<Entry[]>([]);
  
  possibleListItemTypes = signal<EntryPossible[] | undefined | null>(undefined);
  prototypes = signal<Entry[]>([]);
  selectedListItemType = signal<string | undefined>(undefined);
  selectedEntryHasPrototypes = signal(true);
  
  private createdCounter?: number;
  
  constructor() {
    effect(() => {
      if(this.currentEntry !== this.entry() ){
        this.initialize(this.entry());
        this.currentEntry = this.entry();
      }
    });
  }

  initialize(entry: Entry) {
    this.subEntries.set(entry.subEntries ?? []);
    if (entry.value.type == 'Collection') {
      this.possibleListItemTypes.set(entry.value.possible);
      this.prototypes.set(entry.prototypes ?? []);
      if (entry.value.possible !== undefined && entry.value.possible !== null && entry.value.default !== null) {
        this.selectedListItemType.set(entry.value.default);
      }
    }
  }
  

  EntryValueType = EntryValueType;
  EntryUnitType = EntryUnitType;

  onDeleteListItem(toBeDeleted: Entry) {
    const entry = this.entry();
    
    if (entry.subEntries !== undefined && entry.subEntries !== null) {
      var index = entry.subEntries.findIndex(c => c.identifier === toBeDeleted.identifier);
      if (index > -1) {
        entry.subEntries.splice(index, 1);
        this.entry.update(_ => entry);
      }
    }
  }

  addItemToList() {
    const prototypes = this.prototypes();

    if (this.selectedListItemType() && prototypes) {
      for (var i = 0; i < prototypes.length; i++) {
        if (prototypes[i].value.type == EntryValueType.Class) {
          var prototype = prototypes.find(x => x.identifier === this.selectedListItemType());
        } else {
          var prototype = prototypes.find(x => x.displayName === this.selectedListItemType());
        }
      }
      if (prototype) {
        const currentEntry = this.entry();
        var entry = PrototypeToEntryConverter.cloneEntry(prototype);
        if (currentEntry.subEntries && currentEntry.subEntries.length > 0) {
          var last = currentEntry.subEntries[currentEntry.subEntries.length - 1];
          var count = /\d+/;
          var current = last.identifier ? Number(last.identifier.match(count)) : 0;
          this.createdCounter = current + 1;
        } else {
          this.createdCounter = 1;
        }
        if (this.createdCounter) {
          entry.identifier = 'CREATED' + this.createdCounter;
          currentEntry.subEntries?.push(entry);
          this.entry.update(_ => currentEntry);
        }
      }
    }
  }

  isEntryTypeSettable(entry: Entry): boolean {
    return  entry?.value?.type === EntryValueType.Class &&
            entry.value.possible != null &&
            entry.value.possible.length > 1;
  }

  onPatchToSelectedEntryType(identifier: string): void {
    const entry = this.entry();

    entry.subEntries = [];
        const prototype = entry?.prototypes?.find(
          (proto: Entry) => proto.displayName === identifier
        );
    if (!prototype) {
      this.selectedEntryHasPrototypes.update(_ => false);
      return;
    }
    const entryPrototype = PrototypeToEntryConverter.entryFromPrototype(prototype);
    entryPrototype.prototypes = JSON.parse(JSON.stringify(entry.prototypes));
    entryPrototype.value.possible = entry.value.possible;
    entryPrototype.displayName = entry.displayName;
    entryPrototype.identifier = entry.identifier;
    this.selectedEntryHasPrototypes.update(_ => true);
    this.entry.update(_ => entryPrototype);
  }

  dropdownSelectionChanged(event: MatSelectChange){
    this.onPatchToSelectedEntryType(event.value);
  }

  isPrimitiveType(entry: Entry){
    return (entry.value.possible && entry.value.possible.length === 1) ||
      (((entry.value.possible && entry.value.possible.length < 1) || !entry.value.possible)  &&
      (EntryValueType.Byte === entry.value?.type ||
      EntryValueType.Int16 === entry.value?.type ||
      EntryValueType.UInt16 === entry.value?.type ||
      EntryValueType.Int32 === entry.value?.type ||
      EntryValueType.UInt32 === entry.value?.type ||
      EntryValueType.Int64 === entry.value?.type ||
      EntryValueType.UInt64 === entry.value?.type ||
      EntryValueType.Single === entry.value?.type ||
      EntryValueType.Double === entry.value?.type ||
      EntryValueType.String === entry.value?.type ||
      EntryValueType.Exception === entry.value?.type))
  }
}
