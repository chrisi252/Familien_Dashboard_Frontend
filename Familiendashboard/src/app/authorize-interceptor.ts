import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './services/auth-service';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { switchMap } from 'rxjs/internal/operators/switchMap';

export const authorizeInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('accessToken');

  const isLoginRequest = req.url.includes('/users/login');
  const isRegisterRequest = req.url.includes('/users/register');
  const isRefreshRequest = req.url.includes('/refresh');

  const logoutAndRedirect = (error: unknown) => {
    authService.clearToken();
    router.navigate(['/login']);
    return throwError(() => error);
  };

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
        if (isLoginRequest || isRegisterRequest) {
          return throwError(() => error);
        }

        if (isRefreshRequest) {
          return logoutAndRedirect(error);
        }

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
            return logoutAndRedirect(error);
          }),
          catchError(() => logoutAndRedirect(error))
        );
      }
      return throwError(() => error);
    })
  );
};
