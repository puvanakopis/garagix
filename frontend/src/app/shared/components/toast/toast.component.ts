import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-5 right-5 z-[9999] flex flex-col gap-2.5 max-w-sm w-full pointer-events-none p-4" aria-live="polite">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl border backdrop-blur-md shadow-2xl transition-all duration-300"
          [ngClass]="{
            'bg-[#0e1713]/95 border-emerald-500/40 shadow-emerald-950/40': toast.type === 'success',
            'bg-[#1a0f0f]/95 border-red-500/50 shadow-red-950/40': toast.type === 'error',
            'bg-[#0e151a]/95 border-sky-500/40 shadow-sky-950/40': toast.type !== 'success' && toast.type !== 'error'
          }"
        >
          @if (toast.type === 'success') {
            <app-icon name="check-circle" [size]="20" strokeColor="#34d399" />
          } @else if (toast.type === 'error') {
            <app-icon name="alert-circle" [size]="20" strokeColor="#fb7185" />
          } @else {
            <app-icon name="info" [size]="20" strokeColor="#38bdf8" />
          }
          <div class="flex-1 flex flex-col gap-0.5 min-w-0">
            @if (toast.title) {
              <div class="font-bold text-xs uppercase tracking-wider text-white font-oxanium">{{ toast.title }}</div>
            }
            <div class="text-xs text-neutral-300 leading-normal break-words">{{ toast.message }}</div>
          </div>
          <button
            class="text-neutral-400 hover:text-white transition-opacity p-0.5 rounded cursor-pointer shrink-0"
            (click)="toastService.dismiss(toast.id)"
            aria-label="Dismiss toast"
          >
            <app-icon name="x" [size]="16" />
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  toastService = inject(ToastService);
}
