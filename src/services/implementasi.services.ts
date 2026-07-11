import type { TrackingPenawaranDetail } from "./penawaran.services";

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

export interface ImplementasiBarang {
  id: string;
  implementasiId: string;
  namaBarang: string;
  status: "Ready" | "Perlu Beli";
  qty: number;
  satuan: string;
  hargaSatuan: number;
  metode: string;
  estimasiKedatangan?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LogImplementasi {
  aksi: string;
  keterangan: string;
  pegawaiId: string;
  namaPegawai: string;
  createdAt: string;
}

export interface ImplementasiResponse {
  id: string;
  trackingPenawaranId: string;
  trackingPenawaran?: TrackingPenawaranDetail;
  noPO: string;
  tanggalPO?: string;
  noWO: string;
  tanggalWO?: string;
  noDO: string;
  tanggalDO?: string;
  status: string;
  logs: LogImplementasi[];
  logAktivitas: LogImplementasi[];
  barang: ImplementasiBarang[];
  activityPembelianId?: string;
  activityPembelian?: any;
  activityPengantaranId?: string;
  activityPengantaran?: any;
  activityInstalasiId?: string;
  activityInstalasi?: any;
  createdAt: string;
  updatedAt: string;
}

export async function getDetailImplementasi(
  trackingId: string,
): Promise<ImplementasiResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/implementasi`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal mengambil data Implementasi.");
  }
  return res.json();
}

export async function updateDetailImplementasi(
  trackingId: string,
  payload: {
    noPO?: string;
    tanggalPO?: string;
    noWO?: string;
    tanggalWO?: string;
    noDO?: string;
    tanggalDO?: string;
  },
): Promise<ImplementasiResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/implementasi`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal memperbarui detail Implementasi.");
  }
  const json = await res.json();
  return json.data;
}

export async function addBarangImplementasi(
  trackingId: string,
  payload: {
    namaBarang: string;
    status: string;
    qty: number;
    satuan: string;
    hargaSatuan: number;
    metode: string;
    estimasiKedatangan?: string;
  },
): Promise<ImplementasiResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/implementasi/barang`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal menambahkan barang.");
  }
  const json = await res.json();
  return json.data;
}

export async function updateBarangImplementasi(
  trackingId: string,
  barangId: string,
  payload: {
    namaBarang: string;
    status: string;
    qty: number;
    satuan: string;
    hargaSatuan: number;
    metode: string;
    estimasiKedatangan?: string;
  },
): Promise<ImplementasiResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/implementasi/barang/${barangId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal memperbarui barang.");
  }
  const json = await res.json();
  return json.data;
}

export async function deleteBarangImplementasi(
  trackingId: string,
  barangId: string,
): Promise<ImplementasiResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/implementasi/barang/${barangId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal menghapus barang.");
  }
  const json = await res.json();
  return json.data;
}
