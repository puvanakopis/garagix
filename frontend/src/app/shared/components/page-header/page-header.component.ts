import { Component, ChangeDetectionStrategy, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
}

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="relative min-h-[280px] sm:min-h-[340px] flex items-center justify-center bg-cover bg-center py-20 px-4 text-center border-b border-[#1c1c1d] overflow-hidden" [style.background-image]="'url(' + currentBg() + ')'">
      <!-- Dark Automotive Atmosphere Overlay -->
      <div class="absolute inset-0 bg-[linear-gradient(180deg,rgba(14,13,13,0.78)_0%,rgba(14,13,13,0.92)_60%,#0e0d0d_100%)] z-0"></div>

      <!-- Subtle Grid Pattern / Tech Accents -->
      <div class="absolute inset-0 opacity-10 bg-[radial-gradient(#d70006_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

      <div class="container relative z-10 flex flex-col items-center gap-3 max-w-4xl">
        <h1 class="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-[0.06em] uppercase text-white drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          {{ title() }}
        </h1>
        <div class="w-12 h-1 bg-gx-primary my-1"></div>
        <nav aria-label="Breadcrumb" class="mt-1">
          <ol class="flex items-center flex-wrap justify-center gap-2 text-xs sm:text-sm font-display tracking-wider">
            <li>
              <a routerLink="/" class="text-gx-text-muted hover:text-white transition-colors">Home</a>
            </li>
            @for (crumb of breadcrumbs(); track crumb.label; let last = $last) {
              <li class="text-[#58595b]">/</li>
              <li>
                @if (!last && crumb.url) {
                  <a [routerLink]="crumb.url" class="text-gx-text-muted hover:text-white transition-colors">{{ crumb.label }}</a>
                } @else {
                  <span class="text-gx-primary font-bold">{{ crumb.label }}</span>
                }
              </li>
            }
          </ol>
        </nav>
      </div>
    </header>
  `
})
export class PageHeaderComponent {
  title = input.required<string>();
  breadcrumbs = input<BreadcrumbItem[]>([]);
  bgImage = input<string>('');

  currentBg(): string {
    return this.bgImage() || 'https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1600&auto=format&fit=crop&q=80';
  }
}
