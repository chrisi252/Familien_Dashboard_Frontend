import { Component, signal } from '@angular/core';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { heroPencil, heroCheck, heroXMark, heroTrash } from '@ng-icons/heroicons/outline';

@Component({
  selector: 'app-todo-widget',
  imports: [NgIcon],
  viewProviders: [provideIcons({ heroPencil, heroCheck, heroXMark, heroTrash })],
  templateUrl: './todo-widget.html',
  styleUrl: './todo-widget.css',
})
export class TodoWidget {

  todoItems = signal([
    { id: 1, text: 'Einkaufen gehen', completed: false },
    { id: 2, text: 'Hausaufgaben machen', completed: true },
    { id: 3, text: 'Auto waschen', completed: false },
  ]);

  editingId = signal<number | null>(null);
  editingText = signal<string>('');

  addTodoItem(text: string) {
    if (!text.trim()) return;
    const newItem = { id: Date.now(), text, completed: false };
    this.todoItems.set([...this.todoItems(), newItem]);
  }

  removeTodoItem(id: number) {
    this.todoItems.set(this.todoItems().filter(item => item.id !== id));
  }

  startEdit(id: number, text: string) {
    this.editingId.set(id);
    this.editingText.set(text);
  }

  saveEdit(id: number) {
    if (!this.editingText().trim()) return;
    this.todoItems.set(this.todoItems().map(item =>
      item.id === id ? { ...item, text: this.editingText() } : item
    ));
    this.editingId.set(null);
  }

  cancelEdit() {
    this.editingId.set(null);
  }

}