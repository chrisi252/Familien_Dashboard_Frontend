import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { RegisterResponse } from '../interfaces/register-response';
import { LoginResponse } from '../interfaces/login-response';
import { UserStateService } from './user-state-service';
import { ApiService } from '../core/api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private api = inject(ApiService);
  private userState = inject(UserStateService);

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.api.post<LoginResponse>('/users/login', credentials);
  }

  register(credentials: {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Observable<RegisterResponse> {
    return this.api.post<RegisterResponse>('/users/register', credentials);
  }

  logout(): Observable<void> {
    return this.api.post<void>('/users/logout', {}).pipe(
      finalize(() => this.userState.clearSession()),
    );
  }
}
