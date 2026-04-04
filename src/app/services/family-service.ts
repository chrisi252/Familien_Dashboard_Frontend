import { Injectable } from '@angular/core';
import { FamiliesResponse, FamilyDetailResponse } from '../interfaces/user';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { FamilyWidgetDetailed } from '../interfaces/widget';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {

   private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  createFamily(name: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/families`, { name });
  }

  getFamilies(): Observable<FamiliesResponse> {
    return this.http.get<FamiliesResponse>(`${this.apiUrl}/families`);
  }

  getFamilyById(id: number): Observable<FamilyDetailResponse> {
    return this.http.get<FamilyDetailResponse>(`${this.apiUrl}/families/${id}`);
  }

  joinFamily(familyId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/families/${familyId}/join`, {});
  }

  getFamilyWidgets(familyId: number): Observable<{ widgets: FamilyWidgetDetailed[] }> {
    return this.http.get<{ widgets: FamilyWidgetDetailed[] }>(`${this.apiUrl}/families/${familyId}/widgets`);
  }

}
