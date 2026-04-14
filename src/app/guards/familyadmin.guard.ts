import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { UserStateService } from '../services/user-state-service';

export const familyAdminGuard: CanActivateFn = () => {
  const router = inject(Router);
  const userState = inject(UserStateService);

  if (userState.currentFamilyRole() !== null) {
    return userState.isFamilyAdmin() ? true : router.createUrlTree(['/dashboard']);
  }

  return userState.refreshFamilyContext().pipe(
    map(() => (userState.isFamilyAdmin() ? true : router.createUrlTree(['/dashboard']))),
    catchError(() => of(router.createUrlTree(['/dashboard']))),
  );
};