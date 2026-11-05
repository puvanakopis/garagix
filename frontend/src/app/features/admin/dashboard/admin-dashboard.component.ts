import { Component, ChangeDetectionStrategy, inject, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { BookingService } from '../../../core/services/booking.service';
import { MechanicService } from '../../../core/services/mechanic.service';
import { CustomerService } from '../../../core/services/customer.service';
import { WorkshopSettingsService } from '../../../core/services/workshop-settings.service';
import { RepairStatus } from '../../../core/models/booking.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, StatusBadgeComponent, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Workshop <span class="text-[#d70006]">Control HQ</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time workshop telemetry, bay scheduling, customer intake, and financial metrics.
          </p>
        </div>
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <a
            routerLink="/admin/bookings"
            class="px-3 py-1.5 rounded-lg bg-[#141314] hover:bg-[#1c1b1c] border border-[#222222] hover:border-neutral-500 text-xs font-semibold text-neutral-300 hover:text-white transition-colors flex items-center gap-1.5"
          >
            <app-icon name="calendar" [size]="14" strokeColor="#d70006" />
            <span>Manage Bookings</span>
          </a>
        </div>
      </header>

      <!-- 2. Primary Status Summary Bar -->
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
          <span class="text-base font-bold font-oxanium text-white">{{ totalBookings() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Pipeline (LKR)</span>
          <span class="text-base font-bold font-oxanium text-[#d70006] truncate max-w-[130px]" title="LKR {{ totalEstimatedRevenue() | number }}">
            LKR {{ totalEstimatedRevenue() | number }}
          </span>
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
          <span class="text-xs font-bold font-oxanium text-emerald-400 uppercase">{{ hydraulicBays() }} Operational</span>
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
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1c1b1c] text-[#d70006] border border-[#262526] font-oxanium uppercase">Live Telemetry</span>
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

              @for (bar of monthlyBars(); track bar.month) {
                <!-- Bookings Bar (Red) -->
                <rect [attr.x]="bar.bx" [attr.y]="bar.by" width="22" [attr.height]="bar.bHeight" fill="#d70006" rx="4" />
                <!-- Completed Bar (Sky) -->
                <rect [attr.x]="bar.cx" [attr.y]="bar.cy" width="22" [attr.height]="bar.cHeight" fill="#38bdf8" rx="4" />
                <!-- Month Label -->
                <text [attr.x]="bar.textX" y="202" fill="#94a3b8" font-size="11" text-anchor="middle">{{ bar.month }}</text>
              }
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
            @for (cat of categoryRevenue(); track cat.categoryName; let idx = $index) {
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-white font-medium truncate max-w-[220px]">{{ cat.categoryName }}</span>
                  <span class="text-neutral-400">{{ cat.percentage }}% (LKR {{ cat.revenueLkr | number }})</span>
                </div>
                <div class="w-full h-2 rounded-full bg-[#1c1b1c] overflow-hidden">
                  <div
                    class="h-full rounded-full transition-all duration-500"
                    [ngClass]="{
                      'bg-[#d70006]': idx === 0,
                      'bg-sky-400': idx === 1,
                      'bg-emerald-400': idx === 2,
                      'bg-amber-400': idx === 3,
                      'bg-purple-400': idx >= 4
                    }"
                    [style.width.%]="cat.percentage"
                  ></div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- 5. Workshop Schedule: Today's Appointments -->
      <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 space-y-3.5">
        <div class="flex items-center justify-between pb-3 border-b border-[#222222]">
          <div>
            <h3 class="font-oxanium font-bold text-white text-sm uppercase tracking-wider">Today's Bay Appointments</h3>
            <p class="text-xs text-neutral-400 mt-0.5">Scheduled vehicle intakes and active bay assignments</p>
          </div>
          <a
            routerLink="/admin/bookings"
            class="text-xs font-semibold text-[#d70006] hover:underline inline-flex items-center gap-1"
          >
            <span>View All</span>
            <app-icon name="chevron-right" [size]="12" />
          </a>
        </div>

        <div class="space-y-2.5">
          @for (app of todayAppointments(); track app.id) {
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-[#1c1b1c] border border-[#262526] hover:border-neutral-700 transition-colors">
              <div class="flex items-center gap-2.5">
                <div class="flex items-center gap-1 px-2 py-1 rounded bg-[#141314] border border-[#262526] text-xs font-semibold text-neutral-300 shrink-0">
                  <app-icon name="clock" [size]="13" strokeColor="#878f97" />
                  <span>{{ app.appointmentTime }}</span>
                </div>
                <div class="min-w-0">
                  <div class="flex items-center gap-2 flex-wrap">
                    <span class="font-mono text-xs font-bold text-[#d70006]">{{ app.referenceNumber }}</span>
                    <span class="text-neutral-600 text-xs">&bull;</span>
                    <strong class="text-xs font-bold text-white truncate">{{ app.vehicleBrand }} {{ app.vehicleModel }}</strong>
                    <span class="text-[11px] font-mono px-1.5 py-0.2 rounded bg-[#141314] text-neutral-300 border border-[#2d2c2d]">
                      {{ app.vehiclePlate }}
                    </span>
                  </div>
                  <div class="text-[11px] text-neutral-400 truncate mt-0.5">{{ app.customerName }} &bull; {{ app.primaryService }}</div>
                </div>
              </div>

              <div class="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#262526]">
                <app-status-badge [status]="app.status" />
                <a
                  [routerLink]="['/customer/track-repair']"
                  [queryParams]="{ ref: app.referenceNumber }"
                  target="_blank"
                  class="px-2.5 py-1 rounded-md bg-[#141314] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#262526] hover:border-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
                  title="View Live Telemetry"
                >
                  <app-icon name="activity" [size]="12" strokeColor="#d70006" />
                  <span>Track</span>
                </a>
              </div>
            </div>
          } @empty {
            <div class="p-6 text-center text-xs text-neutral-400 bg-[#1c1b1c] rounded-lg">
              No appointments scheduled for today.
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class AdminDashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);
  private bookingService = inject(BookingService);
  private mechanicService = inject(MechanicService);
  private customerService = inject(CustomerService);
  readonly workshopSettings = inject(WorkshopSettingsService);

  RepairStatus = RepairStatus;

  // Real-time backend API data
  private adminData = this.dashboardService.adminDashboard;

  // Reactive computed metrics syncing with API and local store fallbacks
  inProgressCount = computed(() => {
    return this.adminData()?.metrics?.inWorkshopCount ??
      this.bookingService.bookings().filter(b =>
        [RepairStatus.IN_PROGRESS, RepairStatus.WAITING_FOR_PARTS, RepairStatus.ON_HOLD, RepairStatus.QUALITY_CHECK, RepairStatus.READY_FOR_PICKUP].includes(b.status)
      ).length;
  });

  pendingCount = computed(() => {
    return this.adminData()?.metrics?.pendingIntakeCount ??
      this.bookingService.bookings().filter(b => b.status === RepairStatus.PENDING).length;
  });

  totalBookings = computed(() => {
    return this.adminData()?.metrics?.totalBookingsCount ?? this.bookingService.bookings().length;
  });

  completedCount = computed(() => {
    return this.adminData()?.metrics?.completedCount ??
      this.bookingService.bookings().filter(b => b.status === RepairStatus.DELIVERED).length;
  });

  totalCustomers = computed(() => {
    return this.adminData()?.metrics?.totalCustomersCount ?? this.customerService.customers().length;
  });

  totalMechanics = computed(() => {
    return this.adminData()?.metrics?.totalMechanicsCount ?? this.mechanicService.mechanics().length;
  });

  hydraulicBays = computed(() => {
    return this.adminData()?.metrics?.hydraulicBays ?? this.workshopSettings.hydraulicBays();
  });

  totalEstimatedRevenue = computed(() => {
    return this.adminData()?.metrics?.pipelineRevenueLkr ??
      this.bookingService.bookings().reduce((sum, b) => sum + (b.estimatedPriceLkr || 0), 0);
  });

  // Dynamic monthly SVG bars
  monthlyBars = computed(() => {
    const list = this.adminData()?.monthlyVolume ?? [
      { month: 'Jun', monthFull: 'Jun 2026', bookingsCount: 88, completedCount: 84, revenueLkr: 2450000 },
      { month: 'Jul', monthFull: 'Jul 2026', bookingsCount: 104, completedCount: 98, revenueLkr: 3120000 },
      { month: 'Aug', monthFull: 'Aug 2026', bookingsCount: 118, completedCount: 114, revenueLkr: 3840000 },
      { month: 'Sep', monthFull: 'Sep 2026', bookingsCount: 125, completedCount: 120, revenueLkr: 4050000 },
      { month: 'Oct', monthFull: 'Oct 2026', bookingsCount: 142, completedCount: 138, revenueLkr: 4680000 },
      { month: 'Nov', monthFull: 'Nov 2026', bookingsCount: 38, completedCount: 31, revenueLkr: 1290000 }
    ];

    const maxVal = Math.max(...list.map(m => Math.max(m.bookingsCount, m.completedCount)), 100);

    return list.map((item, index) => {
      const x = 65 + (index * 70);
      const bHeight = Math.max(8, Math.round((item.bookingsCount / maxVal) * 140));
      const cHeight = Math.max(8, Math.round((item.completedCount / maxVal) * 140));
      const by = 180 - bHeight;
      const cy = 180 - cHeight;

      return {
        ...item,
        bx: x,
        by,
        bHeight,
        cx: x + 24,
        cy,
        cHeight,
        textX: x + 23
      };
    });
  });

  // Dynamic category revenues
  categoryRevenue = computed(() => {
    return this.adminData()?.revenueByCategory ?? [
      { categoryName: 'Engine Diagnostics & Overhauls', percentage: 36, revenueLkr: 7104000, bookingsCount: 148 },
      { categoryName: 'General 40-Point Maintenance', percentage: 20, revenueLkr: 3885000, bookingsCount: 210 },
      { categoryName: 'Hybrid Battery Rejuvenation', percentage: 14, revenueLkr: 2242500, bookingsCount: 115 },
      { categoryName: 'Auto AC & Climate Service', percentage: 11, revenueLkr: 1617000, bookingsCount: 98 },
      { categoryName: 'Ceramic Brake & ABS Tuning', percentage: 11, revenueLkr: 1624000, bookingsCount: 112 },
      { categoryName: '3D Wheel Alignment & Tires', percentage: 8, revenueLkr: 1128000, bookingsCount: 94 }
    ];
  });

  // Today's appointments from API or local store fallback
  todayAppointments = computed(() => {
    const fromApi = this.adminData()?.todayAppointments;
    if (fromApi && fromApi.length > 0) return fromApi;

    return this.bookingService.bookings().slice(0, 5).map(b => ({
      id: b.id,
      referenceNumber: b.referenceNumber,
      customerName: b.customerName,
      vehiclePlate: b.vehicle.plateNumber,
      vehicleBrand: b.vehicle.brand,
      vehicleModel: b.vehicle.model,
      primaryService: b.serviceNames[0] || 'General Service',
      appointmentDate: b.appointmentDate,
      appointmentTime: b.appointmentTime,
      status: b.status,
      progressPercent: b.progressPercent,
      estimatedPriceLkr: b.estimatedPriceLkr
    }));
  });

  ngOnInit(): void {
    this.dashboardService.loadAdminDashboard().subscribe();
    this.bookingService.loadBookings().subscribe();
    this.customerService.loadCustomers().subscribe();
    this.mechanicService.loadMechanics().subscribe();
    this.workshopSettings.loadSettings().subscribe();
  }
}
