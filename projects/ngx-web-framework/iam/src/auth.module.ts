/* tslint:disable */
/* eslint-disable */
import { NgModule, ModuleWithProviders, SkipSelf, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfiguration, ApiConfigurationParams } from './api-configuration';

import { AuthService } from './services/auth.service';
import { MoryxIfHasPermissionDirective } from './directives/moryx-if-has-permission.directive';

/**
 * Module that provides all services and configuration.
 */
@NgModule({
    imports: [MoryxIfHasPermissionDirective],
    exports: [
        MoryxIfHasPermissionDirective
    ],
    providers: [
        AuthService,
        ApiConfiguration
    ],
})
export class AuthModule {
  static forRoot(params: ApiConfigurationParams): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,
      providers: [
        {
          provide: ApiConfiguration,
          useValue: params
        }
      ]
    }
  }

  constructor( 
    @Optional() @SkipSelf() parentModule: AuthModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error('ApiModule is already loaded. Import in your base AppModule only.');
    }
    if (!http) {
      throw new Error('You need to import the HttpClientModule in your AppModule! \n' +
      'See also https://github.com/angular/angular/issues/20575');
    }
  }
}
