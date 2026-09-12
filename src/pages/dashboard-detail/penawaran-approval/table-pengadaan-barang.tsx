import { useState } from "react";
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
  ChevronLeft,
  ChevronRight,
  Check,
  X,
  CheckCheck,
} from "lucide-react";
import { usePenawaranList } from "@/hooks/use-create-penawaran";
import { AlertDialogMassalPengadaanBarang } from "./alert-dialog-massal-pengadaan-barang";
import { AlertDialogSetuju } from "./alert-dialog-setuju";
import { AlertDialogTolak } from "./alert-dialog-tolak";

function formatDate(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DaftarPenawaranApprovalPengadaanBarang() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading } = usePenawaranList({
    step: "REVIEW_INTERNAL",
    page,
    limit: 10,
    search,
  });

  const rows = data?.data ?? [];
  const meta = data?.meta;

  const handleConfirmMassal = () => {};
  const handleConfirmSetuju = () => {};

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden py-0! gap-0!">
      {/* --- HEADER / TOOLBAR --- */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari perusahaan..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
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
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
              <TableHead className="h-11 w-[12%] pl-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                  TANGGAL PERMINTAAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="h-11 w-[12%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                  NO. PENAWARAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="h-11 w-[12%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                  PIC REQ
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="h-11 w-[14%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                  PEMBUAT PENAWARAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="h-11 w-[14%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                  PERUSAHAAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="h-11 w-[12%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                  LOKASI PROYEK
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="h-11 w-[14%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase">
                  JENIS PENGADAAN BARANG
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[10%]">
                AKSI
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-400 text-sm font-medium">
                  Memuat data...
                </TableCell>
              </TableRow>
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-400 text-sm font-medium">
                  Tidak ada data tersedia
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b-slate-100 hover:bg-slate-50 transition-colors"
                >
                  <TableCell className="text-slate-500 text-xs py-4 pl-4">
                    {formatDate(row.tanggalMasuk)}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700 text-xs py-4">
                    {row.nomorPenawaran || "—"}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs py-4">
                    {row.picReq?.nama || "—"}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs py-4">
                    {row.pembuatPenawaran?.nama || "—"}
                  </TableCell>
                  <TableCell className="font-bold text-slate-700 text-xs py-4">
                    {row.perusahaanName || "—"}
                  </TableCell>
                  <TableCell className="text-slate-500 text-xs py-4">
                    {row.lokasiProyek || "—"}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {row.jenisPenawaran?.map((jenis) => (
                        <Badge key={jenis} className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none rounded-md px-2 py-1 text-[10px] font-medium shadow-none">
                          {jenis.replace("_", " ")}
                        </Badge>
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
                      <Link
                        to={`/penawaran/${row.id}`}
                        className="text-[11px] font-medium text-cyan-500 hover:text-cyan-600 hover:underline shrink-0"
                      >
                        Lihat Detail
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* --- FOOTER: Pagination --- */}
      {meta && meta.totalPages > 0 && (
        <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-500">
            Menampilkan <strong className="text-slate-700">{rows.length}</strong> dari <strong className="text-slate-700">{meta.total}</strong> data
          </p>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-600"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-xs text-slate-500 px-2">
              {page} / {meta.totalPages}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
