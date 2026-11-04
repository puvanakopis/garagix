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
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  expiresAt?: string;
  user?: User;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  otp?: string;
  expiresInMinutes?: number;
}
