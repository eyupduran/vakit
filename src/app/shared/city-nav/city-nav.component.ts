import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { LocationService } from '../../core/services/location.service';

@Component({
  selector: 'app-city-nav',
  template: `
    <div class="city-nav" *ngIf="(selectedPlace$ | async) as place">
      <button pButton 
        icon="pi pi-map-marker" 
        label="Şehir Değiştir" 
        class="p-button-text city-button"
        (click)="navigateToCitySelection()">
      </button>
    </div>
  `,
  styles: [`
    .city-nav {
      display: flex;
      justify-content: flex-end;
    }

    :host ::ng-deep {
      .city-button {
        padding: 0.5rem 0.75rem;
        font-size: 0.9rem;
        background: rgba(var(--primary-color-rgb), 0.1);
        color: var(--primary-color);
        border-radius: 20px;
        transition: all 0.3s ease;

        &:hover {
          background: rgba(var(--primary-color-rgb), 0.15) !important;
          transform: translateY(-1px);
        }

        .p-button-icon {
          font-size: 0.9rem;
        }
      }

      @media (max-width: 768px) {
        .city-button {
          padding: 0.35rem 0.6rem;
          font-size: 0.7rem;

          .p-button-icon {
            font-size: 0.7rem;
          }
        }
      }
    }
  `],
  standalone: true,
  imports: [CommonModule, ButtonModule]
})
export class CityNavComponent {
  selectedPlace$ = this.locationService.getSelectedPlace();

  constructor(
    private locationService: LocationService,
    private router: Router
  ) {}

  navigateToCitySelection() {
    this.locationService.clearSelectedPlace();
    this.router.navigate(['/search']);
  }
}