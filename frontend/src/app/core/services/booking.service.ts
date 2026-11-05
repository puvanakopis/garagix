import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { Booking, BookingStatus, RepairProgressStep, RepairStatus } from '../models/booking.model';
import { environment } from '../../../environments/environment';

export interface CreateBookingPayload {
  customerId?: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  vehicle: {
    plateNumber: string;
    brand: string;
    model: string;
    year: number;
    mileageKm?: number;
  };
  serviceIds: string[];
  serviceNames?: string[];
  problemDescription: string;
  symptoms?: string[];
  damageImages?: string[];
  preferredMechanicId?: string;
  preferredMechanicName?: string;
  appointmentDate: string;
  appointmentTime: string;
  dropOffOption: 'drop_off' | 'wait_at_lounge';
  estimatedPriceLkr: number;
}

/**
 * Service managing workshop appointments, repair lifecycle, mechanic assignments, and live customer telemetry.
 * Connects Angular clients to .NET Core /api/bookings RESTful endpoints with reactive Signals state.
 */
@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/bookings`;

  private initialBookings: Booking[] = [
    {
      id: 'book-1',
      referenceNumber: 'GRX-2026-8941',
      customerId: 'cust-101',
      customerName: 'Kasun Mendis',
      customerPhone: '+94 77 123 4567',
      customerEmail: 'kasun.mendis@example.lk',
      vehicle: {
        plateNumber: 'WP CAD-4821',
        brand: 'Toyota',
        model: 'Prius Hybrid',
        year: 2018,
        mileageKm: 64200
      },
      serviceIds: ['srv-7', 'srv-1'],
      serviceNames: ['Battery & Hybrid System Check', 'General Car Maintenance'],
      problemDescription: 'Hybrid check warning came on during highway driving; slight hesitation when starting from traffic lights.',
      symptoms: ['Check Hybrid Light', 'Engine revs loudly', 'Hesitation'],
      damageImages: [],
      assignedMechanicId: 'mech-5',
      assignedMechanicName: 'Nalaka Fernando',
      appointmentDate: '2026-11-03',
      appointmentTime: '09:30 AM',
      estimatedPriceLkr: 38000,
      status: RepairStatus.IN_PROGRESS,
      progressPercent: 50,
      estimatedCompletion: 'Today, 4:30 PM',
      createdAt: '2026-11-02 08:30 AM',
      dropOffOption: 'drop_off',
      internalNotes: 'Cell block 7 showed 0.4V lower differential. Performing balancing cycle and intake blower fan cleaning.',
      paymentStatus: 'pending'
    },
    {
      id: 'book-2',
      referenceNumber: 'GRX-2026-8942',
      customerId: 'cust-101',
      customerName: 'Kasun Mendis',
      customerPhone: '+94 77 123 4567',
      customerEmail: 'kasun.mendis@example.lk',
      vehicle: {
        plateNumber: 'WP CAJ-9102',
        brand: 'Honda',
        model: 'Vezel RS',
        year: 2019,
        mileageKm: 48900
      },
      serviceIds: ['srv-3', 'srv-8'],
      serviceNames: ['Brake Repair & System Tuning', '3D Wheel Alignment & Suspension'],
      problemDescription: 'Brake pedal squeal on cold mornings and car drifts slightly to the left on Southern Expressway.',
      symptoms: ['Squealing brakes', 'Steering wheel pulls left'],
      damageImages: [],
      assignedMechanicId: 'mech-3',
      assignedMechanicName: 'Saman Perera',
      appointmentDate: '2026-11-04',
      appointmentTime: '11:00 AM',
      estimatedPriceLkr: 24000,
      status: RepairStatus.CONFIRMED,
      progressPercent: 25,
      estimatedCompletion: 'Nov 04, 2:00 PM',
      createdAt: '2026-11-01 10:15 AM',
      dropOffOption: 'wait_at_lounge',
      paymentStatus: 'pending'
    },
    {
      id: 'book-3',
      referenceNumber: 'GRX-2026-8943',
      customerId: 'cust-102',
      customerName: 'Malini De Silva',
      customerPhone: '+94 71 456 7890',
      customerEmail: 'malini.desilva@gmail.com',
      vehicle: {
        plateNumber: 'WP CBF-1144',
        brand: 'Mercedes-Benz',
        model: 'C200 AMG Line',
        year: 2021,
        mileageKm: 32000
      },
      serviceIds: ['srv-2', 'srv-5'],
      serviceNames: ['Engine Repair & Overhaul', 'Auto AC Repair & Climate Control'],
      problemDescription: 'Slight coolant temperature fluctuation and AC airflow feels lukewarm after 20 minutes of driving.',
      symptoms: [],
      damageImages: [],
      assignedMechanicId: 'mech-2',
      assignedMechanicName: 'Rohan Jayawardena',
      appointmentDate: '2026-11-02',
      appointmentTime: '08:30 AM',
      estimatedPriceLkr: 64500,
      status: RepairStatus.QUALITY_CHECK,
      progressPercent: 80,
      estimatedCompletion: 'Today, 5:30 PM',
      createdAt: '2026-11-01 02:00 PM',
      dropOffOption: 'drop_off',
      internalNotes: 'Thermostat housing replaced. Coolant bled. AC condenser washed and gas topped up.',
      paymentStatus: 'partially_paid'
    },
    {
      id: 'book-4',
      referenceNumber: 'GRX-2026-8944',
      customerId: 'cust-103',
      customerName: 'Dhanushka Wickrama',
      customerPhone: '+94 76 778 8990',
      customerEmail: 'dhanushka.w@yahoo.com',
      vehicle: {
        plateNumber: 'WP CBB-5520',
        brand: 'Toyota',
        model: 'Land Cruiser Prado',
        year: 2017,
        mileageKm: 98000
      },
      serviceIds: ['srv-4', 'srv-6'],
      serviceNames: ['Premium Oil Change & Lube', 'Tire Replacement & Wheel Balancing'],
      problemDescription: 'Scheduled 100,000 km oil service and install 4 new all-terrain tires before outstation safari trip.',
      symptoms: [],
      damageImages: [],
      assignedMechanicId: 'mech-4',
      assignedMechanicName: 'Kamal Wickramasinghe',
      appointmentDate: '2026-11-02',
      appointmentTime: '10:00 AM',
      estimatedPriceLkr: 145000,
      finalPriceLkr: 145000,
      status: RepairStatus.READY_FOR_PICKUP,
      progressPercent: 95,
      estimatedCompletion: 'Ready for Collection',
      createdAt: '2026-10-31 09:00 AM',
      dropOffOption: 'drop_off',
      internalNotes: 'Mobil 1 Delvac 5W-40 poured. 4 Michelin LTX tires fitted and balanced. Client notified.',
      paymentStatus: 'paid'
    },
    {
      id: 'book-5',
      referenceNumber: 'GRX-2026-8945',
      customerId: 'cust-101',
      customerName: 'Kasun Mendis',
      customerPhone: '+94 77 123 4567',
      customerEmail: 'kasun.mendis@example.lk',
      vehicle: {
        plateNumber: 'WP CAD-4821',
        brand: 'Toyota',
        model: 'Prius Hybrid',
        year: 2018,
        mileageKm: 58000
      },
      serviceIds: ['srv-4', 'srv-8'],
      serviceNames: ['Premium Oil Change & Lube', '3D Wheel Alignment & Suspension'],
      problemDescription: 'Routine 55,000 km oil change and tire rotation.',
      symptoms: [],
      damageImages: [],
      assignedMechanicId: 'mech-2',
      assignedMechanicName: 'Rohan Jayawardena',
      appointmentDate: '2026-08-15',
      appointmentTime: '02:00 PM',
      estimatedPriceLkr: 22000,
      finalPriceLkr: 22000,
      status: RepairStatus.DELIVERED,
      progressPercent: 100,
      estimatedCompletion: 'Completed on Aug 15, 2026',
      createdAt: '2026-08-14 11:00 AM',
      dropOffOption: 'wait_at_lounge',
      paymentStatus: 'paid'
    },
    {
      id: 'book-6',
      referenceNumber: 'GRX-2026-8946',
      customerId: 'cust-104',
      customerName: 'Ajantha Fernando',
      customerPhone: '+94 77 334 4556',
      customerEmail: 'ajantha.f@gmail.com',
      vehicle: {
        plateNumber: 'WP CAR-7711',
        brand: 'Nissan',
        model: 'Leaf ZE1',
        year: 2020,
        mileageKm: 42000
      },
      serviceIds: ['srv-9'],
      serviceNames: ['Comprehensive Pre-Purchase Inspection'],
      problemDescription: 'Pre-purchase inspection for a private deal in Kohuwala.',
      symptoms: [],
      damageImages: [],
      assignedMechanicId: 'mech-5',
      assignedMechanicName: 'Nuwan Fernando',
      appointmentDate: '2026-11-05',
      appointmentTime: '01:30 PM',
      estimatedPriceLkr: 25000,
      status: RepairStatus.PENDING,
      progressPercent: 10,
      estimatedCompletion: 'Nov 05, 4:00 PM',
      createdAt: '2026-11-02 04:00 PM',
      dropOffOption: 'wait_at_lounge',
      paymentStatus: 'pending'
    }
  ];

  private _bookings = signal<Booking[]>(this.initialBookings);
  private _loading = signal<boolean>(false);
  private _error = signal<string | null>(null);

  readonly bookings = this._bookings.asReadonly();
  readonly isLoading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // Progress steps reference mapping
  readonly statusSequence: { key: RepairStatus; label: string; desc: string }[] = [
    { key: RepairStatus.PENDING, label: 'Pending', desc: 'Vehicle received and awaiting inspection.' },
    { key: RepairStatus.CONFIRMED, label: 'Confirmed', desc: 'Customer approves the repair estimate.' },
    { key: RepairStatus.IN_PROGRESS, label: 'In Progress', desc: 'Mechanic starts the repair work.' },
    { key: RepairStatus.WAITING_FOR_PARTS, label: 'Waiting for Parts / On Hold', desc: 'Optional statuses when work cannot continue.' },
    { key: RepairStatus.QUALITY_CHECK, label: 'Quality Check', desc: 'Final inspection and testing.' },
    { key: RepairStatus.READY_FOR_PICKUP, label: 'Ready for Pickup', desc: 'Vehicle is ready for collection.' },
    { key: RepairStatus.DELIVERED, label: 'Delivered', desc: 'Vehicle handed over to the customer.' }
  ];

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('garagix_user');
        if (stored) {
          const u = JSON.parse(stored);
          if (u?.role === 'admin' || u?.role === 'director' || u?.role === 'technician') {
            this.loadBookings().subscribe();
          } else if (u?.id) {
            this.loadCustomerBookings(u.id).subscribe();
          }
        }
      } catch {
        // Fall through
      }
    }
  }

  /**
   * Fetches workshop bookings from backend with optional filters.
   */
  loadBookings(status?: string, customerId?: string, search?: string): Observable<Booking[]> {
    this._loading.set(true);
    this._error.set(null);

    let params = new HttpParams();
    if (status && status !== 'ALL') params = params.set('status', status);
    if (customerId) params = params.set('customerId', customerId);
    if (search && search.trim()) params = params.set('search', search.trim());

    return this.http.get<Booking[]>(this.apiUrl, { params }).pipe(
      tap({
        next: (items) => {
          this._bookings.set(items ?? []);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err?.message || 'Failed to load bookings from server.');
          this._loading.set(false);
        }
      }),
      catchError(() => of(this._bookings()))
    );
  }

  /**
   * Fetches customer-specific bookings from backend.
   */
  loadCustomerBookings(customerId: string): Observable<Booking[]> {
    this._loading.set(true);
    this._error.set(null);

    return this.http.get<Booking[]>(`${this.apiUrl}/customer/${customerId}`).pipe(
      tap({
        next: (items) => {
          // Merge or update current signal with customer's latest bookings
          const fetchedIds = new Set((items ?? []).map(x => x.id));
          const others = this._bookings().filter(x => !fetchedIds.has(x.id));
          this._bookings.set([...(items ?? []), ...others]);
          this._loading.set(false);
        },
        error: (err) => {
          this._error.set(err?.message || 'Failed to load customer bookings.');
          this._loading.set(false);
        }
      }),
      catchError(() => of(this.getCustomerBookings(customerId)))
    );
  }

  /**
   * Fetches details of a single booking by ID.
   */
  getBookingById(id: string): Observable<Booking> {
    return this.http.get<Booking>(`${this.apiUrl}/${id}`);
  }

  /**
   * Queries real-time repair telemetry using reference code or license plate.
   * Public endpoint - no authorization headers required.
   */
  trackBooking(referenceOrPlate: string): Observable<Booking> {
    const clean = referenceOrPlate.trim();
    return this.http.get<Booking>(`${this.apiUrl}/track/${encodeURIComponent(clean)}`).pipe(
      tap((booking) => {
        if (booking) {
          this._bookings.update(curr => {
            const exists = curr.some(b => b.id === booking.id);
            return exists ? curr.map(b => b.id === booking.id ? booking : b) : [booking, ...curr];
          });
        }
      })
    );
  }

  /**
   * Submits a new vehicle repair booking to the API and updates state.
   */
  createBooking(data: CreateBookingPayload): Observable<Booking> {
    this._loading.set(true);
    return this.http.post<Booking>(this.apiUrl, data).pipe(
      tap({
        next: (created) => {
          this._bookings.update(curr => [created, ...curr]);
          this._loading.set(false);
        },
        error: (err) => {
          this._loading.set(false);
          this._error.set(err?.message || 'Failed to create booking.');
        }
      })
    );
  }

  /**
   * Progresses or updates booking lifecycle status.
   */
  updateBookingStatus(id: string, newStatus: RepairStatus | BookingStatus | string, note?: string): Observable<Booking> {
    let percent = 10;
    switch (newStatus) {
      case RepairStatus.PENDING:
      case 'pending':
        percent = 10; break;
      case RepairStatus.CONFIRMED:
      case 'booking_confirmed':
        percent = 25; break;
      case RepairStatus.IN_PROGRESS:
      case 'repair_in_progress':
        percent = 50; break;
      case RepairStatus.WAITING_FOR_PARTS:
      case 'waiting_for_parts':
      case RepairStatus.ON_HOLD:
      case 'on_hold':
        percent = 60; break;
      case RepairStatus.QUALITY_CHECK:
      case 'quality_inspection':
        percent = 80; break;
      case RepairStatus.READY_FOR_PICKUP:
      case 'ready_for_collection':
        percent = 95; break;
      case RepairStatus.DELIVERED:
      case 'completed':
        percent = 100; break;
      case RepairStatus.CANCELLED:
      case 'cancelled':
        percent = 0; break;
    }

    // Optimistic update
    this._bookings.update(curr =>
      curr.map(b => b.id === id ? { ...b, status: newStatus as RepairStatus, progressPercent: percent } : b)
    );

    return this.http.patch<Booking>(`${this.apiUrl}/${id}/status`, {
      status: newStatus,
      progressPercent: percent,
      internalNote: note
    }).pipe(
      tap((updated) => {
        this._bookings.update(curr =>
          curr.map(b => b.id === id ? { ...b, ...updated } : b)
        );
      })
    );
  }

  /**
   * Assigns a mechanic technician to a repair booking.
   */
  assignMechanic(id: string, mechanicId: string, mechanicName: string): Observable<Booking> {
    this._bookings.update(curr =>
      curr.map(b => b.id === id ? { ...b, assignedMechanicId: mechanicId, assignedMechanicName: mechanicName } : b)
    );

    return this.http.patch<Booking>(`${this.apiUrl}/${id}/assign-mechanic`, {
      mechanicId,
      mechanicName
    }).pipe(
      tap((updated) => {
        this._bookings.update(curr =>
          curr.map(b => b.id === id ? { ...b, ...updated } : b)
        );
      })
    );
  }

  /**
   * Cancels a booking via the backend API.
   */
  cancelBooking(id: string, reason?: string): Observable<Booking> {
    // Optimistic update
    this._bookings.update(curr =>
      curr.map(b => b.id === id ? {
        ...b,
        status: RepairStatus.CANCELLED,
        progressPercent: 0,
        internalNotes: (b.internalNotes ? b.internalNotes + ' | ' : '') + `Cancelled: ${reason || 'Customer requested'}`
      } : b)
    );

    return this.http.post<Booking>(`${this.apiUrl}/${id}/cancel`, { reason }).pipe(
      tap((updated) => {
        this._bookings.update(curr =>
          curr.map(b => b.id === id ? { ...b, ...updated } : b)
        );
      })
    );
  }

  /**
   * Updates booking details (dates, vehicle, costs, notes).
   */
  updateBooking(id: string, updates: Partial<Booking>): Observable<Booking> {
    this._bookings.update(curr =>
      curr.map(b => b.id === id ? { ...b, ...updates } : b)
    );

    return this.http.put<Booking>(`${this.apiUrl}/${id}`, updates).pipe(
      tap((updated) => {
        this._bookings.update(curr =>
          curr.map(b => b.id === id ? { ...b, ...updated } : b)
        );
      })
    );
  }

  // --- Synchronous Accessor & Timeline Helper Methods ---

  getBookings(): Booking[] {
    return this._bookings();
  }

  getBookingByReference(referenceNumber: string): Booking | undefined {
    const cleanRef = referenceNumber.trim().toUpperCase();
    return this._bookings().find(b =>
      b.referenceNumber.toUpperCase() === cleanRef ||
      b.vehicle.plateNumber.toUpperCase() === cleanRef
    );
  }

  getCustomerBookings(customerId: string): Booking[] {
    return this._bookings().filter(b => b.customerId === customerId);
  }

  getTimelineSteps(booking: Booking): RepairProgressStep[] {
    if (booking.status === RepairStatus.CANCELLED || (booking.status as string) === 'cancelled') {
      return [{
        step: 1,
        key: RepairStatus.CANCELLED,
        label: 'Cancelled',
        description: 'This booking or repair was cancelled.',
        completed: false,
        current: true
      }];
    }

    const statusOrder: Record<string, number> = {
      [RepairStatus.PENDING]: 0,
      [RepairStatus.CONFIRMED]: 1,
      [RepairStatus.IN_PROGRESS]: 2,
      [RepairStatus.WAITING_FOR_PARTS]: 3,
      [RepairStatus.ON_HOLD]: 3,
      [RepairStatus.QUALITY_CHECK]: 4,
      [RepairStatus.READY_FOR_PICKUP]: 5,
      [RepairStatus.DELIVERED]: 6,
      'pending': 0,
      'booking_confirmed': 1,
      'vehicle_received': 0,
      'inspection_in_progress': 0,
      'repair_in_progress': 2,
      'waiting_for_parts': 3,
      'quality_inspection': 4,
      'ready_for_collection': 5,
      'completed': 6
    };

    const currentOrder = statusOrder[booking.status] ?? 0;

    return this.statusSequence.map((step, idx) => {
      const isCompleted = booking.status === RepairStatus.DELIVERED || (booking.status as string) === 'completed'
        ? true
        : currentOrder > idx;
      const isCurrent = currentOrder === idx && booking.status !== RepairStatus.DELIVERED && (booking.status as string) !== 'completed';

      return {
        step: idx + 1,
        key: step.key,
        label: step.label,
        description: step.desc,
        completed: isCompleted,
        current: isCurrent
      };
    });
  }

  addInternalNote(id: string, note: string): void {
    this._bookings.update(curr =>
      curr.map(b => b.id === id ? {
        ...b,
        internalNotes: (b.internalNotes ? b.internalNotes + '\n' : '') + `[${new Date().toLocaleTimeString()}]: ${note}`
      } : b)
    );
  }
}
