import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LanguageService } from '../language-service/languageService.service';

@Injectable()
export class ApiInterceptor implements HttpInterceptor {
  constructor(private languageService: LanguageService) {}

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
