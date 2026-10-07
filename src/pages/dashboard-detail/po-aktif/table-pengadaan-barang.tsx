import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  ArrowRight,
} from "lucide-react";
import { formatNomorPenawaran } from "@/lib/utils";
import { usePenawaranListAktif } from "@/hooks/use-create-penawaran";
import { TablePagination } from "@/pages/daily/manager/table-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { useListParams } from "@/hooks/use-list-params";

type SortDir = "asc" | "desc" | "";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

const tahapBadge: Record<string, string> = {
  PEMBELIAN_BARANG: "bg-blue-50 text-blue-600",
  PENGANTARAN: "bg-amber-50 text-amber-600",
  INSTALASI: "bg-emerald-50 text-emerald-600",
};

const tahapLabel: Record<string, string> = {
  PEMBELIAN_BARANG: "Pembelian Barang",
  PENGANTARAN: "Pengantaran",
  INSTALASI: "Instalasi",
};

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active || !dir) return <ChevronsUpDown className="h-3 w-3 opacity-50" />;
  return dir === "asc"
    ? <ChevronUp className="h-3 w-3 text-cyan-600" />
    : <ChevronDown className="h-3 w-3 text-cyan-600" />;
}

function SortableHeader({
  label, field, sortBy, sortDir, onSort, className = ""
}: {
  label: string; field: string; sortBy: string; sortDir: SortDir;
  onSort: (field: string) => void; className?: string;
}) {
  const isActive = sortBy === field;
  return (
    <TableHead className={`h-11 cursor-pointer select-none group hover:bg-slate-100 ${className}`} onClick={() => onSort(field)}>
      <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase">
        <span className={`transition-colors ${isActive ? "text-cyan-600" : "text-slate-500 group-hover:text-cyan-600"}`}>
          {label}
        </span>
        <SortIcon active={isActive} dir={isActive ? sortDir : ""} />
      </div>
    </TableHead>
  );
}

export default function DaftarPOAktifPengadaanBarang() {
  const { page, sortBy, sortDir, search, setPage, toggleSort, update } = useListParams();
  const [searchInput, setSearchInput] = useState(search);

  const debouncedSearch = useDebounce(searchInput, 400);

  // Ketikan baru disimpan ke URL setelah debounce supaya param tidak ditulis tiap huruf.
  useEffect(() => {
    if (debouncedSearch !== search) update({ search: debouncedSearch });
  }, [debouncedSearch, search, update]);

  const { data, isLoading } = usePenawaranListAktif({
    step: "IMPLEMENTASI,BAST",
    page,
    limit: 10,
    search,
    sortBy,
    // Arah sort hanya dikirim saat ada kolom aktif, sama seperti perilaku sebelumnya.
    sortDir: sortBy ? sortDir : undefined,
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden py-0! gap-0!">
      {/* --- HEADER / TOOLBAR --- */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari perusahaan..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 shadow-none focus-visible:ring-cyan-500 rounded-lg"
          />
        </div>
      </div>

      {/* --- TABEL --- */}
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <div className="w-full min-w-[900px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <SortableHeader label="NOMOR PO" field="nomorPenawaran" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-[15%] pl-4" />
                  <SortableHeader label="TANGGAL TERBIT" field="tanggalTerbit" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-[15%]" />
                  <SortableHeader label="NAMA PERUSAHAAN" field="perusahaanName" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-[20%]" />
                  <SortableHeader label="LOKASI PROYEK" field="lokasiProyek" sortBy={sortBy} sortDir={sortDir} onSort={toggleSort} className="w-[15%]" />
                  <TableHead className="h-11 w-[15%]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">JENIS PENGADAAN</div>
                  </TableHead>
                  <TableHead className="h-11 w-[12%]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">STATUS</div>
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[8%]">AKSI</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm font-medium">Memuat data...</TableCell></TableRow>
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm font-medium">Tidak ada data tersedia</TableCell></TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id} className="border-b-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="font-bold text-slate-800 text-xs py-4 pl-4">{formatNomorPenawaran(row.nomorPenawaran)}</TableCell>
                      <TableCell className="text-slate-500 text-xs py-4">{formatDate(row.tanggalTerbit || row.tanggalMasuk)}</TableCell>
                      <TableCell className="font-bold text-slate-700 text-xs py-4">{row.perusahaanName || "—"}</TableCell>
                      <TableCell className="text-slate-500 text-xs py-4">{row.lokasiProyek || "—"}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {row.jenisPenawaran?.map((jenis) => (
                            <Badge key={jenis} className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none rounded-full px-2.5 py-0.5 text-[10px] font-medium shadow-none">{jenis.replace("_", " ")}</Badge>
                          )) || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        {row.implementasiTahap ? (
                          <Badge className={`border-none rounded-full px-2.5 py-0.5 text-[10px] font-medium shadow-none ${tahapBadge[row.implementasiTahap] ?? "bg-slate-100 text-slate-600"}`}>
                            {tahapLabel[row.implementasiTahap] ?? row.implementasiTahap}
                          </Badge>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right py-4 pr-4">
                        <Link to={`/penawaran/${row.id}`} className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-500 hover:text-cyan-600 hover:underline">
                          Lihat Detail <ArrowRight className="w-3 h-3" />
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </CardContent>

      {/* --- FOOTER: Pagination --- */}
      {!isLoading && (
        <div className="p-4 border-t border-slate-100 bg-white">
          <TablePagination page={page} totalPages={meta?.totalPages ?? 1} total={meta?.total ?? 0} showing={rows.length} onPageChange={setPage} />
        </div>
      )}
    </Card>
  );
}
