import { Component, Input, OnInit, ViewEncapsulation } from '@angular/core';
import { Entry } from '../models/entry';

@Component({
    selector: 'entry-boolean-editor',
    templateUrl: './boolean-editor.component.html',
    styleUrls: ['./boolean-editor.component.scss'],
    encapsulation: ViewEncapsulation.None,
    standalone: false
})
export class BooleanEditorComponent {
  private _entry!: Entry;
  @Input() set entry(value: Entry) {
    this._entry = value;
    this._name = value.displayName ?? this._entry.identifier ?? ""
    this._description = value.description
    this._checked =
      (this.entry.value?.current ?? this.entry.value?.default)?.localeCompare('true', undefined, {
        sensitivity: 'base',
      }) === 0;
  }
  get entry(): Entry {
    return this._entry;
  }
  @Input() disabled: boolean = false;

  _name!: string;
  get name(): string {
    return this._name;
  }
  
  _description: string | null | undefined;
  get description(): string | null | undefined {
    return this._description;
  }

  _checked!: boolean;
  set checked(value: boolean) {
    this._checked = value;
    this._entry.value.current = value.toString();
  }
  get checked(): boolean {
    return this._checked;
  }

  constructor() {}

  clickContainer(event: MouseEvent) {
    if ((event.target as HTMLElement).nodeName == 'MAT-CHECKBOX' && !this.disabled) this.checked = !this.checked;
  }
}
