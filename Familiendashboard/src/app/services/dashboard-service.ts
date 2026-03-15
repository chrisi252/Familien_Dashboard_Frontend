import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { NotesWidget } from '../widgets/notes-widget/notes-widget';
import { Widget } from '../interfaces/widget';
import { ScheduleWidget } from '../widgets/schedule-widget/schedule-widget';
import { TodoWidget } from '../widgets/todo-widget/todo-widget';
import { CalendarWidget } from '../widgets/calendar-widget/calendar-widget';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

const MANDATORY_WIDGETS: Widget[] = [
  {
    id: 1,
    label: 'Notizen',
    content: NotesWidget,
    permissions: { read: true, write: true },
    rows: 2,
    cols: 2,
  },
  {
    id: 2,
    label: 'Aufgaben',
    content: TodoWidget,
    permissions: { read: true, write: true },
    rows: 2,
    cols: 1,
  },
  {
    id: 3,
    label: 'Termine',
    content: ScheduleWidget,
    permissions: { read: true, write: true },
    rows: 2,
    cols: 1,
  },
];

const OPTIONAL_WIDGETS: Widget[] = [
  {
    id: 4,
    label: 'Test Widget',
    content: ScheduleWidget,
    permissions: { read: true, write: false },
    rows: 1,
    cols: 1,
  },
  {
    id: 5,
    label: 'Google Kalender',
    content: CalendarWidget,
    permissions: { read: true, write: false },
    rows: 2,
    cols: 2,
  }
];

@Injectable()
export class DashboardService {
  private breakpointObserver = inject(BreakpointObserver);
  isMobile = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(r => r.matches)),
    { initialValue: false }
  );

  widgets = signal<Widget[]>([...MANDATORY_WIDGETS, ...OPTIONAL_WIDGETS]);

  addedWidgets = signal<Widget[]>([]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map(w => w.id);
    return this.widgets().filter(w => !addedIds.includes(w.id));
  });



  addWidget(widget: Widget) {
    this.addedWidgets.set([...this.addedWidgets(), { ...widget }]);
  }

  updateWidgetSize(id: number, size: Pick<Widget, 'rows' | 'cols'>) {
    this.addedWidgets.update(widgets =>
      widgets.map(widget =>
        widget.id === id
          ? { ...widget, ...size }
          : widget
      )
    );
  }

  moveWidgetToRight(id: number) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if (index === this.addedWidgets().length - 1) {
      return;
    }
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index + 1]] = [{ ...newWidgets[index + 1] }, { ...newWidgets[index] }];
    this.addedWidgets.set(newWidgets);
  }

  moveWidgetToLeft(id: number) {
    const index = this.addedWidgets().findIndex(w => w.id === id);
    if (index === 0) {
      return;
    }
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index - 1]] = [{ ...newWidgets[index - 1] }, { ...newWidgets[index] }];
    this.addedWidgets.set(newWidgets);
  }

  removeWidget(id: number) {
    const removedWidget = this.addedWidgets().find(w => w.id === id);
    if (removedWidget) {
      this.addedWidgets.set(this.addedWidgets().filter(w => w.id !== id));
       this.widgets.set(this.widgets().filter(w => w.id !== id));
      this.widgets.set([...this.widgets(), { ...removedWidget }]);
    }
  }

  fetchWidgets() {
    const WidgetsAsString = localStorage.getItem('dashboardWidgets');
    if (WidgetsAsString) {
      const widgets = JSON.parse(WidgetsAsString) as Widget[];
     widgets.forEach(widget => {
      const content = this.widgets().find(w => w.id === widget.id)?.content ;
      if(content){
        widget.content = content;
      }
    })
      this.addedWidgets.set(widgets);
  }
  }

  constructor() {
      this.fetchWidgets();
  }

  saveWidgets = effect(()=>{
    const widgetsWithoutContent:Partial<Widget>[] = this.addedWidgets().map(w => ({... w}));
    widgetsWithoutContent.forEach(w => {delete w.content});
    localStorage.setItem('dashboardWidgets', JSON.stringify(widgetsWithoutContent));
  })
  
  updateWidgetPosition(sourceWidgetId: number, targetWidgetId: number) {
  const sourceIndex = this.addedWidgets().findIndex(w => w.id === sourceWidgetId);
  if (sourceIndex === -1) {
    return;
  }

  const newWidgets = [...this.addedWidgets()];
  const sourceWidget = newWidgets.splice(sourceIndex, 1)[0];

  const targetIndex =newWidgets.findIndex(w => w.id === targetWidgetId);
  if (targetIndex === -1) {
    return;
  }

  const insertAt =targetIndex ===sourceIndex ? targetIndex +1 : targetIndex;

  newWidgets.splice(insertAt, 0, sourceWidget);
  this.addedWidgets.set(newWidgets);
  
  }

  


}
