/* tslint:disable */
/* eslint-disable */
import { EntryUnitType } from './entry-unit-type';
import { EntryValueType } from './entry-value-type';
export interface EntryValue {
  current?: null | string;
  default?: null | string;
  isReadOnly?: boolean;
  useSlider?: boolean;
  possible?: null | Array<string>;
  type?: EntryValueType;
  unitType?: EntryUnitType;
}
