import { Component, ChangeDetectionStrategy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ServiceCatalogService } from '../../../core/services/service-catalog.service';
import { MechanicService } from '../../../core/services/mechanic.service';
import { ToastService } from '../../../core/services/toast.service';
import { Vehicle } from '../../../core/models/vehicle.model';
import { CarService } from '../../../core/models/service.model';
import { Mechanic } from '../../../core/models/mechanic.model';
import { Booking } from '../../../core/models/booking.model';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-book-repair',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Book <span class="text-[#d70006]">Repair</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Step-by-step automotive scheduling with certified mechanic allocation.
          </p>
        </div>
        <a
          routerLink="/customer/bookings"
          class="inline-flex items-center gap-1.5 text-xs font-semibold text-[#d70006] hover:underline self-start sm:self-auto"
        >
          <app-icon name="calendar" [size]="14" />
          <span>View Active Bookings</span>
        </a>
      </header>

      <!-- 2. Minimal Status Summary Bar (Dashboard Style) -->
      @if (!confirmedBooking()) {
        <section aria-label="Wizard Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#d70006] animate-pulse"></span>
              <span class="text-xs text-neutral-400 font-medium">Wizard Step</span>
            </div>
            <span class="text-base font-bold font-oxanium text-white">Step {{ currentStep() }}/5</span>
          </div>

          <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-neutral-400 font-medium">Target Vehicle</span>
            <span class="text-xs font-bold font-mono text-[#d70006] truncate max-w-[120px]">{{ vehiclePlateNumber() }}</span>
          </div>

          <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-neutral-400 font-medium">Services</span>
            <span class="text-base font-bold font-oxanium text-white">{{ selectedServices().length }}</span>
          </div>

          <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
            <span class="text-xs text-neutral-400 font-medium">Est. Total</span>
            <span class="text-base font-bold font-oxanium text-white">LKR {{ totalEstimatedPrice() | number }}</span>
          </div>
        </section>
      }

      <!-- 3. Step Indicator Bar (Sleek container) -->
      @if (!confirmedBooking()) {
        <div class="bg-[#141314] border border-[#222222] rounded-xl p-3 sm:p-4">
          <div class="flex items-center justify-between overflow-x-auto gap-2 scrollbar-none">
            @for (s of steps; track s.num) {
              <div
                class="flex items-center gap-2 cursor-pointer transition-opacity shrink-0"
                [ngClass]="currentStep() >= s.num ? 'opacity-100' : 'opacity-40'"
                (click)="goToStep(s.num)"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold font-oxanium transition-colors"
                  [ngClass]="{
                    'bg-[#d70006] text-white shadow-md shadow-[#d70006]/30': currentStep() === s.num,
                    'bg-emerald-500 text-white': currentStep() > s.num,
                    'bg-[#1c1b1c] text-neutral-400 border border-[#262526]': currentStep() < s.num
                  }"
                >
                  @if (currentStep() > s.num) {
                    <app-icon name="check" [size]="12" strokeColor="#ffffff" />
                  } @else {
                    <span>{{ s.num }}</span>
                  }
                </div>
                <div class="hidden sm:flex flex-col leading-tight">
                  <span class="text-[9px] uppercase tracking-wider text-neutral-500 font-bold">STEP {{ s.num }}</span>
                  <span class="text-xs font-oxanium font-bold text-white">{{ s.label }}</span>
                </div>
                @if (s.num < steps.length) {
                  <div class="w-6 sm:w-10 h-[2px] bg-[#222222] ml-2"></div>
                }
              </div>
            }
          </div>
        </div>
      }

      <!-- 4. Main Wizard Form Container -->
      <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-7">
        <!-- SUCCESS CONFIRMATION SCREEN -->
        @if (confirmedBooking(); as confirmed) {
          <div class="text-center py-4 space-y-5 max-w-2xl mx-auto">
            <div class="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
              <app-icon name="check-circle" [size]="32" strokeColor="#10b981" />
            </div>
            <div>
              <span class="text-[10px] font-bold uppercase tracking-widest text-emerald-400 font-oxanium block">BOOKING CONFIRMED</span>
              <h2 class="text-2xl font-bold font-oxanium text-white mt-1">Your Service Slot is Locked In</h2>
              <p class="text-xs text-neutral-400 mt-1 max-w-md mx-auto">
                We have reserved your intake bay at Garagix Colombo Central Bay. A confirmation notification has been dispatched.
              </p>
            </div>

            <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] text-center max-w-md mx-auto">
              <span class="text-[10px] uppercase tracking-wider text-neutral-400 font-bold block mb-1">YOUR BOOKING REFERENCE NUMBER</span>
              <div class="font-mono text-2xl sm:text-3xl font-extrabold text-[#d70006] tracking-wider">{{ confirmed.referenceNumber }}</div>
              <span class="text-[11px] text-neutral-500 mt-1 block">Keep this code to track live repair progress or call reception</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] text-xs">
              <div>
                <span class="text-[10px] uppercase text-neutral-500 block">Vehicle</span>
                <strong class="text-white font-medium">{{ confirmed.vehicle.brand }} {{ confirmed.vehicle.model }} ({{ confirmed.vehicle.plateNumber }})</strong>
              </div>
              <div>
                <span class="text-[10px] uppercase text-neutral-500 block">Appointment Time</span>
                <strong class="text-white font-medium">{{ confirmed.appointmentDate }} &bull; {{ confirmed.appointmentTime }}</strong>
              </div>
              <div>
                <span class="text-[10px] uppercase text-neutral-500 block">Selected Services</span>
                <strong class="text-white font-medium">{{ confirmed.serviceNames.join(', ') }}</strong>
              </div>
              <div>
                <span class="text-[10px] uppercase text-neutral-500 block">Workshop Bay</span>
                <strong class="text-white font-medium">Garagix Colombo Central Bay</strong>
              </div>
              <div>
                <span class="text-[10px] uppercase text-neutral-500 block">Drop-off Preference</span>
                <strong class="text-white font-medium">{{ confirmed.dropOffOption === 'drop_off' ? 'Vehicle Drop-Off' : 'Wait at Air-Conditioned Lounge' }}</strong>
              </div>
              <div>
                <span class="text-[10px] uppercase text-neutral-500 block">Booking Status</span>
                <strong class="text-emerald-400 font-oxanium font-bold text-xs uppercase">Confirmed &bull; Slot Reserved</strong>
              </div>
            </div>

            <div class="flex flex-wrap items-center justify-center gap-3 pt-3">
              <a
                [routerLink]="['/customer/track-repair']"
                [queryParams]="{ ref: confirmed.referenceNumber }"
                class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer"
              >
                <app-icon name="gauge" [size]="14" />
                <span>Track Progress Live</span>
              </a>
              <a
                routerLink="/customer/bookings"
                class="inline-flex items-center gap-2 px-4 py-2 bg-[#1c1b1c] hover:bg-[#252425] text-white border border-[#2b2a2b] hover:border-neutral-500 rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <app-icon name="calendar" [size]="14" />
                <span>View in Bookings</span>
              </a>
              <button
                class="px-3 py-2 border border-[#2b2a2b] hover:border-neutral-500 text-neutral-400 hover:text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                (click)="resetWizard()"
              >
                Book Another Vehicle
              </button>
            </div>
          </div>
        } @else {
          <!-- STEP 1: SELECT VEHICLE -->
          @if (currentStep() === 1) {
            <div class="space-y-5">
              <div>
                <h2 class="text-lg font-bold font-oxanium text-white">Step 1: Select Your Vehicle</h2>
                <p class="text-xs text-neutral-400 mt-0.5">Choose from your registered vehicles or enter a new car.</p>
              </div>

              <!-- Option Tabs: Existing vs New (Matching Dashboard Filter Pills) -->
              <div class="flex items-center p-0.5 rounded-lg bg-[#1c1b1c] border border-[#262526] w-fit">
                <button
                  type="button"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  [ngClass]="vehicleMode() === 'existing' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
                  (click)="vehicleMode.set('existing')"
                >
                  <app-icon name="car" [size]="14" />
                  <span>Choose Existing Vehicle</span>
                </button>
                <button
                  type="button"
                  class="flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-semibold transition-colors cursor-pointer"
                  [ngClass]="vehicleMode() === 'new' ? 'bg-[#222122] text-white shadow-xs' : 'text-neutral-400 hover:text-white'"
                  (click)="vehicleMode.set('new')"
                >
                  <app-icon name="plus" [size]="14" />
                  <span>Register New Vehicle</span>
                </button>
              </div>

              @if (vehicleMode() === 'existing') {
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  @for (veh of savedVehicles(); track veh.id) {
                    <div
                      class="p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3"
                      [ngClass]="selectedVehicleId() === veh.id ? 'bg-[#1e1314] border-[#d70006] shadow-sm shadow-[#d70006]/10' : 'bg-[#1c1b1c] border border-[#262526] hover:border-neutral-700'"
                      (click)="selectExistingVehicle(veh)"
                    >
                      <div class="w-4 h-4 rounded-full border flex items-center justify-center mt-1 shrink-0" [ngClass]="selectedVehicleId() === veh.id ? 'border-[#d70006]' : 'border-neutral-500'">
                        @if (selectedVehicleId() === veh.id) {
                          <div class="w-2 h-2 rounded-full bg-[#d70006]"></div>
                        }
                      </div>
                      <div class="flex-1 min-w-0">
                        <div class="flex items-center justify-between">
                          <strong class="text-sm font-bold text-white font-oxanium">{{ veh.brand }} {{ veh.model }}</strong>
                          <span class="text-xs text-neutral-400">{{ veh.year }}</span>
                        </div>
                        <span class="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#141314] text-neutral-300 border border-[#2d2c2d] mt-1.5">
                          {{ veh.plateNumber }}
                        </span>
                        <div class="text-[11px] text-neutral-400 mt-1">{{ veh.type }} &bull; {{ veh.mileageKm ? (veh.mileageKm | number) + ' km' : 'Mileage unrecorded' }}</div>
                      </div>
                    </div>
                  } @empty {
                    <div class="p-6 text-center rounded-xl bg-[#1c1b1c] border border-[#262526] col-span-full">
                      <p class="text-xs text-neutral-400">No vehicles registered in your garage profile yet.</p>
                      <button type="button" class="mt-2 text-xs text-[#d70006] hover:underline font-semibold cursor-pointer" (click)="vehicleMode.set('new')">
                        + Register a vehicle now
                      </button>
                    </div>
                  }
                </div>
              } @else {
                <!-- New Vehicle Form -->
                <form [formGroup]="newVehicleForm" class="space-y-4 max-w-2xl">
                  <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label for="plateNum" class="text-xs font-semibold text-neutral-300 block mb-1">Registration Plate <span class="text-[#d70006]">*</span></label>
                      <input id="plateNum" type="text" formControlName="plateNumber" placeholder="e.g. WP CBA-1234" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none uppercase font-mono transition-colors" />
                    </div>
                    <div>
                      <label for="brand" class="text-xs font-semibold text-neutral-300 block mb-1">Vehicle Brand / Make <span class="text-[#d70006]">*</span></label>
                      <input id="brand" type="text" formControlName="brand" placeholder="e.g. Toyota, Honda" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                    </div>
                  </div>

                  <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label for="model" class="text-xs font-semibold text-neutral-300 block mb-1">Model <span class="text-[#d70006]">*</span></label>
                      <input id="model" type="text" formControlName="model" placeholder="e.g. Prius, Vezel" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                    </div>
                    <div>
                      <label for="year" class="text-xs font-semibold text-neutral-300 block mb-1">Year <span class="text-[#d70006]">*</span></label>
                      <input id="year" type="number" formControlName="year" placeholder="e.g. 2019" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                    </div>
                    <div>
                      <label for="type" class="text-xs font-semibold text-neutral-300 block mb-1">Body Type</label>
                      <select id="type" formControlName="type" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors">
                        <option value="Sedan">Sedan</option>
                        <option value="SUV">SUV</option>
                        <option value="Hatchback">Hatchback</option>
                        <option value="Hybrid">Hybrid</option>
                        <option value="Coupe">Coupe</option>
                        <option value="Van">Van</option>
                      </select>
                    </div>
                  </div>
                </form>
              }

              <div class="flex items-center justify-end pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                  [disabled]="!canProceedStep1()"
                  (click)="nextStep()"
                >
                  <span>Continue to Step 2 (Select Services)</span>
                  <app-icon name="arrow-right" [size]="14" />
                </button>
              </div>
            </div>
          }

          <!-- STEP 2: SELECT SERVICE(S) -->
          @if (currentStep() === 2) {
            <div class="space-y-5">
              <div>
                <h2 class="text-lg font-bold font-oxanium text-white">Step 2: Select Repair &amp; Maintenance Services</h2>
                <p class="text-xs text-neutral-400 mt-0.5">Select one or multiple services needed for your vehicle.</p>
              </div>

              <!-- Selected Services Summary Banner -->
              <div class="p-3.5 rounded-xl bg-[#1c1b1c] border border-[#262526]">
                <span class="text-[10px] uppercase tracking-wider text-neutral-400 font-bold">Selected Services ({{ selectedServices().length }})</span>
                <div class="text-xs text-white font-medium mt-0.5">{{ selectedServicesNames() || 'No services selected yet' }}</div>
              </div>

              <!-- Multi-select Service Cards -->
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                @for (service of allServices(); track service.id) {
                  <div
                    class="p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3.5"
                    [ngClass]="isServiceSelected(service.id) ? 'bg-[#1e1314] border-[#d70006] shadow-sm shadow-[#d70006]/10' : 'bg-[#1c1b1c] border border-[#262526] hover:border-neutral-700'"
                    (click)="toggleServiceSelection(service)"
                  >
                    <div
                      class="w-5 h-5 rounded border flex items-center justify-center shrink-0 mt-0.5"
                      [ngClass]="isServiceSelected(service.id) ? 'bg-[#d70006] border-[#d70006]' : 'border-neutral-500'"
                    >
                      @if (isServiceSelected(service.id)) {
                        <app-icon name="check" [size]="12" strokeColor="#ffffff" />
                      }
                    </div>

                    <div class="w-12 h-12 rounded-lg bg-[#141314] border border-[#262526] shrink-0 flex items-center justify-center text-[#d70006]">
                      <app-icon name="tool" [size]="20" strokeColor="#d70006" />
                    </div>

                    <div class="flex-1 min-w-0">
                      <div class="text-[9px] uppercase tracking-wider font-bold text-[#d70006] font-oxanium">{{ service.category }}</div>
                      <h4 class="text-sm font-bold text-white font-oxanium truncate">{{ service.name }}</h4>
                      <p class="text-xs text-neutral-400 line-clamp-1 mt-0.5">{{ service.shortDescription }}</p>
                      <div class="flex items-center gap-1.5 text-neutral-400 text-[11px] mt-2 pt-2 border-t border-[#262526]">
                        <app-icon name="clock" [size]="12" strokeColor="#878f97" />
                        <span>Approx. {{ service.durationMinutes }} mins</span>
                      </div>
                    </div>
                  </div>
                }
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-[#222222]">
                <button type="button" class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer" (click)="prevStep()">
                  Back
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                  [disabled]="selectedServices().length === 0"
                  (click)="nextStep()"
                >
                  <span>Continue to Step 3 (Describe Symptoms)</span>
                  <app-icon name="arrow-right" [size]="14" />
                </button>
              </div>
            </div>
          }

          <!-- STEP 3: DESCRIBE PROBLEM & SYMPTOMS -->
          @if (currentStep() === 3) {
            <div class="space-y-5">
              <div>
                <h2 class="text-lg font-bold font-oxanium text-white">Step 3: Describe Vehicle Symptoms</h2>
                <p class="text-xs text-neutral-400 mt-0.5">Help our diagnostic team pinpoint mechanical or electrical issues before arrival.</p>
              </div>

              <!-- Quick Symptoms -->
              <div>
                <label class="text-xs font-semibold text-neutral-300 block mb-2">Quick Select Symptoms (Tap all that apply):</label>
                <div class="flex flex-wrap gap-2">
                  @for (symptom of commonSymptomsList; track symptom) {
                    <button
                      type="button"
                      class="px-2.5 py-1 rounded-md text-xs font-medium transition-colors cursor-pointer"
                      [ngClass]="selectedSymptoms().includes(symptom) ? 'bg-[#d70006] text-white' : 'bg-[#1c1b1c] text-neutral-300 border border-[#262526] hover:border-neutral-600'"
                      (click)="toggleSymptom(symptom)"
                    >
                      {{ symptom }}
                    </button>
                  }
                </div>
              </div>

              <div>
                <label for="probNotes" class="text-xs font-semibold text-neutral-300 block mb-1">Detailed Problem Description <span class="text-[#d70006]">*</span></label>
                <textarea
                  id="probNotes"
                  rows="4"
                  [ngModel]="problemNotes()"
                  (ngModelChange)="problemNotes.set($event)"
                  placeholder="e.g. Squealing sound occurs under braking when cold; check engine light illuminates..."
                  class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl p-3.5 text-white text-xs sm:text-sm outline-none transition-colors placeholder:text-neutral-500"
                ></textarea>
              </div>

              <!-- Upload Photo Mock -->
              <div class="p-5 rounded-xl border border-dashed border-[#2f2e2e] bg-[#1c1b1c] text-center space-y-2">
                <app-icon name="upload" [size]="24" strokeColor="#d70006" />
                <h4 class="text-xs font-bold text-white font-oxanium">Optional: Upload Photo of Dashboard Light or Damage</h4>
                <p class="text-[11px] text-neutral-400">Simulate photo attachment to the vehicle intake ticket.</p>
                <button type="button" class="px-3 py-1.5 rounded-lg bg-[#141314] border border-[#2b2a2b] hover:border-neutral-500 text-xs font-semibold text-neutral-300 cursor-pointer" (click)="mockUploadFile()">
                  Browse Photos
                </button>
                @if (uploadedImages().length > 0) {
                  <div class="flex flex-wrap items-center justify-center gap-2 pt-2">
                    @for (img of uploadedImages(); track img) {
                      <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#141314] border border-[#222222] text-xs text-emerald-400">
                        <app-icon name="check" [size]="12" strokeColor="#10b981" />
                        <span>{{ img }}</span>
                      </span>
                    }
                  </div>
                }
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-[#222222]">
                <button type="button" class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer" (click)="prevStep()">
                  Back
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                  [disabled]="!problemNotes().trim()"
                  (click)="nextStep()"
                >
                  <span>Continue to Step 4 (Schedule Appointment)</span>
                  <app-icon name="arrow-right" [size]="14" />
                </button>
              </div>
            </div>
          }

          <!-- STEP 4: SELECT APPOINTMENT & CONTACT -->
          @if (currentStep() === 4) {
            <div class="space-y-5">
              <div>
                <h2 class="text-lg font-bold font-oxanium text-white">Step 4: Select Appointment &amp; Drop-Off Option</h2>
                <p class="text-xs text-neutral-400 mt-0.5">Pick your preferred date, time slot, and intake preference.</p>
              </div>

              <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
                <div class="space-y-4">
                  <div>
                    <label for="appDate" class="text-xs font-semibold text-neutral-300 block mb-1">Select Appointment Date <span class="text-[#d70006]">*</span></label>
                    <input
                      id="appDate"
                      type="date"
                      [ngModel]="selectedDate()"
                      (ngModelChange)="selectedDate.set($event)"
                      [min]="todayDateString"
                      class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label class="text-xs font-semibold text-neutral-300 block mb-2">Available Time Slots for {{ selectedDate() }}:</label>
                    <div class="grid grid-cols-4 gap-2">
                      @for (slot of availableTimeSlots; track slot) {
                        <button
                          type="button"
                          class="py-2 text-center rounded-lg text-xs font-bold font-oxanium transition-colors cursor-pointer"
                          [ngClass]="selectedTime() === slot ? 'bg-[#d70006] text-white' : 'bg-[#1c1b1c] text-neutral-300 border border-[#262526] hover:border-neutral-600'"
                          (click)="selectedTime.set(slot)"
                        >
                          {{ slot }}
                        </button>
                      }
                    </div>
                  </div>

                  <div class="space-y-2 pt-2">
                    <label class="text-xs font-semibold text-neutral-300 block">Vehicle Drop-Off Preference:</label>
                    <div class="space-y-2">
                      <label
                        class="p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors"
                        [ngClass]="dropOffChoice() === 'drop_off' ? 'bg-[#1e1314] border-[#d70006]' : 'bg-[#1c1b1c] border border-[#262526]'"
                      >
                        <input type="radio" name="dropoff" value="drop_off" [checked]="dropOffChoice() === 'drop_off'" (change)="dropOffChoice.set('drop_off')" class="mt-1" />
                        <div>
                          <strong class="text-xs text-white block">Drop Off Vehicle &amp; Collect Later</strong>
                          <p class="text-[11px] text-neutral-400">Leave car at workshop bay. Receive SMS notifications when ready.</p>
                        </div>
                      </label>

                      <label
                        class="p-3.5 rounded-xl border flex items-start gap-3 cursor-pointer transition-colors"
                        [ngClass]="dropOffChoice() === 'wait_at_lounge' ? 'bg-[#1e1314] border-[#d70006]' : 'bg-[#1c1b1c] border border-[#262526]'"
                      >
                        <input type="radio" name="dropoff" value="wait_at_lounge" [checked]="dropOffChoice() === 'wait_at_lounge'" (change)="dropOffChoice.set('wait_at_lounge')" class="mt-1" />
                        <div>
                          <strong class="text-xs text-white block">Wait in Customer Lounge</strong>
                          <p class="text-[11px] text-neutral-400">Enjoy complimentary Wi-Fi, espresso, and air-conditioned lounge.</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>

                <!-- Customer Contact Check -->
                <div class="p-4 sm:p-5 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3.5">
                  <div>
                    <h4 class="font-oxanium font-bold text-sm text-white">Customer Contact Verification</h4>
                    <p class="text-xs text-neutral-400 mt-0.5">Confirmation code and updates will be sent to:</p>
                  </div>

                  <div>
                    <label for="cName" class="text-xs font-semibold text-neutral-300 block mb-1">Full Name</label>
                    <input id="cName" type="text" [ngModel]="contactName()" (ngModelChange)="contactName.set($event)" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label for="cPhone" class="text-xs font-semibold text-neutral-300 block mb-1">Contact Phone (+94)</label>
                    <input id="cPhone" type="tel" [ngModel]="contactPhone()" (ngModelChange)="contactPhone.set($event)" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                  <div>
                    <label for="cEmail" class="text-xs font-semibold text-neutral-300 block mb-1">Email Address</label>
                    <input id="cEmail" type="email" [ngModel]="contactEmail()" (ngModelChange)="contactEmail.set($event)" class="w-full bg-[#141314] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2 text-white text-xs sm:text-sm outline-none transition-colors" />
                  </div>
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-[#222222]">
                <button type="button" class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer" (click)="prevStep()">
                  Back
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                  [disabled]="!selectedDate() || !selectedTime()"
                  (click)="nextStep()"
                >
                  <span>Review Booking Details (Step 5)</span>
                  <app-icon name="arrow-right" [size]="14" />
                </button>
              </div>
            </div>
          }

          <!-- STEP 5: REVIEW AND CONFIRM -->
          @if (currentStep() === 5) {
            <div class="space-y-5">
              <div>
                <h2 class="text-lg font-bold font-oxanium text-white">Step 5: Review &amp; Confirm Booking</h2>
                <p class="text-xs text-neutral-400 mt-0.5">Please verify your vehicle details, scheduled services, and intake appointment.</p>
              </div>

              <div class="space-y-3.5">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1">
                    <span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-oxanium">
                      <app-icon name="car" [size]="14" strokeColor="#d70006" /> Vehicle Information
                    </span>
                    <div class="text-base font-bold font-oxanium text-white">{{ vehiclePlateNumber() }}</div>
                    <div class="text-xs text-neutral-400">{{ vehicleBrand() }} {{ vehicleModel() }} ({{ vehicleYear() }})</div>
                  </div>

                  <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1">
                    <span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-oxanium">
                      <app-icon name="user" [size]="14" strokeColor="#d70006" /> Workshop Intake Bay
                    </span>
                    <div class="text-base font-bold font-oxanium text-white">Garagix Colombo Central Bay</div>
                    <div class="text-xs text-neutral-400">Certified Master Bay Allocation</div>
                  </div>
                </div>

                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1">
                    <span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-oxanium">
                      <app-icon name="calendar" [size]="14" strokeColor="#d70006" /> Appointment Date &amp; Time
                    </span>
                    <div class="text-base font-bold font-oxanium text-white">{{ selectedDate() }} at {{ selectedTime() }}</div>
                    <div class="text-xs text-neutral-400">{{ dropOffChoice() === 'drop_off' ? 'Vehicle Drop-Off Bay' : 'Waiting in Customer Lounge' }}</div>
                  </div>

                  <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-1">
                    <span class="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-oxanium">
                      <app-icon name="phone" [size]="14" strokeColor="#d70006" /> Customer Contact
                    </span>
                    <div class="text-base font-bold font-oxanium text-white">{{ contactName() }}</div>
                    <div class="text-xs text-neutral-400">{{ contactPhone() }} &bull; {{ contactEmail() }}</div>
                  </div>
                </div>

                <!-- Services Itemized List -->
                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-3">
                  <div class="text-xs font-bold font-oxanium uppercase text-neutral-400 border-b border-[#262526] pb-2 flex items-center justify-between">
                    <span>Selected Services ({{ selectedServices().length }})</span>
                    <span class="text-[#d70006] font-bold">Total: LKR {{ totalEstimatedPrice() | number }}</span>
                  </div>
                  @for (srv of selectedServices(); track srv.id) {
                    <div class="flex items-start justify-between text-xs py-1.5 border-b border-[#262526] last:border-b-0">
                      <div>
                        <strong class="text-white block">{{ srv.name }}</strong>
                        <span class="text-[11px] text-neutral-400">{{ srv.shortDescription }}</span>
                      </div>
                      <span class="px-2 py-0.5 rounded bg-[#141314] text-neutral-400 text-[10px] font-medium border border-[#222222]">{{ srv.category }}</span>
                    </div>
                  }
                </div>

                <!-- Symptoms Note Review -->
                <div class="p-4 rounded-xl bg-[#1c1b1c] border border-[#262526] space-y-2">
                  <strong class="text-xs font-bold uppercase tracking-wider text-white font-oxanium block">Reported Symptoms &amp; Notes:</strong>
                  <p class="text-xs text-neutral-300 leading-relaxed">{{ problemNotes() }}</p>
                  @if (selectedSymptoms().length > 0) {
                    <div class="flex flex-wrap gap-1.5 pt-1">
                      @for (sym of selectedSymptoms(); track sym) {
                        <span class="px-2 py-0.5 rounded bg-[#141314] border border-[#222222] text-[10px] text-neutral-400">{{ sym }}</span>
                      }
                    </div>
                  }
                </div>
              </div>

              <div class="flex items-center justify-between pt-4 border-t border-[#222222]">
                <button type="button" class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer" (click)="prevStep()">
                  Back to Step 4
                </button>
                <button
                  type="button"
                  class="inline-flex items-center gap-2 px-5 py-2.5 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                  [disabled]="isSubmitting()"
                  (click)="confirmBooking()"
                >
                  @if (isSubmitting()) {
                    <span>Locking In Slot...</span>
                  } @else {
                    <app-icon name="check" [size]="16" strokeColor="#ffffff" />
                    <span>Confirm &amp; Generate Booking</span>
                  }
                </button>
              </div>
            </div>
          }
        }
      </div>
    </div>
  `
})
export class BookRepairComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private bookingService = inject(BookingService);
  private customerService = inject(CustomerService);
  private serviceCatalog = inject(ServiceCatalogService);
  private mechanicService = inject(MechanicService);
  private toast = inject(ToastService);

  todayDateString = new Date().toISOString().split('T')[0];

  // Wizard state
  currentStep = signal<number>(1);
  confirmedBooking = signal<Booking | null>(null);
  isSubmitting = signal<boolean>(false);

  steps = [
    { num: 1, label: 'Vehicle' },
    { num: 2, label: 'Services' },
    { num: 3, label: 'Symptoms' },
    { num: 4, label: 'Schedule' },
    { num: 5, label: 'Review' }
  ];

  // Step 1: Vehicle state
  vehicleMode = signal<'existing' | 'new'>('existing');
  selectedVehicleId = signal<string>('');

  newVehicleForm: FormGroup = this.fb.group({
    plateNumber: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: [new Date().getFullYear(), Validators.required],
    type: ['Sedan', Validators.required],
    mileageKm: [0]
  });

  // Step 2: Selected services
  selectedServiceIds = signal<string[]>([]);

  // Step 3: Symptoms & Problem
  selectedSymptoms = signal<string[]>([]);
  problemNotes = signal<string>('Routine maintenance and comprehensive multi-point inspection.');
  uploadedImages = signal<string[]>([]);

  // Step 4: Preferred Mechanic
  selectedMechanicId = signal<string | null>(null);

  // Step 5: Schedule & Contact
  selectedDate = signal<string>(this.todayDateString);
  selectedTime = signal<string>('09:30 AM');
  dropOffChoice = signal<'drop_off' | 'wait_at_lounge'>('drop_off');

  contactName = signal<string>('');
  contactPhone = signal<string>('');
  contactEmail = signal<string>('');

  // Master Data
  savedVehicles = computed(() => {
    const u = this.authService.currentUser();
    return u?.id ? this.customerService.getCustomerVehicles(u.id) : [];
  });
  allServices = this.serviceCatalog.services;
  allMechanics = this.mechanicService.mechanics;

  commonSymptomsList = [
    'Check Engine Light',
    'Brake Squeal / Soft Pedal',
    'AC Blowing Warm Air',
    'Hybrid Battery Warning',
    'Steering Drift / Pull',
    'Engine Knock / Misfire',
    'Fluid Leak Under Car',
    'Vibration at 80+ km/h'
  ];

  availableTimeSlots = [
    '08:30 AM', '09:30 AM', '10:30 AM',
    '11:30 AM', '01:30 PM', '02:30 PM',
    '03:30 PM', '04:30 PM'
  ];

  ngOnInit(): void {
    const vId = this.route.snapshot.queryParams['vehicleId'];
    if (vId) {
      this.selectedVehicleId.set(vId);
      this.vehicleMode.set('existing');
    }

    const sId = this.route.snapshot.queryParams['serviceId'];
    if (sId) {
      this.selectedServiceIds.set([sId]);
      this.currentStep.set(2);
    } else {
      const first = this.allServices()[0];
      if (first) {
        this.selectedServiceIds.set([first.id]);
      }
    }

    const u = this.authService.currentUser();
    if (u) {
      if (u.name) this.contactName.set(u.name);
      if (u.phone) this.contactPhone.set(u.phone);
      if (u.email) this.contactEmail.set(u.email);
      if (u.id) {
        this.customerService.loadCustomerVehicles(u.id).subscribe({
          next: (vehs) => {
            if (vehs && vehs.length > 0) {
              if (!this.selectedVehicleId()) {
                this.selectedVehicleId.set(vehs[0].id);
              }
            } else {
              this.vehicleMode.set('new');
            }
          }
        });
      }
    } else {
      this.vehicleMode.set('new');
    }
  }

  // Derived Computations
  selectedServices = computed(() => {
    const ids = this.selectedServiceIds();
    return this.allServices().filter(s => ids.includes(s.id));
  });

  selectedServicesNames = computed(() => {
    return this.selectedServices().map(s => s.name).join(', ');
  });

  totalEstimatedPrice = computed(() => {
    return this.selectedServices().reduce((sum, s) => sum + s.startingPriceLkr, 0);
  });

  assignedMechanicDisplayName = computed(() => {
    const mId = this.selectedMechanicId();
    if (!mId) return 'Auto-Assigned Master Specialist';
    const m = this.allMechanics().find(item => item.id === mId);
    return m ? m.name : 'Auto-Assigned Specialist';
  });

  vehiclePlateNumber = computed(() => {
    if (this.vehicleMode() === 'existing') {
      const v = this.savedVehicles().find(item => item.id === this.selectedVehicleId()) || this.savedVehicles()[0];
      return v?.plateNumber || '';
    }
    return this.newVehicleForm.get('plateNumber')?.value || '';
  });

  vehicleBrand = computed(() => {
    if (this.vehicleMode() === 'existing') {
      const v = this.savedVehicles().find(item => item.id === this.selectedVehicleId()) || this.savedVehicles()[0];
      return v?.brand || '';
    }
    return this.newVehicleForm.get('brand')?.value || '';
  });

  vehicleModel = computed(() => {
    if (this.vehicleMode() === 'existing') {
      const v = this.savedVehicles().find(item => item.id === this.selectedVehicleId()) || this.savedVehicles()[0];
      return v?.model || '';
    }
    return this.newVehicleForm.get('model')?.value || '';
  });

  vehicleYear = computed(() => {
    if (this.vehicleMode() === 'existing') {
      const v = this.savedVehicles().find(item => item.id === this.selectedVehicleId()) || this.savedVehicles()[0];
      return v?.year || new Date().getFullYear();
    }
    return this.newVehicleForm.get('year')?.value || new Date().getFullYear();
  });

  canProceedStep1(): boolean {
    if (this.vehicleMode() === 'existing') {
      return !!this.selectedVehicleId();
    }
    return this.newVehicleForm.valid;
  }

  selectExistingVehicle(veh: Vehicle): void {
    this.selectedVehicleId.set(veh.id);
  }

  isServiceSelected(id: string): boolean {
    return this.selectedServiceIds().includes(id);
  }

  toggleServiceSelection(service: CarService): void {
    const curr = [...this.selectedServiceIds()];
    const idx = curr.indexOf(service.id);
    if (idx >= 0) {
      if (curr.length > 1) {
        curr.splice(idx, 1);
        this.selectedServiceIds.set(curr);
      } else {
        this.toast.showInfo('At least one service must remain selected.');
      }
    } else {
      curr.push(service.id);
      this.selectedServiceIds.set(curr);
    }
  }

  toggleSymptom(sym: string): void {
    const curr = [...this.selectedSymptoms()];
    const idx = curr.indexOf(sym);
    if (idx >= 0) {
      curr.splice(idx, 1);
    } else {
      curr.push(sym);
    }
    this.selectedSymptoms.set(curr);
  }

  mockUploadFile(): void {
    const fileSample = `dashboard_warning_${Math.floor(100 + Math.random() * 900)}.jpg`;
    this.uploadedImages.update(list => [...list, fileSample]);
    this.toast.showSuccess(`Attached ${fileSample} to booking notes.`);
  }

  goToStep(stepNum: number): void {
    if (stepNum < this.currentStep()) {
      this.currentStep.set(stepNum);
    }
  }

  nextStep(): void {
    this.currentStep.update(s => Math.min(s + 1, 5));
  }

  prevStep(): void {
    this.currentStep.update(s => Math.max(s - 1, 1));
  }

  confirmBooking(): void {
    this.isSubmitting.set(true);

    setTimeout(() => {
      this.isSubmitting.set(false);

      const u = this.authService.currentUser();
      const booking = this.bookingService.createBooking({
        customerId: u?.id || '',
        customerName: this.contactName() || u?.name || 'Customer',
        customerPhone: this.contactPhone() || u?.phone || '',
        customerEmail: this.contactEmail() || u?.email || '',
        vehicle: {
          plateNumber: this.vehiclePlateNumber(),
          brand: this.vehicleBrand(),
          model: this.vehicleModel(),
          year: this.vehicleYear(),
          mileageKm: Number(this.newVehicleForm.get('mileageKm')?.value) || 0
        },
        serviceIds: this.selectedServiceIds(),
        serviceNames: this.selectedServices().map(s => s.name),
        problemDescription: this.problemNotes(),
        symptoms: this.selectedSymptoms(),
        damageImages: this.uploadedImages(),
        preferredMechanicId: this.selectedMechanicId() || undefined,
        preferredMechanicName: this.assignedMechanicDisplayName(),
        appointmentDate: this.selectedDate(),
        appointmentTime: this.selectedTime(),
        dropOffOption: this.dropOffChoice(),
        estimatedPriceLkr: this.totalEstimatedPrice()
      });

      if (this.vehicleMode() === 'new' && u?.id) {
        const nv = this.newVehicleForm.value;
        this.customerService.addVehicle({
          customerId: u.id,
          plateNumber: nv.plateNumber.toUpperCase(),
          brand: nv.brand,
          model: nv.model,
          year: Number(nv.year),
          type: nv.type,
          mileageKm: Number(nv.mileageKm)
        }).subscribe();
      }

      this.confirmedBooking.set(booking);
      this.toast.showSuccess(`Booking ${booking.referenceNumber} generated successfully!`);
    }, 1000);
  }

  resetWizard(): void {
    this.confirmedBooking.set(null);
    this.currentStep.set(1);
    const first = this.allServices()[0];
    this.selectedServiceIds.set(first ? [first.id] : []);
    this.problemNotes.set('Standard multi-point maintenance check.');
    this.selectedSymptoms.set([]);
  }

  onMechanicImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    if (!target) return;
    if (target.src.endsWith('.png')) {
      target.src = target.src.replace(/\.png$/, '.jpg');
    } else if (target.src.endsWith('.jpg')) {
      target.src = target.src.replace(/\.jpg$/, '.png');
    } else {
      target.src = '/images/team/mechanic-1.png';
    }
  }
}
