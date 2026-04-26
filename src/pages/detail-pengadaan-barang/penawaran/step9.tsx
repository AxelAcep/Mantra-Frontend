import React from 'react';
import {
  MessageSquareText,
  FileText,
  Upload,
  Download,
  ArrowRight,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

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
                    <p className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{item.time}</p>
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

export default function Step9() {
  const months = [
    { name: 'Jan 2026', date: '12 Jan 2026', status: 'Selesai' },
    { name: 'Feb 2026', date: '12 Feb 2026', status: 'Selesai' },
    { name: 'Mar 2026', date: '12 Mar 2026', status: 'Selesai' },
    { name: 'April 2026', date: '12 Apr 2026', status: 'Selesai' },
    { name: 'Mei 2026', date: '12 Mei 2026', status: 'Selesai' },
    { name: 'Jun 2026', date: '12 Jun 2026', status: 'Selesai' },
    { name: 'Jul 2026', date: '12 Jul 2026', status: 'Selesai' },
    { name: 'Agu 2026', date: '12 Agu 2026', status: 'Berjalan' },
    { name: 'Sep 2026', date: '12 Sep 2026', status: 'Belum aktif' },
    { name: 'Okt 2026', date: '12 Okt 2026', status: 'Belum aktif' },
    { name: 'Nov 2026', date: '12 Nov 2026', status: 'Belum aktif' },
    { name: 'Des 2026', date: '12 Des 2026', status: 'Belum aktif' },
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-8">
        <div>
          <SectionHeading title="Detail" />
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
            <h3 className="font-bold text-slate-800 text-sm mb-4">Tracking Garansi</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">PIC Garansi</p>
                <p className="text-sm font-bold text-slate-800">Rudi Hartono</p>
              </div>
              <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Periode Garansi</p>
                <p className="text-sm font-bold text-slate-800">12 Jan 2026 - 12 Des 2026</p>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-bold text-slate-800 text-xs">Progress Kunjungan Garansi Tahunan</h4>
                <p className="text-[10px] font-bold text-gray-400">8 / 12 bulan</p>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: '66.6%' }} />
              </div>
              <p className="text-[10px] text-gray-400 font-medium">8 dari 12 kunjungan telah terlaksana atau sedang berjalan.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {months.map((month, index) => (
                <div 
                  key={index} 
                  className={`rounded-xl border p-4 transition-all ${
                    month.status === 'Selesai' ? 'bg-cyan-50/30 border-cyan-100/50' : 
                    month.status === 'Berjalan' ? 'bg-amber-50/30 border-amber-100/50' : 
                    'bg-slate-50/30 border-gray-100 opacity-60'
                  }`}
                >
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-bold text-slate-800 text-[11px]">{month.name}</h5>
                    <span className={`text-[9px] font-bold ${
                      month.status === 'Selesai' ? 'text-cyan-500' : 
                      month.status === 'Berjalan' ? 'text-amber-500' : 
                      'text-gray-400'
                    }`}>
                      {month.status}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[9px] text-gray-400 font-medium uppercase tracking-tight">Tanggal Kunjungan</p>
                    <p className="text-[10px] font-bold text-slate-700">{month.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionHeading title="Dokumen" />
          <div className="space-y-4 mt-6">
            {/* Logbook Operasional Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText size={16} className="text-cyan-500" /> Logbook Operasional
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

              <div className="p-6">
                <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:border-cyan-100 transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800">Logbook Maintenance</p>
                      <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Diunggah oleh Febri • 12 Feb, 09:00</p>
                    </div>
                  </div>
                  <button className="text-cyan-500 font-bold text-[10px] flex items-center gap-1 hover:underline">
                    Lihat Detail <ArrowRight size={12} />
                  </button>
                </div>
              </div>
            </div>

            {/* Dokumen Pendukung Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
                </div>
                <button className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  <Upload size={14} /> Upload File
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">BAST.pdf</p>
                      <p className="text-[10px] text-gray-400">Diunggah oleh Anda • 12 Feb, 10:30</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivitySidebar />
      </div>
    </div>
  );
}
