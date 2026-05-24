import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "@/lib/store/auth";

function sanitizeUrl(url: string): string {
  if (!url) return "";
  if (!url.startsWith("http://") && !url.startsWith("https://") && !url.startsWith("/")) {
    return `https://${url}`;
  }
  return url;
}

const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";
export const baseDomain = sanitizeUrl(rawBase.replace(/\/api$/, ""));
export const baseURL = `${baseDomain}/api`;

export const api = axios.create({ baseURL });

let refreshPromise: Promise<string> | null = null;

function getPrefix(token?: string): string {
  if (!token) return "Bearer";
  try {
    const { role } = jwtDecode<{ role: string }>(token);
    return role === "admin" ? "System" : "Bearer";
  } catch {
    return "Bearer";
  }
}

async function refreshAccessToken(): Promise<string> {
  const { refresh_Token, setAccess_Token, setRefresh_Token } = useAuthStore.getState();
  const res = await axios.get(`${baseURL}/user/refresh-token`, {
    headers: {
      Authorization: `${getPrefix(refresh_Token)} ${refresh_Token}`,
    },
  });
  const { access_token, refresh_token } = res.data.data.credentials;
  setAccess_Token(access_token);
  setRefresh_Token(refresh_token);
  return access_token;
}

// ── Request interceptor — attach access token ────────────────────────────────
api.interceptors.request.use((config) => {
  const { access_Token } = useAuthStore.getState();
  if (access_Token) {
    config.headers = (config.headers || {}) as any;
    (config.headers as any).Authorization = `${getPrefix(access_Token)} ${access_Token}`;
  }
  return config;
});

// ── Response interceptor — auto-refresh on 401 ──────────────────────────────
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url?.includes("/refresh-token")
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken();
      }
      const newToken = await refreshPromise;
      refreshPromise = null;

      originalRequest.headers = (originalRequest.headers || {}) as any;
      (originalRequest.headers as any).Authorization = `${getPrefix(newToken)} ${newToken}`;
      delete originalRequest.signal;
      return api(originalRequest);
    } catch {
      refreshPromise = null;
      const { clearAuth } = useAuthStore.getState();
      clearAuth();
      window.location.href = "/auth/login";
      return Promise.reject(error);
    }
  },
);

export { getPrefix };
