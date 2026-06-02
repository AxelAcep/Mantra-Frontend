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
import { 
  CheckCheck,
  Check,
  X,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { AlertDialogMassal } from "./alert-dialog-massal";
import { AlertDialogSetuju } from "./alert-dialog-setuju";
import { AlertDialogTolakReschedule } from "./alert-dialog-tolak-reschedule";

// Data Dummy disesuaikan dengan gambar (semua berstatus Menunggu)
const dummyPengajuanData = [
  {
    inisial: "BJ",
    inisialColor: "bg-blue-100 text-blue-600",
    nama: "Budi Johan",
    peran: "Teknisi Lapangan",
    aktivitas: "Maintenance AC Gedung A",
    jadwalAwalTgl: "24 Okt 2023",
    jadwalAwalJam: "09:00 WIB",
    jadwalBaruTgl: "25 Okt 2023",
    jadwalBaruJam: "13:00 WIB",
    alasan: "Cuaca buruk di lokasi proyek sebelumnya menyebabkan...",
    status: "Menunggu",
  },
  {
    inisial: "RA",
    inisialColor: "bg-purple-100 text-purple-600",
    nama: "Rina Amalia",
    peran: "Inspektor Fire Safety",
    aktivitas: "Inspeksi APAR Lantai 3",
    jadwalAwalTgl: "24 Okt 2023",
    jadwalAwalJam: "14:00 WIB",
    jadwalBaruTgl: "26 Okt 2023",
    jadwalBaruJam: "09:00 WIB",
    alasan: "Permintaan klien untuk menunda karena ada meeting direksi di lokasi.",
    status: "Menunggu",
  },
  {
    inisial: "JS",
    inisialColor: "bg-teal-100 text-teal-600",
    nama: "Joko Susilo",
    peran: "Instalasi AC",
    aktivitas: "Pemasangan Unit Baru PT Maju",
    jadwalAwalTgl: "25 Okt 2023",
    jadwalAwalJam: "10:00 WIB",
    jadwalBaruTgl: "28 Okt 2023",
    jadwalBaruJam: "10:00 WIB",
    alasan: "Unit AC belum sampai dari vendor logistik.",
    status: "Menunggu",
  },
  {
    inisial: "DK",
    inisialColor: "bg-orange-100 text-orange-600",
    nama: "Deni Kurniawan",
    peran: "Surveyor",
    aktivitas: "Survey Lokasi Gudang B",
    jadwalAwalTgl: "24 Okt 2023",
    jadwalAwalJam: "11:00 WIB",
    jadwalBaruTgl: "25 Okt 2023",
    jadwalBaruJam: "08:00 WIB",
    alasan: "Kendaraan operasional mengalami mogok di jalan tol.",
    status: "Menunggu",
  },
  {
    inisial: "SS",
    inisialColor: "bg-indigo-100 text-indigo-600",
    nama: "Sari Simorangkir",
    peran: "Admin Support",
    aktivitas: "Koordinasi Vendor Sparepart",
    jadwalAwalTgl: "24 Okt 2023",
    jadwalAwalJam: "15:00 WIB",
    jadwalBaruTgl: "25 Okt 2023",
    jadwalBaruJam: "09:00 WIB",
    alasan: "Vendor reschedule meeting dadakan.",
    status: "Menunggu",
  },
];

const pengajuanData: typeof dummyPengajuanData = [];

export default function DaftarPengajuanJadwalUlang() {
  const handleKonfirmasiSemua = () => {
  };

  const handleSetujui = () => {
  };

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden py-0! gap-0!">
      
      {/* --- HEADER / TOOLBAR --- */}
      {/* Menggunakan justify-end agar tombol terdorong ke paling kanan */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-end">
        <AlertDialogMassal onConfirm={handleKonfirmasiSemua}>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-full h-9 px-5 text-xs font-medium shadow-sm shrink-0">
            <CheckCheck className="w-4 h-4 mr-1.5" />
            Terima Semua Pengajuan
          </Button>
        </AlertDialogMassal>
      </div>

      {/* --- TABEL --- */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/30 hover:bg-slate-50/30">
              
              <TableHead className="h-11 w-[20%] pl-4">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  KARYAWAN
                </span>
              </TableHead>
              
              <TableHead className="h-11 w-[18%]">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  AKTIVITAS
                </span>
              </TableHead>
              
              <TableHead className="h-11 w-[12%]">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  JADWAL AWAL
                </span>
              </TableHead>

              <TableHead className="h-11 w-[12%]">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  JADWAL BARU
                </span>
              </TableHead>

              <TableHead className="h-11 w-[20%]">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  ALASAN
                </span>
              </TableHead>

              <TableHead className="h-11 w-[10%]">
                <span className="text-[10px] font-bold text-slate-500 uppercase">
                  STATUS
                </span>
              </TableHead>
              
              <TableHead className="text-[10px] font-bold text-slate-500 uppercase h-11 text-right pr-4 w-[8%]">
                AKSI
              </TableHead>
              
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {pengajuanData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm font-medium">
                  Tidak ada data tersedia
                </TableCell>
              </TableRow>
            ) : (
              pengajuanData.map((row, index) => (
                <TableRow 
                  key={index} 
                  className="border-b-slate-100 hover:bg-slate-50 transition-colors"
                >
                  
                  {/* Kolom Karyawan (Avatar Inisial + Nama + Peran) */}
                  <TableCell className="py-4 pl-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${row.inisialColor}`}>
                        {row.inisial}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-800 text-xs">{row.nama}</span>
                        <span className="text-[10px] text-slate-500 mt-0.5">{row.peran}</span>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="font-bold text-slate-700 text-xs py-4">
                    {row.aktivitas}
                  </TableCell>

                  {/* Kolom Jadwal Awal */}
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-slate-700 text-xs">{row.jadwalAwalTgl}</span>
                      <span className="text-[10px] text-slate-500 mt-0.5">{row.jadwalAwalJam}</span>
                    </div>
                  </TableCell>

                  {/* Kolom Jadwal Baru (Warna Cyan) */}
                  <TableCell className="py-4">
                    <div className="flex flex-col">
                      <span className="font-bold text-cyan-600 text-xs">{row.jadwalBaruTgl}</span>
                      <span className="text-[10px] text-cyan-500 mt-0.5">{row.jadwalBaruJam}</span>
                    </div>
                  </TableCell>

                  <TableCell className="text-slate-500 text-[11px] py-4 leading-relaxed pr-4">
                    {row.alasan}
                  </TableCell>

                  {/* Kolom Status */}
                  <TableCell className="py-4">
                    {/* Karena di dataset ini semua Menunggu, badge di-hardcode dengan warna amber */}
                    <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-100 border-none rounded-full px-2.5 py-0.5 text-[10px] font-medium shadow-none">
                      {row.status}
                    </Badge>
                  </TableCell>
                  
                  {/* Kolom Aksi */}
                  <TableCell className="text-right py-4 pr-4">
                    <div className="flex items-center justify-end gap-3">
                      
                      {/* Tombol Ceklis dan Silang */}
                      <div className="flex items-center gap-1.5">
                        <AlertDialogSetuju onConfirm={handleSetujui}>
                          <button className="h-6 w-6 rounded-full border border-emerald-200 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition-colors">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                          </button>
                        </AlertDialogSetuju>
                        <AlertDialogTolakReschedule onConfirm={(alasan) => {
                            console.log("Ditolak dengan alasan:", alasan);
                            // Panggil API tolak di sini
                          }}
                        >
                          <button className="h-6 w-6 rounded-full border border-rose-200 text-rose-500 flex items-center justify-center hover:bg-rose-100 transition-colors">
                            <X className="h-3.5 w-3.5 stroke-[3]" />
                          </button>
                        </AlertDialogTolakReschedule>
                      </div>
                      
                      {/* Link Teks */}
                      <button className="text-[11px] font-medium text-cyan-500 hover:text-cyan-600 hover:underline shrink-0">
                        Lihat Detail
                      </button>
                    </div>
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
          Menampilkan <strong className="text-slate-700">{pengajuanData.length}</strong> dari <strong className="text-slate-700">{pengajuanData.length}</strong> data
        </p>
        
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-600" disabled>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          
          {pengajuanData.length === 0 ? (
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
                8
              </Button>
            </>
          )}
          
          <Button variant="ghost" size="icon" className="w-7 h-7 rounded-md text-slate-600 hover:bg-slate-100" disabled={pengajuanData.length === 0}>
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
    </Card>
  );
}