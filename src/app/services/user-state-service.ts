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
    this.familyService.getFamilies().subscribe((res: unknown) => {
      const memberships = this.normalizeMemberships(res);
      if (memberships.length === 0) {
        this.currentFamilyRole.set(null);
        this.currentFamilyId.set(null);
        return;
      }

      const selectedFamilyId = this.currentFamilyId();
      const selectedMembership =
        selectedFamilyId !== null
          ? memberships.find((membership) => membership.familyId === selectedFamilyId) ?? null
          : null;

      const activeMembership = selectedMembership ?? memberships[0];
      this.currentFamilyRole.set(activeMembership.role);
      this.currentFamilyId.set(activeMembership.familyId);
    });
  }

  isFamilyAdmin(): boolean {
    return this.currentFamilyRole() === 'Familyadmin';
  }

  private normalizeMemberships(response: unknown): Array<{ familyId: number; role: FamilyRoleName | null }> {
    const entries = this.extractFamilyEntries(response);

    return entries
      .map((entry) => {
        if (!entry || typeof entry !== 'object') {
          return null;
        }

        const item = entry as Record<string, unknown>;
        const familyObject =
          item['family'] && typeof item['family'] === 'object'
            ? (item['family'] as Record<string, unknown>)
            : item;
        const roleObject =
          item['role'] && typeof item['role'] === 'object'
            ? (item['role'] as Record<string, unknown>)
            : null;

        const familyId = this.toPositiveNumber(
          familyObject['id'] ?? familyObject['family_id'] ?? familyObject['familyId'] ?? item['family_id'] ?? item['familyId'],
        );

        if (!familyId) {
          return null;
        }

        const role = this.toFamilyRoleName(roleObject?.['name'] ?? item['role_name'] ?? item['roleName']);

        return { familyId, role };
      })
      .filter((entry): entry is { familyId: number; role: FamilyRoleName | null } => entry !== null);
  }

  private extractFamilyEntries(response: unknown): unknown[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const typed = response as { families?: unknown };
    return Array.isArray(typed.families) ? typed.families : [];
  }

  private toPositiveNumber(value: unknown): number | null {
    if (typeof value === 'number' && Number.isFinite(value) && value > 0) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = Number(value);
      if (Number.isFinite(parsed) && parsed > 0) {
        return parsed;
      }
    }

    return null;
  }

  private toFamilyRoleName(value: unknown): FamilyRoleName | null {
    if (value === 'Familyadmin' || value === 'Guest' || value === 'SystemAdmin') {
      return value;
    }

    return null;
  }
}
