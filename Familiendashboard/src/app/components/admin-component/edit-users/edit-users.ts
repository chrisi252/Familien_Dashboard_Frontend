import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-users',
  imports: [],
  templateUrl: './edit-users.html',
  styleUrl: './edit-users.css',
})
export class EditUsers {

  users = [
    { id: 1, username: 'user1', role: 'Admin', email: 'user1@example.com' },
    { id: 2, username: 'user2', role: 'Nutzer', email: 'user2@example.com' },
    { id: 3, username: 'user3', role: 'Au-Pair', email: 'user3@example.com' }
  ];

}
