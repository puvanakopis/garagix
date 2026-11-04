import { Component, ChangeDetectionStrategy, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingService } from '../../../core/services/booking.service';
import { MechanicService } from '../../../core/services/mechanic.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ReportService } from '../../../core/services/report.service';
import { RepairStatus } from '../../../core/models/booking.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, StatusBadgeComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent -->
      <header class="pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Workshop <span class="text-[#d70006]">Control HQ</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Live garage bay telemetry, pending booking intake, and mechanic assignment control.
          </p>
        </div>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Customer Dashboard) -->
      <section aria-label="HQ Metric Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
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
          <span class="text-xs text-neutral-400 font-medium">Pending Intake</span>
          <span class="text-base font-bold font-oxanium text-amber-400">{{ pendingCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Total Bookings</span>
          <span class="text-base font-bold font-oxanium text-white">{{ allBookings().length }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Pipeline (LKR)</span>
          <span class="text-base font-bold font-oxanium text-[#d70006] truncate max-w-[130px]">LKR {{ totalEstimatedRevenue() | number }}</span>
        </div>
      </section>

      <!-- 3. Secondary Operational Status Row -->
      <section class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Completed Repairs</span>
          <span class="text-base font-bold font-oxanium text-emerald-400">{{ completedCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Registered Clients</span>
          <span class="text-base font-bold font-oxanium text-white">{{ totalCustomers() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Master Technicians</span>
          <span class="text-base font-bold font-oxanium text-white">{{ totalMechanics() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Hydraulic Bays</span>
          <span class="text-xs font-bold font-oxanium text-emerald-400 uppercase">6 Operational</span>
        </div>
      </section>

      <!-- 4. Charts & Visual Analytics Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Chart 1: Monthly Booking Statistics -->
        <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#222222]">
            <div>
              <h3 class="font-oxanium font-bold text-white text-sm uppercase tracking-wider">Monthly Repair Volume</h3>
              <p class="text-xs text-neutral-400 mt-0.5">Bookings vs Completed vehicles (Last 6 Months)</p>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1c1b1c] text-[#d70006] border border-[#262526] font-oxanium uppercase">Telemetry</span>
          </div>

          <!-- SVG Bar Chart -->
          <div class="w-full overflow-hidden">
            <svg viewBox="0 0 500 220" class="w-full h-auto">
              <line x1="40" y1="30" x2="480" y2="30" stroke="#222222" stroke-dasharray="4" />
              <line x1="40" y1="80" x2="480" y2="80" stroke="#222222" stroke-dasharray="4" />
              <line x1="40" y1="130" x2="480" y2="130" stroke="#222222" stroke-dasharray="4" />
              <line x1="40" y1="180" x2="480" y2="180" stroke="#262526" />

              <text x="10" y="35" fill="#64748b" font-size="11">150</text>
              <text x="10" y="85" fill="#64748b" font-size="11">100</text>
              <text x="10" y="135" fill="#64748b" font-size="11">50</text>
              <text x="20" y="185" fill="#64748b" font-size="11">0</text>

              <!-- Jun -->
              <rect x="65" y="92" width="22" height="88" fill="#d70006" rx="4" />
              <rect x="91" y="96" width="22" height="84" fill="#38bdf8" rx="4" />
              <text x="75" y="202" fill="#94a3b8" font-size="11" text-anchor="middle">Jun</text>

              <!-- Jul -->
              <rect x="135" y="76" width="22" height="104" fill="#d70006" rx="4" />
              <rect x="161" y="82" width="22" height="98" fill="#38bdf8" rx="4" />
              <text x="145" y="202" fill="#94a3b8" font-size="11" text-anchor="middle">Jul</text>

              <!-- Aug -->
              <rect x="205" y="62" width="22" height="118" fill="#d70006" rx="4" />
              <rect x="231" y="66" width="22" height="114" fill="#38bdf8" rx="4" />
              <text x="215" y="202" fill="#94a3b8" font-size="11" text-anchor="middle">Aug</text>

              <!-- Sep -->
              <rect x="275" y="55" width="22" height="125" fill="#d70006" rx="4" />
              <rect x="301" y="60" width="22" height="120" fill="#38bdf8" rx="4" />
              <text x="285" y="202" fill="#94a3b8" font-size="11" text-anchor="middle">Sep</text>

              <!-- Oct -->
              <rect x="345" y="38" width="22" height="142" fill="#d70006" rx="4" />
              <rect x="371" y="42" width="22" height="138" fill="#38bdf8" rx="4" />
              <text x="355" y="202" fill="#94a3b8" font-size="11" text-anchor="middle">Oct</text>

              <!-- Nov -->
              <rect x="415" y="85" width="22" height="95" fill="#d70006" rx="4" opacity="0.8" />
              <rect x="441" y="95" width="22" height="85" fill="#38bdf8" rx="4" opacity="0.8" />
              <text x="425" y="202" fill="#94a3b8" font-size="11" text-anchor="middle">Nov*</text>
            </svg>
          </div>

          <div class="flex items-center gap-6 text-xs text-neutral-400 pt-2 border-t border-[#1f1e1f]">
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded bg-[#d70006]"></span> Bookings Received</span>
            <span class="flex items-center gap-2"><span class="w-2.5 h-2.5 rounded bg-sky-400"></span> Delivered / Handed Over</span>
          </div>
        </div>

        <!-- Chart 2: Revenue by Service Category -->
        <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#222222]">
            <div>
              <h3 class="font-oxanium font-bold text-white text-sm uppercase tracking-wider">Revenue by Service Category</h3>
              <p class="text-xs text-neutral-400 mt-0.5">Category proportion of gross workshop billings</p>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Top Earners</span>
          </div>

          <div class="space-y-3.5 pt-1">
            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-white font-medium">Engine Diagnostics &amp; Overhauls</span>
                <span class="text-neutral-400">36% (LKR 7,104,000)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-[#1c1b1c] overflow-hidden">
                <div class="h-full bg-[#d70006] rounded-full" style="width: 36%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-white font-medium">General 40-Point Maintenance</span>
                <span class="text-neutral-400">20% (LKR 3,885,000)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-[#1c1b1c] overflow-hidden">
                <div class="h-full bg-sky-400 rounded-full" style="width: 20%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-white font-medium">Hybrid Battery Rejuvenation</span>
                <span class="text-neutral-400">14% (LKR 2,242,500)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-[#1c1b1c] overflow-hidden">
                <div class="h-full bg-emerald-400 rounded-full" style="width: 14%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-white font-medium">Auto AC &amp; Climate Service</span>
                <span class="text-neutral-400">11% (LKR 1,617,000)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-[#1c1b1c] overflow-hidden">
                <div class="h-full bg-amber-400 rounded-full" style="width: 11%"></div>
              </div>
            </div>

            <div>
              <div class="flex justify-between text-xs mb-1">
                <span class="text-white font-medium">Ceramic Brake &amp; ABS Tuning</span>
                <span class="text-neutral-400">11% (LKR 1,624,000)</span>
              </div>
              <div class="w-full h-2 rounded-full bg-[#1c1b1c] overflow-hidden">
                <div class="h-full bg-purple-400 rounded-full" style="width: 11%"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Workshop Schedule: Today's Appointments -->
      <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 space-y-3.5">
        <div class="flex items-center justify-between pb-3 border-b border-[#222222]">
          <div>
            <h3 class="font-oxanium font-bold text-white text-sm uppercase tracking-wider">Today's Bay Appointments</h3>
            <p class="text-xs text-neutral-400 mt-0.5">Scheduled vehicle intakes at Colombo Central</p>
          </div>
          <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-sky-500/15 text-sky-400 border border-sky-500/30">Today</span>
        </div>

        <div class="space-y-2.5">
          @for (booking of todayBookings(); track booking.id) {
            <div class="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#1c1b1c] border border-[#262526]">
              <div class="flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#141314] border border-[#262526] text-xs font-semibold text-neutral-300 shrink-0">
                <app-icon name="clock" [size]="13" strokeColor="#878f97" />
                <span>{{ booking.appointmentTime }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <strong class="text-xs font-bold text-white truncate block">{{ booking.vehicle.plateNumber }} &bull; {{ booking.vehicle.brand }} {{ booking.vehicle.model }}</strong>
                <div class="text-[11px] text-neutral-400 truncate">{{ booking.customerName }} &bull; {{ booking.serviceNames[0] }}</div>
              </div>
              <app-status-badge [status]="booking.status" />
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent {
  private bookingService = inject(BookingService);
  private mechanicService = inject(MechanicService);
  private customerService = inject(CustomerService);
  private reportService = inject(ReportService);

  RepairStatus = RepairStatus;
  allBookings = this.bookingService.bookings;
  mechanics = this.mechanicService.mechanics;
  customers = this.customerService.customers;

  totalBookings = computed(() => this.allBookings().length);
  pendingCount = computed(() => this.allBookings().filter(b => b.status === RepairStatus.PENDING).length);
  inProgressCount = computed(() => this.allBookings().filter(b => [RepairStatus.IN_PROGRESS, RepairStatus.WAITING_FOR_PARTS, RepairStatus.ON_HOLD, RepairStatus.QUALITY_CHECK, RepairStatus.READY_FOR_PICKUP].includes(b.status)).length);
  completedCount = computed(() => this.allBookings().filter(b => b.status === RepairStatus.DELIVERED).length);

  totalCustomers = computed(() => this.customers().length);
  totalMechanics = computed(() => this.mechanics().length);

  totalEstimatedRevenue = computed(() => {
    return this.allBookings().reduce((sum, b) => sum + (b.estimatedPriceLkr || 0), 0);
  });

  todayBookings = computed(() => {
    return this.allBookings().slice(0, 4);
  });
}
