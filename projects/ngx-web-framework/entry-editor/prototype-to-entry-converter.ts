import { Entry } from "./models/entry";
import { EntryValueType } from "./models/entry-value-type";

export class PrototypeToEntryConverter {
  static convertToEntry(prototype: Entry) {
    this.convertEnumsToString(prototype);
  }

  private static convertEnumsToString(prototype: Entry) {
    if (prototype.value && Array.isArray(prototype.value.current) && prototype.value.type === EntryValueType.Enum) {
      prototype.value.current = prototype.value.current.join(', ');
    }

    if (prototype.subEntries) {
      for (const e of prototype.subEntries) {
        this.convertEnumsToString(e);
      }
    }
  }

  static entryFromPrototype(prototype: Entry): Entry {
    const entryPrototype = JSON.parse(JSON.stringify(prototype));
    return entryPrototype;
  }


  static cloneEntry(prototype: Entry): Entry {
    let entry = { ...prototype };
    entry.validation = { ...prototype.validation };
    entry.value = { ...prototype.value };
    if (prototype.subEntries && entry.subEntries) {
      entry.subEntries = [] as Entry[];
      for (let i = 0; i < prototype.subEntries?.length; i++) {
        entry.subEntries[i] = this.cloneEntry(prototype.subEntries[i]);
      }
    }
    if (prototype.prototypes && entry.prototypes) {
      entry.prototypes = [] as Entry[];
      for (let i = 0; i < prototype.prototypes?.length; i++) {
        entry.prototypes[i] = this.cloneEntry(prototype.prototypes[i]);
      }
    }
    return entry;
  }
}
