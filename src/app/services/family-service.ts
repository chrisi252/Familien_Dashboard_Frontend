import { Injectable } from '@angular/core';
import { FamiliesResponse, FamilyDetailResponse } from '../interfaces/user';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { FamilyWidgetDetailed, WidgetLayoutItem, WidgetLayoutResponse, WidgetUserPermission } from '../interfaces/widget';

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

  deleteFamily(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/families/${id}`);
  }

  joinFamily(familyId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/families/${familyId}/join`, {});
  }

  getFamilyWidgets(familyId: number): Observable<{ widgets: FamilyWidgetDetailed[] }> {
    // Cache-Buster um sicherzustellen dass immer aktuelle Daten geladen werden
    const timestamp = Date.now();
    return this.http.get<{ widgets: FamilyWidgetDetailed[] }>(
      `${this.apiUrl}/families/${familyId}/widgets?_t=${timestamp}`
    );
  }

  getWidgetPermissions(familyId: number, widgetId: number): Observable<{ permissions: WidgetUserPermission[] }> {
    return this.http.get<{ permissions: WidgetUserPermission[] }>(
      `${this.apiUrl}/families/${familyId}/widgets/${widgetId}/permissions`
    );
  }

  updateWidgetUserPermission(
    familyId: number,
    widgetId: number,
    userId: number,
    canView: boolean,
    canEdit: boolean,
  ): Observable<WidgetUserPermission> {
    return this.http.put<WidgetUserPermission>(
      `${this.apiUrl}/families/${familyId}/widgets/${widgetId}/permissions/${userId}`,
      { can_view: canView, can_edit: canEdit },
    );
  }

  saveWidgetLayout(familyId: number, layout: WidgetLayoutItem[]): Observable<WidgetLayoutResponse> {
    return this.http.put<WidgetLayoutResponse>(
      `${this.apiUrl}/families/${familyId}/widgets/layout`,
      { layout },
    );
  }
}
