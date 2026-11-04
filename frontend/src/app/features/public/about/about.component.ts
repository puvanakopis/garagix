import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas text-gx-text-primary overflow-x-hidden min-h-screen">
      <!-- 1. Page Header matching Home & BootLab Automotive Theme -->
      <app-page-header
        title="ABOUT US"
        [breadcrumbs]="[{ label: 'About Us' }]"
        bgImage="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1600&auto=format&fit=crop&q=80"
      />

      <!-- 2. Section 1: Promo Section -->
      <section class="bg-gx-canvas py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px] grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div class="flex flex-col">
            <div>
              <span class="sub-tag-red">OUR COMPANY / ABOUT US</span>
            </div>
            <h2 class="bootlab-section-title">
              Unlock 50% Savings On Your<br>
              First <span class="text-gx-primary">Car Wash</span> Plan
            </h2>
            <p class="text-sm sm:text-base text-gx-text-secondary leading-relaxed mt-4 mb-8">
              Experience the pinnacle of automotive care. Our multi-stage detailing and precision maintenance facility combines pH-balanced snow foaming, deionized water rinsing, and high-tech ceramic paint sealants to preserve your car's showroom brilliance.
            </p>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-gx-card border border-gx-primary/40 flex items-center justify-center shrink-0">
                  <app-icon name="check" [size]="14" strokeColor="#d70006" />
                </div>
                <span class="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-white">100% High-Pressure Pre-Wash</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-gx-card border border-gx-primary/40 flex items-center justify-center shrink-0">
                  <app-icon name="check" [size]="14" strokeColor="#d70006" />
                </div>
                <span class="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-white">Ceramic Paint Sealant Coating</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-gx-card border border-gx-primary/40 flex items-center justify-center shrink-0">
                  <app-icon name="check" [size]="14" strokeColor="#d70006" />
                </div>
                <span class="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-white">Deep Interior Sanitization</span>
              </div>
              <div class="flex items-center gap-3">
                <div class="w-6 h-6 bg-gx-card border border-gx-primary/40 flex items-center justify-center shrink-0">
                  <app-icon name="check" [size]="14" strokeColor="#d70006" />
                </div>
                <span class="text-xs sm:text-sm font-display font-bold uppercase tracking-wider text-white">Scratch-Free Microfiber Polish</span>
              </div>
            </div>

            <div>
              <a routerLink="/services" class="bootlab-btn-primary">
                <span>VIEW SERVICES</span>
              </a>
            </div>
          </div>

          <div>
            <div class="relative w-full h-[360px] sm:h-[460px] lg:h-[500px] overflow-hidden border border-gx-border bg-gx-card group">
              <img
                src="https://images.unsplash.com/photo-1487754180451-c456f719a1fc?w=800&auto=format&fit=crop&q=80"
                alt="Master technician working on wheel and brake assembly"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 3. Section 2: Core Values & Engineering Principles -->
      <section class="bg-gx-surface py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="text-center mb-12 sm:mb-16">
            <div>
              <span class="sub-tag-red">OUR CORE VALUES</span>
            </div>
            <h2 class="bootlab-section-title text-center">
              The Principles Behind Every <span class="text-gx-primary">Wrench We Turn</span>
            </h2>
            <p class="text-sm sm:text-base text-gx-text-secondary max-w-[680px] mx-auto mt-4 text-center leading-relaxed">
              We founded Garagix on a refusal to accept dealership surcharges and roadside guesswork. Here is our engineering promise to every vehicle owner:
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <!-- Pillar 1 -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between hover:border-gx-primary transition-all duration-300 hover:-translate-y-1.5 group">
              <div>
                <div class="w-12 h-12 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center text-gx-primary mb-6 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="file-text" [size]="22" strokeColor="#d70006" />
                </div>
                <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mb-1">01. Honesty First</div>
                <h3 class="font-display text-xl font-bold text-white mb-3">100% Transparent Video Audits</h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  Every issue is recorded on high-definition video with clear mechanical explanations sent straight to your phone before any work commences.
                </p>
              </div>
              <div class="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-gx-text-muted">
                <span>Zero Hidden Fees</span>
                <span class="text-gx-primary font-bold">&#10003; Guaranteed</span>
              </div>
            </div>

            <!-- Pillar 2 -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between hover:border-gx-primary transition-all duration-300 hover:-translate-y-1.5 group">
              <div>
                <div class="w-12 h-12 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center text-gx-primary mb-6 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="gauge" [size]="22" strokeColor="#d70006" />
                </div>
                <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mb-1">02. Factory Standards</div>
                <h3 class="font-display text-xl font-bold text-white mb-3">Calibrated OEM Tolerances</h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  We torque every bolt to computerized factory manuals, use OEM-specified fluids, and source genuine certified parts with verifiable batch tracking.
                </p>
              </div>
              <div class="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-gx-text-muted">
                <span>OEM Specs Only</span>
                <span class="text-gx-primary font-bold">&#10003; Verified</span>
              </div>
            </div>

            <!-- Pillar 3 -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between hover:border-gx-primary transition-all duration-300 hover:-translate-y-1.5 group">
              <div>
                <div class="w-12 h-12 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center text-gx-primary mb-6 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="award" [size]="22" strokeColor="#d70006" />
                </div>
                <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mb-1">03. Master Technicians</div>
                <h3 class="font-display text-xl font-bold text-white mb-3">Certified Engineering Care</h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  Our service bays are staffed by certified master mechanics with mandatory annual re-examinations across modern petrol, diesel, and hybrid powertrains.
                </p>
              </div>
              <div class="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-gx-text-muted">
                <span>ASE &amp; Bosch Certified</span>
                <span class="text-gx-primary font-bold">&#10003; Verified</span>
              </div>
            </div>

            <!-- Pillar 4 -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-8 flex flex-col justify-between hover:border-gx-primary transition-all duration-300 hover:-translate-y-1.5 group">
              <div>
                <div class="w-12 h-12 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center text-gx-primary mb-6 group-hover:border-gx-primary group-hover:shadow-[0_0_14px_rgba(215,0,6,0.35)] transition-all duration-200">
                  <app-icon name="shield" [size]="22" strokeColor="#d70006" />
                </div>
                <div class="text-xs font-bold text-gx-primary uppercase tracking-widest mb-1">04. Ironclad Guarantee</div>
                <h3 class="font-display text-xl font-bold text-white mb-3">12-Month Written Warranty</h3>
                <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
                  Rest easy with 12 months or 20,000 km of warranty coverage backing parts and labor. If something isn't right, we fix it promptly without hesitation.
                </p>
              </div>
              <div class="mt-6 pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-gx-text-muted">
                <span>12 Mo / 20,000 KM</span>
                <span class="text-gx-primary font-bold">&#10003; Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Section 3: Systematic 4-Step Engineering Workflow -->
      <section class="bg-gx-canvas py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="text-center mb-12 sm:mb-16">
            <div>
              <span class="sub-tag-red">OUR WORKFLOW</span>
            </div>
            <h2 class="bootlab-section-title text-center">
              How We Care For <span class="text-gx-primary">Your Vehicle</span>
            </h2>
            <p class="text-sm sm:text-base text-gx-text-secondary max-w-[680px] mx-auto mt-4 text-center leading-relaxed">
              From the moment your vehicle arrives at our check-in lane to final handover, every repair follows a meticulous 4-stage engineering protocol.
            </p>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <!-- Step 1 -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-7 relative overflow-hidden group hover:border-gx-primary transition-all duration-300">
              <div class="absolute top-3 right-4 font-display text-4xl sm:text-5xl font-black text-white/5 group-hover:text-gx-primary/20 transition-colors">01</div>
              <div class="w-10 h-10 bg-gx-primary/10 border border-gx-primary/30 flex items-center justify-center text-gx-primary font-display font-bold text-sm mb-5">
                01
              </div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-white mb-2">Digital Check-in &amp; OBD Scan</h3>
              <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed mb-4">
                Full-system diagnostic scan, live telemetry data logging, and high-definition undercarriage photo inspection.
              </p>
              <ul class="space-y-1.5 text-xs text-gx-text-muted border-t border-[#222222] pt-3">
                <li class="flex items-center gap-2"><app-icon name="check" [size]="12" strokeColor="#d70006" /> 45-point health checklist</li>
                <li class="flex items-center gap-2"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Laser brake rotor measurement</li>
              </ul>
            </div>

            <!-- Step 2 -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-7 relative overflow-hidden group hover:border-gx-primary transition-all duration-300">
              <div class="absolute top-3 right-4 font-display text-4xl sm:text-5xl font-black text-white/5 group-hover:text-gx-primary/20 transition-colors">02</div>
              <div class="w-10 h-10 bg-gx-primary/10 border border-gx-primary/30 flex items-center justify-center text-gx-primary font-display font-bold text-sm mb-5">
                02
              </div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-white mb-2">Video Estimate &amp; Approval</h3>
              <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed mb-4">
                Watch a personalized video showing exact component wear with itemized parts and labor pricing sent to your phone.
              </p>
              <ul class="space-y-1.5 text-xs text-gx-text-muted border-t border-[#222222] pt-3">
                <li class="flex items-center gap-2"><app-icon name="check" [size]="12" strokeColor="#d70006" /> 1-click digital authorization</li>
                <li class="flex items-center gap-2"><app-icon name="check" [size]="12" strokeColor="#d70006" /> OEM part selection options</li>
              </ul>
            </div>

            <!-- Step 3 -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-7 relative overflow-hidden group hover:border-gx-primary transition-all duration-300">
              <div class="absolute top-3 right-4 font-display text-4xl sm:text-5xl font-black text-white/5 group-hover:text-gx-primary/20 transition-colors">03</div>
              <div class="w-10 h-10 bg-gx-primary/10 border border-gx-primary/30 flex items-center justify-center text-gx-primary font-display font-bold text-sm mb-5">
                03
              </div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-white mb-2">Master Bay Precision Execution</h3>
              <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed mb-4">
                Certified technicians perform repairs in dedicated clean bays with calibrated tools and interior protection covers.
              </p>
              <ul class="space-y-1.5 text-xs text-gx-text-muted border-t border-[#222222] pt-3">
                <li class="flex items-center gap-2"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Dual-mechanic cross check</li>
                <li class="flex items-center gap-2"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Digital torque logging</li>
              </ul>
            </div>

            <!-- Step 4 -->
            <div class="bg-gx-card border border-gx-border p-6 sm:p-7 relative overflow-hidden group hover:border-gx-primary transition-all duration-300">
              <div class="absolute top-3 right-4 font-display text-4xl sm:text-5xl font-black text-white/5 group-hover:text-gx-primary/20 transition-colors">04</div>
              <div class="w-10 h-10 bg-gx-primary/10 border border-gx-primary/30 flex items-center justify-center text-gx-primary font-display font-bold text-sm mb-5">
                04
              </div>
              <h3 class="font-display text-lg sm:text-xl font-bold text-white mb-2">Road Test &amp; Certified Handover</h3>
              <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed mb-4">
                Thorough road testing, complimentary snow foam wash, and logged digital warranty paperwork issued at handover.
              </p>
              <ul class="space-y-1.5 text-xs text-gx-text-muted border-t border-[#222222] pt-3">
                <li class="flex items-center gap-2"><app-icon name="check" [size]="12" strokeColor="#d70006" /> 12-Month written warranty</li>
                <li class="flex items-center gap-2"><app-icon name="check" [size]="12" strokeColor="#d70006" /> Complimentary car wash</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <!-- 5. Section 4: Workshop Facility & Engineering Infrastructure -->
      <section class="bg-gx-surface py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <span class="sub-tag-red">FACILITY &amp; TECHNOLOGY</span>
              <h2 class="bootlab-section-title">
                Inside The Garagix <span class="text-gx-primary">Engineering Hub</span>
              </h2>
            </div>
            <p class="text-sm text-gx-text-secondary max-w-[480px] leading-relaxed">
              Explore our purpose-built central facility equipped with the latest European &amp; Japanese computerized automotive infrastructure.
            </p>
          </div>

          <!-- Interactive Facility Selector Tabs -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
            @for (tab of facilityTabs; track tab.id) {
              <button
                type="button"
                class="px-4 py-3.5 border font-display text-xs sm:text-sm font-bold uppercase tracking-wider text-left transition-all duration-200 cursor-pointer"
                [ngClass]="activeFacilityTab() === tab.id ? 'bg-gx-primary border-gx-primary text-white shadow-[0_0_15px_rgba(215,0,6,0.3)]' : 'bg-gx-card border-gx-border text-gx-text-secondary hover:text-white hover:border-[#383838]'"
                (click)="activeFacilityTab.set(tab.id)"
              >
                {{ tab.navTitle }}
              </button>
            }
          </div>

          <!-- Selected Tab Content Display -->
          @if (currentFacility(); as fac) {
            <div class="bg-gx-card border border-gx-border p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div>
                <span class="text-xs font-bold text-gx-primary uppercase tracking-widest block mb-2 font-display">Specialized Facility Area</span>
                <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-3">{{ fac.title }}</h3>
                <p class="text-sm sm:text-base text-gx-text-secondary leading-relaxed mb-6">{{ fac.subtitle }}</p>

                <div class="space-y-3 mb-8">
                  @for (spec of fac.specs; track spec) {
                    <div class="flex items-start gap-3">
                      <div class="w-5 h-5 rounded-full bg-gx-primary/20 border border-gx-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                        <app-icon name="check" [size]="12" strokeColor="#d70006" />
                      </div>
                      <span class="text-xs sm:text-sm text-white font-sans">{{ spec }}</span>
                    </div>
                  }
                </div>

                <a routerLink="/customer/book-repair" class="bootlab-btn-primary inline-flex text-xs">
                  <span>BOOK SERVICE IN THIS BAY</span>
                </a>
              </div>

              <div class="relative h-[280px] sm:h-[380px] overflow-hidden border border-[#292929]">
                <img [src]="fac.image" [alt]="fac.title" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                <div class="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span class="font-display font-bold uppercase tracking-wider bg-black/80 border border-white/10 px-3 py-1">Operational 6 Days / Wk</span>
                  <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-0.5 text-[0.6875rem] font-bold uppercase tracking-wider">Active Bay</span>
                </div>
              </div>
            </div>
          }
        </div>
      </section>
    </div>
  `
})
export class AboutComponent {
  activeFacilityTab = signal<'bays' | 'alignment' | 'diagnostics' | 'lounge'>('bays');

  facilityTabs = [
    {
      id: 'bays' as const,
      navTitle: '8 Service Bays',
      title: '8 Dedicated Hydraulic Service Bays',
      subtitle: 'Heavy-duty & low-profile lifts engineered for supercars, SUVs, and high-voltage EV platforms.',
      image: 'https://images.unsplash.com/photo-1613214149922-f1809c99b414?w=1000&auto=format&fit=crop&q=80',
      specs: [
        'Rotary 2-post and 4-post heavy-duty hydraulic workshop lifts',
        'EV battery pack hoists and specialized high-voltage insulated tooling',
        'Protective fender covers, steering wraps, and paper floor liners for all cars'
      ]
    },
    {
      id: 'alignment' as const,
      navTitle: '3D Laser Rig',
      title: 'Hunter 3D Hawkeye Laser Alignment Rig',
      subtitle: 'Computerized multi-camera sensors calibrating suspension kinematics to sub-millimeter factory specs.',
      image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=1000&auto=format&fit=crop&q=80',
      specs: [
        'High-resolution multi-camera 3D sensor array for instantaneous readings',
        'Manufacturer database covering over 45,000 Japanese, European, and American models',
        'Comprehensive live printout with before & after caster, camber, and toe angles'
      ]
    },
    {
      id: 'diagnostics' as const,
      navTitle: 'Diagnostic Lab',
      title: 'Oscilloscope & Electronic ECU Clean Lab',
      subtitle: 'Deep-level circuit analysis, CAN-bus waveform inspection, and factory ECU module reprogramming.',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1000&auto=format&fit=crop&q=80',
      specs: [
        'PicoScope multi-channel lab scope capturing microsecond voltage & waveform anomalies',
        'Bosch & Autel MaxiSys Ultra enterprise diagnostic terminals',
        'OEM online coding, software updates, and electronic key matching'
      ]
    },
    {
      id: 'lounge' as const,
      navTitle: 'Customer Lounge',
      title: 'Air-Conditioned Executive Customer Lounge',
      subtitle: 'Relax in comfort or stay productive with an unobstructed view of the active service floor.',
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1000&auto=format&fit=crop&q=80',
      specs: [
        'Floor-to-ceiling panoramic glass bay looking directly onto technician work lanes',
        'Complimentary freshly roasted espresso, tea, and cold refreshments',
        'High-speed optical fiber Wi-Fi, work desks, and device charging stations'
      ]
    }
  ];

  currentFacility = computed(() => {
    return this.facilityTabs.find(t => t.id === this.activeFacilityTab()) || this.facilityTabs[0];
  });
}
