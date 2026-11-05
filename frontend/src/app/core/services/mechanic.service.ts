import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import {
  Mechanic,
  CreateMechanicDto,
  UpdateMechanicDto
} from '../models/mechanic.model';
import { environment } from '../../../environments/environment';

/**
 * Service managing workshop master technicians.
 * Communicates with live backend REST API endpoints and manages reactive Signal state.
 */
@Injectable({
  providedIn: 'root'
})
export class MechanicService {
  private http = inject(HttpClient);
  private mechanicsUrl = `${environment.apiUrl}/mechanics`;

  private mechanicsSignal = signal<Mechanic[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly mechanics = this.mechanicsSignal.asReadonly();
  readonly isLoading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  constructor() {
    this.loadMechanics().subscribe({
      error: (err) => console.error('Failed to load initial mechanics:', err)
    });
  }

  /**
   * Fetches all technicians from the backend API.
   * Publicly accessible without authentication.
   */
  loadMechanics(status?: string, search?: string): Observable<Mechanic[]> {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    let params = new HttpParams();
    if (status) params = params.set('status', status);
    if (search && search.trim()) params = params.set('search', search.trim());

    return this.http.get<Mechanic[]>(this.mechanicsUrl, { params }).pipe(
      tap({
        next: (items) => {
          this.mechanicsSignal.set(items ?? []);
          this.loadingSignal.set(false);
        },
        error: () => {
          this.errorSignal.set('Failed to load technicians from server.');
          this.loadingSignal.set(false);
        }
      }),
      catchError(() => of(this.mechanicsSignal()))
    );
  }

  /**
   * Returns a cached mechanic by unique identifier.
   */
  getMechanicById(id: string): Mechanic | undefined {
    return this.mechanicsSignal().find(m => m.id === id);
  }

  /**
   * Fetches single mechanic directly from backend API.
   */
  fetchMechanicById(id: string): Observable<Mechanic> {
    return this.http.get<Mechanic>(`${this.mechanicsUrl}/${id}`).pipe(
      tap((mech) => {
        this.mechanicsSignal.update(current => {
          const idx = current.findIndex(m => m.id === mech.id);
          if (idx >= 0) {
            const copy = [...current];
            copy[idx] = mech;
            return copy;
          }
          return [...current, mech];
        });
      })
    );
  }

  /**
   * Registers a new technician (Admin only).
   */
  addMechanic(mechanic: CreateMechanicDto): Observable<Mechanic> {
    return this.http.post<Mechanic>(this.mechanicsUrl, mechanic).pipe(
      tap((created) => {
        this.mechanicsSignal.update(list => [...list, created]);
      }),
      catchError((err) => throwError(() => err))
    );
  }

  /**
   * Updates an existing technician (Admin only).
   */
  updateMechanic(id: string, updates: UpdateMechanicDto): Observable<Mechanic> {
    return this.http.put<Mechanic>(`${this.mechanicsUrl}/${id}`, updates).pipe(
      tap((updated) => {
        this.mechanicsSignal.update(list =>
          list.map(m => (m.id === id ? updated : m))
        );
      }),
      catchError((err) => throwError(() => err))
    );
  }

  /**
   * Deletes a technician from the roster (Admin only).
   */
  deleteMechanic(id: string): Observable<void> {
    return this.http.delete<void>(`${this.mechanicsUrl}/${id}`).pipe(
      tap(() => {
        this.mechanicsSignal.update(list => list.filter(m => m.id !== id));
      }),
      catchError((err) => throwError(() => err))
    );
  }

  /**
   * Updates availability status of a technician.
   */
  updateMechanicStatus(id: string, status: 'available' | 'busy' | 'on_leave'): Observable<Mechanic> {
    return this.http.patch<Mechanic>(`${this.mechanicsUrl}/${id}/status`, null, {
      params: { status }
    }).pipe(
      tap((updated) => {
        this.mechanicsSignal.update(list =>
          list.map(m => (m.id === id ? updated : m))
        );
      })
    );
  }

  getFeaturedMechanics(limit: number = 3): Mechanic[] {
    return this.mechanicsSignal().slice(0, limit);
  }

  getAvailableMechanics(): Mechanic[] {
    return this.mechanicsSignal().filter(m => m.status === 'available');
  }

  incrementBookingCount(id: string): void {
    const mech = this.getMechanicById(id);
    if (mech) {
      this.updateMechanic(id, { assignedBookingsCount: (mech.assignedBookingsCount || 0) + 1 }).subscribe();
    }
  }

  decrementBookingCount(id: string): void {
    const mech = this.getMechanicById(id);
    if (mech && mech.assignedBookingsCount > 0) {
      this.updateMechanic(id, { assignedBookingsCount: mech.assignedBookingsCount - 1 }).subscribe();
    }
  }
}
