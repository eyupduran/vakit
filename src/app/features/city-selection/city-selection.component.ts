import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { Router } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { debounceTime, distinctUntilChanged } from 'rxjs';

@Component({
  selector: 'app-city-selection',
  templateUrl: './city-selection.component.html',
  styleUrls: ['./city-selection.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    CardModule
  ]
})
export class CitySelectionComponent {
  searchQuery: string = '';
  searchResults: any[] = [];
  loading$ = this.locationService.isLoading();

  constructor(
    private locationService: LocationService,
    private router: Router
  ) {
    // Clear any existing city when component initializes
    this.locationService.clearSelectedPlace();
  }

  onSearchChange(query: string) {
    if (query.length >= 3) {
      this.locationService.searchPlaces(query)
        .pipe(
          debounceTime(300),
          distinctUntilChanged()
        )
        .subscribe(results => {
          this.searchResults = results;
        });
    } else {
      this.searchResults = [];
    }
  }

  onPlaceSelect(place: any) {
    this.locationService.setSelectedPlace(place);
    this.router.navigate(['/prayer-times']);
  }

  trackByPlaceId(index: number, place: any): number {
    return place.id;
  }
}
