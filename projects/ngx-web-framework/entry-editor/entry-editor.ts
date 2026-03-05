import { Component, effect, input, model, signal, untracked } from '@angular/core';
import { Entry } from './models/entry';
import { ReactiveEntry } from './reactive-entry';
import { EntryPossible } from './models/entry-possible';
import { EntryValueType } from './models/entry-value-type';
import { PrototypeToEntryConverter } from './prototype-to-entry-converter';
import { BooleanEditor } from './boolean-editor/boolean-editor';
import { MatLineModule, MatOption } from '@angular/material/core';
import { CommonModule, NgClass } from '@angular/common';
import { MatList } from '@angular/material/list';
import { MatFormField, MatLabel, MatHint } from '@angular/material/form-field';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { EnumEditor } from './enum-editor/enum-editor';
import { InputEditor } from './input-editor/input-editor';
import { FileEditor } from './file-editor/file-editor';
import { EntryObject } from './entry-object/entry-object';
import { EntryListItem } from './entry-list-item/entry-list-item';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'entry-editor',
  imports: [
    BooleanEditor,
    EnumEditor,
    InputEditor,
    FileEditor,
    EntryObject,
    EntryListItem,
    MatLineModule,
    NgClass,
    MatList,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    CommonModule,
    FormsModule,
    MatIconButton,
    MatHint
  ],
  templateUrl: './entry-editor.html',
  styleUrl: './entry-editor.scss',
})
export class EntryEditor {
  editorId = input<number | undefined>(undefined);
  disabled = input<boolean>(false);

  // Standalone mode: plain Entry
  entry = model<Entry | undefined>(undefined);

  // Wrapped mode: ReactiveEntry from NavigableEntryEditor
  reactiveEntry = input<ReactiveEntry | undefined>(undefined);

  // Re-exports for template access
  EntryValueType = EntryValueType;

  // Unified internal signal for sub-components
  private _re = signal<ReactiveEntry | null>(null);

  // Track the last processed entry to avoid redundant conversions
  private _lastEntryRef: Entry | undefined = undefined;

  possibleListItemTypes = signal<EntryPossible[] | undefined | null>(undefined);
  prototypes = signal<Entry[]>([]);
  selectedListItemType = signal<string | undefined>(undefined);
  selectedEntryHasPrototypes = signal(true);

  private createdCounter?: number;

  // Expose for template
  get re(): ReactiveEntry | null {
    return this._re();
  }

  constructor() {
    // Existing effect for initialization
    effect(() => {
      const reactiveInput = this.reactiveEntry();
      const entryInput = this.entry();

      untracked(() => {
        if (reactiveInput) {
          // Wrapped mode - use provided ReactiveEntry
          this._re.set(reactiveInput);
          this.initializeFromReactiveEntry(reactiveInput);
        } else if (entryInput && entryInput !== this._lastEntryRef) {
          // Standalone mode - convert Entry to ReactiveEntry
          this._lastEntryRef = entryInput;
          const re = ReactiveEntry.fromEntry(entryInput);
          this._re.set(re);
          this.initializeFromReactiveEntry(re);
        }
      });
    });

    // Sync changes back to entry model (standalone mode only)
    effect(() => {
      const reactiveInput = this.reactiveEntry();
      const re = this._re();

      // Only sync in standalone mode (no reactiveEntry input)
      if (reactiveInput || !re) {
        return;
      }

      const changedEntry = re.changed();

      untracked(() => {
        this._lastEntryRef = changedEntry;
        this.entry.set(changedEntry);
      });
    });
  }

  private initializeFromReactiveEntry(re: ReactiveEntry) {
    const entry = re.entry();
    if (entry.value.type == 'Collection') {
      this.possibleListItemTypes.set(entry.value.possible);
      this.prototypes.set(entry.prototypes ?? []);
      if (entry.value.possible !== undefined && entry.value.possible !== null && entry.value.default !== null) {
        this.selectedListItemType.set(entry.value.default);
      }
    }
  }

  onDeleteListItem(toBeDeleted: ReactiveEntry) {
    const re = this._re();
    if (re && toBeDeleted.identifier) {
      re.removeSubEntry(toBeDeleted.identifier);
    }
  }

  addItemToList() {
    const re = this._re();
    if (!re) return;

    const prototypes = this.prototypes();

    if (this.selectedListItemType() && prototypes) {
      let prototype: Entry | undefined;
      for (let i = 0; i < prototypes.length; i++) {
        if (prototypes[i].value.type == EntryValueType.Class) {
          prototype = prototypes.find(x => x.identifier === this.selectedListItemType());
        } else {
          prototype = prototypes.find(x => x.displayName === this.selectedListItemType());
        }
      }
      if (prototype) {
        const entry = PrototypeToEntryConverter.cloneEntry(prototype);
        const currentSubEntries = re.subEntries();
        if (currentSubEntries && currentSubEntries.length > 0) {
          const last = currentSubEntries[currentSubEntries.length - 1];
          const count = /\d+/;
          const current = last.identifier ? Number(last.identifier.match(count)) : 0;
          this.createdCounter = current + 1;
        } else {
          this.createdCounter = 1;
        }
        if (this.createdCounter) {
          entry.identifier = 'CREATED' + this.createdCounter;
          re.addSubEntry(entry);
        }
      }
    }
  }

  isEntryTypeSettable(re: ReactiveEntry): boolean {
    return re?.value?.type === EntryValueType.Class &&
      re.value.possible != null &&
      re.value.possible.length > 1;
  }

  onPatchToSelectedEntryType(keyPair: EntryPossible): void {
    const re = this._re();
    if (!re) return;

    const currentEntry = re.entry();
    const prototype = currentEntry?.prototypes?.find((proto: Entry) => proto.identifier === keyPair.key);

    if (!prototype) {
      this.selectedEntryHasPrototypes.set(false);
      return;
    }

    // Build the new entry from the prototype
    const entryPrototype = PrototypeToEntryConverter.entryFromPrototype(prototype);
    entryPrototype.prototypes = JSON.parse(JSON.stringify(currentEntry.prototypes));
    entryPrototype.value.possible = currentEntry.value.possible;
    entryPrototype.displayName = currentEntry.displayName;
    entryPrototype.identifier = currentEntry.identifier;

    // Clear sub-entries and replace entry
    re.clearSubEntries();
    re.replaceEntry(entryPrototype);

    this.selectedEntryHasPrototypes.set(true);
  }

  dropdownSelectionChanged(event: MatSelectChange) {
    this.onPatchToSelectedEntryType(event.value);
  }

  isPrimitiveType(re: ReactiveEntry) {
    return re.value.type !== EntryValueType.Collection &&
      (re.value.possible && re.value.possible.length === 1) ||
      (((re.value.possible && re.value.possible.length < 1) || !re.value.possible) &&
        (EntryValueType.Byte === re.value?.type ||
          EntryValueType.Int16 === re.value?.type ||
          EntryValueType.UInt16 === re.value?.type ||
          EntryValueType.Int32 === re.value?.type ||
          EntryValueType.UInt32 === re.value?.type ||
          EntryValueType.Int64 === re.value?.type ||
          EntryValueType.UInt64 === re.value?.type ||
          EntryValueType.Single === re.value?.type ||
          EntryValueType.Double === re.value?.type ||
          EntryValueType.String === re.value?.type ||
          EntryValueType.Exception === re.value?.type));
  }
}
