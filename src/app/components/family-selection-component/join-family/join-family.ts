import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { ThemeSwitchComponent } from '../../theme-switch-component/theme-switch-component';
import { ActivatedRoute, Router } from '@angular/router';
import { FamilyService } from '../../../services/family-service';
import { UserStateService } from '../../../services/user-state-service';
import { FormsModule } from '@angular/forms';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-join-family',
  imports: [ThemeSwitchComponent, FormsModule],
  templateUrl: './join-family.html',
  styleUrl: './join-family.css',
})
export class JoinFamily implements OnInit {
  store = inject(FamilyService);
  private userState = inject(UserStateService);
  private cdr = inject(ChangeDetectorRef);
  errorMessage = '';
  isLoading = false;
  familyCode = '';
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  ngOnInit(): void {
    const routeFamilyId = this.route.snapshot.paramMap.get('familyId');
    if (routeFamilyId) {
      this.familyCode = routeFamilyId;
    }
  }

  onCancel() {
    this.router.navigate(['/family-selection']);
  }

  tryJoinFamily() {
    this.errorMessage = '';

    const parsedId = Number(this.familyCode);
    if (!this.familyCode || Number.isNaN(parsedId) || parsedId <= 0) {
      this.errorMessage = 'Bitte gib eine gueltige Familien-ID ein.';
      return;
    }

    this.isLoading = true;
    this.store.joinFamily(parsedId).subscribe({
      next: async () => {
        await firstValueFrom(this.userState.refreshFamilyContext());
        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error: { error?: { error?: string } }) => {
        this.isLoading = false;
        this.errorMessage = error.error?.error ?? 'Familie konnte nicht beigetreten werden.';
        this.cdr.markForCheck();
      },
    });
  }

}
