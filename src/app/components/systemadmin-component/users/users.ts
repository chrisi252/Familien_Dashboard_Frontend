import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { AdminService } from '../../../services/admin-service';
import { UserWithFamilies } from '../../../interfaces/family-admin';
import { LoadingStateComponent } from '../../../shared/loading-state/loading-state.component';

@Component({
  selector: 'app-systemadmin-users',
  imports: [DatePipe, LoadingStateComponent],
  templateUrl: './users.html',
})
export class SystemadminUsers implements OnInit {
  private adminService = inject(AdminService);
  private destroyRef = inject(DestroyRef);

  users = signal<UserWithFamilies[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');
  expandedUserId = signal<number | null>(null);

  ngOnInit() {
    this.adminService.getUsers().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.users.set(res.users);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Benutzer konnten nicht geladen werden.');
        this.isLoading.set(false);
      },
    });
  }

  toggleExpand(userId: number) {
    this.expandedUserId.set(this.expandedUserId() === userId ? null : userId);
  }
}
