import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <!-- Ambient Workshop Red Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(215,0,6,0.12)_0%,_transparent_65%)] pointer-events-none"></div>

      <div class="w-full max-w-[560px] bg-gx-card border border-[#292929] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative z-10 my-8">
        <div class="text-center mb-8">
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mb-1 tracking-wide">Create Customer Account</h2>
          <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">Register to book repairs online and monitor live garage bay progress.</p>
        </div>

        <form [formGroup]="registerForm" (ngSubmit)="onRegister()" class="space-y-4">
          <div>
            <label for="regFullName" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
              Full Name <span class="text-gx-primary">*</span>
            </label>
            <div class="relative">
              <app-icon name="user" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
              <input
                id="regFullName"
                type="text"
                formControlName="fullName"
                placeholder="e.g. Kasun Mendis"
                class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-4 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                [class.border-rose-500]="isFieldInvalid('fullName')"
              />
            </div>
            @if (isFieldInvalid('fullName')) {
              <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                <app-icon name="alert-circle" [size]="12" /> Please enter your full name.
              </div>
            }
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="regEmail" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
                Email Address <span class="text-gx-primary">*</span>
              </label>
              <div class="relative">
                <app-icon name="mail" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
                <input
                  id="regEmail"
                  type="email"
                  formControlName="email"
                  placeholder="name@example.lk"
                  class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-4 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                  [class.border-rose-500]="isFieldInvalid('email')"
                />
              </div>
              @if (isFieldInvalid('email')) {
                <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                  <app-icon name="alert-circle" [size]="12" /> Valid email is required.
                </div>
              }
            </div>

            <div>
              <label for="regPhone" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
                Phone Number <span class="text-gx-primary">*</span>
              </label>
              <div class="relative">
                <app-icon name="phone" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
                <input
                  id="regPhone"
                  type="tel"
                  formControlName="phone"
                  placeholder="+94 77 123 4567"
                  class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-4 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                  [class.border-rose-500]="isFieldInvalid('phone')"
                />
              </div>
              @if (isFieldInvalid('phone')) {
                <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                  <app-icon name="alert-circle" [size]="12" /> Valid phone required.
                </div>
              }
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label for="regPass" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
                Password <span class="text-gx-primary">*</span>
              </label>
              <div class="relative">
                <app-icon name="lock" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
                <input
                  id="regPass"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="password"
                  placeholder="At least 6 chars"
                  class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-4 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                  [class.border-rose-500]="isFieldInvalid('password')"
                />
              </div>
              @if (isFieldInvalid('password')) {
                <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                  <app-icon name="alert-circle" [size]="12" /> Min 6 characters.
                </div>
              }
            </div>

            <div>
              <label for="regConfirmPass" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
                Confirm Password <span class="text-gx-primary">*</span>
              </label>
              <div class="relative">
                <app-icon name="lock" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
                <input
                  id="regConfirmPass"
                  [type]="showPassword() ? 'text' : 'password'"
                  formControlName="confirmPassword"
                  placeholder="Re-enter password"
                  class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-11 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                  [class.border-rose-500]="isFieldInvalid('confirmPassword') || registerForm.hasError('mismatch')"
                />
                <button
                  type="button"
                  class="absolute right-4 top-1/2 -translate-y-1/2 text-gx-text-muted hover:text-white transition-colors cursor-pointer"
                  (click)="togglePassword()"
                  aria-label="Toggle password"
                >
                  <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" [size]="16" />
                </button>
              </div>
              @if (registerForm.hasError('mismatch') && (registerForm.get('confirmPassword')?.touched || registerForm.get('confirmPassword')?.dirty)) {
                <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                  <app-icon name="alert-circle" [size]="12" /> Passwords do not match.
                </div>
              }
            </div>
          </div>

          <button
            type="submit"
            [disabled]="isLoading()"
            class="bootlab-btn-primary w-full py-3.5 mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isLoading()) {
              <span>Creating Your Account...</span>
            } @else {
              <app-icon name="check" [size]="16" />
              <span>Register &amp; Proceed to Portal</span>
            }
          </button>
        </form>

        <div class="text-center text-xs text-gx-text-secondary mt-8 pt-6 border-t border-gx-border-subtle">
          <span>Already registered with Garagix?</span>
          <a routerLink="/auth/login" class="text-gx-primary hover:underline font-bold ml-1.5 font-display uppercase tracking-wider">
            Sign In
          </a>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private toast = inject(ToastService);

  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.required, Validators.pattern(/^[0-9+\s-]{8,15}$/)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', [Validators.required]],
    acceptTerms: [false, [Validators.requiredTrue]]
  }, {
    validators: (form: FormGroup) => {
      const p = form.get('password')?.value;
      const c = form.get('confirmPassword')?.value;
      return p === c ? null : { mismatch: true };
    }
  });

  isFieldInvalid(field: string): boolean {
    const ctrl = this.registerForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  onRegister(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.toast.showError('Please check form fields.');
      return;
    }

    this.isLoading.set(true);
    const { fullName, email, phone } = this.registerForm.value;

    setTimeout(() => {
      this.isLoading.set(false);
      this.authService.register(fullName, email, phone);
      this.router.navigate(['/customer/dashboard']);
    }, 800);
  }
}
