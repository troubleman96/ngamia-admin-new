const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080";

const ACCESS_TOKEN_KEY = "ngamia_admin_access_token";
const REFRESH_TOKEN_KEY = "ngamia_admin_refresh_token";
const ADMIN_PROFILE_KEY = "ngamia_admin_profile";

export type ApiError = {
  status: number;
  code: string;
  message: string;
  requestId?: string;
};

export class ApiClientError extends Error {
  status: number;
  code: string;
  requestId?: string;

  constructor(error: ApiError) {
    super(error.message);
    this.name = "ApiClientError";
    this.status = error.status;
    this.code = error.code;
    this.requestId = error.requestId;
  }
}

async function parseErrorResponse(res: Response): Promise<ApiClientError> {
  let message = `Request failed with status ${res.status}`;
  let code = "unknown_error";
  let requestId: string | undefined;

  try {
    const body = await res.json();
    if (body.message) message = body.message;
    if (body.error_code) code = body.error_code;
    if (body.request_id) requestId = body.request_id;

    if (body.error?.message) message = body.error.message;
    if (body.error?.type) code = body.error.type;
  } catch {
    // ignore JSON parse errors
  }

  return new ApiClientError({ status: res.status, code, message, requestId });
}

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(ADMIN_PROFILE_KEY);
}

export function setAdminProfile(profile: unknown) { localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(profile)); }
export function getAdminProfile<T = { email?: string; full_name?: string; role?: string }>(): T | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(ADMIN_PROFILE_KEY);
  try { return raw ? JSON.parse(raw) as T : null; } catch { return null; }
}

async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  if (!refreshToken) return false;

  try {
    const res = await fetch(`${API_BASE_URL}/v1/admin/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    const body = await res.json();
    setTokens(body.access_token, body.refresh_token);
    return true;
  } catch {
    return false;
  }
}

export async function apiRequest<T = unknown>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
    auth?: boolean;
    signal?: AbortSignal;
  } = {}
): Promise<T> {
  const { method = "GET", body, headers = {}, auth = true, signal } = options;

  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...headers,
  };

  if (auth) {
    const token = getAccessToken();
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`;
    }
  }

  let res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: requestHeaders,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    signal,
  });

  if (res.status === 401 && auth) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const token = getAccessToken();
      if (token) {
        requestHeaders.Authorization = `Bearer ${token}`;
      }
      res = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: requestHeaders,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
      });
    } else {
      clearTokens();
      // eslint-disable-next-line @next/next/no-location-assign-relative-destination
      window.location.href = "/login";
      throw new ApiClientError({
        status: 401,
        code: "unauthorized",
        message: "Session expired. Please sign in again.",
      });
    }
  }

  if (!res.ok) {
    throw await parseErrorResponse(res);
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const json = await res.json();
    return (json.data ?? json) as T;
  }
  return (await res.text()) as T;
}

export const api = {
  get: <T = unknown>(path: string, opts?: Parameters<typeof apiRequest>[1]) =>
    apiRequest<T>(path, { ...opts, method: "GET" }),
  post: <T = unknown>(path: string, body?: unknown, opts?: Parameters<typeof apiRequest>[1]) =>
    apiRequest<T>(path, { ...opts, method: "POST", body }),
  put: <T = unknown>(path: string, body?: unknown, opts?: Parameters<typeof apiRequest>[1]) =>
    apiRequest<T>(path, { ...opts, method: "PUT", body }),
  patch: <T = unknown>(path: string, body?: unknown, opts?: Parameters<typeof apiRequest>[1]) =>
    apiRequest<T>(path, { ...opts, method: "PATCH", body }),
  delete: <T = unknown>(path: string, opts?: Parameters<typeof apiRequest>[1]) =>
    apiRequest<T>(path, { ...opts, method: "DELETE" }),
};
