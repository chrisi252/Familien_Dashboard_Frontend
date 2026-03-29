import { Component, inject, OnInit, signal } from '@angular/core';
import { switchMap } from 'rxjs';
import { FamilyWidgetDetailed } from '../../../interfaces/widget';
import { FamilyService } from '../../../services/family-service';
import { UserStateService } from '../../../services/user-state-service';

@Component({
  selector: 'app-edit-widgets',
  imports: [],
  templateUrl: './edit-widgets.html',
  styleUrl: './edit-widgets.css',
})
export class EditWidgets implements OnInit {
  private familyService = inject(FamilyService);
  private userState = inject(UserStateService);

  widgets = signal<FamilyWidgetDetailed[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    const familyId = this.userState.currentFamilyId();

    if (familyId) {
      this.loadWidgets(familyId);
    } else {
      // familyId noch nicht geladen → erst getFamilies aufrufen
      this.familyService.getFamilies().pipe(
        switchMap((res: any) => {
          const id = res.families?.[0]?.family?.id;
          if (!id) throw new Error('Keine Familie gefunden');
          this.userState.currentFamilyId.set(id);
          return this.familyService.getFamilyWidgets(id);
        })
      ).subscribe({
        next: (res) => {
          this.widgets.set(res.widgets);
          this.isLoading.set(false);
        },
        error: () => {
          this.errorMessage.set('Widgets konnten nicht geladen werden.');
          this.isLoading.set(false);
        }
      });
    }
  }

  private loadWidgets(familyId: number) {
    this.familyService.getFamilyWidgets(familyId).subscribe({
      next: (res) => {
        this.widgets.set(res.widgets);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Widgets konnten nicht geladen werden.');
        this.isLoading.set(false);
      }
    });
  }
}
