import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  TimetableEntry,
  TimetableEntryCreate,
  TimetableEntryUpdate,
  TimetablePerson,
} from '../interfaces/timetable';
import { ApiService } from '../core/api.service';

@Injectable({ providedIn: 'root' })
export class TimetableService {
  private api = inject(ApiService);

  getPersons(familyId: number): Observable<{ persons: TimetablePerson[] }> {
    return this.api.get<{ persons: TimetablePerson[] }>(
      `/families/${familyId}/timetable/persons`,
    );
  }

  getEntries(familyId: number, personName: string): Observable<{ entries: TimetableEntry[] }> {
    return this.api.get<{ entries: TimetableEntry[] }>(
      `/families/${familyId}/timetable/${encodeURIComponent(personName)}/entries`,
    );
  }

  createEntry(familyId: number, data: TimetableEntryCreate): Observable<TimetableEntry> {
    return this.api.post<TimetableEntry>(
      `/families/${familyId}/timetable/entries`,
      data,
    );
  }

  updateEntry(
    familyId: number,
    entryId: number,
    data: TimetableEntryUpdate,
  ): Observable<TimetableEntry> {
    return this.api.put<TimetableEntry>(
      `/families/${familyId}/timetable/entries/${entryId}`,
      data,
    );
  }

  deleteEntry(familyId: number, entryId: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(
      `/families/${familyId}/timetable/entries/${entryId}`,
    );
  }
}
