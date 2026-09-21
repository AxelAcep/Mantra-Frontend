import { useState } from "react";
import { Link } from "react-router";
import { usePenawaranList } from "@/hooks/use-create-penawaran";
import { formatNomorPenawaran } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface UserSession {
  role?: string;
}

const getAuthData = () => {
  const session = localStorage.getItem("user");
  const user: UserSession = session ? JSON.parse(session) : {};
  return {
    isLoggedIn: !!user.role,
    role: user.role ?? "",
  };
};

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
  return labels[step] || step.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(nilai: number | null | undefined) {
  if (!nilai) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

export default function TablePermintaanPenawaran() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { role } = getAuthData();
  const isMaster = role === "MASTER";

  const { data, isLoading, isError } = usePenawaranList({
    page,
    limit: 10,
    search,
  });

  return (
    <div>
      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Cari no. penawaran, customer, lokasi..."
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
                <TableHead className="text-[#000000] text-xs font-semibold">TANGGAL PERMINTAAN</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">NO. PENAWARAN</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">NAMA PERUSAHAAN / LOKASI</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold">PEMBUAT PENAWARAN</TableHead>
                {isMaster && <TableHead className="text-[#000000] text-xs font-semibold">HARGA</TableHead>}
                <TableHead className="text-[#000000] text-xs font-semibold">JENIS PENGADAAN</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold text-center">TAHAPAN</TableHead>
                <TableHead className="text-[#000000] text-xs font-semibold text-right">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading && (
                <TableRow>
                  <TableCell colSpan={isMaster ? 8 : 7} className="text-center py-10 text-muted-foreground text-sm">
                    Memuat data...
                  </TableCell>
                </TableRow>
              )}
              {isError && (
                <TableRow>
                  <TableCell colSpan={isMaster ? 8 : 7} className="text-center py-10 text-red-500 text-sm">
                    Gagal memuat data.
                  </TableCell>
                </TableRow>
              )}
              {!isLoading && !isError && data?.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={isMaster ? 8 : 7} className="text-center py-10 text-muted-foreground text-sm">
                    Tidak ada data penawaran.
                  </TableCell>
                </TableRow>
              )}
              {!isError && data?.data.map((item) => (
                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="text-gray-800">
                    {formatTanggal(item.tanggalMasuk)}
                  </TableCell>
                  <TableCell className={`text-gray-800`}>
                    {formatNomorPenawaran(item.nomorPenawaran)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col justify-center max-w-[200px]">
                      <span className="font-semibold text-gray-800 truncate">{item.perusahaanName || "-"}</span>
                      {item.lokasiProyek && (
                        <span className="text-[0.75rem] text-gray-800 truncate">({item.lokasiProyek})</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-800">
                    {item.pembuatPenawaran?.nama || "-"}
                  </TableCell>
                  {isMaster && (
                    <TableCell className="text-gray-800">
                      {formatRupiah(item.estimasiHarga) || "-"}
                    </TableCell>
                  )}
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {item.jenisPenawaran?.map((jenis) => (
                        <span key={jenis} className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                          {jenis.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                        </span>
                      )) || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    {item.stepSaatIni ? (
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold whitespace-nowrap">
                        {formatStepName(item.stepSaatIni)}
                      </span>
                    ) : "-"}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link className="text-cyan-600 text-sm font-medium hover:underline whitespace-nowrap" to={`/penawaran/${item.id}`}>
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
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ‹
            </button>
            <span className="text-sm text-slate-500 px-2">
              {page} / {data.meta.totalPages}
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
