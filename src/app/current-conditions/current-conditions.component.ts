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

  protected selectedTab = signal(0);

  selectedLocationCardTab: Signal<ConditionsAndZip> = computed(
    () => this.currentConditionsByZip()[this.selectedTab()]
  );

  constructor() {
    effect(() => {
      this.currentLocations().map((zip) => {
        this.weatherService.addCurrentConditions(zip);
      });
    });
  }

  ngAfterViewInit() {
    console.log(this.selectedLocationCardTab());
  }
  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }

  locationZip(index, location) {
    return location.zip;
  }

  changeWeatherTab(index: number) {
    this.selectedTab.set(index);
  }

  deleteWeatherTab(zip: string) {
    this.weatherService.removeCurrentConditions(zip);
    this.locationService.removeLocation(zip);
    this.selectedTab.update((currentTab) =>
      currentTab > 0 ? currentTab - 1 : 0
    );
  }
}
