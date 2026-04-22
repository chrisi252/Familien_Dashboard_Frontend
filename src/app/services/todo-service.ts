import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../core/api.service';

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
  private api = inject(ApiService);

  getTodos(familyId: number): Observable<{ todos: Todo[] }> {
    return this.api.get<{ todos: Todo[] }>(`/families/${familyId}/todos`);
  }

  createTodo(familyId: number, title: string, description?: string): Observable<Todo> {
    return this.api.post<Todo>(`/families/${familyId}/todos`, { title, description });
  }

  updateTodo(
    familyId: number,
    todoId: number,
    data: Partial<{ title: string; description: string | null; is_completed: boolean }>,
  ): Observable<Todo> {
    return this.api.put<Todo>(`/families/${familyId}/todos/${todoId}`, data);
  }

  deleteTodo(familyId: number, todoId: number): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/families/${familyId}/todos/${todoId}`);
  }
}
