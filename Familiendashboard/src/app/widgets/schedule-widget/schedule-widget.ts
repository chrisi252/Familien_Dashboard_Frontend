import { Component, signal } from '@angular/core';
import { ScheduleEvent } from '../../interfaces/schedule-event';

@Component({
  selector: 'app-schedule-widget',
  imports: [],
  templateUrl: './schedule-widget.html',
  styleUrl: './schedule-widget.css',
})
export class ScheduleWidget {

    events = signal<ScheduleEvent[]>([
    {
      dayName: 'Mo',
      dayNumber: '03',
      title: 'Zahnarzt',
      timeRange: '10:00 – 11:00 Uhr',
      isToday: true,
    },
    {
      dayName: 'Di',
      dayNumber: '04',
      title: 'Elternabend',
      timeRange: '18:30 – 20:00 Uhr',
    },
    {
      dayName: 'Fr',
      dayNumber: '07',
      title: 'Fußballtraining',
      timeRange: '15:00 – 16:30 Uhr',
    },
  ]);
}
