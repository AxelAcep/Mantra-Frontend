import { useState } from "react";
import { Link } from "react-router-dom";
import { usePenawaranListRiwayat } from "@/hooks/use-create-penawaran";
import { formatNomorPenawaran } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatTanggal(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatStepName(step: string) {
  const labels: Record<string, string> = {
    PERMINTAAN_MASUK: "Permintaan Masuk",
    PENYUSUNAN_BOQ: "Penyusunan BoQ",
    REVIEW_INTERNAL: "Review Internal",
    PERSETUJUAN_MANAJEMEN: "Persetujuan Manajemen",
    FOLLOW_UP: "Follow Up Klien",
    IMPLEMENTASI: "Implementasi",
    BAST: "BAST",
    PEMBAYARAN: "Accounting",
    GARANSI: "Garansi",
  };
  return labels[step] || step;
}

const STEP_FILTER_OPTIONS = [
  { value: "", label: "Semua Tahap" },
  { value: "PERMINTAAN_MASUK", label: "Permintaan Masuk" },
  { value: "PENYUSUNAN_BOQ", label: "Penyusunan BoQ" },
  { value: "REVIEW_INTERNAL", label: "Review Internal" },
  { value: "PERSETUJUAN_MANAJEMEN", label: "Persetujuan Manajemen" },
  { value: "FOLLOW_UP", label: "Follow Up Klien" },
  { value: "IMPLEMENTASI", label: "Implementasi" },
  { value: "BAST", label: "BAST" },
  { value: "PEMBAYARAN", label: "Accounting" },
  { value: "GARANSI", label: "Garansi" },
];

const OVERALL_STATUS_FILTER_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "ON_PROGRESS", label: "On Progress" },
  { value: "SELESAI", label: "Selesai" },
  { value: "DIBATALKAN", label: "Case Closed" },
] as const;

function OverallStatusBadge({ status }: { status?: string }) {
  const config: Record<string, string> = {
    ON_PROGRESS: "bg-orange-100 text-orange-700",
    SELESAI: "bg-emerald-100 text-emerald-700",
    DIBATALKAN: "bg-red-100 text-red-700",
  };
  const label: Record<string, string> = {
    ON_PROGRESS: "On Progress",
    SELESAI: "Selesai",
    DIBATALKAN: "Case Closed",
  };
  const safeStatus = config[status ?? ""] ? status! : "ON_PROGRESS";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent whitespace-nowrap ${config[safeStatus]}`}
    >
      {label[safeStatus]}
    </span>
  );
}

// Riwayat = SEMUA TrackingPenawaran, status/step apapun (termasuk yang
// dibatalkan) — gak dibatasin ke satu step tertentu, cuma bisa difilter
// manual lewat dropdown di bawah.
export default function TableRiwayat() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [step, setStep] = useState("");
  const [overallStatus, setOverallStatus] = useState<
    "" | "ON_PROGRESS" | "SELESAI" | "DIBATALKAN"
  >("");

  const { data, isLoading, isError } = usePenawaranListRiwayat({
    page,
    limit: 10,
    search,
    step: step || undefined,
    overallStatus: overallStatus || undefined,
  });

  return (
    <div>
      {/* Search & Filter */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Cari nomor PO, nomor WO, nomor penawaran, perusahaan, lokasi..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-gray-300"
        />
        <select
          value={step}
          onChange={(e) => {
            setStep(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-gray-600"
        >
          {STEP_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <select
          value={overallStatus}
          onChange={(e) => {
            setOverallStatus(
              e.target.value as "" | "ON_PROGRESS" | "SELESAI" | "DIBATALKAN",
            );
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-gray-600"
        >
          {OVERALL_STATUS_FILTER_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-x-auto px-6 pb-4 pt-2">
        <div className="w-full rounded-md border border-slate-200 bg-white min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
                <TableHead className="text-[#000000] text-xs font-semibold">NOMOR PO</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">NOMOR WO</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">PERUSAHAAN</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">JENIS PENGADAAN</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">TANGGAL MASUK</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold text-center">TAHAPAN SAAT INI</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold text-center">STATUS</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold text-right">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                    Memuat data...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-red-500 text-sm">
                    Gagal memuat data.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                    Tidak ada data riwayat pengadaan.
                  </TableCell>
                </TableRow>
              )}
              {!isError && data?.data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-gray-800">
                    {item.nomorPO || formatNomorPenawaran(item.nomorPenawaran)}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {item.nomorWO || "—"}
                  </TableCell>
                  <TableCell className="font-semibold text-gray-800">
                    {item.perusahaanName || "—"}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.jenisPenawaran?.map((jenis) => (
                        <span key={jenis} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                          {jenis.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      )) || "—"}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {formatTanggal(item.tanggalMasuk)}
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold whitespace-nowrap">
                      {formatStepName(item.stepSaatIni)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <OverallStatusBadge status={item.overallStatus} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/penawaran/${item.id}`} className="text-cyan-600 text-sm font-medium hover:underline whitespace-nowrap">
                      Lihat Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-700">{data.data.length}</span> dari <span className="font-semibold text-slate-700">{data.meta.total}</span> data
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
            <span className="text-sm text-slate-500 px-2">{page} / {data.meta.totalPages}</span>
            <button onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))} disabled={page === data.meta.totalPages}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
          </div>
        </div>
      )}
    </div>
  );
}
