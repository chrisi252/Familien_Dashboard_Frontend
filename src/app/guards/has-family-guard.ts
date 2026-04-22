import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserStateService } from '../services/user-state-service';

export const hasFamilyGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const userState = inject(UserStateService);
  
   if(userState.currentFamilyId()==null){
    return router.createUrlTree(['/family-selection']);
  }else {
    return true;
  }

};
