export interface MonthlyStatistic {
  month: string;
  bookingsCount: number;
  completedCount: number;
  revenueLkr: number;
}

export interface ServiceStatistic {
  serviceName: string;
  bookingsCount: number;
  revenueLkr: number;
  percentage: number;
}

export interface MechanicWorkload {
  mechanicId: string;
  mechanicName: string;
  activeRepairs: number;
  completedThisMonth: number;
  efficiencyScore: number;
  specialization: string;
}

export interface ReportSummary {
  totalBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  totalRevenueLkr: number;
  averageRepairCostLkr: number;
  monthlyStats: MonthlyStatistic[];
  topServices: ServiceStatistic[];
  mechanicWorkloads: MechanicWorkload[];
}

