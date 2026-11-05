import { Booking, RepairStatus } from './booking.model';
import { Vehicle } from './vehicle.model';

export interface AdminDashboardMetrics {
  inWorkshopCount: number;
  pendingIntakeCount: number;
  confirmedCount: number;
  completedCount: number;
  totalBookingsCount: number;
  totalCustomersCount: number;
  totalMechanicsCount: number;
  pipelineRevenueLkr: number;
  realizedRevenueLkr: number;
  hydraulicBays: number;
}

export interface MonthlyRepairVolume {
  month: string;
  monthFull: string;
  bookingsCount: number;
  completedCount: number;
  revenueLkr: number;
}

export interface CategoryRevenue {
  categoryName: string;
  percentage: number;
  revenueLkr: number;
  bookingsCount: number;
}

export interface TodayAppointment {
  id: string;
  referenceNumber: string;
  customerName: string;
  vehiclePlate: string;
  vehicleBrand: string;
  vehicleModel: string;
  primaryService: string;
  appointmentDate: string;
  appointmentTime: string;
  status: RepairStatus | string;
  progressPercent: number;
  estimatedPriceLkr: number;
}

export interface AdminDashboardData {
  metrics: AdminDashboardMetrics;
  monthlyVolume: MonthlyRepairVolume[];
  revenueByCategory: CategoryRevenue[];
  todayAppointments: TodayAppointment[];
}

export interface CustomerSummary {
  id: string;
  fullName: string;
  firstName: string;
  email: string;
  phone: string;
}

export interface CustomerDashboardMetrics {
  inWorkshopCount: number;
  upcomingCount: number;
  savedVehiclesCount: number;
  completedCount: number;
  totalSpentLkr: number;
}

export interface CustomerActiveRepairTelemetry {
  id: string;
  referenceNumber: string;
  vehiclePlate: string;
  vehicleModel: string;
  status: RepairStatus | string;
  progressPercent: number;
  estimatedCompletion: string;
  assignedMechanicName: string;
  internalNotes?: string;
  appointmentDate: string;
  appointmentTime: string;
  estimatedPriceLkr: number;
}

export interface CustomerDashboardData {
  customer: CustomerSummary;
  metrics: CustomerDashboardMetrics;
  activeRepair?: CustomerActiveRepairTelemetry | null;
  vehicles: Vehicle[];
  recentVisits: Booking[];
}

