/* tslint:disable */
/* eslint-disable */

import { DataType } from './data-type';

export interface EntryValidation {
  dataType?: DataType;
  isRequired?: boolean;
  maximum?: number;
  minimum?: number;
  regex?: string | null;
}
