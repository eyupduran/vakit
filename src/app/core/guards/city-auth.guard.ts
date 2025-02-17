import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { LocationService } from '../services/location.service';

@Injectable({
  providedIn: 'root'
})
export class CityAuthGuard implements CanActivate {
  constructor(
    private locationService: LocationService,
    private router: Router
  ) {}

  canActivate(): boolean {
    if (!this.locationService.hasStoredCity()) {
      this.router.navigate(['/search']);
      return false;
    }
    return true;
  }
}