import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from './core/api-config';

export const authorizeInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const apiBase = inject(API_BASE_URL);

  const isLoginRequest = req.url.includes('/users/login');
  const isRegisterRequest = req.url.includes('/users/register');

  const apiRequest = req.url.startsWith(apiBase);
  const requestWithCredentials = apiRequest
    ? req.clone({ withCredentials: true })
    : req;

  return next(requestWithCredentials).pipe(
    catchError((error) => {
      if (isLoginRequest || isRegisterRequest) {
        return throwError(() => error);
      }

      if (error.status === 401) {
        router.navigate(['/login']);
      }

      if (error.status === 403) {
        router.navigate(['/dashboard']);
      }

      return throwError(() => error);
    }),
  );
};
