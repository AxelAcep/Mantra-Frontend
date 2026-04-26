import React, { useState } from 'react';
import {
  MessageSquareText,
  FileText,
  Upload,
  Download,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  Search,
  ShoppingCart,
  Truck,
  Wrench,
  CheckCircle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
} from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

const logsByDate = [
  {
    title: "23 Okt 2025",
    items: [
      { id: 1, title: "Upload Dokumen", description: "Rudi H. mengunggah file Material_List_Raw.xlsx.", time: "16:45" },
      { id: 2, title: "Tugas Dimulai", description: "Estimator mulai mengerjakan perhitungan.", time: "09:00" },
      { id: 3, title: "Penugasan PIC", description: "Rudi Hartono ditugaskan sebagai PIC Estimator.", time: "08:30" },
    ],
  },
  {
    title: "Kemarin",
    items: [
      { id: 4, title: "Upload Dokumen", description: "Rudi H. mengunggah file Material_List_Raw.xlsx.", time: "16:45" },
      { id: 5, title: "Tugas Dimulai", description: "Estimator mulai mengerjakan perhitungan.", time: "09:00" },
      { id: 6, title: "Penugasan PIC", description: "Rudi Hartono ditugaskan sebagai PIC Estimator.", time: "08:30" },
    ],
  },
  {
    title: "Hari Ini",
    items: [
      { id: 7, title: "BoQ Selesai (Draft)", description: "Rudi Hartono menyelesaikan perhitungan awal.", time: "10:30" },
      { id: 8, title: "Masuk Review", description: "Draft v2 dikirim untuk review internal tim engineering.", time: "11:00" },
    ],
  },
];

function ActivitySidebar() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-base">Log Aktivitas</h3>
        <button className="flex items-center gap-2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold relative hover:bg-cyan-600 transition-all shadow-sm active:scale-95">
          <MessageSquareText size={16} />
          Chat
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm font-bold">2</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin">
        {logsByDate.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex">
              <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {section.title}
              </p>
            </div>
            <div className="relative space-y-6 pl-5 ml-2.5 border-l-2 border-slate-50">
              {section.items.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-[#94a3b8]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.description}</p>
                    </div>
                    <span className="text-[10px] text-slate-400 font-semibold shrink-0">{item.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

type Item = {
  id: number;
  name: string;
  status: 'Ready' | 'Perlu Beli';
  qty: string;
  price: string;
  total: string;
  method: string;
  date?: string;
  hasAction?: boolean;
};

const itemsData: Item[] = [
  { id: 1, name: 'Kabel Power & Kontrol', status: 'Ready', qty: '1 Lot', price: 'Rp12.500.000', total: 'Rp12.500.000', method: 'Stok Gudang', date: '18 Feb 2026' },
  { id: 2, name: 'Pipa PVC Drainase', status: 'Perlu Beli', qty: '1 Lot', price: 'Rp14.750.000', total: 'Rp14.750.000', method: 'Indent lokal', date: '1 Mar 2026', hasAction: true },
  { id: 3, name: 'Penyangga atau Base Frame', status: 'Perlu Beli', qty: '10 Batang', price: 'Rp215.000', total: 'Rp2.000.000', method: 'Indent Luar Negeri', date: 'Belum Tersedia' },
  { id: 4, name: 'Isolasi Pipa (Armaflex)', status: 'Ready', qty: '2 Batang', price: 'Rp76.000', total: 'Rp156.000', method: 'Stok Gudang', date: '18 Feb 2026' },
  { id: 5, name: 'Pipa Tembaga (Copper Tubing)', status: 'Perlu Beli', qty: '1 Set', price: 'Rp45.000', total: 'Rp45.000', method: 'Pembelian Langsung', date: '20 Feb 2026', hasAction: true },
];

export default function Step6() {
  const [isEstimasiModalOpen, setIsEstimasiModalOpen] = useState(false);
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group hover:border-cyan-100 transition-all">
            <div className="flex items-center gap-2 mb-4 text-cyan-600">
              <ShoppingCart size={16} strokeWidth={2.5} />
              <p className="text-[10px] font-bold uppercase tracking-tight">No. Purchase Order</p>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">PO-2402-1187</h3>
            <p className="text-xs text-gray-400">Terbit 10 Feb 2025</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group hover:border-cyan-100 transition-all">
            <div className="flex items-center gap-2 mb-4 text-cyan-600">
              <FileText size={16} strokeWidth={2.5} />
              <p className="text-[10px] font-bold uppercase tracking-tight">No. Work Order</p>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">WO-IMP-2402-044</h3>
            <p className="text-xs text-gray-400">Terbit 13 Feb 2025</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group hover:border-cyan-100 transition-all">
            <div className="flex items-center gap-2 mb-4 text-cyan-600">
              <Truck size={16} strokeWidth={2.5} />
              <p className="text-[10px] font-bold uppercase tracking-tight">No. Deliver Order</p>
            </div>
            <h3 className="text-lg font-bold text-slate-400 mb-1">—</h3>
            <p className="text-xs text-gray-400">Belum tersedia</p>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group hover:border-cyan-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-cyan-600">
                <Clock size={16} strokeWidth={2.5} />
                <p className="text-[10px] font-bold uppercase tracking-tight">Waktu Pengerjaan</p>
              </div>
              <span className="text-[9px] bg-amber-50 text-amber-500 font-bold px-1.5 py-0.5 rounded">Menunggu</span>
            </div>
            <div className="flex items-end justify-between mb-1.5">
              <p className="text-[11px] text-gray-400 font-medium">Sisa waktu —</p>
              <p className="text-sm font-bold text-slate-800">0%</p>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-cyan-500 rounded-full" style={{ width: '0%' }} />
            </div>
            <p className="text-[10px] text-gray-400 mt-2">Menunggu estimasi waktu</p>
          </div>
        </div>

        <Tabs defaultValue="pembelian" className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 border-b border-gray-100">
            <TabsList className="flex gap-8 bg-transparent h-auto w-full justify-start rounded-none p-0 border-0">
              <TabsTrigger
                value="pembelian"
                className="flex items-center py-4 text-sm whitespace-nowrap border-0 border-b-2 border-transparent transition-all rounded-none data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:font-bold text-gray-400 hover:text-gray-600 bg-transparent shadow-none px-0 outline-none"
              >
                Pembelian Barang
              </TabsTrigger>
              <TabsTrigger
                value="pengantaran"
                className="flex items-center py-4 text-sm whitespace-nowrap border-0 border-b-2 border-transparent transition-all rounded-none data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:font-bold text-gray-400 hover:text-gray-600 bg-transparent shadow-none px-0 outline-none"
              >
                Pengantaran
              </TabsTrigger>
              <TabsTrigger
                value="instalasi"
                className="flex items-center py-4 text-sm whitespace-nowrap border-0 border-b-2 border-transparent transition-all rounded-none data-[state=active]:border-cyan-500 data-[state=active]:text-cyan-500 data-[state=active]:font-bold text-gray-400 hover:text-gray-600 bg-transparent shadow-none px-0 outline-none"
              >
                Instalasi
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="pembelian" className="p-6 m-0 outline-none">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Total Item</p>
                <p className="text-base font-bold text-slate-800">30 barang proyek</p>
              </div>
              <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Barang Ready</p>
                <p className="text-base font-bold text-slate-800">26 barang</p>
              </div>
              <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Barang Perlu Beli</p>
                <p className="text-base font-bold text-slate-800">4 barang</p>
              </div>
              <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Progres Pembelian Barang</p>
                <div className="flex items-center gap-3 mt-1">
                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-yellow-400 rounded-full" style={{ width: '86%' }} />
                  </div>
                  <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">26 dari 30 barang terbeli</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText size={16} className="text-cyan-500" />
                  <h3 className="font-bold text-slate-800 text-sm">Daftar Barang Pembelian</h3>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Cari nama barang..."
                      className="bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 w-64"
                    />
                  </div>
                  <button className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center gap-2 shadow-sm">
                    <CheckCircle2 size={14} /> Terima Semua
                  </button>
                </div>
              </div>

              <div className="rounded-md border border-gray-100 overflow-hidden">
                <Table className="w-full">
                  <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-gray-100 hover:bg-slate-50">
                      <TableHead className="px-4 py-3 text-slate-600 text-[11px] font-bold uppercase tracking-wider h-auto">Nama Barang</TableHead>
                      <TableHead className="px-4 py-3 text-slate-600 text-[11px] font-bold uppercase tracking-wider h-auto text-center">Status</TableHead>
                      <TableHead className="px-4 py-3 text-slate-600 text-[11px] font-bold uppercase tracking-wider h-auto text-center">Qty</TableHead>
                      <TableHead className="px-4 py-3 text-slate-600 text-[11px] font-bold uppercase tracking-wider h-auto text-center">Harga Satuan</TableHead>
                      <TableHead className="px-4 py-3 text-slate-600 text-[11px] font-bold uppercase tracking-wider h-auto text-center">Total</TableHead>
                      <TableHead className="px-4 py-3 text-slate-600 text-[11px] font-bold uppercase tracking-wider h-auto">Metode / Estimasi</TableHead>
                      <TableHead className="px-4 py-3 text-slate-600 text-[11px] font-bold uppercase tracking-wider h-auto text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {itemsData.map((item) => (
                      <TableRow key={item.id} className="bg-white border-b border-gray-50 last:border-0 hover:bg-slate-50/30 transition-all">
                        <TableCell className="px-4 py-4">
                          <p className="text-xs font-bold text-slate-800">{item.name}</p>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-center">
                          <Badge variant="outline" className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border-0 ${item.status === 'Ready' ? 'bg-green-50 text-green-500' : 'bg-amber-50 text-amber-500'
                            }`}>
                            {item.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-4 py-4 text-xs text-slate-600 font-medium text-center">{item.qty}</TableCell>
                        <TableCell className="px-4 py-4 text-xs text-slate-600 font-medium text-center">{item.price}</TableCell>
                        <TableCell className="px-4 py-4 text-xs font-bold text-slate-800 text-center">{item.total}</TableCell>
                        <TableCell className="px-4 py-4">
                          <p className="text-xs font-bold text-slate-700">{item.method}</p>
                          {item.date && (
                            item.date === 'Belum Tersedia' ? (
                              <Badge variant="outline" className="bg-red-50 text-red-600 border-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold mt-1">
                                {item.date}
                              </Badge>
                            ) : (
                              <p className="text-[10px] font-medium text-gray-400">
                                {item.date}
                              </p>
                            )
                          )}
                        </TableCell>
                        <TableCell className="px-4 py-4 text-right">
                          {item.date === 'Belum Tersedia' ? (
                            <button
                              onClick={() => setIsEstimasiModalOpen(true)}
                              className="text-cyan-500 text-[10px] font-bold flex items-center gap-1 hover:underline ml-auto"
                            >
                              Masukan Estimasi <ArrowRight size={12} />
                            </button>
                          ) : item.hasAction ? (
                            <div className="flex items-center justify-end gap-2">
                              <button className="text-green-500 hover:text-green-600 transition-colors" title="Terima">
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button className="text-red-400 hover:text-red-500 transition-colors" title="Tolak">
                                <XCircle className="w-5 h-5" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-gray-300">—</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between pt-2">
                <p className="text-[11px] text-gray-400 font-medium">Menampilkan 5 dari 30 data</p>
                <div className="flex items-center gap-1">
                  <button className="p-2 text-gray-300 hover:text-cyan-500 transition-colors">
                    <ChevronLeft size={16} />
                  </button>
                  <button className="w-8 h-8 rounded-lg bg-cyan-500 text-white text-xs font-bold shadow-sm">1</button>
                  <button className="w-8 h-8 rounded-lg text-gray-400 text-xs font-bold hover:bg-gray-50 transition-colors">2</button>
                  <button className="w-8 h-8 rounded-lg text-gray-400 text-xs font-bold hover:bg-gray-50 transition-colors">3</button>
                  <span className="px-2 text-gray-300">...</span>
                  <button className="w-8 h-8 rounded-lg text-gray-400 text-xs font-bold hover:bg-gray-50 transition-colors">6</button>
                  <button className="p-2 text-gray-400 hover:text-cyan-500 transition-colors">
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="pengantaran" className="p-6 text-center text-gray-400 text-sm">
            Konten Pengantaran belum tersedia.
          </TabsContent>

          <TabsContent value="instalasi" className="p-6 text-center text-gray-400 text-sm">
            Konten Instalasi belum tersedia.
          </TabsContent>
        </Tabs>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <FileText size={16} className="text-cyan-500" /> Logbook Operasional Pembelian Barang
            </div>
            <div className="flex gap-2">
              <div className="flex items-center bg-gray-50 p-1 rounded-lg">
                <button className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold px-3 py-1.5 rounded-md hover:text-gray-600 transition-colors">
                  <div className="w-2 h-2 rounded-full bg-slate-400" /> Bermasalah
                </button>
                <button className="flex items-center gap-1.5 bg-white text-cyan-600 text-[10px] font-bold px-3 py-1.5 rounded-md shadow-sm border border-gray-100">
                  <CheckCircle2 size={12} /> Semua
                </button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-3">
            {[
              { title: 'Logbook Pembelian Barang Pipa PVC Drainase (Indent Lokal)', time: '12 Feb, 09:00', badge: 'Perlu Tindakan' },
              { title: 'Logbook Pembelian Barang Pipa PVC Drainase (Indent Lokal)', time: '11 Feb, 08:30' },
              { title: 'Logbook Pembelian Pipa Tembaga', time: '10 Feb, 08:00' },
            ].map((log, i) => (
              <div key={i} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:border-cyan-100 transition-all group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800">{log.title}</p>
                      {log.badge && (
                        <Badge variant="outline" className="bg-amber-50 text-amber-500 text-[9px] font-bold border-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                          <AlertCircle size={10} /> {log.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Diunggah oleh Esti • {log.time}</p>
                  </div>
                </div>
                <button className="text-cyan-500 font-bold text-[10px] flex items-center gap-1 hover:underline">
                  Lihat Detail <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <SectionHeading title="Dokumen" />
          <div className="mt-4 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
              </div>
              <button className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline">
                <Upload size={14} /> Upload File
              </button>
            </div>

            <div className="p-4 space-y-1">
              {[
                { name: 'BoQ_Draft_v2.pdf', user: 'Anda', date: '12 Feb, 10:30' },
                { name: 'Spesifikasi_Teknis.docx', user: 'Fahri', date: '10 Feb, 09:00' },
                { name: 'Screenshot follow up.png', user: 'Intan', date: '10 Feb, 09:00' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">{doc.name}</p>
                      <p className="text-[10px] text-gray-400">Diunggah oleh {doc.user} • {doc.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {doc.name.includes('pdf') && (
                      <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                      </button>
                    )}
                    <button className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivitySidebar />
      </div>

      <Dialog open={isEstimasiModalOpen} onOpenChange={setIsEstimasiModalOpen}>
        <DialogContent className="max-w-md p-0 overflow-hidden border-0 rounded-2xl">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <DialogTitle className="text-xl font-bold text-slate-800">Estimasi Kedatangan Barang</DialogTitle>
              <DialogDescription className="text-sm text-slate-400">
                Masukkan perkiraan tanggal tiba untuk barang indent
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2 mb-8">
              <label className="text-sm font-bold text-slate-700">Estimasi waktu</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="date"
                  onClick={(e) => (e.target as HTMLInputElement).showPicker()}
                  className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-cyan-500 text-slate-800 font-medium appearance-none [&::-webkit-calendar-picker-indicator]:hidden cursor-pointer"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setIsEstimasiModalOpen(false)}
                className="rounded-xl px-8 py-5 border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition-all"
              >
                Batal
              </Button>
              <Button
                onClick={() => setIsEstimasiModalOpen(false)}
                className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl px-8 py-5 font-bold shadow-md shadow-cyan-100 transition-all"
              >
                Konfirmasi
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
