import { Component, ChangeDetectionStrategy, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer.service';
import { BookingService } from '../../../core/services/booking.service';
import { ToastService } from '../../../core/services/toast.service';
import { User } from '../../../core/models/user.model';
import { Vehicle } from '../../../core/models/vehicle.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-admin-customers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent, StatusBadgeComponent, EmptyStateComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent & Quick Actions -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Customer <span class="text-[#d70006]">Directory</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            View registered garage vehicle owners, booking history, and active fleet profiles.
          </p>
        </div>
        <button
          type="button"
          class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 self-start sm:self-auto cursor-pointer"
          (click)="openAddModal()"
        >
          <app-icon name="plus" [size]="14" />
          <span>Register Client</span>
        </button>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      <section aria-label="Customers Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">Registered Clients</span>
          </div>
          <span class="text-base font-bold font-oxanium text-white">{{ customers().length }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs text-neutral-400 font-medium">Active Clients</span>
          </div>
          <span class="text-base font-bold font-oxanium text-emerald-400">{{ activeCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Inactive</span>
          <span class="text-base font-bold font-oxanium text-white">{{ inactiveCount() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Total Bookings</span>
          <span class="text-base font-bold font-oxanium text-white">{{ totalBookingsCount() }}</span>
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
            placeholder="Search customer name, email, or telephone (+94)..."
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
            [ngClass]="statusFilter() === 'ALL' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set('ALL')"
          >
            All ({{ customers().length }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === 'active' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set('active')"
          >
            Active ({{ activeCount() }})
          </button>
          <button
            type="button"
            class="px-2.5 py-1 rounded-md text-xs font-semibold transition-colors cursor-pointer shrink-0"
            [ngClass]="statusFilter() === 'inactive' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
            (click)="statusFilter.set('inactive')"
          >
            Inactive ({{ inactiveCount() }})
          </button>
        </div>
      </section>

      <!-- 4. Customers Table -->
      @if (filteredCustomers().length > 0) {
        <div class="bg-[#141314] border border-[#222222] rounded-xl overflow-hidden shadow-xl">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-sm text-neutral-300">
              <thead>
                <tr class="border-b border-[#222222] text-[10px] font-bold uppercase font-oxanium text-neutral-400 bg-[#100e0f]">
                  <th class="py-3 px-4">Client</th>
                  <th class="py-3 px-4">Contact Phone</th>
                  <th class="py-3 px-4">Residential Address</th>
                  <th class="py-3 px-4">Member Since</th>
                  <th class="py-3 px-4">Bookings</th>
                  <th class="py-3 px-4">Status</th>
                  <th class="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-[#1e1c1d]">
                @for (c of filteredCustomers(); track c.id) {
                  <tr class="hover:bg-[#181717] transition-colors">
                    <td class="py-3 px-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 rounded-full bg-[#201517] border border-[#d70006]/30 flex items-center justify-center shrink-0 text-[#d70006] font-bold text-xs font-oxanium">
                          {{ c.name.charAt(0) }}
                        </div>
                        <div>
                          <strong class="text-white text-xs block font-oxanium">{{ c.name }}</strong>
                          <span class="text-[10px] text-neutral-400">{{ c.email }}</span>
                        </div>
                      </div>
                    </td>
                    <td class="py-3 px-4 text-xs font-mono">{{ c.phone }}</td>
                    <td class="py-3 px-4 text-xs text-neutral-400 max-w-[200px] truncate">
                      {{ c.address || 'Colombo, Sri Lanka' }}
                    </td>
                    <td class="py-3 px-4 text-xs">{{ (c.createdAt | date:'MMMM yyyy') || 'N/A' }}</td>
                    <td class="py-3 px-4">
                      <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1c1b1c] text-neutral-300 border border-[#262526]">
                        {{ c.totalBookings || 0 }} bookings
                      </span>
                    </td>
                    <td class="py-3 px-4">
                      <button
                        type="button"
                        class="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider cursor-pointer transition-colors"
                        [ngClass]="c.status === 'active' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'bg-red-500/15 text-red-400 border border-red-500/30'"
                        (click)="toggleStatus(c)"
                        title="Click to toggle active/inactive status"
                      >
                        {{ c.status }}
                      </button>
                    </td>
                    <td class="py-3 px-4 text-right">
                      <div class="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          class="px-2.5 py-1 rounded-md bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                          (click)="viewCustomerDetails(c)"
                          title="Inspect full client dossier"
                        >
                          <app-icon name="eye" [size]="13" />
                          <span>Inspect</span>
                        </button>
                        <button
                          type="button"
                          class="p-1 rounded-md bg-[#1c1b1c] hover:bg-[#252425] text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors inline-flex items-center cursor-pointer"
                          (click)="openEditModal(c)"
                          title="Edit client information"
                        >
                          <app-icon name="edit" [size]="13" />
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
          icon="user"
          title="No Customers Found"
          description="Try adjusting your search criteria."
          actionLabel="Clear Filter"
          (action)="resetFilters()"
        />
      }

      <!-- Inspect Customer Details Modal -->
      @if (selectedCustomer(); as cust) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeModal()">
          <div class="w-full max-w-2xl bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div class="flex items-center gap-3">
                <div class="w-11 h-11 rounded-full bg-[#201517] border border-[#d70006]/40 flex items-center justify-center shrink-0 text-[#d70006] font-bold text-sm font-oxanium">
                  {{ cust.name.charAt(0) }}
                </div>
                <div>
                  <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">GARAGE CLIENT PROFILE</span>
                  <h3 class="text-lg font-bold font-oxanium text-white">{{ cust.name }}</h3>
                </div>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <div class="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1.5 text-xs">
                  <div class="flex items-center justify-between pb-2 border-b border-[#262526]">
                    <h4 class="font-oxanium font-bold text-white uppercase tracking-wider text-xs">Contact Information</h4>
                    <button
                      type="button"
                      class="text-[11px] text-[#d70006] hover:underline font-semibold cursor-pointer"
                      (click)="closeModal(); openEditModal(cust)"
                    >
                      Edit Profile
                    </button>
                  </div>
                  <div class="text-neutral-400">Email: <strong class="text-white">{{ cust.email }}</strong></div>
                  <div class="text-neutral-400">Phone: <strong class="text-white font-mono">{{ cust.phone }}</strong></div>
                  <div class="text-neutral-400">Address: <strong class="text-white">{{ cust.address || 'N/A' }}</strong></div>
                  <div class="text-neutral-400">Status: <strong class="text-emerald-400 uppercase">{{ cust.status }}</strong></div>
                  <div class="text-neutral-400">Registered: <strong class="text-white">{{ (cust.createdAt | date:'MMMM yyyy') || 'N/A' }}</strong></div>
                </div>

                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-2 text-xs">
                  <div class="flex items-center justify-between pb-2 border-b border-[#262526]">
                    <h4 class="font-oxanium font-bold text-white uppercase tracking-wider text-xs">Registered Vehicles</h4>
                    <button
                      type="button"
                      class="text-[11px] text-[#d70006] hover:underline font-semibold cursor-pointer"
                      (click)="openAddVehicleModal(cust)"
                    >
                      + Add Vehicle
                    </button>
                  </div>
                  <div class="space-y-2">
                    @for (v of customerVehicles(); track v.id) {
                      <div class="p-2.5 rounded-lg bg-[#141314] border border-[#262526] flex items-center justify-between">
                        <div>
                          <span class="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#1c1b1c] text-neutral-300 border border-[#2d2c2d] mb-1">
                            {{ v.plateNumber }}
                          </span>
                          <div class="text-xs font-bold text-white font-oxanium">{{ v.brand }} {{ v.model }} ({{ v.year }})</div>
                          <div class="text-[10px] text-neutral-500">{{ v.type }} &bull; {{ v.color || 'Standard' }}</div>
                        </div>
                        <button
                          type="button"
                          class="p-1 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                          (click)="deleteVehicle(v)"
                          title="Remove vehicle"
                        >
                          <app-icon name="trash" [size]="13" />
                        </button>
                      </div>
                    } @empty {
                      <div class="text-neutral-500 text-xs py-2">No vehicles registered yet.</div>
                    }
                  </div>
                </div>
              </div>

              <!-- Customer Booking History -->
              <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                <h4 class="font-oxanium font-bold text-white uppercase tracking-wider text-xs pb-2 border-b border-[#262526]">Service &amp; Repair History</h4>
                <div class="overflow-x-auto">
                  <table class="w-full text-left text-xs text-neutral-300">
                    <thead>
                      <tr class="border-b border-[#262526] text-[10px] font-bold uppercase font-oxanium text-neutral-400">
                        <th class="py-2 px-2">Reference</th>
                        <th class="py-2 px-2">Vehicle</th>
                        <th class="py-2 px-2">Service</th>
                        <th class="py-2 px-2">Date</th>
                        <th class="py-2 px-2">Status</th>
                        <th class="py-2 px-2 text-right">Cost</th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-[#262526]">
                      @for (b of customerBookings(); track b.id) {
                        <tr>
                          <td class="py-2.5 px-2 font-mono font-bold text-[#d70006]">{{ b.referenceNumber }}</td>
                          <td class="py-2.5 px-2 font-mono">{{ b.vehicle.plateNumber }}</td>
                          <td class="py-2.5 px-2">{{ b.serviceNames[0] }}</td>
                          <td class="py-2.5 px-2">{{ b.appointmentDate }}</td>
                          <td class="py-2.5 px-2"><app-status-badge [status]="b.status" /></td>
                          <td class="py-2.5 px-2 font-oxanium font-bold text-white text-right">LKR {{ b.estimatedPriceLkr | number }}</td>
                        </tr>
                      } @empty {
                        <tr>
                          <td colspan="6" class="py-4 text-center text-neutral-500">No previous service bookings recorded.</td>
                        </tr>
                      }
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div class="flex items-center justify-end px-6 py-4 border-t border-[#222222] bg-[#0c0a0a]">
              <button
                type="button"
                class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                (click)="closeModal()"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      }

      <!-- Add / Register Client Modal -->
      @if (showAddModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeAddModal()">
          <div class="w-full max-w-lg bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">CLIENT REGISTRATION</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">
                  Register New Client
                </h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeAddModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <form [formGroup]="addCustomerForm" (ngSubmit)="saveNewCustomer()" class="p-6 space-y-4">
              <div>
                <label for="cName" class="text-xs font-semibold text-neutral-300 block mb-1">Full Name <span class="text-[#d70006]">*</span></label>
                <input id="cName" type="text" formControlName="name" placeholder="e.g. Ruwan Wickramasinghe" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="cEmail" class="text-xs font-semibold text-neutral-300 block mb-1">Email Address <span class="text-[#d70006]">*</span></label>
                  <input id="cEmail" type="email" formControlName="email" placeholder="client@example.lk" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="cPhone" class="text-xs font-semibold text-neutral-300 block mb-1">Phone Number <span class="text-[#d70006]">*</span></label>
                  <input id="cPhone" type="text" formControlName="phone" placeholder="+94 77 123 4567" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-mono" />
                </div>
              </div>

              <div>
                <label for="cAddress" class="text-xs font-semibold text-neutral-300 block mb-1">Residential Address</label>
                <input id="cAddress" type="text" formControlName="address" placeholder="e.g. No. 12, High Level Road, Nugegoda" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                  (click)="closeAddModal()"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="addCustomerForm.invalid || isSubmitting()"
                  class="px-4 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {{ isSubmitting() ? 'Registering...' : 'Register Client' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Edit Client Profile Modal -->
      @if (editingCustomer(); as cust) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeEditModal()">
          <div class="w-full max-w-lg bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">PROFILE MANAGEMENT</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">
                  Edit {{ cust.name }}
                </h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeEditModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <form [formGroup]="editCustomerForm" (ngSubmit)="saveEditCustomer()" class="p-6 space-y-4">
              <div>
                <label for="eName" class="text-xs font-semibold text-neutral-300 block mb-1">Full Name <span class="text-[#d70006]">*</span></label>
                <input id="eName" type="text" formControlName="name" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="ePhone" class="text-xs font-semibold text-neutral-300 block mb-1">Phone Number <span class="text-[#d70006]">*</span></label>
                  <input id="ePhone" type="text" formControlName="phone" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-mono" />
                </div>
                <div>
                  <label for="eStatus" class="text-xs font-semibold text-neutral-300 block mb-1">Account Status <span class="text-[#d70006]">*</span></label>
                  <select id="eStatus" formControlName="status" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors cursor-pointer">
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div>
                <label for="eAddress" class="text-xs font-semibold text-neutral-300 block mb-1">Residential Address</label>
                <input id="eAddress" type="text" formControlName="address" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                  (click)="closeEditModal()"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="editCustomerForm.invalid || isSubmitting()"
                  class="px-4 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {{ isSubmitting() ? 'Saving...' : 'Save Profile' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      <!-- Add Vehicle to Customer Modal -->
      @if (customerForVehicle(); as cust) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="closeAddVehicleModal()">
          <div class="w-full max-w-lg bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">FLEET ENROLLMENT</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">
                  Add Vehicle for {{ cust.name }}
                </h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="closeAddVehicleModal()" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <form [formGroup]="vehicleForm" (ngSubmit)="saveVehicleForCustomer()" class="p-6 space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="vPlate" class="text-xs font-semibold text-neutral-300 block mb-1">Plate Number <span class="text-[#d70006]">*</span></label>
                  <input id="vPlate" type="text" formControlName="plateNumber" placeholder="WP CAA-1234" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors uppercase font-mono" />
                </div>
                <div>
                  <label for="vBrand" class="text-xs font-semibold text-neutral-300 block mb-1">Brand / Make <span class="text-[#d70006]">*</span></label>
                  <input id="vBrand" type="text" formControlName="brand" placeholder="e.g. Toyota" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div class="sm:col-span-2">
                  <label for="vModel" class="text-xs font-semibold text-neutral-300 block mb-1">Model <span class="text-[#d70006]">*</span></label>
                  <input id="vModel" type="text" formControlName="model" placeholder="e.g. Prius Hybrid" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="vYear" class="text-xs font-semibold text-neutral-300 block mb-1">Year <span class="text-[#d70006]">*</span></label>
                  <input id="vYear" type="number" formControlName="year" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-oxanium" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="vType" class="text-xs font-semibold text-neutral-300 block mb-1">Vehicle Type <span class="text-[#d70006]">*</span></label>
                  <select id="vType" formControlName="type" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors cursor-pointer">
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Van">Van</option>
                    <option value="Coupe">Coupe</option>
                    <option value="Truck">Truck</option>
                  </select>
                </div>
                <div>
                  <label for="vColor" class="text-xs font-semibold text-neutral-300 block mb-1">Body Color</label>
                  <input id="vColor" type="text" formControlName="color" placeholder="e.g. Pearl White" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                  (click)="closeAddVehicleModal()"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="vehicleForm.invalid || isSubmitting()"
                  class="px-4 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  {{ isSubmitting() ? 'Adding...' : 'Add Vehicle' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class AdminCustomersComponent implements OnInit {
  private customerService = inject(CustomerService);
  private bookingService = inject(BookingService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  customers = this.customerService.customers;
  allBookings = this.bookingService.bookings;

  ngOnInit(): void {
    this.customerService.loadCustomers().subscribe();
  }

  searchQuery = signal<string>('');
  statusFilter = signal<string>('ALL');

  selectedCustomer = signal<User | null>(null);
  editingCustomer = signal<User | null>(null);
  showAddModal = signal<boolean>(false);
  customerForVehicle = signal<User | null>(null);
  isSubmitting = signal<boolean>(false);

  activeCount = computed(() => this.customers().filter(c => c.status === 'active').length);
  inactiveCount = computed(() => this.customers().filter(c => c.status === 'inactive').length);
  totalBookingsCount = computed(() => this.allBookings().length);

  addCustomerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required],
    address: ['']
  });

  editCustomerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    address: [''],
    status: ['active', Validators.required]
  });

  vehicleForm: FormGroup = this.fb.group({
    plateNumber: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: [2020, [Validators.required, Validators.min(1970)]],
    type: ['Sedan', Validators.required],
    color: ['Pearl White']
  });

  filteredCustomers = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.statusFilter();

    return this.customers().filter(c => {
      const matchStatus = st === 'ALL' || c.status === st;
      const matchQ = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q);
      return matchStatus && matchQ;
    });
  });

  customerVehicles = computed(() => {
    const c = this.selectedCustomer();
    if (!c) return [];
    return this.customerService.getCustomerVehicles(c.id);
  });

  customerBookings = computed(() => {
    const c = this.selectedCustomer();
    if (!c) return [];
    return this.bookingService.getCustomerBookings(c.id);
  });

  toggleStatus(c: User): void {
    this.customerService.toggleCustomerStatus(c.id).subscribe({
      next: (updated) => {
        this.toast.showSuccess(`Customer ${updated.name} status updated to ${updated.status}.`);
      },
      error: () => {
        this.toast.showError(`Failed to update ${c.name}'s status.`);
      }
    });
  }

  viewCustomerDetails(c: User): void {
    this.selectedCustomer.set(c);
    // Fetch live vehicles from backend API
    this.customerService.loadCustomerVehicles(c.id).subscribe();
  }

  closeModal(): void {
    this.selectedCustomer.set(null);
  }

  openAddModal(): void {
    this.addCustomerForm.reset({
      name: '',
      email: '',
      phone: '',
      address: ''
    });
    this.showAddModal.set(true);
  }

  closeAddModal(): void {
    this.showAddModal.set(false);
  }

  saveNewCustomer(): void {
    if (this.addCustomerForm.invalid) return;
    this.isSubmitting.set(true);

    this.customerService.createCustomer(this.addCustomerForm.value).subscribe({
      next: (created) => {
        this.toast.showSuccess(`Registered ${created.name} to customer directory.`);
        this.isSubmitting.set(false);
        this.closeAddModal();
      },
      error: (err) => {
        const msg = err.error?.message || 'Failed to register client.';
        this.toast.showError(msg);
        this.isSubmitting.set(false);
      }
    });
  }

  openEditModal(c: User): void {
    this.editingCustomer.set(c);
    this.editCustomerForm.reset({
      name: c.name,
      phone: c.phone,
      address: c.address || '',
      status: c.status || 'active'
    });
  }

  closeEditModal(): void {
    this.editingCustomer.set(null);
  }

  saveEditCustomer(): void {
    const cust = this.editingCustomer();
    if (!cust || this.editCustomerForm.invalid) return;
    this.isSubmitting.set(true);

    this.customerService.updateCustomer(cust.id, this.editCustomerForm.value).subscribe({
      next: (updated) => {
        this.toast.showSuccess(`Updated ${updated.name}'s profile.`);
        this.isSubmitting.set(false);
        this.closeEditModal();
        if (this.selectedCustomer()?.id === cust.id) {
          this.selectedCustomer.set(updated);
        }
      },
      error: () => {
        this.toast.showError('Failed to update customer profile.');
        this.isSubmitting.set(false);
      }
    });
  }

  openAddVehicleModal(cust: User): void {
    this.customerForVehicle.set(cust);
    this.vehicleForm.reset({
      plateNumber: '',
      brand: '',
      model: '',
      year: 2021,
      type: 'Sedan',
      color: 'Pearl White'
    });
  }

  closeAddVehicleModal(): void {
    this.customerForVehicle.set(null);
  }

  saveVehicleForCustomer(): void {
    const cust = this.customerForVehicle();
    if (!cust || this.vehicleForm.invalid) return;
    this.isSubmitting.set(true);

    const val = this.vehicleForm.value;
    this.customerService.addVehicle({
      customerId: cust.id,
      plateNumber: val.plateNumber.toUpperCase(),
      brand: val.brand,
      model: val.model,
      year: Number(val.year),
      type: val.type,
      color: val.color
    }).subscribe({
      next: (created) => {
        this.toast.showSuccess(`Added vehicle ${created.plateNumber} for ${cust.name}.`);
        this.isSubmitting.set(false);
        this.closeAddVehicleModal();
      },
      error: () => {
        this.toast.showError('Failed to register vehicle on server.');
        this.isSubmitting.set(false);
      }
    });
  }

  deleteVehicle(v: Vehicle): void {
    this.customerService.removeVehicle(v.id, v.customerId).subscribe({
      next: () => {
        this.toast.showInfo(`Removed ${v.plateNumber} from vehicle list.`);
      },
      error: () => {
        this.toast.showError('Failed to remove vehicle on server.');
      }
    });
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.statusFilter.set('ALL');
  }
}
