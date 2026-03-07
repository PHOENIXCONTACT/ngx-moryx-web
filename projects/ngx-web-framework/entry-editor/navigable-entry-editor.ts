import { Component, OnDestroy, input, model, inject, computed, WritableSignal, untracked } from '@angular/core';
import { Entry } from './models/entry';
import { NavigableEntryService } from './services/navigable-entry.service';
import { EntryEditor } from './entry-editor';

@Component({
  selector: 'navigable-entry-editor',
  imports: [EntryEditor],
  templateUrl: './navigable-entry-editor.html',
  styleUrl: './navigable-entry-editor.scss',
})
export class NavigableEntryEditor implements OnDestroy {
  private service = inject(NavigableEntryService);

  // ToDo: Add proper comments for public inputs
  queryParam = input<string | undefined>(undefined);
  disabled = input.required<boolean>();

  entry = model.required<Entry>();

  //id of the navigableEditor in order to be able to use several entry editors at the same time
  editorId = computed(() => {
    const queryParam = this.queryParam();
    return untracked(() => this.service.signIn(this.entry, queryParam));
  });

  entryInformation = computed(() => {
    const editorId = this.editorId();
    return untracked(() => this.service.entryEditorInformation.get(editorId));
  });
    
  onEntryChange(entry: Entry) {
    this.service.onEntryChange(this.editorId(), entry);
  }

  ngOnDestroy(): void {
    this.service.signOut(this.editorId());
  }

  onNavigateSpecific(entry: WritableSignal<Entry>) {
    this.service.onNavigateToSpecificEntry(this.editorId(), entry);
  }
}
