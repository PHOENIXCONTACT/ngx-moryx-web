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
  @Input() set parent( parent: Entry | undefined){
    this._entry.parent = parent;
  }

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
    if (this.entry.parent) {
      entryType = this.entry.parent.value.type;
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

    if (!prototype || !this.entry.parent) return;

    const entryPrototype = PrototypeToEntryConverter.entryFromPrototype(prototype,this.entry.parent);
    entryPrototype.prototypes = JSON.parse(JSON.stringify(this.entry.prototypes));

    const subEntries: Entry[] = this.entry.parent?.subEntries ?? [];

    const idx =  subEntries.findIndex(x => x.identifier === this.entry.identifier);
    if (idx !== -1 && subEntries != undefined && subEntries != null) {
      subEntries[idx] = entryPrototype;
      this.entry.parent.value.current = entryPrototype.value.current;
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
