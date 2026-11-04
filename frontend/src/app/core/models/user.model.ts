export type UserRole = 'customer' | 'admin' | 'guest';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  role: UserRole;
  avatarUrl?: string;
  memberSince: string;
  totalBookings?: number;
  status: 'active' | 'inactive';
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
}

