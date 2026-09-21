import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import { usePenawaranListAktif } from "@/hooks/use-create-penawaran";
import ProgressBadge from "./ProgressBadge";
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

function GaransiTuntasBadge({ tuntas }: { tuntas?: boolean }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent whitespace-nowrap ${
        tuntas
          ? "bg-emerald-100 text-emerald-700"
          : "bg-amber-100 text-amber-700"
      }`}
    >
      {tuntas ? "Garansi Selesai" : "Garansi Belum"}
    </span>
  );
}

export default function TabelGaransi() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterJenis, setFilterJenis] = useState<string>("Generator FirePro");

  const { data, isLoading, isError } = usePenawaranListAktif({
    page,
    limit: 10,
    search,
    step: "GARANSI",
    jenisPenawaran: filterJenis,
  });

  return (
    <div>
      {/* Search + Filter */}
      <div className="px-6 py-4 border-b border-gray-100 flex flex-wrap gap-2">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nomor PO, perusahaan, lokasi..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent placeholder:text-gray-300"
          />
        </div>

        {/* Filter Jenis Pengadaan */}
        <select
          value={filterJenis}
          onChange={(e) => {
            setFilterJenis(e.target.value);
            setPage(1);
          }}
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
        >
          <option value="Generator FirePro">Generator FirePro</option>
          <option value="PAC Montair">PAC Montair</option>
        </select>
      </div>

      <div className="w-full overflow-x-auto px-6 pb-4 pt-2">
        <div className="w-full rounded-md border border-slate-200 bg-white min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
              <TableHead className="text-[#000000] text-xs font-semibold">NOMOR PO</TableHead>
              <TableHead className="text-[#000000] text-xs font-semibold">NAMA PERUSAHAAN</TableHead>
              <TableHead className="text-[#000000] text-xs font-semibold">JENIS PENGADAAN</TableHead>
              <TableHead className="text-[#000000] text-xs font-semibold">GARANSI MULAI</TableHead>
              <TableHead className="text-[#000000] text-xs font-semibold">GARANSI SELESAI</TableHead>
              <TableHead className="text-center text-[#000000] text-xs font-semibold">PROGRESS BULAN</TableHead>
              <TableHead className="text-center text-[#000000] text-xs font-semibold">STATUS</TableHead>
              <TableHead className="text-right text-[#000000] text-xs font-semibold">AKSI</TableHead>
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
                  Tidak ada data garansi.
                </TableCell>
              </TableRow>
            )}
            {!isError && data?.data.map((item) => (
              <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <TableCell className="text-gray-800">
                  {formatNomorPenawaran(item.nomorPenawaran)}
                </TableCell>
                <TableCell className="font-semibold text-gray-800">
                  {item.perusahaanName || "—"}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {item.jenisPenawaran?.map((jenis) => (
                      <span
                        key={jenis}
                        className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold"
                      >
                        {jenis.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    )) || "—"}
                  </div>
                </TableCell>
                <TableCell className="text-gray-800">
                  {item.garansiTuntas && !item.garansiMulai && !item.garansiSelesai ? (
                    <span className="text-gray-800">Tidak Ada Garansi</span>
                  ) : item.garansiMulai ? (
                    formatTanggal(item.garansiMulai)
                  ) : (
                    <span className="text-gray-800">Belum dikonfigurasi</span>
                  )}
                </TableCell>
                <TableCell className="text-gray-800">
                  {item.garansiTuntas && !item.garansiMulai && !item.garansiSelesai ? (
                    <span className="text-gray-800">Tidak Ada Garansi</span>
                  ) : item.garansiSelesai ? (
                    formatTanggal(item.garansiSelesai)
                  ) : (
                    <span className="text-gray-800">Belum dikonfigurasi</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <ProgressBadge
                    selesai={item.garansiBulanSelesai}
                    total={item.garansiBulanTotal}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <GaransiTuntasBadge tuntas={item.garansiTuntas} />
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    to={`/penawaran/${item.id}`}
                    className="text-cyan-600 text-sm font-medium hover:underline whitespace-nowrap"
                  >
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
            Menampilkan {data.data.length} dari <span className="font-semibold text-slate-700">{data.meta.total}</span> data
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            <span className="text-sm text-slate-500 px-2">
              <span className="font-semibold text-slate-700">{page}</span> / <span className="font-semibold text-slate-700">{data.meta.totalPages}</span>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(data.meta.totalPages, p + 1))}
              disabled={page === data.meta.totalPages}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ›
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
