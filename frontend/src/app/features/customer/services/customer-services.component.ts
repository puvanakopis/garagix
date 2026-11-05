import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ServiceCatalogService } from '../../../core/services/service-catalog.service';
import { CarService } from '../../../core/models/service.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-services',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, IconComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Workshop <span class="text-[#d70006]">Services</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Browse precision automotive maintenance packages, diagnostics, and repairs.
          </p>
        </div>
        <a
          routerLink="/customer/book-repair"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 self-start sm:self-auto cursor-pointer"
        >
          <app-icon name="plus" [size]="14" />
          <span>Book Repair</span>
        </a>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      <section aria-label="Services Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">All Packages</span>
          </div>
          <span class="text-base font-bold font-oxanium text-white">{{ totalServicesCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Maintenance</span>
          <span class="text-base font-bold font-oxanium text-white">{{ maintenanceCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Engine &amp; Brakes</span>
          <span class="text-base font-bold font-oxanium text-white">{{ engineBrakesCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Diagnostics</span>
          <span class="text-base font-bold font-oxanium text-white">{{ diagnosticsCount() }}</span>
        </div>
      </section>

      <!-- 3. Search & Filter Bar with Sleek Pills -->
      <section class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div class="flex items-center gap-2.5 bg-[#141314] border border-[#222222] focus-within:border-[#d70006] rounded-xl px-3.5 py-2 w-full sm:max-w-md transition-colors">
          <app-icon name="search" [size]="16" strokeColor="#878f97" />
          <input
            type="text"
            [ngModel]="searchQuery()"
            (ngModelChange)="searchQuery.set($event)"
            placeholder="Search service name, category or issue..."
            class="flex-1 bg-transparent border-none text-white text-xs sm:text-sm outline-none placeholder:text-neutral-500"
          />
          @if (searchQuery()) {
            <button class="text-neutral-400 hover:text-white p-0.5 cursor-pointer" (click)="searchQuery.set('')">
              <app-icon name="x" [size]="14" />
            </button>
          }
        </div>

        <!-- Filter Pills matching dashboard style -->
        <div class="flex items-center p-0.5 rounded-lg bg-[#141314] border border-[#222222] overflow-x-auto scrollbar-none">
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="selectedCategory() === 'ALL' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="selectedCategory.set('ALL')"
          >
            All ({{ totalServicesCount() }})
          </button>
          @for (cat of categories(); track cat) {
            <button
              type="button"
              class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
              [ngClass]="selectedCategory() === cat ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
              (click)="selectedCategory.set(cat)"
            >
              {{ cat }}
            </button>
          }
        </div>
      </section>

      <!-- 4. Services Grid -->
      @if (filteredServices().length > 0) {
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (service of filteredServices(); track service.id) {
            <div class="bg-[#141314] border border-[#222222] hover:border-neutral-700 rounded-xl p-4 flex flex-col justify-between gap-4 transition-colors">
              <div>
                <!-- Category & Rate Header (No Image) -->
                <div class="flex items-center justify-between gap-2 p-3 rounded-lg bg-[#1c1b1c] border border-[#262526] mb-3.5">
                  <span class="px-2 py-0.5 rounded bg-[#100e0f] border border-[#262526] text-[10px] font-bold uppercase tracking-wider text-[#d70006] font-oxanium">
                    {{ service.category }}
                  </span>
                  <span class="text-xs font-oxanium font-bold text-white">
                    From LKR {{ service.startingPriceLkr | number }}
                  </span>
                </div>

                <div class="flex items-center gap-1.5 text-[11px] text-neutral-400 mb-1.5">
                  <app-icon name="clock" [size]="13" strokeColor="#878f97" />
                  <span>Duration approx. {{ service.durationMinutes }} mins</span>
                </div>

                <h3 class="font-oxanium font-bold text-white text-base leading-snug">
                  {{ service.name }}
                </h3>
                <p class="text-xs text-neutral-400 line-clamp-2 leading-relaxed mt-1">
                  {{ service.shortDescription }}
                </p>
              </div>

              <!-- Bottom Actions -->
              <div class="flex items-center justify-between gap-2 pt-3 border-t border-[#1f1e1f]">
                <button
                  type="button"
                  (click)="openDetailsModal(service)"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer text-center"
                >
                  Details
                </button>
                <a
                  [routerLink]="['/customer/book-repair']"
                  [queryParams]="{ serviceId: service.id }"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#d70006] hover:text-white text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Book Service</span>
                  <app-icon name="arrow-right" [size]="12" />
                </a>
              </div>
            </div>
          }
        </div>
      } @else {
        <app-empty-state
          icon="search"
          title="No Matching Services"
          description="Try adjusting your keyword or switching categories."
          actionLabel="Clear Filters"
          (action)="resetFilters()"
        />
      }

      <!-- 5. Service Details Modal Popup -->
      @if (selectedService(); as srv) {
        <div
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto"
          (click)="closeDetailsModal()"
        >
          <div
            class="w-full max-w-2xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8"
            (click)="$event.stopPropagation()"
          >
            <!-- Modal Header -->
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">SERVICE SPECIFICATIONS</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">
                  {{ srv.name }}
                </h3>
              </div>
              <button
                type="button"
                class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer transition-colors"
                (click)="closeDetailsModal()"
                aria-label="Close modal"
              >
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <!-- Modal Content -->
            <div class="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <!-- Telemetry Header Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                  <span class="text-[10px] uppercase font-bold text-neutral-400 block font-oxanium">Starting Rate</span>
                  <span class="text-base sm:text-lg font-bold font-oxanium text-white mt-0.5 block">
                    LKR {{ srv.startingPriceLkr | number }}
                  </span>
                </div>
                <div class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                  <span class="text-[10px] uppercase font-bold text-neutral-400 block font-oxanium">Estimated Duration</span>
                  <span class="text-base sm:text-lg font-bold font-oxanium text-neutral-200 mt-0.5 block">
                    {{ srv.durationMinutes }} Mins
                  </span>
                </div>
                <div class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                  <span class="text-[10px] uppercase font-bold text-neutral-400 block font-oxanium">Classification</span>
                  <span class="text-xs sm:text-sm font-bold text-[#d70006] mt-1 block">
                    {{ srv.category }}
                  </span>
                </div>
              </div>

              <!-- Full Description -->
              <div class="space-y-1.5">
                <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium">Package Scope &amp; Procedures</h4>
                <p class="text-xs sm:text-sm text-neutral-200 leading-relaxed bg-[#100e0f] border border-[#222222] p-4 rounded-xl">
                  {{ srv.fullDescription || srv.shortDescription }}
                </p>
              </div>

              <!-- Included Checks & Deliverables -->
              @if (srv.includedItems && srv.includedItems.length > 0) {
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium mb-2">
                    Included Checks &amp; Deliverables ({{ srv.includedItems.length }})
                  </h4>
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    @for (item of srv.includedItems; track item) {
                      <div class="flex items-start gap-2 p-2.5 rounded-lg bg-[#1c1b1c] border border-[#262526] text-xs text-neutral-300">
                        <app-icon name="check-circle" [size]="14" strokeColor="#d70006" class="mt-0.5 shrink-0" />
                        <span class="leading-tight">{{ item }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Common Symptoms Addressed -->
              @if (srv.commonSymptoms && srv.commonSymptoms.length > 0) {
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-neutral-400 font-oxanium mb-2">
                    Common Warning Signs Pinpointed
                  </h4>
                  <div class="flex flex-wrap gap-2">
                    @for (sym of srv.commonSymptoms; track sym) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1c1b1c] border border-[#262526] text-xs text-neutral-300">
                        <app-icon name="alert-triangle" [size]="12" strokeColor="#f59e0b" />
                        <span>{{ sym }}</span>
                      </span>
                    }
                  </div>
                </div>
              }
            </div>

            <!-- Modal Footer -->
            <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#222222] bg-[#100e0f]">
              <button
                type="button"
                class="px-4 py-2 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                (click)="closeDetailsModal()"
              >
                Close
              </button>
              <a
                [routerLink]="['/customer/book-repair']"
                [queryParams]="{ serviceId: srv.id }"
                class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
                (click)="closeDetailsModal()"
              >
                <app-icon name="wrench" [size]="14" />
                <span>Book This Service</span>
              </a>
            </div>
          </div>
        </div>
      }
    </div>
  `
})
export class CustomerServicesComponent implements OnInit {
  private serviceCatalog = inject(ServiceCatalogService);

  searchQuery = signal<string>('');
  selectedCategory = signal<string>('ALL');
  selectedService = signal<CarService | null>(null);

  categories = this.serviceCatalog.categories;
  allServices = computed(() => this.serviceCatalog.getServices());

  ngOnInit(): void {
    this.serviceCatalog.loadServices(true).subscribe();
  }

  openDetailsModal(service: CarService): void {
    this.selectedService.set(service);
  }

  closeDetailsModal(): void {
    this.selectedService.set(null);
  }

  totalServicesCount = computed(() => this.allServices().length);
  maintenanceCount = computed(() => this.allServices().filter(s => s.category === 'Maintenance').length);
  engineBrakesCount = computed(() => this.allServices().filter(s => s.category === 'Engine & Transmission' || s.category === 'Brakes & Tires').length);
  diagnosticsCount = computed(() => this.allServices().filter(s => s.category === 'Diagnostics').length);

  filteredServices = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const cat = this.selectedCategory();

    return this.allServices().filter(s => {
      const matchCat = cat === 'ALL' || s.category === cat;
      const matchQuery = !q ||
        s.name.toLowerCase().includes(q) ||
        s.shortDescription.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  });

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedCategory.set('ALL');
  }
}
