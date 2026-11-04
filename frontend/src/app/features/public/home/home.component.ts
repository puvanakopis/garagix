import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas text-gx-text-primary overflow-x-hidden min-h-screen">
      <!-- 1. Hero Section -->
      <section class="relative min-h-[85vh] sm:min-h-[90vh] flex items-center py-20 sm:py-32 overflow-hidden bg-gx-canvas">
        <div class="absolute inset-0 bg-hero-overlay z-[1]"></div>
        <img
          src="/images/home/hero-garage.jpg"
          alt="Garagix Precision Workshop Hero"
          class="absolute inset-0 w-full h-full object-cover object-center z-0"
        />

        <div class="container relative z-[2] mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="max-w-[700px]">
            <div>
              <span class="sub-tag-red">Well Come Our Company</span>
              <h1 class="font-display text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] font-bold leading-[1.05] text-white my-4 sm:mb-8 tracking-[0.02em]">
                Keeping You<br>
                on Road Safely<br>
                Smoothly
              </h1>
            </div>

            <div class="flex">
              <a routerLink="/services" class="bootlab-btn-primary">
                <span>VIEW SERVICES</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- 2. Trusted Property Partners Section -->
      <section class="bg-gx-surface border-y border-gx-border-subtle py-14 sm:py-16">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="mb-10 sm:mb-12">
            <span class="sub-tag-red">Our trusted partners</span>
            <h2 class="bootlab-section-title">
              Our Trusted Property Partners
            </h2>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Partner 1 -->
            <div class="bg-gx-card border border-gx-border-subtle p-6 flex flex-col gap-6 transition-all duration-300 hover:border-gx-primary hover:-translate-y-1 group">
              <div class="flex items-center h-9">
                <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/699652d09bcfaffc56382a9c_Vector.svg" alt="Vector" class="h-6 w-auto" />
              </div>
              <div class="h-[90px] overflow-hidden">
                <img src="/images/home/partner-1.jpg" alt="Partner 1" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            <!-- Partner 2 -->
            <div class="bg-gx-card border border-gx-border-subtle p-6 flex flex-col gap-6 transition-all duration-300 hover:border-gx-primary hover:-translate-y-1 group">
              <div class="flex items-center h-9">
                <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/6996542cd7952a724a96359a_Vector%20(1).svg" alt="Vector" class="h-6 w-auto" />
              </div>
              <div class="h-[90px] overflow-hidden">
                <img src="/images/home/partner-2.jpg" alt="Partner 2" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            <!-- Partner 3 -->
            <div class="bg-gx-card border border-gx-border-subtle p-6 flex flex-col gap-6 transition-all duration-300 hover:border-gx-primary hover:-translate-y-1 group">
              <div class="flex items-center h-9">
                <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/6996542c71185d2ac88553cc_Vector%20(2).svg" alt="Vector" class="h-6 w-auto" />
              </div>
              <div class="h-[90px] overflow-hidden">
                <img src="/images/home/partner-3.jpg" alt="Partner 3" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>

            <!-- Partner 4 -->
            <div class="bg-gx-card border border-gx-border-subtle p-6 flex flex-col gap-6 transition-all duration-300 hover:border-gx-primary hover:-translate-y-1 group">
              <div class="flex items-center h-9">
                <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/699652d09bcfaffc56382a9c_Vector.svg" alt="Vector" class="h-6 w-auto" />
              </div>
              <div class="h-[90px] overflow-hidden">
                <img src="/images/home/partner-4.jpg" alt="Partner 4" class="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Keep Track Of Every Service And Repair -->
      <section class="bg-gx-canvas py-16 sm:py-24 md:py-28">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px] grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">
          <!-- Left: Mechanic Image -->
          <div>
            <div class="w-full h-[360px] sm:h-[460px] lg:h-[520px] overflow-hidden border border-gx-border">
              <img
                src="/images/home/service-feature.jpg"
                alt="Professional Diagnostic Calibration"
                class="w-full h-full object-cover"
              />
            </div>
          </div>

          <!-- Right: Service Highlights Content -->
          <div>
            <span class="sub-tag-red">Well Come Our Company</span>
            <h2 class="bootlab-section-title">
              Keep Track Of Every Service<br>
              And Repair
            </h2>

            <div class="flex flex-col gap-6 my-8">
              <div class="flex items-start gap-4 sm:gap-5">
                <div class="w-12 h-12 bg-gx-card border border-[#292929] flex items-center justify-center shrink-0">
                  <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/6996a7e52e023bac404f52a8_Services%20Icon%20(3).png" alt="Trusted Automotive Care for Mile" class="w-6 h-6 object-contain" />
                </div>
                <div>
                  <h3 class="font-display text-lg sm:text-xl font-bold text-white mb-1">Trusted Automotive Care for Mile</h3>
                  <p class="text-sm sm:text-[0.9375rem] text-gx-text-secondary leading-relaxed">Experienced technicians and quality parts keep your car running smoothly mile after mile.</p>
                </div>
              </div>

              <div class="flex items-start gap-4 sm:gap-5">
                <div class="w-12 h-12 bg-gx-card border border-[#292929] flex items-center justify-center shrink-0">
                  <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/6996a7e59193b32ee849df6d_Services%20Icon%20(2).png" alt="24/7 Customer Support" class="w-6 h-6 object-contain" />
                </div>
                <div>
                  <h3 class="font-display text-lg sm:text-xl font-bold text-white mb-1">24/7 Customer Support</h3>
                  <p class="text-sm sm:text-[0.9375rem] text-gx-text-secondary leading-relaxed">Always here when you need us, day or night, for reliable and immediate vehicle care.</p>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-6 sm:gap-10 flex-wrap">
              <a routerLink="/services" class="bootlab-btn-primary">
                <span>VIEW SERVICES</span>
              </a>

              <div class="flex items-center gap-3.5 group cursor-pointer">
                <div class="w-11 h-11 rounded-full bg-gx-card border border-[#292929] flex items-center justify-center shrink-0 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <img
                    src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/6996a7e5b754cce799628515_Services%20Icon%20(1).png"
                    alt="Call Any Time"
                    class="w-[18px] h-6 object-contain"
                  />
                </div>
                <div class="flex flex-col">
                  <span class="text-xs text-gx-text-muted uppercase tracking-wider">Call Any Time</span>
                  <a href="tel:+(452)125482215421254" class="font-display text-sm sm:text-base font-bold text-white group-hover:text-gx-primary transition-colors duration-200">+(452 ) 125482215421254</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Our Journey in Automotive Excellence Car Agency -->
      <section class="bg-gx-canvas py-16 sm:py-24 md:py-28 border-t border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="mb-10 sm:mb-12">
            <div>
              <span class="sub-tag-red">Our best Quality services</span>
              <h2 class="bootlab-section-title">
                Our Journey in Automotive<br>
                Excellence <span class="text-gx-primary">Car Agency</span>
              </h2>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <!-- Card 1 -->
            <div class="bg-gx-card border border-[#58595b]/30 p-6 sm:p-8 flex flex-col gap-5 transition-all duration-300 hover:border-gx-primary hover:-translate-y-1 group">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-[#111213] border border-gx-border flex items-center justify-center shrink-0">
                  <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/699c8bb4bc3a9d26d1e3139a_Testimonial%20Card%20Icon.png" alt="" class="w-6 h-6 object-contain" />
                </div>
                <h3 class="font-display text-xl sm:text-2xl font-bold text-white">Repairs &amp; Maintenance</h3>
              </div>
              <div class="h-[200px] sm:h-[220px] overflow-hidden">
                <img src="/images/home/service-repair.jpg" alt="Repairs & Maintenance" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p class="text-sm sm:text-[0.9375rem] text-gx-text-secondary leading-relaxed">
                Comprehensive multi-point inspection, computerized diagnostics, and certified genuine OEM part replacements for optimal engine health.
              </p>
            </div>

            <!-- Card 2 -->
            <div class="bg-gx-card border border-[#58595b]/30 p-6 sm:p-8 flex flex-col gap-5 transition-all duration-300 hover:border-gx-primary hover:-translate-y-1 group">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-[#111213] border border-gx-border flex items-center justify-center shrink-0">
                  <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/699c8f2c7e762464713dd432_Testimonial%20Card%20Icon%20(2).png" alt="" class="w-6 h-6 object-contain" />
                </div>
                <h3 class="font-display text-xl sm:text-2xl font-bold text-white">Routine Maintenance</h3>
              </div>
              <div class="h-[200px] sm:h-[220px] overflow-hidden">
                <img src="/images/home/service-maintenance.jpg" alt="Routine Maintenance" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p class="text-sm sm:text-[0.9375rem] text-gx-text-secondary leading-relaxed">
                Scheduled oil renewal, high-pressure pre-wash, filter replacements, and preventive fluid flushes for stress-free daily driving.
              </p>
            </div>

            <!-- Card 3 -->
            <div class="bg-gx-card border border-[#58595b]/30 p-6 sm:p-8 flex flex-col gap-5 transition-all duration-300 hover:border-gx-primary hover:-translate-y-1 group">
              <div class="flex items-center gap-4">
                <div class="w-11 h-11 bg-[#111213] border border-gx-border flex items-center justify-center shrink-0">
                  <img src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/699c8f2c019a201b5193c46c_Testimonial%20Card%20Icon%20(1).png" alt="" class="w-6 h-6 object-contain" />
                </div>
                <h3 class="font-display text-xl sm:text-2xl font-bold text-white">Transmission Repair</h3>
              </div>
              <div class="h-[200px] sm:h-[220px] overflow-hidden">
                <img src="/images/home/service-transmission.jpg" alt="Transmission Repair" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
              </div>
              <p class="text-sm sm:text-[0.9375rem] text-gx-text-secondary leading-relaxed">
                Precision dual-clutch, CVT, and torque-converter transmission overhauls with electronic valve body and mechatronic diagnostics.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Before & After Car Transformation -->
      <section class="bg-black py-16 sm:py-24">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="relative bg-gx-surface border border-gx-border p-6 sm:p-10 text-center">
            <div class="inline-flex bg-[#1a1a1a] border border-[#292929] mb-8">
              <button
                type="button"
                class="px-8 py-2.5 font-display text-sm sm:text-base font-bold tracking-wider transition-colors duration-200 cursor-pointer"
                [ngClass]="activeCarState() === 'after' ? 'bg-gx-primary text-white' : 'bg-transparent text-gx-text-muted hover:text-white'"
                (click)="activeCarState.set('after')"
              >
                After
              </button>
              <button
                type="button"
                class="px-8 py-2.5 font-display text-sm sm:text-base font-bold tracking-wider transition-colors duration-200 cursor-pointer"
                [ngClass]="activeCarState() === 'before' ? 'bg-gx-primary text-white' : 'bg-transparent text-gx-text-muted hover:text-white'"
                (click)="activeCarState.set('before')"
              >
                Before
              </button>
            </div>

            <div class="relative max-w-[980px] mx-auto h-[320px] sm:h-[420px] md:h-[480px] overflow-hidden bg-[#0a0a0a] border border-gx-border-subtle">
              <img
                src="/images/car-after.jpg"
                alt="Car After Restoration"
                class="w-full h-full object-cover block"
                [class.hidden]="activeCarState() === 'before'"
              />
              <img
                src="/images/car-before.jpg"
                alt="Car Before Restoration"
                class="w-full h-full object-cover block"
                [class.hidden]="activeCarState() === 'after'"
              />

              <div class="absolute bottom-4 right-4 sm:bottom-6 sm:right-6 bg-black/80 border border-white/20 text-white font-display text-xs sm:text-sm font-bold uppercase tracking-widest px-3 py-1.5 backdrop-blur-sm z-10">
                {{ activeCarState() === 'after' ? 'After' : 'Before' }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 6. Sustainable Automotive Projects -->
      <section class="bg-gx-canvas py-16 sm:py-24 md:py-28 border-t border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-10 sm:mb-12">
            <div>
              <span class="sub-tag-red">Our resent work</span>
              <h2 class="bootlab-section-title">
                Sustainable Automotive <span class="text-gx-primary">Projects</span> Automotive
              </h2>
            </div>
            <a routerLink="/services" class="bootlab-btn-primary shrink-0">
              <span>VIEW PROJECTS</span>
            </a>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <!-- Project 1 -->
            <div class="bg-gx-card border border-gx-border overflow-hidden transition-all duration-300 hover:border-gx-primary hover:-translate-y-1.5 cursor-pointer group" routerLink="/services">
              <div class="h-[240px] sm:h-[260px] overflow-hidden">
                <img
                  src="/images/home/project-torque.jpg"
                  alt="Radius alters torque"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="p-6 border-t border-gx-border-subtle">
                <div class="text-xs font-bold text-gx-primary uppercase tracking-wider mb-1">History moves fast.</div>
                <h3 class="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-gx-primary transition-colors duration-200">Radius alters torque.</h3>
              </div>
            </div>

            <!-- Project 2 -->
            <div class="bg-gx-card border border-gx-border overflow-hidden transition-all duration-300 hover:border-gx-primary hover:-translate-y-1.5 cursor-pointer group" routerLink="/services">
              <div class="h-[240px] sm:h-[260px] overflow-hidden">
                <img
                  src="/images/home/project-kinetic.jpg"
                  alt="Kinetic energy stores"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="p-6 border-t border-gx-border-subtle">
                <div class="text-xs font-bold text-gx-primary uppercase tracking-wider mb-1">Kinetic control.</div>
                <h3 class="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-gx-primary transition-colors duration-200">Kinetic energy stores.</h3>
              </div>
            </div>

            <!-- Project 3 -->
            <div class="bg-gx-card border border-gx-border overflow-hidden transition-all duration-300 hover:border-gx-primary hover:-translate-y-1.5 cursor-pointer group" routerLink="/services">
              <div class="h-[240px] sm:h-[260px] overflow-hidden">
                <img
                  src="/images/home/project-inertia.jpg"
                  alt="Inertia levels change"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="p-6 border-t border-gx-border-subtle">
                <div class="text-xs font-bold text-gx-primary uppercase tracking-wider mb-1">Weight balance.</div>
                <h3 class="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-gx-primary transition-colors duration-200">Inertia levels change.</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 7. Why Regular Oil Changes Are Crucial for Your Car's Health (News/Blog) -->
      <section class="bg-gx-surface py-16 sm:py-24 md:py-28 border-t border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="text-center mb-10 sm:mb-14">
            <span class="sub-tag-red">Our LET’S NEWS</span>
            <h2 class="bootlab-section-title text-center">
              Why Regular Oil Changes Are<br>
              <span class="text-gx-primary">Crucial for</span> Your Car’s Health.
            </h2>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8">
            <!-- Main Featured Blog -->
            <div class="bg-gx-card border border-gx-border-subtle overflow-hidden transition-all duration-300 hover:border-gx-primary hover:-translate-y-1 cursor-pointer group flex flex-col" routerLink="/services">
              <div class="h-[260px] sm:h-[320px] overflow-hidden">
                <img
                  src="/images/home/blog-oil-change.jpg"
                  alt="Why Regular Oil Changes Are Crucial"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div class="p-6 sm:p-8 flex flex-col gap-3 flex-1 justify-between">
                <div>
                  <div class="text-xs font-bold text-gx-primary uppercase tracking-wider mb-2">October 24, 2026</div>
                  <h3 class="font-display text-xl sm:text-2xl font-bold text-white group-hover:text-gx-primary transition-colors duration-200">Why Regular Oil Changes Are Crucial for Your Car’s Health.</h3>
                </div>
                <span class="text-xs font-bold text-white group-hover:text-gx-primary transition-colors duration-200 inline-flex items-center gap-1.5 mt-2">Read More &#10132;</span>
              </div>
            </div>

            <!-- Side 3 Blog List -->
            <div class="flex flex-col gap-5">
              <div class="grid grid-cols-[120px_1fr] sm:grid-cols-[150px_1fr] gap-4 sm:gap-6 bg-gx-card border border-gx-border-subtle p-4 transition-all duration-300 hover:border-gx-primary hover:translate-x-1 cursor-pointer group items-center" routerLink="/services">
                <div class="h-[90px] sm:h-[100px] overflow-hidden">
                  <img
                    src="/images/home/blog-future-tech.jpg"
                    alt="The Future of Car Maintenance New Technology"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div class="text-xs font-bold text-gx-primary uppercase tracking-wider">October 18, 2026</div>
                  <h4 class="font-display text-sm sm:text-base font-bold text-white group-hover:text-gx-primary transition-colors duration-200 line-clamp-2 mt-1">The Future of Car Maintenance New Technology and..</h4>
                </div>
              </div>

              <div class="grid grid-cols-[120px_1fr] sm:grid-cols-[150px_1fr] gap-4 sm:gap-6 bg-gx-card border border-gx-border-subtle p-4 transition-all duration-300 hover:border-gx-primary hover:translate-x-1 cursor-pointer group items-center" routerLink="/services">
                <div class="h-[90px] sm:h-[100px] overflow-hidden">
                  <img
                    src="/images/home/blog-engine-diagnostics.jpg"
                    alt="Enthusiast's Handbook Engine Diagnostics"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div class="text-xs font-bold text-gx-primary uppercase tracking-wider">October 12, 2026</div>
                  <h4 class="font-display text-sm sm:text-base font-bold text-white group-hover:text-gx-primary transition-colors duration-200 line-clamp-2 mt-1">Enthusiast's Handbook: From Diagnostics to Engine Health...</h4>
                </div>
              </div>

              <div class="grid grid-cols-[120px_1fr] sm:grid-cols-[150px_1fr] gap-4 sm:gap-6 bg-gx-card border border-gx-border-subtle p-4 transition-all duration-300 hover:border-gx-primary hover:translate-x-1 cursor-pointer group items-center" routerLink="/services">
                <div class="h-[90px] sm:h-[100px] overflow-hidden">
                  <img
                    src="/images/home/blog-ev-battery.jpg"
                    alt="Understanding Electric Vehicle Maintenance"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div>
                  <div class="text-xs font-bold text-gx-primary uppercase tracking-wider">October 05, 2026</div>
                  <h4 class="font-display text-sm sm:text-base font-bold text-white group-hover:text-gx-primary transition-colors duration-200 line-clamp-2 mt-1">Understanding Electric for Vehicle Maintenance &amp; Battery Care...</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  `
})
export class HomeComponent {
  activeCarState = signal<'after' | 'before'>('after');
}
