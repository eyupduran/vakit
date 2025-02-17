import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TabViewModule } from 'primeng/tabview';
import { Router } from '@angular/router';
import { LocationService } from '../../core/services/location.service';
import { PrayerTimesService } from '../../core/services/prayer-times.service';
import { LoadingComponent } from '../../shared/loading/loading.component';
import { filter, switchMap, takeUntil, take } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-prayer-times',
  templateUrl: './prayer-times.component.html',
  styleUrls: ['./prayer-times.component.scss'],
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TabViewModule, LoadingComponent]
})
export class PrayerTimesComponent implements OnInit {
  selectedPlace$ = this.locationService.getSelectedPlace();
  loading$ = this.locationService.isLoading();
  nextPrayerTime: { 
    name: string; 
    time: string; 
    remainingTime: { 
      hours: number; 
      minutes: number; 
      seconds: number;
    };
    progress: number;
  } | null = null;
  activeTabIndex = 0;
  private destroy$ = new Subject<void>();

  prayerTimes$ = this.selectedPlace$.pipe(
    filter(place => place !== null),
    switchMap(place => this.prayerTimesService.getPrayerTimes(place!.id))
  );

  constructor(
    private locationService: LocationService,
    private prayerTimesService: PrayerTimesService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedPlace$.pipe(
      filter(place => place === null),
    ).subscribe(() => {
      this.router.navigate(['/search']);
    });

    // Vakitleri al ve sayacı başlat
    this.prayerTimes$.pipe(
      takeUntil(this.destroy$)
    ).subscribe(times => {
      // Bugünün indexini bul ve active tab olarak ayarla
      const dates = Object.keys(times.times);
      const todayIndex = dates.findIndex(date => this.isToday(new Date(date)));
      if (todayIndex !== -1) {
        // Tab indeksi olarak 1 ayarlayalım (dün:0, bugün:1, yarın:2)
        this.activeTabIndex = 1;
      }

      // İlk yüklemede sayacı başlat ve daha sık güncelle
      this.updateNextPrayer(times);
      const timer = setInterval(() => {
        this.updateNextPrayer(times);
      }, 100); // 1000ms yerine 100ms

      // Component destroy edildiğinde timer'ı temizle
      this.destroy$.pipe(take(1)).subscribe(() => {
        clearInterval(timer);
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateNextPrayer(times: any): void {
    const prayerNames = ['İmsak', 'Güneş', 'Öğle', 'İkindi', 'Akşam', 'Yatsı'];
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    
    if (!times || !times.times[today]) return;

    const todayTimes = times.times[today];
    const currentTimeInSeconds = now.getHours() * 3600 + now.getMinutes() * 60 + now.getSeconds();

    for (let i = 0; i < todayTimes.length; i++) {
      const [hours, minutes] = todayTimes[i].split(':').map(Number);
      const prayerTimeInSeconds = hours * 3600 + minutes * 60;

      if (prayerTimeInSeconds > currentTimeInSeconds) {
        const remainingSeconds = prayerTimeInSeconds - currentTimeInSeconds;
        const hours = Math.floor(remainingSeconds / 3600);
        const minutes = Math.floor((remainingSeconds % 3600) / 60);
        const seconds = remainingSeconds % 60;

        // Calculate progress
        let progress = 0;
        if (i > 0) {
          const [prevHours, prevMinutes] = todayTimes[i - 1].split(':').map(Number);
          const prevTimeInSeconds = prevHours * 3600 + prevMinutes * 60;
          const totalInterval = prayerTimeInSeconds - prevTimeInSeconds;
          const elapsed = currentTimeInSeconds - prevTimeInSeconds;
          progress = (elapsed / totalInterval) * 100;
        } else {
          const totalInterval = prayerTimeInSeconds + (24 * 3600 - currentTimeInSeconds);
          const elapsed = currentTimeInSeconds;
          progress = (elapsed / totalInterval) * 100;
        }

        this.nextPrayerTime = {
          name: prayerNames[i],
          time: todayTimes[i],
          remainingTime: { hours, minutes, seconds },
          progress: Math.min(Math.max(progress, 0), 100)
        };
        return;
      }
    }

    // If all prayers passed, show next day's Imsak
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];

    if (times.times[tomorrowStr]) {
      const [hours, minutes] = times.times[tomorrowStr][0].split(':').map(Number);
      const nextPrayerSeconds = hours * 3600 + minutes * 60;
      const totalSeconds = (24 * 3600) - currentTimeInSeconds + nextPrayerSeconds;
      
      this.nextPrayerTime = {
        name: 'İmsak',
        time: times.times[tomorrowStr][0],
        remainingTime: {
          hours: Math.floor(totalSeconds / 3600),
          minutes: Math.floor((totalSeconds % 3600) / 60),
          seconds: totalSeconds % 60
        },
        progress: ((24 * 3600 - totalSeconds) / (24 * 3600)) * 100
      };
    }
  }

  getDates(times: { [key: string]: string[] }): string[] {
    const dates = Object.keys(times);
    const todayIndex = dates.findIndex(date => this.isToday(new Date(date)));
    
    // Get yesterday, today and tomorrow
    const startIndex = Math.max(0, todayIndex - 1);
    const endIndex = Math.min(dates.length - 1, todayIndex + 1);
    
    return dates.slice(startIndex, endIndex + 1);
  }

  formatDate(date: string): string {
    const dateObj = new Date(date);
    if (this.isToday(dateObj)) {
      return 'Bugün';
    } else if (this.isYesterday(dateObj)) {
      return 'Dün';
    } else if (this.isTomorrow(dateObj)) {
      return 'Yarın';
    }
    return new Date(date).toLocaleDateString('tr-TR', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    });
  }

  isToday(date: Date): boolean {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  }

  isYesterday(date: Date): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.getDate() === yesterday.getDate() &&
           date.getMonth() === yesterday.getMonth() &&
           date.getFullYear() === yesterday.getFullYear();
  }

  isTomorrow(date: Date): boolean {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return date.getDate() === tomorrow.getDate() &&
           date.getMonth() === tomorrow.getMonth() &&
           date.getFullYear() === tomorrow.getFullYear();
  }

  getPrayerIcon(prayerName: string): string {
    switch (prayerName) {
      case 'İmsak':
        return 'fas fa-moon';
      case 'Güneş':
        return 'fas fa-sun';
      case 'Öğle':
        return 'fas fa-sun';
      case 'İkindi':
        return 'fas fa-cloud-sun';
      case 'Akşam':
        return 'fas fa-cloud-moon';  // Akşam vakti için yeni ikon
      case 'Yatsı':
        return 'fas fa-star';
      default:
        return 'fas fa-clock';
    }
  }

  getNextPrayerText(): string {
    if (!this.nextPrayerTime) return '';
    
    const prayers = {
      'İmsak': 'İmsak vaktine',
      'Güneş': 'Güneş doğuşuna',
      'Öğle': 'Öğle namazına',
      'İkindi': 'İkindi namazına',
      'Akşam': 'Akşam namazına',
      'Yatsı': 'Yatsı namazına'
    };

    return prayers[this.nextPrayerTime.name as keyof typeof prayers];
  }
}
