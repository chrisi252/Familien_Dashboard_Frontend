import { Component, DestroyRef, OnInit, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header-component/header-component';
import { ProfileService } from '../../services/profile-service';
import { FamilyService } from '../../services/family-service';
import { FamilyAdapterService } from '../../services/family-adapter.service';
import { UserStateService } from '../../services/user-state-service';
import { User, FamilyMembership } from '../../interfaces/user';
import { firstValueFrom } from 'rxjs';
import { ProfileInfoComponent } from './profile-info/profile-info.component';
import { FamilyListComponent } from './family-list/family-list.component';
import { JoinFamilyFormComponent } from './join-family-form/join-family-form.component';

@Component({
  selector: 'app-profile-component',
  standalone: true,
  imports: [HeaderComponent, ProfileInfoComponent, FamilyListComponent, JoinFamilyFormComponent],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private familyService = inject(FamilyService);
  private familyAdapter = inject(FamilyAdapterService);
  private userState = inject(UserStateService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  user = signal<User | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  families = signal<FamilyMembership[]>([]);
  familiesLoading = signal(false);

  joinError = signal('');
  joinLoading = signal(false);
  joinSuccess = signal(false);

  deletingFamilyId = signal<number | null>(null);
  deleteError = signal('');
  deleteLoading = signal(false);

  ngOnInit(): void {
    this.loadProfile();
    this.loadFamilies();
  }

  loadProfile() {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.profileService.getProfile().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
    this.familyService.getFamilies().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res: unknown) => {
        this.families.set(this.familyAdapter.normalizeFamiliesResponse(res));
        this.familiesLoading.set(false);
      },
      error: () => this.familiesLoading.set(false),
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToDashboard() {
    this.router.navigate(['/dashboard']);
  }

  selectFamily(membership: FamilyMembership) {
    this.userState.selectFamily(membership.family.id, membership.role.name);
    this.router.navigate(['/dashboard']);
  }

  joinFamily(code: string) {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed || trimmed.length !== 6) {
      this.joinError.set('Bitte gib einen gültigen 6-stelligen Einladungscode ein.');
      return;
    }

    this.joinError.set('');
    this.joinLoading.set(true);
    this.joinSuccess.set(false);

    this.familyService.joinByCode(trimmed).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: async () => {
        await firstValueFrom(this.userState.refreshFamilyContext());
        this.joinLoading.set(false);
        this.joinSuccess.set(true);
        this.loadFamilies();
      },
      error: (error: { error?: { error?: string } }) => {
        this.joinLoading.set(false);
        this.joinError.set(error.error?.error ?? 'Familie konnte nicht beigetreten werden.');
      },
    });
  }

  startDeleteFamily(familyId: number) {
    this.deletingFamilyId.set(familyId);
    this.deleteError.set('');
  }

  confirmDeleteFamily() {
    const familyId = this.deletingFamilyId();
    if (!familyId) return;

    this.deleteLoading.set(true);
    this.deleteError.set('');

    this.familyService.deleteFamily(familyId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.deleteLoading.set(false);
        this.deletingFamilyId.set(null);
        this.userState.currentFamilyId.set(null);
        this.userState.currentFamilyRole.set(null);
        this.loadFamilies();
      },
      error: (error: { error?: { error?: string } }) => {
        this.deleteLoading.set(false);
        this.deleteError.set(error.error?.error ?? 'Familie konnte nicht gelöscht werden.');
      },
    });
  }

  cancelDelete() {
    this.deletingFamilyId.set(null);
    this.deleteError.set('');
  }
}
