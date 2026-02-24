import { Injectable } from '@angular/core';
import { Note } from '../interfaces/note';
// import { HttpClient } from '@angular/common/http';  Später für echtes Backend einkommentieren


@Injectable({
  providedIn: 'root'
})
export class NotesService {
  // constructor(private http: HttpClient) {}

  // Simuliere einen API-Call zum Backend
  async getNotes(widgetId: number): Promise<Note[]> {
    // return this.http.get<Note[]>(`/api/widgets/${widgetId}/notes`).toPromise();
    return []; // Platzhalter
  }

  async addNote(widgetId: number, content: string): Promise<Note> {
    // return this.http.post<Note>(`/api/widgets/${widgetId}/notes`, { content }).toPromise();
    return { id: Math.random(), content: content }; // Platzhalter
  }

  async deleteNote(widgetId: number, noteId: number): Promise<void> {
    // return this.http.delete<void>(`/api/widgets/${widgetId}/notes/${noteId}`).toPromise();
  }
}