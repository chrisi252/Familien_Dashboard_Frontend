import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AdminCreateAccountRequest, AdminCreateAccountResponse, AdminFamiliesResponse } from '../interfaces/family-admin';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private api = inject(ApiService);

  getFamilies(): Observable<AdminFamiliesResponse> {
    return this.api.get<AdminFamiliesResponse>('/admin/families');
  }

  createAdminAccount(data: AdminCreateAccountRequest): Observable<AdminCreateAccountResponse> {
    return this.api.post<AdminCreateAccountResponse>('/admin/accounts', data);
  }
}
