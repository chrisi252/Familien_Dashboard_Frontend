import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authorizeInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const isLoginRequest = req.url.includes('/users/login');
  const isRegisterRequest = req.url.includes('/users/register');

  const apiRequest = req.url.startsWith('/api') || req.url.includes('/api/');
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
    })
  );
};
