import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {
  User,
  UserRole,
  LoginRequest,
  RegisterRequest,
  SendRegistrationOtpRequest,
  VerifyRegistrationOtpRequest,
  RegistrationOtpResponse,
  ForgotPasswordRequest,
  VerifyOtpRequest,
  ResetPasswordRequest,
  AuthResponse,
  ForgotPasswordResponse,
  VerifyOtpResponse,
  ResetPasswordResponse
} from '../models/auth.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly STORAGE_USER_KEY = environment.userKey;
  private readonly STORAGE_TOKEN_KEY = environment.tokenKey;

  // Reactive state using Angular Signals
  private readonly _currentUser = signal<User | null>(this.getInitialUser());
  readonly currentUser = this._currentUser.asReadonly();

  private readonly _token = signal<string | null>(this.getInitialToken());
  readonly token = this._token.asReadonly();

  readonly isAuthenticated = computed<boolean>(() => this._currentUser() !== null);
  readonly userRole = computed<UserRole>(() => this._currentUser()?.role ?? 'customer');
  readonly isAdmin = computed<boolean>(() => this._currentUser()?.role === 'admin');
  readonly isCustomer = computed<boolean>(() => this._currentUser()?.role === 'customer');

  /**
   * Reads persistent user from localStorage upon initial app load.
   * Returns null if unauthenticated so guests are strictly protected by route guards.
   */
  private getInitialUser(): User | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(this.STORAGE_USER_KEY);
      if (stored) {
        return JSON.parse(stored) as User;
      }
    } catch {
      // Fall through to null on parse failure
    }
    return null;
  }

  /**
   * Reads stored JWT token from localStorage.
   */
  private getInitialToken(): string | null {
    if (typeof window === 'undefined') return null;
    try {
      return localStorage.getItem(this.STORAGE_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  /**
   * Persists active user session and updates signals.
   */
  setSession(user: User, token: string): void {
    this._currentUser.set(user);
    this._token.set(token);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
        localStorage.setItem(this.STORAGE_TOKEN_KEY, token);
      } catch {
        // Handle storage quota or privacy mode errors
      }
    }
  }

  /**
   * Clears stored credentials and resets signals.
   */
  clearSession(): void {
    this._currentUser.set(null);
    this._token.set(null);
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(this.STORAGE_USER_KEY);
        localStorage.removeItem(this.STORAGE_TOKEN_KEY);
      } catch {
        // Handle storage errors
      }
    }
  }

  /**
   * Gets current JWT token synchronously.
   */
  getToken(): string | null {
    return this._token();
  }

  /**
   * Authenticate user with backend API.
   */
  login(
    credentialsOrEmail: LoginRequest | string,
    pass?: string,
    role: UserRole = 'customer',
    rememberMe = false
  ): Observable<AuthResponse> {
    const payload: LoginRequest = typeof credentialsOrEmail === 'string'
      ? { email: credentialsOrEmail, password: pass ?? '', role, rememberMe }
      : credentialsOrEmail;

    return this.http.post<AuthResponse>(`${this.API_URL}/login`, payload).pipe(
      tap(res => {
        if (res.user && res.token) {
          this.setSession(res.user, res.token);
          this.toastService.showSuccess(`Welcome back, ${res.user.name}!`, 'Signed In');
        }
      })
    );
  }

  /**
   * Register a new customer account with backend API.
   */
  register(
    requestOrFullName: RegisterRequest | string,
    email?: string,
    phone?: string,
    password = 'Password@123'
  ): Observable<AuthResponse> {
    const payload: RegisterRequest = typeof requestOrFullName === 'string'
      ? {
          fullName: requestOrFullName,
          email: email ?? '',
          phone: phone ?? '',
          password,
          confirmPassword: password,
          role: 'customer'
        }
      : {
          ...requestOrFullName,
          confirmPassword: requestOrFullName.confirmPassword ?? requestOrFullName.password,
          role: requestOrFullName.role ?? 'customer'
        };

    return this.http.post<AuthResponse>(`${this.API_URL}/register`, payload).pipe(
      tap(res => {
        if (res.user && res.token) {
          this.setSession(res.user, res.token);
          this.toastService.showSuccess(`Account registered successfully. Welcome, ${payload.fullName}!`);
        }
      })
    );
  }

  /**
   * Step 1 of registration: Request 6-digit email OTP for new user registration
   */
  sendRegistrationOtp(request: SendRegistrationOtpRequest): Observable<RegistrationOtpResponse> {
    return this.http.post<RegistrationOtpResponse>(`${this.API_URL}/register/send-otp`, request);
  }

  /**
   * Step 2 of registration: Verify OTP and create account
   */
  verifyRegistrationOtp(request: VerifyRegistrationOtpRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/register/verify-otp`, request).pipe(
      tap(res => {
        if (res.user && res.token) {
          this.setSession(res.user, res.token);
          this.toastService.showSuccess(`Account registered successfully. Welcome, ${res.user.name}!`);
        }
      })
    );
  }

  /**
   * Step 1: Request 6-digit OTP code for password recovery
   */
  forgotPassword(emailOrRequest: string | ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    const payload: ForgotPasswordRequest = typeof emailOrRequest === 'string'
      ? { email: emailOrRequest }
      : emailOrRequest;

    return this.http.post<ForgotPasswordResponse>(`${this.API_URL}/forgot-password`, payload);
  }

  /**
   * Step 2: Validate 6-digit OTP code
   */
  verifyOtp(emailOrRequest: string | VerifyOtpRequest, otp?: string): Observable<VerifyOtpResponse> {
    const payload: VerifyOtpRequest = typeof emailOrRequest === 'string'
      ? { email: emailOrRequest, otp: otp ?? '' }
      : emailOrRequest;

    return this.http.post<VerifyOtpResponse>(`${this.API_URL}/verify-otp`, payload);
  }

  /**
   * Step 3: Complete password reset with new password
   */
  resetPassword(
    requestOrEmail: ResetPasswordRequest | string,
    otp?: string,
    newPassword?: string
  ): Observable<ResetPasswordResponse> {
    const payload: ResetPasswordRequest = typeof requestOrEmail === 'string'
      ? {
          email: requestOrEmail,
          otp: otp ?? '',
          newPassword: newPassword ?? '',
          confirmPassword: newPassword ?? ''
        }
      : requestOrEmail;

    return this.http.post<ResetPasswordResponse>(`${this.API_URL}/reset-password`, payload);
  }

  /**
   * Retrieve current user profile with JWT (token attached automatically by authInterceptor)
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`).pipe(
      tap(user => {
        if (user) {
          this._currentUser.set(user);
          if (typeof window !== 'undefined') {
            try {
              localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
            } catch {}
          }
        }
      })
    );
  }

  /**
   * Update user profile in state and local storage
   */
  updateProfile(updated: Partial<User>): void {
    const current = this._currentUser();
    if (current) {
      const merged = { ...current, ...updated };
      this._currentUser.set(merged);
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(merged));
        } catch {}
      }
      this.toastService.showSuccess('Profile updated successfully!');
    }
  }

  /**
   * Sign out and clear stored session
   */
  logout(): void {
    this.clearSession();
    this.toastService.showInfo('You have been logged out.');
    this.router.navigate(['/auth/login']);
  }
}
