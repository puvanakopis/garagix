import type { User, UserRole } from './user.model';
export type { User, UserRole };

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
  role?: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword?: string;
  address?: string;
  role?: string;
  otp?: string;
}

export interface SendRegistrationOtpRequest {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  address?: string;
  role?: string;
}

export interface VerifyRegistrationOtpRequest {
  email: string;
  otp: string;
}

export interface RegistrationOtpResponse {
  success: boolean;
  message: string;
  email: string;
  expiresInMinutes: number;
  otp?: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface ResetPasswordRequest {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token: string;
  expiresAt?: string;
  user?: User;
  requiresOtp?: boolean;
  otp?: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message: string;
  otp?: string;
  expiresInMinutes?: number;
}

export interface VerifyOtpResponse {
  success: boolean;
  message: string;
}

export interface ResetPasswordResponse {
  success: boolean;
  message: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  token: string | null;
}
