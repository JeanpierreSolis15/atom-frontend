import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { USER_REPOSITORY } from "@auth/domain/repositories/user-repository.interface";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

export const AuthInterceptor: HttpInterceptorFn = (
  request: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<any> => {
  const userRepository = inject(USER_REPOSITORY);
  const token = userRepository.getAccessToken();

  if (token) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        userRepository.logout();
      }
      return throwError(() => error);
    })
  );
};
