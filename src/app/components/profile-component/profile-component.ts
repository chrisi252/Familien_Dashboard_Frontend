import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from '../header-component/header-component';
import { ProfileService } from '../../services/profile-service';
import { User } from '../../interfaces/user';

@Component({
  selector: 'app-profile-component',
  imports: [HeaderComponent],
  templateUrl: './profile-component.html',
  styleUrl: './profile-component.css',
})
export class ProfileComponent implements OnInit {
  private profileService = inject(ProfileService);
  private router = inject(Router);

  user = signal<User | null>(null);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit(): void {
    if (!localStorage.getItem('accessToken')) {
      this.isLoading.set(false);
      this.errorMessage.set('Du bist nicht eingeloggt. Bitte melde dich zuerst an.');
      return;
    }

    this.loadProfile();
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

}
