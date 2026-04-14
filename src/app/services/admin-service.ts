import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AdminCreateAccountRequest, AdminCreateAccountResponse, AdminFamiliesResponse } from '../interfaces/family-admin';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiBase}/admin`;

  constructor(private http: HttpClient) {}

  getFamilies(): Observable<AdminFamiliesResponse> {
    return this.http.get<AdminFamiliesResponse>(`${this.apiUrl}/families`);
  }

  createAdminAccount(data: AdminCreateAccountRequest): Observable<AdminCreateAccountResponse> {
    return this.http.post<AdminCreateAccountResponse>(`${this.apiUrl}/accounts`, data);
  }
}
