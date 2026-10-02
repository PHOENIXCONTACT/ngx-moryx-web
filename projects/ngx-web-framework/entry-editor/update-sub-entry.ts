import { Entry } from "./models/entry";

// Value change violates immutability requirement of signals. This is to currently circumvented by
// - using map on the array an creating a new array reference
// - creating a new entry object with the updated value and replacing the old in the mapping
// - propagating this reference change upwards in the array
// ToDo: In future a 'ReactiveEntry' wrapper would improve performance and reduce reference copying effort
/** Immutably replaces the value of a sub-entry within the parent by matching on identifier. */
export function updateSubEntry(parent: Entry, subEntry: Entry): Entry {
  const match = parent.subEntries?.find(x => x.identifier === subEntry.identifier);
  if (!match) {
    throw new Error('Failed to find sub entry with identifier ' + subEntry.identifier + ' to mutate its value');
  }

  const updatedMatch = { ...match, value: subEntry.value };
  const updatedSubEntries = parent.subEntries!.map(se =>
    se.identifier === subEntry.identifier ? updatedMatch : se
  );
  return { ...parent, subEntries: updatedSubEntries };
}
