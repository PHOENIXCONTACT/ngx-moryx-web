import { HTTP_INTERCEPTORS, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { forwardRef, inject, Injectable, Provider } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LanguageService } from '@moryx/ngx-web-framework/services';

// TODO: Remove these interceptors in the next major.

/**
 * @deprecated Use `languageInterceptor` and `apiErrorInterceptor` functional interceptors instead.
 * This class will be removed in the next major release.
 */
@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  private languageService = inject(LanguageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Apply the headers
    req = req.clone({
      setHeaders: {
        'accept-language': `${this.languageService.getFallbackLang()}-DE`,
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

/**
 * @deprecated Register functional interceptors inside `provideHttpClient(withInterceptors([...]))` instead.
 * Do not add this provider token to `app.config.ts`.
 */
export const API_INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  useExisting: forwardRef(() => ApiInterceptor),
  multi: true,
};
