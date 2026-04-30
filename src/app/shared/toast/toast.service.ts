import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private nextId = 1;
  private readonly _toasts = signal<Toast[]>([]);
  readonly toasts = this._toasts.asReadonly();

  success(message: string, durationMs = 3500) {
    this.show(message, 'success', durationMs);
  }

  error(message: string, durationMs = 5000) {
    this.show(message, 'error', durationMs);
  }

  info(message: string, durationMs = 3500) {
    this.show(message, 'info', durationMs);
  }

  dismiss(id: number) {
    this._toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private show(message: string, type: ToastType, durationMs: number) {
    const id = this.nextId++;
    this._toasts.update((list) => [...list, { id, message, type }]);
    if (durationMs > 0) {
      setTimeout(() => this.dismiss(id), durationMs);
    }
  }
}
