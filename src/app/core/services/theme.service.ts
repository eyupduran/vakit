import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private isDarkTheme = new BehaviorSubject<boolean>(false);
  isDarkTheme$ = this.isDarkTheme.asObservable();
  private readonly THEME_KEY = 'isDarkTheme';

  constructor() {
    this.loadStoredTheme();
  }

  private loadStoredTheme() {
    const storedTheme = localStorage.getItem(this.THEME_KEY);
    if (storedTheme) {
      const isDark = JSON.parse(storedTheme);
      this.isDarkTheme.next(isDark);
      this.applyTheme(isDark);
    }
  }

  toggleTheme() {
    const newTheme = !this.isDarkTheme.value;
    this.isDarkTheme.next(newTheme);
    localStorage.setItem(this.THEME_KEY, JSON.stringify(newTheme));
    this.applyTheme(newTheme);
  }

  private applyTheme(isDark: boolean) {
    document.body.classList.toggle('dark-theme', isDark);
    
    const root = document.documentElement;
    if (isDark) {
      // Ana tema renkleri
      root.style.setProperty('--primary-color', '#90CAF9');     // Daha parlak mavi
      root.style.setProperty('--secondary-color', '#CE93D8');   // Daha parlak mor
      root.style.setProperty('--primary-color-rgb', '144, 202, 249');
      root.style.setProperty('--secondary-color-rgb', '206, 147, 216');
      
      // Ek aydınlık renkler
      root.style.setProperty('--surface-card', '#1E1E1E');      // Daha koyu arka plan
      root.style.setProperty('--text-color', 'rgba(255, 255, 255, 0.95)');
      root.style.setProperty('--text-secondary-color', 'rgba(255, 255, 255, 0.7)');
    } else {
      root.style.setProperty('--primary-color', '#2196F3');
      root.style.setProperty('--secondary-color', '#673AB7');
      root.style.setProperty('--primary-color-rgb', '33, 150, 243');
      root.style.setProperty('--secondary-color-rgb', '103, 58, 183');
      
      // Varsayılan aydınlık renkler
      root.style.setProperty('--surface-card', '#ffffff');
      root.style.setProperty('--text-color', 'rgba(0, 0, 0, 0.87)');
      root.style.setProperty('--text-secondary-color', 'rgba(0, 0, 0, 0.6)');
    }
  }
}
