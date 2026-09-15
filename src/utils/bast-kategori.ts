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
