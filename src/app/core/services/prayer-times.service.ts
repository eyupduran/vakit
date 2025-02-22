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
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    
    return this.http.get<PrayerTimes>(
      `${this.apiBaseUrl}/timesForPlace?id=${placeId}&date=${yesterday.toISOString().split('T')[0]}&days=4&timezoneOffset=180&calculationMethod=Turkey`
    );
  }
}
