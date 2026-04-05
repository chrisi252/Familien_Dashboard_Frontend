import { computed, inject, Injectable, signal, Type } from '@angular/core';
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
import { FamilyWidgetDetailed, WidgetLayoutItem } from '../interfaces/widget';

// Widget-Registry: Mappt widget_key vom Backend zu Angular Components
const WIDGET_REGISTRY: Record<string, { content: Type<unknown>; label: string; defaultRows: number; defaultCols: number }> = {
  notes: { content: NotesWidget, label: 'Notizen', defaultRows: 2, defaultCols: 2 },
  todo: { content: TodoWidget, label: 'Aufgaben', defaultRows: 2, defaultCols: 1 },
  schedule: { content: ScheduleWidget, label: 'Termine', defaultRows: 2, defaultCols: 1 },
  weather: { content: WeatherWidget, label: 'Wetter', defaultRows: 2, defaultCols: 1 },
  calendar: { content: CalendarWidget, label: 'Google Kalender', defaultRows: 2, defaultCols: 2 },
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

  // Alle verfügbaren Widgets (vom Backend, inkl. solche ohne Position)
  widgets = signal<Widget[]>([]);

  // Widgets die der User auf seinem Dashboard hat (position !== null)
  addedWidgets = signal<Widget[]>([]);

  // Widgets die noch hinzugefügt werden können (position === null im Backend)
  widgetsToAdd = computed(() => {
    const addedIds = new Set(this.addedWidgets().map(w => w.id));
    return this.widgets().filter(w => !addedIds.has(w.id));
  });

  isLoading = signal(false);
  isSaving = signal(false);
  errorMessage = signal('');

  addWidget(widget: Widget) {
    this.addedWidgets.update(widgets => [...widgets, { ...widget }]);
    this.saveLayoutToBackend();
  }

  updateWidgetSize(id: number, size: Pick<Widget, 'rows' | 'cols'>) {
    this.addedWidgets.update(widgets =>
      widgets.map(widget =>
        widget.id === id
          ? { ...widget, ...size }
          : widget
      )
    );
    this.saveLayoutToBackend();
  }

  moveWidgetToRight(id: number) {
    const widgets = this.addedWidgets();
    const index = widgets.findIndex(w => w.id === id);
    if (index === -1 || index === widgets.length - 1) return;

    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index + 1]] = [{ ...newWidgets[index + 1] }, { ...newWidgets[index] }];
    this.addedWidgets.set(newWidgets);
    this.saveLayoutToBackend();
  }

  moveWidgetToLeft(id: number) {
    const widgets = this.addedWidgets();
    const index = widgets.findIndex(w => w.id === id);
    if (index <= 0) return;

    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index - 1]] = [{ ...newWidgets[index - 1] }, { ...newWidgets[index] }];
    this.addedWidgets.set(newWidgets);
    this.saveLayoutToBackend();
  }

  removeWidget(id: number) {
    this.addedWidgets.update(widgets => widgets.filter(w => w.id !== id));
    this.saveLayoutToBackend();
  }

  updateWidgetPosition(sourceWidgetId: number, targetWidgetId: number) {
    const widgets = this.addedWidgets();
    const sourceIndex = widgets.findIndex(w => w.id === sourceWidgetId);
    if (sourceIndex === -1) return;

    const newWidgets = [...widgets];
    const sourceWidget = newWidgets.splice(sourceIndex, 1)[0];

    const targetIndex = newWidgets.findIndex(w => w.id === targetWidgetId);
    if (targetIndex === -1) return;

    const insertAt = targetIndex >= sourceIndex ? targetIndex + 1 : targetIndex;
    newWidgets.splice(insertAt, 0, sourceWidget);
    this.addedWidgets.set(newWidgets);
    this.saveLayoutToBackend();
  }

  // Lädt Widgets vom Backend und teilt sie in addedWidgets und widgetsToAdd
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
        const allWidgets: Widget[] = [];
        const dashboardWidgets: Widget[] = [];

        for (const backendWidget of response.widgets) {
          const widget = this.mapBackendWidget(backendWidget);
          if (!widget) continue;

          allWidgets.push(widget);

          // Widgets mit position !== null sind auf dem Dashboard
          if (backendWidget.position !== null) {
            dashboardWidgets.push(widget);
          }
        }

        this.widgets.set(allWidgets);
        // Backend liefert bereits sortiert nach position
        this.addedWidgets.set(dashboardWidgets);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Widgets konnten nicht geladen werden.');
        this.isLoading.set(false);
      }
    });
  }

  private mapBackendWidget(backendWidget: FamilyWidgetDetailed): Widget | null {
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
      rows: backendWidget.grid_row ?? registry.defaultRows,
      cols: backendWidget.grid_col ?? registry.defaultCols,
    };
  }

  // Speichert das aktuelle Layout atomar ans Backend
  private saveLayoutToBackend() {
    const familyId = this.userState.currentFamilyId();
    if (!familyId) return;

    const layout: WidgetLayoutItem[] = this.addedWidgets().map((widget, index) => ({
      family_widget_id: widget.id,
      position: index,
      grid_col: widget.cols ?? 1,
      grid_row: widget.rows ?? 1,
    }));

    this.isSaving.set(true);
    this.familyService.saveWidgetLayout(familyId, layout).subscribe({
      next: () => {
        this.isSaving.set(false);
      },
      error: () => {
        this.isSaving.set(false);
        // Fehler ignorieren, lokales Layout bleibt
      }
    });
  }
}
