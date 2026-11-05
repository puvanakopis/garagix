/**
/// Workshop Settings Model
/// Represents workshop configuration, identity, hours, and booking constraints.
**/
export interface WorkshopSettings {
  id: string;
  workshopName: string;
  regNumber: string;
  phone: string;
  emergencyPhone: string;
  email: string;
  address: string;
  description: string;
  facilityBay: string;
  workshopStatus: string;
  alertsEngineStatus: string;
  mondayFridayOpen: string;
  mondayFridayClose: string;
  saturdayHours: string;
  sundayHours: string;
  activeWorkingDays: string[];
  slotDurationMinutes: number;
  concurrentHydraulicBays: number;
  freeCancellationHours: number;
  maxAdvanceBookingDays: number;
  automatedBookingConfirmationSms: boolean;
  technicianStatusChangeBroadcast: boolean;
  collectionBayReadyNotification: boolean;
  createdAt?: string;
  updatedAt?: string | null;
}

export type UpdateWorkshopSettingsDto = Partial<Omit<WorkshopSettings, 'id' | 'createdAt' | 'updatedAt'>>;

