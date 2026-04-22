import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { API_BASE_URL } from './core/api-config';


const getCsrfToken = (): string | undefined => {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrf_access_token='))
    ?.split('=')[1];
};

export const authorizeInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const apiBase = inject(API_BASE_URL);

  const isLoginRequest = req.url.includes('/users/login');
  const isRegisterRequest = req.url.includes('/users/register');
  const apiRequest = req.url.startsWith(apiBase);

  
  let authReq = apiRequest 
    ? req.clone({ withCredentials: true }) 
    : req;

 
  const protectedMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];
  if (apiRequest && protectedMethods.includes(req.method.toUpperCase())) {
    const csrfToken = getCsrfToken();
    if (csrfToken) {
      authReq = authReq.clone({
        setHeaders: {
          'X-CSRF-TOKEN': csrfToken
        }
      });
    }
  }

  return next(authReq).pipe(
    catchError((error) => {
      if (isLoginRequest || isRegisterRequest) {
        return throwError(() => error);
      }

   
      if (error.status === 401 || error.status === 422) {
        router.navigate(['/login']);
      }
      

      if (error.status === 403) {
        router.navigate(['/dashboard']);
      }

      return throwError(() => error);
    }),
  );
};