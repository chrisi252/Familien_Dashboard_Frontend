import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FamiliesResponse, FamilyDetailResponse, FamilyMember, FamilyRoleName } from '../interfaces/user';
import { FamilyWidgetDetailed, WidgetLayoutItem, WidgetLayoutResponse, WidgetUserPermission } from '../interfaces/widget';
import { ApiService } from '../core/api.service';

export interface FamilyInviteCode {
  id: number;
  family_id: number;
  code: string;
  created_at: string;
  expires_at: string;
}

@Injectable({
  providedIn: 'root',
})
export class FamilyService {
  private api = inject(ApiService);

  createFamily(name: string): Observable<void> {
    return this.api.post<void>('/families', { name });
  }

  getFamilies(): Observable<FamiliesResponse> {
    return this.api.get<FamiliesResponse>('/families');
  }

  getFamilyById(id: number): Observable<FamilyDetailResponse> {
    return this.api.get<FamilyDetailResponse>(`/families/${id}`);
  }

  deleteFamily(id: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/families/${id}`);
  }

  getFamilyWidgets(familyId: number): Observable<{ widgets: FamilyWidgetDetailed[] }> {
    // Cache-Buster um sicherzustellen dass immer aktuelle Daten geladen werden
    const timestamp = Date.now();
    return this.api.get<{ widgets: FamilyWidgetDetailed[] }>(
      `/families/${familyId}/widgets?_t=${timestamp}`,
    );
  }

  getWidgetPermissions(familyId: number, widgetId: number): Observable<{ permissions: WidgetUserPermission[] }> {
    return this.api.get<{ permissions: WidgetUserPermission[] }>(
      `/families/${familyId}/widgets/${widgetId}/permissions`,
    );
  }

  updateWidgetUserPermission(
    familyId: number,
    widgetId: number,
    userId: number,
    canView: boolean,
    canEdit: boolean,
  ): Observable<WidgetUserPermission> {
    return this.api.put<WidgetUserPermission>(
      `/families/${familyId}/widgets/${widgetId}/permissions/${userId}`,
      { can_view: canView, can_edit: canEdit },
    );
  }

  saveWidgetLayout(familyId: number, layout: WidgetLayoutItem[]): Observable<WidgetLayoutResponse> {
    return this.api.put<WidgetLayoutResponse>(
      `/families/${familyId}/widgets/layout`,
      { layout },
    );
  }

  joinByCode(code: string): Observable<FamilyMember> {
    return this.api.post<FamilyMember>('/families/join-by-code', { code });
  }

  generateInviteCode(familyId: number): Observable<FamilyInviteCode> {
    return this.api.post<FamilyInviteCode>(`/families/${familyId}/invite-code`, {});
  }

  removeMember(familyId: number, userId: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(
      `/families/${familyId}/members/${userId}`,
    );
  }

  changeMemberRole(familyId: number, userId: number, roleName: FamilyRoleName): Observable<FamilyMember> {
    return this.api.put<FamilyMember>(
      `/families/${familyId}/members/${userId}/role`,
      { role_name: roleName },
    );
  }
}
