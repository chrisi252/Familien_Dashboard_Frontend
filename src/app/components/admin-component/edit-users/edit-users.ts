import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { switchMap, take } from 'rxjs';
import { FamilyService } from '../../../services/family-service';
import { FamilyInviteCode } from '../../../interfaces/family';
import { FamilyMember, FamilyRoleName } from '../../../interfaces/user';
import { UserStateService } from '../../../services/user-state-service';
import { AlertBannerComponent } from '../../../shared/alert-banner/alert-banner.component';
import { ToastService } from '../../../shared/toast/toast.service';

@Component({
  selector: 'app-edit-users',
  imports: [AlertBannerComponent],
  templateUrl: './edit-users.html',
  styleUrl: './edit-users.css',
})
export class EditUsers implements OnInit, OnDestroy {
  private familyService = inject(FamilyService);
  private userState = inject(UserStateService);
  private toast = inject(ToastService);

  private countdownInterval: ReturnType<typeof setInterval> | null = null;

  members = signal<FamilyMember[]>([]);
  inviteCode = signal<FamilyInviteCode | null>(null);
  secondsLeft = signal(0);
  isGenerating = signal(false);
  inviteError = signal('');

  editingMemberId = signal<number | null>(null);
  actionError = signal('');
  actionLoading = signal(false);

  get currentUserId(): number | null {
    return this.userState.currentUser()?.id ?? null;
  }

  ngOnInit() {
    this.loadMembers();
  }

  ngOnDestroy() {
    this.clearCountdown();
  }

  private loadMembers() {
    this.userState.resolveCurrentFamilyId$().pipe(
      take(1),
      switchMap((familyId) => this.familyService.getFamilyById(familyId)),
    ).subscribe((detail) => {
      this.members.set(detail.members);
    });
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
        const msg = err.error?.error ?? 'Code konnte nicht generiert werden.';
        this.inviteError.set(msg);
        this.toast.error(msg);
        this.isGenerating.set(false);
      },
    });
  }

  toggleEdit(memberId: number) {
    this.actionError.set('');
    this.editingMemberId.set(this.editingMemberId() === memberId ? null : memberId);
  }

  changeRole(member: FamilyMember, newRole: FamilyRoleName) {
    const adminCount = this.members().filter(m => m.role_name === 'Familyadmin').length;
    if (member.role_name === 'Familyadmin' && newRole !== 'Familyadmin' && adminCount <= 1) {
      this.actionError.set('Der letzte Administrator kann nicht degradiert werden.');
      return;
    }

    this.actionLoading.set(true);
    this.actionError.set('');

    this.userState.resolveCurrentFamilyId$().pipe(
      take(1),
      switchMap((familyId) => this.familyService.changeMemberRole(familyId, member.user_id, newRole)),
    ).subscribe({
      next: (updated) => {
        this.members.update(list =>
          list.map(m => m.user_id === updated.user_id ? { ...m, role_name: updated.role_name } : m)
        );
        this.actionLoading.set(false);
        this.editingMemberId.set(null);
        this.toast.success('Rolle aktualisiert.');
      },
      error: (err) => {
        const msg = err.error?.error ?? 'Rolle konnte nicht geändert werden.';
        this.actionError.set(msg);
        this.toast.error(msg);
        this.actionLoading.set(false);
      },
    });
  }

  removeMember(member: FamilyMember) {
    if (member.user_id === this.currentUserId) {
      this.actionError.set('Du kannst dich nicht selbst entfernen.');
      return;
    }
    const adminCount = this.members().filter(m => m.role_name === 'Familyadmin').length;
    if (member.role_name === 'Familyadmin' && adminCount <= 1) {
      this.actionError.set('Der letzte Administrator kann nicht entfernt werden.');
      return;
    }

    this.actionLoading.set(true);
    this.actionError.set('');

    this.userState.resolveCurrentFamilyId$().pipe(
      take(1),
      switchMap((familyId) => this.familyService.removeMember(familyId, member.user_id)),
    ).subscribe({
      next: () => {
        this.members.update(list => list.filter(m => m.user_id !== member.user_id));
        this.actionLoading.set(false);
        this.editingMemberId.set(null);
        this.toast.success('Mitglied entfernt.');
      },
      error: (err) => {
        const msg = err.error?.error ?? 'Mitglied konnte nicht entfernt werden.';
        this.actionError.set(msg);
        this.toast.error(msg);
        this.actionLoading.set(false);
      },
    });
  }

  private startCountdown(expiresAt: Date) {
    const tick = () => {
      const diff = Math.max(0, Math.floor((expiresAt.getTime() - Date.now()) / 1000));
      this.secondsLeft.set(diff);
      if (diff === 0) {
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
