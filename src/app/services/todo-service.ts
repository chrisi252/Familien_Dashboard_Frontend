import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Todo {
  id: number;
  family_id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

@Injectable({ providedIn: 'root' })
export class TodoService {
  private apiUrl = '/api';
  private http = inject(HttpClient);

  getTodos(familyId: number): Observable<{ todos: Todo[] }> {
    return this.http.get<{ todos: Todo[] }>(`${this.apiUrl}/families/${familyId}/todos`);
  }

  createTodo(familyId: number, title: string, description?: string): Observable<Todo> {
    return this.http.post<Todo>(`${this.apiUrl}/families/${familyId}/todos`, { title, description });
  }

  updateTodo(
    familyId: number,
    todoId: number,
    data: Partial<{ title: string; description: string | null; is_completed: boolean }>,
  ): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/families/${familyId}/todos/${todoId}`, data);
  }

  deleteTodo(familyId: number, todoId: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/families/${familyId}/todos/${todoId}`);
  }
}
