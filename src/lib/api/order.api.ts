import { api } from "@/lib/api";
import type { DeliveryAddress, CartItem } from "@/types";

const BASE = "/order";

export const placeOrder = (data: {
  items: CartItem[];
  amount: number;
  address: DeliveryAddress;
}) => api.post(`${BASE}/place`, data);

export const verifyOrder = (data: { orderId: string; success: string }) =>
  api.post(`${BASE}/verify`, data);

export const getUserOrders = (signal?: AbortSignal) =>
  api.post(`${BASE}/userorders`, {}, { signal });

// ── Admin ─────────────────────────────────────────────────────────────────────
export const adminGetAllOrders = (signal?: AbortSignal) =>
  api.get(`${BASE}/all`, { signal });

export const adminUpdateOrderStatus = (data: {
  orderId: string;
  status: string;
}) => api.post(`${BASE}/status`, data);
