import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePenawaranListAktif } from "@/hooks/use-create-penawaran";

function formatTanggal(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function TableRiwayat() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = usePenawaranListAktif({
    page,
    limit: 10,
    search,
    step: "GARANSI",
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

      <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-b border-gray-100">
            <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              <th className="px-6 py-4">Nomor PO</th>
              <th className="px-6 py-4">Perusahaan</th>
              <th className="px-6 py-4">Jenis Pengadaan</th>
              <th className="px-6 py-4">Tanggal Pesan</th>
              <th className="px-6 py-4">Tanggal Serah Terima</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-400 text-sm">
                  Memuat data...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-red-400 text-sm">
                  Gagal memuat data.
                </td>
              </tr>
            )}
            {!isLoading && !isError && data?.data.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-300 text-sm">
                  Tidak ada data riwayat pengadaan.
                </td>
              </tr>
            )}
            {!isError && data?.data.map((item) => (
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
                <td className="px-6 py-5 text-gray-500 font-medium">
                  {formatTanggal(item.tanggalMasuk)}
                </td>
                <td className="px-6 py-5 text-gray-500 font-medium">
                  {formatTanggal(item.tanggalTerbit)}
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
            ))}
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