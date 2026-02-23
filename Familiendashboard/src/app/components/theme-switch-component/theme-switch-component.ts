import { Component } from '@angular/core';

@Component({
  selector: 'app-theme-switch-component',
  imports: [],
  templateUrl: './theme-switch-component.html',
  styleUrl: './theme-switch-component.css',
})
export class ThemeSwitchComponent {
isDarkMode = false;

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    const themeName = this.isDarkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', themeName);
  }
}
