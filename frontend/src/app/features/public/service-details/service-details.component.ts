import { Component, ChangeDetectionStrategy, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { ServiceCatalogService } from '../../../core/services/service-catalog.service';
import { WorkshopSettingsService } from '../../../core/services/workshop-settings.service';
import { CarService } from '../../../core/models/service.model';
import { PageHeaderComponent } from '../../../shared/components/page-header/page-header.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [CommonModule, RouterLink, PageHeaderComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (service(); as s) {
      <div class="bg-gx-canvas text-gx-text-primary min-h-screen pb-20 overflow-x-hidden">
        <!-- 1. Page Header -->
        <app-page-header
          [title]="s.name"
          [breadcrumbs]="[
            { label: 'Services', url: '/services' },
            { label: s.name }
          ]"
          bgImage="https://images.unsplash.com/photo-1625047509168-a7026f36de04?w=1600&auto=format&fit=crop&q=80"
        />

        <div class="container mx-auto px-4 sm:px-6 max-w-[1240px] grid grid-cols-1 lg:grid-cols-[1.8fr_1fr] gap-10 lg:gap-14 pt-12 items-start">
          <!-- Main Left Column -->
          <main class="space-y-8">
            <!-- Category & Badge Headline Banner (No Image) -->
            <div class="bg-gx-card border border-gx-border p-6 flex items-center justify-between gap-4">
              <div class="flex items-center gap-3">
                <span class="bg-gx-primary text-white font-display text-xs font-bold px-3 py-1.5 uppercase tracking-wider">
                  {{ s.category }}
                </span>
                <span class="text-xs text-neutral-400 font-sans">
                  Workshop Package Specifications
                </span>
              </div>
              <span class="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2.5 py-1 text-[0.6875rem] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Active Bay
              </span>
            </div>

            <!-- Overview -->
            <section class="bg-gx-card border border-gx-border-subtle p-6 sm:p-8">
              <span class="sub-tag-red">SERVICE OVERVIEW</span>
              <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mb-4">Complete Engineering Breakdown</h2>
              <p class="text-sm sm:text-base text-gx-text-secondary leading-relaxed">{{ s.fullDescription }}</p>
            </section>

            <!-- Common Symptoms Grid -->
            <section class="bg-gx-card border border-gx-border-subtle p-6 sm:p-8">
              <span class="sub-tag-red">WARNING SIGNS</span>
              <h3 class="font-display text-xl sm:text-2xl font-bold text-white mb-2">Common Symptoms &amp; Indicators</h3>
              <p class="text-xs sm:text-sm text-gx-text-muted mb-6">If your vehicle exhibits any of these behaviors, this maintenance package is strongly advised:</p>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                @for (symptom of s.commonSymptoms; track symptom) {
                  <div class="bg-[#0e0d0d] border border-[#292929] p-3.5 flex items-center gap-3 text-xs sm:text-sm text-white hover:border-gx-primary transition-colors duration-200">
                    <app-icon name="alert-circle" [size]="18" strokeColor="#d70006" class="shrink-0" />
                    <span>{{ symptom }}</span>
                  </div>
                }
              </div>
            </section>

            <!-- Included Service Checklist -->
            <section class="bg-gx-card border border-gx-border-subtle p-6 sm:p-8">
              <span class="sub-tag-red">PACKAGE SPECIFICATIONS</span>
              <h3 class="font-display text-xl sm:text-2xl font-bold text-white mb-6">What's Included in This Package</h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                @for (item of s.includedItems; track item) {
                  <div class="flex items-center gap-3 text-xs sm:text-sm text-gx-text-secondary">
                    <div class="w-5 h-5 bg-gx-primary/20 border border-gx-primary/40 text-gx-primary flex items-center justify-center shrink-0">
                      <app-icon name="check" [size]="12" strokeColor="#d70006" />
                    </div>
                    <span>{{ item }}</span>
                  </div>
                }
              </div>
            </section>
          </main>

          <!-- Right Sticky Booking Card & Meta Sidebar -->
          <aside class="sticky top-24 space-y-6">
            <div class="bg-gx-card border border-gx-border-subtle p-6 sm:p-8 shadow-2xl flex flex-col gap-6">
              <div>
                <span class="text-xs font-bold text-gx-text-muted font-display uppercase tracking-wider">Service Package</span>
                <div class="font-display text-2xl sm:text-3xl font-black text-white mt-1">
                  {{ s.name }}
                </div>
                <div class="text-xs text-gx-text-muted mt-1">{{ s.category }} &bull; Factory Specification</div>
              </div>

              <div class="space-y-4 pt-4 border-t border-gx-border-subtle">
                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center shrink-0 text-gx-primary">
                    <app-icon name="clock" [size]="18" strokeColor="#d70006" />
                  </div>
                  <div>
                    <div class="text-xs text-gx-text-muted uppercase tracking-wider">Service Duration</div>
                    <div class="font-display font-bold text-white text-sm">{{ s.durationMinutes }} Minutes</div>
                  </div>
                </div>

                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center shrink-0 text-gx-primary">
                    <app-icon name="shield" [size]="18" strokeColor="#d70006" />
                  </div>
                  <div>
                    <div class="text-xs text-gx-text-muted uppercase tracking-wider">Workshop Warranty</div>
                    <div class="font-display font-bold text-white text-sm">12 Months / 20,000 km</div>
                  </div>
                </div>

                <div class="flex items-center gap-3.5">
                  <div class="w-10 h-10 bg-[#0e0d0d] border border-[#292929] flex items-center justify-center shrink-0 text-gx-primary">
                    <app-icon name="wrench" [size]="18" strokeColor="#d70006" />
                  </div>
                  <div>
                    <div class="text-xs text-gx-text-muted uppercase tracking-wider">Parts Guarantee</div>
                    <div class="font-display font-bold text-white text-sm">100% Genuine OEM Sourced</div>
                  </div>
                </div>
              </div>

              <!-- Primary Action Button -->
              <a
                [routerLink]="['/customer/book-repair']"
                [queryParams]="{ serviceId: s.id }"
                class="bootlab-btn-primary w-full py-4 text-center cursor-pointer flex items-center justify-center gap-2"
              >
                <app-icon name="calendar" [size]="18" />
                <span>Book This Service Now</span>
              </a>

              <div class="bg-[#0e0d0d] border border-[#222222] p-4 text-center">
                <div class="text-xs text-gx-text-muted mb-1">Need urgent breakdown assistance?</div>
                <a [href]="'tel:' + workshopSettings.phone()" class="font-display font-bold text-sm text-white hover:text-gx-primary transition-colors inline-flex items-center gap-2 justify-center">
                  <img
                    src="https://cdn.prod.website-files.com/698ef3567c7a09b473a1fac2/6996a7e5b754cce799628515_Services%20Icon%20(1).png"
                    alt="Call Any Time"
                    class="w-[14px] h-[19px] object-contain"
                  />
                  <span>{{ workshopSettings.phone() }}</span>
                </a>
              </div>
            </div>

            <!-- Related Services Quick Links -->
            <div class="bg-gx-card border border-gx-border-subtle p-6">
              <h4 class="font-display text-base font-bold text-white uppercase tracking-wider mb-4 pb-3 border-b border-gx-border-subtle">
                Other Services You May Need
              </h4>
              <div class="space-y-2.5">
                @for (rel of relatedServices(); track rel.id) {
                  <a [routerLink]="['/services', rel.slug]" class="flex items-center justify-between py-2 text-xs text-gx-text-secondary hover:text-white group border-b border-[#1c1c1d] last:border-0 transition-colors">
                    <span class="truncate pr-2 group-hover:text-gx-primary transition-colors font-medium">{{ rel.name }}</span>
                    <span class="text-xs text-neutral-400 shrink-0">{{ rel.category }} &rarr;</span>
                  </a>
                }
              </div>
            </div>
          </aside>
        </div>
      </div>
    }
  `
})
export class ServiceDetailsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private serviceCatalog = inject(ServiceCatalogService);
  readonly workshopSettings = inject(WorkshopSettingsService);
  private paramMap = toSignal(this.route.paramMap);

  ngOnInit(): void {
    this.serviceCatalog.loadServices(true).subscribe();
  }

  service = computed<CarService | undefined>(() => {
    const map = this.paramMap();
    const id = map?.get('id') || this.route.snapshot.paramMap.get('id') || 'general-car-maintenance';
    return this.serviceCatalog.getServiceById(id) || this.serviceCatalog.getServices()[0];
  });

  relatedServices = computed(() => {
    const s = this.service();
    return this.serviceCatalog.getServices().filter(item => item.id !== s?.id).slice(0, 4);
  });
}
