import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { WorkshopSettingsService } from '../../../core/services/workshop-settings.service';
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
        <div class="flex items-center gap-2">
          @if (settingsService.loading()) {
            <span class="text-xs text-neutral-400 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span> Syncing...
            </span>
          } @else {
            <span class="text-xs text-emerald-400 flex items-center gap-1.5 font-oxanium">
              <span class="w-2 h-2 rounded-full bg-emerald-500"></span> Live Connected
            </span>
          }
        </div>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      <section aria-label="Settings Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">Facility Bay</span>
          </div>
          <span class="text-xs font-bold font-oxanium text-white uppercase">{{ settingsService.facilityBay() }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Hydraulic Bays</span>
          <span class="text-base font-bold font-oxanium text-white">{{ settingsService.hydraulicBays() }} Active</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span
              class="w-2 h-2 rounded-full"
              [ngClass]="settingsService.workshopStatus() === 'Operational' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'"
            ></span>
            <span class="text-xs text-neutral-400 font-medium">Workshop Status</span>
          </div>
          <span
            class="text-xs font-bold font-oxanium uppercase"
            [ngClass]="settingsService.workshopStatus() === 'Operational' ? 'text-emerald-400' : 'text-amber-400'"
          >
            {{ settingsService.workshopStatus() }}
          </span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Alerts Engine</span>
          <span class="text-xs font-bold font-oxanium text-white uppercase">{{ settingsService.alertsEngineStatus() }}</span>
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
        </div>

        <!-- Tab Content Body -->
        <div class="md:col-span-3 p-5 sm:p-7">
          <!-- 1. General Settings -->
          @if (activeTab() === 'general') {
            <form [formGroup]="generalForm" (ngSubmit)="saveGeneralSettings()" class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Workshop Identity &amp; Location</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Public workshop details displayed on customer invoices, website public pages, and booking vouchers.</p>
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
                  <label for="wEmergency" class="text-xs font-semibold text-neutral-300 block mb-1">24/7 Breakdown Hotline</label>
                  <input id="wEmergency" type="tel" formControlName="emergencyPhone" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-mono" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="wEmail" class="text-xs font-semibold text-neutral-300 block mb-1">Public Service Email</label>
                  <input id="wEmail" type="email" formControlName="email" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="wFacility" class="text-xs font-semibold text-neutral-300 block mb-1">Facility Bay Designation</label>
                  <input id="wFacility" type="text" formControlName="facilityBay" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
              </div>

              <div>
                <label for="wAddr" class="text-xs font-semibold text-neutral-300 block mb-1">Physical Workshop Facility Address</label>
                <input id="wAddr" type="text" formControlName="address" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="wStatus" class="text-xs font-semibold text-neutral-300 block mb-1">Workshop Operating Status</label>
                  <select id="wStatus" formControlName="workshopStatus" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none cursor-pointer">
                    <option value="Operational">Operational (Accepting Intake)</option>
                    <option value="Maintenance">Maintenance (Limited Intake)</option>
                    <option value="Closed">Temporary Closure</option>
                  </select>
                </div>
                <div>
                  <label for="wAlerts" class="text-xs font-semibold text-neutral-300 block mb-1">Alerts Telemetry Display</label>
                  <input id="wAlerts" type="text" formControlName="alertsEngineStatus" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-mono" />
                </div>
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
                  {{ saving() ? 'Saving...' : 'Save General Settings' }}
                </button>
              </div>
            </form>
          }

          <!-- 2. Business Hours -->
          @if (activeTab() === 'hours') {
            <form [formGroup]="hoursForm" (ngSubmit)="saveBusinessHours()" class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Garage Operating Hours &amp; Working Days</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Defines customer appointment slot availability and technician shift hours across public pages.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="openT" class="text-xs font-semibold text-neutral-300 block mb-1">Monday - Friday Opening Time</label>
                  <input id="openT" type="time" formControlName="mondayFridayOpen" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
                <div>
                  <label for="closeT" class="text-xs font-semibold text-neutral-300 block mb-1">Monday - Friday Closing Time</label>
                  <input id="closeT" type="time" formControlName="mondayFridayClose" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="satT" class="text-xs font-semibold text-neutral-300 block mb-1">Saturday Operating Hours</label>
                  <input id="satT" type="text" formControlName="saturdayHours" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
                <div>
                  <label for="sunT" class="text-xs font-semibold text-neutral-300 block mb-1">Sunday Policy</label>
                  <input id="sunT" type="text" formControlName="sundayHours" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none" />
                </div>
              </div>

              <div>
                <label class="text-xs font-semibold text-neutral-300 block mb-2">Active Working Days:</label>
                <div class="flex flex-wrap gap-4 text-xs text-neutral-300">
                  @for (day of allWeekDays; track day) {
                    <label class="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        [checked]="isDayActive(day)"
                        (change)="toggleDay(day, $event)"
                        class="accent-[#d70006] rounded"
                      />
                      <span>{{ day }}</span>
                    </label>
                  }
                </div>
              </div>

              <div class="flex justify-end pt-3 border-t border-[#222222]">
                <button
                  type="submit"
                  [disabled]="saving()"
                  class="px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                >
                  {{ saving() ? 'Saving...' : 'Save Business Hours' }}
                </button>
              </div>
            </form>
          }

          <!-- 3. Booking Policies -->
          @if (activeTab() === 'booking') {
            <form [formGroup]="bookingForm" (ngSubmit)="saveBookingSettings()" class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Online Booking Parameters</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Configure slot allocation limits, cancellation rules, and vehicle bay capacities.</p>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="slotDur" class="text-xs font-semibold text-neutral-300 block mb-1">Standard Slot Interval</label>
                  <select id="slotDur" formControlName="slotDurationMinutes" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none cursor-pointer">
                    <option [value]="60">60 Minutes per Intake</option>
                    <option [value]="45">45 Minutes per Intake</option>
                    <option [value]="30">30 Minutes per Intake</option>
                    <option [value]="90">90 Minutes per Intake</option>
                    <option [value]="120">120 Minutes per Intake</option>
                  </select>
                </div>
                <div>
                  <label for="maxBay" class="text-xs font-semibold text-neutral-300 block mb-1">Concurrent Active Hydraulic Bays</label>
                  <input id="maxBay" type="number" formControlName="concurrentHydraulicBays" min="1" max="50" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none font-oxanium" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="cancelHrs" class="text-xs font-semibold text-neutral-300 block mb-1">Free Cancellation Window (Hours)</label>
                  <input id="cancelHrs" type="number" formControlName="freeCancellationHours" min="0" max="72" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none font-oxanium" />
                </div>
                <div>
                  <label for="advanceDays" class="text-xs font-semibold text-neutral-300 block mb-1">Maximum Advance Booking (Days)</label>
                  <input id="advanceDays" type="number" formControlName="maxAdvanceBookingDays" min="1" max="180" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none font-oxanium" />
                </div>
              </div>

              <div class="flex justify-end pt-3 border-t border-[#222222]">
                <button
                  type="submit"
                  [disabled]="saving()"
                  class="px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                >
                  {{ saving() ? 'Saving...' : 'Save Booking Settings' }}
                </button>
              </div>
            </form>
          }

          <!-- 4. Notifications & SMS -->
          @if (activeTab() === 'notifications') {
            <form [formGroup]="notificationsForm" (ngSubmit)="saveNotificationSettings()" class="space-y-4">
              <div>
                <h3 class="font-oxanium font-bold text-base text-white">Customer Dispatch &amp; Alert Settings</h3>
                <p class="text-xs text-neutral-400 mt-0.5">Configure SMS gateway and notification triggers for stage updates.</p>
              </div>

              <div class="space-y-3">
                <label class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526] flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" formControlName="automatedBookingConfirmationSms" class="mt-1 accent-[#d70006] rounded" />
                  <div>
                    <strong class="text-xs font-bold text-white block">Automated Booking Confirmation SMS</strong>
                    <p class="text-[11px] text-neutral-400 mt-0.5">Immediately send reference code and appointment date to customer phone</p>
                  </div>
                </label>

                <label class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526] flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" formControlName="technicianStatusChangeBroadcast" class="mt-1 accent-[#d70006] rounded" />
                  <div>
                    <strong class="text-xs font-bold text-white block">Technician Status Change Broadcast</strong>
                    <p class="text-[11px] text-neutral-400 mt-0.5">Notify vehicle owner when car transitions from Inspection to Bay Repair</p>
                  </div>
                </label>

                <label class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526] flex items-start gap-3 cursor-pointer">
                  <input type="checkbox" formControlName="collectionBayReadyNotification" class="mt-1 accent-[#d70006] rounded" />
                  <div>
                    <strong class="text-xs font-bold text-white block">Collection Bay Ready Notification</strong>
                    <p class="text-[11px] text-neutral-400 mt-0.5">Alert customer when final QA test passes and car is ready for handover</p>
                  </div>
                </label>
              </div>

              <div class="flex justify-end pt-3 border-t border-[#222222]">
                <button
                  type="submit"
                  [disabled]="saving()"
                  class="px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                >
                  {{ saving() ? 'Saving...' : 'Save Notification Preferences' }}
                </button>
              </div>
            </form>
          }
        </div>
      </div>
    </div>
  `
})
export class AdminSettingsComponent {
  readonly toast = inject(ToastService);
  readonly settingsService = inject(WorkshopSettingsService);
  private fb = inject(FormBuilder);

  activeTab = signal<'general' | 'hours' | 'booking' | 'notifications'>('general');
  saving = this.settingsService.saving;

  readonly allWeekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  selectedDays = signal<string[]>(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

  generalForm: FormGroup = this.fb.group({
    workshopName: ['', Validators.required],
    regNumber: ['', Validators.required],
    phone: ['', Validators.required],
    emergencyPhone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    address: ['', Validators.required],
    description: [''],
    facilityBay: ['Colombo Central', Validators.required],
    workshopStatus: ['Operational', Validators.required],
    alertsEngineStatus: ['SMS & Email Live', Validators.required]
  });

  hoursForm: FormGroup = this.fb.group({
    mondayFridayOpen: ['08:00', Validators.required],
    mondayFridayClose: ['18:30', Validators.required],
    saturdayHours: ['08:00 AM - 05:00 PM', Validators.required],
    sundayHours: ['Emergency Breakdown Intake Only', Validators.required]
  });

  bookingForm: FormGroup = this.fb.group({
    slotDurationMinutes: [60, [Validators.required, Validators.min(1)]],
    concurrentHydraulicBays: [6, [Validators.required, Validators.min(1)]],
    freeCancellationHours: [4, [Validators.required, Validators.min(0)]],
    maxAdvanceBookingDays: [30, [Validators.required, Validators.min(1)]]
  });

  notificationsForm: FormGroup = this.fb.group({
    automatedBookingConfirmationSms: [true],
    technicianStatusChangeBroadcast: [true],
    collectionBayReadyNotification: [true]
  });

  constructor() {
    // Populate form controls whenever settings signal updates
    effect(() => {
      const s = this.settingsService.settings();
      if (!s) return;

      this.generalForm.patchValue({
        workshopName: s.workshopName,
        regNumber: s.regNumber,
        phone: s.phone,
        emergencyPhone: s.emergencyPhone,
        email: s.email,
        address: s.address,
        description: s.description,
        facilityBay: s.facilityBay,
        workshopStatus: s.workshopStatus,
        alertsEngineStatus: s.alertsEngineStatus
      }, { emitEvent: false });

      this.hoursForm.patchValue({
        mondayFridayOpen: s.mondayFridayOpen,
        mondayFridayClose: s.mondayFridayClose,
        saturdayHours: s.saturdayHours,
        sundayHours: s.sundayHours
      }, { emitEvent: false });

      this.selectedDays.set(s.activeWorkingDays ?? ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

      this.bookingForm.patchValue({
        slotDurationMinutes: s.slotDurationMinutes,
        concurrentHydraulicBays: s.concurrentHydraulicBays,
        freeCancellationHours: s.freeCancellationHours,
        maxAdvanceBookingDays: s.maxAdvanceBookingDays
      }, { emitEvent: false });

      this.notificationsForm.patchValue({
        automatedBookingConfirmationSms: s.automatedBookingConfirmationSms,
        technicianStatusChangeBroadcast: s.technicianStatusChangeBroadcast,
        collectionBayReadyNotification: s.collectionBayReadyNotification
      }, { emitEvent: false });
    });
  }

  isDayActive(day: string): boolean {
    return this.selectedDays().includes(day);
  }

  toggleDay(day: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    this.selectedDays.update(current => {
      if (isChecked && !current.includes(day)) {
        return [...current, day];
      } else if (!isChecked) {
        return current.filter(d => d !== day);
      }
      return current;
    });
  }

  saveGeneralSettings(): void {
    if (this.generalForm.invalid) {
      this.toast.showError('Please check all required fields in the form.');
      return;
    }

    this.settingsService.updateSettings(this.generalForm.value).subscribe({
      next: () => {
        this.toast.showSuccess('General workshop configuration saved successfully.');
      },
      error: () => {
        this.toast.showError('Failed to save general workshop configuration.');
      }
    });
  }

  saveBusinessHours(): void {
    if (this.hoursForm.invalid) {
      this.toast.showError('Please provide valid operating hours.');
      return;
    }

    const payload = {
      ...this.hoursForm.value,
      activeWorkingDays: this.selectedDays()
    };

    this.settingsService.updateSettings(payload).subscribe({
      next: () => {
        this.toast.showSuccess('Business operating hours and schedule updated.');
      },
      error: () => {
        this.toast.showError('Failed to save operating hours.');
      }
    });
  }

  saveBookingSettings(): void {
    if (this.bookingForm.invalid) {
      this.toast.showError('Please verify booking policy limits.');
      return;
    }

    this.settingsService.updateSettings(this.bookingForm.value).subscribe({
      next: () => {
        this.toast.showSuccess('Booking policies and hydraulic bay capacity updated.');
      },
      error: () => {
        this.toast.showError('Failed to update booking policies.');
      }
    });
  }

  saveNotificationSettings(): void {
    this.settingsService.updateSettings(this.notificationsForm.value).subscribe({
      next: () => {
        this.toast.showSuccess('Customer SMS and notification dispatch preferences saved.');
      },
      error: () => {
        this.toast.showError('Failed to update notification preferences.');
      }
    });
  }
}
