import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';
import { PrototypeToEntryConverter } from '../prototype-to-entry-converter';

@Component({
    selector: 'entry-enum-editor',
    templateUrl: './enum-editor.component.html',
    styleUrls: ['./enum-editor.component.scss'],
    standalone: false
})
export class EnumEditorComponent implements OnInit {
  private _entry!: Entry;
  @Input() set entry(value: Entry) {
    this._entry = value;
  }
  @Input() disabled: boolean = false;
  disableSetEntryType: boolean = false;

  constructor() {}

  get entry() {
    return this._entry;
  }

  ngOnInit(): void {
    this._entry.value.current = this._entry.value?.current ?? this._entry.value?.default;
  }

}
