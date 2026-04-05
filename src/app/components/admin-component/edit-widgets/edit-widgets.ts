import { Component, inject, OnInit, signal } from '@angular/core';
import { forkJoin, switchMap } from 'rxjs';
import { FamilyWidgetDetailed, WidgetUserPermission } from '../../../interfaces/widget';
import { FamilyMember } from '../../../interfaces/user';
import { FamilyService } from '../../../services/family-service';
import { UserStateService } from '../../../services/user-state-service';
import { FormsModule } from '@angular/forms';

interface PermissionState {
  canView: boolean;
  canEdit: boolean;
}

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
  successMessage = signal('');

  savingPermission = signal<string | null>(null);

  // Speichert den aktuellen Zustand der Berechtigungen: key = "widgetId-userId"
  permissionStates = signal<Map<string, PermissionState>>(new Map());

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
          this.loadAllPermissions(widgetsRes.widgets);
        },
        error: () => {
          this.errorMessage.set('Daten konnten nicht geladen werden.');
          this.isLoading.set(false);
        },
      });
  }

  private loadAllPermissions(widgets: FamilyWidgetDetailed[]) {
    if (!this.familyId || widgets.length === 0) {
      this.isLoading.set(false);
      return;
    }

    const permissionRequests = widgets.map(widget => 
      this.familyService.getWidgetPermissions(this.familyId!, widget.id)
    );

    forkJoin(permissionRequests).subscribe({
      next: (responses) => {
        const states = new Map<string, PermissionState>();
        
        responses.forEach((response, index) => {
          const widgetId = widgets[index].id;
          for (const perm of response.permissions) {
            const key = `${widgetId}-${perm.user_id}`;
            states.set(key, {
              canView: perm.can_view,
              canEdit: perm.can_edit,
            });
          }
        });
        
        this.permissionStates.set(states);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Berechtigungen konnten nicht geladen werden.');
        this.isLoading.set(false);
      },
    });
  }

  getPermission(widgetId: number, userId: number): PermissionState {
    const key = `${widgetId}-${userId}`;
    return this.permissionStates().get(key) ?? { canView: true, canEdit: false };
  }

  updateLocalPermission(widgetId: number, userId: number, field: 'canView' | 'canEdit', value: boolean) {
    const key = `${widgetId}-${userId}`;
    const current = this.getPermission(widgetId, userId);
    const updated = { ...current, [field]: value };
    
    const newStates = new Map(this.permissionStates());
    newStates.set(key, updated);
    this.permissionStates.set(newStates);
  }

  savePermission(widgetId: number, userId: number) {
    if (!this.familyId) return;
    
    const permission = this.getPermission(widgetId, userId);
    const key = `${widgetId}-${userId}`;
    
    this.savingPermission.set(key);
    this.actionError.set('');
    this.successMessage.set('');

    this.familyService.updateWidgetUserPermission(
      this.familyId, 
      widgetId, 
      userId, 
      permission.canView, 
      permission.canEdit
    ).subscribe({
      next: () => {
        this.savingPermission.set(null);
        this.successMessage.set('Berechtigung gespeichert!');
        setTimeout(() => this.successMessage.set(''), 2000);
      },
      error: (err) => {
        this.actionError.set(err?.error?.error ?? 'Berechtigung konnte nicht gespeichert werden.');
        this.savingPermission.set(null);
      },
    });
  }

  private resolveFamilyId() {
    return this.userState.resolveCurrentFamilyId$();
  }
}
