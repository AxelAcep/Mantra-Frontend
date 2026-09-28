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
  2: ["SALES", "ADMIN_SEKERTARIS", "ADMIN_SEKERTARIAT", "PRESALES"], // Penyusunan BoQ
  3: ["ADMIN_SEKERTARIS", "ADMIN_SEKERTARIAT"], // Review Internal
  4: ["ADMIN_SEKERTARIS", "ADMIN_SEKERTARIAT"], // Persetujuan Manajemen
  5: ["SALES", "ADMIN_SEKERTARIS", "ADMIN_SEKERTARIAT", "FINANCE_ACCOUNTING"], // Follow Up
  6: ["SALES", "PROCUREMENT_GA", "FINANCE_ACCOUNTING", "ADMIN_SEKERTARIAT"], // Implementasi
  7: ["SALES", "FINANCE_ACCOUNTING"], // BAST
  8: ["FINANCE_ACCOUNTING"], // Garansi
  9: ["FINANCE_ACCOUNTING"], // Accounting
};

const ADMIN_PROYEK_STEPS = [5, 6, 7, 8];

const REVIEW_INTERNAL_STEP = 3;

export function canViewPengadaanStep(
  step: number,
  role: string,
  divisi: string,
): boolean {
  if (role === "MASTER") return true;
  if (FULL_ACCESS_DIVISI.includes(divisi)) return true;
  // Supervisi Sales -- approver gate di Review Internal, boleh liat SEMUA
  // tracking di step ini, gak cuma yang sales-nya terkait dia (beda sama
  // isRelatedSales di bawah, yang di-scope per-tracking).
  if (
    step === REVIEW_INTERNAL_STEP &&
    role === "SUPERVISI" &&
    divisi === "SALES"
  )
    return true;
  return (STEP_ALLOWED_DIVISI[step] ?? []).includes(divisi);
}

// Sama kayak canViewPengadaanStep, ditambah pengecualian: Admin Proyek buat
// step Follow Up/Implementasi/BAST/Garansi, dan Sales terkait (marketingId
// tracking ini) buat step Review Internal.
export function canViewPengadaanStepWithAdminProyek(
  step: number,
  role: string,
  divisi: string,
  isAdminProyek: boolean,
  isRelatedSales = false,
): boolean {
  if (canViewPengadaanStep(step, role, divisi)) return true;
  if (ADMIN_PROYEK_STEPS.includes(step) && isAdminProyek) return true;
  return step === REVIEW_INTERNAL_STEP && isRelatedSales;
}
