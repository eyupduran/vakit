import { TestBed } from '@angular/core/testing';

import { PrayerTimesService } from './prayer-times.service';

describe('PrayerTimesService', () => {
  let service: PrayerTimesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrayerTimesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
