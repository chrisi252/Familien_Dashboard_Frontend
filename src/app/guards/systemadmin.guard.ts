import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { UserStateService } from '../services/user-state-service';

export const systemAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userState = inject(UserStateService);

  if (userState.currentUser()) {
    return userState.currentUser()!.is_system_admin
      ? true
      : router.createUrlTree(['/dashboard']);
  }

  if (userState.isSessionInitialized()) {
    return router.createUrlTree(['/login']);
  }

  return from(userState.initializeSession()).pipe(
    switchMap(() => {
      const user = userState.currentUser();
      if (!user) return of(router.createUrlTree(['/login']));
      return of(user.is_system_admin ? true : router.createUrlTree(['/dashboard']));
    }),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
