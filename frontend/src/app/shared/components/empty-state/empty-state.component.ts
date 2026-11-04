import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-empty-state',
  standalone: true,
  imports: [CommonModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col items-center justify-center text-center py-14 px-6 border border-dashed border-[#323232] rounded-2xl bg-[#141314] my-6">
      <div class="w-[72px] h-[72px] rounded-full bg-[#d70006]/10 border border-[#d70006]/30 flex items-center justify-center mb-5">
        <app-icon [name]="icon()" [size]="36" strokeColor="#d70006" />
      </div>
      <h3 class="text-xl font-bold font-oxanium text-white mb-2">{{ title() }}</h3>
      <p class="text-sm text-gx-text-secondary max-w-md mb-5 leading-relaxed">{{ description() }}</p>
      @if (actionLabel()) {
        <button
          type="button"
          class="px-5 py-2.5 border border-[#d70006] text-[#d70006] hover:bg-[#d70006] hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          (click)="action.emit()"
        >
          {{ actionLabel() }}
        </button>
      }
    </div>
  `
})
export class EmptyStateComponent {
  icon = input<string>('search');
  title = input.required<string>();
  description = input<string>('No matching records found. Try adjusting your filters.');
  actionLabel = input<string>('');
  action = output<void>();
}
