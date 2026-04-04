import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header-component/header-component';
import { ProfileService } from '../../services/profile-service';
import { FamilyService } from '../../services/family-service';
import { UserStateService } from '../../services/user-state-service';
import { User, FamilyMembership } from '../../interfaces/user';

@Component({
  selector: 'app-profile-component',
  imports: [HeaderComponent, FormsModule],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private familyService = inject(FamilyService);
  private userState = inject(UserStateService);
  private router = inject(Router);

  user = signal<User | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  families = signal<FamilyMembership[]>([]);
  familiesLoading = signal(false);

  joinFamilyId = '';
  joinError = signal('');
  joinLoading = signal(false);
  joinSuccess = signal(false);

  ngOnInit(): void {
    this.loadProfile();
    this.loadFamilies();
  }

  loadProfile() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.profileService.getProfile().subscribe({
      next: (profile) => {
        if (!profile || !profile.username) {
          this.user.set(null);
          this.errorMessage.set('Profilantwort erhalten, aber ohne gueltige Nutzerdaten.');
          this.isLoading.set(false);
          return;
        }
        this.user.set(profile);
        this.isLoading.set(false);
      },
      error: (error: { status?: number; error?: { error?: string } }) => {
        this.isLoading.set(false);
        if (error.status === 401) {
          this.errorMessage.set('Session abgelaufen oder ungueltig. Bitte erneut einloggen.');
          return;
        }
        this.errorMessage.set(error.error?.error ?? 'Profil konnte nicht geladen werden.');
      },
    });
  }

  loadFamilies() {
    this.familiesLoading.set(true);
    this.familyService.getFamilies().subscribe({
      next: (res: unknown) => {
        this.families.set(this.normalizeFamiliesResponse(res));
        this.familiesLoading.set(false);
      },
      error: () => {
        this.familiesLoading.set(false);
      }
    });
  }

  selectFamily(membership: FamilyMembership) {
    this.userState.currentFamilyId.set(membership.family.id);
    this.userState.currentFamilyRole.set(membership.role.name);
    this.router.navigate(['/dashboard']);
  }

  joinFamily() {
    const parsedId = Number(this.joinFamilyId);
    if (!this.joinFamilyId || Number.isNaN(parsedId) || parsedId <= 0) {
      this.joinError.set('Bitte gib eine gueltige Familien-ID ein.');
      return;
    }

    this.joinError.set('');
    this.joinLoading.set(true);
    this.joinSuccess.set(false);

    this.familyService.joinFamily(parsedId).subscribe({
      next: () => {
        this.joinLoading.set(false);
        this.joinSuccess.set(true);
        this.joinFamilyId = '';
        this.loadFamilies();
      },
      error: (error: { error?: { error?: string } }) => {
        this.joinLoading.set(false);
        this.joinError.set(error.error?.error ?? 'Familie konnte nicht beigetreten werden.');
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  formatDate(dateAsString: string): string {
    const date = new Date(dateAsString);
    if (Number.isNaN(date.getTime())) {
      return '-';
    }
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  }

  private normalizeFamiliesResponse(response: unknown): FamilyMembership[] {
    const entries = this.extractFamilyEntries(response);
    return entries
      .map((entry) => this.normalizeMembership(entry))
      .filter((entry): entry is FamilyMembership => entry !== null);
  }

  private extractFamilyEntries(response: unknown): unknown[] {
    if (Array.isArray(response)) {
      return response;
    }

    if (!response || typeof response !== 'object') {
      return [];
    }

    const typed = response as { families?: unknown };
    if (Array.isArray(typed.families)) {
      return typed.families;
    }

    return [];
  }

  private normalizeMembership(entry: unknown): FamilyMembership | null {
    if (!entry || typeof entry !== 'object') {
      return null;
    }

    const item = entry as Record<string, any>;
    const familyData = (item['family'] && typeof item['family'] === 'object') ? item['family'] : item;
    const roleData = (item['role'] && typeof item['role'] === 'object') ? item['role'] : null;

    const familyId = this.toPositiveNumber(
      familyData?.id ?? familyData?.family_id ?? familyData?.familyId ?? item['family_id'] ?? item['familyId'],
    );

    if (!familyId) {
      return null;
    }

    const roleNameRaw = roleData?.name ?? item['role_name'] ?? item['roleName'];
    const roleName = this.toFamilyRoleName(roleNameRaw);

    return {
      family: {
        id: familyId,
        name: String(familyData?.name ?? item['family_name'] ?? item['familyName'] ?? `Familie ${familyId}`),
        created_at: String(familyData?.created_at ?? familyData?.createdAt ?? item['created_at'] ?? item['createdAt'] ?? ''),
      },
      role: {
        id: this.toPositiveNumber(roleData?.id ?? item['role_id'] ?? item['roleId']) ?? 0,
        name: roleName,
      },
    };
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

  private toFamilyRoleName(value: unknown): 'Familyadmin' | 'Guest' | 'SystemAdmin' {
    if (value === 'Familyadmin' || value === 'Guest' || value === 'SystemAdmin') {
      return value;
    }
    return 'Guest';
  }
}
