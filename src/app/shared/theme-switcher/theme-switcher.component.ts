import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'app-theme-switcher',
  template: `
    <button class="theme-toggle" (click)="toggleTheme()">
      <i class="pi" [ngClass]="(isDarkTheme$ | async) ? 'pi-sun' : 'pi-moon'"></i>
    </button>
  `,
  styles: [`
    .theme-toggle {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: background-color 0.3s;
    }
    
    .theme-toggle:hover {
      background-color: rgba(0, 0, 0, 0.1);
    }

    .pi {
      font-size: 1.5rem;
    }
  `],
  standalone: true,
  imports: [CommonModule]
})
export class ThemeSwitcherComponent {
  isDarkTheme$ = this.themeService.isDarkTheme$;

  constructor(private themeService: ThemeService) {}

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
