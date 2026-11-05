import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { WorkshopSettingsService } from '../../../core/services/workshop-settings.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-admin-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-6 max-w-6xl mx-auto">
      <!-- 1. Header with Breadcrumb-Style Red Accent -->
      <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#222222]">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold font-oxanium text-white tracking-tight">
            Admin <span class="text-[#d70006]">Profile &amp; Credentials</span>
          </h1>
          <p class="text-xs sm:text-sm text-neutral-400 mt-1">
            Director supervisory credentials, facility clearance, and administrative account security.
          </p>
        </div>
        <div class="flex items-center gap-2 self-start sm:self-auto">
          <div class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#141314] border border-[#222222]">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="text-xs text-neutral-300 font-medium font-oxanium uppercase">Super Admin Active</span>
          </div>
        </div>
      </header>

      <!-- 2. Minimal Status Summary Bar (Compact chips matching Admin HQ) -->
      <section aria-label="Admin Summary" class="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-[#d70006]"></span>
            <span class="text-xs text-neutral-400 font-medium">Access Tier</span>
          </div>
          <span class="text-xs font-bold font-oxanium text-white uppercase">Super Admin</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Command Bay</span>
          <span class="text-xs font-bold font-oxanium text-white uppercase">{{ settingsService.facilityBay() }} HQ</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span class="text-xs text-neutral-400 font-medium">Clearance</span>
          </div>
          <span class="text-xs font-bold font-oxanium text-emerald-400 uppercase">Level 5 Master</span>
        </div>

        <div class="bg-[#141314] border border-[#222222] rounded-xl px-4 py-3 flex items-center justify-between">
          <span class="text-xs text-neutral-400 font-medium">Bays Supervised</span>
          <span class="text-xs font-bold font-oxanium text-white uppercase">{{ settingsService.hydraulicBays() }} Active</span>
        </div>
      </section>

      <!-- 3. Main Profile Content Grid -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <!-- Left: Personal Info & Password Forms (2 cols) -->
        <div class="lg:col-span-2 space-y-5">
          <!-- Administrator Personal & Contact Details Card -->
          <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-[#222222]">
              <div class="w-8 h-8 rounded-lg bg-[#1c1b1c] flex items-center justify-center shrink-0">
                <app-icon name="user" [size]="16" strokeColor="#878f97" />
              </div>
              <div>
                <h3 class="text-sm font-bold font-oxanium uppercase tracking-wider text-white">Administrator Identity &amp; Contact</h3>
                <p class="text-xs text-neutral-400">Used for official repair authorizations, audit trails, and dispatch logs</p>
              </div>
            </div>

            <form [formGroup]="profileForm" (ngSubmit)="saveProfile()" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="adminName" class="text-xs font-semibold text-neutral-300 block mb-1">Director / Admin Name</label>
                  <input
                    id="adminName"
                    type="text"
                    formControlName="name"
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label for="adminEmail" class="text-xs font-semibold text-neutral-300 block mb-1">Login Email Address</label>
                  <input
                    id="adminEmail"
                    type="email"
                    [value]="user()?.email"
                    disabled
                    class="w-full bg-[#141314] border border-[#262526] rounded-xl px-3.5 py-2.5 text-neutral-400 text-xs sm:text-sm outline-none cursor-not-allowed font-mono"
                  />
                </div>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="adminPhone" class="text-xs font-semibold text-neutral-300 block mb-1">Direct Telephone Hotline (+94)</label>
                  <input
                    id="adminPhone"
                    type="tel"
                    formControlName="phone"
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors font-mono"
                  />
                </div>
                <div>
                  <label for="adminStation" class="text-xs font-semibold text-neutral-300 block mb-1">Supervisory Station</label>
                  <input
                    id="adminStation"
                    type="text"
                    [value]="settingsService.facilityBay() + ' Central Control'"
                    disabled
                    class="w-full bg-[#141314] border border-[#262526] rounded-xl px-3.5 py-2.5 text-neutral-400 text-xs sm:text-sm outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label for="adminAddr" class="text-xs font-semibold text-neutral-300 block mb-1">Director Office / Facility Address</label>
                <input
                  id="adminAddr"
                  type="text"
                  formControlName="address"
                  class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <div class="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  [disabled]="savingProfile() || profileForm.invalid"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[#d70006] hover:bg-[#b80005] text-white rounded-lg font-oxanium text-xs font-bold uppercase tracking-wider transition-colors shadow-lg shadow-[#d70006]/20 cursor-pointer disabled:opacity-50"
                >
                  @if (savingProfile()) {
                    <span>Saving Changes...</span>
                  } @else {
                    <app-icon name="check" [size]="14" strokeColor="#ffffff" />
                    <span>Save Profile Details</span>
                  }
                </button>
              </div>
            </form>
          </div>

          <!-- Administrator Password & Security Card -->
          <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 space-y-5">
            <div class="flex items-center gap-3 pb-3 border-b border-[#222222]">
              <div class="w-8 h-8 rounded-lg bg-[#1c1b1c] flex items-center justify-center shrink-0">
                <app-icon name="shield" [size]="16" strokeColor="#878f97" />
              </div>
              <div>
                <h3 class="text-sm font-bold font-oxanium uppercase tracking-wider text-white">Administrator Password &amp; Credentials</h3>
                <p class="text-xs text-neutral-400">Update high-privilege credentials to protect master workshop operations</p>
              </div>
            </div>

            <form [formGroup]="passwordForm" (ngSubmit)="changePassword()" class="space-y-4">
              <div>
                <label for="currPass" class="text-xs font-semibold text-neutral-300 block mb-1">Current Administrator Password</label>
                <input
                  id="currPass"
                  type="password"
                  formControlName="currentPassword"
                  placeholder="••••••••"
                  class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors"
                />
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="newPass" class="text-xs font-semibold text-neutral-300 block mb-1">New Password (Min 6 Characters)</label>
                  <input
                    id="newPass"
                    type="password"
                    formControlName="newPassword"
                    placeholder="Enter new password"
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>
                <div>
                  <label for="confPass" class="text-xs font-semibold text-neutral-300 block mb-1">Confirm New Password</label>
                  <input
                    id="confPass"
                    type="password"
                    formControlName="confirmPassword"
                    placeholder="Repeat new password"
                    class="w-full bg-[#1c1b1c] border border-[#262526] focus:border-[#d70006] rounded-xl px-3.5 py-2.5 text-white text-xs sm:text-sm outline-none transition-colors"
                  />
                </div>
              </div>

              <div class="pt-2 flex items-center justify-end">
                <button
                  type="submit"
                  [disabled]="passwordForm.invalid || changingPass()"
                  class="inline-flex items-center gap-2 px-4 py-2 bg-[#1c1b1c] hover:bg-[#252425] text-xs font-semibold text-neutral-300 hover:text-white border border-[#2b2a2b] hover:border-neutral-500 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
                >
                  @if (changingPass()) {
                    <span>Updating Security...</span>
                  } @else {
                    <app-icon name="shield" [size]="14" />
                    <span>Update Security Password</span>
                  }
                </button>
              </div>
            </form>
          </div>
        </div>

        <!-- Right: Authority Badge & Workshop Link (1 col) -->
        <div class="space-y-5">
          <!-- Administrator Authority Badge Card -->
          <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 sm:p-6 flex flex-col items-center text-center space-y-4">
            <div class="relative">
              <div class="w-20 h-20 rounded-2xl bg-[#201517] border-2 border-[#d70006] shadow-[0_0_20px_rgba(215,0,6,0.35)] flex items-center justify-center text-2xl font-bold font-oxanium text-white uppercase">
                {{ user()?.name?.charAt(0) || 'A' }}
              </div>
              <div class="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#141314] flex items-center justify-center" title="Master Session Verified">
                <span class="w-2 h-2 rounded-full bg-white"></span>
              </div>
            </div>

            <div>
              <h3 class="font-oxanium text-lg font-bold text-white tracking-wide">{{ user()?.name || 'Administrator' }}</h3>
              <p class="text-xs text-[#d70006] font-semibold uppercase tracking-wider mt-0.5">Workshop Director &bull; Super Admin</p>
              <p class="text-[11px] text-neutral-400 font-mono mt-1">{{ user()?.email }}</p>
            </div>

            <div class="w-full h-px bg-[#222222]"></div>

            <div class="w-full space-y-2 text-left text-xs">
              <div class="flex items-center justify-between py-1 border-b border-[#1c1c1d]">
                <span class="text-neutral-400">Account ID</span>
                <span class="font-mono text-white font-medium">{{ user()?.id || 'admin-001' }}</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-[#1c1c1d]">
                <span class="text-neutral-400">Authority Role</span>
                <span class="font-oxanium text-emerald-400 uppercase font-bold">SUPER ADMINISTRATOR</span>
              </div>
              <div class="flex items-center justify-between py-1 border-b border-[#1c1c1d]">
                <span class="text-neutral-400">Security Clearance</span>
                <span class="text-white font-medium">Level 5 (Unrestricted)</span>
              </div>
              <div class="flex items-center justify-between py-1">
                <span class="text-neutral-400">Active Session</span>
                <span class="text-emerald-400 font-medium">Verified Current Host</span>
              </div>
            </div>

            <div class="w-full pt-2">
              <button
                type="button"
                (click)="authService.logout()"
                class="w-full py-2.5 px-3 bg-[#1c1b1c] hover:bg-red-500/10 hover:border-red-500/40 text-neutral-300 hover:text-red-400 border border-[#2b2a2b] rounded-xl text-xs font-semibold font-oxanium uppercase tracking-wider transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <app-icon name="log-out" [size]="14" strokeColor="#fb7185" />
                <span>Sign Out Master Session</span>
              </button>
            </div>
          </div>

          <!-- Connected Workshop Quick Link Card -->
          <div class="bg-[#141314] border border-[#222222] rounded-xl p-5 space-y-4">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <app-icon name="tool" [size]="15" strokeColor="#d70006" />
                <span class="text-xs font-bold font-oxanium text-white uppercase">Assigned Facility</span>
              </div>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-[#1c1b1c] text-emerald-400 border border-[#262526] font-oxanium uppercase">
                {{ settingsService.workshopStatus() }}
              </span>
            </div>

            <div class="space-y-1.5 text-xs">
              <p class="font-bold font-oxanium text-white text-sm">{{ settingsService.workshopName() }}</p>
              <p class="text-neutral-400 leading-relaxed text-[11px]">{{ settingsService.address() }}</p>
            </div>

            <div class="pt-2 border-t border-[#222222]">
              <a
                routerLink="/admin/settings"
                class="inline-flex items-center gap-1.5 text-xs text-[#d70006] hover:text-[#b80005] font-semibold transition-colors group cursor-pointer"
              >
                <span>Configure Garage Operating Rules</span>
                <span class="transition-transform group-hover:translate-x-1">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AdminProfileComponent {
  readonly authService = inject(AuthService);
  readonly settingsService = inject(WorkshopSettingsService);
  private toast = inject(ToastService);
  private fb = inject(FormBuilder);

  user = this.authService.currentUser;
  savingProfile = signal<boolean>(false);
  changingPass = signal<boolean>(false);

  profileForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    phone: ['', [Validators.required]],
    address: ['', [Validators.required]]
  });

  passwordForm: FormGroup = this.fb.group({
    currentPassword: ['', [Validators.required]],
    newPassword: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]]
  });

  constructor() {
    effect(() => {
      const u = this.user();
      if (u) {
        this.profileForm.patchValue({
          name: u.name,
          phone: u.phone,
          address: u.address
        }, { emitEvent: false });
      }
    });
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.toast.showError('Please check all required profile fields.');
      return;
    }

    this.savingProfile.set(true);
    this.authService.updateProfileApi(this.profileForm.value).subscribe({
      next: () => {
        this.savingProfile.set(false);
        this.toast.showSuccess('Administrator profile details saved successfully.');
      },
      error: (err) => {
        this.savingProfile.set(false);
        const msg = err?.error?.message || 'Failed to update administrator profile.';
        this.toast.showError(msg);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) {
      this.toast.showError('Please complete all password fields (minimum 6 characters).');
      return;
    }

    const { currentPassword, newPassword, confirmPassword } = this.passwordForm.value;
    if (newPassword !== confirmPassword) {
      this.toast.showError('New password and confirmation password do not match.');
      return;
    }

    this.changingPass.set(true);
    this.authService.changePassword(currentPassword, newPassword, confirmPassword).subscribe({
      next: (res) => {
        this.changingPass.set(false);
        this.passwordForm.reset();
        this.toast.showSuccess(res?.message || 'Security password updated successfully.');
      },
      error: (err) => {
        this.changingPass.set(false);
        const msg = err?.error?.message || 'Failed to update security password. Verify current password.';
        this.toast.showError(msg);
      }
    });
  }
}

