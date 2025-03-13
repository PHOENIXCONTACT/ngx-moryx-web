import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';
import { PrototypeToEntryConverter } from '../prototype-to-entry-converter';
import { UntypedFormControl } from '@angular/forms';
import { EntryUnitType } from '../models/entry-unit-type';

@Component({
  selector: 'entry-enum-editor',
  templateUrl: './enum-editor.component.html',
  styleUrls: ['./enum-editor.component.scss']
})
export class EnumEditorComponent implements OnInit {
  private _entry!: Entry;
  FormControl = new UntypedFormControl('');
  EntryUnitType = EntryUnitType;
  @Input() set entry(value: Entry) {
    this._entry = value;
    if (this._entry.value.unitType === EntryUnitType.Flags) {
      const list = value.value.current?.split(",").map(str => str.trim()) ?? [];
      this.FormControl.patchValue(list);
    }
    else {
      this.FormControl.patchValue(value.value.current);
    }

  }
  @Input() set disabled(value: boolean) {
    if (value || (this._entry.value.isReadOnly ?? false))
      this.FormControl.disable();
    else
      this.FormControl.enable();
  }

  constructor() { }

  get entry() {
    return this._entry;
  }

  ngOnInit(): void {
    this._entry.value.current = this._entry.value?.current ?? this._entry.value?.default;
  }
  
  changed(event: any) {
    if (this._entry.value.unitType === EntryUnitType.Flags)
      this._entry.value.current = this.FormControl.value?.join(",");
    else {
      this._entry.value.current = this.FormControl.value?.toString() ?? '';
    }
  }
}
