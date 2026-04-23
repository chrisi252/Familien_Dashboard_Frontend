import { Component, inject, signal } from '@angular/core';
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

  errorMessage = signal('');
  isLoading = signal(false);
  showPassword = false;

  registerForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    first_name: ['', [Validators.required]],
    last_name: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

 

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');
    this.isLoading.set(true);
    const credentials = this.registerForm.getRawValue();

    this.authService.register(credentials).subscribe({
      next: async (response) => {
        console.log('Registration successful', response);
        await this.userState.initializeSession(true);
        this.router.navigate(['/family-selection']);
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.isLoading.set(false);
        if (error.error?.error) {
          this.errorMessage.set(error.error.error);
        } else {
          this.errorMessage.set('Registrierung fehlgeschlagen. Bitte versuche es erneut.');
        }
      },
    });
  }
}