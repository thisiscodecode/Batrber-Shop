const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

interface RequestOptions extends RequestInit {
  token?: string;
}

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, ...fetchOptions } = options;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((fetchOptions.headers as Record<string, string>) || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail || `HTTP ${res.status}`);
  }

  if (res.status === 204) return null as T;
  return res.json();
}

export const api = {
  auth: {
    login: (username: string, password: string) =>
      request<{ access_token: string; refresh_token: string }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      }),
    refresh: (refresh_token: string) =>
      request<{ access_token: string; refresh_token: string }>("/auth/refresh", {
        method: "POST",
        body: JSON.stringify({ refresh_token }),
      }),
  },
  bookings: {
    list: (params?: {
      status?: string;
      date_from?: string;
      date_to?: string;
      service_id?: number;
      search?: string;
      token?: string;
    }) => {
      const searchParams = new URLSearchParams();
      if (params?.status) searchParams.set("status", params.status);
      if (params?.date_from) searchParams.set("date_from", params.date_from);
      if (params?.date_to) searchParams.set("date_to", params.date_to);
      if (params?.service_id) searchParams.set("service_id", String(params.service_id));
      if (params?.search) searchParams.set("search", params.search);
      const qs = searchParams.toString();
      return request<any[]>(`/bookings${qs ? `?${qs}` : ""}`, { token: params?.token });
    },
    get: (id: number, token?: string) =>
      request<any>(`/bookings/${id}`, { token }),
    updateStatus: (id: number, status: string, note: string | null, token?: string) =>
      request<any>(`/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, note }),
        token,
      }),
    stats: (token?: string) =>
      request<{ total: number; pending: number; confirmed: number; rejected: number }>(
        "/bookings/stats",
        { token }
      ),
  },
  services: {
    list: (includeInactive = false, token?: string) =>
      request<any[]>(`/services${includeInactive ? "?include_inactive=true" : ""}`, { token }),
    create: (data: { title: string; duration: number; price: number }, token?: string) =>
      request<any>("/services", { method: "POST", body: JSON.stringify(data), token }),
    update: (id: number, data: any, token?: string) =>
      request<any>(`/services/${id}`, { method: "PATCH", body: JSON.stringify(data), token }),
    deactivate: (id: number, token?: string) =>
      request<null>(`/services/${id}`, { method: "DELETE", token }),
  },
  export: {
    bookingsUrl: (dateFrom?: string, dateTo?: string, status?: string, token?: string) => {
      const searchParams = new URLSearchParams();
      if (dateFrom) searchParams.set("date_from", dateFrom);
      if (dateTo) searchParams.set("date_to", dateTo);
      if (status) searchParams.set("status", status);
      const qs = searchParams.toString();
      return `${API_BASE}/export/bookings.xlsx${qs ? `?${qs}` : ""}`;
    },
  },
  health: () => request<{ status: string }>("/health"),
};
