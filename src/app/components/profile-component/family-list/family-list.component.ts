import { Component, input, output } from '@angular/core';
import { FamilyMembership } from '../../../interfaces/user';
import { AlertBannerComponent } from '../../../shared/alert-banner/alert-banner.component';
import { ModalComponent } from '../../../shared/modal/modal.component';

@Component({
  selector: 'app-family-list',
  standalone: true,
  imports: [AlertBannerComponent, ModalComponent],
  templateUrl: './family-list.component.html',
})
export class FamilyListComponent {
  families = input.required<FamilyMembership[]>();
  familiesLoading = input<boolean>(false);
  deletingFamilyId = input<number | null>(null);
  deleteError = input<string>('');
  deleteLoading = input<boolean>(false);

  familySelected = output<FamilyMembership>();
  deleteRequested = output<number>();
  deleteConfirmed = output<void>();
  deleteCancelled = output<void>();

  isAdmin(membership: FamilyMembership): boolean {
    return membership.role.name === 'Familyadmin';
  }

  formatDate(dateAsString: string): string {
    const date = new Date(dateAsString);
    if (Number.isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('de-DE', { year: 'numeric', month: '2-digit', day: '2-digit' });
  }
}
