import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { RepairStatus } from '../../../core/models/booking.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-customer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Personal Greeting -->
      <header class="pb-2 border-b border-[#222222]">
        <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
          Hello, <span class="text-[#d70006]">{{ customerFirstName() }}</span>
        </h1>
        <p class="text-xs sm:text-sm text-neutral-400 mt-1">
          Your garage is running smoothly. Ready whenever you need maintenance or repairs.
        </p>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact, subtle chips) -->
      <section aria-label="Status Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              [ngClass]="activeRepairCount() > 0 ? 'bg-[#d70006] animate-pulse' : 'bg-neutral-600'"
            ></span>
            <span class="text-xs text-neutral-400 font-medium">In Workshop</span>
          </div>
          <span class="text-base font-bold font-oxanium text-white">{{ activeRepairCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Upcoming Visits</span>
          <span class="text-base font-bold font-oxanium text-white">{{ upcomingCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Saved Vehicles</span>
          <span class="text-base font-bold font-oxanium text-white">{{ savedVehicles().length }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Past Services</span>
          <span class="text-base font-bold font-oxanium text-white">{{ completedCount() }}</span>
        </div>
      </section>

      <!-- 3. My Saved Vehicles -->
      <section class="space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-sm font-bold font-oxanium uppercase tracking-wider text-white">My Vehicles</h2>
            <p class="text-xs text-neutral-400">Registered cars in your Garagix garage</p>
          </div>
          <a
            routerLink="/customer/profile"
            class="text-xs font-semibold text-[#d70006] hover:underline inline-flex items-center gap-1"
          >
            <span>Manage</span>
            <app-icon name="chevron-right" [size]="12" />
          </a>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          @for (veh of savedVehicles(); track veh.id) {
            <div class="bg-[#141314] border border-[#222222] hover:border-neutral-700 rounded-xl p-4 flex flex-col justify-between gap-3.5 transition-colors">
              <div class="flex items-start justify-between gap-2">
                <div>
                  <span class="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c1b1c] text-neutral-300 border border-[#2d2c2d] mb-1.5">
                    {{ veh.plateNumber }}
                  </span>
                  <h3 class="font-oxanium font-bold text-white text-sm">{{ veh.brand }} {{ veh.model }}</h3>
                  <p class="text-xs text-neutral-400 mt-0.5">
                    {{ veh.year }} &bull; {{ veh.type }} &bull; {{ veh.mileageKm | number }} km
                  </p>
                </div>
                <div class="w-8 h-8 rounded-lg bg-[#1c1b1c] flex items-center justify-center shrink-0">
                  <app-icon name="car" [size]="16" strokeColor="#878f97" />
                </div>
              </div>

              <div class="flex items-center justify-between pt-2.5 border-t border-[#1f1e1f]">
                <span class="text-[11px] text-neutral-500 capitalize">{{ veh.color || 'Standard' }}</span>
                <a
                  [routerLink]="['/customer/book-repair']"
                  [queryParams]="{ vehicleId: veh.id }"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#d70006] hover:text-white text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
                >
                  <span>Book Service</span>
                  <app-icon name="arrow-right" [size]="12" />
                </a>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- 4. Recent Service Visits (Clean, modern list instead of wide cumbersome table) -->
      <section class="space-y-3 pt-2">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-sm font-bold font-oxanium uppercase tracking-wider text-white">Recent Service Visits</h2>
            <p class="text-xs text-neutral-400">Your vehicle repair records and service logs</p>
          </div>

          <div class="flex items-center gap-3">
            <!-- Filter Pills -->
            <div class="flex items-center p-0.5 rounded-lg bg-[#141314] border border-[#222222]">
              <button
                type="button"
                class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                [ngClass]="historyFilter() === 'ALL' ? 'bg-[#222122] text-white' : 'text-neutral-400 hover:text-white'"
                (click)="historyFilter.set('ALL')"
              >
                All
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                [ngClass]="historyFilter() === 'ACTIVE' ? 'bg-[#222122] text-white' : 'text-neutral-400 hover:text-white'"
                (click)="historyFilter.set('ACTIVE')"
              >
                Active
              </button>
              <button
                type="button"
                class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                [ngClass]="historyFilter() === 'COMPLETED' ? 'bg-[#222122] text-white' : 'text-neutral-400 hover:text-white'"
                (click)="historyFilter.set('COMPLETED')"
              >
                Completed
              </button>
            </div>

            <a
              routerLink="/customer/bookings"
              class="text-xs font-semibold text-[#d70006] hover:underline inline-flex items-center gap-1 shrink-0"
            >
              <span>View All</span>
              <app-icon name="chevron-right" [size]="12" />
            </a>
          </div>
        </div>

        <!-- History Items Stream -->
        <div class="space-y-2.5">
          @for (booking of filteredBookings(); track booking.id) {
            <div class="bg-[#141314] border border-[#222222] hover:border-neutral-700 rounded-xl p-3.5 sm:p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3.5">
              <!-- Left: Reference, Vehicle, Services -->
              <div class="flex items-start sm:items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-[#1c1b1c] border border-[#262526] flex items-center justify-center shrink-0">
                  <app-icon name="wrench" [size]="16" strokeColor="#878f97" />
                </div>
                <div>
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-mono text-xs font-bold text-[#d70006]">{{ booking.referenceNumber }}</span>
                    <span class="text-neutral-600 text-xs">&bull;</span>
                    <span class="text-xs font-semibold text-white">{{ booking.vehicle.brand }} {{ booking.vehicle.model }}</span>
                    <span class="text-[11px] font-mono px-1.5 py-0.2 rounded bg-[#1c1b1c] text-neutral-400 border border-[#262526]">
                      {{ booking.vehicle.plateNumber }}
                    </span>
                  </div>
                  <p class="text-xs text-neutral-400 mt-0.5 line-clamp-1">{{ booking.serviceNames.join(', ') }}</p>
                </div>
              </div>

              <!-- Right: Date, Price, Status, Track Action -->
              <div class="flex items-center justify-between md:justify-end gap-3.5 pt-2.5 md:pt-0 border-t md:border-t-0 border-[#1c1b1c]">
                <div class="text-left md:text-right">
                  <div class="text-xs font-medium text-white">{{ booking.appointmentDate }}</div>
                  <div class="text-[11px] text-neutral-400 font-oxanium font-bold">LKR {{ (booking.finalPriceLkr || booking.estimatedPriceLkr) | number }}</div>
                </div>

                <app-status-badge [status]="booking.status" />

                <a
                  [routerLink]="['/customer/track-repair']"
                  [queryParams]="{ ref: booking.referenceNumber }"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors shrink-0"
                >
                  Track
                </a>
              </div>
            </div>
          } @empty {
            <div class="p-8 text-center bg-[#141314] border border-[#222222] rounded-xl text-neutral-400 text-xs">
              No service records match this filter.
            </div>
          }
        </div>
      </section>
    </div>
  `
})
export class CustomerDashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);

  historyFilter = signal<'ALL' | 'ACTIVE' | 'COMPLETED'>('ALL');

  customerName = computed(() => this.authService.currentUser()?.name || 'Customer');
  customerFirstName = computed(() => {
    const full = this.customerName();
    return full.split(' ')[0] || full;
  });
  customerId = computed(() => this.authService.currentUser()?.id || '');

  customerBookings = computed(() => {
    const id = this.customerId();
    return id ? this.bookingService.getCustomerBookings(id) : [];
  });
  savedVehicles = computed(() => {
    const id = this.customerId();
    return id ? this.customerService.getCustomerVehicles(id) : [];
  });

  ngOnInit(): void {
    const uid = this.authService.currentUser()?.id;
    if (uid) {
      this.customerService.loadCustomerVehicles(uid).subscribe();
    }
  }

  totalBookings = computed(() => this.customerBookings().length);
  upcomingCount = computed(() => this.customerBookings().filter(b => b.status === RepairStatus.CONFIRMED || b.status === RepairStatus.PENDING).length);
  activeRepairCount = computed(() => this.customerBookings().filter(b =>
    b.status === RepairStatus.IN_PROGRESS ||
    b.status === RepairStatus.WAITING_FOR_PARTS ||
    b.status === RepairStatus.ON_HOLD ||
    b.status === RepairStatus.QUALITY_CHECK ||
    b.status === RepairStatus.READY_FOR_PICKUP
  ).length);
  completedCount = computed(() => this.customerBookings().filter(b => b.status === RepairStatus.DELIVERED).length);

  activeBooking = computed(() => {
    return this.customerBookings().find(b =>
      b.status === RepairStatus.IN_PROGRESS ||
      b.status === RepairStatus.WAITING_FOR_PARTS ||
      b.status === RepairStatus.ON_HOLD ||
      b.status === RepairStatus.QUALITY_CHECK ||
      b.status === RepairStatus.READY_FOR_PICKUP ||
      b.status === RepairStatus.CONFIRMED
    );
  });

  filteredBookings = computed(() => {
    const list = this.customerBookings();
    const filter = this.historyFilter();
    if (filter === 'ACTIVE') {
      return list.filter(b => b.status !== RepairStatus.DELIVERED && b.status !== RepairStatus.CANCELLED).slice(0, 5);
    }
    if (filter === 'COMPLETED') {
      return list.filter(b => b.status === RepairStatus.DELIVERED).slice(0, 5);
    }
    return list.slice(0, 5);
  });

  copyReference(ref: string): void {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(ref);
      this.toastService.showSuccess(`Copied reference ${ref} to clipboard`);
    }
  }
}
