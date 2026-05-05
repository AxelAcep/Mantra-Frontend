import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useKPIBulan } from "@/hooks/use-kpi";
import { useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";

export default function KpiKaryawan() {
  const navigate = useNavigate();
  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const { data: kpiData, isLoading } = useKPIBulan(bulan, tahun);

  // Proses data untuk mendapatkan Top 3 dan Bottom 3
  const processedData = useMemo(() => {
    if (!kpiData?.data) return { top: [], bottom: [] };

    const mapped = kpiData.data.map((item) => {
      const total = item.baik + item.cukup + item.buruk;
      const scoreValue = total > 0 ? Math.round(((item.baik + item.cukup) / total) * 100) : 0;
      return {
        id: item.pegawaiId,
        name: item.nama,
        division: item.divisi,
        score: `${scoreValue}/100`,
        scoreValue,
        total
      };
    });

    // Urutkan berdasarkan skor tertinggi
    const sorted = [...mapped].sort((a, b) => b.scoreValue - a.scoreValue);
    const top = sorted.slice(0, 3);

    // Untuk performa terendah, ambil dari yang memiliki setidaknya 1 aktivitas
    const sortedWithActivity = mapped
      .filter(i => i.total > 0)
      .sort((a, b) => a.scoreValue - b.scoreValue);
    const bottom = sortedWithActivity.slice(0, 3);

    return { top, bottom };
  }, [kpiData]);

  return (
    <Card className="mt-6 rounded-xl border-slate-200 shadow-sm overflow-hidden p-0 gap-0">

      {/* --- HEADER KARTU --- */}
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">KPI Karyawan</h2>
          <p className="text-xs text-slate-500 mt-1">Analisa perbandingan kinerja karyawan</p>
        </div>
        <Link to="/dailyactivity?tab=karyawan" className="text-xs font-medium text-cyan-600 hover:underline">
          Lihat Semua
        </Link>
      </div>

      {/* --- KONTEN (DIBAGI 2 KOLOM) --- */}
      <CardContent className="p-4 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* --- BAGIAN KIRI: KPI TERBAIK --- */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1 h-3.5 bg-emerald-500 rounded-full"></div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-600">
              KPI Performa Terbaik
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
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400 text-[11px]">Memuat...</TableCell>
                  </TableRow>
                )}
                {!isLoading && processedData.top.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400 text-[11px]">Tidak ada data.</TableCell>
                  </TableRow>
                )}
                {processedData.top.map((row) => (
                  <TableRow key={row.id} className="border-b-slate-100 last:border-0">
                    <TableCell className="font-medium text-slate-800 text-xs py-2.5">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs py-2.5">
                      {row.division}
                    </TableCell>
                    <TableCell className="font-bold text-emerald-600 text-xs py-2.5">
                      {row.score}
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <button
                        onClick={() => navigate(`/kpi/${row.id}`)}
                        className="text-[11px] font-medium text-cyan-600 hover:underline"
                      >
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
                {isLoading && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400 text-[11px]">Memuat...</TableCell>
                  </TableRow>
                )}
                {!isLoading && processedData.bottom.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-10 text-slate-400 text-[11px]">Tidak ada data.</TableCell>
                  </TableRow>
                )}
                {processedData.bottom.map((row) => (
                  <TableRow key={row.id} className="border-b-slate-100 last:border-0">
                    <TableCell className="font-medium text-slate-800 text-xs py-2.5">
                      {row.name}
                    </TableCell>
                    <TableCell className="text-slate-500 text-xs py-2.5">
                      {row.division}
                    </TableCell>
                    <TableCell className="font-bold text-orange-500 text-xs py-2.5">
                      {row.score}
                    </TableCell>
                    <TableCell className="text-right py-2.5">
                      <button
                        onClick={() => navigate(`/kpi/${row.id}`)}
                        className="text-[11px] font-medium text-cyan-600 hover:underline"
                      >
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