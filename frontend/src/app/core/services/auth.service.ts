import { Injectable, signal, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User, UserRole } from '../models/user.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private router = inject(Router);
  private toastService = inject(ToastService);

  private readonly STORAGE_KEY = 'garagix_auth_user';

  private defaultCustomer: User = {
    id: 'cust-101',
    name: 'Kasun Mendis',
    email: 'kasun.mendis@example.lk',
    phone: '+94 77 123 4567',
    address: 'No. 42/B, Flower Road, Colombo 07, Sri Lanka',
    role: 'customer',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    memberSince: 'March 2024',
    totalBookings: 4,
    status: 'active'
  };

  private defaultAdmin: User = {
    id: 'admin-001',
    name: 'Priyantha Jayasuriya',
    email: 'admin@garagix.lk',
    phone: '+94 11 234 5678',
    address: 'Garagix Workshop HQ, Nawala Road, Colombo',
    role: 'admin',
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    memberSince: 'January 2022',
    status: 'active'
  };

  private _currentUser = signal<User | null>(this.getInitialUser());
  currentUser = this._currentUser.asReadonly();

  isAuthenticated = computed(() => this._currentUser() !== null);
  userRole = computed<UserRole>(() => this._currentUser()?.role ?? 'guest');
  isAdmin = computed(() => this._currentUser()?.role === 'admin');
  isCustomer = computed(() => this._currentUser()?.role === 'customer');

  private getInitialUser(): User | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // fallback
    }
    return this.defaultCustomer;
  }

  login(email: string, pass: string, role: UserRole = 'customer'): boolean {
    let user: User;
    if (role === 'admin' || email.toLowerCase().includes('admin')) {
      user = { ...this.defaultAdmin, email };
    } else {
      user = { ...this.defaultCustomer, email, name: email.split('@')[0] || 'Valued Customer' };
    }

    this._currentUser.set(user);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(user));
    } catch {}

    this.toastService.showSuccess(`Welcome back, ${user.name}!`, 'Signed In');
    return true;
  }

  quickCustomerLogin(): void {
    this._currentUser.set(this.defaultCustomer);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultCustomer));
    } catch {}
    this.toastService.showSuccess('Logged in as Customer (Demo)', 'Portal Access Granted');
    this.router.navigate(['/customer/dashboard']);
  }

  quickAdminLogin(): void {
    this._currentUser.set(this.defaultAdmin);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.defaultAdmin));
    } catch {}
    this.toastService.showSuccess('Logged in as Workshop Administrator (Demo)', 'Admin Access Granted');
    this.router.navigate(['/admin/dashboard']);
  }

  register(fullName: string, email: string, phone: string): boolean {
    const newUser: User = {
      id: 'cust-' + Math.floor(100 + Math.random() * 900),
      name: fullName,
      email,
      phone,
      role: 'customer',
      memberSince: 'Just now',
      totalBookings: 0,
      status: 'active',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
    };

    this._currentUser.set(newUser);
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(newUser));
    } catch {}

    this.toastService.showSuccess(`Account registered successfully. Welcome, ${fullName}!`);
    return true;
  }

  updateProfile(updated: Partial<User>): void {
    const current = this._currentUser();
    if (current) {
      const merged = { ...current, ...updated };
      this._currentUser.set(merged);
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
      } catch {}
      this.toastService.showSuccess('Profile updated successfully!');
    }
  }

  logout(): void {
    this._currentUser.set(null);
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch {}
    this.toastService.showInfo('You have been logged out.');
    this.router.navigate(['/auth/login']);
  }
}
