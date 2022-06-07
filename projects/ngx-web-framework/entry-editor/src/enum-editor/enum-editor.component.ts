import { Component, Input, OnInit } from '@angular/core';
import { Entry } from '../models/entry';

@Component({
  selector: 'entry-enum-editor',
  templateUrl: './enum-editor.component.html',
  styleUrls: ['./enum-editor.component.scss']
})
export class EnumEditorComponent implements OnInit {

  @Input() entry!: Entry;
  @Input() disabled: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.entry.value.current = this.entry.value?.current ?? this.entry.value?.default;
  }
}
