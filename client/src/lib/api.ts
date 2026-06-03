const BASE_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? "http://localhost:5000";

const TOKEN_KEY = "ahmed-store-token";

// ── Token helpers ─────────────────────────────────────────
export const tokenStorage = {
  get(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },
  set(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

// ── Custom error ──────────────────────────────────────────
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// ── Core fetch wrapper ────────────────────────────────────
async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStorage.get();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  const data = (await response.json()) as T & { message?: string };

  if (response.status === 401) {
    tokenStorage.clear();
    // Let AuthContext clear the user state
    window.dispatchEvent(new CustomEvent("auth:expired"));
    throw new ApiError(401, data.message ?? "Unauthorized");
  }

  if (!response.ok) {
    throw new ApiError(response.status, data.message ?? "Request failed");
  }

  return data;
}

// ── Public API methods ────────────────────────────────────
export const api = {
  get<T>(path: string): Promise<T> {
    return request<T>(path);
  },

  post<T>(path: string, body?: unknown): Promise<T> {
    return request<T>(path, {
      method: "POST",
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  },

  patch<T>(path: string, body: unknown): Promise<T> {
    return request<T>(path, {
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete<T>(path: string): Promise<T> {
    return request<T>(path, { method: "DELETE" });
  },
};
