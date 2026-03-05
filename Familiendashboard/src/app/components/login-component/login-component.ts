import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ThemeSwitchComponent } from '../theme-switch-component/theme-switch-component';
import { AuthService } from '../../services/auth-service';

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
  private fb = inject(FormBuilder);



  loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  ngOnInit() {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.router.navigate(['/dashboard']);
    }
  }


  submit() {
   
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const payload={
      email: this.loginForm.controls.email.value,
      password: this.loginForm.controls.password.value
    }
    this.authService.login(payload).subscribe({
      next: (tokens) => {
        this.authService.storeTokens(tokens);
        this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        console.error('Login failed:', error);
        alert('Login failed. Please check your credentials.');
      }
    });
  }
}