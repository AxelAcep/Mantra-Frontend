import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAccountingPOList } from "@/hooks/use-accounting-dashboard";
import type { StatusPembayaranPO } from "@/services/accounting-dashboard.service";

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
  return (
    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100 whitespace-nowrap">
      {selesai} DARI {total}
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
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 [&_th]:py-3.5 text-slate-600 text-xs font-medium uppercase tracking-wider">
                <th className="px-6 py-4">Nomor PO</th>
                <th className="px-6 py-4">Perusahaan</th>
                <th className="px-6 py-4 text-right">Dibayar / Nilai Proyek</th>
                <th className="px-6 py-4 text-center">Progress Termin</th>
                <th className="px-6 py-4">Termin Terdekat</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {isLoading && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-400 text-sm">
                    Memuat data...
                  </td>
                </tr>
              )}
              {isError && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-red-400 text-sm">
                    Gagal memuat data.
                  </td>
                </tr>
              )}
              {!isLoading && !isError && data?.data.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-gray-300 text-sm">
                    Tidak ada data PO Accounting.
                  </td>
                </tr>
              )}
              {!isError && data?.data.map((item) => (
                <tr key={item.trackingId} className="hover:bg-slate-50/50 transition-colors border-b [&_td]:py-4">
                  <td className="px-6 font-semibold text-slate-600 uppercase">
                    {item.nomorPenawaran}
                  </td>
                  <td className="px-6 font-semibold text-slate-600">
                    {item.perusahaanName || "—"}
                  </td>
                  <td className="px-6 text-right">
                    {item.estimasiHarga != null ? (
                      <>
                        <p className="font-semibold text-slate-700 text-xs whitespace-nowrap">
                          {formatRupiah(item.nominalDibayar ?? 0)}
                          <span className="text-gray-400 font-normal"> / </span>
                          {formatRupiah(item.estimasiHarga)}
                        </p>
                        <p className="text-[10px] font-bold text-cyan-600">
                          {item.persentaseDibayar.toFixed(0)}% terbayar
                        </p>
                      </>
                    ) : (
                      <span className="text-gray-300">Belum Tersedia</span>
                    )}
                  </td>
                  <td className="px-6 text-center">
                    <ProgressBadge selesai={item.terminSudah} total={item.totalTermin} />
                  </td>
                  <td className="px-6 text-gray-500">
                    {item.terminTerdekatDeadline ? (
                      <>
                        <p className="font-semibold text-slate-700 text-xs">
                          {item.terminTerdekatNama}
                        </p>
                        <p
                          className={`text-[10px] font-bold ${
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
                  </td>
                  <td className="px-6 text-center">
                    <StatusBadge status={item.statusPembayaran} />
                  </td>
                  <td className="px-6 text-right">
                    <Link
                      to={`/penawaran/${item.trackingId}`}
                      className="inline-flex items-center gap-1 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
                    >
                      Lihat Detail <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Menampilkan {data.data.length} dari {data.meta.total} data
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span className="text-xs text-gray-500">
              {page} / {data.meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
              disabled={page === data.meta.totalPages}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
