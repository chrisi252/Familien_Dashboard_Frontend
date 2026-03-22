import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeSwitchComponent } from '../../theme-switch-component/theme-switch-component';
import { FamilyService } from '../../../services/family-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-family',
  imports: [ThemeSwitchComponent, FormsModule],
  templateUrl: './create-family.html',
  styleUrl: './create-family.css',
})
export class CreateFamily {
  store = inject(FamilyService);
  errorMessage = '';
  isLoading = false;
  familyName = '';
  private router = inject(Router);

  onCancel() {
    this.router.navigate(['/family-selection']);
  }

  tryCreateFamily() {
    this.errorMessage = '';
    this.isLoading = true;

    const familyName = this.familyName.trim();
    if (!familyName) {
      this.errorMessage = 'Bitte gib einen gueltigen Familiennamen ein.';
      this.isLoading = false;
      return;
    }

    this.store.createFamily(familyName).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: { status?: number; error?: { error?: string } }) => {
        this.isLoading = false;
        if (error.status === 400) {
          this.errorMessage = error.error?.error ?? 'Bad Request: Name fehlt oder Benutzer wurde im Backend nicht gefunden.';
          return;
        }
        this.errorMessage = error.error?.error ?? 'Familie konnte nicht erstellt werden.';
      },
    });
  }

}
