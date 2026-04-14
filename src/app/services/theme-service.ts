import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    const savedTheme = sessionStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = signal(true);
      this.applyTheme();
    }
  }

  toggleTheme() {
      this.isDarkMode .set(!this.isDarkMode());
    this.applyTheme();
  }

  private applyTheme() {
    const themeName = this.isDarkMode() ? 'dark' : 'light';

    document.documentElement.setAttribute('data-theme', themeName);

    sessionStorage.setItem('theme', themeName);
  }
}