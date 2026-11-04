import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { IconComponent } from '../icon/icon.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="sticky top-0 z-50 bg-[#0e0d0d]/95 backdrop-blur-md border-b border-[#58595b]/20 transition-all">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-6">
        <!-- Garagix Brand Logo (BootLab Automotive Style) -->
        <a routerLink="/" class="flex items-center" aria-label="Garagix Auto Care">
          <div class="flex flex-col justify-center leading-none">
            <div class="font-oxanium text-2xl sm:text-[28px] font-extrabold tracking-wider leading-none uppercase">
              <span class="text-white">GARA</span><span class="text-[#d70006]">GIX</span>
            </div>
            <div class="flex items-center gap-2 mt-1">
              <span class="text-[10px] font-bold tracking-[0.16em] text-[#878f97] uppercase">PRECISION AUTO CARE</span>
              <span class="inline-block w-3.5 h-[2px] bg-[#d70006]"></span>
            </div>
          </div>
        </a>

        <!-- Desktop Navigation Links matching BootLab -->
        <nav class="hidden lg:flex items-center gap-8" aria-label="Main Navigation">
          <a routerLink="/" routerLinkActive="!text-[#d70006] !border-[#d70006]" [routerLinkActiveOptions]="{ exact: true }" class="text-[15px] font-medium text-white hover:text-[#d70006] py-1 transition-colors border-b-2 border-transparent">Home</a>
          <a routerLink="/services" routerLinkActive="!text-[#d70006] !border-[#d70006]" class="text-[15px] font-medium text-white hover:text-[#d70006] py-1 transition-colors border-b-2 border-transparent">Services</a>
          <a routerLink="/about" routerLinkActive="!text-[#d70006] !border-[#d70006]" class="text-[15px] font-medium text-white hover:text-[#d70006] py-1 transition-colors border-b-2 border-transparent">About Us</a>
          <a routerLink="/team" routerLinkActive="!text-[#d70006] !border-[#d70006]" class="text-[15px] font-medium text-white hover:text-[#d70006] py-1 transition-colors border-b-2 border-transparent">Our Team</a>
          <a routerLink="/contact" routerLinkActive="!text-[#d70006] !border-[#d70006]" class="text-[15px] font-medium text-white hover:text-[#d70006] py-1 transition-colors border-b-2 border-transparent">Contact Us</a>
        </nav>

        <!-- Right Action Items -->
        <div class="flex items-center gap-4">
          <!-- Signature Red CTA Button ("LOGIN") -->
          <a routerLink="/auth/login" class="inline-flex items-center justify-center bg-[#d70006] hover:bg-transparent text-white border border-[#d70006] hover:border-white px-6 py-2.5 font-oxanium text-sm font-bold uppercase tracking-wider transition-all duration-300">
            <span>LOGIN</span>
          </a>

          <!-- Mobile Menu Hamburger Button -->
          <button
            class="lg:hidden p-2 text-white hover:text-[#d70006] transition-colors cursor-pointer"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Toggle navigation menu"
          >
            <app-icon [name]="mobileMenuOpen() ? 'x' : 'menu'" [size]="24" />
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      @if (mobileMenuOpen()) {
        <div class="lg:hidden absolute top-full left-0 right-0 bg-[#0e0d0d] border-b border-[#222222] px-6 py-5 shadow-2xl">
          <div class="flex flex-col gap-3">
            <a routerLink="/" (click)="closeMobileMenu()" routerLinkActive="!text-[#d70006]" [routerLinkActiveOptions]="{ exact: true }" class="text-base font-medium text-white hover:text-[#d70006] py-2 border-b border-[#1c1c1d] transition-colors">Home</a>
            <a routerLink="/services" (click)="closeMobileMenu()" routerLinkActive="!text-[#d70006]" class="text-base font-medium text-white hover:text-[#d70006] py-2 border-b border-[#1c1c1d] transition-colors">Services</a>
            <a routerLink="/about" (click)="closeMobileMenu()" routerLinkActive="!text-[#d70006]" class="text-base font-medium text-white hover:text-[#d70006] py-2 border-b border-[#1c1c1d] transition-colors">About Us</a>
            <a routerLink="/team" (click)="closeMobileMenu()" routerLinkActive="!text-[#d70006]" class="text-base font-medium text-white hover:text-[#d70006] py-2 border-b border-[#1c1c1d] transition-colors">Our Team</a>
            <a routerLink="/contact" (click)="closeMobileMenu()" routerLinkActive="!text-[#d70006]" class="text-base font-medium text-white hover:text-[#d70006] py-2 border-b border-[#1c1c1d] transition-colors">Contact Us</a>

            <div class="h-px bg-[#222222] my-2"></div>

            @if (authService.isAuthenticated()) {
              <div class="text-xs text-[#878f97]">
                Signed in as: <strong class="text-white">{{ authService.currentUser()?.name }}</strong>
              </div>
              <button (click)="authService.logout(); closeMobileMenu()" class="mt-2 px-4 py-2 text-xs font-bold uppercase tracking-wider text-neutral-300 border border-[#333333] hover:border-red-500 hover:text-red-500 rounded transition-colors self-start cursor-pointer">
                Sign Out
              </button>
            } @else {
              <a routerLink="/auth/login" (click)="closeMobileMenu()" class="inline-flex items-center justify-center bg-[#d70006] text-white py-2.5 px-4 font-oxanium text-xs font-bold uppercase tracking-wider">
                Login
              </a>
            }
          </div>
        </div>
      }
    </header>
  `
})
export class NavbarComponent {
  authService = inject(AuthService);
  mobileMenuOpen = signal<boolean>(false);

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }
}
