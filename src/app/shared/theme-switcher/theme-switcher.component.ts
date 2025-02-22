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
      background: rgba(var(--primary-color-rgb), 0.1);
      border: none;
      cursor: pointer;
      padding: 8px;
      border-radius: 50%;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      margin-left: 4px;
    }
    
    .theme-toggle:hover {
      background: rgba(var(--primary-color-rgb), 0.15);
      transform: translateY(-1px);
    }

    .pi {
      font-size: 1.1rem;
      color: var(--primary-color);
    }

    @media (max-width: 768px) {
      .theme-toggle {
        width: 28px;
        height: 28px;
        padding: 6px;
      }
      
      .pi {
        font-size: 1rem;
      }
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
