import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserStateService } from '../services/user-state-service';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userState = inject(UserStateService);

  if (userState.currentUser()) {
    return true;
  }

  if (userState.isSessionInitialized()) {
    return router.createUrlTree(['/login']);
  }

  return from(userState.initializeSession()).pipe(
    switchMap(() => of(userState.currentUser() ? true : router.createUrlTree(['/login']))),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};