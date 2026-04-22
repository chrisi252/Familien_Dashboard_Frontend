import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import {  AdminService } from '../../../services/admin-service';
import { AdminFamily } from '../../../interfaces/family-admin';
import { LoadingStateComponent } from '../../../shared/loading-state/loading-state.component';

@Component({
  selector: 'app-systemadmin-families',
  imports: [DatePipe, LoadingStateComponent],
  templateUrl: './families.html',
})
export class SystemadminFamilies implements OnInit {
  private adminService = inject(AdminService);
  private destroyRef = inject(DestroyRef);

  families = signal<AdminFamily[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.adminService.getFamilies().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (res) => {
        this.families.set(res.families);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Familien konnten nicht geladen werden.');
        this.isLoading.set(false);
      },
    });
  }
}
