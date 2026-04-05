import { computed, effect, inject, Injectable, signal, Type } from '@angular/core';
import { NotesWidget } from '../widgets/notes-widget/notes-widget';
import { Widget } from '../interfaces/widget';
import { ScheduleWidget } from '../widgets/schedule-widget/schedule-widget';
import { TodoWidget } from '../widgets/todo-widget/todo-widget';
import { CalendarWidget } from '../widgets/calendar-widget/calendar-widget';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { WeatherWidget } from '../widgets/weather-widget/weather-widget';
import { FamilyService } from './family-service';
import { UserStateService } from './user-state-service';

// Widget-Registry: Mappt widget_key vom Backend zu Angular Components
const WIDGET_REGISTRY: Record<string, { content: Type<unknown>; label: string; rows: number; cols: number }> = {
  notes: { content: NotesWidget, label: 'Notizen', rows: 2, cols: 2 },
  todo: { content: TodoWidget, label: 'Aufgaben', rows: 2, cols: 1 },
  schedule: { content: ScheduleWidget, label: 'Termine', rows: 2, cols: 1 },
  weather: { content: WeatherWidget, label: 'Wetter', rows: 2, cols: 1 },
  calendar: { content: CalendarWidget, label: 'Google Kalender', rows: 2, cols: 2 },
};

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private breakpointObserver = inject(BreakpointObserver);
  private familyService = inject(FamilyService);
  private userState = inject(UserStateService);

  isMobile = toSignal(
    this.breakpointObserver
      .observe(Breakpoints.Handset)
      .pipe(map(r => r.matches)),
    { initialValue: false }
  );

  // Alle verfügbaren Widgets (vom Backend geladen)
  widgets = signal<Widget[]>([]);

  // Widgets die der User auf seinem Dashboard hat
  addedWidgets = signal<Widget[]>([]);

  // Widgets die noch hinzugefügt werden können
  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map(w => w.id);
    return this.widgets().filter(w => !addedIds.includes(w.id));
  });

  isLoading = signal(false);
  errorMessage = signal('');

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
    }
  }

  // Lädt Widgets vom Backend und mappt sie zu Widget-Interface
  loadWidgetsFromBackend() {
    const familyId = this.userState.currentFamilyId();
    if (!familyId) {
      this.errorMessage.set('Keine Familie ausgewählt');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this.familyService.getFamilyWidgets(familyId).subscribe({
      next: (response) => {
        const backendWidgets = response.widgets
          .filter(w => w.can_view !== false) // Nur Widgets die der User sehen darf
          .map(w => this.mapBackendWidget(w))
          .filter((w): w is Widget => w !== null);

        this.widgets.set(backendWidgets);
        this.loadUserPreferences();
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Widgets konnten nicht geladen werden.');
        this.isLoading.set(false);
      }
    });
  }

  
  private mapBackendWidget(backendWidget: { widget_key: string | null; id: number; display_name: string | null; can_edit: boolean; grid_row: number; grid_col: number }): Widget | null {
    const key = backendWidget.widget_key;
    if (!key || !WIDGET_REGISTRY[key]) {
      return null;
    }

    const registry = WIDGET_REGISTRY[key];
    return {
      id: backendWidget.id,
      label: backendWidget.display_name ?? registry.label,
      content: registry.content,
      permissions: {
        read: true,
        write: backendWidget.can_edit
      },
      rows: backendWidget.grid_row || registry.rows,
      cols: backendWidget.grid_col || registry.cols,
    };
  }

 
  private loadUserPreferences() {
    const key = this.getStorageKey();
    if (!key) return;

    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        const savedWidgets = JSON.parse(saved) as Partial<Widget>[];
        const availableIds = new Set(this.widgets().map(w => w.id));
        const validWidgets: Widget[] = [];

        for (const savedWidget of savedWidgets) {
          if (!savedWidget.id || !availableIds.has(savedWidget.id)) continue;

          const full = this.widgets().find(w => w.id === savedWidget.id);
          if (!full) continue;

          validWidgets.push({
            ...full,
            rows: savedWidget.rows ?? full.rows,
            cols: savedWidget.cols ?? full.cols
          });
        }

        this.addedWidgets.set(validWidgets);
      } catch {
        localStorage.removeItem(key);
      }
    }
  }

  private getStorageKey(): string | null {
    const userId = this.userState.currentUser()?.id;
    const familyId = this.userState.currentFamilyId();
    if (!userId || !familyId) return null;
    return `dashboardWidgets:${userId}:${familyId}`;
  }

  constructor() {
   
  }

  saveWidgets = effect(() => {
    const key = this.getStorageKey();
    if (!key) return;

    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(w => ({ ...w }));
    widgetsWithoutContent.forEach(w => { delete w.content });
    localStorage.setItem(key, JSON.stringify(widgetsWithoutContent));
  });

  updateWidgetPosition(sourceWidgetId: number, targetWidgetId: number) {
    const sourceIndex = this.addedWidgets().findIndex(w => w.id === sourceWidgetId);
    if (sourceIndex === -1) {
      return;
    }

    const newWidgets = [...this.addedWidgets()];
    const sourceWidget = newWidgets.splice(sourceIndex, 1)[0];

    const targetIndex = newWidgets.findIndex(w => w.id === targetWidgetId);
    if (targetIndex === -1) {
      return;
    }

    const insertAt = targetIndex === sourceIndex ? targetIndex + 1 : targetIndex;

    newWidgets.splice(insertAt, 0, sourceWidget);
    this.addedWidgets.set(newWidgets);
  }
}
