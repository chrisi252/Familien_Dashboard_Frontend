import { HttpClient, HttpContext, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from './api-config';

type HttpOptions = {
  params?: HttpParams | Record<string, string | number | boolean | ReadonlyArray<string | number | boolean>>;
  headers?: Record<string, string | string[]>;
  context?: HttpContext;
  responseType?: 'json';
  withCredentials?: boolean;
};

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  readonly baseUrl = inject(API_BASE_URL);

  url(path: string): string {
    if (/^https?:\/\//i.test(path)) {
      return path;
    }
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return `${this.baseUrl}${normalizedPath}`;
  }

  get<T>(path: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(this.url(path), options);
  }

  post<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.post<T>(this.url(path), body, options);
  }

  put<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.put<T>(this.url(path), body, options);
  }

  patch<T>(path: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.patch<T>(this.url(path), body, options);
  }

  delete<T>(path: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(this.url(path), options);
  }
}
