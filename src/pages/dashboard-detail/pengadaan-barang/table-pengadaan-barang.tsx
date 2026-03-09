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
  ArrowRight,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

// Data Dummy sesuai dengan gambar (Tabel Pengadaan Barang - Progress)
const pengadaanProgressData = [
  {
    nomorPo: "PO-PGD-2310-101",
    tanggal: "24 Okt 2023",
    perusahaan: "PT Solusi Kantor",
    jenis: "PAC Montair",
    current: 3,
    total: 4,
  },
  {
    nomorPo: "PO-PGD-2310-102",
    tanggal: "23 Okt 2023",
    perusahaan: "CV Elektronik Jaya",
    jenis: "Fire GeneratorPro",
    current: 5,
    total: 5,
  },
  {
    nomorPo: "PO-PGD-2310-103",
    tanggal: "22 Okt 2023",
    perusahaan: "PT Furnitur Indah",
    jenis: "PAC Montair",
    current: 2,
    total: 8,
  },
  {
    nomorPo: "PO-PGD-2310-104",
    tanggal: "21 Okt 2023",
    perusahaan: "UD Berkah Rejeki",
    jenis: "Fire GeneratorPro",
    current: 0,
    total: 12,
  },
  {
    nomorPo: "PO-PGD-2310-105",
    tanggal: "20 Okt 2023",
    perusahaan: "PT Maju Teknologi",
    jenis: "PAC Montair",
    current: 3,
    total: 5,
  },
  {
    nomorPo: "PO-PGD-2310-106",
    tanggal: "19 Okt 2023",
    perusahaan: "PT Media Visual",
    jenis: "Fire GeneratorPro",
    current: 9,
    total: 10,
  },
];

export default function DaftarProgressPengadaanBarang() {
  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden py-0! gap-0!">
      
      {/* --- HEADER / TOOLBAR --- */}
      <div className="p-4 border-b border-slate-100">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Cari perusahaan..."
            className="pl-9 h-9 text-xs bg-slate-50/50 border-slate-200 shadow-none focus-visible:ring-cyan-500 rounded-lg"
          />
        </div>
      </div>

      {/* --- TABEL --- */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
              
              <TableHead className="h-11 w-[16%] pl-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  NOMOR PO
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[14%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  TANGGAL TERBIT
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[20%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  NAMA PERUSAHAAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>

              <TableHead className="h-11 w-[18%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  JENIS PENGADAAN BARANG
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>

              <TableHead className="h-11 w-[24%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  PROGRESS
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[8%]">
                AKSI
              </TableHead>
              
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {pengadaanProgressData.map((row, index) => {
              // Menghitung persentase untuk progress bar
              const percentage = (row.current / row.total) * 100;
              
              // Menentukan warna progress bar berdasarkan persentase
              let barColor = "bg-[#FDE047]"; // Kuning (Default parsial)
              if (row.current === 0) {
                barColor = "bg-slate-200"; // Abu-abu jika 0
              } else if (row.current === row.total) {
                barColor = "bg-cyan-400"; // Biru/Cyan jika lunas/selesai 100%
              }

              return (
                <TableRow 
                  key={index} 
                  className="border-b-slate-100 hover:bg-slate-50 transition-colors"
                >
                  
                  {/* Kolom Nomor PO (Bold) */}
                  <TableCell className="font-bold text-slate-800 text-xs py-4 pl-4">
                    {row.nomorPo}
                  </TableCell>

                  <TableCell className="text-slate-500 text-xs py-4">
                    {row.tanggal}
                  </TableCell>
                  
                  {/* Kolom Nama Perusahaan (Bold) */}
                  <TableCell className="font-bold text-slate-700 text-xs py-4">
                    {row.perusahaan}
                  </TableCell>
                  
                  {/* Kolom Jenis (Badge Abu-abu) */}
                  <TableCell className="py-4">
                    <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none rounded-full px-2.5 py-0.5 text-[10px] font-medium shadow-none">
                      {row.jenis}
                    </Badge>
                  </TableCell>

                  {/* Kolom PROGRESS (Bar + Teks) */}
                  <TableCell className="py-4">
                    <div className="flex items-center gap-3">
                      {/* Background Bar (Track) */}
                      <div className="h-2 w-24 bg-slate-200 rounded-full overflow-hidden shrink-0">
                        {/* Foreground Bar (Fill) */}
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${barColor}`} 
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      {/* Teks Deskripsi */}
                      <span className="text-[11px] text-slate-500 font-medium">
                        {row.current} dari {row.total} barang terbeli
                      </span>
                    </div>
                  </TableCell>
                  
                  {/* Kolom Aksi */}
                  <TableCell className="text-right py-4 pr-4">
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
          Menampilkan <strong className="text-slate-700">6</strong> dari <strong className="text-slate-700">42</strong> data
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
            7
          </Button>
          
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
    </Card>
  );
}