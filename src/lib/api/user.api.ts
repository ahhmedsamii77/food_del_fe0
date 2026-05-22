import { api } from "@/lib/api";
import type { LoginForm, RegisterForm } from "@/types";

const BASE = "/user";

export const register = (data: RegisterForm) =>
  api.post(`${BASE}/register`, data);

export const login = (data: LoginForm) =>
  api.post(`${BASE}/login`, data);

export const confirmEmail = (data: { email: string; otp: string }) =>
  api.post(`${BASE}/confirm-email`, data);

export const resendOtp = (data: { email: string }) =>
  api.post(`${BASE}/resend-otp`, data);

export const forgotPassword = (data: { email: string }) =>
  api.post(`${BASE}/forgot-password`, data);

export const verifyResetOtp = (data: { email: string; otp: string }) =>
  api.post(`${BASE}/verify-reset-otp`, data);

export const resetPassword = (data: {
  email: string;
  password: string;
  confirmPassword: string;
}) => api.post(`${BASE}/reset-password`, data);

export const getMe = (signal?: AbortSignal) =>
  api.get(`${BASE}/me`, { signal });

export const logout = () =>
  api.post(`${BASE}/logout`);
