import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BookingService } from '../../../core/services/booking.service';
import { Booking, RepairProgressStep, RepairStatus } from '../../../core/models/booking.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-track-repair',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusBadgeComponent, IconComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Track <span class="text-[#d70006]">Repair</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time workshop telemetry, diagnostic milestones, and delivery estimates.
          </p>
        </div>
        @if (currentBooking(); as b) {
          <div class="flex items-center gap-2 self-start sm:self-auto">
            <span class="text-xs text-neutral-400">Tracking:</span>
            <span class="font-mono text-xs font-bold text-[#d70006] px-2.5 py-1 rounded-lg bg-[#141314] border border-[#222222]">{{ b.referenceNumber }}</span>
          </div>
        }
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      @if (currentBooking(); as b) {
        <section aria-label="Repair Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#d70006] animate-pulse"></span>
              <span class="text-xs text-neutral-400 font-medium">Workshop Status</span>
            </div>
            <span class="text-xs font-bold font-oxanium text-white uppercase">{{ b.status.replace('_', ' ') }}</span>
          </div>

          <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-neutral-400 font-medium">Progress</span>
            <span class="text-base font-bold font-oxanium text-[#d70006]">{{ b.progressPercent }}%</span>
          </div>

          <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-neutral-400 font-medium">Est. Delivery</span>
            <span class="text-xs font-bold font-oxanium text-white truncate max-w-[120px]">{{ b.estimatedCompletion }}</span>
          </div>

          <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-neutral-400 font-medium">Est. Total</span>
            <span class="text-base font-bold font-oxanium text-white">LKR {{ b.estimatedPriceLkr | number }}</span>
          </div>
        </section>
      }

      <!-- 3. Telemetry Selector & Quick Search -->
      <section class="bg-[#141314] border border-[#222222] rounded-xl p-4 sm:p-5 space-y-3.5">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 class="text-sm font-bold font-oxanium uppercase tracking-wider text-white">Live Telemetry Feeds</h2>
            <p class="text-xs text-neutral-400">Select any active repair job or search with your booking code</p>
          </div>
          <span class="text-[11px] font-mono text-neutral-500">{{ allBookings().length }} Active Workshop Jobs</span>
        </div>

        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <!-- Reference Search Field -->
          <div class="flex-1 flex items-center gap-2.5 bg-[#1c1b1c] border border-[#262526] focus-within:border-[#d70006] rounded-xl px-3.5 py-2 transition-colors">
            <app-icon name="search" [size]="16" strokeColor="#878f97" />
            <input
              type="text"
              [(ngModel)]="searchCode"
              (keyup.enter)="searchBooking()"
              placeholder="Search code (e.g. GRX-2026-8942)"
              class="flex-1 bg-transparent border-none text-white text-xs sm:text-sm outline-none placeholder:text-neutral-500 font-mono"
            />
            <button
              class="px-2.5 py-1 bg-[#d70006] hover:bg-[#b80005] text-white rounded-md font-oxanium text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer shrink-0"
              (click)="searchBooking()"
            >
              Track
            </button>
          </div>

          <!-- Fast Dropdown Selector (1.5x width) -->
          <div class="relative w-full sm:w-80 md:w-96 shrink-0">
            <select
              id="telemetryDropdown"
              [ngModel]="currentBooking()?.referenceNumber || ''"
              (ngModelChange)="selectSample($event)"
              class="w-full bg-[#1c1b1c] border border-[#262526] hover:border-neutral-600 focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs outline-none transition-colors cursor-pointer appearance-none pr-9 font-medium truncate"
            >
              <option value="" disabled class="bg-[#141314] text-neutral-500">Select Booking</option>
              @for (item of allBookings(); track item.referenceNumber) {
                <option [value]="item.referenceNumber" class="bg-[#141314] text-white py-1.5 font-sans">
                  {{ item.referenceNumber }} - {{ item.vehicle.brand }} {{ item.vehicle.model }}
                </option>
              }
            </select>
            <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400">
              <app-icon name="chevron-down" [size]="15" />
            </div>
          </div>
        </div>
      </section>

      <!-- 4. Live Tracking Details Grid -->
      @if (currentBooking(); as booking) {
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <!-- Main Progress Column -->
          <main class="lg:col-span-2 bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-6">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#74787c] font-oxanium block mb-1">REPAIR STAGE</span>
                <div class="flex items-center gap-2.5">
                  <app-status-badge [status]="booking.status" />
                  <span class="px-2 py-0.5 rounded bg-[#1c1b1c] border border-[#262526] text-[#d70006] text-xs font-bold font-oxanium">{{ booking.progressPercent }}% Complete</span>
                </div>
              </div>

              <div class="text-left sm:text-right">
                <span class="text-[10px] uppercase tracking-wider text-neutral-400 block">Bay Estimated Handover</span>
                <strong class="text-white text-xs sm:text-sm font-oxanium">{{ booking.estimatedCompletion }}</strong>
              </div>
            </div>

            <!-- Horizontal Progress Bar (matching subtle dark palette) -->
            <div class="space-y-1.5">
              <div class="w-full h-2 rounded-full bg-[#1c1b1c] border border-[#262526] overflow-hidden">
                <div class="h-full bg-gradient-to-r from-red-600 to-[#d70006] rounded-full transition-all duration-700" [style.width.%]="booking.progressPercent"></div>
              </div>
              <div class="flex justify-between text-[10px] text-neutral-500 font-oxanium">
                <span>Intake &amp; Inspection</span>
                <span>Diagnostics &amp; Repair</span>
                <span>Quality QA &amp; Handover</span>
              </div>
            </div>

            <!-- Stages Timeline -->
            <div class="space-y-3.5">
              <h3 class="font-oxanium font-bold text-white text-sm uppercase tracking-wider">Vehicle Repair Milestones</h3>

              <div class="relative pl-6 space-y-4 before:content-[''] before:absolute before:left-3 before:top-2 before:bottom-2 before:w-[2px] before:bg-[#222222]">
                @for (step of timelineSteps(); track step.step) {
                  <div class="relative group">
                    <div
                      class="absolute -left-6 top-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all"
                      [ngClass]="{
                        'bg-emerald-500 border-emerald-500 text-white': step.completed,
                        'bg-[#d70006] border-[#d70006] text-white animate-pulse shadow-md shadow-[#d70006]/30': step.current,
                        'bg-[#141314] border-[#292929] text-neutral-500': !step.completed && !step.current
                      }"
                    >
                      @if (step.completed) {
                        <app-icon name="check" [size]="12" strokeColor="#ffffff" />
                      } @else if (step.current) {
                        <span class="w-2 h-2 rounded-full bg-white"></span>
                      } @else {
                        <span class="text-[10px]">{{ step.step }}</span>
                      }
                    </div>

                    <div
                      class="p-3.5 rounded-xl border transition-colors"
                      [ngClass]="step.current ? 'border-[#d70006]/40 bg-[#1e1314]' : 'border-[#222222] bg-[#1c1b1c]'"
                    >
                      <div class="flex items-center justify-between gap-2">
                        <h4 class="text-xs sm:text-sm font-bold font-oxanium" [ngClass]="step.current ? 'text-[#d70006]' : 'text-white'">{{ step.label }}</h4>
                        @if (step.current) {
                          <span class="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-[#d70006] text-white tracking-wider">ACTIVE IN BAY</span>
                        }
                      </div>
                      <p class="text-xs text-neutral-400 mt-1 leading-relaxed">{{ step.description }}</p>
                    </div>
                  </div>
                }
              </div>
            </div>

            <!-- Workshop Technician Live Notes -->
            <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-2">
              <div class="flex items-center gap-2">
                <app-icon name="file-text" [size]="15" strokeColor="#d70006" />
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-white">Technician Bay Log &amp; Diagnosis Notes</h4>
              </div>
              <p class="text-xs text-neutral-300 leading-relaxed">{{ booking.internalNotes || 'Vehicle undergoing factory diagnostic check. All safety sensors reading normally.' }}</p>
            </div>
          </main>

          <!-- Sidebar Column: Vehicle & Invoice Details -->
          <aside class="space-y-4">
            <!-- Vehicle Info Card -->
            <div class="bg-[#141314] border border-[#222222] rounded-xl p-4 sm:p-5 space-y-3.5">
              <h4 class="flex items-center gap-2 font-oxanium font-bold text-xs uppercase tracking-wider text-white pb-2.5 border-b border-[#222222]">
                <app-icon name="car" [size]="15" strokeColor="#d70006" />
                <span>Vehicle Specifications</span>
              </h4>

              <div class="space-y-1">
                <span class="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c1b1c] text-neutral-300 border border-[#2d2c2d]">
                  {{ booking.vehicle.plateNumber }}
                </span>
                <div class="text-base font-bold font-oxanium text-white">{{ booking.vehicle.brand }} {{ booking.vehicle.model }}</div>
                <div class="text-xs text-neutral-400">Model Year {{ booking.vehicle.year }} &bull; {{ booking.vehicle.mileageKm ? (booking.vehicle.mileageKm | number) + ' km' : 'Mileage unrecorded' }}</div>
              </div>

              <div class="pt-2.5 border-t border-[#1f1e1f]">
                <div class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 mb-2">Booked Services:</div>
                <ul class="space-y-1.5 text-xs text-neutral-300">
                  @for (s of booking.serviceNames; track s) {
                    <li class="flex items-center gap-2">
                      <app-icon name="wrench" [size]="13" strokeColor="#878f97" />
                      <span>{{ s }}</span>
                    </li>
                  }
                </ul>
              </div>
            </div>

            <!-- Rate Card -->
            <div class="bg-[#141314] border border-[#222222] rounded-xl p-4 sm:p-5 space-y-3.5">
              <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-white pb-2.5 border-b border-[#222222]">
                Estimated Workshop Invoice
              </h4>
              <div class="text-2xl sm:text-3xl font-bold font-oxanium text-white">
                LKR {{ booking.estimatedPriceLkr | number }}
              </div>
              <div class="flex items-center justify-between text-xs text-neutral-400 pt-2.5 border-t border-[#1f1e1f]">
                <span>Payment Status</span>
                <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30">Due on Collection</span>
              </div>
            </div>
          </aside>
        </div>
      } @else {
        <app-empty-state
          icon="search"
          title="No Repair Found"
          description="We could not find an active workshop repair with that reference or license plate. Please select from the dropdown or double-check your code."
          actionLabel="Try Sample Demo"
          (action)="selectSample('GRX-2026-8942')"
        />
      }
    </div>
  `
})
export class TrackRepairComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private bookingService = inject(BookingService);

  searchCode = '';
  currentBooking = signal<Booking | null>(null);

  allBookings = computed(() => this.bookingService.getBookings());

  timelineSteps = computed<RepairProgressStep[]>(() => {
    const b = this.currentBooking();
    if (!b) return [];
    return this.bookingService.getTimelineSteps(b);
  });

  ngOnInit(): void {
    const ref = this.route.snapshot.queryParams['ref'];
    if (ref) {
      this.searchCode = ref;
      this.searchBooking();
    } else {
      const firstActive = this.bookingService.getBookings().find(b => b.status === RepairStatus.IN_PROGRESS) || this.bookingService.getBookings()[0];
      if (firstActive) {
        this.currentBooking.set(firstActive);
        this.searchCode = firstActive.referenceNumber;
      }
    }
  }

  searchBooking(): void {
    if (!this.searchCode.trim()) return;
    const found = this.bookingService.getBookingByReference(this.searchCode);
    this.currentBooking.set(found || null);
  }

  selectSample(ref: string): void {
    this.searchCode = ref;
    this.searchBooking();
  }
}
