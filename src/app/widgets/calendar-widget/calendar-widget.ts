import { Component, input } from '@angular/core';

interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
}

@Component({
  selector: 'app-calendar-widget',
  imports: [],
  templateUrl: './calendar-widget.html',
  styleUrl: './calendar-widget.css',
})
export class CalendarWidget {
  widgetId = input<number>(0);
  canEdit = input<boolean>(false);
}