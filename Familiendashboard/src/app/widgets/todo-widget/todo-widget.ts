import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-todo-widget',
  imports: [],
  templateUrl: './todo-widget.html',
  styleUrl: './todo-widget.css',
})
export class TodoWidget {

  todoItems = signal([
    { id: 1, text: 'Einkaufen gehen', completed: false },
    { id: 2, text: 'Hausaufgaben machen', completed: true },
    { id: 3, text: 'Auto waschen', completed: false },
  ]);

addTodoItem(text: string) {
  if (!text.trim()) return; 
  const newItem = { id: Date.now(), text, completed: false }; // API call to backend would be here
  this.todoItems.set([...this.todoItems(), newItem]);
}
removeTodoItem(id: number) {
  this.todoItems.set(this.todoItems().filter(item => item.id !== id)); // API call to backend would be here
}

}