import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TokenResponse } from '../interfaces/token-response';
import { RegisterResponse } from '../interfaces/register-response';
import { LoginResponse } from '../interfaces/login-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://pi.erikbreuer.de/api';

  constructor(private http: HttpClient) {}

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/users/login`, credentials);
  }

  register(credentials: {
    username: string;
    password: string;
    first_name: string;
    last_name: string;
  }): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/users/register`, credentials);
  }

  storeToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  storeTokens(tokens: TokenResponse) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  clearToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  isLoggedIn(): boolean {
    return !!this.getAccessToken();
  }

  refreshToken(): Observable<TokenResponse | null> {
    const refreshToken = localStorage.getItem('refreshToken');
    const token = localStorage.getItem('accessToken');

    if (!refreshToken || !token) {
      return of(null);
    }
    return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, {
      token: token,
      refreshToken: refreshToken,
    });
  }
}
