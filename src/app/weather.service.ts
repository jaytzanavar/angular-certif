import { Injectable, Signal, signal } from "@angular/core";
import { Observable, of, throwError } from "rxjs";

import { HttpClient } from "@angular/common/http";
import { CurrentConditions } from "./current-conditions/current-conditions.type";
import { ConditionsAndZip } from "./shared/types/conditions-and-zip.type";
import { Forecast } from "./forecasts-list/forecast.type";
import { catchError } from "rxjs/operators";
import { CacheConditionsType } from "./shared/types/cache-conditions-type";

@Injectable()
export class WeatherService {
  static URL = "https://api.openweathermap.org/data/2.5";
  static APPID = "5a4b2d457ecbef9eb2a71e480b947604";
  static ICON_URL =
    "https://raw.githubusercontent.com/udacity/Sunshine-Version-2/sunshine_master/app/src/main/res/drawable-hdpi/";
  private currentConditions = signal<ConditionsAndZip[]>([]);
  private wrongZipCode = signal<string>("");

  constructor(private http: HttpClient) {}

  addCurrentConditions(zipcode: string): void {
    const requestUrl = `${WeatherService.URL}/weather?zip=${zipcode},us&units=imperial&APPID=${WeatherService.APPID}`;
    const currentDateInSeconds = new Date().getTime() / 1000;

    const persistedCache = JSON.parse(
      localStorage.getItem("persistCache")
    ) as Array<CacheConditionsType>;

    const requestCached =
      persistedCache &&
      persistedCache.find((cached_data) => cached_data.key === requestUrl);

    if (requestCached && requestCached.expiresAt >= currentDateInSeconds) {
      const {
        expiresAt,
        response: { body },
      } = requestCached;

      if (requestCached.expiresAt >= currentDateInSeconds) {
        const currentConditions = body as CurrentConditions;
        if (
          !this.currentConditions().find(
            (zd: ConditionsAndZip) => zd.zip === zipcode
          )
        ) {
          this.currentConditions.update((conditions) => {
            return [...conditions, { zip: zipcode, data: currentConditions }];
          });
        }
      }
    } else {
      this.http
        .get<CurrentConditions>(requestUrl)
        .pipe(
          catchError((error) => {
            // TODO: elegant handle of the async error
            return throwError(error);
          })
        )
        .subscribe(
          (data) => {
            if (
              !this.currentConditions().find(
                (zd: ConditionsAndZip) => zd.zip === zipcode
              )
            ) {
              this.currentConditions.update((conditions) => {
                return [...conditions, { zip: zipcode, data }];
              });
            }
          },
          (error) => {
            this.wrongZipCode.set(zipcode);
          }
        );
    }
  }

  removeCurrentConditions(zipcode: string) {
    this.currentConditions.update((conditions) => {
      for (let i in conditions) {
        if (conditions[i].zip == zipcode) conditions.splice(+i, 1);
      }
      return conditions;
    });
  }

  getCurrentConditions(): Signal<ConditionsAndZip[]> {
    return this.currentConditions.asReadonly();
  }

  getErrorZipCode(): Signal<string> {
    return this.wrongZipCode.asReadonly();
  }

  initializeErrorZipCode(): void {
    this.wrongZipCode.set("");
  }

  getForecast(zipcode: string): Observable<Forecast> {
    // Here we make a request to get the forecast data from the API. Note the use of backticks and an expression to insert the zipcode
    const requestUrl = `${WeatherService.URL}/forecast/daily?zip=${zipcode},us&units=imperial&cnt=5&APPID=${WeatherService.APPID}`;
    const currentDateInSeconds = new Date().getTime() / 1000;

    const persistedCache = JSON.parse(
      localStorage.getItem("persistCache")
    ) as Array<CacheConditionsType>;

    const requestCached =
      persistedCache &&
      persistedCache.find((cached_data) => cached_data.key === requestUrl);
    if (requestCached && requestCached.expiresAt >= currentDateInSeconds) {
      const {
        expiresAt,
        response: { body },
      } = requestCached;

      if (expiresAt >= currentDateInSeconds) {
        const currentConditions = body as Forecast;

        return of(currentConditions);
      }
    } else {
      return this.http.get<Forecast>(requestUrl);
    }
  }

  getWeatherIcon(id): string {
    if (id >= 200 && id <= 232)
      return WeatherService.ICON_URL + "art_storm.png";
    else if (id >= 501 && id <= 511)
      return WeatherService.ICON_URL + "art_rain.png";
    else if (id === 500 || (id >= 520 && id <= 531))
      return WeatherService.ICON_URL + "art_light_rain.png";
    else if (id >= 600 && id <= 622)
      return WeatherService.ICON_URL + "art_snow.png";
    else if (id >= 801 && id <= 804)
      return WeatherService.ICON_URL + "art_clouds.png";
    else if (id === 741 || id === 761)
      return WeatherService.ICON_URL + "art_fog.png";
    else return WeatherService.ICON_URL + "art_clear.png";
  }
}
