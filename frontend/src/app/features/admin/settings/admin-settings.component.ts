import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Workshop <span class="text-[#d70006]">Settings</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Configure garage operating rules, hydraulic bay hours, booking policies, and administrative security.
          </p>
        </div>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      <section aria-label="Settings Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">Facility Bay</span>
          </div>
          <span class="text-xs font-bold font-oxanium text-white uppercase">Colombo Central</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Hydraulic Bays</span>
          <span class="text-base font-bold font-oxanium text-white">6 Active</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs text-neutral-400 font-medium">Workshop Status</span>
          </div>
          <span class="text-xs font-bold font-oxanium text-emerald-400 uppercase">Operational</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Alerts Engine</span>
          <span class="text-xs font-bold font-oxanium text-white uppercase">SMS &amp; Email Live</span>
        </div>
      </section>

      <!-- 3. Settings Multi-tab Container -->
      <div class="bg-[#141314] border border-[#222222] rounded-xl overflow-hidden shadow-xl grid grid-cols-1 md:grid-cols-4">
        <!-- Sidebar Tabs -->
        <div class="border-b md:border-b-0 md:border-r border-[#222222] bg-[#100e0f] p-2.5 flex flex-row md:flex-col gap-1 overflow-x-auto">
          <button
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1a1919] transition-all cursor-pointer shrink-0"
            [ngClass]="activeTab() === 'general' ? '!text-[#d70006] !bg-[#d70006]/10 font-bold' : ''"
            (click)="activeTab.set('general')"
          >
            <app-icon name="tool" [size]="15" />
            <span>General Workshop</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1a1919] transition-all cursor-pointer shrink-0"
            [ngClass]="activeTab() === 'hours' ? '!text-[#d70006] !bg-[#d70006]/10 font-bold' : ''"
            (click)="activeTab.set('hours')"
          >
            <app-icon name="clock" [size]="15" />
            <span>Operating Hours</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1a1919] transition-all cursor-pointer shrink-0"
            [ngClass]="activeTab() === 'booking' ? '!text-[#d70006] !bg-[#d70006]/10 font-bold' : ''"
            (click)="activeTab.set('booking')"
          >
            <app-icon name="calendar" [size]="15" />
            <span>Booking Policies</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1a1919] transition-all cursor-pointer shrink-0"
            [ngClass]="activeTab() === 'notifications' ? '!text-[#d70006] !bg-[#d70006]/10 font-bold' : ''"
            (click)="activeTab.set('notifications')"
          >
            <app-icon name="bell" [size]="15" />
            <span>Alerts &amp; SMS</span>
          </button>

          <button
            type="button"
            class="flex items-center gap-2.5 px-3.5 py-2.5 rounded-lg text-xs font-semibold text-neutral-400 hover:text-white hover:bg-[#1a1919] transition-all cursor-pointer shrink-0"
            [ngClass]="activeTab() === 'profile' ? '!text-[#d70006] !bg-[#d70006]/10 font-bold' : ''"
            (click)="activeTab.set('profile')"
          >
            <app-icon name="user" [size]="15" />
            <span>Admin Profile</span>
          </button>
        </div>

        <!-- Tab Content Body -->
        <div class="md:col-span-3 p-5 sm:p-7">
          <!-- 1. General Settings -->
          @if (activeTab() === 'general') {
            <form [formGroup]="generalForm" (ngSubmit)="saveGeneralSettings()" class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Workshop Identity &amp; Location</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Public workshop details displayed on customer invoices and booking vouchers.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="wName" class="text-xs font-semibold text-neutral-300 block mb-1">Workshop Brand Name</label>
                  <input id="wName" type="text" formControlName="workshopName" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="wReg" class="text-xs font-semibold text-neutral-300 block mb-1">Business Registration Number (Sri Lanka)</label>
                  <input id="wReg" type="text" formControlName="regNumber" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-mono" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="wPhone" class="text-xs font-semibold text-neutral-300 block mb-1">Primary Reception Phone (+94)</label>
                  <input id="wPhone" type="tel" formControlName="phone" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-mono" />
                </div>
                <div>
                  <label for="wEmail" class="text-xs font-semibold text-neutral-300 block mb-1">Public Service Email</label>
                  <input id="wEmail" type="email" formControlName="email" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label for="wAddr" class="text-xs font-semibold text-neutral-300 block mb-1">Physical Workshop Facility Address</label>
                <input id="wAddr" type="text" formControlName="address" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
              </div>

              <div>
                <label for="wDesc" class="text-xs font-semibold text-neutral-300 block mb-1">Workshop Mission Statement / Intro</label>
                <textarea id="wDesc" rows="3" formControlName="description" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl p-3.5 text-white text-xs sm:text-sm outline-none transition-colors"></textarea>
              </div>

              <div class="flex justify-end pt-3 border-t border-[#222222]">
                <button
                  type="submit"
                  [disabled]="saving()"
                  class="px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                >
                  Save General Settings
                </button>
              </div>
            </form>
          }

          <!-- 2. Business Hours -->
          @if (activeTab() === 'hours') {
            <div class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Garage Operating Hours &amp; Working Days</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Defines customer appointment slot availability and technician shift hours.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="openT" class="text-xs font-semibold text-neutral-300 block mb-1">Monday - Friday Opening Time</label>
                  <input id="openT" type="time" value="08:00" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
                <div>
                  <label for="closeT" class="text-xs font-semibold text-neutral-300 block mb-1">Monday - Friday Closing Time</label>
                  <input id="closeT" type="time" value="18:30" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="satT" class="text-xs font-semibold text-neutral-300 block mb-1">Saturday Operating Hours</label>
                  <input id="satT" type="text" value="08:00 AM - 05:00 PM" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
                <div>
                  <label for="sunT" class="text-xs font-semibold text-neutral-300 block mb-1">Sunday Policy</label>
                  <input id="sunT" type="text" value="Emergency Breakdown Intake Only" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
              </div>

              <div>
                <label class="text-xs font-semibold text-neutral-300 block mb-2">Active Working Days:</label>
                <div class="flex flex-wrap gap-4 text-xs text-neutral-300">
                  <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked class="accent-[#d70006] rounded" /> Monday</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked class="accent-[#d70006] rounded" /> Tuesday</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked class="accent-[#d70006] rounded" /> Wednesday</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked class="accent-[#d70006] rounded" /> Thursday</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked class="accent-[#d70006] rounded" /> Friday</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked class="accent-[#d70006] rounded" /> Saturday</label>
                  <label class="flex items-center gap-2 cursor-pointer"><input type="checkbox" class="accent-[#d70006] rounded" /> Sunday (Special)</label>
                </div>
              </div>

              <div class="flex justify-end pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
                  (click)="saveGeneric('Operating hours saved.')"
                >
                  Save Business Hours
                </button>
              </div>
            </div>
          }

          <!-- 3. Booking Policies -->
          @if (activeTab() === 'booking') {
            <div class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Online Booking Parameters</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Configure slot allocation limits, cancellation rules, and vehicle bay capacities.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="slotDur" class="text-xs font-semibold text-neutral-300 block mb-1">Standard Slot Interval</label>
                  <select id="slotDur" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none cursor-pointer">
                    <option value="60">60 Minutes per Intake</option>
                    <option value="45">45 Minutes per Intake</option>
                    <option value="30">30 Minutes per Intake</option>
                  </select>
                </div>
                <div>
                  <label for="maxBay" class="text-xs font-semibold text-neutral-300 block mb-1">Concurrent Active Hydraulic Bays</label>
                  <input id="maxBay" type="number" value="6" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none font-oxanium" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="cancelHrs" class="text-xs font-semibold text-neutral-300 block mb-1">Free Cancellation Window (Hours)</label>
                  <input id="cancelHrs" type="number" value="4" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none font-oxanium" />
                </div>
                <div>
                  <label for="advanceDays" class="text-xs font-semibold text-neutral-300 block mb-1">Maximum Advance Booking (Days)</label>
                  <input id="advanceDays" type="number" value="30" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none font-oxanium" />
                </div>
              </div>

              <div class="flex justify-end pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
                  (click)="saveGeneric('Booking rules updated.')"
                >
                  Save Booking Settings
                </button>
              </div>
            </div>
          }

          <!-- 4. Notifications & SMS -->
          @if (activeTab() === 'notifications') {
            <div class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Customer Dispatch &amp; Alert Settings</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Configure SMS gateway and notification triggers for stage updates.</p>
              </div>

              <div class="space-y-3">
                <label class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526] flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked class="mt-1 accent-[#d70006] rounded" />
                  <div>
                    <strong class="text-xs font-bold text-white block">Automated Booking Confirmation SMS</strong>
                    <p class="text-[11px] text-neutral-400 mt-0.5">Immediately send reference code and appointment date to customer phone</p>
                  </div>
                </label>

                <label class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526] flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked class="mt-1 accent-[#d70006] rounded" />
                  <div>
                    <strong class="text-xs font-bold text-white block">Technician Status Change Broadcast</strong>
                    <p class="text-[11px] text-neutral-400 mt-0.5">Notify vehicle owner when car transitions from Inspection to Bay Repair</p>
                  </div>
                </label>

                <label class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526] flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" checked class="mt-1 accent-[#d70006] rounded" />
                  <div>
                    <strong class="text-xs font-bold text-white block">Collection Bay Ready Notification</strong>
                    <p class="text-[11px] text-neutral-400 mt-0.5">Alert customer when final QA test passes and car is ready for handover</p>
                  </div>
                </label>
              </div>

              <div class="flex justify-end pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
                  (click)="saveGeneric('Notification dispatch updated.')"
                >
                  Save Notification Preferences
                </button>
              </div>
            </div>
          }

          <!-- 5. Admin Profile -->
          @if (activeTab() === 'profile') {
            <div class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Administrator Profile &amp; Credentials</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Director and master supervisor account settings.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="adName" class="text-xs font-semibold text-neutral-300 block mb-1">Admin Name</label>
                  <input id="adName" type="text" [value]="adminUser()?.name" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
                <div>
                  <label for="adEmail" class="text-xs font-semibold text-neutral-300 block mb-1">Admin Login Email</label>
                  <input id="adEmail" type="email" [value]="adminUser()?.email" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="adRole" class="text-xs font-semibold text-neutral-300 block mb-1">System Security Role</label>
                  <input id="adRole" type="text" value="Super Administrator (Workshop HQ)" disabled class="w-full bg-[#141314] border border-[#262526] rounded-xl px-3.5 py-2.5 text-neutral-500 text-xs sm:text-sm outline-none cursor-not-allowed" />
                </div>
                <div>
                  <label for="adBay" class="text-xs font-semibold text-neutral-300 block mb-1">Supervisory Station</label>
                  <input id="adBay" type="text" value="Colombo Central Engineering Control" disabled class="w-full bg-[#141314] border border-[#262526] rounded-xl px-3.5 py-2.5 text-neutral-500 text-xs sm:text-sm outline-none cursor-not-allowed" />
                </div>
              </div>

              <div class="flex justify-end pt-3 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
                  (click)="saveGeneric('Admin profile synchronized.')"
                >
                  Save Profile
                </button>
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `
})
export class AdminSettingsComponent {
  private authService = inject(AuthService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  activeTab = signal<'general' | 'hours' | 'booking' | 'notifications' | 'profile'>('general');
  saving = signal<boolean>(false);
  adminUser = this.authService.currentUser;

  generalForm: FormGroup = this.fb.group({
    workshopName: ['Garagix Auto Care HQ', Validators.required],
    regNumber: ['PV-124991-LK', Validators.required],
    phone: ['+94 11 234 5678', Validators.required],
    email: ['service@garagix.lk', [Validators.required, Validators.email]],
    address: ['No. 45/A, Nawala Road, Nugegoda, Colombo, Sri Lanka', Validators.required],
    description: ['Premier automotive engineering and computerized diagnostic center specializing in Japanese, European, and Hybrid vehicles.']
  });

  saveGeneralSettings(): void {
    this.saving.set(true);
    setTimeout(() => {
      this.saving.set(false);
      this.toast.showSuccess('General workshop configuration saved.');
    }, 600);
  }

  saveGeneric(msg: string): void {
    this.toast.showSuccess(msg);
  }
}
