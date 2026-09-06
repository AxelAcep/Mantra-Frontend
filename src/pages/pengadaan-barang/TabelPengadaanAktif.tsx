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

type TahapImplementasi = "PEMBELIAN_BARANG" | "PENGANTARAN" | "INSTALASI";

function TahapBadge({ tahap }: { tahap?: TahapImplementasi }) {
  const config: Record<TahapImplementasi, string> = {
    PEMBELIAN_BARANG: "bg-orange-100 text-orange-700",
    PENGANTARAN: "bg-blue-100 text-blue-700",
    INSTALASI: "bg-emerald-100 text-emerald-700",
  };

  const label: Record<TahapImplementasi, string> = {
    PEMBELIAN_BARANG: "Pembelian Barang",
    PENGANTARAN: "Pengantaran",
    INSTALASI: "Instalasi",
  };

  const safeTahap: TahapImplementasi = tahap ?? "PEMBELIAN_BARANG";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent whitespace-nowrap ${config[safeTahap]}`}
    >
      {label[safeTahap]}
    </span>
  );
}

export default function TabelPengadaanAktif() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = usePenawaranListAktif({
    page,
    limit: 10,
    search,
    step: "IMPLEMENTASI",
  });

  return (
    <div>
      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Cari nomor PO, perusahaan, lokasi..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-gray-300"
        />
      </div>

      <div className="w-full overflow-x-auto px-6 pb-4 pt-2">
        <div className="w-full rounded-md border border-slate-200 bg-white min-w-[1000px]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 [&_th]:py-3.5 text-slate-600 text-xs font-medium uppercase tracking-wider">
              <th className="px-6 py-4">Nomor PO</th>
              <th className="px-6 py-4">Tanggal Terbit</th>
              <th className="px-6 py-4">Nama Perusahaan</th>
              <th className="px-6 py-4">Lokasi Proyek</th>
              <th className="px-6 py-4">Jenis Pengadaan</th>
              <th className="px-6 py-4 text-center">Status / Tahapan</th>
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
                  Tidak ada data pengadaan aktif.
                </td>
              </tr>
            )}
            {!isError && data?.data.map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors border-b [&_td]:py-4">
                <td className="px-6 font-semibold text-slate-600 uppercase">
                  {item.nomorPenawaran}
                </td>
                <td className="px-6 text-gray-500">
                  {formatTanggal(item.tanggalTerbit || item.tanggalMasuk)}
                </td>
                <td className="px-6 font-semibold text-slate-600">
                  {item.perusahaanName || "—"}
                </td>
                <td className="px-6 text-gray-500">
                  {item.lokasiProyek || "—"}
                </td>
                <td className="px-6">
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
                <td className="px-6 text-center">
                  <TahapBadge tahap={item.implementasiTahap} />
                </td>
                <td className="px-6 text-right">
                  <Link
                    to={`/penawaran/${item.id}`}
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
