import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { CarService, ServiceCategory } from '../models/service.model';
import { environment } from '../../../environments/environment';

/**
 * Service providing vehicle service catalog operations.
 * Communicates exclusively with the backend API without hardcoded mock records.
 */
@Injectable({
  providedIn: 'root'
})
export class ServiceCatalogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/services`;

  // Start with an empty collection; populated strictly via API
  private _services = signal<CarService[]>([]);
  services = this._services.asReadonly();
  loading = signal<boolean>(false);
  error = signal<string | null>(null);

  categories = signal<ServiceCategory[]>([
    'Maintenance',
    'Diagnostics',
    'Engine & Transmission',
    'Brakes & Tires',
    'Electrical & Battery',
    'AC & Climate',
    'Body & Detailing'
  ]);

  constructor() {
    // Automatically load live services from backend API upon application startup
    this.loadServices().subscribe({
      error: (err) => console.error('Failed to load initial services from API:', err)
    });
  }

  /**
   * Fetches service packages from the backend API.
   * Public users can call this without authentication.
   * @param activeOnly If true, filters for active services only. If false/omitted, gets all.
   * @param category Optional category filter.
   * @param search Optional search keyword.
   */
  loadServices(activeOnly?: boolean, category?: string, search?: string): Observable<CarService[]> {
    this.loading.set(true);
    this.error.set(null);

    let params = new HttpParams();
    if (activeOnly !== undefined) {
      params = params.set('activeOnly', activeOnly.toString());
    }
    if (category && category !== 'ALL') {
      params = params.set('category', category);
    }
    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<CarService[]>(this.apiUrl, { params }).pipe(
      tap({
        next: (items) => {
          this._services.set(items ?? []);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to load services from server.');
          this.loading.set(false);
        }
      }),
      catchError((err) => {
        return of(this._services());
      })
    );
  }

  /**
   * Retrieves single service details by ID or URL slug from the backend API.
   * Publicly accessible without login.
   */
  fetchServiceByIdOrSlug(idOrSlug: string): Observable<CarService> {
    return this.http.get<CarService>(`${this.apiUrl}/${idOrSlug}`).pipe(
      tap((service) => {
        // If not already in cache or updated, merge into local signal
        this._services.update(current => {
          const exists = current.some(s => s.id === service.id);
          return exists ? current.map(s => s.id === service.id ? service : s) : [...current, service];
        });
      }),
      catchError((err) => throwError(() => err))
    );
  }

  /**
   * Returns currently cached services from the local reactive signal.
   */
  getServices(): CarService[] {
    return this._services();
  }

  /**
   * Finds a service by primary identifier or slug from the local reactive signal.
   */
  getServiceById(id: string): CarService | undefined {
    return this._services().find(s => s.id === id || s.slug === id);
  }

  /**
   * Creates a new service package on the backend API.
   * Restricted to administrators.
   */
  createService(service: Omit<CarService, 'id'>): Observable<CarService> {
    this.loading.set(true);
    return this.http.post<CarService>(this.apiUrl, service).pipe(
      tap((created) => {
        this._services.update(current => [created, ...current.filter(s => s.id !== created.id)]);
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Updates an existing service package on the backend API.
   * Restricted to administrators.
   */
  updateService(id: string, updated: Partial<CarService>): Observable<CarService> {
    this.loading.set(true);
    return this.http.put<CarService>(`${this.apiUrl}/${id}`, updated).pipe(
      tap((saved) => {
        this._services.update(current =>
          current.map(s => s.id === id ? { ...s, ...saved } : s)
        );
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Deletes a service package on the backend API.
   * Restricted to administrators.
   */
  deleteService(id: string): Observable<void> {
    this.loading.set(true);
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(
      tap(() => {
        this._services.update(current => current.filter(s => s.id !== id));
        this.loading.set(false);
      }),
      catchError((err) => {
        this.loading.set(false);
        return throwError(() => err);
      })
    );
  }

  /**
   * Backward-compatible helper method to add a service package.
   */
  addService(service: Omit<CarService, 'id'>): void {
    this.createService(service).subscribe({
      error: (err) => console.error('Error adding service package:', err)
    });
  }
}
