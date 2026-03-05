import { Component, OnDestroy, input, effect, model, signal, untracked, inject, computed } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
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
  private navigableEntryService = inject(NavigableEntryService);
  private route = inject(ActivatedRoute);
  private queryParamSubscription?: Subscription;

  queryParam = input<string | undefined>(undefined);
  disabled = input.required<boolean>();

  // External API - accepts plain Entry (two-way binding propagates changes)
  entry = model.required<Entry>();

  // Id of the navigableEditor in order to be able to use several entry editors at the same time
  editorId = signal<number>(0);

  // Internal reactive wrapper (needed for navigation and change propagation)
  private _reactiveEntry = signal<ReactiveEntry | null>(null);

  // Track which ReactiveEntry instance we haveve seen and its last synced version
  private lastSyncedReactiveEntry: ReactiveEntry | null = null;
  private lastSyncedVersion = 0;

  entryInformation = signal<NavigableEntryInformation | undefined>(undefined);

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
    // Initialize ReactiveEntry when entry changes from outside
    effect(() => {
      const entry = this.entry();
      untracked(() => {
        const re = ReactiveEntry.fromEntry(entry);
        this._reactiveEntry.set(re);
        this.update(entry, this.editorId());
        this.setupQueryParamSubscription();
      });
    });

    // Watch for changes in ReactiveEntry and sync back to entry model
    effect(() => {
      const re = this._reactiveEntry();
      if (!re) {
        return;
      }

      const version = re.version();

      // If this is a new ReactiveEntry instance, record it and skip initial sync
      if (re !== this.lastSyncedReactiveEntry) {
        this.lastSyncedReactiveEntry = re;
        this.lastSyncedVersion = version;
        return;
      }

      // Only sync when version has increased (actual mutation occurred)
      if (version <= this.lastSyncedVersion) return;

      // Read the changed signal - this creates the dependency
      const changedEntry = re.changed();

      untracked(() => {
        // Track that we've synced this version
        this.lastSyncedVersion = version;
        // Sync back to entry model
        this.entry.set(changedEntry);
      });
    });
  }

  private setupQueryParamSubscription(): void {
    // Unsubscribe from previous subscription
    this.queryParamSubscription?.unsubscribe();

    // Subscribe to query param changes to detect navigation
    this.queryParamSubscription = this.route.queryParams.subscribe(() => {
      this.refreshEntryInformation();
    });
  }

  private refreshEntryInformation(): void {
    const id = this.editorId();
    if (id === 0) {
      return;
    }

    const infos = this.navigableEntryService.entryEditorInformation.get(id);
    if (!infos) {
      return;
    }

    // Create a new object reference to trigger signal update
    this.entryInformation.set({
      entryPath: [...infos.entryPath],
      currentEntry: infos.currentEntry
    });
  }

  private findReactiveEntryByPath(entryPath: Entry[]): ReactiveEntry | null {
    const rootReactiveEntry = this._reactiveEntry();
    if (!rootReactiveEntry || entryPath.length === 0) {
      return null;
    }

    // Start from root and traverse down following the path
    let current = rootReactiveEntry;
    for (let i = 1; i < entryPath.length; i++) {
      const pathEntry = entryPath[i];
      const found = current.subEntries().find(sub => sub.identifier === pathEntry.identifier);
      if (!found) {
        return null;
      }
      current = found;
    }
    return current;
  }

  private update(entry: Entry, editorId: number) {
    if (editorId !== 0) {
      this.navigableEntryService.signOut(editorId);
    }
    editorId = this.navigableEntryService.signIn(entry, this.queryParam());
    this.editorId.set(editorId);
    this.refreshEntryInformation();
  }

  ngOnDestroy(): void {
    this.queryParamSubscription?.unsubscribe();
    this.navigableEntryService.signOut(this.editorId());
  }

  onNavigateSpecific(entry: Entry) {
    this.navigableEntryService.onNavigateToSpecificEntry(this.editorId(), entry);
  }
}
