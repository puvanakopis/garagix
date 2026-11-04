import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { tap, catchError, shareReplay } from 'rxjs/operators';
import { User, UserRole, AuthResponse, ForgotPasswordResponse } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private toastService = inject(ToastService);

  private readonly API_URL = 'http://localhost:5203/api/auth';
  private readonly STORAGE_USER_KEY = 'garagix_auth_user';
  private readonly STORAGE_TOKEN_KEY = 'garagix_auth_token';

  readonly defaultCustomer: User = {
    id: 'cust-101',
    name: 'Kasun Mendis',
    email: 'kasun.mendis@example.lk',
    phone: '+94 77 123 4567',
    address: 'No. 42/B, Flower Road, Colombo 07, Sri Lanka',
    role: 'customer',
    createdAt: '2024-03-01T00:00:00Z',
    totalBookings: 4,
    status: 'active'
  };

  readonly defaultAdmin: User = {
    id: 'admin-001',
    name: 'Priyantha Jayasuriya',
    email: 'admin@garagix.lk',
    phone: '+94 11 234 5678',
    address: 'Garagix Workshop HQ, Nawala Road, Colombo',
    role: 'admin',
    createdAt: '2022-01-15T00:00:00Z',
    totalBookings: 0,
    status: 'active'
  };

  private _currentUser = signal<User | null>(this.getInitialUser());
  currentUser = this._currentUser.asReadonly();

  private _token = signal<string | null>(this.getInitialToken());
  token = this._token.asReadonly();

  isAuthenticated = computed(() => this._currentUser() !== null);
  userRole = computed<UserRole>(() => this._currentUser()?.role ?? 'customer');
  isAdmin = computed(() => this._currentUser()?.role === 'admin');
  isCustomer = computed(() => this._currentUser()?.role === 'customer');

  private getInitialUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_USER_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return this.defaultCustomer;
  }

  private getInitialToken(): string | null {
    try {
      return localStorage.getItem(this.STORAGE_TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private setSession(user: User, token: string): void {
    this._currentUser.set(user);
    this._token.set(token);
    try {
      localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.STORAGE_TOKEN_KEY, token);
    } catch {}
  }

  getToken(): string | null {
    return this._token();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    });
  }

  /**
   * Authenticate user with .NET backend API
   */
  login(email: string, pass: string, role: UserRole = 'customer', rememberMe = false): Observable<AuthResponse> {
    const obs$ = this.http.post<AuthResponse>(`${this.API_URL}/login`, {
      email,
      password: pass,
      rememberMe,
      role
    }).pipe(
      tap(res => {
        if (res.user && res.token) {
          this.setSession(res.user, res.token);
          this.toastService.showSuccess(`Welcome back, ${res.user.name}!`, 'Signed In');
        }
      }),
      catchError(err => {
        // If backend is unreachable, gracefully fall back to local demo login
        if (err.status === 0) {
          const user: User = (role === 'admin' || email.toLowerCase().includes('admin'))
            ? { ...this.defaultAdmin, email }
            : { ...this.defaultCustomer, email, name: email.split('@')[0] || 'Valued Customer' };

          this.setSession(user, 'offline-demo-token');
          this.toastService.showSuccess(`Welcome back, ${user.name}! (Offline Demo Mode)`, 'Signed In');
          return of({
            success: true,
            message: 'Signed in via offline demo fallback.',
            token: 'offline-demo-token',
            user
          });
        }
        return throwError(() => err);
      }),
      shareReplay(1)
    );

    // Auto-subscribe in case existing synchronous callers do not subscribe
    obs$.subscribe({ error: () => {} });
    return obs$;
  }

  /**
   * Register new customer account with .NET backend API
   */
  register(fullName: string, email: string, phone: string, password = 'Password@123'): Observable<AuthResponse> {
    const obs$ = this.http.post<AuthResponse>(`${this.API_URL}/register`, {
      fullName,
      email,
      phone,
      password,
      confirmPassword: password,
      role: 'customer'
    }).pipe(
      tap(res => {
        if (res.user && res.token) {
          this.setSession(res.user, res.token);
          this.toastService.showSuccess(`Account registered successfully. Welcome, ${fullName}!`);
        }
      }),
      catchError(err => {
        // Offline demo fallback if backend is unreachable
        if (err.status === 0) {
          const newUser: User = {
            id: 'cust-' + Math.floor(100 + Math.random() * 900),
            name: fullName,
            email,
            phone,
            role: 'customer',
            createdAt: new Date().toISOString(),
            totalBookings: 0,
            status: 'active'
          };
          this.setSession(newUser, 'offline-demo-token');
          this.toastService.showSuccess(`Account registered successfully. Welcome, ${fullName}! (Offline Mode)`);
          return of({
            success: true,
            message: 'Registered in offline demo mode.',
            token: 'offline-demo-token',
            user: newUser
          });
        }
        return throwError(() => err);
      }),
      shareReplay(1)
    );

    obs$.subscribe({ error: () => {} });
    return obs$;
  }

  /**
   * Step 1: Request 6-digit OTP code for password recovery
   */
  forgotPassword(email: string): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.API_URL}/forgot-password`, { email });
  }

  /**
   * Step 2: Validate 6-digit OTP code
   */
  verifyOtp(email: string, otp: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.API_URL}/verify-otp`, { email, otp });
  }

  /**
   * Step 3: Complete password reset with new password
   */
  resetPassword(email: string, otp: string, newPassword: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.API_URL}/reset-password`, {
      email,
      otp,
      newPassword,
      confirmPassword: newPassword
    });
  }

  /**
   * Retrieve current user profile with JWT
   */
  getProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_URL}/me`, { headers: this.getAuthHeaders() }).pipe(
      tap(user => {
        if (user) {
          this._currentUser.set(user);
          localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(user));
        }
      })
    );
  }

  /**
   * Quick 1-Click Customer Demo Login
   */
  quickCustomerLogin(): void {
    this.login('kasun.mendis@example.lk', 'Customer@123', 'customer').subscribe({
      next: () => {
        this.toastService.showSuccess('Logged in as Customer (Demo)', 'Portal Access Granted');
        this.router.navigate(['/customer/dashboard']);
      },
      error: () => {
        this.setSession(this.defaultCustomer, 'mock-jwt-customer-token');
        this.toastService.showSuccess('Logged in as Customer (Offline Mode)', 'Portal Access Granted');
        this.router.navigate(['/customer/dashboard']);
      }
    });
  }

  /**
   * Quick 1-Click Admin Demo Login
   */
  quickAdminLogin(): void {
    this.login('admin@garagix.lk', 'Admin@123', 'admin').subscribe({
      next: () => {
        this.toastService.showSuccess('Logged in as Workshop Administrator (Demo)', 'Admin Access Granted');
        this.router.navigate(['/admin/dashboard']);
      },
      error: () => {
        this.setSession(this.defaultAdmin, 'mock-jwt-admin-token');
        this.toastService.showSuccess('Logged in as Admin (Offline Mode)', 'Admin Access Granted');
        this.router.navigate(['/admin/dashboard']);
      }
    });
  }

  /**
   * Update user profile in state and local storage
   */
  updateProfile(updated: Partial<User>): void {
    const current = this._currentUser();
    if (current) {
      const merged = { ...current, ...updated };
      this._currentUser.set(merged);
      try {
        localStorage.setItem(this.STORAGE_USER_KEY, JSON.stringify(merged));
      } catch {}
      this.toastService.showSuccess('Profile updated successfully!');
    }
  }

  /**
   * Sign out and clear stored session
   */
  logout(): void {
    this._currentUser.set(null);
    this._token.set(null);
    try {
      localStorage.removeItem(this.STORAGE_USER_KEY);
      localStorage.removeItem(this.STORAGE_TOKEN_KEY);
    } catch {}
    this.toastService.showInfo('You have been logged out.');
    this.router.navigate(['/auth/login']);
  }
}
