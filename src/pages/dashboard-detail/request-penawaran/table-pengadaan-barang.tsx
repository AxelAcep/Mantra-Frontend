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

// Data Dummy sesuai dengan gambar
const dummyPermintaanData = [
  {
    tanggal: "24 Okt 2023",
    noPenawaran: "Q-2310-001",
    picReq: "Budi Santoso",
    pembuat: "Andi P.",
    perusahaan: "PT Maju Bersama",
    lokasi: "Jakarta Selatan",
    jenisBarang: "PAC Montair",
  },
  {
    tanggal: "23 Okt 2023",
    noPenawaran: "Q-2310-002",
    picReq: "Siti Aminah",
    pembuat: "Dewi S.",
    perusahaan: "CV Sejahtera Abadi",
    lokasi: "Surabaya",
    jenisBarang: "Generator FirePro",
  },
  {
    tanggal: "23 Okt 2023",
    noPenawaran: "Q-2310-003",
    picReq: "Robert Davis",
    pembuat: "Rudi H.",
    perusahaan: "Global Tech Solutions",
    lokasi: "Bali",
    jenisBarang: "PAC Montair",
  },
  {
    tanggal: "22 Okt 2023",
    noPenawaran: "Q-2310-004",
    picReq: "Ahmad Zaky",
    pembuat: "Andi P.",
    perusahaan: "PT Konstruksi Jaya",
    lokasi: "Bandung",
    jenisBarang: "Sparepart AC",
  },
  {
    tanggal: "21 Okt 2023",
    noPenawaran: "Q-2310-005",
    picReq: "Linda Wijaya",
    pembuat: "Dewi S.",
    perusahaan: "PT Sinar Mas",
    lokasi: "Jakarta Pusat",
    jenisBarang: "Generator FirePro",
  },
  {
    tanggal: "21 Okt 2023",
    noPenawaran: "Q-2310-006",
    picReq: "Joni Iskandar",
    pembuat: "Rudi H.",
    perusahaan: "CV Karya Utama",
    lokasi: "Medan",
    jenisBarang: "PAC Montair",
  },
];

const permintaanData: typeof dummyPermintaanData = [];

export default function DaftarPermintaanPenawaranPengadaanBarang() {
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
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              
              <TableHead className="h-11 w-[12%] pl-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  TANGGAL PERMINTAAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[12%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  NO. PENAWARAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[12%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  PIC REQ
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>

              <TableHead className="h-11 w-[14%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  PEMBUAT PENAWARAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>

              <TableHead className="h-11 w-[15%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  PERUSAHAAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>

              <TableHead className="h-11 w-[12%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  LOKASI
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>

              <TableHead className="h-11 w-[13%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  JENIS BARANG
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[10%]">
                AKSI
              </TableHead>
              
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {permintaanData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-slate-400 text-sm font-medium">
                  Tidak ada data tersedia
                </TableCell>
              </TableRow>
            ) : (
              permintaanData.map((row, index) => (
                <TableRow 
                  key={index} 
                  className="border-b-slate-100 hover:bg-slate-50 transition-colors"
                >
                  
                  <TableCell className="text-slate-500 text-xs py-4 pl-4">
                    {row.tanggal}
                  </TableCell>
                  
                  {/* Kolom No Penawaran ditebalkan (bold) dan warnanya lebih gelap */}
                  <TableCell className="font-bold text-slate-700 text-xs py-4">
                    {row.noPenawaran}
                  </TableCell>
                  
                  <TableCell className="text-slate-500 text-xs py-4">
                    {row.picReq}
                  </TableCell>
                  
                  <TableCell className="text-slate-500 text-xs py-4">
                    {row.pembuat}
                  </TableCell>

                  {/* Kolom Perusahaan ditebalkan (bold) */}
                  <TableCell className="font-bold text-slate-700 text-xs py-4">
                    {row.perusahaan}
                  </TableCell>

                  <TableCell className="text-slate-500 text-xs py-4">
                    {row.lokasi}
                  </TableCell>
                  
                  <TableCell className="py-4">
                    {/* Badge kotak dengan warna abu-abu lembut sesuai gambar */}
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
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      {/* --- FOOTER: Pagination --- */}
      <div className="flex justify-between items-center p-4 border-t border-slate-100 bg-white">
        <p className="text-xs text-slate-500">
          Menampilkan <strong className="text-slate-700">{permintaanData.length}</strong> dari <strong className="text-slate-700">{permintaanData.length}</strong> data
        </p>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-600" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {permintaanData.length === 0 ? (
            <Button variant="ghost" size="sm" className="w-7 h-7 rounded-md bg-slate-100 text-slate-400 p-0 text-xs font-medium shadow-none cursor-not-allowed" disabled>
              1
            </Button>
          ) : (
            <>
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
            </>
          )}
          
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100" disabled={permintaanData.length === 0}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
    </Card>
  );
}