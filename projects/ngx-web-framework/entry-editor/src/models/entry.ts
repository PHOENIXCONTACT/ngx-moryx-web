/* tslint:disable */
/* eslint-disable */

import { EntryValidation } from '../models/entry-validation';
import { EntryValue } from '../models/entry-value';
export interface Entry {
  description?: string | null;
  displayName?: string | null;
  identifier?: string | null;
  prototypes?: Array<Entry> | null;
  subEntries?: Array<Entry> | null;
  validation?: EntryValidation;
  value: EntryValue;
}
