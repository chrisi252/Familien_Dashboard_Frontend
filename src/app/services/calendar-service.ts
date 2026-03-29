import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface CalendarApiEvent {
  id: number;
  title: string;
  description?: string | null;
  start_datetime?: string;
  end_datetime?: string | null;
  is_all_day?: boolean;
  is_public_to_family?: boolean;
  color?: string | null;
}

export interface UpdateCalendarEventPayload {
  title?: string;
  description?: string | null;
  start_datetime?: string;
  end_datetime?: string | null;
  is_all_day?: boolean;
  is_public_to_family?: boolean;
  color?: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  private apiUrl = '/api/calendar';

  constructor(private http: HttpClient) {}

  getEventById(eventId: number): Observable<CalendarApiEvent> {
    return this.http.get<CalendarApiEvent>(`${this.apiUrl}/${eventId}`);
  }

  updateEvent(eventId: number, payload: UpdateCalendarEventPayload): Observable<CalendarApiEvent> {
    return this.http.put<CalendarApiEvent>(`${this.apiUrl}/${eventId}`, payload);
  }

  deleteEvent(eventId: number): Observable<{ message?: string }> {
    return this.http.delete<{ message?: string }>(`${this.apiUrl}/${eventId}`);
  }

  updateVisibility(eventId: number, userIds: number[]): Observable<CalendarApiEvent> {
    return this.http.put<CalendarApiEvent>(`${this.apiUrl}/${eventId}/visibility`, {
      user_ids: userIds,
    });
  }
}