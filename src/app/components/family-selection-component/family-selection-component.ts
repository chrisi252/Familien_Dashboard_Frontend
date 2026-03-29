import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ThemeSwitchComponent } from '../theme-switch-component/theme-switch-component';

@Component({
  selector: 'app-family-selection-component',
  standalone: true,
  imports: [ThemeSwitchComponent, RouterOutlet],
  templateUrl: './family-selection-component.html',
  styleUrl: './family-selection-component.css',
})
export class FamilySelectionComponent {
  private router = inject(Router);

  isLoading = false;
  errorMessage = '';

  /**
   * Prüft, ob gerade eine Child-Route aktiv ist
   */
  isChildRoute(): boolean {
    return this.router.url.includes('/join') || this.router.url.includes('/create');
  }


  onJoinFamily() {
    this.isLoading = true;
    this.errorMessage = '';



    console.log('Join Family clicked');
    this.isLoading = false;
       this.router.navigate(['/family-selection/join']);
  }


  onCreateFamily() {
    this.isLoading = true;
    this.errorMessage = '';



    console.log('Create Family clicked');
    this.isLoading = false;
    this.router.navigate(['/family-selection/create']);
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
