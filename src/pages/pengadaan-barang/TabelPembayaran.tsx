import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePenawaranListAktif } from "@/hooks/use-create-penawaran";

function formatRupiah(nilai: number | null | undefined) {
  if (!nilai) return "—";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

function StatusBadgePembayaran({ status }: { status: string }) {
  const config: Record<string, string> = {
    LUNAS: "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
    "MENUNGGU PEMBAYARAN": "bg-[#fffbeb] text-[#d97706] border-[#fef3c7]",
    "—": "bg-gray-50 text-gray-400 border-gray-100",
  };

  const current = config[status.toUpperCase()] ? status.toUpperCase() : "MENUNGGU PEMBAYARAN";

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm ${config[current]}`}>
      {current}
    </span>
  );
}

export default function TablePembayaran() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = usePenawaranListAktif({
    page,
    limit: 10,
    search,
    step: "PEMBAYARAN",
  });

  return (
    <div>
      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-100">
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
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-y border-gray-100">
            <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              <th className="px-6 py-4">Nomor PO</th>
              <th className="px-6 py-4">Nama Perusahaan</th>
              <th className="px-6 py-4">Jenis Pengadaan</th>
              <th className="px-6 py-4 text-right">Total Nilai</th>
              <th className="px-6 py-4 text-center">Termin Ke</th>
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
                  Tidak ada data pengadaan dalam tahap pembayaran.
                </td>
              </tr>
            )}
            {!isError && data?.data.map((item) => {
              const total = item.totalTermin || 0;
              const paid = item.terminDibayar || 0;
              let paymentStatus = "—";
              if (total > 0) {
                paymentStatus = paid === total ? "Lunas" : "Menunggu Pembayaran";
              }

              return (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5 font-bold text-slate-700 uppercase">
                    {item.nomorPenawaran}
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700">
                    {item.perusahaanName || "—"}
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-wrap gap-1">
                      {item.jenisPenawaran?.map((jenis) => (
                        <span
                          key={jenis}
                          className="px-2 py-0.5 bg-gray-100 text-slate-600 rounded text-[10px] font-bold border border-gray-200 uppercase"
                        >
                          {jenis.replace("_", " ")}
                        </span>
                      )) || "—"}
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right font-bold text-slate-700">
                    {formatRupiah(item.estimasiHarga)}
                  </td>
                  <td className="px-6 py-5 text-center">
                    {total > 0 ? (
                      <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                        {paid} DARI {total}
                      </span>
                    ) : (
                      <span className="text-gray-300">—</span>
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <StatusBadgePembayaran status={paymentStatus} />
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      to={`/penawaran/${item.id}`}
                      className="inline-flex items-center gap-1 text-cyan-500 font-bold hover:text-cyan-600 transition-colors"
                    >
                      Lihat Detail <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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