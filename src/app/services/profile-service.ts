import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../interfaces/user';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private api = inject(ApiService);

  getProfile(): Observable<User> {
    return this.api.get<User>('/users/profile');
  }
}
