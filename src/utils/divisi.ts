// Label divisi untuk ditampilkan ke user. Nilai di database tetap apa adanya
// karena dipakai untuk pengecekan hak akses (lihat utils/step-access.ts).
const LABEL_KHUSUS: Record<string, string> = {
    // Alur pengadaan barang mewajibkan ADMIN_SEKERTARIS, tapi di sisi user
    // jabatannya disebut "Sekertaris" saja.
    ADMIN_SEKERTARIS: "Sekertaris",
    IT: "IT",
    PROCUREMENT_GA: "Procurement & GA",
    FINANCE_ACCOUNTING: "Finance & Accounting",
    MAINTENANCE_PAC: "Maintenance PAC",
    PRESALES: "Pre-Sales",
}

export function labelDivisi(divisi?: string | null): string {
    if (!divisi) return "—"
    if (LABEL_KHUSUS[divisi]) return LABEL_KHUSUS[divisi]
    return divisi
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase())
}
