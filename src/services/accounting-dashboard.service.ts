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

function authHeaders() {
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

export type FlagTermin = "LEWAT" | "1_MINGGU" | "2_MINGGU" | "";

export interface AccountingHighlightItem {
  itemTerminId: string;
  trackingId: string;
  nomorPenawaran: string;
  perusahaanName: string;
  namaTermin: string;
  persentase: number;
  nominal?: number;
  deadline: string;
  flag: FlagTermin;
  hariTersisa: number;
}

export interface AccountingSummaryResponse {
  totalPO: number;
  totalTerminBelum: number;
  totalTerminSudah: number;
  totalLewat: number;
  totalMendekati: number;
  highlights: AccountingHighlightItem[];
}

export type StatusPembayaranPO = "LUNAS" | "BELUM_LUNAS" | "OVERDUE";

export interface AccountingPOItem {
  trackingId: string;
  nomorPenawaran: string;
  perusahaanName: string;
  jenisPenawaran?: string[];
  totalTermin: number;
  terminSudah: number;
  persentaseDibayar: number;
  estimasiHarga?: number;
  nominalDibayar?: number;
  statusPembayaran: StatusPembayaranPO;
  terminTerdekatNama?: string;
  terminTerdekatDeadline?: string;
  terminTerdekatFlag?: FlagTermin;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AccountingPOListResponse {
  data: AccountingPOItem[];
  meta: PaginationMeta;
}

export async function getAccountingSummary(): Promise<AccountingSummaryResponse> {
  const res = await fetchClient("/accounting/summary", {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error ?? "Gagal mengambil ringkasan dashboard Accounting.",
    );
  }
  return res.json();
}

export interface GetAccountingPOListParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: StatusPembayaranPO | "";
}

export async function getAccountingPOList(
  params: GetAccountingPOListParams = {},
): Promise<AccountingPOListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));
  if (params.search) query.set("search", params.search);
  if (params.status) query.set("status", params.status);

  const res = await fetchClient(`/accounting/po?${query.toString()}`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal mengambil data PO Accounting.");
  }
  return res.json();
}
