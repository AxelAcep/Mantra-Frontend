export type KategoriBast = "PAC" | "FIRE" | "BATTERY" | "UMUM";

// Sama persis logikanya dengan backend (models.DetectBastKategori) — 3 grup
// garansi pengadaan:
//   PAC    : PAC Montair, Chiller, AC Split/Standing  (garansi 12/2)
//   FIRE   : Generator FirePro, Conventional Sys, Addressable Sys,
//            Stand Alone/BTA                          (garansi firepro)
//   BATTERY: Battery, UPS                             (garansi 4/2)
// Bisa return 1-3 kategori. Kalau gak ada satupun yang kedetect -> [UMUM].
export function detectBastKategori(jenisPenawaran: string[] | undefined | null): KategoriBast[] {
  const list = jenisPenawaran ?? [];

  const normalize = (s: string) =>
    s
      .trim()
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\//g, " ");

  const hasPAC = list.some((j) => {
    const n = normalize(j);
    return n.includes("pac montair") || n.includes("chiller") || n.includes("ac split");
  });
  const hasFire = list.some((j) => {
    const n = normalize(j);
    return (
      n.includes("generator") ||
      n.includes("fire") ||
      n.includes("conventional") ||
      n.includes("addressable") ||
      n.includes("stand alone") ||
      n.includes("bta")
    );
  });
  const hasBattery = list.some((j) => {
    const n = normalize(j);
    return n.includes("battery") || n.includes("ups");
  });

  const kategori: KategoriBast[] = [];
  if (hasPAC) kategori.push("PAC");
  if (hasFire) kategori.push("FIRE");
  if (hasBattery) kategori.push("BATTERY");
  if (kategori.length === 0) kategori.push("UMUM");
  return kategori;
}

export const KATEGORI_BAST_LABEL: Record<KategoriBast, string> = {
  PAC: "PAC",
  FIRE: "FirePro",
  BATTERY: "Battery",
  UMUM: "",
};

// Nomor BAST yang DITAMPILKAN di FE — beda dari kode asli (noReferensi) yang
// digenerate backend. Auto-increment per kategori: BAST/PAC/01, BAST/PAC/02,
// BAST/FP/01, BAST/BAT/01, dst. Kalau gak ada kategori (UMUM), cukup BAST/01.
// Murni tampilan, gak ngubah data yang beneran tersimpan di backend.
export function formatNomorBast(kategori: KategoriBast, index: number): string {
  const nomor = String(index).padStart(2, "0");
  if (kategori === "PAC") return `BAST/PAC/${nomor}`;
  if (kategori === "FIRE") return `BAST/FP/${nomor}`;
  if (kategori === "BATTERY") return `BAST/BAT/${nomor}`;
  return `BAST/${nomor}`;
}
