import { useState, useEffect, useRef } from "react";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  Check,
  X,
  CheckCheck,
} from "lucide-react";
import { usePenawaranList } from "@/hooks/use-create-penawaran";
import { TablePagination } from "@/pages/daily/manager/table-pagination";
import { useDebounce } from "@/hooks/use-debounce";
import { AlertDialogMassalPengadaanBarang } from "./alert-dialog-massal-pengadaan-barang";
import { AlertDialogSetuju } from "./alert-dialog-setuju";
import { AlertDialogTolak } from "./alert-dialog-tolak";

type SortDir = "asc" | "desc" | "";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

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

export default function DaftarPenawaranApprovalPengadaanBarang() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [sortDir, setSortDir] = useState<SortDir>("");

  const search = useDebounce(searchInput, 400);

  const prevDeps = useRef({ search, sortBy, sortDir });
  useEffect(() => {
    const p = prevDeps.current;
    if (p.search === search && p.sortBy === sortBy && p.sortDir === sortDir) return;
    prevDeps.current = { search, sortBy, sortDir };
    setPage(1);
  }, [search, sortBy, sortDir]);

  const { data, isLoading } = usePenawaranList({
    step: "REVIEW_INTERNAL,PERSETUJUAN_MANAJEMEN",
    page,
    limit: 10,
    search,
    sortBy,
    sortDir: sortDir || undefined,
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  const handleConfirmMassal = () => {};
  const handleConfirmSetuju = () => {};

  function handleSort(field: string) {
    if (sortBy !== field) { setSortBy(field); setSortDir("asc"); }
    else if (sortDir === "asc") setSortDir("desc");
    else { setSortBy(""); setSortDir(""); }
  }

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden py-0! gap-0!">
      {/* --- HEADER / TOOLBAR --- */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
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
        <AlertDialogMassalPengadaanBarang onConfirm={handleConfirmMassal}>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full h-9 px-5 text-xs font-medium shadow-sm shrink-0">
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Terima Semua Penawaran
          </Button>
        </AlertDialogMassalPengadaanBarang>
      </div>

      {/* --- TABEL --- */}
      <CardContent className="p-0">
        <div className="w-full overflow-x-auto">
          <div className="w-full min-w-[1000px]">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50 hover:bg-slate-50">
                  <SortableHeader label="TANGGAL PERMINTAAN" field="tanggalMasuk" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[12%] pl-4" />
                  <SortableHeader label="NO. PENAWARAN" field="nomorPenawaran" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[12%]" />
                  <TableHead className="h-11 w-[12%]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">PIC REQ</div>
                  </TableHead>
                  <TableHead className="h-11 w-[14%]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">PEMBUAT PENAWARAN</div>
                  </TableHead>
                  <SortableHeader label="PERUSAHAAN" field="perusahaanName" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[14%]" />
                  <SortableHeader label="LOKASI PROYEK" field="lokasiProyek" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[12%]" />
                  <TableHead className="h-11 w-[14%]">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">JENIS PENGADAAN</div>
                  </TableHead>
                  <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[10%]">AKSI</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {isLoading ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-10 text-slate-400 text-sm font-medium">Memuat data...</TableCell></TableRow>
                ) : rows.length === 0 ? (
                  <TableRow><TableCell colSpan={8} className="text-center py-10 text-slate-400 text-sm font-medium">Tidak ada data tersedia</TableCell></TableRow>
                ) : (
                  rows.map((row) => (
                    <TableRow key={row.id} className="border-b-slate-100 hover:bg-slate-50/50 transition-colors">
                      <TableCell className="text-slate-500 text-xs py-4 pl-4">{formatDate(row.tanggalMasuk)}</TableCell>
                      <TableCell className="font-bold text-slate-700 text-xs py-4">{row.nomorPenawaran || "—"}</TableCell>
                      <TableCell className="text-slate-500 text-xs py-4">{row.picReq?.nama || "—"}</TableCell>
                      <TableCell className="text-slate-500 text-xs py-4">{row.pembuatPenawaran?.nama || "—"}</TableCell>
                      <TableCell className="font-bold text-slate-700 text-xs py-4">{row.perusahaanName || "—"}</TableCell>
                      <TableCell className="text-slate-500 text-xs py-4">{row.lokasiProyek || "—"}</TableCell>
                      <TableCell className="py-4">
                        <div className="flex flex-wrap gap-1">
                          {row.jenisPenawaran?.map((jenis) => (
                            <Badge key={jenis} className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none rounded-md px-2 py-1 text-[10px] font-medium shadow-none">{jenis.replace("_", " ")}</Badge>
                          )) || "—"}
                        </div>
                      </TableCell>
                      <TableCell className="text-right py-4 pr-4">
                        <div className="flex items-center justify-end gap-3">
                          <div className="flex items-center gap-1.5">
                            <AlertDialogSetuju onConfirm={handleConfirmSetuju}>
                              <button className="h-6 w-6 rounded-full border border-emerald-200 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                                <Check className="h-3.5 w-3.5 stroke-[3]" />
                              </button>
                            </AlertDialogSetuju>
                            <AlertDialogTolak onConfirm={(alasan) => console.log("Alasan Tolak:", alasan)}>
                              <button className="h-6 w-6 rounded-full border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors">
                                <X className="h-3.5 w-3.5 stroke-[3]" />
                              </button>
                            </AlertDialogTolak>
                          </div>
                          <Link to={`/penawaran/${row.id}`} className="text-[11px] font-medium text-cyan-500 hover:text-cyan-600 hover:underline shrink-0">Lihat Detail</Link>
                        </div>
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
