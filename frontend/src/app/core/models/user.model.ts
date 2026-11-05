import { Vehicle } from './vehicle.model';

export type UserRole = 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: UserRole;
  createdAt?: string;
  totalBookings?: number;
  status: 'active' | 'inactive';
  vehicles?: Vehicle[];
}

// Re-export auth types for convenience and backwards compatibility
export * from './auth.model';
