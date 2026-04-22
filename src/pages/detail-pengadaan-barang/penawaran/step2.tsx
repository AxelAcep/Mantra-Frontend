import React, { useState } from 'react';
import {
  FileText,
  Clock3,
  MessageSquareText,
  Upload,
  Download,
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Wallet,
  FolderOpen,
} from 'lucide-react';

type ActivityLog = {
  id: number;
  title: string;
  description: string;
  time: string;
};

const logsByDate: { title: string; items: ActivityLog[] }[] = [
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

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

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

export default function Step2() {
  const [isFinancialExpanded, setIsFinancialExpanded] = useState(false);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-5">
              <Wallet size={16} className="text-cyan-500" />
              <span>Ringkasan Finansial</span>
            </div>

            <div className="space-y-4">
              <button
                onClick={() => setIsFinancialExpanded(!isFinancialExpanded)}
                className={`w-full text-left transition-all rounded-xl border p-5 group ${isFinancialExpanded
                  ? 'bg-cyan-50/50 border-cyan-100 shadow-sm'
                  : 'bg-slate-50/50 border-gray-100 hover:bg-slate-50'
                  }`}
              >
                <p className={`text-xs font-bold mb-2 uppercase tracking-tight transition-colors ${isFinancialExpanded ? 'text-cyan-600' : 'text-slate-400'
                  }`}>
                  Sub Total I + II + III
                </p>
                <div className="flex items-center justify-between">
                  <span className={`text-xl md:text-2xl font-bold transition-colors ${isFinancialExpanded ? 'text-cyan-700' : 'text-slate-800'
                    }`}>
                    Rp 485.000.000
                  </span>
                  <div className={`p-1 rounded-lg transition-all ${isFinancialExpanded
                    ? 'bg-white/50 text-cyan-500 rotate-180'
                    : 'text-slate-400'
                    }`}>
                    <ChevronDown size={20} />
                  </div>
                </div>
              </button>

              {isFinancialExpanded && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-4">
                    <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Sub Total I (Main Equipment)</p>
                    <p className="text-sm font-bold text-slate-700">Rp 300.000.000</p>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-4">
                    <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Sub Total II (Material Instalasi)</p>
                    <p className="text-sm font-bold text-slate-700">Rp 120.000.000</p>
                  </div>
                  <div className="bg-slate-50/80 rounded-xl border border-slate-100 p-4">
                    <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">Sub Total III (Jasa)</p>
                    <p className="text-sm font-bold text-slate-700">Rp 65.000.000</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
            <div className="flex justify-between items-center mb-5">
              <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
                <Clock3 size={16} className="text-cyan-500" />
                <span>Waktu Pengerjaan</span>
              </div>
              <span className="text-[11px] bg-amber-50 text-amber-500 px-3 py-1 rounded-full font-bold">
                Proses
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Sisa waktu: 23 jam</span>
                <span className="text-slate-800 font-bold">58%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full w-[58%]" />
              </div>
              <p className="text-sm text-gray-400 font-medium pt-1">Batas waktu: 17:00 WIB (2 hari kerja)</p>
            </div>
          </div>
        </div>

        <div className="pt-2 space-y-6">
          <SectionHeading title="Dokumen" />

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FileText size={16} className="text-cyan-500" /> Logbook Operasional
              </div>
              <div className="flex gap-2">
                <button className="flex items-center gap-1.5 bg-gray-100 text-gray-500 text-[11px] font-bold px-3 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                  <AlertCircle size={13} /> Bermasalah
                </button>
                <button className="flex items-center gap-1.5 bg-cyan-50 text-cyan-600 text-[11px] font-bold px-3 py-2 rounded-lg border border-cyan-100 hover:bg-cyan-100 transition-colors">
                  <CheckCircle2 size={13} /> Semua
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">Pembuatan BoQ</p>
                    <p className="text-sm text-gray-400">Diunggah oleh Nanda • 13 Feb, 09:00</p>
                  </div>
                </div>
                <button className="text-cyan-500 font-bold text-sm hover:text-cyan-600">
                  Lihat Detail →
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FolderOpen size={16} className="text-cyan-500" /> Dokumen Pendukung
              </div>
              <button className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline">
                <Upload size={14} /> Upload File
              </button>
            </div>

            <div className="p-4 space-y-1">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">BoQ_Draft_v2.pdf</p>
                    <p className="text-[10px] text-gray-400">Diunggah oleh Dimas • 12 Feb, 10:30</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                  </button>
                  <a href="./BoQ_Draft_v2.pdf" download className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
                    <Download size={18} />
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Spesifikasi_Teknis.docx</p>
                    <p className="text-[10px] text-gray-400">Diunggah oleh Febri • 10 Feb, 09:00</p>
                  </div>
                </div>
                <a href="./Spesifikasi_Teknis.docx" download className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
                  <Download size={18} />
                </a>
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
