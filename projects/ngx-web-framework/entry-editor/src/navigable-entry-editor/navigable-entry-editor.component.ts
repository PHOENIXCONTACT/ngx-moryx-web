import { Component, OnInit, Input, OnDestroy, input, effect, model, signal, untracked } from '@angular/core';
import { Entry } from '../models/entry';
import { NavigableEntryInformation, NavigableEntryService } from '../services/navigable-entry.service';
import { EntryEditorComponent } from '../entry-editor/entry-editor.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'navigable-entry-editor',
  templateUrl: './navigable-entry-editor.component.html',
  styleUrls: ['./navigable-entry-editor.component.scss'],
  standalone: true,
  imports: [EntryEditorComponent, CommonModule],
})
export class NavigableEntryEditorComponent implements OnDestroy {
  queryParam = input<string | undefined>(undefined);
  disabled = input.required<boolean>();
  //id of the navigableEditor in order to be able to use several entry editors at the same time
  editorId = signal<number>(0);

  entry = model.required<Entry>();

  entryInformation = signal<NavigableEntryInformation | undefined>(undefined);

  constructor(public service: NavigableEntryService) {
    effect(() => {
      untracked(() => {
        this.update(this.entry(), this.editorId());
      });
    });
  }

  update(entry: Entry, editorId: number) {

    if (editorId !== 0) {
      this.service.signOut(editorId);
    }
    editorId = this.service.signIn(entry, this.queryParam());
    this.editorId.set(editorId);
    const infos = this.service.entryEditorInformation.get(editorId);

    if (!infos) return;
    this.entryInformation.set(infos);
  }

  ngOnDestroy(): void {
    this.service.signOut(this.editorId());
  }

  onNavigateSpecific(entry: Entry) {
    this.service.onNavigateToSpecificEntry(this.editorId(), entry);
  }
}
