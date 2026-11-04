import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" (click)="onBackdropClick($event)">
        <div class="w-full max-w-md bg-[#141314] border border-[#292929] rounded-xl shadow-2xl overflow-hidden" role="dialog" aria-modal="true">
          <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
            <h3 class="text-lg font-bold font-oxanium text-white tracking-wide">{{ title() }}</h3>
            <button class="text-neutral-400 hover:text-white transition-colors p-1 rounded-md cursor-pointer" (click)="cancel.emit()" aria-label="Close dialog">
              <app-icon name="x" [size]="18" />
            </button>
          </div>
          <div class="px-6 py-5">
            <p class="text-neutral-300 text-sm leading-relaxed">{{ message() }}</p>
          </div>
          <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#222222] bg-[#0e0d0d]/40">
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#1f1e1f] hover:bg-[#292929] text-neutral-300 border border-[#333333] transition-colors cursor-pointer"
              (click)="cancel.emit()"
            >
              {{ cancelText() }}
            </button>
            <button
              type="button"
              class="px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer"
              (click)="confirm.emit()"
            >
              {{ confirmText() }}
            </button>
          </div>
        </div>
      </div>
    }
  `
})
export class ConfirmDialogComponent {
  isOpen = input<boolean>(false);
  title = input<string>('Confirm Action');
  message = input<string>('Are you sure you want to proceed?');
  confirmText = input<string>('Confirm');
  cancelText = input<string>('Cancel');

  confirm = output<void>();
  cancel = output<void>();

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('backdrop-blur-sm') || (event.target as HTMLElement).classList.contains('fixed')) {
      this.cancel.emit();
    }
  }
}
