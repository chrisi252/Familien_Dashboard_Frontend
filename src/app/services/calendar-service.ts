import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';

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
  private api = inject(ApiService);

  getEventById(eventId: number): Observable<CalendarApiEvent> {
    return this.api.get<CalendarApiEvent>(`/calendar/${eventId}`);
  }

  updateEvent(eventId: number, payload: UpdateCalendarEventPayload): Observable<CalendarApiEvent> {
    return this.api.put<CalendarApiEvent>(`/calendar/${eventId}`, payload);
  }

  deleteEvent(eventId: number): Observable<{ message?: string }> {
    return this.api.delete<{ message?: string }>(`/calendar/${eventId}`);
  }

  updateVisibility(eventId: number, userIds: number[]): Observable<CalendarApiEvent> {
    return this.api.put<CalendarApiEvent>(`/calendar/${eventId}/visibility`, {
      user_ids: userIds,
    });
  }
}
