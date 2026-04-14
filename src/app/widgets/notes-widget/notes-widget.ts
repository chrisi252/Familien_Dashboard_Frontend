import { Component, input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-notes-widget',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './notes-widget.html',
  styleUrl: './notes-widget.css'
})
export class NotesWidget {
  widgetId = input<number>(0);
  canEdit = input<boolean>(false);
}