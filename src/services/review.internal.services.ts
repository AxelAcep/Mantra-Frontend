// ─── Types ────────────────────────────────────────────────────────────────────

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

export interface ReviewInternalDokumen {
  id: string;
  namaFile: string;
  path: string;
  uploadedBy: string;
  reviewInternalId: string;
  createdAt: string;
}

export interface LogReviewInternal {
  aksi: string;
  keterangan: string;
  pegawaiId: string;
  namaPegawai: string;
  createdAt: string;
}

export interface ReviewInternalResponse {
  logs: LogReviewInternal[];
  id: string;
  trackingPenawaranId: string;
  trackingPenawaran: TrackingPenawaran;
  accAdminDirektur: boolean;
  accManajerOps: boolean;
  status: string;
  logAktivitas: LogReviewInternal[];
  dokumen: ReviewInternalDokumen[] | null;
  createdAt: string;
  updatedAt: string;
}

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * GET /tracking-penawaran/:id/review-internal
 */
export async function getDetailReviewInternal(
  trackingId: string,
): Promise<ReviewInternalResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/review-internal`,
    {
      method: "GET",
      headers: authHeaders(),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal mengambil data Review Internal.");
  }

  return res.json();
}

/**
 * PATCH /tracking-penawaran/:id/review-internal/status
 */
export async function updateStatusReviewInternal(
  trackingId: string,
  status: "ACC" | "PERLU_TINDAKAN" | "ON_PROGRESS",
  alasanPenolakan?: string,
): Promise<ReviewInternalResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/review-internal/status`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status, alasanPenolakan: alasanPenolakan ?? "" }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal update status Review Internal.");
  }

  const json = await res.json();
  return json.data;
}

/**
 * POST /tracking-penawaran/:id/review-internal/dokumen
 */
export async function uploadDokumenReviewInternal(
  trackingId: string,
  file: File,
): Promise<ReviewInternalDokumen> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/review-internal/dokumen`,
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
    throw new Error(errorData.error ?? "Gagal upload dokumen Review Internal.");
  }

  const json = await res.json();
  return json.data;
}

/**
 * DELETE /tracking-penawaran/:id/review-internal/dokumen/:dokumenId
 */
export async function deleteDokumenReviewInternal(
  trackingId: string,
  dokumenId: string,
): Promise<void> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/review-internal/dokumen/${dokumenId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal hapus dokumen Review Internal.");
  }
}
