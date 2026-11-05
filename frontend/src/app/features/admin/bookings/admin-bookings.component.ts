import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingService } from '../../../core/services/booking.service';
import { MechanicService } from '../../../core/services/mechanic.service';
import { ToastService } from '../../../core/services/toast.service';
import { Booking, BookingStatus, RepairStatus } from '../../../core/models/booking.model';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, StatusBadgeComponent, IconComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Consistent Title Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Bookings &amp; <span class="text-[#d70006]">Repairs</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Comprehensive workshop scheduling, technician bay allocation, and live telemetry tracking.
          </p>
        </div>
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
          <span class="text-xs text-neutral-400 font-medium">Pending Intake</span>
          <span class="text-base font-bold font-oxanium text-amber-400">{{ pendingCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Quality Check</span>
          <span class="text-base font-bold font-oxanium text-white">{{ qualityCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Total Bookings</span>
          <span class="text-base font-bold font-oxanium text-white">{{ allBookings().length }}</span>
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
            placeholder="Search reference, client name, plate..."
            class="flex-1 bg-transparent border-none text-white text-xs sm:text-sm outline-none placeholder:text-neutral-500 font-mono"
          />
          @if (searchQuery()) {
            <button class="text-neutral-400 hover:text-white p-0.5 cursor-pointer" (click)="searchQuery.set('')">
              <app-icon name="x" [size]="14" />
            </button>
          }
        </div>

        <!-- Filter Pills matching dashboard -->
        <div class="flex items-center p-0.5 rounded-lg bg-[#141314] border border-[#222222] overflow-x-auto scrollbar-none">
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === 'ALL' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set('ALL')"
          >
            All ({{ allBookings().length }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === RepairStatus.PENDING ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set(RepairStatus.PENDING)"
          >
            Pending ({{ pendingCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === RepairStatus.CONFIRMED ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set(RepairStatus.CONFIRMED)"
          >
            Confirmed ({{ confirmedCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === RepairStatus.IN_PROGRESS ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set(RepairStatus.IN_PROGRESS)"
          >
            In Progress ({{ inProgressCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === RepairStatus.QUALITY_CHECK ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set(RepairStatus.QUALITY_CHECK)"
          >
            Quality Check ({{ qualityCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === RepairStatus.READY_FOR_PICKUP ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set(RepairStatus.READY_FOR_PICKUP)"
          >
            Ready ({{ readyCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === RepairStatus.DELIVERED ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set(RepairStatus.DELIVERED)"
          >
            Delivered ({{ completedCount() }})
          </button>
        </div>
      </section>

      <!-- 4. Bookings Data Table -->
      @if (filteredBookings().length > 0) {
        <div class="bg-[#141314] border border-[#222222] rounded-xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr class="border-b border-[#222222] text-[10px] font-bold uppercase font-oxanium text-neutral-400 bg-[#100e0f]">
                  <th class="py-3 px-4">Booking Ref</th>
                  <th class="py-3 px-4">Client Contact</th>
                  <th class="py-3 px-4">Vehicle Details</th>
                  <th class="py-3 px-4">Services</th>
                  <th class="py-3 px-4">Intake Slot</th>
                  <th class="py-3 px-4">Bay Telemetry</th>
                  <th class="py-3 px-4">Est. Cost</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1e1c1d]">
                @for (b of filteredBookings(); track b.id) {
                  <tr class="hover:bg-[#181717] transition-colors">
                    <td class="py-3 px-4">
                      <span class="font-mono font-bold text-[#d70006] text-xs">{{ b.referenceNumber }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <strong class="text-white text-xs block">{{ b.customerName }}</strong>
                      <span class="text-[10px] text-neutral-400">{{ b.customerPhone }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <span class="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c1b1c] text-neutral-300 border border-[#2d2c2d]">
                        {{ b.vehicle.plateNumber }}
                      </span>
                      <div class="text-[10px] text-neutral-400 mt-0.5">{{ b.vehicle.brand }} {{ b.vehicle.model }} ({{ b.vehicle.year }})</div>
                    </td>
                    <td class="py-3 px-4 max-w-[200px]">
                      <span class="text-xs text-neutral-300 line-clamp-1">{{ b.serviceNames.join(', ') }}</span>
                    </td>
                    <td class="py-3 px-4">
                      <div class="text-xs font-medium text-white">{{ b.appointmentDate }}</div>
                      <div class="text-[10px] text-neutral-400">{{ b.appointmentTime }}</div>
                    </td>
                    <td class="py-3 px-4">
                      <div class="space-y-1">
                        <app-status-badge [status]="b.status" />
                        <div class="flex items-center gap-1.5 text-[10px] text-neutral-400">
                          <div class="w-12 h-1.5 rounded-full bg-[#1c1b1c] overflow-hidden">
                            <div class="h-full bg-gradient-to-r from-red-600 to-[#d70006] rounded-full" [style.width.%]="b.progressPercent"></div>
                          </div>
                          <span class="font-oxanium font-semibold text-white">{{ b.progressPercent }}%</span>
                        </div>
                        @if (b.assignedMechanicName && b.assignedMechanicName !== 'To Be Assigned') {
                          <div class="text-[10px] text-neutral-400 truncate max-w-[130px] flex items-center gap-1">
                            <app-icon name="user" [size]="10" strokeColor="#878f97" />
                            <span>{{ b.assignedMechanicName }}</span>
                          </div>
                        }
                      </div>
                    </td>
                    <td class="py-3 px-4 font-oxanium font-bold text-white text-xs">
                      LKR {{ b.estimatedPriceLkr | number }}
                    </td>
                    <td class="py-3 px-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <a
                          [routerLink]="['/customer/track-repair']"
                          [queryParams]="{ ref: b.referenceNumber }"
                          target="_blank"
                          class="px-2.5 py-1 rounded-md bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
                          title="View Live Customer Telemetry"
                        >
                          <app-icon name="activity" [size]="13" strokeColor="#d70006" />
                          <span class="hidden sm:inline">Track</span>
                        </a>
                        <button
                          type="button"
                          class="px-2.5 py-1 rounded-md bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
                          (click)="openDetailsModal(b)"
                          title="View Booking Details"
                        >
                          <app-icon name="eye" [size]="13" />
                          <span>Details</span>
                        </button>
                        <button
                          type="button"
                          class="px-2.5 py-1 rounded-md bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors flex items-center gap-1 cursor-pointer"
                          (click)="openEditModal(b)"
                          title="Edit Booking & Bay Telemetry"
                        >
                          <app-icon name="edit" [size]="13" />
                          <span>Edit</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      } @else {
        <app-empty-state
          icon="calendar"
          title="No Matching Bookings Found"
          description="Try adjusting your status filter or clearing your search term."
          actionLabel="Clear Filters"
          (action)="resetFilters()"
        />
      }

      <!-- Detailed Booking Modal -->
      @if (selectedBooking(); as modal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeDetailsModal()">
          <div class="w-full max-w-2xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">ADMIN MANAGEMENT</span>
                <h3 class="text-xl font-bold font-oxanium text-white tracking-wide mt-0.5">{{ modal.referenceNumber }}</h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeDetailsModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <!-- Live Telemetry Banner (matching Track Repair style) -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <span class="w-2 h-2 rounded-full bg-[#d70006] animate-pulse"></span>
                    <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-oxanium">Live Bay Telemetry &amp; Progress</span>
                  </div>
                  <span class="px-2 py-0.5 rounded text-xs font-bold font-oxanium text-[#d70006] bg-[#141314] border border-[#262526]">
                    {{ modal.progressPercent }}% Complete
                  </span>
                </div>
                <div class="w-full h-2 rounded-full bg-[#141314] border border-[#262526] overflow-hidden">
                  <div class="h-full bg-gradient-to-r from-red-600 to-[#d70006] rounded-full transition-all duration-500" [style.width.%]="modal.progressPercent"></div>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
                  <div>
                    <span class="text-neutral-500 block text-[10px] uppercase font-oxanium">Bay Handover Estimate</span>
                    <span class="text-white font-medium font-oxanium">{{ modal.estimatedCompletion || 'Under diagnostic intake' }}</span>
                  </div>
                  <div>
                    <span class="text-neutral-500 block text-[10px] uppercase font-oxanium">Assigned Specialist</span>
                    <span class="text-white font-medium font-oxanium flex items-center gap-1.5">
                      <app-icon name="user" [size]="12" strokeColor="#d70006" />
                      {{ modal.assignedMechanicName || 'To Be Assigned' }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- Quick State Progression Bar with Diagnostics Note -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-oxanium block">Progress Repair Lifecycle:</span>
                <div class="flex flex-wrap gap-2">
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    [ngClass]="modal.status === RepairStatus.PENDING ? 'bg-[#d70006] text-white' : 'bg-[#141314] text-neutral-300 border border-[#262526]'"
                    (click)="updateStatus(modal.id, RepairStatus.PENDING)"
                  >
                    1. Pending
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    [ngClass]="modal.status === RepairStatus.CONFIRMED ? 'bg-[#d70006] text-white' : 'bg-[#141314] text-neutral-300 border border-[#262526]'"
                    (click)="updateStatus(modal.id, RepairStatus.CONFIRMED)"
                  >
                    2. Confirmed
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    [ngClass]="modal.status === RepairStatus.IN_PROGRESS ? 'bg-[#d70006] text-white' : 'bg-[#141314] text-neutral-300 border border-[#262526]'"
                    (click)="updateStatus(modal.id, RepairStatus.IN_PROGRESS)"
                  >
                    3. In Progress
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    [ngClass]="modal.status === RepairStatus.WAITING_FOR_PARTS ? 'bg-[#d70006] text-white' : 'bg-[#141314] text-neutral-300 border border-[#262526]'"
                    (click)="updateStatus(modal.id, RepairStatus.WAITING_FOR_PARTS)"
                  >
                    4. Waiting Parts
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    [ngClass]="modal.status === RepairStatus.QUALITY_CHECK ? 'bg-[#d70006] text-white' : 'bg-[#141314] text-neutral-300 border border-[#262526]'"
                    (click)="updateStatus(modal.id, RepairStatus.QUALITY_CHECK)"
                  >
                    5. Quality QA
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    [ngClass]="modal.status === RepairStatus.READY_FOR_PICKUP ? 'bg-[#d70006] text-white' : 'bg-[#141314] text-neutral-300 border border-[#262526]'"
                    (click)="updateStatus(modal.id, RepairStatus.READY_FOR_PICKUP)"
                  >
                    6. Ready
                  </button>
                  <button
                    type="button"
                    class="px-2.5 py-1 rounded-md text-xs font-semibold cursor-pointer transition-colors"
                    [ngClass]="modal.status === RepairStatus.DELIVERED ? 'bg-emerald-600 text-white' : 'bg-[#141314] text-neutral-300 border border-[#262526]'"
                    (click)="updateStatus(modal.id, RepairStatus.DELIVERED)"
                  >
                    7. Delivered
                  </button>
                </div>

                <!-- Quick Diagnostic Note to send with status progression -->
                <div class="pt-2 border-t border-[#262526]">
                  <label for="quickDiagNote" class="text-[10px] font-semibold text-neutral-400 block mb-1">
                    Bay Progression Diagnosis Note (Synchronized to customer Track Repair telemetry):
                  </label>
                  <input
                    id="quickDiagNote"
                    type="text"
                    [ngModel]="quickNote()"
                    (ngModelChange)="quickNote.set($event)"
                    placeholder="e.g. Brake rotors turned and new ceramic pads seated. Ready for road test."
                    class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3 py-1.5 text-xs text-white outline-none transition-colors"
                  />
                </div>
              </div>

              <!-- Overview Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1.5">
                  <h4 class="flex items-center gap-2 font-oxanium font-bold text-xs uppercase tracking-wider text-white mb-2">
                    <app-icon name="user" [size]="14" strokeColor="#d70006" /> Customer Information
                  </h4>
                  <div class="text-sm font-bold text-white">{{ modal.customerName }}</div>
                  <div class="text-xs text-neutral-400">Phone: {{ modal.customerPhone }}</div>
                  <div class="text-xs text-neutral-400">Email: {{ modal.customerEmail }}</div>
                </div>

                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1.5">
                  <h4 class="flex items-center gap-2 font-oxanium font-bold text-xs uppercase tracking-wider text-white mb-2">
                    <app-icon name="car" [size]="14" strokeColor="#d70006" /> Vehicle Specs
                  </h4>
                  <div class="text-sm font-bold text-white">{{ modal.vehicle.brand }} {{ modal.vehicle.model }} ({{ modal.vehicle.year }})</div>
                  <div class="text-xs text-neutral-400">Plate: <span class="text-white font-mono font-bold">{{ modal.vehicle.plateNumber }}</span></div>
                  <div class="text-xs text-neutral-400">Mileage: {{ modal.vehicle.mileageKm | number }} km</div>
                </div>
              </div>

              <!-- Services Breakdown -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-white mb-2.5">Requested Services</h4>
                <div class="flex flex-wrap gap-1.5">
                  @for (s of modal.serviceNames; track s) {
                    <span class="px-2.5 py-1 rounded-md bg-[#141314] border border-[#262526] text-xs font-medium text-neutral-300">{{ s }}</span>
                  }
                </div>
              </div>

              <!-- Diagnostic Notes -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-2">
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-white">Customer Symptoms &amp; Notes</h4>
                <p class="text-xs text-neutral-300 leading-relaxed">{{ modal.problemDescription || 'No customer symptoms recorded.' }}</p>
              </div>

              @if (modal.internalNotes) {
                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-2">
                  <div class="flex items-center gap-2">
                    <app-icon name="file-text" [size]="14" strokeColor="#d70006" />
                    <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-white">Technician Bay Log &amp; Diagnosis Notes</h4>
                  </div>
                  <p class="text-xs text-neutral-300 leading-relaxed whitespace-pre-line">{{ modal.internalNotes }}</p>
                </div>
              }
            </div>

            <div class="flex items-center justify-between gap-3 px-6 py-4 border-t border-[#222222] bg-[#0c0a0a]">
              <div class="flex items-center gap-2">
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
                  target="_blank"
                  class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                >
                  <app-icon name="external-link" [size]="13" />
                  <span>Customer Telemetry View</span>
                </a>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
                (click)="openEditModal(modal)"
              >
                <app-icon name="edit" [size]="14" />
                <span>Edit Booking</span>
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Edit Booking Modal -->
      @if (editingBooking(); as editModal) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeEditModal()">
          <div class="w-full max-w-2xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">BOOKING &amp; TELEMETRY MODIFICATION</span>
                <h3 class="text-xl font-bold font-oxanium text-white tracking-wide mt-0.5">Edit {{ editModal.referenceNumber }}</h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeEditModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <form [formGroup]="editForm" (ngSubmit)="saveEditBooking()" class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <!-- Bay Telemetry & Repair Lifecycle Section -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                <div class="flex items-center justify-between">
                  <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-neutral-300 flex items-center gap-1.5">
                    <app-icon name="activity" [size]="14" strokeColor="#d70006" />
                    Workshop Bay Telemetry &amp; Technician
                  </h4>
                  <span class="text-[10px] text-[#d70006] font-mono">Real-time sync to Track Repair</span>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="bStatus" class="text-xs font-semibold text-neutral-400 block mb-1">Repair Stage Status <span class="text-[#d70006]">*</span></label>
                    <select
                      id="bStatus"
                      formControlName="status"
                      (change)="onStatusSelected($any($event.target).value)"
                      class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors cursor-pointer"
                    >
                      <option [value]="RepairStatus.PENDING">1. Pending Intake (10%)</option>
                      <option [value]="RepairStatus.CONFIRMED">2. Confirmed &amp; Scheduled (25%)</option>
                      <option [value]="RepairStatus.IN_PROGRESS">3. In Progress (Bay Work) (50%)</option>
                      <option [value]="RepairStatus.WAITING_FOR_PARTS">4. Waiting for Parts (60%)</option>
                      <option [value]="RepairStatus.ON_HOLD">5. On Hold (60%)</option>
                      <option [value]="RepairStatus.QUALITY_CHECK">6. Quality QA Inspection (80%)</option>
                      <option [value]="RepairStatus.READY_FOR_PICKUP">7. Ready for Collection (95%)</option>
                      <option [value]="RepairStatus.DELIVERED">8. Delivered / Handed Over (100%)</option>
                      <option [value]="RepairStatus.CANCELLED">Cancelled (0%)</option>
                    </select>
                  </div>

                  <div>
                    <div class="flex items-center justify-between mb-1">
                      <label for="bProg" class="text-xs font-semibold text-neutral-400">Progress Milestone</label>
                      <span class="text-[#d70006] font-bold font-oxanium text-xs">{{ editForm.get('progressPercent')?.value }}% Complete</span>
                    </div>
                    <div class="flex items-center gap-3">
                      <input
                        id="bProg"
                        type="range"
                        formControlName="progressPercent"
                        min="0"
                        max="100"
                        step="5"
                        class="flex-1 accent-[#d70006] cursor-pointer"
                      />
                      <input
                        type="number"
                        formControlName="progressPercent"
                        min="0"
                        max="100"
                        class="w-16 bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-2 py-1.5 text-center text-white text-xs font-oxanium font-bold outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="bEstComp" class="text-xs font-semibold text-neutral-400 block mb-1">Bay Estimated Handover</label>
                    <input
                      id="bEstComp"
                      type="text"
                      formControlName="estimatedCompletion"
                      placeholder="e.g. Today, 4:30 PM or Ready for Collection"
                      class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label for="bMechanic" class="text-xs font-semibold text-neutral-400 block mb-1">Assigned Specialist Technician</label>
                    <select
                      id="bMechanic"
                      formControlName="assignedMechanicId"
                      (change)="onMechanicSelected($any($event.target).value)"
                      class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors cursor-pointer"
                    >
                      <option value="">To Be Assigned</option>
                      @for (mech of mechanics(); track mech.id) {
                        <option [value]="mech.id">
                          {{ mech.name }} ({{ mech.specialization }}) - {{ mech.status }}
                        </option>
                      }
                    </select>
                  </div>
                </div>
              </div>

              <!-- Schedule Section -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-neutral-300">Intake Schedule</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="bDate" class="text-xs font-semibold text-neutral-400 block mb-1">Appointment Date <span class="text-[#d70006]">*</span></label>
                    <input id="bDate" type="date" formControlName="appointmentDate" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label for="bTime" class="text-xs font-semibold text-neutral-400 block mb-1">Appointment Time Slot <span class="text-[#d70006]">*</span></label>
                    <input id="bTime" type="text" formControlName="appointmentTime" placeholder="e.g. 09:00 AM" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                </div>
              </div>

              <!-- Customer & Contact -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-neutral-300">Customer Contact</h4>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label for="bPhone" class="text-xs font-semibold text-neutral-400 block mb-1">Phone Number <span class="text-[#d70006]">*</span></label>
                    <input id="bPhone" type="tel" formControlName="customerPhone" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label for="bEmail" class="text-xs font-semibold text-neutral-400 block mb-1">Email Address <span class="text-[#d70006]">*</span></label>
                    <input id="bEmail" type="email" formControlName="customerEmail" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                </div>
              </div>

              <!-- Vehicle Specs -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-neutral-300">Vehicle Specifications</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label for="vPlate" class="text-xs font-semibold text-neutral-400 block mb-1">License Plate <span class="text-[#d70006]">*</span></label>
                    <input id="vPlate" type="text" formControlName="plateNumber" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors font-mono uppercase" />
                  </div>
                  <div>
                    <label for="vBrand" class="text-xs font-semibold text-neutral-400 block mb-1">Brand <span class="text-[#d70006]">*</span></label>
                    <input id="vBrand" type="text" formControlName="brand" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label for="vModel" class="text-xs font-semibold text-neutral-400 block mb-1">Model <span class="text-[#d70006]">*</span></label>
                    <input id="vModel" type="text" formControlName="model" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                </div>
                <div>
                  <label for="vMileage" class="text-xs font-semibold text-neutral-400 block mb-1">Current Mileage (km)</label>
                  <input id="vMileage" type="number" formControlName="mileageKm" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors font-oxanium" />
                </div>
              </div>

              <!-- Pricing & Financials -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                <h4 class="font-oxanium font-bold text-xs uppercase tracking-wider text-neutral-300">Financials &amp; Drop-Off</h4>
                <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label for="bEst" class="text-xs font-semibold text-neutral-400 block mb-1">Estimated Cost (LKR) <span class="text-[#d70006]">*</span></label>
                    <input id="bEst" type="number" formControlName="estimatedPriceLkr" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors font-oxanium" />
                  </div>
                  <div>
                    <label for="bFinal" class="text-xs font-semibold text-neutral-400 block mb-1">Final Settled (LKR)</label>
                    <input id="bFinal" type="number" formControlName="finalPriceLkr" placeholder="Optional" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors font-oxanium" />
                  </div>
                  <div>
                    <label for="bPay" class="text-xs font-semibold text-neutral-400 block mb-1">Payment Status <span class="text-[#d70006]">*</span></label>
                    <select id="bPay" formControlName="paymentStatus" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors cursor-pointer">
                      <option value="pending">Pending</option>
                      <option value="partially_paid">Partially Paid</option>
                      <option value="paid">Paid in Full</option>
                      <option value="refunded">Refunded</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label for="bDrop" class="text-xs font-semibold text-neutral-400 block mb-1">Intake Drop-Off Preference <span class="text-[#d70006]">*</span></label>
                  <select id="bDrop" formControlName="dropOffOption" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors cursor-pointer">
                    <option value="drop_off">Leave Vehicle at Workshop Bay</option>
                    <option value="wait_at_lounge">Customer Waits in VIP Lounge</option>
                  </select>
                </div>
              </div>

              <!-- Notes & Description -->
              <div class="space-y-3">
                <div>
                  <label for="bProb" class="text-xs font-semibold text-neutral-400 block mb-1">Symptoms &amp; Problem Description</label>
                  <textarea id="bProb" rows="2" formControlName="problemDescription" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl p-3 text-white text-xs sm:text-sm outline-none transition-colors"></textarea>
                </div>
                <div>
                  <div class="flex items-center justify-between mb-1">
                    <label for="bNotes" class="text-xs font-semibold text-neutral-400">Technician Bay Log &amp; Diagnosis Notes</label>
                    <span class="text-[10px] text-neutral-500">Visible on Customer Track Repair</span>
                  </div>
                  <textarea id="bNotes" rows="3" formControlName="internalNotes" placeholder="Technician notes, diagnostic measurements, parts status..." class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl p-3 text-white text-xs sm:text-sm outline-none transition-colors"></textarea>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-4 py-2 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                  (click)="closeEditModal()"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="editForm.invalid"
                  class="px-4 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save Booking &amp; Telemetry
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminBookingsComponent implements OnInit {
  private bookingService = inject(BookingService);
  private mechanicService = inject(MechanicService);
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  RepairStatus = RepairStatus;
  allBookings = this.bookingService.bookings;
  mechanics = this.mechanicService.mechanics;

  searchQuery = signal<string>('');
  statusFilter = signal<string>('ALL');
  quickNote = signal<string>('');

  selectedBooking = signal<Booking | null>(null);
  editingBooking = signal<Booking | null>(null);

  pendingCount = computed(() => this.allBookings().filter(b => b.status === RepairStatus.PENDING).length);
  confirmedCount = computed(() => this.allBookings().filter(b => b.status === RepairStatus.CONFIRMED).length);
  inProgressCount = computed(() => this.allBookings().filter(b =>
    b.status === RepairStatus.IN_PROGRESS ||
    b.status === RepairStatus.WAITING_FOR_PARTS ||
    b.status === RepairStatus.ON_HOLD
  ).length);
  qualityCount = computed(() => this.allBookings().filter(b => b.status === RepairStatus.QUALITY_CHECK).length);
  readyCount = computed(() => this.allBookings().filter(b => b.status === RepairStatus.READY_FOR_PICKUP).length);
  completedCount = computed(() => this.allBookings().filter(b => b.status === RepairStatus.DELIVERED).length);

  editForm: FormGroup = this.fb.group({
    appointmentDate: ['', Validators.required],
    appointmentTime: ['', Validators.required],
    estimatedPriceLkr: [0, [Validators.required, Validators.min(0)]],
    finalPriceLkr: [null],
    paymentStatus: ['pending', Validators.required],
    status: [RepairStatus.PENDING, Validators.required],
    progressPercent: [10, [Validators.required, Validators.min(0), Validators.max(100)]],
    estimatedCompletion: [''],
    assignedMechanicId: [''],
    assignedMechanicName: [''],
    plateNumber: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    mileageKm: [0],
    dropOffOption: ['drop_off', Validators.required],
    customerPhone: ['', Validators.required],
    customerEmail: ['', [Validators.required, Validators.email]],
    problemDescription: [''],
    internalNotes: ['']
  });

  ngOnInit(): void {
    this.bookingService.loadBookings().subscribe();
    this.mechanicService.loadMechanics().subscribe();
  }

  filteredBookings = computed(() => {
    let list = this.allBookings();
    const st = this.statusFilter();
    const q = this.searchQuery().toLowerCase().trim();

    if (st !== 'ALL') {
      list = list.filter(b => b.status === st);
    }

    if (q) {
      list = list.filter(b =>
        b.referenceNumber.toLowerCase().includes(q) ||
        b.customerName.toLowerCase().includes(q) ||
        b.vehicle.plateNumber.toLowerCase().includes(q) ||
        b.vehicle.model.toLowerCase().includes(q) ||
        b.serviceNames.some(s => s.toLowerCase().includes(q))
      );
    }

    return list;
  });

  onStatusSelected(newStatus: string): void {
    let defaultPercent = 10;
    let defaultEstimate = this.editForm.get('estimatedCompletion')?.value || '';
    switch (newStatus) {
      case RepairStatus.PENDING:
        defaultPercent = 10;
        break;
      case RepairStatus.CONFIRMED:
        defaultPercent = 25;
        break;
      case RepairStatus.IN_PROGRESS:
        defaultPercent = 50;
        break;
      case RepairStatus.WAITING_FOR_PARTS:
      case RepairStatus.ON_HOLD:
        defaultPercent = 60;
        break;
      case RepairStatus.QUALITY_CHECK:
        defaultPercent = 80;
        break;
      case RepairStatus.READY_FOR_PICKUP:
        defaultPercent = 95;
        defaultEstimate = 'Ready for Collection';
        break;
      case RepairStatus.DELIVERED:
        defaultPercent = 100;
        defaultEstimate = 'Completed';
        break;
      case RepairStatus.CANCELLED:
        defaultPercent = 0;
        break;
    }

    this.editForm.patchValue({
      progressPercent: defaultPercent,
      estimatedCompletion: defaultEstimate
    });
  }

  onMechanicSelected(mechanicId: string): void {
    if (!mechanicId) {
      this.editForm.patchValue({ assignedMechanicId: '', assignedMechanicName: '' });
      return;
    }
    const mech = this.mechanics().find(m => m.id === mechanicId);
    if (mech) {
      this.editForm.patchValue({
        assignedMechanicId: mech.id,
        assignedMechanicName: mech.name
      });
    }
  }

  updateStatus(bookingId: string, status: RepairStatus): void {
    const note = this.quickNote().trim();
    this.bookingService.updateBookingStatus(bookingId, status, note || undefined).subscribe({
      next: (updated) => {
        if (this.selectedBooking()?.id === bookingId) {
          this.selectedBooking.set(updated);
        }
        this.quickNote.set('');
        this.toast.showSuccess(`Progressed status to ${status.replace('_', ' ')}.`);
      },
      error: (err) => {
        this.toast.showError(err?.error?.message || 'Failed to update status.');
      }
    });
  }

  openDetailsModal(booking: Booking): void {
    this.selectedBooking.set(booking);
  }

  closeDetailsModal(): void {
    this.selectedBooking.set(null);
  }

  openEditModal(b: Booking): void {
    this.editingBooking.set(b);
    this.editForm.patchValue({
      appointmentDate: b.appointmentDate,
      appointmentTime: b.appointmentTime,
      estimatedPriceLkr: b.estimatedPriceLkr,
      finalPriceLkr: b.finalPriceLkr ?? null,
      paymentStatus: b.paymentStatus,
      status: b.status,
      progressPercent: b.progressPercent ?? 10,
      estimatedCompletion: b.estimatedCompletion || '',
      assignedMechanicId: b.assignedMechanicId || '',
      assignedMechanicName: b.assignedMechanicName || '',
      plateNumber: b.vehicle.plateNumber,
      brand: b.vehicle.brand,
      model: b.vehicle.model,
      mileageKm: b.vehicle.mileageKm || 0,
      dropOffOption: b.dropOffOption,
      customerPhone: b.customerPhone,
      customerEmail: b.customerEmail,
      problemDescription: b.problemDescription || '',
      internalNotes: b.internalNotes || ''
    });
  }

  closeEditModal(): void {
    this.editingBooking.set(null);
  }

  saveEditBooking(): void {
    if (this.editForm.invalid) return;
    const b = this.editingBooking();
    if (!b) return;

    const val = this.editForm.value;
    const updates: Partial<Booking> = {
      appointmentDate: val.appointmentDate,
      appointmentTime: val.appointmentTime,
      estimatedPriceLkr: Number(val.estimatedPriceLkr),
      finalPriceLkr: val.finalPriceLkr !== null && val.finalPriceLkr !== '' ? Number(val.finalPriceLkr) : undefined,
      paymentStatus: val.paymentStatus,
      status: val.status,
      progressPercent: Number(val.progressPercent),
      estimatedCompletion: val.estimatedCompletion,
      assignedMechanicId: val.assignedMechanicId || undefined,
      assignedMechanicName: val.assignedMechanicName || undefined,
      vehicle: {
        ...b.vehicle,
        plateNumber: val.plateNumber,
        brand: val.brand,
        model: val.model,
        mileageKm: Number(val.mileageKm)
      },
      dropOffOption: val.dropOffOption,
      customerPhone: val.customerPhone,
      customerEmail: val.customerEmail,
      problemDescription: val.problemDescription,
      internalNotes: val.internalNotes
    };

    this.bookingService.updateBooking(b.id, updates).subscribe({
      next: (updated) => {
        if (this.selectedBooking()?.id === b.id) {
          this.selectedBooking.set(updated);
        }
        this.toast.showSuccess(`Booking ${b.referenceNumber} updated with bay telemetry.`);
        this.closeEditModal();
      },
      error: (err) => {
        this.toast.showError(err?.error?.message || 'Failed to update booking.');
      }
    });
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('ALL');
  }
}
