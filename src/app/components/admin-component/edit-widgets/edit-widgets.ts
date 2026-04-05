import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin, switchMap } from 'rxjs';
import { FamilyWidgetDetailed } from '../../../interfaces/widget';
import { FamilyMember } from '../../../interfaces/user';
import { FamilyService } from '../../../services/family-service';
import { UserStateService } from '../../../services/user-state-service';
import { FormsModule } from '@angular/forms';

const KNOWN_WIDGET_KEYS = [
  { key: 'todo', label: 'Aufgaben' },
  { key: 'weather', label: 'Wetter' },
  { key: 'notes', label: 'Notizen' },
  { key: 'schedule', label: 'Termine' },
  { key: 'calendar', label: 'Kalender' },
];

@Component({
  selector: 'app-edit-widgets',
  imports: [FormsModule],
  templateUrl: './edit-widgets.html',
  styleUrl: './edit-widgets.css',
})
export class EditWidgets implements OnInit {
  private familyService = inject(FamilyService);
  private userState = inject(UserStateService);

  widgets = signal<FamilyWidgetDetailed[]>([]);
  members = signal<FamilyMember[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  actionError = signal('');

  newWidgetKey = signal('todo');
  activating = signal(false);

  deactivatingId = signal<number | null>(null);
  savingPermission = signal<string | null>(null);

  readonly knownWidgetKeys = KNOWN_WIDGET_KEYS;

  private familyId: number | null = null;

  ngOnInit() {
    this.resolveFamilyId()
      .pipe(
        switchMap((id) => {
          this.familyId = id;
          return forkJoin({
            widgetsRes: this.familyService.getFamilyWidgets(id),
            familyRes: this.familyService.getFamilyById(id),
          });
        }),
      )
      .subscribe({
        next: ({ widgetsRes, familyRes }) => {
          this.widgets.set(widgetsRes.widgets);
          this.members.set(familyRes.members);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Daten konnten nicht geladen werden.');
          this.isLoading.set(false);
        },
      });
  }

  activateWidget() {
    if (!this.familyId) return;
    const key = this.newWidgetKey().trim();
    if (!key) return;

    this.actionError.set('');
    this.activating.set(true);

    this.familyService.activateWidget(this.familyId, key).subscribe({
      next: (widget) => {
        this.widgets.set([...this.widgets(), widget]);
        this.activating.set(false);
      },
      error: (err) => {
        this.actionError.set(err?.error?.error ?? 'Widget konnte nicht aktiviert werden.');
        this.activating.set(false);
      },
    });
  }

  deactivateWidget(widgetId: number) {
    if (!this.familyId) return;
    this.actionError.set('');
    this.deactivatingId.set(widgetId);

    this.familyService.deactivateWidget(this.familyId, widgetId).subscribe({
      next: () => {
        this.widgets.set(this.widgets().filter((w) => w.id !== widgetId));
        this.deactivatingId.set(null);
      },
      error: (err) => {
        this.actionError.set(err?.error?.error ?? 'Widget konnte nicht deaktiviert werden.');
        this.deactivatingId.set(null);
      },
    });
  }

  savePermission(widgetId: number, userId: number, canView: boolean, canEdit: boolean) {
    if (!this.familyId) return;
    const key = `${widgetId}-${userId}`;
    this.savingPermission.set(key);

    this.familyService.updateWidgetUserPermission(this.familyId, widgetId, userId, canView, canEdit).subscribe({
      next: () => this.savingPermission.set(null),
      error: (err) => {
        this.actionError.set(err?.error?.error ?? 'Berechtigung konnte nicht gespeichert werden.');
        this.savingPermission.set(null);
      },
    });
  }

  availableWidgetKeys() {
    const activeKeys = new Set(this.widgets().map((w) => w.widget_key));
    return this.knownWidgetKeys.filter((k) => !activeKeys.has(k.key));
  }

  private resolveFamilyId() {
    return this.userState.resolveCurrentFamilyId$();
  }
}
