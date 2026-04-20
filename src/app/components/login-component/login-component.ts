import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeSwitchComponent } from '../theme-switch-component/theme-switch-component';
import { AuthService } from '../../services/auth-service';
import { UserStateService } from '../../services/user-state-service';
import { AlertBannerComponent } from '../../shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ThemeSwitchComponent, RouterLink, ReactiveFormsModule, AlertBannerComponent],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userState = inject(UserStateService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  isLoading = false;
  showPassword = false;

  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  submit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    const payload = this.loginForm.getRawValue();

    this.authService.login(payload).subscribe({
      next: async () => {
        await this.userState.initializeSession(true);
        const user = this.userState.currentUser();
        if (user?.is_system_admin) {
          this.router.navigate(['/systemadmin']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (error: { error?: { error?: string } }) => {
        console.error('Login failed:', error);
        this.errorMessage = 'Login fehlgeschlagen. Bitte prüfe deine Daten.';
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
}