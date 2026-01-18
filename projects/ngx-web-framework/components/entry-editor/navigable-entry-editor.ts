import { Component, OnDestroy, input, effect, model, signal, untracked } from '@angular/core';
import { Entry } from './models/entry';
import { NavigableEntryInformation, NavigableEntryService } from './services/navigable-entry.service';
import { EntryEditor } from './entry-editor';

@Component({
  selector: 'navigable-entry-editor',
  imports: [EntryEditor],
  templateUrl: './navigable-entry-editor.html',
  styleUrl: './navigable-entry-editor.scss',
})
export class NavigableEntryEditor implements OnDestroy {
  queryParam = input<string | undefined>(undefined);
  disabled = input.required<boolean>();
  //id of the navigableEditor in order to be able to use several entry editors at the same time
  editorId = signal<number>(0);

  entry = model.required<Entry>();

  entryInformation = signal<NavigableEntryInformation | undefined>(undefined);

  constructor(public service: NavigableEntryService) {
    effect(() => {
      // `this.entry()` is assigned to `entry` to make sure,
      // updates on it will be tracked and take 'effect'.

      const entry = Object.assign(this.entry());
      untracked(() => {
        this.update(entry, this.editorId());
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
