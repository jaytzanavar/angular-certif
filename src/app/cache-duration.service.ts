import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class CacheDurationService {
  private cacheDuration: number = 7200; // 2hours in seconds 60 x 60 x 2

  setCacheDuration(duration: number): void {
    this.cacheDuration = duration;
  }

  getCacheDuration(): number {
    return this.cacheDuration;
  }
}
