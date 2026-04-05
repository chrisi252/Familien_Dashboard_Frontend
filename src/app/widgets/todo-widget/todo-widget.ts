import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencil, heroCheck, heroXMark, heroTrash } from '@ng-icons/heroicons/outline';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { switchMap } from 'rxjs';
import { Todo, TodoService } from '../../services/todo-service';
import { UserStateService } from '../../services/user-state-service';

@Component({
  selector: 'app-todo-widget',
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroPencil, heroCheck, heroXMark, heroTrash })],
  templateUrl: './todo-widget.html',
  styleUrl: './todo-widget.css',
})
export class TodoWidget implements OnInit {
  private todoService = inject(TodoService);
  private userState = inject(UserStateService);
  private destroyRef = inject(DestroyRef);

  todos = signal<Todo[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  editingId = signal<number | null>(null);
  editingText = signal<string>('');

  private familyId: number | null = null;

  ngOnInit() {
    this.resolveFamilyId()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        switchMap((id) => {
          this.familyId = id;
          return this.todoService.getTodos(id);
        }),
      )
      .subscribe({
        next: (res) => {
          this.todos.set(res.todos);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Aufgaben konnten nicht geladen werden.');
          this.isLoading.set(false);
        },
      });
  }

  addTodoItem(text: string) {
    if (!text.trim() || !this.familyId) return;
    this.todoService
      .createTodo(this.familyId, text.trim())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (todo) => this.todos.set([...this.todos(), todo]),
      });
  }

  toggleComplete(todo: Todo) {
    if (!this.familyId) return;
    this.todoService
      .updateTodo(this.familyId, todo.id, { is_completed: !todo.is_completed })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) =>
          this.todos.set(this.todos().map((t) => (t.id === updated.id ? updated : t))),
      });
  }

  removeTodoItem(id: number) {
    if (!this.familyId) return;
    this.todoService
      .deleteTodo(this.familyId, id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.todos.set(this.todos().filter((t) => t.id !== id)),
      });
  }

  startEdit(id: number, title: string) {
    this.editingId.set(id);
    this.editingText.set(title);
  }

  saveEdit(id: number) {
    const text = this.editingText().trim();
    if (!text || !this.familyId) return;
    this.todoService
      .updateTodo(this.familyId, id, { title: text })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (updated) => {
          this.todos.set(this.todos().map((t) => (t.id === updated.id ? updated : t)));
          this.editingId.set(null);
        },
      });
  }

  cancelEdit() {
    this.editingId.set(null);
  }

  private resolveFamilyId() {
    return this.userState.resolveCurrentFamilyId$();
  }
}
