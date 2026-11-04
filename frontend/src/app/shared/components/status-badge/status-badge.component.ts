import { Component, ChangeDetectionStrategy, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookingStatus, RepairStatus } from '../../../core/models/booking.model';

@Component({
  selector: 'app-status-badge',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide capitalize border"
      [class]="badgeConfig().classes"
    >
      <span class="w-1.5 h-1.5 rounded-full" [class]="badgeConfig().dotClass"></span>
      {{ badgeConfig().label }}
    </span>
  `
})
export class StatusBadgeComponent {
  status = input.required<BookingStatus | string>();

  private statusMap: Record<string, { label: string; classes: string; dotClass: string }> = {
    // RepairStatus Enum
    [RepairStatus.PENDING]: { label: 'Pending', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dotClass: 'bg-amber-400' },
    [RepairStatus.CONFIRMED]: { label: 'Confirmed', classes: 'bg-sky-500/10 text-sky-400 border-sky-500/30', dotClass: 'bg-sky-400' },
    [RepairStatus.IN_PROGRESS]: { label: 'In Progress', classes: 'bg-gx-primary/10 text-rose-400 border-gx-primary/30', dotClass: 'bg-gx-primary' },
    [RepairStatus.WAITING_FOR_PARTS]: { label: 'Waiting for Parts', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dotClass: 'bg-amber-400' },
    [RepairStatus.ON_HOLD]: { label: 'On Hold', classes: 'bg-orange-500/10 text-orange-400 border-orange-500/30', dotClass: 'bg-orange-400' },
    [RepairStatus.QUALITY_CHECK]: { label: 'Quality Check', classes: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', dotClass: 'bg-indigo-400' },
    [RepairStatus.READY_FOR_PICKUP]: { label: 'Ready for Pickup', classes: 'bg-teal-500/10 text-teal-400 border-teal-500/30', dotClass: 'bg-teal-400' },
    [RepairStatus.DELIVERED]: { label: 'Delivered', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dotClass: 'bg-emerald-400' },
    [RepairStatus.CANCELLED]: { label: 'Cancelled', classes: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dotClass: 'bg-rose-400' },

    // Fallbacks
    'pending': { label: 'Pending', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dotClass: 'bg-amber-400' },
    'booking_confirmed': { label: 'Confirmed', classes: 'bg-sky-500/10 text-sky-400 border-sky-500/30', dotClass: 'bg-sky-400' },
    'vehicle_received': { label: 'Vehicle Received', classes: 'bg-purple-500/10 text-purple-400 border-purple-500/30', dotClass: 'bg-purple-400' },
    'inspection_in_progress': { label: 'Inspection', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dotClass: 'bg-amber-400' },
    'repair_in_progress': { label: 'In Progress', classes: 'bg-gx-primary/10 text-rose-400 border-gx-primary/30', dotClass: 'bg-gx-primary' },
    'waiting_for_parts': { label: 'Waiting for Parts', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dotClass: 'bg-amber-400' },
    'quality_inspection': { label: 'Quality Check', classes: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', dotClass: 'bg-indigo-400' },
    'ready_for_collection': { label: 'Ready for Pickup', classes: 'bg-teal-500/10 text-teal-400 border-teal-500/30', dotClass: 'bg-teal-400' },
    'completed': { label: 'Delivered', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dotClass: 'bg-emerald-400' },
    'cancelled': { label: 'Cancelled', classes: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dotClass: 'bg-rose-400' },
    'active': { label: 'Active', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dotClass: 'bg-emerald-400' },
    'inactive': { label: 'Inactive', classes: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dotClass: 'bg-rose-400' },
    'available': { label: 'Available', classes: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', dotClass: 'bg-emerald-400' },
    'busy': { label: 'In Service', classes: 'bg-amber-500/10 text-amber-400 border-amber-500/30', dotClass: 'bg-amber-400' },
    'on_leave': { label: 'On Leave', classes: 'bg-rose-500/10 text-rose-400 border-rose-500/30', dotClass: 'bg-rose-400' }
  };

  badgeConfig = computed(() => {
    const s = this.status();
    const config = this.statusMap[s];
    if (config) return config;
    return {
      label: s ? s.replace(/_/g, ' ') : 'Unknown',
      classes: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
      dotClass: 'bg-sky-400'
    };
  });
}

