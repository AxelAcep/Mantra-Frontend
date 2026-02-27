import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Data Dummy KPI Terbaik
const topKpiData = [
  { id: 1, name: "Andi Prasetyo", division: "Marketing", score: "98/100" },
  { id: 2, name: "Lina Marlina", division: "Sales", score: "95/100" },
  { id: 3, name: "Bagus Setiawan", division: "IT", score: "94/100" },
];

// Data Dummy KPI Terendah
const bottomKpiData = [
  { id: 1, name: "Rizky Ramadhan", division: "Logistik", score: "62/100" },
  { id: 2, name: "Dewi Sartika", division: "Admin", score: "58/100" },
  { id: 3, name: "Tono Sudiro", division: "Gudang", score: "45/100" },
];

export default function KpiKaryawan() {
  return (
    <Card className="mt-6 rounded-xl border-slate-200 shadow-sm overflow-hidden p-0 gap-0">
      
      {/* --- HEADER KARTU --- */}
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">KPI Karyawan</h2>
          <p className="text-xs text-slate-500 mt-1">Analisa perbandingan kinerja karyawan</p>
        </div>
        <button className="text-xs font-medium text-cyan-600 hover:underline">
          Lihat Semua
        </button>
      </div>

      {/* --- KONTEN (DIBAGI 2 KOLOM) --- */}
      {/* grid-cols-1 untuk HP, lg:grid-cols-2 untuk layar lebar (laptop/PC) */}
      <CardContent className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* --- BAGIAN KIRI: KPI TERBAIK --- */}
        <div>
          {/* Judul Bagian dengan Garis Indikator Hijau */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3.5 bg-emerald-500 rounded-full"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              KPI Performa Terbaik
            </h3>
          </div>

          {/* Tabel dibungkus div agar memiliki border dan sudut membulat */}
          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b-slate-100">
                  <TableHead className="text-[11px] font-bold text-slate-500 h-9 w-[40%]">NAMA</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 h-9 w-[30%]">DIVISI</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 h-9 w-[15%]">SKOR</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 h-9 w-[15%] text-right">AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topKpiData.map((row) => (
                  <TableRow key={row.id} className="border-b-slate-100 last:border-0">
                    <TableCell className="font-medium text-slate-800 text-xs py-2.5">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs py-2.5">
                      {row.division}
                    </TableCell>
                    {/* Skor warna hijau */}
                    <TableCell className="font-bold text-emerald-600 text-xs py-2.5">
                      {row.score}
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <button className="text-[11px] font-medium text-cyan-600 hover:underline">
                        Lihat Detail
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* --- BAGIAN KANAN: KPI TERENDAH --- */}
        <div>
          {/* Judul Bagian dengan Garis Indikator Oranye/Merah */}
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3.5 bg-orange-500 rounded-full"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              KPI Performa Terendah
            </h3>
          </div>

          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/80 hover:bg-slate-50/80 border-b-slate-100">
                  <TableHead className="text-[11px] font-bold text-slate-500 h-9 w-[40%]">NAMA</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 h-9 w-[30%]">DIVISI</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 h-9 w-[15%]">SKOR</TableHead>
                  <TableHead className="text-[11px] font-bold text-slate-500 h-9 w-[15%] text-right">AKSI</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bottomKpiData.map((row) => (
                  <TableRow key={row.id} className="border-b-slate-100 last:border-0">
                    <TableCell className="font-medium text-slate-800 text-xs py-2.5">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs py-2.5">
                      {row.division}
                    </TableCell>
                    {/* Skor warna oranye/merah */}
                    <TableCell className="font-bold text-orange-500 text-xs py-2.5">
                      {row.score}
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <button className="text-[11px] font-medium text-cyan-600 hover:underline">
                        Lihat Detail
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>

      </CardContent>
    </Card>
  );
}