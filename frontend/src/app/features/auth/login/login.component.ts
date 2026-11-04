import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { IconComponent } from '../../../shared/components/icon/icon.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, IconComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="bg-gx-canvas min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden">
      <!-- Ambient Workshop Red Glow -->
      <div class="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(215,0,6,0.12)_0%,_transparent_65%)] pointer-events-none"></div>

      <div class="w-full max-w-[480px] bg-gx-card border border-[#292929] p-8 sm:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.85)] relative z-10 my-8">
        <div class="text-center mb-8">
          <h2 class="font-display text-2xl sm:text-3xl font-bold text-white mb-1 tracking-wide">Welcome Back</h2>
          <p class="text-xs sm:text-sm text-gx-text-secondary leading-relaxed">Access your customer repair tracking or workshop management console.</p>
        </div>

        <!-- Quick 1-Click Demo Login Bar -->
        <div class="bg-[#0e0d0d] border border-[#222222] p-3.5 mb-6">
          <div class="text-[0.6875rem] font-bold text-gx-primary uppercase tracking-widest text-center mb-2.5 font-display">QUICK DEMO ONE-CLICK ACCESS</div>
          <div class="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              class="px-3 py-2.5 bg-[#141314] border border-[#292929] hover:border-emerald-500 hover:text-emerald-400 text-xs font-display font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              (click)="authService.quickCustomerLogin()"
            >
              <app-icon name="user" [size]="14" strokeColor="#34d399" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              class="px-3 py-2.5 bg-[#141314] border border-[#292929] hover:border-gx-primary hover:text-gx-primary text-xs font-display font-bold uppercase tracking-wider text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
              (click)="authService.quickAdminLogin()"
            >
              <app-icon name="shield" [size]="14" strokeColor="#d70006" />
              <span>Admin Demo</span>
            </button>
          </div>
        </div>

        <!-- Main Login Form -->
        <form [formGroup]="loginForm" (ngSubmit)="onLogin()" class="space-y-4">
          @if (errorMessage()) {
            <div class="bg-[#2a1015] border border-rose-500/50 p-3.5 flex items-center gap-2.5 text-xs text-rose-300">
              <app-icon name="alert-circle" [size]="16" strokeColor="#f43f5e" class="shrink-0" />
              <span>{{ errorMessage() }}</span>
            </div>
          }

          <div>
            <label for="loginEmail" class="block text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary mb-1.5">
              Email Address <span class="text-gx-primary">*</span>
            </label>
            <div class="relative">
              <app-icon name="mail" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
              <input
                id="loginEmail"
                type="email"
                formControlName="email"
                placeholder="name@example.lk"
                class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-4 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                [class.border-rose-500]="isFieldInvalid('email')"
              />
            </div>
            @if (isFieldInvalid('email')) {
              <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                <app-icon name="alert-circle" [size]="12" /> Enter a valid email address.
              </div>
            }
          </div>

          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label for="loginPassword" class="text-xs font-bold font-display uppercase tracking-wider text-gx-text-secondary">
                Password <span class="text-gx-primary">*</span>
              </label>
              <a routerLink="/auth/forgot-password" class="text-xs text-gx-text-muted hover:text-gx-primary transition-colors font-display tracking-wider">
                Forgot password?
              </a>
            </div>
            <div class="relative">
              <app-icon name="lock" [size]="16" class="absolute left-4 top-1/2 -translate-y-1/2 text-gx-text-muted pointer-events-none" />
              <input
                id="loginPassword"
                [type]="showPassword() ? 'text' : 'password'"
                formControlName="password"
                placeholder="Enter password..."
                class="w-full bg-[#0e0d0d] border border-[#292929] pl-11 pr-11 py-3 text-white placeholder-gx-text-muted text-sm font-sans focus:outline-none focus:border-gx-primary transition-colors"
                [class.border-rose-500]="isFieldInvalid('password')"
              />
              <button
                type="button"
                class="absolute right-4 top-1/2 -translate-y-1/2 text-gx-text-muted hover:text-white transition-colors cursor-pointer"
                (click)="togglePasswordVisibility()"
                aria-label="Toggle password visibility"
              >
                <app-icon [name]="showPassword() ? 'eye-off' : 'eye'" [size]="16" />
              </button>
            </div>
            @if (isFieldInvalid('password')) {
              <div class="text-[0.6875rem] text-rose-400 mt-1 flex items-center gap-1 font-sans">
                <app-icon name="alert-circle" [size]="12" /> Password is required (min 6 chars).
              </div>
            }
          </div>

          <button
            type="submit"
            [disabled]="isLoading()"
            class="bootlab-btn-primary w-full py-3.5 mt-4 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            @if (isLoading()) {
              <span>Authenticating...</span>
            } @else {
              <app-icon name="log-in" [size]="16" />
              <span>Sign In</span>
            }
          </button>
        </form>

        <div class="text-center text-xs text-gx-text-secondary mt-8 pt-6 border-t border-gx-border-subtle">
          <span>Don't have an account yet?</span>
          <a routerLink="/auth/register" class="text-gx-primary hover:underline font-bold ml-1.5 font-display uppercase tracking-wider">
            Register New Account
          </a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string>('');
  showPassword = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  isFieldInvalid(field: string): boolean {
    const ctrl = this.loginForm.get(field);
    return !!(ctrl && ctrl.invalid && (ctrl.dirty || ctrl.touched));
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(v => !v);
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const email = this.loginForm.get('email')?.value;
    const pass = this.loginForm.get('password')?.value;
    const rememberMe = this.loginForm.get('rememberMe')?.value || false;

    this.authService.login(email, pass, 'customer', rememberMe).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const returnUrl = this.route.snapshot.queryParams['returnUrl'];
        if (returnUrl) {
          this.router.navigateByUrl(returnUrl);
        } else if (res.user?.role === 'admin') {
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.router.navigate(['/customer/dashboard']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(err.error?.message || 'Invalid email address or password.');
      }
    });
  }
}
