import { api } from "@/lib/api";

const BASE = "/cart";

export const addToCart = (itemId: string) =>
  api.post(`${BASE}/add`, { itemId });

export const removeFromCart = (itemId: string) =>
  api.post(`${BASE}/remove`, { itemId });

export const getCart = (signal?: AbortSignal) =>
  api.get(`${BASE}/get`, { signal });

export const updateCartQuantity = (itemId: string, quantity: number) =>
  api.put(`${BASE}/update`, { itemId, quantity });
