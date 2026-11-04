import { Injectable, signal } from '@angular/core';
import { ReportSummary, MonthlyStatistic, ServiceStatistic, MechanicWorkload } from '../models/report.model';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private monthlyStats: MonthlyStatistic[] = [
    { month: 'Jun 2026', bookingsCount: 88, completedCount: 84, revenueLkr: 2450000 },
    { month: 'Jul 2026', bookingsCount: 104, completedCount: 98, revenueLkr: 3120000 },
    { month: 'Aug 2026', bookingsCount: 118, completedCount: 114, revenueLkr: 3840000 },
    { month: 'Sep 2026', bookingsCount: 125, completedCount: 120, revenueLkr: 4050000 },
    { month: 'Oct 2026', bookingsCount: 142, completedCount: 138, revenueLkr: 4680000 },
    { month: 'Nov 2026 (MTD)', bookingsCount: 38, completedCount: 31, revenueLkr: 1290000 }
  ];

  private topServices: ServiceStatistic[] = [
    { serviceName: 'Engine Diagnostics & Rebuilds', bookingsCount: 148, revenueLkr: 7104000, percentage: 36 },
    { serviceName: 'General 40-Point Maintenance', bookingsCount: 210, revenueLkr: 3885000, percentage: 20 },
    { serviceName: 'Hybrid Battery Rejuvenation', bookingsCount: 115, revenueLkr: 2242500, percentage: 14 },
    { serviceName: 'Auto AC & Climate Repair', bookingsCount: 98, revenueLkr: 1617000, percentage: 11 },
    { serviceName: 'Brake Servicing & Skimming', bookingsCount: 112, revenueLkr: 1624000, percentage: 11 },
    { serviceName: '3D Wheel Alignment & Tires', bookingsCount: 94, revenueLkr: 1128000, percentage: 8 }
  ];

  private mechanicWorkloads: MechanicWorkload[] = [
    { mechanicId: 'mech-5', mechanicName: 'Nuwan Fernando', activeRepairs: 3, completedThisMonth: 18, efficiencyScore: 98, specialization: 'Body & Chassis Craft' },
    { mechanicId: 'mech-2', mechanicName: 'Rohan Jayawardena', activeRepairs: 4, completedThisMonth: 24, efficiencyScore: 99, specialization: 'Engine Diagnostics' },
    { mechanicId: 'mech-3', mechanicName: 'Saman Perera', activeRepairs: 5, completedThisMonth: 21, efficiencyScore: 96, specialization: 'Brakes & Gearboxes' },
    { mechanicId: 'mech-4', mechanicName: 'Kamal Wickramasinghe', activeRepairs: 2, completedThisMonth: 16, efficiencyScore: 95, specialization: 'Suspension & Steering' },
    { mechanicId: 'mech-5', mechanicName: 'Nalaka Fernando', activeRepairs: 3, completedThisMonth: 19, efficiencyScore: 97, specialization: 'Hybrid & EV Systems' },
    { mechanicId: 'mech-6', mechanicName: 'Dinesh Rathnayake', activeRepairs: 2, completedThisMonth: 15, efficiencyScore: 94, specialization: 'Auto AC & Electronics' }
  ];

  getSummary(): ReportSummary {
    return {
      totalBookings: 615,
      completedBookings: 585,
      cancelledBookings: 18,
      pendingBookings: 12,
      totalRevenueLkr: 19430000,
      averageRepairCostLkr: 31590,
      monthlyStats: this.monthlyStats,
      topServices: this.topServices,
      mechanicWorkloads: this.mechanicWorkloads
    };
  }

  exportCsvReport(): void {
    const data = this.monthlyStats.map(s => 
      `"${s.month}",${s.bookingsCount},${s.completedCount},${s.revenueLkr}`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' +
      ['Month,Total Bookings,Completed Bookings,Revenue (LKR)', ...data].join('\n');
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `garagix-workshop-report-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}

