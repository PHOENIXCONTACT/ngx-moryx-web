/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { Configs } from '@moryx/ngx-web-framework/configs';

/**
 * Global configuration
 */
@Injectable({
  providedIn: 'root',
})
export class ApiConfiguration {
  rootUrl: string = '';

  constructor() {
    if(window.configs)
      this.rootUrl = window.configs.identityUrl;
  }
}

declare global {
  interface Window {
    configs: Configs;
  }
}

/**
 * Parameters for `ApiModule.forRoot()`
 */
export interface ApiConfigurationParams {
  rootUrl?: string;
}
