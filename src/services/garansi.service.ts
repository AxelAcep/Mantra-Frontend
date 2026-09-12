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

export interface LogGaransi {
  aksi: string;
  keterangan: string;
  pegawaiId: string;
  namaPegawai: string;
  createdAt: string;
}

export interface GaransiActivityDokumen {
  id: string;
  namaFile: string;
  path: string;
  uploadedBy: string;
  pegawai?: { nama: string };
  createdAt: string;
}

export interface GaransiActivity {
  id: string;
  judul: string;
  deskripsi: string;
  status: string;
  waktuMulai?: string;
  targetSelesai?: string;
  pegawai?: { nama?: string; divisi?: string };
  dokumen?: GaransiActivityDokumen[];
}

export interface GaransiMonth {
  id: string;
  garansiId: string;
  bulanKe: number;
  bulan: number;
  tahun: number;
  tanggalKunjungan?: string;
  activityId?: string;
  activity?: GaransiActivity | null;
  status: string;
  activitySelesai: boolean;
  logs: LogGaransi[];
  createdAt: string;
  updatedAt: string;
}

export interface GaransiResponse {
  id: string;
  trackingPenawaranId: string;
  trackingPenawaran?: TrackingPenawaranDetail;
  bastId: string;
  picId: string;
  pic?: { id: string; nama: string; divisi?: string };
  status: string;
  kategoriGaransi?: string;
  lamaTahun?: number;
  bulanMulai?: number;
  tahunMulai?: number;
  logs: LogGaransi[];
  months: GaransiMonth[];
  createdAt: string;
  updatedAt: string;
}

export type KategoriGaransi =
  | "PAC_DALAM_KOTA"
  | "PAC_LUAR_KOTA"
  | "FIRE_DALAM_KOTA"
  | "FIRE_LUAR_KOTA"
  | "TIDAK_ADA";

export const KATEGORI_GARANSI_LABELS: Record<KategoriGaransi, string> = {
  PAC_DALAM_KOTA: "PAC Dalam Kota",
  PAC_LUAR_KOTA: "PAC Luar Kota",
  FIRE_DALAM_KOTA: "Fire Dalam Kota",
  FIRE_LUAR_KOTA: "Fire Luar Kota",
  TIDAK_ADA: "Tidak Ada Garansi",
};

export const KATEGORI_GARANSI_JUMLAH: Record<KategoriGaransi, string> = {
  PAC_DALAM_KOTA: "12x/tahun (1/bulan)",
  PAC_LUAR_KOTA: "2x/tahun (6 bulan interval)",
  FIRE_DALAM_KOTA: "4x/tahun (3 bulan interval)",
  FIRE_LUAR_KOTA: "2x/tahun (6 bulan interval)",
  TIDAK_ADA: "Tanpa garansi",
};

export async function getDetailGaransi(
  trackingId: string,
): Promise<GaransiResponse> {
  const res = await fetchClient(`/tracking-penawaran/${trackingId}/garansi`, {
    method: "GET",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error ?? "Gagal mengambil data Garansi.");
  }
  return res.json();
}

export async function konfigurasiGaransi(
  trackingId: string,
  payload: {
    kategoriGaransi: KategoriGaransi;
    lamaTahun: number;
    bulanMulai: number;
    tahunMulai: number;
  },
): Promise<GaransiResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/garansi/konfigurasi`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error ?? "Gagal mengkonfigurasi timeline Garansi.",
    );
  }
  const json = await res.json();
  return json.data;
}

export async function updateTanggalKunjunganGaransi(
  trackingId: string,
  monthId: string,
  payload: { tanggalKunjungan: string },
): Promise<GaransiResponse> {
  const res = await fetchClient(
    `/tracking-penawaran/${trackingId}/garansi/month/${monthId}/tanggal-kunjungan`,
    {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify(payload),
    },
  );
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(
      errorData.error ?? "Gagal memperbarui tanggal kunjungan.",
    );
  }
  const json = await res.json();
  return json.data;
}
