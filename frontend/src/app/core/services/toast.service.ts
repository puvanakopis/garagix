import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title?: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private _toasts = signal<ToastMessage[]>([]);
  toasts = this._toasts.asReadonly();

  show(message: string, type: 'success' | 'error' | 'info' = 'info', title?: string, durationMs = 4000) {
    const id = Math.random().toString(36).substring(2, 9);
    const toast: ToastMessage = { id, type, title, message };
    this._toasts.update(current => [...current, toast]);

    setTimeout(() => {
      this.dismiss(id);
    }, durationMs);
  }

  showSuccess(message: string, title = 'Success') {
    this.show(message, 'success', title);
  }

  showError(message: string, title = 'Error') {
    this.show(message, 'error', title, 5000);
  }

  showInfo(message: string, title = 'Information') {
    this.show(message, 'info', title);
  }

  dismiss(id: string) {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }
}

