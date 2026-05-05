// src/services/penawaran.services.ts

const BASE_URL = import.meta.env.VITE_API_URL;

// ── Auth helpers ───────────────────────────────────────────────────────────

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

// ── Types ──────────────────────────────────────────────────────────────────

export interface PegawaiInfo {
  id: string;
  nama: string;
  divisi?: string;
}

export interface ActivityInfo {
  id: string;
  judul: string;
  status: string;
  targetSelesai: string;
  waktuMulai: string;
}

export interface PenawaranDokumen {
  id: string;
  namaFile: string;
  path: string;
  uploadedBy: string;
  createdAt: string;
}

export interface PermintaanMasukDetail {
  id: string;
  trackingPenawaranId: string;
  preSalesId?: string;
  preSales?: PegawaiInfo;
  activityId?: string;
  activity?: ActivityInfo;
  status: StatusPermintaan; // ← pakai type, bukan string
  logs?: LogAktivitas[]; // ← tambah
  dokumen?: PenawaranDokumen[];
  createdAt: string;
  updatedAt: string;
}

export interface LogAktivitas {
  aksi: string;
  keterangan: string;
  pegawaiId: string;
  namaPegawai: string;
  createdAt: string;
}

export interface TrackingPenawaranDetail {
  id: string;
  nomorPenawaran: string;
  nomorPO?: string;
  perusahaanId: string;
  perusahaan: {
    id: string;
    nama: string;
  };
  marketingId: string;
  marketing: PegawaiInfo;
  lokasiProyek: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  jenisPenawaran: string[];
  stepSaatIni: string;
  permintaanMasuk?: PermintaanMasukDetail;
  createdAt: string;
  updatedAt: string;
  status: string;
}

// Shape PenawaranChat — sama persis dengan Chat di activity
// supaya ChatPanel bisa reuse tanpa ubah komponen
export interface PenawaranChat {
  id: string;
  trackingPenawaranId: string;
  pegawaiId: string;
  pegawai: PegawaiInfo;
  pesan: string;
  readBy: string[];
  createdAt: string;
}

// ── API: Detail ────────────────────────────────────────────────────────────

export async function getDetailTrackingPenawaran(
  id: string,
): Promise<TrackingPenawaranDetail> {
  const res = await fetchClient(`/tracking-penawaran/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil detail penawaran");
  return res.json();
}

// ── API: Assign PreSales ───────────────────────────────────────────────────

export async function assignPreSales(
  trackingId: string,
  preSalesId: string,
): Promise<void> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/presales`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ preSalesId }),
  });
  if (!res.ok) throw new Error("Gagal assign pre-sales");
}

// ── API: Update Status ─────────────────────────────────────────────────────

export type StatusPermintaan =
  | "ON_PROGRESS"
  | "PERLU_TINDAKAN"
  | "KONFIRMASI_SELESAI"
  | "DITERIMA"
  | "DITOLAK"
  | "SELESAI";

export async function updateStatusPermintaanMasuk(
  trackingId: string,
  status: StatusPermintaan,
  alasanPenolakan?: string,
): Promise<void> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status, alasanPenolakan }),
  });
  if (!res.ok) throw new Error("Gagal update status");
}

// ── API: Chat ──────────────────────────────────────────────────────────────

// GET /:id/chat → { message, data: PenawaranChat[] }
export async function getPenawaranChat(
  trackingId: string,
): Promise<PenawaranChat[]> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/chat`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mengambil chat");
  const json = await res.json();
  return json.data;
}

export async function kirimPenawaranChat(
  trackingId: string,
  pesan: string,
): Promise<PenawaranChat> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/chat`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ pesan }),
  });
  if (!res.ok) throw new Error("Gagal kirim pesan");
  const json = await res.json();
  return json.data;
}

export async function updatePenawaranChat(
  chatId: string,
  pesan: string,
): Promise<PenawaranChat> {
  const res = await fetchClient(`/tracking-penawaran/chat/${chatId}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ pesan }),
  });
  if (!res.ok) throw new Error("Gagal update pesan");
  const json = await res.json();
  return json.data;
}

export async function readPenawaranChat(trackingId: string): Promise<void> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/chat/read`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal mark read");
}

export async function getUnreadPenawaranCount(
  trackingId: string,
): Promise<number> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/chat/unread`,
    {
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error("Gagal ambil unread count");
  const json = await res.json();
  return json.unreadCount;
}

export async function getTotalUnreadPenawaranCount(): Promise<number> {
  const res = await fetchClient(`/tracking-penawaran/chat/unread-total`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Gagal ambil total unread");
  const json = await res.json();
  return json.totalUnread;
}

export interface PegawaiOption {
  id: string;
  nama: string;
  divisi: string;
}

export async function getPegawaiByDivisi(
  divisi: string,
): Promise<PegawaiOption[]> {
  const res = await fetchClient(
    `/tracking-penawaran/pegawai?divisi=${divisi}`, // ← pastikan ini
    { headers: authHeaders() },
  );
  if (!res.ok) throw new Error("Gagal mengambil data pegawai");
  const json = await res.json();
  return json.data;
}

// penawaran.services.ts — tambah

export async function uploadPenawaranDokumen(
  permintaanMasukId: string,
  file: File,
): Promise<PenawaranDokumen> {
  const loginAt = localStorage.getItem("login_at");
  const TWENTY_HOURS = 20 * 60 * 60 * 1000;
  if (!loginAt || Date.now() - parseInt(loginAt) > TWENTY_HOURS) {
    logout();
    throw new Error("Sesi habis.");
  }

  const formData = new FormData();
  formData.append("file", file);

  // Tidak set Content-Type — biar browser set boundary sendiri
  const res = await fetch(
    `${BASE_URL}/tracking-penawaran/permintaan-masuk/${permintaanMasukId}/dokumen`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${getToken()}`,
      },
      body: formData,
    },
  );

  if (res.status === 401) {
    logout();
    throw new Error("Sesi habis.");
  }
  if (!res.ok) throw new Error("Gagal upload dokumen");

  const json = await res.json();
  return json.data;
}

export async function deletePenawaranDokumen(
  permintaanMasukId: string,
  dokumenId: string,
): Promise<void> {
  const res = await fetchClient(
    `/tracking-penawaran/permintaan-masuk/${permintaanMasukId}/dokumen/${dokumenId}`,
    {
      method: "DELETE",
      headers: authHeaders(),
    },
  );
  if (!res.ok) throw new Error("Gagal hapus dokumen");
}

export async function updateDetailTrackingPenawaran(
  id: string,
  body: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    lokasiProyek: string;
  },
): Promise<void> {
  const res = await fetchClient(`/tracking-penawaran/${id}/detail`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Gagal update detail");
}

export async function assignMarketing(
  trackingId: string,
  marketingId: string,
): Promise<void> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/marketing`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ marketingId }),
  });
  if (!res.ok) throw new Error("Gagal assign marketing");
}

export type PenawaranListItem = {
  id: string;
  nomorPenawaran: string;
  tanggalMasuk: string;
  picReq?: { id: string; nama: string };
  pembuatPenawaran?: { id: string; nama: string };
  estimasiHarga?: number;
  stepSaatIni: string;
  status: "ON_PROGRESS" | "PERLU_TINDAKAN" | "KONFIRMASI_SELESAI" | "SELESAI";
};
