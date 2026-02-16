import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { forwardRef, inject, Injectable, Provider } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LanguageService } from '@moryx/ngx-web-framework/services';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private languageService = inject(LanguageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Apply the headers
    req = req.clone({
      setHeaders: {
        'accept-language': `${this.languageService.getDefaultLanguage()}-DE`,
      },
    });

    // Also handle errors globally
    return next.handle(req).pipe(
      tap({
        next: x => x,
        error: err => console.error(`Error performing request, status code = ${err.status}`),
      })
    );
  }
}

export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => ApiInterceptor),
  multi: true,
};
