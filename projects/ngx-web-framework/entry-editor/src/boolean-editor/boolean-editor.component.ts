import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Entry } from '../models/entry';

@Component({
  selector: 'entry-boolean-editor',
  templateUrl: './boolean-editor.component.html',
  styleUrls: ['./boolean-editor.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class BooleanEditorComponent implements OnInit {

  private _entry!: Entry;
  @Input() set entry(value: Entry) {
    this._entry = value;
    this._checked = "True" === (this.entry.value?.current ?? this.entry.value?.default);
  }
  get entry(): Entry {
    return this._entry;
  }
  @Input() disabled: boolean = false;

  _checked!: boolean;
  set checked(value: boolean) {
    this._checked = value;
    this._entry.value.current = value.toString();
  }
  get checked(): boolean {
    return this._checked;
  }

  constructor() { }

  ngOnInit(): void {
  }

  clickContainer(event: MouseEvent) {
    if((event.target as HTMLElement).nodeName == "MAT-CHECKBOX" && !this.disabled)
      this.checked = !this.checked;
  }
}
