import { Component, inject } from '@angular/core';
import { ThemeSwitchComponent } from '../../theme-switch-component/theme-switch-component';
import { Router } from '@angular/router';
import { FamilyService } from '../../../services/family-service';
import { UserStateService } from '../../../services/user-state-service';
import { FormsModule } from '@angular/forms';
import { finalize, firstValueFrom, switchMap } from 'rxjs';
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
  errorMessage = '';
  isLoading = false;

  onCancel() {
    this.router.navigate(['/family-selection']);
  }

  tryJoinByCode() {
  this.errorMessage = '';
  const code = this.inviteCode.trim().toUpperCase();

  if (!code || code.length !== 6) {
    this.errorMessage = 'Bitte gib einen gültigen 6-stelligen Einladungscode ein.';
    return;
  }

  this.isLoading = true;

  this.familyService.joinByCode(code).pipe(
    // Chain the next observable after joinByCode succeeds
    switchMap(() => this.userState.refreshFamilyContext()),
    // finalize guarantees execution whether the stream completes successfully or errors out
    finalize(() => {
      this.isLoading = false;
    })
  ).subscribe({
    next: () => {
      this.router.navigate(['/dashboard']);
    },
    error: (error: any) => {
      // Errors from BOTH joinByCode and refreshFamilyContext will land here
      this.errorMessage = error.error?.error ?? 'Beitreten fehlgeschlagen.';
    },
  });
}

}