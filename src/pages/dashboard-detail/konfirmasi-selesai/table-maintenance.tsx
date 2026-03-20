import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  CheckCheck,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { AlertDialogMassalMaintenance } from "./alert-dialog-massal-maintenance";
import { AlertDialogSetuju } from "./alert-dialog-setuju";

// Data Dummy sesuai dengan gambar terbaru
const konfirmasiMaintenanceData = [
  {
    nomorPo: "PO-2023-10-001",
    perusahaan: "PT Maju Sejahtera",
    jenis: "PAC Montair",
    tanggalPesan: "20 Okt 2023",
    tanggalSerah: "23 Okt 2023",
  },
  {
    nomorPo: "PO-2023-10-045",
    perusahaan: "CV Berkah Teknik",
    jenis: "PAC Montair",
    tanggalPesan: "18 Okt 2023",
    tanggalSerah: "22 Okt 2023",
  },
  {
    nomorPo: "PO-2023-09-882",
    perusahaan: "PT Global Sarana",
    jenis: "PAC Montair",
    tanggalPesan: "15 Okt 2023",
    tanggalSerah: "21 Okt 2023",
  },
  {
    nomorPo: "PO-2023-10-102",
    perusahaan: "Hotel Bintang Lima",
    jenis: "Fire GeneratorPro",
    tanggalPesan: "22 Okt 2023",
    tanggalSerah: "24 Okt 2023",
  },
  {
    nomorPo: "PO-2023-10-115",
    perusahaan: "Apartemen Green View",
    jenis: "Fire GeneratorPro",
    tanggalPesan: "20 Okt 2023",
    tanggalSerah: "24 Okt 2023",
  },
];

export default function DaftarKonfirmasiSelesaiMaintenance() {
  const handleConfirmMassal = () => {
  };

  const handleConfirm = () => {
  };

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden py-0! gap-0!">

      {/* --- HEADER / TOOLBAR (Sesuai Konfigurasi Anda) --- */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari perusahaan..."
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 shadow-none focus-visible:ring-cyan-500 rounded-lg"
          />
        </div>
        <AlertDialogMassalMaintenance onConfirm={handleConfirmMassal}>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full h-9 px-5 text-xs font-medium shadow-sm shrink-0">
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Konfirmasi Seluruh Maintenance
          </Button>
        </AlertDialogMassalMaintenance>
      </div>

      {/* --- TABEL --- */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">

              <TableHead className="h-11 w-[18%] pl-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  NOMOR PO
                </div>
              </TableHead>

              <TableHead className="h-11 w-[20%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  PERUSAHAAN
                </div>
              </TableHead>

              <TableHead className="h-11 w-[20%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  JENIS MAINTENANCE
                </div>
              </TableHead>

              <TableHead className="h-11 w-[15%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  TANGGAL PESAN
                </div>
              </TableHead>

              <TableHead className="h-11 w-[15%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  TANGGAL SERAH TERIMA
                </div>
              </TableHead>

              <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[12%]">
                AKSI
              </TableHead>

            </TableRow>
          </TableHeader>

          <TableBody>
            {konfirmasiMaintenanceData.map((row, index) => (
              <TableRow
                key={index}
                className="border-b-slate-100 hover:bg-slate-50 transition-colors"
              >

                {/* Kolom Nomor PO (Bold) */}
                <TableCell className="font-bold text-slate-800 text-xs py-4 pl-4">
                  {row.nomorPo}
                </TableCell>

                {/* Kolom Perusahaan (Bold) */}
                <TableCell className="font-bold text-slate-700 text-xs py-4">
                  {row.perusahaan}
                </TableCell>

                {/* Kolom Jenis Maintenance (Teks biasa tanpa badge) */}
                <TableCell className="text-slate-500 text-xs py-4">
                  {row.jenis}
                </TableCell>

                <TableCell className="text-slate-500 text-xs py-4">
                  {row.tanggalPesan}
                </TableCell>

                <TableCell className="text-slate-500 text-xs py-4">
                  {row.tanggalSerah}
                </TableCell>

                {/* Kolom Aksi */}
                <TableCell className="text-right py-4 pr-4">
                  <div className="flex items-center justify-end gap-3">
                    {/* Tombol Aksi (Ceklis dan Silang) */}
                    <div className="flex items-center gap-1.5">
                      <AlertDialogSetuju onConfirm={handleConfirm}>
                        <button className="h-6 w-6 rounded-full border border-emerald-200 text-emerald-500 flex items-center justify-center hover:bg-emerald-50 transition-colors">
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        </button>
                      </AlertDialogSetuju>
                    </div>

                    {/* Link Teks */}
                    <button className="text-[11px] font-medium text-cyan-500 hover:text-cyan-600 hover:underline shrink-0">
                      Lihat Detail
                    </button>
                  </div>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* --- FOOTER: Pagination --- */}
      <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-white">
        <p className="text-xs text-slate-500">
          Menampilkan <strong className="text-slate-700">5</strong> dari <strong className="text-slate-700">50</strong> hasil
        </p>

        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-600" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button variant="ghost" size="sm" className="w-7 h-7 rounded-md bg-cyan-500 text-white hover:bg-cyan-600 hover:text-white p-0 text-xs font-medium shadow-sm">
            1
          </Button>
          <Button variant="ghost" size="sm" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100 p-0 text-xs font-medium">
            2
          </Button>
          <Button variant="ghost" size="sm" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100 p-0 text-xs font-medium">
            3
          </Button>
          <span className="text-slate-400 text-xs px-1">...</span>
          <Button variant="ghost" size="sm" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100 p-0 text-xs font-medium">
            8
          </Button>

          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

    </Card>
  );
}