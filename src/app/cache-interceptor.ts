import { formatDate } from "@angular/common";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse,
} from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable, of } from "rxjs";
import { CacheDurationService } from "./cache-duration.service";
import { tap } from "rxjs/operators";

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  peristCache = [];
  private cache = new Map<string, CacheTimedData<HttpResponse<any>>>();
  private cacheDurationService = inject(CacheDurationService); // dependent on DurationService can be modified from outside
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const key = request.url; // setting the generic key as url
    const requestType = request.method;
    // test for 2 seconds :)
    // this.cacheDurationService.setCacheDuration(2);
    const currentDateInSeconds = new Date().getTime() / 1000;

    if (this.cache.has(key) && requestType === "GET") {
      const cachedResponse = this.cache.get(key);

      if (
        cachedResponse &&
        this.cache.get(key).expiresAt >= currentDateInSeconds
      ) {
        return of(cachedResponse.response);
      }
      // Safety case that cache is empty
      return next.handle(request).pipe(
        tap((res: HttpResponse<any>) => {
          if (res instanceof HttpResponse) {
            this.cache.set(request.url, {
              response: res,
              expiresAt:
                currentDateInSeconds +
                this.cacheDurationService.getCacheDuration(),
            });
          }
        })
      );
    } else {
      // Http request we are checking first localstorage
      return next.handle(request).pipe(
        tap((res: HttpResponse<any>) => {
          if (res instanceof HttpResponse) {
            this.peristCache.push({
              key: request.url,
              response: res,
              expiresAt:
                currentDateInSeconds +
                this.cacheDurationService.getCacheDuration(),
            });

            localStorage.setItem(
              "persistCache",
              JSON.stringify(this.peristCache)
            );

            this.cache.set(request.url, {
              response: res,
              expiresAt:
                currentDateInSeconds +
                this.cacheDurationService.getCacheDuration(),
            });
          }
        })
      );
    }
  }
}

export type CacheTimedData<T> = {
  response: T;
  expiresAt: number;
};
