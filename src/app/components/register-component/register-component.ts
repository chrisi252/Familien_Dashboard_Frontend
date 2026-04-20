import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeSwitchComponent } from '../theme-switch-component/theme-switch-component';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';
import { UserStateService } from '../../services/user-state-service';
import { AlertBannerComponent } from '../../shared/alert-banner/alert-banner.component';

@Component({
  selector: 'app-register-component',
  standalone: true,
  imports: [ThemeSwitchComponent, RouterLink, ReactiveFormsModule, AlertBannerComponent],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent {
  private router = inject(Router);
  private authService = inject(AuthService);
  private userState = inject(UserStateService);
  private fb = inject(FormBuilder);
  private cdr = inject(ChangeDetectorRef);

  errorMessage = '';
  isLoading = false;
  showPassword = false;

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    this.isLoading = true;
    const credentials = this.registerForm.getRawValue();

    this.authService.register(credentials).subscribe({
      next: async (response) => {
        console.log('Registration successful', response);
        await this.userState.initializeSession(true);
        this.router.navigate(['/family-selection']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.isLoading = false;
        if (error.error?.error) {
          this.errorMessage = error.error.error;
        } else {
          this.errorMessage = 'Registration failed. Please try again.';
        }
        this.cdr.markForCheck();
      },
    });
  }
}