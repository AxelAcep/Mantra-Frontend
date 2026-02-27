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

// Data dummy dengan dukungan array untuk "logbook tambahan"
const logbookData = [
  { 
    id: 1, 
    name: "Ahmad Fauzi", 
    division: "Logistik", 
    input: "Konfirmasi penerimaan barang vendor A", 
    process: "Pengadaan", 
    extraLogs: [] // Kosong, jadi badge hover tidak muncul
  },
  { 
    id: 2, 
    name: "Siti Nurhaliza", 
    division: "Teknis", 
    input: "Laporan kerusakan unit 304", 
    process: "Maintenance", 
    extraLogs: [] 
  },
  { 
    id: 3, 
    name: "Budi Santoso", 
    division: "Gudang", 
    input: "Packing barang untuk pengiriman oNE", 
    process: "Pengadaan", 
    // Ada 3 data tambahan yang akan dimunculkan di dalam Hover Card
    extraLogs: [
      "Laporan Kerusakan AC Unit 102",
      "Update Stok Freon R32",
      "Jadwal Maintenance Gedung B"
    ] 
  },
  { 
    id: 4, 
    name: "Dian Sastro", 
    division: "Keuangan", 
    input: "Rekonsiliasi invoice vendor B", 
    process: "Finance", 
    extraLogs: [] 
  },
  { 
    id: 5, 
    name: "Eko Patrio", 
    division: "HR", 
    input: "Input data absensi karyawan baru", 
    process: "Personalia", 
    extraLogs: [] 
  },
];

export default function LogbookMonitoring() {
  return (
    <Card className="rounded-xl border-slate-200 shadow-sm overflow-hidden mt-6 p-0 gap-0">
      
      {/* --- HEADER --- */}
      <div className="flex justify-between items-center p-4 border-b border-slate-100">
        <div>
          <h2 className="text-base font-bold text-slate-800">Logbook Monitoring</h2>
          <p className="text-xs text-slate-500 mt-1">Catatan aktivitas terkini</p>
        </div>
        <button className="text-xs font-medium text-cyan-600 hover:underline">
          Lihat Semua
        </button>
      </div>

      {/* --- TABEL --- */}
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
              {/* Pembagian lebar kolom menggunakan persentase */}
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[20%]">NAMA</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[15%]">DIVISI</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[40%]">INPUT LOGBOOK</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[15%]">TERKAIT PROSES</TableHead>
              <TableHead className="text-[11px] font-bold text-slate-500 h-10 w-[10%] text-right">AKSI</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {logbookData.map((row) => (
              <TableRow key={row.id}>
                
                <TableCell className="font-bold text-slate-800 text-sm">
                  {row.name}
                </TableCell>
                
                <TableCell className="text-slate-500 text-sm">
                  {row.division}
                </TableCell>
                
                {/* Kolom Input Logbook beserta Hover Card */}
                <TableCell className="text-slate-600 text-sm flex items-center gap-2">
                  <span className="truncate">{row.input}</span>
                  
                  {/* Jika ada extraLogs, tampilkan HoverCard */}
                  {row.extraLogs.length > 0 && (
                    <HoverCard>
                      <HoverCardTrigger asChild>
                        <Badge className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none cursor-pointer text-[10px] px-2 py-0.5 shadow-none rounded-md">
                          +{row.extraLogs.length} lainnya
                        </Badge>
                      </HoverCardTrigger>
                      
                      {/* Isi dari Popover yang muncul saat di-hover */}
                      <HoverCardContent 
                        align="start" 
                        side="right" 
                        className="w-72 p-4 border-slate-200 shadow-md rounded-xl"
                      >
                        <h4 className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-wider">
                          Logbook Lainnya
                        </h4>
                        <ul className="space-y-2 mb-4">
                          {row.extraLogs.map((log, index) => (
                            <li key={index} className="flex items-start gap-2 text-xs text-slate-600 font-medium">
                              <span className="text-cyan-500 mt-0.5">•</span>
                              {log}
                            </li>
                          ))}
                        </ul>
                        <div className="text-center pt-2 border-t border-slate-100">
                          <button className="text-xs font-medium text-cyan-600 hover:underline">
                            Lihat Semua ›
                          </button>
                        </div>
                      </HoverCardContent>
                    </HoverCard>
                  )}
                </TableCell>
                
                <TableCell>
                  <Badge variant="outline" className="text-slate-500 font-normal rounded-full bg-slate-50 text-[10px] border-slate-200 shadow-none">
                    {row.process}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-right">
                  <button className="text-xs font-medium text-cyan-600 hover:underline">
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