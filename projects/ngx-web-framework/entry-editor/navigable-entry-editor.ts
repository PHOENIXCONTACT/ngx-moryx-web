import { Component, OnDestroy, input, effect, model, signal, untracked, inject, computed } from '@angular/core';
import { Entry } from './models/entry';
import { ReactiveEntry } from './reactive-entry';
import { NavigableEntryService, NavigableEntryInformation } from './services/navigable-entry.service';
import { EntryEditor } from './entry-editor';

@Component({
  selector: 'navigable-entry-editor',
  imports: [EntryEditor],
  templateUrl: './navigable-entry-editor.html',
  styleUrl: './navigable-entry-editor.scss',
})
export class NavigableEntryEditor implements OnDestroy {
  private service = inject(NavigableEntryService);

  queryParam = input<string | undefined>(undefined);
  disabled = input.required<boolean>();
  // id of the navigableEditor in order to be able to use several entry editors at the same time
  editorId = signal<number>(0);

  // External API - accepts plain Entry
  entry = model.required<Entry>();

  // Internal reactive wrapper
  private _reactiveEntry = signal<ReactiveEntry | null>(null);

  entryInformation = signal<NavigableEntryInformation | undefined>(undefined);

  // Provide ReactiveEntry to template
  get reactiveEntry(): ReactiveEntry | null {
    return this._reactiveEntry();
  }

  // Computed: current ReactiveEntry from entry path for the current navigation position
  currentReactiveEntry = computed(() => {
    const info = this.entryInformation();
    if (!info?.currentEntry) {
      return null;
    }

    // Find the ReactiveEntry that corresponds to the current navigation entry
    return this.findReactiveEntryByPath(info.entryPath);
  });

  constructor() {
    effect(() => {
      // `this.entry()` is assigned to `entry` to make sure,
      // updates on it will be tracked and take 'effect'.
      const entry = this.entry();
      untracked(() => {
        // Convert Entry to ReactiveEntry
        const re = ReactiveEntry.fromEntry(entry);
        this._reactiveEntry.set(re);
        this.update(entry, this.editorId());
      });
    });
  }

  private findReactiveEntryByPath(entryPath: Entry[]): ReactiveEntry | null {
    const rootRe = this._reactiveEntry();
    if (!rootRe || entryPath.length === 0) return null;

    // Start from root and traverse down following the path
    let currentRe = rootRe;
    for (let i = 1; i < entryPath.length; i++) {
      const pathEntry = entryPath[i];
      const found = currentRe.subEntries().find(sub => sub.identifier === pathEntry.identifier);
      if (!found) {
        return null;
      }
      currentRe = found;
    }
    return currentRe;
  }

  private update(entry: Entry, editorId: number) {
    if (editorId !== 0) {
      this.service.signOut(editorId);
    }
    editorId = this.service.signIn(entry, this.queryParam());
    this.editorId.set(editorId);
    const infos = this.service.entryEditorInformation.get(editorId);

    if (!infos) {
      return;
    }
    this.entryInformation.set(infos);
  }

  ngOnDestroy(): void {
    this.service.signOut(this.editorId());
  }

  onNavigateSpecific(entry: Entry) {
    this.service.onNavigateToSpecificEntry(this.editorId(), entry);
  }
}
