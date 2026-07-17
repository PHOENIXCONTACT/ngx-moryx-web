import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { LanguageService } from "@moryx/ngx-web-framework/services";

/**
 * Interceptor responsible for attaching locale headers to outgoing requests.
 */
export const languageInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const languageService = inject(LanguageService);

  const modifiedReq = req.clone({
    setHeaders: {
      'accept-language': `${languageService.getFallbackLang()}-DE`,
    },
  });

  return next(modifiedReq);
};
