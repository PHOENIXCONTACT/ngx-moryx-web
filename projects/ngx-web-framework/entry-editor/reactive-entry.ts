import { signal, computed, Signal, WritableSignal } from '@angular/core';
import { Entry } from './models/entry';
import { EntryValidation } from './models/entry-validation';
import { EntryValue } from './models/entry-value';

export class ReactiveEntry {
  // Core signal holding the Entry - ALL reads go through this
  private readonly _entry: WritableSignal<Entry>;

  // Mutable property signals (only these need reactive tracking)
  private readonly _current: WritableSignal<string | null | undefined>;
  private readonly _subEntries: WritableSignal<ReactiveEntry[]>;

  // Parent reference for change propagation
  private readonly _parent: ReactiveEntry | null = null;

  constructor(entry: Entry, parent?: ReactiveEntry) {
    this._entry = signal(structuredClone(entry));
    this._current = signal(entry.value?.current);
    this._subEntries = signal(
      (entry.subEntries ?? []).map(sub => new ReactiveEntry(sub, this))
    );
    this._parent = parent ?? null;
  }

  // Readable signals for mutable properties

  /** The current editable value - reactive */
  readonly current: Signal<string | null | undefined> =
    computed(() => this._current());

  /** Sub-entries as ReactiveEntry array - reactive */
  readonly subEntries: Signal<ReactiveEntry[]> =
    computed(() => this._subEntries());

  // Non-signal accessors for read-only properties

  /** Access underlying Entry for read-only properties */
  entry(): Entry {
    return this._entry();
  }

  // Convenience getters for common read-only properties

  get displayName(): string | null | undefined {
    return this._entry().displayName;
  }

  get description(): string | null | undefined {
    return this._entry().description;
  }

  get identifier(): string | null | undefined {
    return this._entry().identifier;
  }

  get value(): EntryValue {
    return this._entry().value;
  }

  get validation(): EntryValidation | undefined {
    return this._entry().validation;
  }

  get prototypes(): Array<Entry> | null | undefined {
    return this._entry().prototypes;
  }

  // mutation methods

  /** Update the current value */
  setCurrent(value: string | null | undefined): void {
    this._current.set(value);
    this._entry.update(e => ({
      ...e,
      value: { ...e.value, current: value }
    }));
    this.notifyParent();
  }

  /** Add a sub-entry */
  addSubEntry(entry: Entry): ReactiveEntry {
    const reactive = new ReactiveEntry(entry, this);
    this._subEntries.update(subs => [...subs, reactive]);
    this.syncSubEntries();
    this.notifyParent();
    return reactive;
  }

  /** Remove a sub-entry by identifier */
  removeSubEntry(identifier: string): boolean {
    const subs = this._subEntries();
    const index = subs.findIndex(s => s.identifier === identifier);
    if (index === -1) return false;

    this._subEntries.update(arr => arr.filter((_, i) => i !== index));
    this.syncSubEntries();
    this.notifyParent();
    return true;
  }

  /** Clear all sub-entries */
  clearSubEntries(): void {
    this._subEntries.set([]);
    this.syncSubEntries();
    this.notifyParent();
  }

  /** Replace entry completely (for type switching) */
  replaceEntry(entry: Entry): void {
    this._entry.set(structuredClone(entry));
    this._current.set(entry.value?.current);
    this._subEntries.set(
      (entry.subEntries ?? []).map(sub => new ReactiveEntry(sub, this))
    );
    this.notifyParent();
  }

  // Conversion to ReactiveEntry and back

  /** Convert back to plain Entry (for API calls) */
  toEntry(): Entry {
    const base = this._entry();
    return {
      ...base,
      value: { ...base.value, current: this._current() },
      subEntries: this._subEntries().map(re => re.toEntry())
    };
  }

  /** Factory method */
  static fromEntry(entry: Entry): ReactiveEntry {
    return new ReactiveEntry(entry);
  }

  // privates

  private syncSubEntries(): void {
    this._entry.update(e => ({
      ...e,
      subEntries: this._subEntries().map(re => re.toEntry())
    }));
  }

  private notifyParent(): void {
    if (this._parent) {
      this._parent.syncSubEntries();
      this._parent.notifyParent();
    }
  }
}
