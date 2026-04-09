import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  isDarkMode = signal(false);

  constructor() {
    const savedTheme = localStorage.getItem('theme');
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

    localStorage.setItem('theme', themeName);
  }
}