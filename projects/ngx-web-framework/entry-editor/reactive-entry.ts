import { signal, computed, Signal, WritableSignal } from '@angular/core';
import { Entry } from './models/entry';
import { EntryValidation } from './models/entry-validation';
import { EntryValue } from './models/entry-value';

export class ReactiveEntry {
  // Core signal holding the Entry - ALL reads go through this
  private readonly _entry: WritableSignal<Entry>;

  // Mutable property signals (only these need reactive tracking)
  private readonly _currentValue: WritableSignal<string | null | undefined>;
  private readonly _subEntries: WritableSignal<ReactiveEntry[]>;

  // Parent reference for change propagation
  private readonly _parent: ReactiveEntry | null = null;

  // Version counter - increments on each mutation (used to detect actual changes vs initial state)
  private readonly _version: WritableSignal<number>;

  constructor(entry: Entry, parent?: ReactiveEntry) {
    this._version = signal(0);
    this._entry = signal(structuredClone(entry));
    this._currentValue = signal(entry.value?.current);
    this._subEntries = signal(
      (entry.subEntries ?? []).map(sub => new ReactiveEntry(sub, this))
    );
    this._parent = parent ?? null;
  }

  // Readable signals for mutable properties

  /** The current editable value - reactive */
  readonly currentValue: Signal<string | null | undefined> =
    computed(() => this._currentValue());

  /** Sub-entries as ReactiveEntry array - reactive */
  readonly subEntries: Signal<ReactiveEntry[]> =
    computed(() => this._subEntries());

  /**
   * Signal that emits the current Entry whenever any change occurs.
   * Watch this to detect modifications to the entry tree.
   */
  readonly changed: Signal<Entry> = computed(() => this.toEntry());

  /**
   * Version counter that increments on each mutation.
   * Use this to distinguish initial state (version 0) from actual changes (version > 0).
   */
  readonly version: Signal<number> = computed(() => this._version());

  // Convenience getters for common read-only properties

  get displayName(): string | null {
    return this._entry().displayName ?? null;
  }

  get description(): string | null {
    return this._entry().description ?? null;
  }

  get identifier(): string  {
    // Hint identifier is generated as optional, so we enforce it here for convenience
    return this._entry().identifier!;
  }

  get value(): EntryValue {
    return this._entry().value;
  }

  get validation(): EntryValidation {
    // Hint validation is generated as optional, so we enforce it here for convenience
    return this._entry().validation!;
  }

  get prototypes(): Entry[] {
    // Hint prototypes is generated as optional, so we enforce it here for convenience
    return this._entry().prototypes!;
  }

  // mutation methods

  /** Update the current value */
  setCurrentValue(value: string | null | undefined): void {
    this._currentValue.set(value);
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
    this._currentValue.set(entry.value.current);
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
      value: { ...base.value, current: this._currentValue() },
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
    } else {
      // At root level - increment version to signal a change occurred
      this._version.update(v => v + 1);
    }
  }
}
