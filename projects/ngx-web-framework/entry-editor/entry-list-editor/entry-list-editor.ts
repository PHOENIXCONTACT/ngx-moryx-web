import { Component, computed, input, model, signal, effect, ChangeDetectionStrategy } from '@angular/core';
import { Entry } from '../models/entry';
import { EntryValueType } from '../models/entry-value-type';
import { PrototypeToEntryConverter } from '../prototype-to-entry-converter';
import { updateSubEntry } from '../update-sub-entry';
import { EntryListItem } from './entry-list-item/entry-list-item';
import { MatLineModule, MatOption } from '@angular/material/core';
import { MatList } from '@angular/material/list';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatSelect } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'entry-list-editor',
  imports: [
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
  ],
  templateUrl: './entry-list-editor.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './entry-list-editor.scss',
})
export class EntryListEditor {
  editorId = input.required<number>();
  disabled = input<boolean>(false);
  entry = model.required<Entry>();

  protected possibleListItemTypes = computed(() => this.entry().value.possible);
  private prototypes = computed(() => this.entry().prototypes ?? []);
  protected selectedListItemType = signal<string | undefined>(undefined);

  private createdCounter = 0;

  protected EntryValueType = EntryValueType;

  constructor() {
    effect(() => {
      const possible = this.entry().value.possible;
      const defaultValue = this.entry().value.default;
      if (possible && defaultValue !== null) {
        this.selectedListItemType.set(defaultValue ?? undefined);
      }
    });
  }

  protected updateSubEntry(subEntry: Entry) {
    this.entry.update(item => updateSubEntry(item, subEntry));
  }

  protected onDeleteListItem(toBeDeleted: Entry) {
    this.entry.update(entry => {
      if (!entry.subEntries) {
        return entry;
      }
      const updatedSubEntries = entry.subEntries.filter(c => c.identifier !== toBeDeleted.identifier);
      return { ...entry, subEntries: updatedSubEntries };
    });
  }

  protected onMoveListItemUp(toBeMoved: Entry) {
    this.moveListItem(toBeMoved, -1);
  }

  protected onMoveListItemDown(toBeMoved: Entry) {
    this.moveListItem(toBeMoved, 1);
  }

  private moveListItem(toBeMoved: Entry, direction: -1 | 1) {
    this.entry.update(entry => {
      if (!entry.subEntries) {
        return entry;
      }
      const index = entry.subEntries.findIndex(c => c.identifier === toBeMoved.identifier);
      const targetIndex = index + direction;
      if (index < 0 || targetIndex < 0 || targetIndex >= entry.subEntries.length) {
        return entry;
      }
      const updated = [...entry.subEntries];
      [updated[index], updated[targetIndex]] = [updated[targetIndex], updated[index]];
      return { ...entry, subEntries: updated };
    });
  }

  protected addItemToList() {
    const prototypes = this.prototypes();

    // ToDo: Clean up function
    if (this.selectedListItemType() && prototypes) {
      let prototype: Entry | undefined;
      for (let i = 0; i < prototypes.length; i++) {
        if (prototypes[i].value.type == EntryValueType.Class) {
          prototype = prototypes.find(x => x.identifier === this.selectedListItemType());
        } else {
          // ToDo: Check why this branch is necessary identifier should always be set for prototypes
          prototype = prototypes.find(x => x.displayName === this.selectedListItemType());
        }
      }
      if (prototype) {
        const currentEntry = this.entry();
        const entry = PrototypeToEntryConverter.cloneEntry(prototype);
        if (currentEntry.subEntries && currentEntry.subEntries.length > 0) {
          const last = currentEntry.subEntries[currentEntry.subEntries.length - 1];
          const countPattern = /\d+/;
          const current = last.identifier ? Number(last.identifier.match(countPattern)) : 0;
          this.createdCounter = current + 1;
        } else {
          this.createdCounter = 1;
        }
        entry.identifier = 'CREATED' + this.createdCounter;
        this.entry.update(e => ({
          ...e,
          subEntries: [...(e.subEntries ?? []), entry]
        }));
      }
    }
  }
}
