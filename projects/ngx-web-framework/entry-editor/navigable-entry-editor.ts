import { Component, OnDestroy, input, model, inject, computed, WritableSignal, untracked, ChangeDetectionStrategy } from '@angular/core';
import { Entry } from './models/entry';
import { NavigableEntryService } from './services/navigable-entry.service';
import { MatChip, MatChipSet } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { EntryEditor } from './entry-editor';

@Component({
  selector: 'navigable-entry-editor',
  imports: [EntryEditor, MatChipSet, MatChip, MatIcon],
  templateUrl: './navigable-entry-editor.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './navigable-entry-editor.scss',
})
export class NavigableEntryEditor implements OnDestroy {
  private service = inject(NavigableEntryService);

  /** Optional query parameter name used to sync the navigation state with the URL. */
  queryParam = input<string | undefined>(undefined);

  /** Whether the editor and all its sub-editors are disabled. */
  disabled = input.required<boolean>();

  /** The root entry to display and edit. Changes are propagated back via two-way binding. */
  entry = model.required<Entry>();

  //id of the navigableEditor in order to be able to use several entry editors at the same time
  protected editorId = computed(() => {
    const queryParam = this.queryParam();
    return untracked(() => this.service.signIn(this.entry, queryParam));
  });

  protected entryInformation = computed(() => {
    const editorId = this.editorId();
    return untracked(() => this.service.entryEditorInformation.get(editorId));
  });

  protected onEntryChange(entry: Entry) {
    this.service.onEntryChange(this.editorId(), entry);
  }

  ngOnDestroy(): void {
    this.service.signOut(this.editorId());
  }

  protected onNavigateSpecific(entry: WritableSignal<Entry>) {
    this.service.onNavigateToSpecificEntry(this.editorId(), entry);
  }
}
