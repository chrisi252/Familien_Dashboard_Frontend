import { computed, Injectable, signal } from '@angular/core';
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
      rows:2,
      cols: 2
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

  addedWidgets = signal<Widget []>([]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map(w =>w.id);
    return this.widgets().filter(w=>!addedIds.includes(w.id));

  });

  addWidget(widget: Widget) {
    this.addedWidgets.set([... this.addedWidgets(), {... widget}]);
}

moveWidgetToRight(id: number) {

  const index = this.addedWidgets().findIndex(w => w.id === id);
  if (index === this.addedWidgets().length - 1) {
    return;
  }
  const newWidgets = [...this.addedWidgets()];
  [newWidgets[index], newWidgets[index + 1]] = [{...newWidgets[index + 1]}, {...newWidgets[index]}];
  this.addedWidgets.set(newWidgets);
}
moveWidgetToLeft(id: number) {
 const index = this.addedWidgets().findIndex(w => w.id === id);
  if (index === 0) {
    return;
  }
  const newWidgets = [...this.addedWidgets()];
  [newWidgets[index], newWidgets[index - 1]] = [{...newWidgets[index - 1]}, {...newWidgets[index]}];
  this.addedWidgets.set(newWidgets);
}
  constructor() {}
}
