import { Component, inject, signal } from '@angular/core';
import { ThemeSwitchComponent } from '../../theme-switch-component/theme-switch-component';
import { Router } from '@angular/router';
import { FamilyService } from '../../../services/family-service';
import { UserStateService } from '../../../services/user-state-service';
import { FormsModule } from '@angular/forms';
import { finalize, switchMap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { AlertBannerComponent } from '../../../shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-join-family',
  imports: [ThemeSwitchComponent, FormsModule, AlertBannerComponent],
  templateUrl: './join-family.html',
  styleUrl: './join-family.css',
})
export class JoinFamily {
  private familyService = inject(FamilyService);
  private userState = inject(UserStateService);
  private router = inject(Router);

  inviteCode = '';
  errorMessage = signal('');
  isLoading = signal(false);

  onCancel() {
    this.router.navigate(['/family-selection']);
  }

  tryJoinByCode() {
    this.errorMessage.set('');
    const code = this.inviteCode.trim().toUpperCase();

    if (!code || code.length !== 6) {
      this.errorMessage.set('Bitte gib einen gültigen 6-stelligen Einladungscode ein.');
      return;
    }

    this.isLoading.set(true);

    this.familyService.joinByCode(code).pipe(
      switchMap(() => this.userState.refreshFamilyContext()),
      finalize(() => this.isLoading.set(false)),
    ).subscribe({
      next: () => {
        this.router.navigate(['/dashboard']);
      },
      error: (error: HttpErrorResponse) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.mapJoinError(error));
      },
    });
  }

  private mapJoinError(error: HttpErrorResponse): string {
    if (error.status === 404) {
      return 'Der eingegebene Code ist ungültig. Bitte prüfe die 6 Zeichen.';
    }
    if (error.status === 409) {
      return 'Du bist dieser Familie bereits beigetreten.';
    }
    return error.error?.error ?? 'Beitreten fehlgeschlagen.';
  }
}
