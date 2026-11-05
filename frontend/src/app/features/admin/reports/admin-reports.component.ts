import { Component, ChangeDetectionStrategy, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportService } from '../../../core/services/report.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-reports',
  standalone: true,
  imports: [CommonModule, FormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent & Actions -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Workshop <span class="text-[#d70006]">Intelligence &amp; Reports</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Operational throughput, revenue trends (LKR), technician efficiency, and diagnostic volumes.
          </p>
        </div>

        <div class="flex items-center gap-2 self-start sm:self-auto">
          <button
            type="button"
            class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
            (click)="exportCsv()"
          >
            <app-icon name="download" [size]="14" />
            <span>Export CSV</span>
          </button>
          <button
            type="button"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
            (click)="printReport()"
          >
            <app-icon name="printer" [size]="14" />
            <span>Print</span>
          </button>
        </div>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      <section aria-label="Financial Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">Gross Billing (MTD)</span>
          </div>
          <span class="text-base font-bold font-oxanium text-[#d70006] truncate max-w-[130px]">LKR {{ summary().totalRevenueLkr | number }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Avg Work Order</span>
          <span class="text-base font-bold font-oxanium text-white">LKR {{ summary().averageRepairCostLkr | number }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs text-neutral-400 font-medium">Completion Rate</span>
          </div>
          <span class="text-base font-bold font-oxanium text-emerald-400">95.1%</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Bay Utilization</span>
          <span class="text-base font-bold font-oxanium text-white">96.8%</span>
        </div>
      </section>

      <!-- 3. Period & Category Filter Bar -->
      <section class="bg-[#141314] border border-[#222222] rounded-xl p-3.5 sm:p-4 flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3">
          <div class="flex items-center gap-2">
            <label for="repPeriod" class="text-xs font-semibold text-neutral-300">Period:</label>
            <select
              id="repPeriod"
              [(ngModel)]="selectedPeriod"
              (ngModelChange)="onPeriodChange()"
              class="bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-lg px-3 py-1.5 text-white text-xs outline-none cursor-pointer"
            >
              <option value="last_6_months">Last 6 Months (May - Nov 2026)</option>
              <option value="q3_2026">Q3 2026 (Jul - Sep)</option>
              <option value="year_to_date">Year-To-Date (2026)</option>
            </select>
          </div>

          <div class="flex items-center gap-2">
            <label for="repCat" class="text-xs font-semibold text-neutral-300">Focus:</label>
            <select
              id="repCat"
              [(ngModel)]="reportCategory"
              class="bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-lg px-3 py-1.5 text-white text-xs outline-none cursor-pointer"
            >
              <option value="ALL">Complete Workshop Overview</option>
              <option value="REVENUE">Revenue &amp; Financials</option>
              <option value="OPERATIONS">Bay Throughput &amp; Mechanics</option>
            </select>
          </div>
        </div>

        <div class="flex items-center gap-2 text-xs text-neutral-400">
          <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>Live Database Telemetry Verified</span>
        </div>
      </section>

      <!-- 4. Charts & Visual Analytics Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <!-- Monthly Revenue Chart -->
        <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#222222]">
            <div>
              <h3 class="font-oxanium font-bold text-white text-sm uppercase tracking-wider">Monthly Gross Revenue Trajectory (LKR)</h3>
              <p class="text-xs text-neutral-400 mt-0.5">Steady revenue expansion with hybrid powertrain services</p>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1c1b1c] text-[#d70006] border border-[#262526] font-oxanium uppercase">Financials</span>
          </div>

          <div class="w-full overflow-hidden">
            <svg viewBox="0 0 500 200" class="w-full h-auto">
              <line x1="40" y1="20" x2="480" y2="20" stroke="#222222" stroke-dasharray="4" />
              <line x1="40" y1="70" x2="480" y2="70" stroke="#222222" stroke-dasharray="4" />
              <line x1="40" y1="120" x2="480" y2="120" stroke="#222222" stroke-dasharray="4" />
              <line x1="40" y1="170" x2="480" y2="170" stroke="#262526" />

              <text x="10" y="25" fill="#64748b" font-size="10">5M</text>
              <text x="10" y="75" fill="#64748b" font-size="10">3.5M</text>
              <text x="10" y="125" fill="#64748b" font-size="10">2M</text>
              <text x="20" y="175" fill="#64748b" font-size="10">0</text>

              <polyline
                fill="none"
                stroke="#d70006"
                stroke-width="3"
                points="70,110 140,95 210,75 280,68 350,52 420,40"
              />
              <circle cx="70" cy="110" r="4" fill="#ffffff" stroke="#d70006" stroke-width="2" />
              <circle cx="140" cy="95" r="4" fill="#ffffff" stroke="#d70006" stroke-width="2" />
              <circle cx="210" cy="75" r="4" fill="#ffffff" stroke="#d70006" stroke-width="2" />
              <circle cx="280" cy="68" r="4" fill="#ffffff" stroke="#d70006" stroke-width="2" />
              <circle cx="350" cy="52" r="4" fill="#ffffff" stroke="#d70006" stroke-width="2" />
              <circle cx="420" cy="40" r="4" fill="#ffffff" stroke="#d70006" stroke-width="2" />

              <text x="70" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">Jun</text>
              <text x="140" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">Jul</text>
              <text x="210" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">Aug</text>
              <text x="280" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">Sep</text>
              <text x="350" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">Oct</text>
              <text x="420" y="190" fill="#94a3b8" font-size="11" text-anchor="middle">Nov</text>
            </svg>
          </div>
        </div>

        <!-- Service Demand Breakdown -->
        <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-4">
          <div class="flex items-center justify-between pb-3 border-b border-[#222222]">
            <div>
              <h3 class="font-oxanium font-bold text-white text-sm uppercase tracking-wider">Service Line Demand &amp; Turnover</h3>
              <p class="text-xs text-neutral-400 mt-0.5">Volume ranking of customer-requested service packages</p>
            </div>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Top Performers</span>
          </div>

          <div class="space-y-3.5 pt-1">
            @for (srv of summary().topServices; track srv.serviceName) {
              <div>
                <div class="flex justify-between text-xs mb-1">
                  <span class="text-white font-medium">{{ srv.serviceName }}</span>
                  <span class="font-oxanium font-bold text-[#d70006]">LKR {{ srv.revenueLkr | number }}</span>
                </div>
                <div class="w-full h-2 rounded-full bg-[#1c1b1c] overflow-hidden mb-1">
                  <div class="h-full bg-[#d70006] rounded-full" [style.width.%]="srv.percentage"></div>
                </div>
                <div class="flex justify-between text-[10px] text-neutral-400">
                  <span>{{ srv.bookingsCount }} jobs completed</span>
                  <span>{{ srv.percentage }}% of total volume</span>
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      <!-- 5. Technician Productivity & Bay Workload Table -->
      <section class="bg-[#141314] border border-[#222222] rounded-xl overflow-hidden shadow-xl">
        <div class="p-5 border-b border-[#222222]">
          <h3 class="font-oxanium font-bold text-white text-sm uppercase tracking-wider">Technician Efficiency &amp; Bay Turnaround</h3>
          <p class="text-xs text-neutral-400 mt-0.5">Individual master mechanic turnaround time, completed repair counts, and QA rating.</p>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm text-neutral-300">
            <thead>
              <tr class="border-b border-[#222222] text-[10px] font-bold uppercase font-oxanium text-neutral-400 bg-[#100e0f]">
                <th class="py-3 px-4">Master Technician</th>
                <th class="py-3 px-4">Specialization Discipline</th>
                <th class="py-3 px-4">Active Bay Repairs</th>
                <th class="py-3 px-4">Jobs Completed</th>
                <th class="py-3 px-4">QA Score</th>
                <th class="py-3 px-4 text-right">Productivity Rating</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-[#1e1c1d]">
              @for (m of summary().mechanicWorkloads; track m.mechanicId) {
                <tr class="hover:bg-[#181717] transition-colors">
                  <td class="py-3 px-4 font-bold text-white text-xs font-oxanium">{{ m.mechanicName }}</td>
                  <td class="py-3 px-4 text-xs text-neutral-300">{{ m.specialization }}</td>
                  <td class="py-3 px-4 text-xs text-neutral-400">{{ m.activeRepairs }} active</td>
                  <td class="py-3 px-4 text-xs font-semibold text-white">{{ m.completedThisMonth }} completed</td>
                  <td class="py-3 px-4 font-oxanium font-bold text-emerald-400 text-xs">{{ m.efficiencyScore }}%</td>
                  <td class="py-3 px-4 text-right">
                    <span class="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                      High Efficiency
                    </span>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      </section>
    </div>
  `
})
export class AdminReportsComponent implements OnInit {
  private reportService = inject(ReportService);
  private toast = inject(ToastService);

  summary = this.reportService.summary;

  selectedPeriod = 'last_6_months';
  reportCategory = 'ALL';

  ngOnInit(): void {
    this.reportService.loadSummaryReport(this.selectedPeriod).subscribe();
  }

  onPeriodChange(): void {
    this.reportService.loadSummaryReport(this.selectedPeriod).subscribe();
  }

  exportCsv(): void {
    this.reportService.exportCsvReport(this.selectedPeriod);
    this.toast.showSuccess('Generated and downloaded CSV report.');
  }

  printReport(): void {
    window.print();
  }
}
