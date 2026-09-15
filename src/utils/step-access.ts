// Matrix hak akses "siapa boleh LIHAT tahap apa" di wizard Pengadaan Barang —
// harus sinkron sama backend (src/controllers/step_access.go). MO
// (MANAGER_OPERASIONAL), DIREKTUR, KOMISARIS, dan role MASTER selalu boleh
// akses semua tahap.
//
// "Admin Proyek" (step 5 Follow Up, 6 Implementasi, 7 BAST, 8 Garansi) BUKAN
// divisi tetap — itu pegawai spesifik yang di-assign per-tracking (lewat
// AssignAdminProyek) — jadi dicek terpisah lewat parameter `isAdminProyek`,
// bukan daftar divisi.

const FULL_ACCESS_DIVISI = ["MANAGER_OPERASIONAL", "DIREKTUR", "KOMISARIS"];

const STEP_ALLOWED_DIVISI: Record<number, string[]> = {
  1: ["SALES", "ADMIN_SEKERTARIS", "PRESALES"], // Permintaan Masuk
  2: ["SALES", "ADMIN_SEKERTARIS", "PRESALES"], // Penyusunan BoQ
  3: ["ADMIN_SEKERTARIS", "ADMIN_SEKERTARIAT"], // Review Internal
  4: ["ADMIN_SEKERTARIS", "ADMIN_SEKERTARIAT"], // Persetujuan Manajemen
  5: ["SALES", "ADMIN_SEKERTARIAT", "FINANCE_ACCOUNTING"], // Follow Up
  6: ["SALES", "PROCUREMENT_GA", "FINANCE_ACCOUNTING", "ADMIN_SEKERTARIAT"], // Implementasi
  7: ["SALES", "FINANCE_ACCOUNTING"], // BAST
  8: ["FINANCE_ACCOUNTING"], // Garansi
  9: ["FINANCE_ACCOUNTING"], // Accounting
};

const ADMIN_PROYEK_STEPS = [5, 6, 7, 8];

export function canViewPengadaanStep(
  step: number,
  role: string,
  divisi: string,
): boolean {
  if (role === "MASTER") return true;
  if (FULL_ACCESS_DIVISI.includes(divisi)) return true;
  return (STEP_ALLOWED_DIVISI[step] ?? []).includes(divisi);
}

// Sama kayak canViewPengadaanStep, ditambah pengecualian Admin Proyek buat
// step Follow Up/Implementasi/BAST/Garansi.
export function canViewPengadaanStepWithAdminProyek(
  step: number,
  role: string,
  divisi: string,
  isAdminProyek: boolean,
): boolean {
  if (canViewPengadaanStep(step, role, divisi)) return true;
  return ADMIN_PROYEK_STEPS.includes(step) && isAdminProyek;
}
