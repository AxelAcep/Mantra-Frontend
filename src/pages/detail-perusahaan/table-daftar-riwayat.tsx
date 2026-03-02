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

const riwayatData = [
  {
    jenis: "Pengadaan Barang",
    nomorPo: "PO-2023-005",
    jenisBarang: "PAC Montair",
    tanggal: "15 Agu 2023",
    bast: "10 Okt 2023",
  },
  {
    jenis: "Maintenance",
    nomorPo: "PO-2023-012",
    jenisBarang: "Generator FirePro",
    tanggal: "01 Sep 2023",
    bast: "28 Sep 2023",
  },
  {
    jenis: "Pengadaan Barang",
    nomorPo: "PO-2023-008",
    jenisBarang: "PAC Montair",
    tanggal: "20 Jul 2023",
    bast: "05 Sep 2023",
  },
  {
    jenis: "Maintenance",
    nomorPo: "PO-2023-015",
    jenisBarang: "Generator FirePro",
    tanggal: "10 Jun 2023",
    bast: "15 Jul 2023",
  },
  {
    jenis: "Pengadaan Barang",
    nomorPo: "PO-2023-018",
    jenisBarang: "PAC Montair",
    tanggal: "05 Mei 2023",
    bast: "20 Jun 2023",
  },
];

// Fungsi bantuan untuk render gaya Badge berdasarkan Jenis Penawaran
const getJenisBadgeColor = (jenis: string) => {
  if (jenis === "Pengadaan Barang") {
    // Warna Cyan/Biru Muda
    return "bg-cyan-50 text-cyan-600 hover:bg-cyan-100 border-none shadow-none font-medium";
  } else if (jenis === "Maintenance") {
    // Warna Oranye Muda
    return "bg-orange-50 text-orange-600 hover:bg-orange-100 border-none shadow-none font-medium";
  }
  return "bg-slate-100 text-slate-600 border-none shadow-none";
};

export default function DaftarRiwayat() {
  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden py-0! gap-0!">
      
      {/* --- HEADER --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-slate-100 gap-4">
        <h2 className="text-sm font-bold text-slate-800">Proyek Selesai & Lunas</h2>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <Button variant="outline" className="h-9 text-xs font-medium text-slate-600 border-slate-200 shadow-none">
            <ListFilter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          
          <div className="relative w-full md:w-[300px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Cari nomor PO, jenis pengadaan..."
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
              
              <TableHead className="h-11 w-[18%] pl-4">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  JENIS PENAWARAN
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[15%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  NOMOR PO
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[20%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  JENIS BARANG
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[17%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  TANGGAL TERBIT
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="h-11 w-[15%]">
                <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase cursor-pointer hover:text-slate-800">
                  BAST
                  <ChevronsUpDown className="h-3 w-3 opacity-50" />
                </div>
              </TableHead>
              
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[15%]">
                AKSI
              </TableHead>
              
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {riwayatData.map((row, index) => (
              <TableRow 
                key={index} 
                className="border-b-slate-100 hover:bg-slate-50 transition-colors"
              >
                
                <TableCell className="py-3.5 pl-4">
                  <Badge className={`text-[10px] px-2.5 py-0.5 rounded-full ${getJenisBadgeColor(row.jenis)}`}>
                    {row.jenis}
                  </Badge>
                </TableCell>
                
                <TableCell className="font-bold text-slate-800 text-xs py-3.5">
                  {row.nomorPo}
                </TableCell>
                
                <TableCell className="text-slate-600 text-xs py-3.5">
                  {row.jenisBarang}
                </TableCell>
                
                <TableCell className="text-slate-500 text-xs py-3.5">
                  {row.tanggal}
                </TableCell>

                <TableCell className="text-slate-500 text-xs py-3.5">
                  {row.bast}
                </TableCell>
                
                <TableCell className="text-right py-3.5 pr-4">
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
          Menampilkan <strong className="text-slate-700">5</strong> dari <strong className="text-slate-700">28</strong> riwayat
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
            6
          </Button>
          
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
    </Card>
  );
}