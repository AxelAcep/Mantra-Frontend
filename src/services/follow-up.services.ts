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

export interface FollowUpDokumen {
  id: string;
  namaFile: string;
  path: string;
  uploadedBy: string;
  pegawai?: { id: string; nama: string; divisi?: string };
  followUpId: string;
  createdAt: string;
}

export interface LogFollowUp {
  aksi: string;
  keterangan: string;
  pegawaiId: string;
  namaPegawai: string;
  createdAt: string;
}

export interface ActivityDetail {
  id: string;
  judul: string;
  status: string;
  createdAt: string;
  targetSelesai?: string;
  pegawai?: { id?: string; nama?: string; divisi?: string };
}

export interface FollowUpResponse {
  id: string;
  trackingPenawaranId: string;
  trackingPenawaran: TrackingPenawaranDetail;
  adminId?: string;
  admin?: { id: string; nama: string };
  activityAdminId?: string;
  activityAdmin?: ActivityDetail;
  activityAdminProyek?: ActivityDetail;
  salesId?: string;
  sales?: { id: string; nama: string };
  activitySalesId?: string;
  activitySales?: ActivityDetail;
  status: string;
  stage: number;
  logs: LogFollowUp[];
  logAktivitas: LogFollowUp[];
  dokumen: FollowUpDokumen[] | null;
  createdAt: string;
  updatedAt: string;
}

export async function getDetailFollowUp(
  trackingId: string,
): Promise<FollowUpResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/follow-up`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal mengambil data Follow Up.");
  }
  return res.json();
}

export async function updateStatusFollowUp(
  trackingId: string,
  payload: {
    stage?: number;
    status?:
      | "ON_PROGRESS"
      | "KONFIRMASI_SELESAI"
      | "SELESAI"
      | "PERLU_TINDAKAN";
    alasanPenolakan?: string;
  },
): Promise<FollowUpResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/follow-up/status`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal update status Follow Up.");
  }
  const json = await res.json();
  return json.data;
}

export async function batalkanFollowUp(
  trackingId: string,
  alasan: string,
): Promise<FollowUpResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/follow-up/batalkan`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ alasan }),
    },
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error ?? "Gagal membatalkan permintaan penawaran.",
    );
  }
  const json = await res.json();
  return json.data;
}

export async function uploadDokumenFollowUp(
  trackingId: string,
  file: File,
  kategori?: string,
): Promise<FollowUpDokumen> {
  const formData = new FormData();
  formData.append("file", file);
  if (kategori) {
    formData.append("kategori", kategori);
  }
  const res = await fetch(
    `${BASE_URL}/tracking-penawaran/${trackingId}/follow-up/dokumen`,
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
    throw new Error(errorData.message ?? "Gagal upload dokumen Follow Up.");
  }
  const json = await res.json();
  return json.data;
}

export async function deleteDokumenFollowUp(
  trackingId: string,
  dokumenId: string,
): Promise<void> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/follow-up/dokumen/${dokumenId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message ?? "Gagal hapus dokumen Follow Up.");
  }
}

export interface PegawaiAdminProyekOption {
  pegawaiId: string;
  nama: string;
}

export interface AssignAdminProyekResult {
  activityId: string;
  followUpId: string;
}

export async function getPegawaiAdminProyek(): Promise<
  PegawaiAdminProyekOption[]
> {
  const res = await fetchClient(`/tracking-penawaran/pegawai/admin-proyek`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal mengambil data pegawai.");
  }
  const json = await res.json();
  return json.data;
}

export async function assignAdminProyek(payload: {
  followUpId: string;
  pegawaiId: string;
}): Promise<AssignAdminProyekResult> {
  const res = await fetchClient(`/tracking-penawaran/follow-up/admin-proyek`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal menugaskan Admin Proyek.");
  }
  const json = await res.json();
  return json.data;
}

export interface FollowUpResponse {
  id: string;
  trackingPenawaranId: string;
  trackingPenawaran: TrackingPenawaranDetail;
  adminId?: string;
  admin?: { id: string; nama: string };
  activityAdminId?: string;
  activityAdmin?: ActivityDetail;
  activityAdminProyek?: ActivityDetail;
  salesId?: string;
  sales?: { id: string; nama: string };
  activitySalesId?: string;
  activitySales?: ActivityDetail;
  status: string;
  stage: number;
  TotalBAST?: number | null;
  logs: LogFollowUp[];
  logAktivitas: LogFollowUp[];
  dokumen: FollowUpDokumen[] | null;
  createdAt: string;
  updatedAt: string;
}

export async function inputBASTFollowup(
  trackingId: string,
  payload: { total_bast: number },
): Promise<FollowUpResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/follow-up/bast`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal update Total BAST.");
  }
  const json = await res.json();
  return json.data;
}
