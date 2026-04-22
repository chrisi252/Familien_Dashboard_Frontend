import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { WeatherLocation, WeatherResponse } from '../interfaces/weather';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private api = inject(ApiService);

  getWeather(familyId: number): Observable<WeatherResponse> {
    return this.api.get<WeatherResponse>(`/families/${familyId}/weather`);
  }

  getLocation(familyId: number): Observable<{ location: WeatherLocation }> {
    return this.api.get<{ location: WeatherLocation }>(`/families/${familyId}/weather/location`);
  }

  updateLocation(familyId: number, city: string): Observable<void> {
    return this.api.put<void>(`/families/${familyId}/weather/location`, { city });
  }
}
