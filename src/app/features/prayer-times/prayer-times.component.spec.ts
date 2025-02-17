import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrayerTimesComponent } from './prayer-times.component';

describe('PrayerTimesComponent', () => {
  let component: PrayerTimesComponent;
  let fixture: ComponentFixture<PrayerTimesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrayerTimesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrayerTimesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
