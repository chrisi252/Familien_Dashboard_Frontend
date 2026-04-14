import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeSwitchComponent } from '../theme-switch-component/theme-switch-component';
import { AuthService } from '../../services/auth-service';
import { UserStateService } from '../../services/user-state-service';

@Component({
  selector: 'app-login-component',
  standalone: true,
  imports: [ThemeSwitchComponent, RouterLink, ReactiveFormsModule],
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



  loginForm = this.fb.nonNullable.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  submit() {

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage = '';
    const payload = this.loginForm.getRawValue();

    this.authService.login(payload).subscribe({
      next: async () => {
        await this.userState.initializeSession(true);
        this.router.navigate(['/dashboard']);
      },
      error: (error: { error?: { error?: string } }) => {
        console.error('Login failed:', error);
        this.errorMessage = error.error?.error ?? 'Login fehlgeschlagen. Bitte pruefe deine Daten.';
        this.cdr.markForCheck();
      }
    });
  }
}