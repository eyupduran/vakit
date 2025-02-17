export interface PrayerTimes {
  place: {
    country: string;
    id: number;
    name: string;
    countryCode: string;
    stateName: string;
    latitude: number;
    longitude: number;
    alternativeNames: string[];
  };
  times: {
    [date: string]: string[];
  };
}