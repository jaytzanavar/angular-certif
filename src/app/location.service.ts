import { Injectable, signal } from "@angular/core";
import { WeatherService } from "./weather.service";

export const LOCATIONS: string = "locations";

@Injectable()
export class LocationService {
  locations: string[] = [];

  private currentLocations = signal<string[]>([]);

  // private weatherService : WeatherService
  constructor() {
    let locString = localStorage.getItem(LOCATIONS);
    if (locString) {
      this.locations = JSON.parse(locString);
      this.currentLocations.update(() => [...JSON.parse(locString)]);
    }
  }

  addLocation(zipcode: string) {
    if (this.locations.indexOf(zipcode) === -1) {
      this.locations.push(zipcode);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      this.currentLocations.update((loc) => [...loc, zipcode]);
    }
  }

  removeLocation(zipcode: string, error: boolean = false) {
    let index = this.locations.indexOf(zipcode);
    if (index !== -1) {
      this.locations.splice(index, 1);
      localStorage.setItem(LOCATIONS, JSON.stringify(this.locations));
      if (!error)
        this.currentLocations.update((loc) =>
          loc.filter((l_zipcode) => l_zipcode !== zipcode)
        );
      // this.weatherService.removeCurrentConditions(zipcode);
    }
  }

  getCurrentLocations() {
    return this.currentLocations.asReadonly();
  }
}
