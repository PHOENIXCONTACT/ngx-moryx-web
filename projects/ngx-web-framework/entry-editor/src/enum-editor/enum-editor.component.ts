import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';
import { PrototypeToEntryConverter } from '../prototype-to-entry-converter';

@Component({
  selector: 'entry-enum-editor',
  templateUrl: './enum-editor.component.html',
  styleUrls: ['./enum-editor.component.scss']
})
export class EnumEditorComponent implements OnInit {
  private _entry!: Entry;
  @Input() set entry(value: Entry) {
    this._entry = value;
  }
  @Input() disabled: boolean = false;
  @Input() parent: Entry | undefined;
  disableSetEntryType: boolean = false;

  constructor() {}

  get entry() {
    return this._entry;
  }

  ngOnInit(): void {
    this._entry.value.current = this._entry.value?.current ?? this._entry.value?.default;
  }
  
  onPatchToSelectedEntryType(): void {
    let prototype: Entry | undefined;
    let entryType: EntryValueType | undefined = EntryValueType.Class;
    if (this.parent) {
      entryType = this.parent.value.type;
    }

    switch (entryType) {
      case EntryValueType.Class:
        prototype = this.entry?.prototypes?.find(
          (proto: Entry) => proto.displayName === this.entry.value.current
        );
        break;
      default:
        return;
    }

    if (!prototype || !this.parent) return;

    const entryPrototype = PrototypeToEntryConverter.entryFromPrototype(prototype);
    entryPrototype.prototypes = JSON.parse(JSON.stringify(this.entry.prototypes));
    entryPrototype.displayName = this._entry.displayName; 
    entryPrototype.identifier = this._entry.identifier; 

    const subEntries: Entry[] = this.parent?.subEntries ?? [];

    const idx =  subEntries.findIndex(x => x.identifier === this.entry.identifier);
    if (idx !== -1 && subEntries != undefined && subEntries != null) {
      subEntries[idx] = entryPrototype;
    }
  }

  isEntryTypeSettable(): boolean {
    if (this.entry === null || this.entry === undefined) {
      return false;
    }

    let isEntrySettable = this.entry.value.type === EntryValueType.Class &&
    this.entry.value.possible != null &&
    this.entry.value.possible.length > 1;

    if (isEntrySettable) {
        isEntrySettable = this.parent?.value.type !== EntryValueType.Collection;
    }
    return isEntrySettable;
  }
}
