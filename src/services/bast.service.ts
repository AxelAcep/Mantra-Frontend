/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface LogBast {
  aksi: string;
  keterangan: string;
  pegawaiId: string;
  namaPegawai: string;
  createdAt: string;
}

export interface BastResponse {
  id: string;
  trackingPenawaranId: string;
  trackingPenawaran?: TrackingPenawaranDetail;
  noReferensi: string;
  tanggalTerbit?: string;
  tanggalSerahTerima?: string;
  status: string;
  logs: LogBast[];
  activityAdminProyekId?: string;
  activityAdminProyek?: any;
  createdAt: string;
  updatedAt: string;
}

export async function getDetailBast(trackingId: string): Promise<BastResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/bast`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal mengambil data BAST.");
  }
  return res.json();
}

export async function updateDetailBast(
  trackingId: string,
  payload: {
    noReferensi?: string;
    tanggalTerbit?: string;
    tanggalSerahTerima?: string;
  },
): Promise<BastResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/bast`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal memperbarui detail BAST.");
  }
  const json = await res.json();
  return json.data;
}
