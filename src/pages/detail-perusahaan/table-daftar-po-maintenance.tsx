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
  ListFilter, 
  ChevronsUpDown, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  ArrowRight,
  AlertTriangle
} from "lucide-react";

const poData = [
  {
    nomor: "PO-2023-001",
    pengadaan: "PAC Montair",
    tanggal: "20 Okt 2023",
    top: "DP 50%", topType: "default",
    status: "Aktif", statusType: "success",
    garansi: "1x", garansiAktif: true,
    isHighlighted: false,
  },
  {
    nomor: "PO-2023-002",
    pengadaan: "PAC Montair",
    tanggal: "18 Okt 2023",
    top: "Lunas", topType: "success",
    status: "Selesai", statusType: "neutral",
    garansi: "Sudah Habis", garansiAktif: false,
    isHighlighted: false,
  },
  {
    nomor: "PO-2023-005",
    pengadaan: "Generator FirePro",
    tanggal: "15 Okt 2023",
    top: "DP 50%", topType: "default",
    status: "Pending", statusType: "warning",
    garansi: "Belum Tersedia", garansiAktif: false,
    isHighlighted: false,
  },
  {
    nomor: "PO-2023-008",
    pengadaan: "PAC Montair",
    tanggal: "10 Okt 2023",
    top: "Net 45 Days", topType: "default",
    status: "Aktif", statusType: "success",
    garansi: "2x", garansiAktif: true,
    isHighlighted: false,
  },
  {
    nomor: "PO-2023-002",
    pengadaan: "PAC Montair",
    tanggal: "18 Okt 2023",
    top: "Lunas", topType: "success",
    status: "Konfirmasi Proyek", statusType: "warning-outline", statusIcon: "clock",
    garansi: "Sudah Habis", garansiAktif: false,
    isHighlighted: true,
  },
  {
    nomor: "PW-2212",
    pengadaan: "Generator FirePro",
    tanggal: "15 Okt 2023",
    top: "DP 50%", topType: "default",
    status: "Menunggu Persetujuan", statusType: "warning-outline", statusIcon: "alert",
    garansi: "Belum Tersedia", garansiAktif: false,
    isHighlighted: true,
  },
];

// Fungsi bantuan untuk menentukan gaya Badge Status PO
const renderStatusBadge = (status: string, type: string, iconType?: string) => {
  if (type === "warning-outline") {
    return (
      <Badge variant="outline" className="text-[10px] px-2.5 py-0.5 rounded-full bg-white border-amber-300 text-amber-600 shadow-sm flex items-center gap-1.5 w-fit">
        {iconType === "clock" ? <Clock className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
        {status}
      </Badge>
    );
  }

  let colorClass = "";
  switch (type) {
    case "success": colorClass = "bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none shadow-none"; break;
    case "warning": colorClass = "bg-amber-100 text-amber-600 hover:bg-amber-100 border-none shadow-none"; break;
    case "neutral": colorClass = "bg-slate-100 text-slate-500 hover:bg-slate-100 border-none shadow-none"; break;
    default: colorClass = "bg-slate-100 text-slate-600 border-none shadow-none"; break;
  }

  return (
    <Badge className={`text-[10px] px-2.5 py-0.5 rounded-full ${colorClass}`}>
      {status}
    </Badge>
  );
};

// Fungsi bantuan untuk menentukan warna badge TOP
const getTopBadgeColor = (type: string) => {
  if (type === "success") return "bg-emerald-100 text-emerald-600 hover:bg-emerald-100 border-none shadow-none";
  return "bg-slate-100 text-slate-500 hover:bg-slate-100 border-slate-200 shadow-none";
};

export default function DaftarPoMaintenance() {
  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden py-0! gap-0!">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-slate-100 gap-4">
        <h2 className="text-sm font-bold text-slate-800">Daftar PO Maintenance</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-9 text-xs font-medium text-slate-600 border-slate-200 shadow-none">
            <ListFilter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nomor referensi, jenis pengadaan..."
              className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 shadow-none focus-visible:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* --- TABEL --- */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              
              <TableHead className="h-11 w-[15%] pl-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  NOMOR REFERENSI
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[20%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  JENIS BARANG
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[15%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  TANGGAL TERBIT
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[18%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  TOP (TERM OF PAYMENT)
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[15%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  STATUS PO
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[12%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  SISA WAKTU
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right w-[5%]">
                AKSI
              </TableHead>
              
            </TableRow>
          </TableHeader>
          
<TableBody>
            {poData.map((row, index) => {
              
// 1. Inisialisasi variabel bawaan (default)
              let rowBgClass = "hover:bg-slate-50"; // Background putih/abu-abu
              let shadowClass = ""; // Tidak ada shadow/garis kiri

              // 2. Logika Kondisional (If/Else) untuk Background & Shadow
              if (row.status === "Konfirmasi Proyek") {
                // Latar belakang kuning sangat muda
                rowBgClass = "bg-[#FEFCE8] hover:bg-[#f7f5d9]"; 
                // Shadow kiri warna FEF3C7, hover menjadi FDE68A
                shadowClass = "shadow-[inset_2px_0_0_0_#FACC15]";
                
              } else if (row.status === "Menunggu Persetujuan") {
                // Latar belakang kuning/oranye pekat
                rowBgClass = "bg-[#FEF3C7] hover:bg-[#f0e4b7]"; 
                // Shadow kiri warna FDE68A, hover menjadi kuning yang sedikit lebih gelap (FCD34D)
                shadowClass = "shadow-[inset_2px_0_0_0_#D1AB17]";
              }

              return (
                <TableRow 
                  key={index} 
                  className={`group border-b-slate-100 transition-colors ${rowBgClass}`}
                >
                  
                  <TableCell 
                    // Cukup panggil variabel shadowClass di sini
                    className={`font-bold text-slate-800 text-xs py-3.5 pl-4 ${shadowClass}`}
                  >
                    {row.nomor}
                  </TableCell>
                  
                  <TableCell className="text-slate-600 text-xs py-3.5">
                    {row.pengadaan}
                  </TableCell>
                  
                  <TableCell className="text-slate-500 text-xs py-3.5">
                    {row.tanggal}
                  </TableCell>
                  
                  <TableCell className="py-3.5">
                    <Badge className={`text-[10px] px-2.5 py-0.5 rounded-full ${getTopBadgeColor(row.topType)}`}>
                      {row.top}
                    </Badge>
                  </TableCell>
                  
                  <TableCell className="py-3.5">
                    {renderStatusBadge(row.status, row.statusType, row.statusIcon)}
                  </TableCell>
                  
                  <TableCell className="py-3.5">
                    <div className={`flex items-center gap-1.5 text-xs ${row.garansiAktif ? "text-slate-700 font-medium" : "text-slate-400"}`}>
                      {row.garansi !== "Belum Tersedia" && row.garansi !== "Sudah Habis" && (
                        <Clock className="w-3.5 h-3.5" />
                      )}
                      <span>{row.garansi}</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="text-right py-3.5">
                    <button className="flex items-center justify-end gap-1 text-[11px] font-medium text-cyan-500 hover:text-cyan-600 hover:underline ml-auto w-full">
                      Lihat Detail
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </TableCell>
                  
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>

      {/* --- FOOTER: Pagination --- */}
      <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-white">
        <p className="text-xs text-slate-500">
          Menampilkan <strong className="text-slate-700">4</strong> dari <strong className="text-slate-700">12</strong> pesanan
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
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
    </Card>
  );
}