import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Vehicle } from '../models/vehicle.model';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

export interface CustomerWithVehicles extends User {
  vehicles?: Vehicle[];
}

/**
 * Service managing registered garage customers and their vehicle fleets.
 * Interacts with live .NET REST API endpoints with fallback cache and reactive Signals.
 */
@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/customers`;

  private _customers = signal<User[]>([]);
  private _vehicles = signal<Vehicle[]>([]);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly customers = this._customers.asReadonly();
  readonly vehicles = this._vehicles.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  constructor() {
    // If an admin user session is active, load the customer directory
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('garagix_user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u?.role === 'admin') {
            this.loadCustomers().subscribe();
          }
        }
      } catch {
        // Fall through
      }
    }
  }

  /**
   * Fetches all registered customer profiles from backend.
   * Admin-only secured endpoint.
   */
  loadCustomers(status?: string, search?: string): Observable<User[]> {
    this._loading.set(true);
    this._error.set(null);

    let params = new HttpParams();
    if (status && status !== 'ALL') params = params.set('status', status);
    if (search && search.trim()) params = params.set('search', search.trim());

    return this.http.get<CustomerWithVehicles[]>(this.apiUrl, { params }).pipe(
      tap({
        next: (items) => {
          this._customers.set(items ?? []);
          // Consolidate customer vehicles into vehicles signal
          const allVehs: Vehicle[] = [];
          for (const item of items ?? []) {
            if (item.vehicles && item.vehicles.length > 0) {
              allVehs.push(...item.vehicles);
            }
          }
          if (allVehs.length > 0) {
            this._vehicles.set(allVehs);
          }
          this._loading.set(false);
        },
        error: () => {
          this._error.set('Failed to load customer directory.');
          this._loading.set(false);
        }
      }),
      catchError(() => of(this._customers()))
    );
  }

  /**
   * Fetches a single customer profile by identifier.
   */
  getCustomerById(id: string): Observable<User> {
    return this.http.get<CustomerWithVehicles>(`${this.apiUrl}/${id}`).pipe(
      tap((cust) => {
        this._customers.update(list => {
          const idx = list.findIndex(c => c.id === cust.id);
          if (idx >= 0) {
            const copy = [...list];
            copy[idx] = cust;
            return copy;
          }
          return [...list, cust];
        });

        if (cust.vehicles && cust.vehicles.length > 0) {
          this._vehicles.update(curr => {
            const others = curr.filter(v => v.customerId !== cust.id);
            return [...others, ...(cust.vehicles || [])];
          });
        }
      })
    );
  }

  /**
   * Creates a new customer account.
   */
  createCustomer(data: { name: string; email: string; phone: string; address?: string; password?: string }): Observable<User> {
    return this.http.post<User>(this.apiUrl, data).pipe(
      tap((created) => {
        this._customers.update(list => [created, ...list]);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  /**
   * Updates an existing customer profile.
   */
  updateCustomer(id: string, updated: Partial<User>): Observable<User> {
    // Optimistic local update
    this._customers.update(curr =>
      curr.map(c => c.id === id ? { ...c, ...updated } : c)
    );

    return this.http.put<User>(`${this.apiUrl}/${id}`, updated).pipe(
      tap((res) => {
        this._customers.update(curr =>
          curr.map(c => c.id === id ? res : c)
        );
      }),
      catchError((err) => {
        this.loadCustomers().subscribe();
        return throwError(() => err);
      })
    );
  }

  /**
   * Toggles active/inactive status of a customer account.
   */
  toggleCustomerStatus(id: string): Observable<User> {
    // Optimistic local toggle
    this._customers.update(curr =>
      curr.map(c => c.id === id ? { ...c, status: c.status === 'active' ? 'inactive' : 'active' } : c)
    );

    return this.http.patch<User>(`${this.apiUrl}/${id}/status`, {}).pipe(
      tap((res) => {
        this._customers.update(curr =>
          curr.map(c => c.id === id ? res : c)
        );
      }),
      catchError((err) => {
        this.loadCustomers().subscribe();
        return throwError(() => err);
      })
    );
  }

  /**
   * Deletes a customer account.
   */
  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._customers.update(list => list.filter(c => c.id !== id));
        this._vehicles.update(list => list.filter(v => v.customerId !== id));
      })
    );
  }

  // ==========================================
  // VEHICLE FLEET METHODS
  // ==========================================

  /**
   * Returns registered vehicles cached for a specific customer.
   */
  getCustomerVehicles(customerId: string): Vehicle[] {
    return this._vehicles().filter(v => v.customerId === customerId);
  }

  /**
   * Fetches live vehicles for a customer from backend API.
   */
  loadCustomerVehicles(customerId: string): Observable<Vehicle[]> {
    return this.http.get<Vehicle[]>(`${this.apiUrl}/${customerId}/vehicles`).pipe(
      tap((vehs) => {
        this._vehicles.update(curr => {
          const others = curr.filter(v => v.customerId !== customerId);
          return [...others, ...(vehs ?? [])];
        });
      }),
      catchError(() => of(this.getCustomerVehicles(customerId)))
    );
  }

  /**
   * Registers a new vehicle under a customer via backend API.
   */
  addVehicle(vehicle: Omit<Vehicle, 'id'>): Observable<Vehicle> {
    return this.http.post<Vehicle>(`${this.apiUrl}/${vehicle.customerId}/vehicles`, {
      plateNumber: vehicle.plateNumber,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      type: vehicle.type,
      mileageKm: vehicle.mileageKm,
      vin: vehicle.vin,
      color: vehicle.color
    }).pipe(
      tap((created) => {
        this._vehicles.update(curr => [...curr.filter(v => v.id !== created.id), created]);
      })
    );
  }

  /**
   * Removes a vehicle from a customer's fleet via backend API.
   */
  removeVehicle(id: string, customerId?: string): Observable<void> {
    const v = this._vehicles().find(x => x.id === id);
    const targetCustId = customerId || v?.customerId;

    this._vehicles.update(curr => curr.filter(item => item.id !== id));

    if (targetCustId) {
      return this.http.delete<void>(`${this.apiUrl}/${targetCustId}/vehicles/${id}`).pipe(
        catchError((err) => {
          if (v) {
            this._vehicles.update(curr => [...curr, v]);
          }
          return throwError(() => err);
        })
      );
    }

    return of(undefined as unknown as void);
  }
}
