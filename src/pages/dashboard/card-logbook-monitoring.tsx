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
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useMasterAktif } from "@/hooks/use-master-activity";
import { useNavigate, Link } from "react-router-dom";
import { useMemo } from "react";

export default function LogbookMonitoring() {
  const navigate = useNavigate();

  // Fetch data aktif (ambil cukup banyak untuk dikelompokkan)
  const { data: aktifData, isLoading } = useMasterAktif(1, 50);

  // Mengelompokkan data berdasarkan karyawan
  const logbookData = useMemo(() => {
    if (!aktifData?.data) return [];

    const grouped: Record<string, any> = {};

    aktifData.data.forEach((item: any) => {
      const pegawaiId = item.pegawaiId;
      if (!grouped[pegawaiId]) {
        grouped[pegawaiId] = {
          id: pegawaiId,
          name: item.pegawai?.nama || "Tanpa Nama",
          division: item.pegawai?.divisi || "-",
          input: item.judul,
          process: item.kategori,
          extraLogs: [],
          mainActivityId: item.id
        };
      } else {
        grouped[pegawaiId].extraLogs.push(item.judul);
      }
    });

    // Ambil 5 karyawan teratas yang paling baru aktif
    return Object.values(grouped).slice(0, 5);
  }, [aktifData]);

  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden mt-6 p-0 gap-0">

      {/* --- HEADER --- */}
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">Logbook Monitoring</h2>
          <p className="text-xs text-slate-500 mt-1">Catatan aktivitas terkini</p>
        </div>
        <Link to="/dailyactivity" className="text-xs font-medium text-cyan-600 hover:underline">
          Lihat Semua
        </Link>
      </div>

      {/* --- TABEL --- */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[20%]">NAMA</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[15%]">DIVISI</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[40%]">DAILY ACTIVITY</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[15%]">TERKAIT PROSES</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[10%] text-right">AKSI</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                  Memuat data...
                </TableCell>
              </TableRow>
            )}
            {!isLoading && logbookData.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-slate-400 text-sm">
                  Tidak ada aktivitas yang sedang berjalan.
                </TableCell>
              </TableRow>
            )}
            {logbookData.map((row) => (
              <TableRow key={row.id}>

                <TableCell className="font-bold text-slate-800 text-sm">
                  {row.name}
                </TableCell>

                <TableCell className="text-slate-500 text-sm">
                  {row.division}
                </TableCell>

                <TableCell className="text-slate-600 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="truncate max-w-[250px]">{row.input}</span>

                    {row.extraLogs.length > 0 && (
                      <HoverCard openDelay={100} closeDelay={100}>
                        <HoverCardTrigger asChild>
                          <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none cursor-pointer text-[10px] px-2 py-0.5 shadow-none rounded-md shrink-0">
                            +{row.extraLogs.length} lainnya
                          </Badge>
                        </HoverCardTrigger>

                        <HoverCardContent
                          align="start"
                          side="right"
                          className="w-72 p-4 border-slate-200 shadow-md rounded-xl bg-white"
                        >
                          <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-wider">
                            Logbook Lainnya
                          </h4>
                          <ul className="space-y-2 mb-4">
                            {row.extraLogs.map((log: string, index: number) => (
                              <li key={index} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                                <span className="text-cyan-500 mt-0.5">•</span>
                                {log}
                              </li>
                            ))}
                          </ul>
                          <div className="text-center pt-2 border-t border-slate-100">
                            <Link to={`/kpi/${row.id}`} className="text-xs font-medium text-cyan-600 hover:underline">
                              Lihat Semua ›
                            </Link>
                          </div>
                        </HoverCardContent>
                      </HoverCard>
                    )}
                  </div>
                </TableCell>

                <TableCell>
                  <Badge variant="outline" className="text-slate-500 font-normal rounded-full bg-slate-50 text-[10px] border-slate-200 shadow-none">
                    {row.process}
                  </Badge>
                </TableCell>

                <TableCell className="text-right">
                  <button
                    onClick={() => navigate(`/dailyactivity/${row.mainActivityId}`)}
                    className="text-xs font-medium text-cyan-600 hover:underline"
                  >
                    Pantau
                  </button>
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}