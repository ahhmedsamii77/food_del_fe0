// Food types
export interface FoodItem {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
}

export interface CartItem extends FoodItem {
  quantity: number;
}

// Order types
export interface DeliveryAddress {
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
}

export interface Order {
  _id: string;
  userId: string;
  items: CartItem[];
  amount: number;
  address: DeliveryAddress;
  status: string;
  date: string;
  payment: boolean;
}

// User types
export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  confirmedAt?: string;
}

// Auth types
export interface AuthStore {
  access_Token: string;
  refresh_Token: string;
  role: string;
  setAccess_Token: (token: string) => void;
  setRefresh_Token: (token: string) => void;
  setRole: (role: string) => void;
  clearAuth: () => void;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
}

export interface ConfirmEmailForm {
  email: string;
  otp: string;
}

export interface ForgotPasswordForm {
  email: string;
}

export interface VerifyResetOtpForm {
  email: string;
  otp: string;
}

export interface ResetPasswordForm {
  email: string;
  password: string;
  confirmPassword: string;
}

// Cart item count badge helper (computed from React Query cart data)
export type CartCountHelper = (cartData: CartItem[]) => number;

// API response shapes
export interface ApiResponse<T = undefined> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface LoginResponse {
  credentials: {
    access_token: string;
    refresh_token: string;
  };
  role: string;
}
