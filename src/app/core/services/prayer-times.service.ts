import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PrayerTimes } from '../models/prayer-times.interface';

@Injectable({
  providedIn: 'root'
})
export class PrayerTimesService {
  private apiBaseUrl = 'https://vakit.vercel.app/api';

  constructor(private http: HttpClient) {}

  getPrayerTimes(placeId: number): Observable<PrayerTimes> {
    const today = new Date();
    // Get 2 days before today
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 2);
    
    return this.http.get<PrayerTimes>(
      `${this.apiBaseUrl}/timesForPlace?id=${placeId}&date=${startDate.toISOString().split('T')[0]}&days=5&timezoneOffset=180&calculationMethod=Turkey`
    );
  }
}
