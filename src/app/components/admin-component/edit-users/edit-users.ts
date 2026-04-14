import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { FamilyInviteCode, FamilyService } from '../../../services/family-service';
import { FamilyMember } from '../../../interfaces/user';
import { UserStateService } from '../../../services/user-state-service';

@Component({
  selector: 'app-edit-users',
  imports: [],
  templateUrl: './edit-users.html',
  styleUrl: './edit-users.css',
})
export class EditUsers implements OnInit, OnDestroy {
  private familyService = inject(FamilyService);
  private userState = inject(UserStateService);

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  members = signal<FamilyMember[]>([]);
  inviteCode = signal<FamilyInviteCode | null>(null);
  secondsLeft = signal(0);
  isGenerating = signal(false);
  inviteError = signal('');

  ngOnInit() {
    this.userState.resolveCurrentFamilyId$().pipe(
      take(1),
      switchMap((familyId) => this.familyService.getFamilyById(familyId)),
    ).subscribe((detail) => {
      this.members.set(detail.members);
    });
  }

  ngOnDestroy() {
    this.clearCountdown();
  }

  generateCode() {
    this.isGenerating.set(true);
    this.inviteError.set('');
    this.clearCountdown();
    this.inviteCode.set(null);

    this.userState.resolveCurrentFamilyId$().pipe(
      take(1),
      switchMap((familyId) => this.familyService.generateInviteCode(familyId)),
    ).subscribe({
      next: (res) => {
        this.inviteCode.set(res);
        this.isGenerating.set(false);
        
       
        let dateString = res.expires_at;
        if (!dateString.endsWith('Z')) {
            dateString += 'Z';
        }
        
        this.startCountdown(new Date(dateString));
      },
      error: (err) => {
        this.inviteError.set(err.error?.error ?? 'Code konnte nicht generiert werden.');
        this.isGenerating.set(false);
      },
    });
  }

  private startCountdown(expiresAt: Date) {
    const tick = () => {
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
      this.secondsLeft.set(diff);
      if (diff === 0) {
      //  this.inviteCode.set(null);
        this.clearCountdown();
      }
    };
    tick();
    this.countdownInterval = setInterval(tick, 1000);
  }

  private clearCountdown() {
    if (this.countdownInterval !== null) {
      clearInterval(this.countdownInterval);
      this.countdownInterval = null;
    }
  }

  get countdownDisplay(): string {
    const s = this.secondsLeft();
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  }
}
