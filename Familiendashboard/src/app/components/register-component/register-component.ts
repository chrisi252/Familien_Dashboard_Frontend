import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { ThemeSwitchComponent } from '../theme-switch-component/theme-switch-component';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth-service';


@Component({
  selector: 'app-register-component',
  imports: [ThemeSwitchComponent,RouterLink,ReactiveFormsModule],
  templateUrl: './register-component.html',
  styleUrl: './register-component.css',
})
export class RegisterComponent{
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  registerForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  register() {
    if (this.registerForm.valid) {
      const credentials = this.registerForm.getRawValue();  
      
     /* this.authService.register(credentials).subscribe({
        next: (response: any) => {
          console.log('Registration successful', response);
          this.router.navigate(['/login']); 
        },
        error: (error: any) => {
          console.error('Registration failed:', error);
        }
      });
    } else {
      this.registerForm.markAllAsTouched();
     */
      // Da die Register-Methode im AuthService noch nicht implementiert ist, navigieren wir einfach zum Login
      this.router.navigate(['/login']);
    }
     
  }

}