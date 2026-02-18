/* tslint:disable */
/* eslint-disable */

import { EntryValidation } from './entry-validation';
import { EntryValue } from './entry-value';

export interface Entry {
  description?: string | null;
  displayName?: string | null;
  identifier?: string | null;
  prototypes?: Array<Entry> | null;
  subEntries?: Array<Entry> | null;
  validation?: EntryValidation;
  value: EntryValue;
}
