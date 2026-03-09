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

// Data Dummy sesuai dengan gambar terbaru (Prefix M-)
const riwayatPenawaranData = [
  {
    noPenawaran: "M-2310-001",
    tanggal: "24 Okt 2023",
    perusahaan: "PT Maju Bersama",
    jenisBarang: "PAC Montair",
  },
  {
    noPenawaran: "M-2310-002",
    tanggal: "23 Okt 2023",
    perusahaan: "CV Sejahtera Abadi",
    jenisBarang: "Fire GeneratorPro",
  },
  {
    noPenawaran: "M-2310-003",
    tanggal: "23 Okt 2023",
    perusahaan: "Global Tech Solutions",
    jenisBarang: "PAC Montair",
  },
  {
    noPenawaran: "M-2310-004",
    tanggal: "22 Okt 2023",
    perusahaan: "PT Konstruksi Jaya",
    jenisBarang: "Fire GeneratorPro",
  },
  {
    noPenawaran: "M-2310-005",
    tanggal: "21 Okt 2023",
    perusahaan: "PT Sinar Mas",
    jenisBarang: "PAC Montair",
  },
  {
    noPenawaran: "M-2310-006",
    tanggal: "21 Okt 2023",
    perusahaan: "CV Karya Utama",
    jenisBarang: "PAC Montair",
  },
];

export default function DaftarPenawaranFinalMaintenance() {
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
              
              <TableHead className="h-11 w-[20%] pl-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  NOMOR PENAWARAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[20%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  TANGGAL PERMINTAAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[30%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  NAMA PERUSAHAAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>

              <TableHead className="h-11 w-[20%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  JENIS MAINTENANCE
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[10%]">
                AKSI
              </TableHead>
              
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {riwayatPenawaranData.map((row, index) => (
              <TableRow 
                key={index} 
                className="border-b-slate-100 hover:bg-slate-50 transition-colors"
              >
                
                {/* Kolom Nomor Penawaran ditebalkan */}
                <TableCell className="font-bold text-slate-700 text-xs py-4 pl-4">
                  {row.noPenawaran}
                </TableCell>

                <TableCell className="text-slate-500 text-xs py-4">
                  {row.tanggal}
                </TableCell>
                
                {/* Kolom Nama Perusahaan ditebalkan */}
                <TableCell className="font-bold text-slate-700 text-xs py-4">
                  {row.perusahaan}
                </TableCell>
                
                <TableCell className="py-4">
                  <Badge className="bg-slate-100 hover:bg-slate-200 text-slate-600 border-none rounded-md px-2 py-1 text-[10px] font-medium shadow-none">
                    {row.jenisBarang}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-right py-4 pr-4">
                  <button className="flex items-center justify-end gap-1 text-[11px] font-medium text-cyan-500 hover:text-cyan-600 hover:underline ml-auto w-full">
                    Lihat Detail
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </TableCell>
                
              </TableRow>
            ))}
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