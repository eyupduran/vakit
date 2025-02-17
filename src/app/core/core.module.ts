import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from './services/theme.service';
import { LocationService } from './services/location.service';
import { PrayerTimesService } from './services/prayer-times.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [
    ThemeService,
    LocationService,
    PrayerTimesService
  ]
})
export class CoreModule { }
