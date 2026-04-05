import { Injectable } from '@angular/core';
import { FamiliesResponse, FamilyDetailResponse } from '../interfaces/user';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { FamilyWidgetDetailed, WidgetUserPermission } from '../interfaces/widget';

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
    return this.http.get<{ widgets: FamilyWidgetDetailed[] }>(`${this.apiUrl}/families/${familyId}/widgets`);
  }

  activateWidget(familyId: number, widgetKey: string): Observable<FamilyWidgetDetailed> {
    return this.http.post<FamilyWidgetDetailed>(`${this.apiUrl}/families/${familyId}/widgets`, { widget_key: widgetKey });
  }

  deactivateWidget(familyId: number, widgetId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/families/${familyId}/widgets/${widgetId}`);
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

  updateWidgetLayout(
    familyId: number,
    widgetId: number,
    layout: { grid_col?: number; grid_row?: number; grid_pos_x?: number; grid_pos_y?: number },
  ): Observable<FamilyWidgetDetailed> {
    return this.http.put<FamilyWidgetDetailed>(
      `${this.apiUrl}/families/${familyId}/widgets/${widgetId}/layout`,
      layout,
    );
  }

}
