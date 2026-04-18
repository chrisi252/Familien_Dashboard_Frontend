import { computed, Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ModalStateService {
  private openCount = signal(0);

  isAnyOpen = computed(() => this.openCount() > 0);

  register(): void {
    this.openCount.update(n => n + 1);
  }

  unregister(): void {
    this.openCount.update(n => Math.max(0, n - 1));
  }
}
