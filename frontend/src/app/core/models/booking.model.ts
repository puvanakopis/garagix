export enum RepairStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PROGRESS = "IN_PROGRESS",
  WAITING_FOR_PARTS = "WAITING_FOR_PARTS",
  ON_HOLD = "ON_HOLD",
  QUALITY_CHECK = "QUALITY_CHECK",
  READY_FOR_PICKUP = "READY_FOR_PICKUP",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export type BookingStatus = RepairStatus;

export interface RepairProgressStep {
  step: number;
  key: RepairStatus | string;
  label: string;
  description: string;
  timestamp?: string;
  completed: boolean;
  current: boolean;
}

export interface Booking {
  id: string;
  referenceNumber: string; // e.g. "GRX-2026-8941"
  customerId: string;
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
  serviceNames: string[];
  problemDescription: string;
  symptoms?: string[];
  damageImages?: string[];
  assignedMechanicId?: string;
  assignedMechanicName?: string;
  appointmentDate: string; // YYYY-MM-DD
  appointmentTime: string; // "09:00 AM"
  estimatedPriceLkr: number;
  finalPriceLkr?: number;
  status: RepairStatus;
  progressPercent: number; // 0 to 100
  estimatedCompletion: string;
  createdAt: string;
  dropOffOption: 'drop_off' | 'wait_at_lounge';
  internalNotes?: string;
  paymentStatus: 'pending' | 'partially_paid' | 'paid' | 'refunded';
}

