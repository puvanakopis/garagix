import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { IconComponent } from '../../shared/components/icon/icon.component';

@Component({
  selector: 'app-customer-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex min-h-screen bg-[#0e0d0d]">
      <!-- Sidebar -->
      <aside
        class="w-64 bg-[#100e0f] border-r border-[#222222] flex flex-col fixed lg:sticky top-0 h-screen z-40 transition-transform duration-300"
        [ngClass]="mobileSidebarOpen() ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'"
      >
        <div class="p-5 border-b border-[#222222] flex items-center justify-between">
          <a routerLink="/" class="flex items-center">
            <div class="flex flex-col">
              <span class="font-oxanium text-lg font-bold text-white tracking-wide">GARA<span class="text-[#d70006]">GIX</span></span>
              <span class="text-[9px] uppercase tracking-widest text-[#74787c] font-semibold">Customer Portal</span>
            </div>
          </a>
          <button class="lg:hidden text-neutral-400 hover:text-white p-1" (click)="toggleMobileSidebar()" aria-label="Close sidebar">
            <app-icon name="x" [size]="20" />
          </button>
        </div>

        <nav class="flex-1 overflow-y-auto px-3 py-4 flex flex-col gap-1">
          <div class="px-3 pt-2 pb-1 text-[10px] font-bold tracking-widest uppercase text-[#58595b] font-oxanium">MAIN MENU</div>
          <a
            routerLink="/customer/dashboard"
            routerLinkActive="!bg-[#d70006]/10 !text-[#d70006]"
            (click)="closeMobileSidebar()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#1a1919] transition-all"
          >
            <app-icon name="activity" [size]="18" />
            <span>Dashboard</span>
          </a>
          <a
            routerLink="/customer/services"
            routerLinkActive="!bg-[#d70006]/10 !text-[#d70006]"
            (click)="closeMobileSidebar()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#1a1919] transition-all"
          >
            <app-icon name="wrench" [size]="18" />
            <span>Explore Services</span>
          </a>
          <a
            routerLink="/customer/book-repair"
            routerLinkActive="!bg-[#d70006]/10 !text-[#d70006]"
            (click)="closeMobileSidebar()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#1a1919] transition-all"
          >
            <app-icon name="plus" [size]="18" />
            <span>Book Repair</span>
          </a>
          <a
            routerLink="/customer/track-repair"
            routerLinkActive="!bg-[#d70006]/10 !text-[#d70006]"
            (click)="closeMobileSidebar()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#1a1919] transition-all"
          >
            <app-icon name="gauge" [size]="18" />
            <span>Track Repair</span>
          </a>
          <a
            routerLink="/customer/bookings"
            routerLinkActive="!bg-[#d70006]/10 !text-[#d70006]"
            (click)="closeMobileSidebar()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#1a1919] transition-all"
          >
            <app-icon name="calendar" [size]="18" />
            <span>My Bookings</span>
          </a>

          <div class="px-3 pt-4 pb-1 text-[10px] font-bold tracking-widest uppercase text-[#58595b] font-oxanium">PREFERENCES</div>
          <a
            routerLink="/customer/profile"
            routerLinkActive="!bg-[#d70006]/10 !text-[#d70006]"
            (click)="closeMobileSidebar()"
            class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-300 hover:text-white hover:bg-[#1a1919] transition-all"
          >
            <app-icon name="user" [size]="18" />
            <span>Profile</span>
          </a>
        </nav>

        <div class="p-3 border-t border-[#222222] bg-[#0c0a0a]">
          <div class="flex items-center gap-3 p-2 rounded-lg bg-[#141314] border border-[#222222]">
            <div class="w-8 h-8 rounded-full bg-[#201517] border border-[#d70006]/40 flex items-center justify-center shrink-0 text-[#d70006] font-bold text-xs font-oxanium">
              {{ authService.currentUser()?.name?.charAt(0) || 'C' }}
            </div>
            <div class="flex-1 min-w-0">
              <p class="text-xs font-semibold text-white truncate">{{ authService.currentUser()?.name }}</p>
              <p class="text-[10px] text-neutral-400 truncate">{{ authService.currentUser()?.email }}</p>
            </div>
            <button class="text-neutral-400 hover:text-red-400 p-1 transition-colors cursor-pointer" (click)="authService.logout()" title="Sign Out">
              <app-icon name="log-out" [size]="16" strokeColor="#fb7185" />
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Layout Surface -->
      <div class="flex-1 flex flex-col min-w-0">
        <!-- Topbar -->
        <header class="h-16 px-4 sm:px-6 border-b border-[#222222] bg-[#100e0f]/90 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between gap-4">
          <div class="flex items-center gap-3">
            <button class="lg:hidden text-neutral-300 hover:text-white p-1.5" (click)="toggleMobileSidebar()" aria-label="Toggle mobile menu">
              <app-icon name="menu" [size]="20" />
            </button>
          </div>

          <div class="flex items-center gap-3">
            <!-- Profile Info Pill -->
            <a routerLink="/customer/profile" class="flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#141314] border border-[#222222] hover:border-neutral-500 transition-colors">
              <span class="px-1.5 py-0.5 rounded bg-[#d70006] text-white text-[9px] font-bold font-oxanium">CUSTOMER</span>
              <span class="text-xs font-medium text-white">{{ authService.currentUser()?.name?.split(' ')?.[0] }}</span>
            </a>
          </div>
        </header>

        <!-- Main Inner View -->
        <main class="flex-1 p-4 sm:p-6 lg:p-8">
          <router-outlet (activate)="onActivate()" />
        </main>
      </div>

      <!-- Backdrop for mobile sidebar -->
      @if (mobileSidebarOpen()) {
        <div class="fixed inset-0 bg-black/70 backdrop-blur-xs z-35 lg:hidden" (click)="closeMobileSidebar()"></div>
      }
    </div>
  `
})
export class CustomerLayoutComponent {
  authService = inject(AuthService);
  sidebarCollapsed = signal<boolean>(false);
  mobileSidebarOpen = signal<boolean>(false);

  toggleMobileSidebar(): void {
    this.mobileSidebarOpen.update(v => !v);
  }

  closeMobileSidebar(): void {
    this.mobileSidebarOpen.set(false);
  }

  onActivate(): void {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }
  }
}
