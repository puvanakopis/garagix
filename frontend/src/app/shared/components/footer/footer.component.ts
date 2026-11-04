import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="bg-black text-[#878f97] border-t border-[#1a1a1a] mt-auto text-sm">
      <!-- Main 4-Column Footer -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <!-- Column 1: Brand & Bio -->
          <div class="flex flex-col gap-5">
            <a routerLink="/" class="flex items-center" aria-label="Garagix Home">
              <div class="flex flex-col justify-center leading-none">
                <div class="font-oxanium text-2xl font-extrabold tracking-wider leading-none uppercase">
                  <span class="text-white">GARA</span><span class="text-[#d70006]">GIX</span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-[10px] font-bold tracking-[0.16em] text-[#878f97] uppercase">PRECISION AUTO CARE</span>
                  <span class="inline-block w-3.5 h-[2px] bg-[#d70006]"></span>
                </div>
              </div>
            </a>
            <p class="text-sm text-[#878f97] leading-relaxed">
              Identify hidden issues quickly with advanced diagnostics. Our cutting-edge tools and experienced technicians ensure accurate assessments to keep every ride safe.
            </p>
            <div class="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-[#141314] border border-[#292929] hover:border-[#d70006] hover:bg-[#d70006] text-white flex items-center justify-center transition-all duration-300" aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-[#141314] border border-[#292929] hover:border-[#d70006] hover:bg-[#d70006] text-white flex items-center justify-center transition-all duration-300" aria-label="Twitter">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-[#141314] border border-[#292929] hover:border-[#d70006] hover:bg-[#d70006] text-white flex items-center justify-center transition-all duration-300" aria-label="YouTube">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s-0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="w-9 h-9 rounded-full bg-[#141314] border border-[#292929] hover:border-[#d70006] hover:bg-[#d70006] text-white flex items-center justify-center transition-all duration-300" aria-label="LinkedIn">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
                </svg>
              </a>
            </div>
          </div>

          <!-- Column 2: Useful Links -->
          <div>
            <h4 class="font-oxanium font-bold text-white tracking-wider uppercase text-base mb-6 relative pb-2 after:content-[''] after:block after:w-8 after:h-[2px] after:bg-[#d70006] after:mt-2">
              USEFUL LINKS
            </h4>
            <ul class="flex flex-col gap-3">
              <li>
                <a routerLink="/" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Home</span>
                </a>
              </li>
              <li>
                <a routerLink="/services" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Services</span>
                </a>
              </li>
              <li>
                <a routerLink="/about" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>About Us</span>
                </a>
              </li>
              <li>
                <a routerLink="/team" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Our Team</span>
                </a>
              </li>
              <li>
                <a routerLink="/contact" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Contact Us</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 3: Service Industry -->
          <div>
            <h4 class="font-oxanium font-bold text-white tracking-wider uppercase text-base mb-6 relative pb-2 after:content-[''] after:block after:w-8 after:h-[2px] after:bg-[#d70006] after:mt-2">
              SERVICE INDUSTRY
            </h4>
            <ul class="flex flex-col gap-3">
              <li>
                <a routerLink="/services" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Services Details</span>
                </a>
              </li>
              <li>
                <a routerLink="/team" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Team Details</span>
                </a>
              </li>
              <li>
                <a routerLink="/services" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Project Details</span>
                </a>
              </li>
              <li>
                <a routerLink="/about" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Changelog</span>
                </a>
              </li>
              <li>
                <a routerLink="/about" class="group flex items-center gap-2.5 text-[#878f97] hover:text-[#d70006] transition-colors">
                  <span class="text-xs text-[#d70006] transition-transform duration-200 group-hover:translate-x-1">&#10132;</span>
                  <span>Licenses</span>
                </a>
              </li>
            </ul>
          </div>

          <!-- Column 4: Address Company -->
          <div>
            <h4 class="font-oxanium font-bold text-white tracking-wider uppercase text-base mb-6 relative pb-2 after:content-[''] after:block after:w-8 after:h-[2px] after:bg-[#d70006] after:mt-2">
              ADDRESS COMPANY
            </h4>
            <ul class="flex flex-col gap-4 text-xs text-[#878f97]">
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded bg-[#141314] border border-[#292929] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d70006" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                </div>
                <span class="leading-relaxed">24 Newyork, June Lanemard Felkwide 5254, 2541 ch</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded bg-[#141314] border border-[#292929] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d70006" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span class="leading-relaxed">+(452) 125482215421254</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded bg-[#141314] border border-[#292929] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d70006" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="16" x="2" y="4" rx="2"/>
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                  </svg>
                </div>
                <span class="leading-relaxed">E-mail: garage&#64;gmail.com</span>
              </li>
              <li class="flex items-start gap-3">
                <div class="w-8 h-8 rounded bg-[#141314] border border-[#292929] flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d70006" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <polyline points="12 6 12 12 16 14"/>
                  </svg>
                </div>
                <span class="leading-relaxed">Open Hour: 10 - 12 PM</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Bottom Copyright Bar -->
      <div class="border-t border-[#1a1a1a] bg-[#070606] py-6">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#58595b]">
          <p>
            Copyright &copy; 2026 <span class="text-[#d70006] font-medium">Garagix</span>. All Rights Reserved.
          </p>
          <div class="flex items-center gap-3">
            <a routerLink="/auth/login" class="hover:text-white transition-colors">Staff Login</a>
            <span class="text-[#292929]">&bull;</span>
            <a routerLink="/privacy" class="hover:text-white transition-colors">Privacy</a>
            <span class="text-[#292929]">&bull;</span>
            <a routerLink="/terms" class="hover:text-white transition-colors">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {
  private toastService = inject(ToastService);
  emailInput = '';

  subscribeNewsletter() {
    if (!this.emailInput.trim()) return;
    this.toastService.show('Thank you! Your submission has been received!', 'success');
    this.emailInput = '';
  }
}
