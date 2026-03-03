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
  private service = inject(NavigableEntryService);
  private route = inject(ActivatedRoute);
  private queryParamSubscription?: Subscription;

  queryParam = input<string | undefined>(undefined);
  disabled = input.required<boolean>();
  // id of the navigableEditor in order to be able to use several entry editors at the same time
  editorId = signal<number>(0);

  // External API - accepts plain Entry (two-way binding propagates changes)
  entry = model.required<Entry>();

  // Internal reactive wrapper (needed for navigation and change propagation)
  private _reactiveEntry = signal<ReactiveEntry | null>(null);

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
  }

  private setupQueryParamSubscription(): void {
    const qp = this.queryParam();
    if (!qp) {
      return;
    }

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

    const infos = this.service.entryEditorInformation.get(id);
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
    const rootRe = this._reactiveEntry();
    if (!rootRe || entryPath.length === 0) {
      return null;
    }

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
    this.refreshEntryInformation();
  }

  ngOnDestroy(): void {
    this.queryParamSubscription?.unsubscribe();
    this.service.signOut(this.editorId());
  }

  onNavigateSpecific(entry: Entry) {
    this.service.onNavigateToSpecificEntry(this.editorId(), entry);
  }
}
