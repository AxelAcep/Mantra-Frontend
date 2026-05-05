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
import { useMasterStats } from "@/hooks/use-kpi";
import { useMasterKaryawan } from "@/hooks/use-master-activity";
import { Link, useNavigate } from "react-router-dom";

export default function DailyActivityReport() {
  const navigate = useNavigate();
  const now = new Date();
  const bulan = now.getMonth() + 1;
  const tahun = now.getFullYear();

  const { data: stats } = useMasterStats();
  const { data: karyawanData, isLoading } = useMasterKaryawan(1, "", "tahun", bulan, tahun);

  // Ambil 5 data teratas untuk dashboard
  const activities = karyawanData?.data?.slice(0, 5) ?? [];

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden p-0 gap-0">

      {/* --- BAGIAN HEADER KARTU --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-4 border-b border-slate-100 gap-4">
        <div>
          <h2 className="text-base font-bold text-slate-800">Daily Activity Report</h2>
          <p className="text-xs text-slate-500 mt-1">
            Tugas dijadwalkan hari ini ({now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })})
          </p>
        </div>

        {/* Statistik Kanan */}
        <div className="flex items-center gap-4 md:gap-6">
          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-slate-400">Total Karyawan</p>
            <p className="text-lg font-bold text-slate-800">{stats?.totalKaryawan ?? 0}</p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-red-400">Karyawan Overdue</p>
            <p className="text-lg font-bold text-red-500">{stats?.karyawanOverdue ?? 0}</p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>

          <div className="text-center">
            <p className="text-[10px] font-bold uppercase text-orange-400">Total Tugas Overdue</p>
            <p className="text-lg font-bold text-orange-500">{stats?.overdue ?? 0}</p>
          </div>
          <div className="w-px h-8 bg-slate-200"></div>

          <Link to="/dailyactivity?tab=aktif" className="text-xs font-medium text-cyan-600 hover:underline shrink-0">
            Lihat Semua
          </Link>
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
            {isLoading && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                  Memuat data...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && activities.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-slate-400 text-sm">
                  Tidak ada data aktivitas.
                </TableCell>
              </TableRow>
            )}
            {activities.map((row) => (
              <TableRow key={row.id}>

                <TableCell className="font-medium text-slate-800 text-sm">
                  {row.nama}
                </TableCell>

                <TableCell className="text-slate-500 text-sm">
                  {row.divisi}
                </TableCell>

                <TableCell>
                  {row.overdueCount > 0 ? (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-red-500 font-bold text-sm">{row.overdueCount}</span>
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
                  {row.aktivitasBerjalan}
                </TableCell>

                <TableCell className="text-emerald-500 font-bold text-sm text-center">
                  {row.completedCount}
                </TableCell>

                <TableCell className="font-bold text-slate-800 text-sm text-center">
                  {row.totalAktivitas}
                </TableCell>

                <TableCell className="text-right">
                  {row.overdueCount > 0 ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/kpi/${row.id}`)}
                      className="text-red-500 border-red-200 bg-red-50 hover:bg-red-100 hover:text-red-600 h-8 text-xs font-medium"
                    >
                      Review {row.overdueCount} overdue
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/kpi/${row.id}`)}
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