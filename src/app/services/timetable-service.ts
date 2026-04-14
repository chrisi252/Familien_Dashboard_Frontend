import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import {
  TimetableEntry,
  TimetableEntryCreate,
  TimetableEntryUpdate,
  TimetablePerson,
} from '../interfaces/timetable';

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private apiUrl = environment.apiBase;
  private http = inject(HttpClient);

  getPersons(familyId: number): Observable<{ persons: TimetablePerson[] }> {
    return this.http.get<{ persons: TimetablePerson[] }>(
      `${this.apiUrl}/families/${familyId}/timetable/persons`,
    );
  }

  getEntries(familyId: number, personName: string): Observable<{ entries: TimetableEntry[] }> {
    return this.http.get<{ entries: TimetableEntry[] }>(
      `${this.apiUrl}/families/${familyId}/timetable/${encodeURIComponent(personName)}/entries`,
    );
  }

  createEntry(familyId: number, data: TimetableEntryCreate): Observable<TimetableEntry> {
    return this.http.post<TimetableEntry>(
      `${this.apiUrl}/families/${familyId}/timetable/entries`,
      data,
    );
  }

  updateEntry(
    familyId: number,
    entryId: number,
    data: TimetableEntryUpdate,
  ): Observable<TimetableEntry> {
    return this.http.put<TimetableEntry>(
      `${this.apiUrl}/families/${familyId}/timetable/entries/${entryId}`,
      data,
    );
  }

  deleteEntry(familyId: number, entryId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/families/${familyId}/timetable/entries/${entryId}`,
    );
  }
}
