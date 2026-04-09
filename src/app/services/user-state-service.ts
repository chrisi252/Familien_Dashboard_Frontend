import { inject, Injectable, signal } from '@angular/core';
import { FamilyRoleName, User } from '../interfaces/user';
import { ProfileService } from './profile-service';
import { FamilyService } from './family-service';
import { catchError, map, of, tap, throwError } from 'rxjs';
import { firstValueFrom, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UserStateService {
  private static readonly SELECTED_FAMILY_STORAGE_KEY = 'selectedFamilyId';

  private profileService = inject(ProfileService);
  private familyService = inject(FamilyService);

  currentUser = signal<User | null>(null);
  currentFamilyRole = signal<FamilyRoleName | null>(null);
  currentFamilyId = signal<number | null>(null);
  isSessionInitialized = signal(false);

  async initializeSession(forceRefresh = false): Promise<void> {
    if (this.isSessionInitialized() && !forceRefresh) {
      return;
    }

    try {
      const profile = await firstValueFrom(this.profileService.getProfile());
      this.currentUser.set(profile);
      await firstValueFrom(this.refreshFamilyContext());
    } catch {
      this.clearSession();
    } finally {
      this.isSessionInitialized.set(true);
    }
  }

  loadCurrentUser() {
    this.profileService.getProfile().subscribe(u => this.currentUser.set(u));
  }

  loadFamilyRole() {
    this.refreshFamilyContext().subscribe();
  }

  refreshFamilyContext(): Observable<void> {
    return this.familyService.getFamilies().pipe(
      tap((res: unknown) => {
        const memberships = this.normalizeMemberships(res);
        this.applyActiveMembership(memberships);
      }),
      map(() => void 0),
    );
  }

  resolveCurrentFamilyId$(): Observable<number> {
    const activeFamilyId = this.currentFamilyId();
    if (activeFamilyId) {
      return of(activeFamilyId);
    }

    return this.refreshFamilyContext().pipe(
      map(() => {
        const resolvedFamilyId = this.currentFamilyId();
        if (!resolvedFamilyId) {
          throw new Error('Keine aktive Familie gefunden');
        }

        return resolvedFamilyId;
      }),
      catchError((error) => throwError(() => error)),
    );
  }

  selectFamily(familyId: number, role: FamilyRoleName | null): void {
    this.currentFamilyId.set(familyId);
    this.currentFamilyRole.set(role);
    this.persistSelectedFamilyId(familyId);
  }

  clearSession(): void {
    this.currentUser.set(null);
    this.currentFamilyId.set(null);
    this.currentFamilyRole.set(null);
    this.isSessionInitialized.set(false);
    this.clearPersistedFamilyId();
  }

  isFamilyAdmin(): boolean {
    return this.currentFamilyRole() === 'Familyadmin';
  }

  private applyActiveMembership(memberships: Array<{ familyId: number; role: FamilyRoleName | null }>): void {
    if (memberships.length === 0) {
      this.currentFamilyRole.set(null);
      this.currentFamilyId.set(null);
      this.clearPersistedFamilyId();
      return;
    }

    const preferredFamilyId = this.currentFamilyId() ?? this.readPersistedFamilyId();
    const selectedMembership =
      preferredFamilyId !== null
        ? memberships.find((membership) => membership.familyId === preferredFamilyId) ?? null
        : null;

    const activeMembership = selectedMembership ?? memberships[0];
    this.currentFamilyRole.set(activeMembership.role);
    this.currentFamilyId.set(activeMembership.familyId);
    this.persistSelectedFamilyId(activeMembership.familyId);
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

  private persistSelectedFamilyId(familyId: number): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(UserStateService.SELECTED_FAMILY_STORAGE_KEY, String(familyId));
  }

  private readPersistedFamilyId(): number | null {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    const rawFamilyId = localStorage.getItem(UserStateService.SELECTED_FAMILY_STORAGE_KEY);
    return this.toPositiveNumber(rawFamilyId);
  }

  private clearPersistedFamilyId(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.removeItem(UserStateService.SELECTED_FAMILY_STORAGE_KEY);
  }
}
