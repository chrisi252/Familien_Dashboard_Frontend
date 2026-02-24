import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Note } from '../../interfaces/note';
import { Widget } from '../../interfaces/widget';
import { NotesService } from '../../services/notes-service';

@Component({
  selector: 'app-notes-widget',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notes-widget.html',
  styleUrl: './notes-widget.css'
})
export class NotesWidget  {

}