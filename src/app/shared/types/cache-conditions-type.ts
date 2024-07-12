import { HttpResponse } from "@angular/common/http";

export interface CacheConditionsType {
  expiresAt: number;
  key: string;
  response: HttpResponse<unknown>;
}
