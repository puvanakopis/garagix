import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, tap, throwError } from 'rxjs';
import { WorkshopSettings, UpdateWorkshopSettingsDto } from '../models/workshop-settings.model';
import { environment } from '../../../environments/environment';

export const DEFAULT_WORKSHOP_SETTINGS: WorkshopSettings = {
  id: 'default',
  workshopName: 'Garagix Auto Care HQ',
  regNumber: 'PV-124991-LK',
  phone: '+94 11 234 5678',
  emergencyPhone: '(+94) 77 123 4567',
  email: 'service@garagix.lk',
  address: 'No. 45/A, Nawala Road, Nugegoda, Colombo, Sri Lanka',
  description: 'Premier automotive engineering and computerized diagnostic center specializing in Japanese, European, and Hybrid vehicles.',
  facilityBay: 'Colombo Central',
  workshopStatus: 'Operational',
  alertsEngineStatus: 'SMS & Email Live',
  mondayFridayOpen: '08:00',
  mondayFridayClose: '18:30',
  saturdayHours: '08:00 AM - 05:00 PM',
  sundayHours: 'Emergency Breakdown Intake Only',
  activeWorkingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  slotDurationMinutes: 60,
  concurrentHydraulicBays: 6,
  freeCancellationHours: 4,
  maxAdvanceBookingDays: 30,
  automatedBookingConfirmationSms: true,
  technicianStatusChangeBroadcast: true,
  collectionBayReadyNotification: true,
  createdAt: '2026-01-01T00:00:00'
};

@Injectable({
  providedIn: 'root'
})
export class WorkshopSettingsService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/workshop-settings`;

  private _settings = signal<WorkshopSettings>(DEFAULT_WORKSHOP_SETTINGS);
  readonly settings = this._settings.asReadonly();

  readonly loading = signal<boolean>(false);
  readonly saving = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  // Convenient computed signals for direct reactive binding
  readonly workshopName = computed(() => this._settings().workshopName);
  readonly phone = computed(() => this._settings().phone);
  readonly emergencyPhone = computed(() => this._settings().emergencyPhone);
  readonly email = computed(() => this._settings().email);
  readonly address = computed(() => this._settings().address);
  readonly description = computed(() => this._settings().description);
  readonly facilityBay = computed(() => this._settings().facilityBay);
  readonly hydraulicBays = computed(() => this._settings().concurrentHydraulicBays);
  readonly workshopStatus = computed(() => this._settings().workshopStatus);
  readonly alertsEngineStatus = computed(() => this._settings().alertsEngineStatus);
  readonly mondayFridayOpen = computed(() => this._settings().mondayFridayOpen);
  readonly mondayFridayClose = computed(() => this._settings().mondayFridayClose);
  readonly saturdayHours = computed(() => this._settings().saturdayHours);
  readonly sundayHours = computed(() => this._settings().sundayHours);
  readonly activeWorkingDays = computed(() => this._settings().activeWorkingDays);

  constructor() {
    this.loadSettings().subscribe({
      error: (err) => console.warn('Could not load workshop settings from backend; using default values.', err)
    });
  }

  /**
   * Retrieves workshop configuration from the backend API.
   * Accessible publicly without authentication.
   */
  loadSettings(): Observable<WorkshopSettings> {
    this.loading.set(true);
    this.error.set(null);

    return this.http.get<WorkshopSettings>(this.apiUrl).pipe(
      tap({
        next: (res) => {
          if (res) {
            this._settings.set({
              ...DEFAULT_WORKSHOP_SETTINGS,
              ...res,
              activeWorkingDays: res.activeWorkingDays ?? DEFAULT_WORKSHOP_SETTINGS.activeWorkingDays
            });
          }
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set('Failed to synchronize workshop settings with backend.');
          this.loading.set(false);
        }
      }),
      catchError((err) => {
        return of(this._settings());
      })
    );
  }

  /**
   * Updates garage workshop settings via admin PUT endpoint.
   * Requires admin bearer authentication.
   * @param dto Partial configuration updates to apply.
   */
  updateSettings(dto: UpdateWorkshopSettingsDto): Observable<WorkshopSettings> {
    this.saving.set(true);
    this.error.set(null);

    return this.http.put<WorkshopSettings>(this.apiUrl, dto).pipe(
      tap({
        next: (updated) => {
          if (updated) {
            this._settings.set({
              ...DEFAULT_WORKSHOP_SETTINGS,
              ...updated,
              activeWorkingDays: updated.activeWorkingDays ?? DEFAULT_WORKSHOP_SETTINGS.activeWorkingDays
            });
          }
          this.saving.set(false);
        },
        error: (err) => {
          this.saving.set(false);
          this.error.set('Failed to save workshop settings to server.');
        }
      }),
      catchError((err) => {
        this.saving.set(false);
        return throwError(() => err);
      })
    );
  }
}

