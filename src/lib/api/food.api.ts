import { api, baseDomain } from "@/lib/api";

const BASE = "/food";

export const listFood = (signal?: AbortSignal) =>
  api.get(`${BASE}/list`, { signal });

export const addFood = (data: FormData) =>
  api.post(`${BASE}/add`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const removeFood = (id: string) =>
  api.post(`${BASE}/remove`, { id });

// Handles both base64 data URLs (new) and legacy filenames (old)
export const getFoodImageUrl = (image: string) => {
  if (!image) return "";
  if (image.startsWith("data:") || image.startsWith("http")) return image;
  return `${baseDomain}/images/${image}`;
};

