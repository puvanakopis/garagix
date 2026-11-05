import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ServiceCatalogService } from '../../../core/services/service-catalog.service';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas text-gx-text-primary overflow-x-hidden min-h-screen">
      <!-- 1. Page Header -->
      <app-page-header
        title="OUR SERVICES"
        [breadcrumbs]="[{ label: 'Services' }]"
        bgImage="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1600&auto=format&fit=crop&q=80"
      />

      <!-- 2. Services Hub Section (Matching Engineering Hub Architecture) -->
      <section class="bg-gx-surface py-16 sm:py-24 border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <!-- Section Header -->
          <div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 sm:mb-16">
            <div>
              <span class="sub-tag-red">OUR WORKSHOP PACKAGES</span>
              <h2 class="bootlab-section-title">
                Precision Automotive <span class="text-gx-primary">Services</span>
              </h2>
            </div>
            <p class="text-sm text-gx-text-secondary max-w-[480px] leading-relaxed">
              Explore our factory-certified mechanical, electrical, and maintenance packages. Select any service below to inspect procedures and bay specifications.
            </p>
          </div>

          <!-- Single Unified Category Tabs (Matching Engineering Hub Architecture) -->
          <div class="flex items-center gap-2.5 sm:gap-3 flex-wrap mb-10">
            <button
              type="button"
              class="px-5 py-3 border font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
              [ngClass]="selectedCategory() === 'ALL' ? 'bg-gx-primary border-gx-primary text-white shadow-[0_0_15px_rgba(215,0,6,0.3)]' : 'bg-gx-card border-gx-border text-gx-text-secondary hover:text-white hover:border-[#383838]'"
              (click)="selectedCategory.set('ALL')"
            >
              All Packages ({{ services().length }})
            </button>
            @for (cat of categories; track cat) {
              <button
                type="button"
                class="px-5 py-3 border font-display text-xs sm:text-sm font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
                [ngClass]="selectedCategory() === cat ? 'bg-gx-primary border-gx-primary text-white shadow-[0_0_15px_rgba(215,0,6,0.3)]' : 'bg-gx-card border-gx-border text-gx-text-secondary hover:text-white hover:border-[#383838]'"
                (click)="selectedCategory.set(cat)"
              >
                {{ cat }}
              </button>
            }
          </div>

          <!-- Services Showcase Display (Split 2-Column Display) -->
          <div class="space-y-8 sm:space-y-12">
            @for (srv of displayedServices(); track srv.id) {
              <div class="bg-gx-card border border-gx-border p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
                <!-- Left Column: Service Details & Specifications -->
                <div>
                  <span class="text-xs font-bold text-gx-primary uppercase tracking-widest block mb-2 font-display">
                    {{ srv.category }} Package
                  </span>
                  <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-3">{{ srv.name }}</h3>
                  <p class="text-sm sm:text-base text-gx-text-secondary leading-relaxed mb-6">{{ srv.fullDescription }}</p>

                  <!-- Duration & Warranty Telemetry Box -->
                  <div class="grid grid-cols-2 gap-3 p-3.5 bg-[#0e0d0d] border border-[#222222] mb-6">
                    <div>
                      <span class="text-[0.6875rem] uppercase text-gx-text-muted block font-display">Service Duration</span>
                      <span class="font-display font-bold text-lg text-white">{{ srv.durationMinutes }} Mins</span>
                    </div>
                    <div>
                      <span class="text-[0.6875rem] uppercase text-gx-text-muted block font-display">Workshop Warranty</span>
                      <span class="font-display font-bold text-lg text-white">12 Months</span>
                    </div>
                  </div>

                  <!-- Included OEM Procedures List -->
                  <div class="space-y-3 mb-8">
                    <div class="text-[0.6875rem] font-bold text-gx-text-muted font-display uppercase tracking-wider mb-1">
                      Key OEM Factory Inclusions:
                    </div>
                    @for (item of srv.includedItems; track item) {
                      <div class="flex items-start gap-3">
                        <div class="w-5 h-5 rounded-full bg-gx-primary/20 border border-gx-primary/40 flex items-center justify-center shrink-0 mt-0.5">
                          <app-icon name="check" [size]="12" strokeColor="#d70006" />
                        </div>
                        <span class="text-xs sm:text-sm text-white font-sans">{{ item }}</span>
                      </div>
                    }
                  </div>

                  <!-- Action CTAs -->
                  <div class="flex items-center gap-3 flex-wrap">
                    <a
                      [routerLink]="['/customer/book-repair']"
                      [queryParams]="{ serviceId: srv.id }"
                      class="bootlab-btn-primary inline-flex text-xs"
                    >
                      <app-icon name="wrench" [size]="14" />
                      <span>BOOK THIS SERVICE</span>
                    </a>
                    <a
                      [routerLink]="['/services', srv.slug]"
                      class="px-5 py-3.5 border border-[#292929] bg-[#100e0f] text-white hover:border-white font-display text-xs font-bold uppercase tracking-wider transition-colors inline-flex items-center gap-2 cursor-pointer"
                    >
                      <span>Full Technical Specs</span>
                      <app-icon name="arrow-right" [size]="12" />
                    </a>
                  </div>
                </div>

                <!-- Right Column: Package Telemetry & Rate Card (No Image) -->
                <div class="bg-[#121112] border border-[#262526] p-6 sm:p-8 flex flex-col justify-between gap-6">
                  <div>
                    <div class="flex items-center justify-between gap-2 pb-4 border-b border-[#222222]">
                      <span class="text-xs uppercase font-bold tracking-wider text-gx-primary font-display">Service Estimate</span>
                      <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider flex items-center gap-1.5">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                        Active Bay
                      </span>
                    </div>

                    <div class="mt-4">
                      <span class="text-xs text-neutral-400 block font-sans">Starting Rate from</span>
                      <span class="font-display font-bold text-3xl sm:text-4xl text-white">LKR {{ srv.startingPriceLkr | number }}</span>
                    </div>

                    @if (srv.commonSymptoms && srv.commonSymptoms.length > 0) {
                      <div class="mt-6 pt-4 border-t border-[#222222]">
                        <span class="text-[0.6875rem] font-bold text-neutral-400 font-display uppercase tracking-wider block mb-2">Common Signs / Symptoms:</span>
                        <div class="flex flex-wrap gap-1.5">
                          @for (sym of srv.commonSymptoms; track sym) {
                            <span class="px-2.5 py-1 rounded bg-[#1c1b1c] border border-[#2b2a2b] text-xs text-neutral-300">
                              {{ sym }}
                            </span>
                          }
                        </div>
                      </div>
                    }
                  </div>

                  <div class="pt-4 border-t border-[#222222] flex items-center justify-between text-xs text-neutral-400 font-sans">
                    <span>Precision OEM calibration</span>
                    <span>Genuine parts certified</span>
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- 3. Bottom Car Wash Offer Banner -->
      <section class="py-16 sm:py-20 bg-gx-canvas border-b border-[#1a1a1a]">
        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px]">
          <div class="bg-gx-card border border-[#58595b]/30 p-8 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden text-center md:text-left">
            <div class="relative z-10 max-w-[700px]">
              <div>
                <span class="sub-tag-red">SPECIAL OFFER</span>
              </div>
              <h3 class="font-display text-2xl sm:text-3xl font-bold text-white mb-2">Unlock 50% Savings On Your First Car Wash Plan</h3>
              <p class="text-sm text-gx-text-secondary leading-relaxed">Combine any scheduled mechanical service with our 5-stage detailing and ceramic paint seal package.</p>
            </div>
            <a routerLink="/customer/book-repair" class="bootlab-btn-primary shrink-0 relative z-10">
              <span>REDEEM OFFER</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  `
})
export class ServicesComponent implements OnInit {
  private serviceCatalog = inject(ServiceCatalogService);

  selectedCategory = signal<string>('ALL');

  categories = [
    'Maintenance',
    'Engine & Transmission',
    'Brakes & Tires',
    'AC & Climate',
    'Electrical & Battery',
    'Diagnostics'
  ];

  services = this.serviceCatalog.services;

  ngOnInit(): void {
    this.serviceCatalog.loadServices(true).subscribe();
  }

  displayedServices = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'ALL') return this.services();
    return this.services().filter(s => s.category.toLowerCase().includes(cat.toLowerCase()));
  });
}
