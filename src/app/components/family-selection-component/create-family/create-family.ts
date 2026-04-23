import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeSwitchComponent } from '../../theme-switch-component/theme-switch-component';
import { FamilyService } from '../../../services/family-service';
import { UserStateService } from '../../../services/user-state-service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { AlertBannerComponent } from '../../../shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-create-family',
  imports: [ThemeSwitchComponent, FormsModule, AlertBannerComponent],
  templateUrl: './create-family.html',
  styleUrl: './create-family.css',
})
export class CreateFamily {
  store = inject(FamilyService);
  private userState = inject(UserStateService);
  private router = inject(Router);

  errorMessage = signal('');
  isLoading = signal(false);
  familyName = '';

  onCancel() {
    this.router.navigate(['/family-selection']);
  }

  tryCreateFamily() {
    this.errorMessage.set('');
    this.isLoading.set(true);

    const familyName = this.familyName.trim();
    if (!familyName) {
      this.errorMessage.set('Bitte gib einen gueltigen Familiennamen ein.');
      this.isLoading.set(false);
      return;
    }

    this.store.createFamily(familyName).subscribe({
      next: async () => {
        await firstValueFrom(this.userState.refreshFamilyContext());
        this.isLoading.set(false);
        this.router.navigate(['/dashboard']);
      },
      error: (error: { status?: number; error?: { error?: string } }) => {
        this.isLoading.set(false);
        if (error.status === 400) {
          this.errorMessage.set(error.error?.error ?? 'Bad Request: Name fehlt oder Benutzer wurde im Backend nicht gefunden.');
        } else {
          this.errorMessage.set(error.error?.error ?? 'Familie konnte nicht erstellt werden.');
        }
      },
    });
  }
}
