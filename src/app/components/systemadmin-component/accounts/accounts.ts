import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../services/admin-service';

@Component({
  selector: 'app-systemadmin-accounts',
  imports: [FormsModule],
  templateUrl: './accounts.html',
})
export class SystemadminAccounts {
  private adminService = inject(AdminService);
  private destroyRef = inject(DestroyRef);

  username = signal('');
  password = signal('');
  firstName = signal('');
  lastName = signal('');

  isSaving = signal(false);
  successMessage = signal('');
  errorMessage = signal('');

  submit() {
    if (!this.username().trim() || !this.password().trim()) return;

    this.isSaving.set(true);
    this.successMessage.set('');
    this.errorMessage.set('');

    this.adminService.createAdminAccount({
      username: this.username(),
      password: this.password(),
      first_name: this.firstName(),
      last_name: this.lastName(),
    }).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.successMessage.set(`Admin-Account "${res.user.username}" wurde erstellt.`);
        this.username.set('');
        this.password.set('');
        this.firstName.set('');
        this.lastName.set('');
        this.isSaving.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.error ?? 'Fehler beim Erstellen des Accounts.');
        this.isSaving.set(false);
      },
    });
  }
}
