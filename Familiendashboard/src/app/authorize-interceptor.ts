import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './services/auth-service';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { switchMap } from 'rxjs/internal/operators/switchMap';

export const authorizeInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = localStorage.getItem('accessToken');

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error) => {
      if (error.status === 401) {

        return authService.refreshToken().pipe(
          switchMap((tokens) => {
            if (tokens) {
              authService.storeTokens(tokens);
              const newReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${tokens.accessToken}`
                }
              });
              return next(newReq);
            }
            return throwError(()=>error);
          })
        );
      }
      throw error;
    })
  );
};
