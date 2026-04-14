import { Component, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import {  AdminService } from '../../../services/admin-service';
import { AdminFamily } from '../../../interfaces/family-admin';

@Component({
  selector: 'app-systemadmin-families',
  imports: [DatePipe],
  templateUrl: './families.html',
})
export class SystemadminFamilies implements OnInit {
  private adminService = inject(AdminService);

  families = signal<AdminFamily[]>([]);
  isLoading = signal(true);
  errorMessage = signal('');

  ngOnInit() {
    this.adminService.getFamilies().subscribe({
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
