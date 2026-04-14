import { Component, inject } from '@angular/core';
import { ThemeSwitchComponent } from '../../theme-switch-component/theme-switch-component';
import { Router } from '@angular/router';
import { FamilyService } from '../../../services/family-service';
import { UserStateService } from '../../../services/user-state-service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-join-family',
  imports: [ThemeSwitchComponent, FormsModule],
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
    this.familyService.joinByCode(code).subscribe({
      next: async () => {
        await firstValueFrom(this.userState.refreshFamilyContext());
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: { error?: { error?: string } }) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error ?? 'Beitreten fehlgeschlagen.';
      },
    });
  }
}
