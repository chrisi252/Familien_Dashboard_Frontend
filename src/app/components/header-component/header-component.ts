import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ThemeSwitchComponent } from "../theme-switch-component/theme-switch-component";
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth-service';
import { UserStateService } from '../../services/user-state-service';

@Component({
  selector: 'app-header-component',
  imports: [ThemeSwitchComponent, RouterLink],
  templateUrl: './header-component.html',
  styleUrl: './header-component.css',
})
export class HeaderComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  userStateService = inject(UserStateService);

  ngOnInit() {
    this.userStateService.loadFamilyRole();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => this.router.navigate(['/login'])
    });
  }
}
