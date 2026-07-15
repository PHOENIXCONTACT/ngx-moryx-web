import { HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

/**
 * Interceptor responsible for catching and logging global http failures.
 */
export const apiErrorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  return next(req).pipe(
    tap({
      error: (err) => console.error(`Error performing request, status code = ${err.status}`),
    })
  );
};
