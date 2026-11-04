import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { CustomerService } from '../../../core/services/customer.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-customer-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Customer <span class="text-[#d70006]">Profile</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Manage your personal contact details, saved vehicles, and account preferences.
          </p>
        </div>
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141314] border border-[#222222]">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-xs text-neutral-300 font-medium">Verified Customer</span>
          </div>
        </div>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Dashboard) -->
      <section aria-label="Profile Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">Saved Vehicles</span>
          </div>
          <span class="text-base font-bold font-oxanium text-white">{{ savedVehicles().length }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Member Since</span>
          <span class="text-base font-bold font-oxanium text-white">{{ user()?.memberSince || '2024' }}</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Account Tier</span>
          <span class="text-xs font-bold font-oxanium text-white uppercase">Premium</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Contact Security</span>
          <span class="text-xs font-bold font-oxanium text-emerald-400 uppercase">2FA Active</span>
        </div>
      </section>

      <!-- 3. Main Profile Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Left: Personal Info & Password Forms (2 cols) -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Personal Info Card -->
          <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-[#222222]">
              <div class="w-8 h-8 rounded-lg bg-[#1c1b1c] flex items-center justify-center shrink-0">
                <app-icon name="user" [size]="16" strokeColor="#878f97" />
              </div>
              <div>
                <h3 class="text-sm font-bold font-oxanium uppercase tracking-wider text-white">Personal &amp; Contact Details</h3>
                <p class="text-xs text-neutral-400">Used for service booking confirmations, bay alerts, and invoices</p>
              </div>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="profName" class="text-xs font-semibold text-neutral-300 block mb-1">Full Legal Name</label>
                  <input id="profName" type="text" formControlName="name" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="profEmail" class="text-xs font-semibold text-neutral-300 block mb-1">Email Address</label>
                  <input id="profEmail" type="email" formControlName="email" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="profPhone" class="text-xs font-semibold text-neutral-300 block mb-1">Telephone (+94)</label>
                  <input id="profPhone" type="tel" formControlName="phone" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="profMember" class="text-xs font-semibold text-neutral-300 block mb-1">Account Standing</label>
                  <input id="profMember" type="text" [value]="'Active Member since ' + (user()?.memberSince || '2024')" disabled class="w-full bg-[#141314] border border-[#262526] rounded-xl px-3.5 py-2.5 text-neutral-500 text-xs sm:text-sm outline-none cursor-not-allowed" />
                </div>
              </div>

              <div>
                <label for="profAddr" class="text-xs font-semibold text-neutral-300 block mb-1">Residential / Postal Address in Sri Lanka</label>
                <input id="profAddr" type="text" formControlName="address" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
              </div>

              <div class="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  [disabled]="savingProfile()"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                >
                  @if (savingProfile()) {
                    <span>Saving Changes...</span>
                  } @else {
                    <app-icon name="check" [size]="14" strokeColor="#ffffff" />
                    <span>Save Contact Details</span>
                  }
                </button>
              </div>
            </form>
          </div>

          <!-- Password Security Card -->
          <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-[#222222]">
              <div class="w-8 h-8 rounded-lg bg-[#1c1b1c] flex items-center justify-center shrink-0">
                <app-icon name="shield" [size]="16" strokeColor="#878f97" />
              </div>
              <div>
                <h3 class="text-sm font-bold font-oxanium uppercase tracking-wider text-white">Account Password &amp; Security</h3>
                <p class="text-xs text-neutral-400">Update your login credentials to keep your portal secure</p>
              </div>
            </div>

            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4">
              <div>
                <label for="currPass" class="text-xs font-semibold text-neutral-300 block mb-1">Current Password</label>
                <input id="currPass" type="password" formControlName="currentPassword" placeholder="••••••••" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="newP" class="text-xs font-semibold text-neutral-300 block mb-1">New Password</label>
                  <input id="newP" type="password" formControlName="newPassword" placeholder="Min 6 characters" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="confP" class="text-xs font-semibold text-neutral-300 block mb-1">Confirm New Password</label>
                  <input id="confP" type="password" formControlName="confirmPassword" placeholder="Repeat new password" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
              </div>

              <div class="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  [disabled]="passwordForm.invalid || changingPass()"
                  class="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer disabled:opacity-50"
                >
                  @if (changingPass()) {
                    <span>Updating Security...</span>
                  } @else {
                    <app-icon name="shield" [size]="14" />
                    <span>Update Password</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right: Saved Vehicles (1 col) -->
        <div class="space-y-4">
          <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 space-y-4">
            <div class="flex items-center justify-between pb-3 border-b border-[#222222]">
              <div class="flex items-center gap-2">
                <div class="w-8 h-8 rounded-lg bg-[#1c1b1c] flex items-center justify-center shrink-0">
                  <app-icon name="car" [size]="16" strokeColor="#878f97" />
                </div>
                <div>
                  <h3 class="text-sm font-bold font-oxanium uppercase tracking-wider text-white">My Vehicles</h3>
                  <p class="text-[11px] text-neutral-400">{{ savedVehicles().length }} vehicle(s) saved</p>
                </div>
              </div>
              <button
                type="button"
                class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                (click)="showAddVehicleModal.set(true)"
              >
                <app-icon name="plus" [size]="12" />
                <span>Add Car</span>
              </button>
            </div>

            <!-- Vehicles Stream (Styled identical to Dashboard's vehicle cards) -->
            <div class="space-y-3">
              @for (veh of savedVehicles(); track veh.id) {
                <div class="bg-[#1c1b1c] border border-[#262526] hover:border-neutral-700 rounded-xl p-3.5 flex flex-col justify-between gap-3 transition-colors">
                  <div class="flex items-start justify-between gap-2">
                    <div>
                      <span class="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-[#141314] text-neutral-300 border border-[#2d2c2d] mb-1.5">
                        {{ veh.plateNumber }}
                      </span>
                      <h4 class="font-oxanium font-bold text-white text-sm">{{ veh.brand }} {{ veh.model }}</h4>
                      <p class="text-xs text-neutral-400 mt-0.5">
                        {{ veh.year }} &bull; {{ veh.type }} &bull; {{ veh.mileageKm ? (veh.mileageKm | number) + ' km' : 'No Odo' }}
                      </p>
                    </div>
                    <button
                      class="text-neutral-500 hover:text-red-400 p-1 transition-colors cursor-pointer"
                      (click)="deleteVehicle(veh.id)"
                      title="Remove Vehicle"
                    >
                      <app-icon name="x" [size]="15" />
                    </button>
                  </div>

                  <div class="flex items-center justify-between pt-2 border-t border-[#262526]">
                    <span class="text-[11px] text-neutral-500 capitalize">{{ veh.color || 'Standard' }}</span>
                    <a
                      [routerLink]="['/customer/book-repair']"
                      [queryParams]="{ vehicleId: veh.id }"
                      class="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#141314] hover:bg-[#d70006] hover:text-white text-neutral-300 text-xs font-semibold transition-colors cursor-pointer border border-[#262526] hover:border-[#d70006]"
                    >
                      <span>Book Service</span>
                      <app-icon name="arrow-right" [size]="11" />
                    </a>
                  </div>
                </div>
              } @empty {
                <div class="p-6 text-center bg-[#1c1b1c] border border-[#262526] rounded-xl text-neutral-400 text-xs">
                  No vehicles registered yet.
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      <!-- Add Vehicle Modal -->
      @if (showAddVehicleModal()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 overflow-y-auto" (click)="showAddVehicleModal.set(false)">
          <div class="w-full max-w-md bg-[#141314] border border-[#262526] rounded-2xl shadow-2xl overflow-hidden my-8" (click)="$event.stopPropagation()">
            <div class="flex items-center justify-between px-6 py-4 border-b border-[#222222]">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">GARAGE ASSETS</span>
                <h3 class="text-lg font-bold font-oxanium text-white tracking-wide mt-0.5">Add Vehicle to Profile</h3>
              </div>
              <button class="text-neutral-400 hover:text-white p-1 rounded cursor-pointer" (click)="showAddVehicleModal.set(false)" aria-label="Close modal">
                <app-icon name="x" [size]="18" />
              </button>
            </div>

            <form [formGroup]="newVehForm" (ngSubmit)="saveNewVehicle()" class="p-6 space-y-4">
              <div>
                <label for="mPlate" class="text-xs font-semibold text-neutral-300 block mb-1">Registration Plate (e.g. WP CAA-1234)</label>
                <input id="mPlate" type="text" formControlName="plateNumber" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none uppercase font-mono transition-colors" />
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="mBrand" class="text-xs font-semibold text-neutral-300 block mb-1">Brand / Make</label>
                  <input id="mBrand" type="text" formControlName="brand" placeholder="e.g. Honda" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="mModel" class="text-xs font-semibold text-neutral-300 block mb-1">Model Name</label>
                  <input id="mModel" type="text" formControlName="model" placeholder="e.g. Vezel" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label for="mYear" class="text-xs font-semibold text-neutral-300 block mb-1">Model Year</label>
                  <input id="mYear" type="number" formControlName="year" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors" />
                </div>
                <div>
                  <label for="mType" class="text-xs font-semibold text-neutral-300 block mb-1">Vehicle Class</label>
                  <select id="mType" formControlName="type" class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors">
                    <option value="Sedan">Sedan</option>
                    <option value="SUV / 4WD">SUV / 4WD</option>
                    <option value="Hatchback">Hatchback</option>
                    <option value="Van / MPV">Van / MPV</option>
                    <option value="Electric Vehicle">Electric Vehicle</option>
                  </select>
                </div>
              </div>

              <div class="flex items-center justify-end gap-3 pt-4 border-t border-[#222222]">
                <button
                  type="button"
                  class="px-3 py-1.5 rounded-lg bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 transition-colors cursor-pointer"
                  (click)="showAddVehicleModal.set(false)"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  [disabled]="newVehForm.invalid"
                  class="px-4 py-2 rounded-lg text-xs font-bold font-oxanium uppercase tracking-wider bg-[#d70006] hover:bg-[#b80005] text-white shadow-lg shadow-[#d70006]/20 transition-colors cursor-pointer disabled:opacity-50"
                >
                  Save Vehicle
                </button>
              </div>
            </form>
          </div>
        </div>
      }
    </div>
  `
})
export class CustomerProfileComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private customerService = inject(CustomerService);
  private toast = inject(ToastService);

  user = this.authService.currentUser;
  savedVehicles = computed(() => this.customerService.getCustomerVehicles(this.user()?.id || 'cust-101'));

  savingProfile = signal<boolean>(false);
  changingPass = signal<boolean>(false);
  showAddVehicleModal = signal<boolean>(false);

  profileForm: FormGroup = this.fb.group({
    name: [this.user()?.name || 'Kasun Mendis', Validators.required],
    email: [this.user()?.email || 'kasun.mendis@example.lk', [Validators.required, Validators.email]],
    phone: [this.user()?.phone || '+94 77 123 4567', Validators.required],
    address: [this.user()?.address || 'No. 42/B, Flower Road, Colombo 07, Sri Lanka', Validators.required]
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required]
  }, {
    validators: (form: FormGroup) => {
      const p = form.get('newPassword')?.value;
      const c = form.get('confirmPassword')?.value;
      return p === c ? null : { mismatch: true };
    }
  });

  newVehForm: FormGroup = this.fb.group({
    plateNumber: ['', Validators.required],
    brand: ['', Validators.required],
    model: ['', Validators.required],
    year: [2021, Validators.required],
    type: ['Sedan', Validators.required],
    color: ['Pearl White'],
    mileageKm: [38000]
  });

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.savingProfile.set(true);

    setTimeout(() => {
      this.savingProfile.set(false);
      this.authService.updateProfile(this.profileForm.value);
    }, 700);
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.changingPass.set(true);

    setTimeout(() => {
      this.changingPass.set(false);
      this.passwordForm.reset();
      this.toast.showSuccess('Security password updated successfully!');
    }, 700);
  }

  saveNewVehicle(): void {
    if (this.newVehForm.invalid) return;
    const val = this.newVehForm.value;
    this.customerService.addVehicle({
      customerId: this.user()?.id || 'cust-101',
      plateNumber: val.plateNumber.toUpperCase(),
      brand: val.brand,
      model: val.model,
      year: Number(val.year),
      type: val.type,
      color: val.color,
      mileageKm: Number(val.mileageKm)
    });

    this.toast.showSuccess(`Added ${val.plateNumber} to your garage profile.`);
    this.showAddVehicleModal.set(false);
    this.newVehForm.reset({
      year: 2021,
      type: 'Sedan',
      color: 'Pearl White'
    });
  }

  deleteVehicle(id: string): void {
    this.customerService.removeVehicle(id);
    this.toast.showInfo('Vehicle removed from garage profile.');
  }
}
