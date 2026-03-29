import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WeatherResponse } from '../interfaces/weather';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  getWeather(familyId: number): Observable<WeatherResponse> {
    return this.http.get<WeatherResponse>(`${this.apiUrl}/weather/${familyId}`);
  }

  getLocation(familyId: number): Observable<{ location: any }> {
    return this.http.get<{ location: any }>(`${this.apiUrl}/weather/${familyId}/location`);
  }

  updateLocation(familyId: number, city: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/weather/${familyId}/location`, { city });
  }
}
