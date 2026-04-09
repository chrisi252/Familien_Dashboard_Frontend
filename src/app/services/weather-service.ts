import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherLocation, WeatherResponse } from '../interfaces/weather';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getWeather(familyId: number): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${this.apiUrl}/weather/${familyId}`);
  }

  getLocation(familyId: number): Observable<{ location: WeatherLocation }> {
    return this.http.get<{ location: WeatherLocation }>(`${this.apiUrl}/weather/${familyId}/location`);
  }

  updateLocation(familyId: number, city: string): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/weather/${familyId}/location`, { city });
  }
}
