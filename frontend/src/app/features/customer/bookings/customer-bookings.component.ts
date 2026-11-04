import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { Booking, RepairStatus } from '../../../core/models/booking.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { ConfirmDialogComponent } from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-customer-bookings',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, StatusBadgeComponent, IconComponent, ConfirmDialogComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Consistent Title Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            My <span class="text-[#d70006]">Bookings</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Review active service appointments, track repairs, and manage schedules.
          </p>
        </div>
        <a
          routerLink="/customer/book-repair"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 self-start sm:self-auto cursor-pointer"
        >
          <app-icon name="plus" [size]="14" />
          <span>New Booking</span>
        </a>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      <section aria-label="Bookings Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              [ngClass]="inProgressCount() > 0 ? 'bg-[#d70006] animate-pulse' : 'bg-neutral-600'"
            ></span>
            <span class="text-xs text-neutral-400 font-medium">In Workshop</span>
          </div>
          <span class="text-base font-bold font-oxanium text-white">{{ inProgressCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Upcoming Visits</span>
          <span class="text-base font-bold font-oxanium text-white">{{ upcomingCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Past Services</span>
          <span class="text-base font-bold font-oxanium text-white">{{ completedCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Total Bookings</span>
          <span class="text-base font-bold font-oxanium text-white">{{ totalCount() }}</span>
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
            placeholder="Search by reference (e.g. GRX-2026-8941) or plate..."
            class="flex-1 bg-transparent border-none text-white text-xs sm:text-sm outline-none placeholder:text-neutral-500 font-mono"
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
            [ngClass]="selectedTab() === 'ALL' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="selectedTab.set('ALL')"
          >
            All ({{ totalCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="selectedTab() === 'UPCOMING' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="selectedTab.set('UPCOMING')"
          >
            Upcoming ({{ upcomingCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="selectedTab() === 'IN_PROGRESS' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="selectedTab.set('IN_PROGRESS')"
          >
            In Progress ({{ inProgressCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="selectedTab() === 'COMPLETED' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="selectedTab.set('COMPLETED')"
          >
            Completed ({{ completedCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="selectedTab() === 'CANCELLED' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="selectedTab.set('CANCELLED')"
          >
            Cancelled ({{ cancelledCount() }})
          </button>
        </div>
      </section>

      <!-- 4. Bookings Stream (Matching Dashboard's Recent Service Visits) -->
      <section class="space-y-2.5">
        @for (b of filteredBookings(); track b.id) {
          <div
            class="bg-[#141314] border border-[#222222] hover:border-neutral-700 rounded-xl p-3.5 sm:p-4 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3.5 cursor-pointer"
            (click)="openDetailsModal(b)"
          >
            <!-- Left: Reference, Vehicle, Services -->
            <div class="flex items-start sm:items-center gap-3">
              <div class="w-9 h-9 rounded-lg bg-[#1c1b1c] border border-[#262526] flex items-center justify-center shrink-0">
                <app-icon name="wrench" [size]="16" strokeColor="#878f97" />
              </div>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <span class="font-mono text-xs font-bold text-[#d70006]">{{ b.referenceNumber }}</span>
                  <span class="text-neutral-600 text-xs">&bull;</span>
                  <span class="text-xs font-semibold text-white">{{ b.vehicle.brand }} {{ b.vehicle.model }}</span>
                  <span class="text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c1b1c] text-neutral-300 border border-[#2d2c2d]">
                    {{ b.vehicle.plateNumber }}
                  </span>
                  <span class="text-[11px] text-neutral-500 font-medium">({{ b.vehicle.year }})</span>
                </div>
                <div class="flex items-center gap-2 flex-wrap mt-1">
                  <p class="text-xs text-neutral-400 line-clamp-1">{{ b.serviceNames.join(', ') }}</p>
                  <span class="text-neutral-600 text-xs hidden sm:inline">&bull;</span>
                  <span class="text-[11px] text-neutral-500 hidden sm:inline">{{ b.dropOffOption === 'drop_off' ? 'Vehicle Drop-Off' : 'Lounge Waiting' }}</span>
                </div>
              </div>
            </div>

            <!-- Right: Date, Price, Status, Track Action -->
            <div class="flex items-center justify-between md:justify-end gap-3 pt-2.5 md:pt-0 border-t md:border-t-0 border-[#1c1b1c]" (click)="$event.stopPropagation()">
              <div class="text-left md:text-right">
                <div class="text-xs font-medium text-white">{{ b.appointmentDate }}</div>
                <div class="text-[11px] text-neutral-400 font-oxanium font-bold">LKR {{ (b.finalPriceLkr || b.estimatedPriceLkr) | number }}</div>
              </div>

              <app-status-badge [status]="b.status" />

              <div class="flex items-center gap-2">
                <a
                  [routerLink]="['/customer/track-repair']"
                  [queryParams]="{ ref: b.referenceNumber }"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors shrink-0"
                >
                  Track
                </a>
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors shrink-0 cursor-pointer"
                  (click)="openDetailsModal(b)"
                >
                  Details
                </button>
                @if (canCancelBooking(b)) {
                  <button
                    type="button"
                    class="px-2.5 py-1.5 rounded-lg border border-red-900/40 hover:bg-red-950/40 text-red-400 text-xs font-semibold transition-colors shrink-0 cursor-pointer"
                    (click)="requestCancel(b)"
                    title="Cancel Booking"
                  >
                    Cancel
                  </button>
                }
              </div>
            </div>
          </div>
        } @empty {
          <app-empty-state
            icon="calendar"
            title="No Bookings Matching Your Criteria"
            description="Try switching tabs or clearing your search query."
            actionLabel="Clear Filter"
            (action)="resetFilters()"
          />
        }
      </section>

      <!-- Detailed Booking Modal -->
      @if (selectedBooking(); as modal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeDetailsModal()">
          <div class="w-full max-w-2xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">BOOKING SPECIFICATIONS</span>
                <h3 class="text-xl font-bold font-oxanium text-white tracking-wide mt-0.5">{{ modal.referenceNumber }}</h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeDetailsModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <!-- Status Strip -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] text-xs">
                <div>
                  <span class="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">Workshop Status</span>
                  <app-status-badge [status]="modal.status" />
                </div>
                <div>
                  <span class="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">Est. Completion</span>
                  <strong class="text-white font-medium text-xs">{{ modal.estimatedCompletion }}</strong>
                </div>
                <div>
                  <span class="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">Total Amount</span>
                  <strong class="text-[#d70006] font-oxanium font-bold text-sm">LKR {{ modal.estimatedPriceLkr | number }}</strong>
                </div>
              </div>

              <!-- Vehicle & Appointment Details -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1.5">
                  <h4 class="flex items-center gap-2 font-oxanium font-bold text-xs uppercase tracking-wider text-white mb-2">
                    <app-icon name="car" [size]="15" strokeColor="#d70006" /> Vehicle Details
                  </h4>
                  <div class="text-sm font-bold text-white">{{ modal.vehicle.brand }} {{ modal.vehicle.model }} ({{ modal.vehicle.year }})</div>
                  <div class="text-xs text-neutral-400">Plate Number: <span class="text-white font-mono font-bold">{{ modal.vehicle.plateNumber }}</span></div>
                  <div class="text-xs text-neutral-400">Odometer: {{ modal.vehicle.mileageKm | number }} km</div>
                </div>

                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1.5">
                  <h4 class="flex items-center gap-2 font-oxanium font-bold text-xs uppercase tracking-wider text-white mb-2">
                    <app-icon name="user" [size]="15" strokeColor="#d70006" /> Appointment &amp; Bay
                  </h4>
                  <div class="text-xs text-neutral-300">Date: <strong class="text-white">{{ modal.appointmentDate }} at {{ modal.appointmentTime }}</strong></div>
                  <div class="text-xs text-neutral-300">Technician: <strong class="text-white">{{ modal.assignedMechanicName }}</strong></div>
                  <div class="text-xs text-neutral-400">Intake: {{ modal.dropOffOption === 'drop_off' ? 'Vehicle Drop-Off Bay' : 'Waiting in Customer Lounge' }}</div>
                </div>
              </div>

              <!-- Services Breakdown -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-white mb-3">Requested Services</h4>
                <ul class="space-y-2 text-xs text-neutral-300">
                  @for (s of modal.serviceNames; track s) {
                    <li class="flex items-center gap-2">
                      <app-icon name="check-circle" [size]="15" strokeColor="#10b981" />
                      <span>{{ s }}</span>
                    </li>
                  }
                </ul>
              </div>

              <!-- Problem Description -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-2.5">
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-white">Customer Problem Notes</h4>
                <p class="text-xs text-neutral-300 leading-relaxed">{{ modal.problemDescription }}</p>
                @if (modal.internalNotes) {
                  <div class="p-3 rounded-lg bg-[#141314] border border-[#2f2e2e] text-xs">
                    <strong class="text-[#d70006] uppercase tracking-wider text-[10px] block mb-1">Workshop Internal Bay Log:</strong>
                    <p class="text-neutral-300 leading-relaxed">{{ modal.internalNotes }}</p>
                  </div>
                }
              </div>
            </div>

            <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#222222] bg-[#0c0a0a]">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                (click)="closeDetailsModal()"
              >
                Close
              </button>
              <a
                [routerLink]="['/customer/track-repair']"
                [queryParams]="{ ref: modal.referenceNumber }"
                (click)="closeDetailsModal()"
                class="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer"
              >
                <app-icon name="gauge" [size]="14" />
                <span>Track Progress Live</span>
              </a>
            </div>
          </div>
        </div>
      }

      <!-- Cancel Confirmation Dialog -->
      <app-confirm-dialog
        [isOpen]="cancelDialogOpen()"
        title="Cancel Repair Booking"
        [message]="'Are you sure you want to cancel booking ' + (bookingToCancel()?.referenceNumber || '') + '? This will release your allocated workshop bay and mechanic schedule.'"
        confirmText="Yes, Cancel Booking"
        cancelText="Keep Booking"
        (confirm)="executeCancellation()"
        (cancel)="cancelDialogOpen.set(false)"
      />
    </div>
  `
})
export class CustomerBookingsComponent {
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private toast = inject(ToastService);

  customerId = computed(() => this.authService.currentUser()?.id || 'cust-101');
  customerBookings = computed(() => this.bookingService.getCustomerBookings(this.customerId()));

  searchQuery = signal<string>('');
  selectedTab = signal<'ALL' | 'UPCOMING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED'>('ALL');

  selectedBooking = signal<Booking | null>(null);
  cancelDialogOpen = signal<boolean>(false);
  bookingToCancel = signal<Booking | null>(null);

  totalCount = computed(() => this.customerBookings().length);
  upcomingCount = computed(() => this.customerBookings().filter(b => b.status === RepairStatus.CONFIRMED || b.status === RepairStatus.PENDING).length);
  inProgressCount = computed(() => this.customerBookings().filter(b =>
    b.status === RepairStatus.IN_PROGRESS ||
    b.status === RepairStatus.WAITING_FOR_PARTS ||
    b.status === RepairStatus.ON_HOLD ||
    b.status === RepairStatus.QUALITY_CHECK ||
    b.status === RepairStatus.READY_FOR_PICKUP
  ).length);
  completedCount = computed(() => this.customerBookings().filter(b => b.status === RepairStatus.DELIVERED).length);
  cancelledCount = computed(() => this.customerBookings().filter(b => b.status === RepairStatus.CANCELLED).length);

  filteredBookings = computed(() => {
    let list = this.customerBookings();
    const tab = this.selectedTab();
    const q = this.searchQuery().toLowerCase().trim();

    if (tab === 'UPCOMING') {
      list = list.filter(b => b.status === RepairStatus.CONFIRMED || b.status === RepairStatus.PENDING);
    } else if (tab === 'IN_PROGRESS') {
      list = list.filter(b =>
        b.status === RepairStatus.IN_PROGRESS ||
        b.status === RepairStatus.WAITING_FOR_PARTS ||
        b.status === RepairStatus.ON_HOLD ||
        b.status === RepairStatus.QUALITY_CHECK ||
        b.status === RepairStatus.READY_FOR_PICKUP
      );
    } else if (tab === 'COMPLETED') {
      list = list.filter(b => b.status === RepairStatus.DELIVERED);
    } else if (tab === 'CANCELLED') {
      list = list.filter(b => b.status === RepairStatus.CANCELLED);
    }

    if (q) {
      list = list.filter(b =>
        b.referenceNumber.toLowerCase().includes(q) ||
        b.vehicle.plateNumber.toLowerCase().includes(q) ||
        b.vehicle.model.toLowerCase().includes(q) ||
        b.serviceNames.some(s => s.toLowerCase().includes(q))
      );
    }

    return list;
  });

  openDetailsModal(booking: Booking): void {
    this.selectedBooking.set(booking);
  }

  closeDetailsModal(): void {
    this.selectedBooking.set(null);
  }

  canCancelBooking(b: Booking): boolean {
    return b.status === RepairStatus.PENDING || b.status === RepairStatus.CONFIRMED;
  }

  requestCancel(b: Booking): void {
    this.bookingToCancel.set(b);
    this.cancelDialogOpen.set(true);
  }

  executeCancellation(): void {
    const b = this.bookingToCancel();
    if (b) {
      this.bookingService.cancelBooking(b.id, 'Cancelled by customer via Customer Portal');
      this.toast.showInfo(`Booking ${b.referenceNumber} has been cancelled.`);
      this.cancelDialogOpen.set(false);
      this.bookingToCancel.set(null);
    }
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.selectedTab.set('ALL');
  }
}
