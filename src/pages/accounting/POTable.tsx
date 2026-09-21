import { useState } from "react";
import { Link } from "react-router-dom";
import { useAccountingPOList } from "@/hooks/use-accounting-dashboard";
import type { StatusPembayaranPO } from "@/services/accounting-dashboard.service";
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
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusPembayaranPO | "">("");

  const { data, isLoading, isError } = useAccountingPOList({
    page,
    limit: 10,
    search,
    status,
  });

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="Cari nomor PO, perusahaan..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-gray-300"
        />
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value as StatusPembayaranPO | "");
            setPage(1);
          }}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 text-gray-600"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="w-full overflow-x-auto px-6 pb-4 pt-2">
        <div className="w-full rounded-md border border-slate-200 bg-white min-w-[1100px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
                <TableHead className="text-[#000000] text-xs font-semibold">NOMOR PO</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">PERUSAHAAN</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold text-right">DIBAYAR / NILAI PROYEK</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold text-center">PROGRESS TERMIN</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">TERMIN TERDEKAT</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold text-center">STATUS</TableHead>
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
