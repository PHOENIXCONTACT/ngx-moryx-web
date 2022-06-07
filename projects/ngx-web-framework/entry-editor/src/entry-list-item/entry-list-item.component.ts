import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryUnitType } from '../models/entry-unit-type';
import { EntryValueType } from '../models/entry-value-type';

@Component({
  selector: 'entry-list-item',
  templateUrl: './entry-list-item.component.html',
  styleUrls: ['./entry-list-item.component.scss']
})
export class EntryListItemComponent implements OnInit {
  @Input() entry!:Entry;
  @Input() disabled: boolean = false;
  @Output() deleteRequest: EventEmitter<Entry> = new EventEmitter<Entry>();

  EntryValueType = EntryValueType;
  EntryUnitType = EntryUnitType;
  constructor() { }

  ngOnInit(): void {
  }

  onDelete(){
    this.deleteRequest.emit(this.entry);
  }

}
