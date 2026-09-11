import { Component, effect, inject, input, model, signal, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Entry } from './models/entry';
import { EntryPossible } from './models/entry-possible';
import { EntryUnitType } from './models/entry-unit-type';
import { EntryValueType } from './models/entry-value-type';
import { ENTRY_EDITOR_TRANSLATIONS } from './entry-editor-translations';
import { PrototypeToEntryConverter } from './prototype-to-entry-converter';
import { BooleanEditor } from './boolean-editor/boolean-editor';
import { MatLineModule, MatOption } from '@angular/material/core';
import { MatList } from '@angular/material/list';
import { MatFormField, MatLabel, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatSelect, MatSelectChange } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { EnumEditor } from './enum-editor/enum-editor';
import { InputEditor } from './input-editor/input-editor';
import { FileEditor } from './file-editor/file-editor';
import { DateEditor } from './date-editor/date-editor';
import { TimeEditor } from './time-editor/time-editor';
import { TimeSpanEditor } from './timespan-editor/timespan-editor';
import { EntryObject } from './entry-object/entry-object';
import { EntryListItem } from './entry-list-item/entry-list-item';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'entry-editor',
  imports: [
    BooleanEditor,
    EnumEditor,
    InputEditor,
    FileEditor,
    DateEditor,
    TimeEditor,
    TimeSpanEditor,
    EntryObject,
    EntryListItem,
    MatLineModule,
    MatList,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
    MatIconButton,
    MatIcon,
    MatHint,
    MatSuffix
  ],
  templateUrl: './entry-editor.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './entry-editor.scss',
})
export class EntryEditor {
  /** Unique identifier to support multiple navigable entry editors simultaneously. */
  editorId = input<number | undefined>(undefined);

  /** Whether the editor is disabled. */
  disabled = input<boolean>(false);

  /** The entry to display and edit. Changes are propagated back via two-way binding. */
  entry = model.required<Entry>();

  private currentEntry: Entry | undefined = undefined;

  protected EntryValueType = EntryValueType;
  protected EntryUnitType = EntryUnitType;

  protected possibleListItemTypes = signal<EntryPossible[] | undefined | null>(undefined);
  private prototypes = signal<Entry[]>([]);
  protected selectedListItemType = signal<string | undefined>(undefined);
  private selectedEntryHasPrototypes = signal(true);

  private createdCounter?: number;
  private translate = inject(TranslateService);

  constructor() {
    this.mergeTranslations();
    this.translate.onLangChange.subscribe(() => this.mergeTranslations());

    // ToDo: Replace effect and signals with computed
    effect(() => {
      if(this.currentEntry !== this.entry() ){
        this.initialize(this.entry());
        this.currentEntry = this.entry();
      }
    });
  }

  private initialize(entry: Entry) {
    if (entry.value.type == 'Collection') {
      this.possibleListItemTypes.set(entry.value.possible);
      this.prototypes.set(entry.prototypes ?? []);
      if (entry.value.possible !== undefined && entry.value.possible !== null && entry.value.default !== null) {
        this.selectedListItemType.set(entry.value.default);
      }
    }
  }

  // Value change violates immutability requirement of signals. This is to currently circumvented by
  // - using map on the array an creating a new array reference
  // - creating a new entry object with the updated value and replacing the old in the mapping
  // - propagating this reference change upwards in the array
  // ToDo: In future a 'ReactiveEntry' wrapper would improve performance and reduce reference copying effort
  protected updateSubEntry(subEntry: Entry) {
    this.entry.update(item => {
      const match = item.subEntries?.find(x => x.identifier === subEntry.identifier);
      if (!match)
        throw new Error('Failed to find sub entry with identifier ' + subEntry.identifier + ' to mutate its value');

      const updatedMatch = { ...match, value: subEntry.value };
      const updatedSubEntries = item.subEntries!.map(se =>
        se.identifier === subEntry.identifier ? updatedMatch : se
      );
      const updatedEntry = { ...item, subEntries: updatedSubEntries };
      return updatedEntry;
    });
  }

  protected onDeleteListItem(toBeDeleted: Entry) {
    this.entry.update(entry => {
      if (!entry.subEntries) {
        return entry;
      }
      const updatedSubEntries = entry.subEntries.filter(c => c.identifier !== toBeDeleted.identifier);
      return {
        ...entry,
        subEntries: updatedSubEntries
      };
    });
  }

  protected addItemToList() {
    const prototypes = this.prototypes();

    // ToDo: Clean up function
    if (this.selectedListItemType() && prototypes) {
      for (var i = 0; i < prototypes.length; i++) {
        if (prototypes[i].value.type == EntryValueType.Class) {
          var prototype = prototypes.find(x => x.identifier === this.selectedListItemType());
        } else {
          // ToDo: Check why this branch is necessary identifier should always be set for prototypes
          var prototype = prototypes.find(x => x.displayName === this.selectedListItemType());
        }
      }
      if (prototype) {
        const currentEntry = this.entry();
        var entry = PrototypeToEntryConverter.cloneEntry(prototype);
        if (currentEntry.subEntries && currentEntry.subEntries.length > 0) {
          var last = currentEntry.subEntries[currentEntry.subEntries.length - 1];
          var count = /\d+/;
          var current = last.identifier ? Number(last.identifier.match(count)) : 0;
          this.createdCounter = current + 1;
        } else {
          this.createdCounter = 1;
        }
        // ToDo: Add default value to created counter
        if (this.createdCounter) {
          entry.identifier = 'CREATED' + this.createdCounter;
          this.entry.update(e => ({
            ...e,
            subEntries: [...(e.subEntries ?? []), entry]
          }));
        }
      }
    }
  }

  protected isEntryTypeSettable(entry: Entry): boolean {
    return  entry?.value?.type === EntryValueType.Class &&
      entry.value.possible != null &&
      entry.value.possible.length > 1;
  }

  private onPatchToSelectedEntryType(keyPair: EntryPossible): void {
    this.entry.update(entry => {
      const prototype = entry?.prototypes?.find((proto: Entry) => proto.identifier === keyPair.key);
      if (!prototype) {
        this.selectedEntryHasPrototypes.set(false);
        return { ...entry, subEntries: [] };
      }
      const entryPrototype = PrototypeToEntryConverter.entryFromPrototype(prototype);
      entryPrototype.prototypes = JSON.parse(JSON.stringify(entry.prototypes));
      entryPrototype.value.possible = entry.value.possible;
      entryPrototype.displayName = entry.displayName;
      entryPrototype.identifier = entry.identifier;
      this.selectedEntryHasPrototypes.set(true);
      return { ...entry, ...entryPrototype };
    });
  }

  private mergeTranslations() {
    for (const [lang, translations] of Object.entries(ENTRY_EDITOR_TRANSLATIONS)) {
      this.translate.setTranslation(lang, translations, true);
    }
  }

  // ToDo: Remove unnecessary wrapper function
  protected dropdownSelectionChanged(event: MatSelectChange){
    this.onPatchToSelectedEntryType(event.value);
  }

  protected isPrimitiveType(entry: Entry){
    return entry.value.type !== EntryValueType.Collection &&
      (entry.value.possible && entry.value.possible.length === 1) ||
      (((entry.value.possible && entry.value.possible.length < 1) || !entry.value.possible)  &&
        (EntryValueType.Byte === entry.value?.type ||
          EntryValueType.Int16 === entry.value?.type ||
          EntryValueType.UInt16 === entry.value?.type ||
          EntryValueType.Int32 === entry.value?.type ||
          EntryValueType.UInt32 === entry.value?.type ||
          EntryValueType.Int64 === entry.value?.type ||
          EntryValueType.UInt64 === entry.value?.type ||
          EntryValueType.Single === entry.value?.type ||
          EntryValueType.Double === entry.value?.type ||
          EntryValueType.String === entry.value?.type ||
          EntryValueType.Exception === entry.value?.type));
  }
}
