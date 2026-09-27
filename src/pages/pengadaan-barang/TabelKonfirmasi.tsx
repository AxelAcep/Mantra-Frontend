import { useState } from "react";
import { Link } from "react-router-dom";
import { usePenawaranListAktif } from "@/hooks/use-create-penawaran";
import BastLengkapBadge from "./BastLengkapBadge";
import ProgressBadge from "./ProgressBadge";
import { formatNomorPenawaran } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Tab "Konfirmasi Selesai" = tracking yang lagi di tahap BAST dan SEMUA
// entry-nya udah DITERIMA (lengkap). Pasangannya: tab "BAST" (masih berjalan).
export default function TableKonfirmasiSelesai() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = usePenawaranListAktif({
    page,
    limit: 10,
    search,
    step: "BAST",
    bastLengkap: "true",
  });

  return (
    <div>
      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Cari nomor PO, nomor WO, nomor penawaran, jenis barang..."
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
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100">
              <TableHead className="text-[#000000] text-xs font-semibold">NOMOR PO</TableHead>
              <TableHead className="text-[#000000] text-xs font-semibold">NOMOR WO</TableHead>
              <TableHead className="text-[#000000] text-xs font-semibold">NAMA PERUSAHAAN</TableHead>
              <TableHead className="text-[#000000] text-xs font-semibold">JENIS BARANG</TableHead>
              <TableHead className="text-center text-[#000000] text-xs font-semibold">PROGRESS ENTRY</TableHead>
              <TableHead className="text-center text-[#000000] text-xs font-semibold">STATUS BAST</TableHead>
              <TableHead className="text-right text-[#000000] text-xs font-semibold">AKSI</TableHead>
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
                  Tidak ada data BAST yang sudah lengkap.
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
                      <span
                        key={jenis}
                        className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold"
                      >
                        {jenis.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                      </span>
                    )) || "—"}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <ProgressBadge
                    selesai={item.bastEntriesSelesai}
                    total={item.bastEntriesTotal}
                  />
                </TableCell>
                <TableCell className="text-center">
                  <BastLengkapBadge lengkap={item.bastLengkap} />
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
