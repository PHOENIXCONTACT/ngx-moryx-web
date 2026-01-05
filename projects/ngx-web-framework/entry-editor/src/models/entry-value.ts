/* tslint:disable */
/* eslint-disable */

import { EntryPossible } from './entry-possible';
import { EntryUnitType } from './entry-unit-type';
import { EntryValueType } from './entry-value-type';
export interface EntryValue {
  current?: string | null;
  default?: string | null;
  isReadOnly?: boolean;
  useSlider?: boolean;
  possible?: Array<EntryPossible> | null;
  type?: EntryValueType;
  unitType?: EntryUnitType;
}
