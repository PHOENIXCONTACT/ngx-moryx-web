import { Component, inject, input, model, output, ChangeDetectionStrategy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Entry } from './models/entry';
import { EntryUnitType } from './models/entry-unit-type';
import { EntryValueType } from './models/entry-value-type';
import { ENTRY_EDITOR_TRANSLATIONS } from './entry-editor-translations';
import { PrototypeToEntryConverter } from './prototype-to-entry-converter';
import { updateSubEntry } from './update-sub-entry';
import { BooleanEditor } from './boolean-editor/boolean-editor';
import { MatLineModule, MatOption } from '@angular/material/core';
import { MatList } from '@angular/material/list';
import { MatFormField, MatLabel, MatHint, MatSuffix } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { EnumEditor } from './enum-editor/enum-editor';
import { InputEditor } from './input-editor/input-editor';
import { FileEditor } from './file-editor/file-editor';
import { DateEditor } from './date-editor/date-editor';
import { TimeEditor } from './time-editor/time-editor';
import { TimeSpanEditor } from './timespan-editor/timespan-editor';
import { EntryObject } from './entry-object/entry-object';
import { EntryListEditor } from './entry-list-editor/entry-list-editor';
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
    EntryListEditor,
    MatLineModule,
    MatList,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    FormsModule,
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

  /** Emits whenever the overall validation state of this editor changes. */
  validChange = output<boolean>();

  private validityMap = new Map<string, boolean>();

  protected EntryValueType = EntryValueType;
  protected EntryUnitType = EntryUnitType;

  private translate = inject(TranslateService);

  constructor() {
    this.mergeTranslations();
    this.translate.onLangChange.subscribe(() => this.mergeTranslations());
  }

  protected onValidChange(identifier: string, valid: boolean) {
    this.validityMap.set(identifier, valid);
    const allValid = [...this.validityMap.values()].every(v => v);
    this.validChange.emit(allValid);
  }

  protected updateSubEntry(subEntry: Entry) {
    this.entry.update(item => updateSubEntry(item, subEntry));
  }

  protected isEntryTypeSettable(entry: Entry): boolean {
    return entry?.value?.type === EntryValueType.Class &&
      entry.value.possible != null &&
      entry.value.possible.length > 1;
  }

  protected onPatchToSelectedEntryType(key: string): void {
    this.entry.update(entry => {
      const prototype = entry?.prototypes?.find((proto: Entry) => proto.identifier === key);
      if (!prototype) {
        return { ...entry, subEntries: [] };
      }
      const entryPrototype = PrototypeToEntryConverter.entryFromPrototype(prototype);
      entryPrototype.prototypes = JSON.parse(JSON.stringify(entry.prototypes));
      entryPrototype.value.possible = entry.value.possible;
      entryPrototype.displayName = entry.displayName;
      entryPrototype.identifier = entry.identifier;
      entryPrototype.value.current = key;
      return { ...entry, ...entryPrototype };
    });
  }

  private mergeTranslations() {
    for (const [lang, translations] of Object.entries(ENTRY_EDITOR_TRANSLATIONS)) {
      this.translate.setTranslation(lang, translations, true);
    }
  }


  protected isPrimitiveType(entry: Entry) {
    return entry.value.type !== EntryValueType.Collection &&
      (entry.value.possible && entry.value.possible.length === 1) ||
      (((entry.value.possible && entry.value.possible.length < 1) || !entry.value.possible) &&
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
