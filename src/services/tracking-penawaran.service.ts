const BASE_URL = import.meta.env.VITE_API_URL;

function logout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  localStorage.removeItem("login_at");
  window.location.href = "/";
}

function getToken(): string {
  return localStorage.getItem("token") ?? "";
}

export function authHeaders() {
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

export async function fetchClient(
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

export type CreateTrackingPenawaranPayload = {
  nomorPenawaran: string;
  perusahaanId: string;
  lokasiProyek: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  jenisPenawaran: string[];
};

export async function createTrackingPenawaran(
  payload: CreateTrackingPenawaranPayload,
): Promise<unknown> {
  const res = await fetchClient("/tracking-penawaran", {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? "Gagal membuat penawaran.");
  return data;
}

export type PenawaranListItem = {
  id: string;
  nomorPenawaran: string;
  tanggalMasuk: string;
  picReq: { id: string; nama: string } | null;
  pembuatPenawaran: { id: string; nama: string } | null;
  estimasiHarga: number | null;
  stepSaatIni: string;
  status: string;
};

export type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type PenawaranListResponse = {
  data: PenawaranListItem[];
  meta: PaginationMeta;
};

export type GetPenawaranListParams = {
  page?: number;
  limit?: number;
  search?: string;
  step?: string;
};

export async function getPenawaranList(
  params: GetPenawaranListParams = {},
): Promise<PenawaranListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.step) query.set("step", params.step);

  const res = await fetchClient(`/tracking-penawaran?${query.toString()}`, {
    headers: authHeaders(),
  });
  const data = await res.json();
  if (!res.ok)
    throw new Error(data.message ?? "Gagal mengambil data penawaran.");
  return data;
}
