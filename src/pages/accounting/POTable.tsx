import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useAccountingPOList } from "@/hooks/use-accounting-dashboard";
import type {
  AccountingPOFlag,
  AccountingPOSortBy,
  StatusPembayaranPO,
} from "@/services/accounting-dashboard.service";
import { formatNomorPenawaran } from "@/lib/utils";
import { useListParams } from "@/hooks/use-list-params";
import SortableHeader from "@/components/ui/sortable-header";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

function formatTanggal(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(nilai: number | null | undefined) {
  if (nilai == null) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

const STATUS_OPTIONS: { value: StatusPembayaranPO | ""; label: string }[] = [
  { value: "", label: "Semua Status" },
  { value: "BELUM_LUNAS", label: "Belum Lunas" },
  { value: "OVERDUE", label: "Ada yang Overdue" },
  { value: "LUNAS", label: "Lunas" },
];

function StatusBadge({ status }: { status: StatusPembayaranPO }) {
  const config: Record<StatusPembayaranPO, string> = {
    LUNAS: "bg-emerald-100 text-emerald-700",
    BELUM_LUNAS: "bg-amber-100 text-amber-700",
    OVERDUE: "bg-red-100 text-red-700",
  };
  const label: Record<StatusPembayaranPO, string> = {
    LUNAS: "Lunas",
    BELUM_LUNAS: "Belum Lunas",
    OVERDUE: "Ada yang Overdue",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent whitespace-nowrap ${config[status]}`}
    >
      {label[status]}
    </span>
  );
}

function ProgressBadge({ selesai, total }: { selesai: number; total: number }) {
  if (!total) return <span className="text-gray-300">—</span>;
  const isComplete = selesai === total;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent whitespace-nowrap ${isComplete ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
      {selesai} Dari {total}
    </span>
  );
}

export default function POTable() {
  const {
    page,
    sortBy,
    sortDir,
    search,
    filters,
    setPage,
    toggleSort,
    setFilter,
    update,
  } = useListParams({
    defaultSortBy: "deadline",
    defaultSortDir: "asc",
    filters: { status: "", flag: "" },
  });

  const status = filters.status as StatusPembayaranPO | "";
  const flag = filters.flag as AccountingPOFlag;

  // Input pencarian ditahan sebentar sebelum ditulis ke URL supaya setiap
  // ketikan tidak memicu entri history & refetch sendiri-sendiri.
  const [searchDraft, setSearchDraft] = useState(search);

  useEffect(() => {
    setSearchDraft(search);
  }, [search]);

  useEffect(() => {
    if (searchDraft === search) return;
    const timer = setTimeout(() => update({ search: searchDraft }), 400);
    return () => clearTimeout(timer);
  }, [searchDraft, search, update]);

  const { data, isLoading, isError } = useAccountingPOList({
    page,
    limit: 10,
    search,
    status,
    sortBy: sortBy as AccountingPOSortBy,
    sortDir,
    flag,
  });

  const activeFilterLabel =
    flag === "MENDEKATI"
      ? "Mendekati Tenggat (≤2 Minggu)"
      : flag === "LEWAT"
        ? "Lewat Tenggat"
        : "";

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Cari nomor PO, perusahaan..."
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-gray-300"
        />
        <select
          value={status}
          onChange={(e) => setFilter("status", e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-gray-600"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        {activeFilterLabel && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-medium">
            Filter: {activeFilterLabel}
            <button
              type="button"
              onClick={() => setFilter("flag", "")}
              aria-label="Hapus filter tenggat"
              className="rounded-full p-0.5 hover:bg-cyan-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40"
            >
              <X className="w-3 h-3" />
            </button>
          </span>
        )}
      </div>

      <div className="w-full overflow-x-auto px-6 pb-4 pt-2">
        <div className="w-full rounded-md border border-slate-200 bg-white min-w-[1100px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
                <SortableHeader label="Nomor PO" column="nomorPenawaran" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Perusahaan" column="perusahaanName" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Dibayar / Nilai Proyek" column="persentaseDibayar" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} align="right" />
                <TableHead className="text-[#000000] text-xs font-semibold text-center">PROGRESS TERMIN</TableHead>
                <SortableHeader label="Termin Terdekat" column="deadline" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} />
                <SortableHeader label="Status" column="status" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} align="center" />
                <TableHead className="text-[#000000] text-xs font-semibold text-right">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                    Memuat data...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-red-500 text-sm">
                    Gagal memuat data.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-10 text-muted-foreground text-sm">
                    Tidak ada data PO Accounting.
                  </TableCell>
                </TableRow>
              )}
              {!isError && data?.data.map((item) => (
                <TableRow key={item.trackingId} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-gray-800">
                    {formatNomorPenawaran(item.nomorPenawaran)}
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {item.perusahaanName || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    {item.estimasiHarga != null ? (
                      <>
                        <p className="text-gray-800 text-xs whitespace-nowrap">
                          {formatRupiah(item.nominalDibayar ?? 0)}
                          <span className="text-gray-400"> / </span>
                          {formatRupiah(item.estimasiHarga)}
                        </p>
                        <p className={`text-xs mt-0.5 ${item.persentaseDibayar >= 100 ? "text-emerald-500" : "text-amber-500"}`}>
                          {item.persentaseDibayar.toFixed(0)}% terbayar
                        </p>
                      </>
                    ) : (
                      <span className="text-gray-300">Belum Tersedia</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <ProgressBadge selesai={item.terminSudah} total={item.totalTermin} />
                  </TableCell>
                  <TableCell>
                    {item.terminTerdekatDeadline ? (
                      <>
                        <p className="text-gray-800 text-xs">
                          {item.terminTerdekatNama}
                        </p>
                        <p
                          className={`text-xs mt-0.5 ${
                            item.terminTerdekatFlag === "LEWAT"
                              ? "text-red-500"
                              : item.terminTerdekatFlag === "1_MINGGU" ||
                                  item.terminTerdekatFlag === "2_MINGGU"
                                ? "text-amber-500"
                                : "text-gray-400"
                          }`}
                        >
                          {formatTanggal(item.terminTerdekatDeadline)}
                        </p>
                      </>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.statusPembayaran} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Link to={`/penawaran/${item.trackingId}`} className="text-cyan-600 text-sm font-medium hover:underline whitespace-nowrap">
                      Lihat Detail
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-50">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-700">{data.data.length}</span> dari <span className="font-semibold text-slate-700">{data.meta.total}</span> data
          </p>
          <div className="flex items-center gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors">‹</button>
            <span className="text-sm text-slate-500 px-2">{page} / {data.meta.totalPages}</span>
            <button onClick={() => setPage(Math.min(data.meta.totalPages, page + 1))} disabled={page === data.meta.totalPages}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors">›</button>
          </div>
        </div>
      )}
    </div>
  );
}
