/* tslint:disable */
/* eslint-disable */
export interface EntryValidation {
  isRequired?: boolean;
  maximum?: number;
  minimum?: number;
  regex?: null | string;
  range?: number;
  deniedValues?: string[];
  allowedValues?: string[];
  maxLength?: number;
  minLength?: number;
}
