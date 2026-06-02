import type { TrackingPenawaran } from "./boq.service";

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

// ─── Types ────────────────────────────────────────────────────────────────────

export interface PersetujuanManajemenDokumen {
  id: string;
  namaFile: string;
  path: string;
  uploadedBy: string;
  persetujuanManajemenId: string;
  createdAt: string;
}

export interface LogPersetujuanManajemen {
  aksi: string;
  keterangan: string;
  pegawaiId: string;
  namaPegawai: string;
  createdAt: string;
}

export interface PersetujuanManajemenResponse {
  logs: LogPersetujuanManajemen[];
  id: string;
  trackingPenawaranId: string;
  trackingPenawaran: TrackingPenawaran;
  accDirekturKomisaris: boolean;
  status: string;
  logAktivitas: LogPersetujuanManajemen[];
  dokumen: PersetujuanManajemenDokumen[] | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * GET /tracking-penawaran/:id/persetujuan-manajemen
 */
export async function getDetailPersetujuanManajemen(
  trackingId: string,
): Promise<PersetujuanManajemenResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/persetujuan-manajemen`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error ?? "Gagal mengambil data Persetujuan Manajemen.",
    );
  }

  return res.json();
}

/**
 * PATCH /tracking-penawaran/:id/persetujuan-manajemen/status
 */
export async function updateStatusPersetujuanManajemen(
  trackingId: string,
  status: "SELESAI" | "PERLU_TINDAKAN" | "ON_PROGRESS",
  alasanPenolakan?: string,
): Promise<PersetujuanManajemenResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/persetujuan-manajemen/status`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status, alasanPenolakan: alasanPenolakan ?? "" }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error ?? "Gagal update status Persetujuan Manajemen.",
    );
  }

  const json = await res.json();
  return json.data;
}

/**
 * POST /tracking-penawaran/:id/persetujuan-manajemen/dokumen
 */
export async function uploadDokumenPersetujuanManajemen(
  trackingId: string,
  file: File,
): Promise<PersetujuanManajemenDokumen> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/persetujuan-manajemen/dokumen`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Gagal upload dokumen Persetujuan Manajemen.",
    );
  }

  const json = await res.json();
  return json.data;
}

/**
 * DELETE /tracking-penawaran/:id/persetujuan-manajemen/dokumen/:dokumenId
 */
export async function deleteDokumenPersetujuanManajemen(
  trackingId: string,
  dokumenId: string,
): Promise<void> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/persetujuan-manajemen/dokumen/${dokumenId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.message ?? "Gagal hapus dokumen Persetujuan Manajemen.",
    );
  }
}
