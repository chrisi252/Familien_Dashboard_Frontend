import { inject, Injectable, signal } from '@angular/core';
import { FamilyRoleName, User } from '../interfaces/user';
import { ProfileService } from './profile-service';
import { FamilyService } from './family-service';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private profileService = inject(ProfileService);
  private familyService = inject(FamilyService);

  currentUser = signal<User | null>(null);
  currentFamilyRole = signal<FamilyRoleName | null>(null);
  currentFamilyId = signal<number | null>(null);

  loadCurrentUser() {
    this.profileService.getProfile().subscribe(u => this.currentUser.set(u));
  }

  loadFamilyRole() {
    this.familyService.getFamilies().subscribe((res: any) => {
      const first = res.families?.[0];
      this.currentFamilyRole.set(first?.role?.name ?? null);
      this.currentFamilyId.set(first?.family?.id ?? null);
    });
  }

  isFamilyAdmin(): boolean {
    return this.currentFamilyRole() === 'Familyadmin';
  }
}
