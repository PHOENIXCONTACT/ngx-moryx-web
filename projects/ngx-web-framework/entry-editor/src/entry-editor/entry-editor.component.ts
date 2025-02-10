import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';
import { PrototypeToEntryConverter } from '../prototype-to-entry-converter';

@Component({
  selector: 'entry-editor',
  templateUrl: './entry-editor.component.html',
  styleUrls: ['./entry-editor.component.scss'],
})
export class EntryEditorComponent implements OnInit {

  @Input() editorId?:number;
  private _entry!: Entry;
  @Input() set entry(value: Entry) {
    this._entry = value;
    if(value.value.type == 'Collection'){
      this.possibleListItemTypes = value.value.possible;
      this.prototypes = value.prototypes;
      if(value.value.possible !== undefined && value.value.possible !== null && value.value.default !== null)
        this.selectedListItemType = value.value.default;
    }
  }
  
  get entry(): Entry {
    return this._entry;
  }
  @Input() disabled: boolean = false;
  @Input() createdCounter?: number;
  possibleListItemTypes: string []|undefined | null;
  selectedListItemType: string | undefined;
  prototypes: Entry[]| undefined | null;

  EntryValueType = EntryValueType;
  EntryUnitType = EntryUnitType;

  constructor() { }

  ngOnInit(): void {
  }

  onDeleteListItem(entry: Entry){
    if(this.entry.subEntries !== undefined && this.entry.subEntries !== null){
      var index = this.entry.subEntries.findIndex(c => c.identifier === entry.identifier);
      if (index > -1) {
        this.entry.subEntries.splice(index, 1);
      }
    }
  }

  addItemToList(){
    if(this.selectedListItemType && this.prototypes){
      for(var i=0; i<this.prototypes.length; i++){
        if(this.prototypes[i].value.type==EntryValueType.Class){
            var prototype = this.prototypes.find(x => x.identifier === this.selectedListItemType);
        }else {
          var prototype = this.prototypes.find(x => x.displayName === this.selectedListItemType)
        }
      }
      if(prototype){
        var entry = PrototypeToEntryConverter.cloneEntry(prototype);
        if(this.entry.subEntries && this.entry.subEntries.length > 0) {
          var last = this.entry.subEntries[this.entry.subEntries.length - 1];
          var count = /\d+/;
          var current = last.identifier ? Number(last.identifier.match(count)) : 0;
          this.createdCounter = current + 1;
        }
        else {
          this.createdCounter = 1;
        }
        if(this.createdCounter){
          entry.identifier = 'CREATED' + this.createdCounter;
          this.entry.subEntries?.push(entry);
        }
      }      
    }
  }

  isEntryTypeSettable(): boolean { 
    return this.entry?.value?.type === EntryValueType.Class &&
            this.entry.value.possible != null &&
            this.entry.value.possible.length > 1;
  }

  onPatchToSelectedEntryType(identifier: string): void {
    this.entry.subEntries = [];
        const prototype = this.entry?.prototypes?.find(
          (proto: Entry) => proto.displayName === identifier
        );

    if (!prototype) return;

    const entryPrototype = PrototypeToEntryConverter.entryFromPrototype(prototype);
    entryPrototype.prototypes = JSON.parse(JSON.stringify(this.entry.prototypes));
    entryPrototype.value.possible = this.entry.value.possible;
    entryPrototype.displayName = this.entry.displayName; 
    entryPrototype.identifier = this.entry.identifier; 
    Object.assign(this.entry, entryPrototype);
  }
}
