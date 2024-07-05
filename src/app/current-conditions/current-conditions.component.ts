import {
  Component,
  computed,
  effect,
  inject,
  signal,
  Signal,
} from "@angular/core";
import { WeatherService } from "../weather.service";
import { LocationService } from "../location.service";
import { Router } from "@angular/router";
import { ConditionsAndZip } from "../conditions-and-zip.type";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
})
export class CurrentConditionsComponent {
  private weatherService = inject(WeatherService);
  private router = inject(Router);
  protected locationService = inject(LocationService);
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();
  protected currentLocations: Signal<string[]> =
    this.locationService.getCurrentLocations();

  protected selectedLocationCardTab = signal(0);

  protected errorZipCode: Signal<string> =
    this.weatherService.getErrorZipCode();

  constructor() {
    effect(() => {
      console.log(this.currentLocations());
      this.currentLocations().map((zip) => {
        this.weatherService.addCurrentConditions(zip);
      });
    });

    effect(() => {
      console.log(this.errorZipCode());
      if (this.errorZipCode())
        this.locationService.removeLocation(this.errorZipCode(), true);
    });
  }

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }

  locationZip(index, location) {
    return location.zip;
  }

  changeWeatherTab(index: number) {
    this.selectedLocationCardTab.set(index);
  }

  deleteWeatherTab(index: number) {
    const zip = this.currentConditionsByZip()[index].zip;
    const indexToDelete = this.currentConditionsByZip().findIndex(
      (x) => x.zip === zip
    );
    console.log(indexToDelete);

    this.weatherService.removeCurrentConditions(zip);
    this.locationService.removeLocation(zip);

    this.selectedLocationCardTab.set(
      indexToDelete === 0 ? 0 : indexToDelete - 1
    );
  }

  tabTitle(name: string, zip: string) {
    return `${name} (${zip})`;
  }
}
