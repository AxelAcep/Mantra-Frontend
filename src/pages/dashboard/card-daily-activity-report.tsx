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

// Data dummy (nantinya bisa diganti dengan data dari API/Backend)
const activitiesData = [
  { id: 1, name: "David Kim", division: "Marketing", overdue: 3, progress: 5, completed: 2, total: 10 },
  { id: 2, name: "Rina Amalia", division: "Operasional", overdue: 1, progress: 8, completed: 12, total: 21 },
  { id: 3, name: "Sarah Smith", division: "Sales", overdue: 0, progress: 3, completed: 4, total: 7 },
  { id: 4, name: "Budi Johan", division: "Teknisi", overdue: 0, progress: 2, completed: 6, total: 8 },
  { id: 5, name: "John Smith", division: "IT", overdue: 0, progress: 1, completed: 1, total: 2 },
];

export default function DailyActivityReport() {
  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden p-0 gap-0">
      
      {/* --- BAGIAN HEADER KARTU --- */}
      {/* Menggunakan div biasa alih-alih CardHeader agar lebih leluasa mengatur layout flexbox-nya */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Daily Activity Report</h2>
          <p className="text-xs text-slate-500 mt-1">Tugas dijadwalkan hari ini (24 Feb)</p>
        </div>

        {/* Statistik Kanan */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Total Karyawan</p>
            <p className="text-lg font-bold text-slate-800">32</p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div> {/* Garis vertikal pembatas */}
          
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-red-400">Karyawan Overdue</p>
            <p className="text-lg font-bold text-red-500">4</p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-orange-400">Total Tugas Overdue</p>
            <p className="text-lg font-bold text-orange-500">12</p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>
          
          <button className="text-xs font-medium text-cyan-600 hover:underline shrink-0">
            Lihat Semua
          </button>
        </div>
      </div>

      {/* --- BAGIAN ISI TABEL --- */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[20%]">KARYAWAN</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[15%]">DIVISI</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[12%] text-center">OVERDUE</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[12%] text-center">PROGRESS</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[12%] text-center">SELESAI</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[12%] text-center">TOTAL</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 text-right">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {activitiesData.map((row) => (
              <TableRow key={row.id}>
                
                <TableCell className="font-medium text-slate-800 text-sm">
                  {row.name}
                </TableCell>
                
                <TableCell className="text-slate-500 text-sm">
                  {row.division}
                </TableCell>
                
                {/* Kolom Overdue: Logika Kondisional untuk Badge */}
                <TableCell>
                  {row.overdue > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-red-500 font-bold text-sm">{row.overdue}</span>
                      {/* Badge Tanda Seru */}
                      <Badge 
                        variant="destructive" 
                        className="h-4 w-4 rounded-full p-0 flex items-center justify-center bg-red-100 text-red-500 border-none hover:bg-red-200 text-[10px] shadow-none"
                      >
                        !
                      </Badge>
                    </div>
                  ) : (
                    <span className="text-slate-400 font-medium block text-center">-</span>
                  )}
                </TableCell>
                
                <TableCell className="text-slate-600 font-medium text-sm text-center">
                  {row.progress}
                </TableCell>
                
                {/* Kolom Selesai menggunakan warna hijau (emerald) */}
                <TableCell className="text-emerald-500 font-bold text-sm text-center">
                  {row.completed}
                </TableCell>
                
                <TableCell className="font-bold text-slate-800 text-sm text-center">
                  {row.total}
                </TableCell>
                
                {/* Kolom Aksi: Logika Kondisional untuk Button */}
                <TableCell className="text-right">
                  {row.overdue > 0 ? (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-600 h-8 text-xs font-medium"
                    >
                      Review {row.overdue} overdue
                    </Button>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-8 text-xs text-slate-600 font-medium"
                    >
                      Lihat Aktivitas
                    </Button>
                  )}
                </TableCell>
                
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}