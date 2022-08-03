import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Entry } from '../models/entry';
import {
  NavigableEntryInformation,
  NavigableEntryService,
} from '../services/navigable-entry.service';

@Component({
  selector: 'navigable-entry-editor',
  templateUrl: './navigable-entry-editor.component.html',
  styleUrls: ['./navigable-entry-editor.component.scss'],
})
export class NavigableEntryEditorComponent implements OnInit, OnDestroy {
  @Input() queryParam?: string;
  @Input() disabled!: boolean;

  private _entry!: Entry;
  @Input() set entry(value: Entry) {
    this._entry = value;
    if (this.editorId !== 0) {
      this.service.signOut(this.editorId);
    }
    this.editorId = this.service.signIn(value, this.queryParam);
    const infos = this.service.entryEditorInformation.get(this.editorId);

    if (!infos) return;
    this.entryInformation = infos;
    this.createdCounter = 1;
  }

  get entry(): Entry {
    return this._entry;
  }

  //id of the navigableEditor in order to be able to use several entry editors at the same time
  public editorId: number = 0;
  public entryInformation: NavigableEntryInformation | undefined;
  createdCounter: number = 0;

  constructor(public service: NavigableEntryService) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.service.signOut(this.editorId);
  }

  onNavigateSpecific(entry: Entry) {
    this.service.onNavigateToSpecificEntry(this.editorId, entry);
  }
}
