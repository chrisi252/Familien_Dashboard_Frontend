import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TokenResponse } from '../interfaces/token-response';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
 
  // hier kommt dann die logik rein wenn sich jemand anmeldet, damit man dann auch die Daten des angemeldeten Benutzers in der App nutzen kann


  private apiUrl = 'http://localhost:3000/api'; // Beispiel-URL für die API

  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }) :Observable<TokenResponse> {
    return this.http.post<TokenResponse>(`${this.apiUrl}/login`, credentials);
  }

  storeTokens(tokens: TokenResponse) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }
  clearToken() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  refreshToken(): Observable <TokenResponse | null> {
   const refreshToken = localStorage.getItem('refreshToken');
   const token = localStorage.getItem('accessToken');

   if (!refreshToken || !token) {
      return of(null);
    }
   return this.http.post<TokenResponse>(`${this.apiUrl}/refresh`, { 
    token:token,
    refreshToken: refreshToken });


  }

  register(credentials: { email: string; password: string; }) {
    throw new Error('Method not implemented.');
  }
}
