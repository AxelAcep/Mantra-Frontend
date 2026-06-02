const BASE_URL = import.meta.env.VITE_API_URL;

// ─────────────────────────────────────────────
// AUTH / SESSION
// ─────────────────────────────────────────────

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("login_at");
  window.location.href = "/";
}

function getToken(): string {
  return localStorage.getItem("token") ?? "";
}

function authHeaders(): HeadersInit {
  const loginAt = localStorage.getItem("login_at");
  const TWENTY_HOURS = 20 * 60 * 60 * 1000;

  if (!loginAt || Date.now() - parseInt(loginAt) > TWENTY_HOURS) {
    logout();
    throw new Error("Sesi habis.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`,
  };
}

// ─────────────────────────────────────────────
// FETCH WRAPPER
// ─────────────────────────────────────────────

async function fetchClient(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const res = await fetch(`${BASE_URL}${input}`, init);

  if (res.status === 401) {
    logout();
    throw new Error("Sesi habis.");
  }

  return res;
}

async function handleResponse<T>(res: Response): Promise<T> {
  const text = await res.text();

  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    const message = data?.error || data?.message || text || "Request gagal";

    throw new Error(message);
  }

  return data as T;
}

// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────

export type FlagTermin = "LEWAT" | "1_MINGGU" | "2_MINGGU" | "";

export interface ItemTermin {
  id: string;
  terminPembayaranId: string;
  index: number;
  namaTermin: string;
  persentase: number;
  sudahDibayar: boolean;
  tanggalDibayar?: string;
  keterangan?: string;
  deadline?: string;
  flag: FlagTermin;
  createdAt: string;
  updatedAt: string;
}

export interface TerminPembayaran {
  id: string;
  trackingPenawaranId: string;
  status: string;
  items: ItemTermin[];
  createdAt: string;
  updatedAt: string;
}

export interface ItemTerminInput {
  namaTermin: string;
  persentase: number;
  keterangan?: string;
  deadline?: string;
}

export interface UpsertAccountingPayload {
  items: ItemTerminInput[];
}

// ─────────────────────────────────────────────
// API
// ─────────────────────────────────────────────

export async function getAccounting(
  trackingId: string,
): Promise<TerminPembayaran> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/accounting`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  return handleResponse<TerminPembayaran>(res);
}

export async function createAccounting(
  trackingId: string,
  payload: UpsertAccountingPayload,
): Promise<TerminPembayaran> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/accounting`,
    {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );

  return handleResponse<TerminPembayaran>(res);
}

export async function updateAccounting(
  trackingId: string,
  payload: UpsertAccountingPayload,
): Promise<TerminPembayaran> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/accounting`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );

  return handleResponse<TerminPembayaran>(res);
}

export async function bayarItemTermin(
  trackingId: string,
  itemId: string,
): Promise<ItemTermin> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/accounting/item/${itemId}/bayar`,
    {
      method: "PATCH",
      headers: authHeaders(),
    },
  );

  return handleResponse<ItemTermin>(res);
}
