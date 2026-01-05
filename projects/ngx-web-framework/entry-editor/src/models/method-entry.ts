/* tslint:disable */
/* eslint-disable */

import { Entry } from "./entry";
export interface MethodEntry {
    name: string;
    displayName: string;
    description: string;
    isAsync?: boolean;
    parameters: Entry;
}