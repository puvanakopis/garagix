import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

export type ResetStep = 'email' | 'otp' | 'password' | 'success';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <!-- Ambient Workshop Red Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(215,0,6,0.12)_0%,_transparent_65%)] pointer-events-none"></div>

      <div class="w-full max-w-[500px] bg-gx-card border border-[#292929] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative z-10 my-8">
        <!-- Progress Stepper -->
        @if (currentStep() !== 'success') {
          <div class="flex items-center justify-center gap-2 mb-8 select-none">
            <!-- Step 1 -->
            <div class="flex items-center gap-1.5">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-oxanium transition-colors"
                [ngClass]="currentStep() === 'email' ? 'bg-[#d70006] text-white shadow-md shadow-[#d70006]/30' : 'bg-emerald-600 text-white'"
              >
                @if (currentStep() === 'email') { 1 } @else { &#10003; }
              </span>
              <span class="text-xs font-semibold" [ngClass]="currentStep() === 'email' ? 'text-white' : 'text-neutral-400'">Email</span>
            </div>

            <div class="w-6 sm:w-8 h-[1px] bg-[#333333]"></div>

            <!-- Step 2 -->
            <div class="flex items-center gap-1.5">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-oxanium transition-colors"
                [ngClass]="currentStep() === 'otp' ? 'bg-[#d70006] text-white shadow-md shadow-[#d70006]/30' : (currentStep() === 'password' ? 'bg-emerald-600 text-white' : 'bg-[#222222] text-neutral-500')"
              >
                @if (currentStep() === 'password') { &#10003; } @else { 2 }
              </span>
              <span class="text-xs font-semibold" [ngClass]="currentStep() === 'otp' ? 'text-white' : 'text-neutral-400'">OTP Verify</span>
            </div>

            <div class="w-6 sm:w-8 h-[1px] bg-[#333333]"></div>

            <!-- Step 3 -->
            <div class="flex items-center gap-1.5">
              <span
                class="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold font-oxanium transition-colors"
                [ngClass]="currentStep() === 'password' ? 'bg-[#d70006] text-white shadow-md shadow-[#d70006]/30' : 'bg-[#222222] text-neutral-500'"
              >
                3
              </span>
              <span class="text-xs font-semibold" [ngClass]="currentStep() === 'password' ? 'text-white' : 'text-neutral-400'">New Password</span>
            </div>
          </div>
        }

        <!-- STEP 1: ENTER EMAIL -->
        @if (currentStep() === 'email') {
          <div class="text-center mb-8">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">ACCOUNT RECOVERY</span>
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mt-1 mb-2 tracking-wide">Forgot Password</h2>
            <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
              Enter the registered email associated with your account. We will authenticate your request with an instant OTP verification code.
            </p>
          </div>

          <form [formGroup]="emailForm" (ngSubmit)="submitEmail()" class="space-y-4">
            <div>
              <label for="recoveryEmail" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
                Registered Email Address <span class="text-gx-primary">*</span>
              </label>
              <div class="relative">
                <app-icon name="mail" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
                <input
                  id="recoveryEmail"
                  type="email"
                  formControlName="email"
                  placeholder="e.g. kasun.mendis@example.lk"
                  class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-4 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                  [class.border-rose-500]="isEmailInvalid()"
                />
              </div>
              @if (isEmailInvalid()) {
                <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                  <app-icon name="alert-circle" [size]="12" /> Please enter a valid email address.
                </div>
              }
            </div>

            <button
              type="submit"
              [disabled]="submitting()"
              class="bootlab-btn-primary w-full py-3.5 mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (submitting()) {
                <span>Generating OTP Code...</span>
              } @else {
                <app-icon name="shield" [size]="16" />
                <span>Verify Email &amp; Get OTP</span>
              }
            </button>
          </form>
        }

        <!-- STEP 2: VERIFY OTP -->
        @if (currentStep() === 'otp') {
          <div class="text-center mb-6">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">STEP 2 OF 3</span>
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mt-1 mb-2 tracking-wide">Enter Verification Code</h2>
            <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
              Authenticate your identity for <strong class="text-white">{{ userEmail() }}</strong>
            </p>
          </div>

          <!-- Instant OTP Display Box (Eliminating the need for external email retrieval) -->
          <div class="bg-[#151213] border border-[#d70006]/40 p-4 rounded-xl mb-6 text-center space-y-2">
            <div class="flex items-center justify-center gap-1.5 text-xs text-neutral-300">
              <app-icon name="shield" [size]="14" strokeColor="#d70006" />
              <span>Instant Verification Passcode:</span>
            </div>
            <div class="flex items-center justify-center gap-2">
              <span class="font-oxanium text-2xl sm:text-3xl font-extrabold tracking-[0.25em] text-[#d70006] select-all bg-[#200f12] px-4 py-1.5 rounded-lg border border-[#d70006]/50">
                {{ generatedOtp() }}
              </span>
            </div>
            <p class="text-[11px] text-neutral-400">
              Enter the 6-digit code above to authorize your password update.
            </p>
          </div>

          <form [formGroup]="otpForm" (ngSubmit)="submitOtp()" class="space-y-4">
            <div>
              <label for="otpInput" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5 text-center">
                Enter 6-Digit OTP <span class="text-gx-primary">*</span>
              </label>
              <input
                id="otpInput"
                type="text"
                maxlength="6"
                inputmode="numeric"
                formControlName="otp"
                placeholder="• • • • • •"
                class="w-full bg-[#0e0d0d] border border-[#292929] px-4 py-3.5 text-center text-white placeholder-gx-text-muted text-xl font-oxanium tracking-[0.3em] font-bold focus:outline-none focus:border-gx-primary transition-colors"
                [class.border-rose-500]="isOtpInvalid() || otpError()"
              />
              @if (otpError()) {
                <div class="text-[0.6875rem] text-rose-400 mt-1.5 flex items-center justify-center gap-1 font-sans">
                  <app-icon name="alert-circle" [size]="12" /> {{ otpError() }}
                </div>
              }
            </div>

            <button
              type="submit"
              [disabled]="submitting()"
              class="bootlab-btn-primary w-full py-3.5 mt-2 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (submitting()) {
                <span>Validating Passcode...</span>
              } @else {
                <app-icon name="check" [size]="16" />
                <span>Verify OTP &amp; Continue</span>
              }
            </button>

            <div class="flex items-center justify-between pt-3 text-xs">
              <button
                type="button"
                (click)="resendOtp()"
                class="text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                Generate New Code
              </button>
              <button
                type="button"
                (click)="changeEmail()"
                class="text-[#d70006] hover:underline transition-colors cursor-pointer"
              >
                Change Email
              </button>
            </div>
          </form>
        }

        <!-- STEP 3: SET NEW PASSWORD -->
        @if (currentStep() === 'password') {
          <div class="text-center mb-8">
            <span class="text-[10px] font-bold uppercase tracking-widest text-[#d70006] font-oxanium">STEP 3 OF 3</span>
            <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mt-1 mb-2 tracking-wide">Set New Password</h2>
            <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">
              OTP verified for <strong class="text-white">{{ userEmail() }}</strong>. Please set a new secure password.
            </p>
          </div>

          <form [formGroup]="passwordForm" (ngSubmit)="submitPassword()" class="space-y-4">
            <div>
              <label for="newPass" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
                New Password <span class="text-gx-primary">*</span>
              </label>
              <div class="relative">
                <app-icon name="lock" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
                <input
                  id="newPass"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="newPassword"
                  placeholder="Min 6 characters"
                  class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-11 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                  [class.border-rose-500]="isFieldInvalid('newPassword')"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gx-text-muted hover:text-white transition-colors cursor-pointer"
                  (click)="toggleShowPassword()"
                  aria-label="Toggle password visibility"
                >
                  <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" [size]="16" />
                </button>
              </div>
              @if (isFieldInvalid('newPassword')) {
                <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                  <app-icon name="alert-circle" [size]="12" /> Password must be at least 6 characters.
                </div>
              }
            </div>

            <div>
              <label for="confPass" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
                Confirm New Password <span class="text-gx-primary">*</span>
              </label>
              <div class="relative">
                <app-icon name="lock" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
                <input
                  id="confPass"
                  [type]="showConfirmPassword() ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  placeholder="Re-type new password"
                  class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-11 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                  [class.border-rose-500]="isFieldInvalid('confirmPassword') || passwordForm.hasError('mismatch')"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gx-text-muted hover:text-white transition-colors cursor-pointer"
                  (click)="toggleShowConfirmPassword()"
                  aria-label="Toggle confirm password visibility"
                >
                  <app-icon [name]="showConfirmPassword() ? 'eye-off' : 'eye'" [size]="16" />
                </button>
              </div>
              @if (passwordForm.hasError('mismatch') && (passwordForm.get('confirmPassword')?.touched || passwordForm.get('confirmPassword')?.dirty)) {
                <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                  <app-icon name="alert-circle" [size]="12" /> Passwords do not match.
                </div>
              }
            </div>

            <button
              type="submit"
              [disabled]="submitting()"
              class="bootlab-btn-primary w-full py-3.5 mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (submitting()) {
                <span>Updating Password...</span>
              } @else {
                <app-icon name="check" [size]="16" />
                <span>Save New Password &amp; Sign In</span>
              }
            </button>
          </form>
        }

        <!-- STEP 4: SUCCESS -->
        @if (currentStep() === 'success') {
          <div class="bg-[#0f241d] border border-emerald-500/40 p-6 flex flex-col items-center text-center gap-3">
            <app-icon name="check-circle" [size]="36" strokeColor="#10b981" />
            <h4 class="font-display text-xl font-bold text-emerald-400">Password Successfully Updated</h4>
            <p class="text-xs sm:text-sm text-emerald-200 leading-relaxed">
              Your security credentials for <strong class="text-white">{{ userEmail() }}</strong> have been successfully updated. You can now log into your account.
            </p>
            <a routerLink="/auth/login" class="bootlab-btn-primary w-full py-3.5 text-xs text-center mt-4">
              <span>Sign In with New Password</span>
            </a>
          </div>
        }

        <div class="text-center text-xs text-gx-text-secondary mt-8 pt-6 border-t border-gx-border-subtle">
          <a routerLink="/auth/login" class="inline-flex items-center gap-2 text-gx-text-muted hover:text-white transition-colors font-display tracking-wider font-bold uppercase">
            <app-icon name="arrow-left" [size]="14" />
            <span>Return to Sign In</span>
          </a>
        </div>
      </div>
    </div>
  `
})
export class ForgotPasswordComponent {
  private fb = inject(FormBuilder);
  private toast = inject(ToastService);

  currentStep = signal<ResetStep>('email');
  userEmail = signal<string>('');
  generatedOtp = signal<string>('');
  otpError = signal<string>('');
  submitting = signal<boolean>(false);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);

  toggleShowPassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleShowConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  // Step 1: Email Form
  emailForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]]
  });

  // Step 2: OTP Form
  otpForm: FormGroup = this.fb.group({
    otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
  });

  // Step 3: Password Form
  passwordForm: FormGroup = this.fb.group(
    {
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    },
    {
      validators: (form: FormGroup) => {
        const p = form.get('newPassword')?.value;
        const c = form.get('confirmPassword')?.value;
        return p === c ? null : { mismatch: true };
      }
    }
  );

  isEmailInvalid(): boolean {
    const ctrl = this.emailForm.get('email');
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  isOtpInvalid(): boolean {
    const ctrl = this.otpForm.get('otp');
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  isFieldInvalid(field: string): boolean {
    const ctrl = this.passwordForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  submitEmail(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    const email = this.emailForm.get('email')?.value.trim();
    this.userEmail.set(email);
    this.submitting.set(true);

    setTimeout(() => {
      this.submitting.set(false);
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      this.generatedOtp.set(otpCode);
      this.otpError.set('');
      this.otpForm.reset();
      this.currentStep.set('otp');
      this.toast.showSuccess(`Verification code ${otpCode} generated.`, 'OTP Ready');
    }, 600);
  }

  submitOtp(): void {
    if (this.otpForm.invalid) {
      this.otpForm.markAllAsTouched();
      return;
    }

    const entered = this.otpForm.get('otp')?.value.trim();
    this.submitting.set(true);

    setTimeout(() => {
      this.submitting.set(false);
      if (entered === this.generatedOtp()) {
        this.otpError.set('');
        this.currentStep.set('password');
        this.toast.showSuccess('OTP verified successfully! Please set your new password.', 'Identity Confirmed');
      } else {
        this.otpError.set('Incorrect verification code. Please enter the 6-digit OTP shown above.');
      }
    }, 500);
  }

  resendOtp(): void {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    this.generatedOtp.set(newCode);
    this.otpForm.reset();
    this.otpError.set('');
    this.toast.showInfo(`New verification code: ${newCode}`, 'New OTP Issued');
  }

  changeEmail(): void {
    this.currentStep.set('email');
    this.otpForm.reset();
    this.otpError.set('');
  }

  submitPassword(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    setTimeout(() => {
      this.submitting.set(false);
      this.currentStep.set('success');
      this.toast.showSuccess('Your password has been successfully reset.');
    }, 700);
  }
}
