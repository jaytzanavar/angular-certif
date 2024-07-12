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
import { ConditionsAndZip } from "../shared/types/conditions-and-zip.type";

@Component({
  selector: "app-current-conditions",
  templateUrl: "./current-conditions.component.html",
  styleUrls: ["./current-conditions.component.css"],
})
export class CurrentConditionsComponent {
  private router = inject(Router);
  private weatherService = inject(WeatherService);
  protected locationService = inject(LocationService);

  public selectedTab = 0;
  protected currentConditionsByZip: Signal<ConditionsAndZip[]> =
    this.weatherService.getCurrentConditions();
  protected currentLocations: Signal<string[]> =
    this.locationService.getCurrentLocations();
  protected selectedLocationCardTab = signal(0);
  protected errorZipCode: Signal<string> =
    this.weatherService.getErrorZipCode();

  // TODO: Move template to zipcode form for aesthetic reasons
  showErrorMessage = false;

  constructor() {
    effect(
      () => {
        this.currentLocations().map((zip) => {
          this.weatherService.addCurrentConditions(zip);
        });
      },
      {
        allowSignalWrites: true,
      }
    );
    // gets signal if wrong zip code was added to remove it
    effect(
      () => {
        if (this.errorZipCode()) {
          this.locationService.removeLocation(this.errorZipCode(), true);
          this.showErrorMessage = true;
          setTimeout(() => {
            this.showErrorMessage = false;
            this.weatherService.initializeErrorZipCode();
          }, 3000);
        }
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  showForecast(zipcode: string) {
    this.router.navigate(["/forecast", zipcode]);
  }

  locationZip(index, location) {
    return location.zip;
  }

  changeWeatherTab(index: number) {
    this.selectedTab = index;
    this.selectedLocationCardTab.set(index);
  }

  selectTabStyle(index: number) {
    return {
      "background-color":
        index === this.selectedTab
          ? "rgba(127, 185, 240, 0.836)"
          : "rgba(57, 147, 231, 0.836)",
    };
  }

  deleteWeatherTab(index: number) {
    const zip = this.currentConditionsByZip()[index].zip;
    const indexToDelete = this.currentConditionsByZip().findIndex(
      (x) => x.zip === zip
    );

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
