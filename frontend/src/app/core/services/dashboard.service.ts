import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AdminDashboardData, CustomerDashboardData } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/dashboard`;

  private _adminDashboard = signal<AdminDashboardData | null>(null);
  private _customerDashboard = signal<CustomerDashboardData | null>(null);
  private _isLoadingAdmin = signal<boolean>(false);
  private _isLoadingCustomer = signal<boolean>(false);

  readonly adminDashboard = this._adminDashboard.asReadonly();
  readonly customerDashboard = this._customerDashboard.asReadonly();
  readonly isLoadingAdmin = this._isLoadingAdmin.asReadonly();
  readonly isLoadingCustomer = this._isLoadingCustomer.asReadonly();

  /**
   * Fetches unified workshop control HQ metrics, trends, category revenue, and appointments for administrators.
   */
  loadAdminDashboard(): Observable<AdminDashboardData | null> {
    this._isLoadingAdmin.set(true);
    return this.http.get<AdminDashboardData>(`${this.apiUrl}/admin`).pipe(
      tap({
        next: (data) => {
          this._adminDashboard.set(data);
          this._isLoadingAdmin.set(false);
        },
        error: (err) => {
          console.warn('Failed to load admin dashboard via API, keeping fallback state:', err);
          this._isLoadingAdmin.set(false);
        }
      }),
      catchError(() => of(this._adminDashboard()))
    );
  }

  /**
   * Fetches customer garage fleet records, active repair telemetry, upcoming visits, and summary metrics.
   * If customerId is omitted, securely defaults to current authenticated customer.
   */
  loadCustomerDashboard(customerId?: string): Observable<CustomerDashboardData | null> {
    this._isLoadingCustomer.set(true);
    const url = customerId ? `${this.apiUrl}/customer/${encodeURIComponent(customerId)}` : `${this.apiUrl}/customer`;

    return this.http.get<CustomerDashboardData>(url).pipe(
      tap({
        next: (data) => {
          this._customerDashboard.set(data);
          this._isLoadingCustomer.set(false);
        },
        error: (err) => {
          console.warn('Failed to load customer dashboard via API, keeping fallback state:', err);
          this._isLoadingCustomer.set(false);
        }
      }),
      catchError(() => of(this._customerDashboard()))
    );
  }
}

