export type KategoriBast = "PAC" | "FIRE" | "UMUM";

// Sama persis logikanya dengan backend (models.DetectBastKategori) — cuma 2
// hal yang dicek dari Jenis Penawaran: "PAC Montair" -> PAC, "Generator
// FirePro" -> FIRE. Item jenis penawaran lain gak ngaruh. Kalau dua-duanya
// ada -> [PAC, FIRE] (2 BAST). Kalau gak ada dua-duanya -> [UMUM] (1 BAST generik).
export function detectBastKategori(jenisPenawaran: string[] | undefined | null): KategoriBast[] {
  const list = jenisPenawaran ?? [];
  const hasPAC = list.some((j) => j.trim().toLowerCase() === "pac montair");
  const hasFire = list.some(
    (j) => j.trim().toLowerCase() === "generator firepro",
  );

  const kategori: KategoriBast[] = [];
  if (hasPAC) kategori.push("PAC");
  if (hasFire) kategori.push("FIRE");
  if (kategori.length === 0) kategori.push("UMUM");
  return kategori;
}

export const KATEGORI_BAST_LABEL: Record<KategoriBast, string> = {
  PAC: "PAC",
  FIRE: "Fire",
  UMUM: "",
};

// Nomor BAST yang DITAMPILKAN di FE — beda dari kode asli (noReferensi) yang
// digenerate backend. Auto-increment per kategori: BAST/PAC/01, BAST/PAC/02,
// BAST/FP/01, dst. Kalau gak ada kategori (UMUM), cukup BAST/01. Murni
// tampilan, gak ngubah data yang beneran tersimpan di backend.
export function formatNomorBast(kategori: KategoriBast, index: number): string {
  const nomor = String(index).padStart(2, "0");
  if (kategori === "PAC") return `BAST/PAC/${nomor}`;
  if (kategori === "FIRE") return `BAST/FP/${nomor}`;
  return `BAST/${nomor}`;
}
