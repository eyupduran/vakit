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
        class="p-button-text"
        (click)="navigateToCitySelection()">
      </button>
    </div>
  `,
  styles: [`
    .city-nav {
      display: flex;
      justify-content: flex-end;
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