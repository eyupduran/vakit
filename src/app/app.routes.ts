import { Routes } from '@angular/router';
import { CitySelectionComponent } from './features/city-selection/city-selection.component';
import { PrayerTimesComponent } from './features/prayer-times/prayer-times.component';
import { CityAuthGuard } from './core/guards/city-auth.guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'prayer-times', 
    pathMatch: 'full'
  },
  { 
    path: 'search', 
    component: CitySelectionComponent 
  },
  { 
    path: 'prayer-times', 
    component: PrayerTimesComponent,
    canActivate: [CityAuthGuard]
  },
  { 
    path: '**', 
    redirectTo: 'prayer-times' 
  }
];
