import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map, tap, throwError } from 'rxjs';

interface SearchPlace {
  country: string;
  id: number;
  name: string;
  countryCode: string;
  stateName: string;
  latitude: number;
  longitude: number;
  alternativeNames: string[];
  isMatchingAlternativeName: boolean;
  prefixMatchCount: number;
  matchingString: string;
}

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiBaseUrl = 'https://vakit.vercel.app/api';
  private selectedPlace = new BehaviorSubject<SearchPlace | null>(null);
  private loading = new BehaviorSubject<boolean>(false);
  private readonly STORAGE_KEY = 'selectedCity';

  constructor(private http: HttpClient) {
    this.loadStoredCity();
  }

  private loadStoredCity() {
    try {
      const storedCity = localStorage.getItem(this.STORAGE_KEY);
      if (storedCity) {
        const parsedCity = JSON.parse(storedCity);
        if (this.isValidSearchPlace(parsedCity)) {
          this.selectedPlace.next(parsedCity);
        } else {
          // Invalid data structure, clear it
          this.clearSelectedPlace();
        }
      }
    } catch (error) {
      console.error('Error loading stored city:', error);
      // If there's an error parsing the stored city, clear it
      this.clearSelectedPlace();
    }
  }

  private isValidSearchPlace(data: any): data is SearchPlace {
    return data 
      && typeof data === 'object'
      && typeof data.id === 'number'
      && typeof data.name === 'string'
      && typeof data.countryCode === 'string'
      && typeof data.stateName === 'string';
  }

  isLoading(): Observable<boolean> {
    return this.loading.asObservable();
  }

  searchPlaces(query: string): Observable<SearchPlace[]> {
    this.loading.next(true);
    return this.http.get<SearchPlace[]>(
      `${this.apiBaseUrl}/searchPlaces?q=${encodeURIComponent(query)}&lat=null&lng=null&lang=tr&countryCode=tr`
    ).pipe(
      tap(() => this.loading.next(false)),
      catchError(this.handleError)
    );
  }

  setSelectedPlace(place: SearchPlace) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(place));
      this.selectedPlace.next(place);
    } catch (error) {
      console.error('Error saving city:', error);
    }
  }

  getSelectedPlace(): Observable<SearchPlace | null> {
    return this.selectedPlace.asObservable();
  }

  hasStoredCity(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }

  clearSelectedPlace() {
    localStorage.removeItem(this.STORAGE_KEY);
    this.selectedPlace.next(null);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'Bir hata oluştu.';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Hata kodu: ${error.status}, mesaj: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => errorMessage);
  }
}
