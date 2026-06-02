/* eslint-disable @typescript-eslint/no-explicit-any */
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

export interface Perusahaan {
  id: string;
  nama: string;
}

export interface Pegawai {
  id: string;
  nama: string;
  divisi: string;
  createdAt: string;
  updatedAt: string;
}

export interface TrackingPenawaran {
  id: string;
  nomorPenawaran: string;
  perusahaanId: string;
  perusahaan: Perusahaan;
  marketingId: string;
  marketing: Pegawai;
  lokasiProyek: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  jenisPenawaran: string[];
  stepSaatIni: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export type StatusActivity = "ON_PROGRESS" | "DONE" | "REJECTED" | string;

export interface PenawaranDokumen {
  id: string;
  penyusunanBoQId: string;
  namaDokumen: string;
  fileUrl: string;
  createdAt: string;
  updatedAt: string;
}

// TODO: Tolong kirim isi struct LogBoq dari Go lu biar gw gak ngasal bikin skemanya
export interface LogBoq {
  [key: string]: any;
}

// Types utama yang udah sinkron sama skema struct PenyusunanBoQ terbaru lu
export interface PenyusunanBoQResponse {
  id: string;
  trackingPenawaranId: string;
  trackingPenawaran: TrackingPenawaran;
  pembuatId: string | null;
  pembuat: Pegawai | null;
  activityId?: string | null;
  activity?: any | null; // Sesuaikan jika ada interface Activity
  estimasiHarga: number | null;
  harga1: number | null; // Di backend pastikan tag json diganti biar gak bentrok estimasiHarga
  harga2: number | null;
  harga3: number | null;
  status: StatusActivity;
  logs: LogBoq[]; // Hasil pemetaan dari field LogAktivitas `json:"logs"`
  dokumen: PenawaranDokumen[] | null;
  createdAt: string;
  updatedAt: string;
}

export async function getPreloadBoQ(
  trackingId: string,
): Promise<PenyusunanBoQResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/boq`, {
    method: "GET",
    headers: authHeaders(),
  });

  // Check condition res.ok SEBELUM res.json() untuk antisipasi error kosong
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message ?? "Gagal mengambil data BoQ.");
  }

  const data = await res.json();
  return data as PenyusunanBoQResponse;
}

export interface BoQDokumen {
  id: string;
  namaFile: string; // SINKRON: Backend pakai NamaFile / namaFile
  path: string; // SINKRON: Backend pakai Path / path
  uploadedBy: string;
  createdAt: string;
}

/**
 * Upload Dokumen BoQ
 * POST /boq/:id/dokumen
 */
/**
 * Upload Dokumen BoQ
 * POST /tracking-penawaran/:trackingId/boq/dokumen
 */
export async function uploadDokumenBoQ(
  trackingId: string,
  file: File,
): Promise<BoQDokumen> {
  const formData = new FormData();
  formData.append("file", file);

  // Murni pakai fetchClient. Validasi sesi & handling 401 sudah dicover di dalam fetchClient & authHeaders
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/boq/dokumen`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
        // JANGAN isi Content-Type manual di sini karena FormData butuh otomatisasi boundary oleh browser
      },
      body: formData,
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message ?? "Gagal upload dokumen BoQ");
  }

  const json = await res.json();
  return json.data; // Mengembalikan data sesuai struct model GORM backend
}

/**
 * Delete Dokumen BoQ
 * DELETE /tracking-penawaran/${trackingId}/boq/dokumen/${dokumenId}
 */
export async function deleteDokumenBoQ(
  trackingId: string,
  dokumenId: string,
): Promise<void> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/boq/dokumen/${dokumenId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message ?? "Gagal hapus dokumen BoQ");
  }
}

export async function updateSubTotalBoQ(
  trackingId: string,
  body: { harga1?: number; harga2?: number; harga3?: number },
): Promise<PenyusunanBoQResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/boq/subtotal`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(body),
    },
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal update sub total.");
  }
  const data = await res.json();
  return data.data as PenyusunanBoQResponse;
}

export async function updateStatusBoQ(
  trackingId: string,
  status: string,
  alasanPenolakan?: string,
): Promise<{ message: string; data: PenyusunanBoQResponse }> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/boq/status`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({
        status,
        alasanPenolakan,
      }),
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal mengupdate status BoQ.");
  }

  return res.json();
}
