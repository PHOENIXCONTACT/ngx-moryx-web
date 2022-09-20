import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { forwardRef, Injectable, NgModule, Provider } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiInterceptor } from './api-interceptor/api-interceptor.service';
import { LanguageService } from './language-service/languageService.service';
import { SearchBarService } from './search-bar/search-bar.service';

export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => ApiInterceptor),
  multi: true,
};

@NgModule({
  declarations: [SearchBarService, LanguageService],
  imports: [Injectable, Observable],
  exports: [SearchBarService, LanguageService],
  providers: [ApiInterceptor, API_INTERCEPTOR_PROVIDER],
})
export class ShellServicesModule {}
