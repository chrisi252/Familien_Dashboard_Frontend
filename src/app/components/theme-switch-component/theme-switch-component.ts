import { Component } from '@angular/core';
import { ThemeService } from '../../services/theme-service';


@Component({
  selector: 'app-theme-switch-component',
  imports: [],
  templateUrl: './theme-switch-component.html',
  styleUrl: './theme-switch-component.css',
})
export class ThemeSwitchComponent {
  constructor(public themeService: ThemeService) {}

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}