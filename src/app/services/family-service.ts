import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { FamilyWidgetDetailed } from '../interfaces/widget';

@Injectable({
  providedIn: 'root',
})
export class FamilyService {

   private apiUrl = '/api';

  constructor(private http: HttpClient) {}

  createFamily(name: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/families`, { name });
  }

  getFamilies(): Observable<any> {
    return this.http.get(`${this.apiUrl}/families`);
  }

  getFamilyById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/families/${id}`);
  }

  joinFamily(familyId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/families/${familyId}/join`, {});
  }

  getFamilyWidgets(familyId: number): Observable<{ widgets: FamilyWidgetDetailed[] }> {
    return this.http.get<{ widgets: FamilyWidgetDetailed[] }>(`${this.apiUrl}/families/${familyId}/widgets`);
  }

}
