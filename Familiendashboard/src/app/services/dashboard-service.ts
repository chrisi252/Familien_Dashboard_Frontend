import { Injectable, signal } from '@angular/core';
import { NotesWidget } from '../widgets/notes-widget/notes-widget';
import { Widget } from '../interfaces/widget';
import { ScheduleWidget } from '../widgets/schedule-widget/schedule-widget';

@Injectable()
export class DashboardService {
  widgets = signal<Widget[]>([
    {
      id: 1,
      label: 'Test Widget',
      content: NotesWidget,
      permissions: {
        read: true,
        write: false,
      },
    },
     {
      id: 2,
      label: 'Second Test Widget',
      content: ScheduleWidget,
      permissions: {
        read: true,
        write: false,
      },
    },

  ]);
  constructor() {}
}
