import React from 'react';
import {
  User,
  Mail,
  Clock3,
  MessageSquareText,
  FileText,
  Upload,
  Download,
  AlertCircle,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

type FollowUpStage = {
  title: string;
  description: string;
  date: string;
  status: "active" | "locked" | "done";
};

type ActivityLog = {
  id: number;
  title: string;
  description: string;
  time: string;
};

const followUpStages: FollowUpStage[] = [
  {
    title: "Penawaran Terkirim ke Customer",
    description: "Menunggu pengiriman dokumen penawaran lengkap via email ke Ahmad Rizki",
    date: "15 Feb, 10:15",
    status: "active",
  },
  {
    title: "Menunggu Feedback Customer",
    description: "Menunggu status langkah sebelumnya",
    date: "",
    status: "locked",
  },
  {
    title: "PO Diterima",
    description: "Menunggu status langkah sebelumnya",
    date: "",
    status: "locked",
  },
];

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

function SectionTitle({ icon, title }: { icon: React.ReactNode; title: string }) {
  return (
    <div className="p-4 border-b border-gray-50 flex items-center gap-2 font-bold text-slate-800 text-sm">
      <span className="text-cyan-500">{icon}</span>
      {title}
    </div>
  );
}

export default function Step5() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-xl">Detail</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-5">
              <User size={16} className="text-cyan-500" /> PIC Follow Up
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                SA
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 leading-tight">Siti Aminah</p>
                <p className="text-sm text-gray-400 font-medium mt-1">Sales</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-5">
              <User size={16} className="text-cyan-500" /> Kontak Klien
            </div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50/60 rounded-xl border border-gray-100 p-5">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Customer Name</p>
                <p className="text-base font-bold text-slate-800">Ahmad Rizki</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Kontak</p>
                <p className="text-base font-bold text-slate-800 break-all">PT.ABC@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <SectionTitle icon={<Clock3 size={16} />} title="Status Follow Up" />
          <div className="p-6 pt-2">
            <div className="bg-slate-50/70 rounded-xl border border-gray-100 p-6 space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-5">Progress Komunikasi</p>
                <div className="space-y-5">
                  {followUpStages.map((stage, index) => {
                    const isActive = stage.status === "active";
                    const isDone = stage.status === "done";

                    return (
                      <div key={stage.title} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                              isActive
                                ? "bg-amber-50 border-amber-200 text-amber-500"
                                : isDone
                                  ? "bg-green-50 border-green-200 text-green-500"
                                  : "bg-slate-100 border-slate-200 text-slate-300"
                            }`}
                          >
                            {isDone ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                          </div>
                          {index < followUpStages.length - 1 && (
                            <div className="w-px flex-1 min-h-[34px] bg-gray-200 mt-2" />
                          )}
                        </div>

                        <div className="pt-1">
                          <p className={`text-base font-bold ${isActive || isDone ? "text-slate-800" : "text-slate-300"}`}>
                            {stage.title}
                          </p>
                          <p className={`text-sm mt-1 ${isActive || isDone ? "text-gray-500" : "text-slate-300"}`}>
                            {stage.description}
                          </p>
                          {stage.date && (
                            <p className="text-sm text-gray-400 mt-2 font-medium">{stage.date}</p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-2">
          <h1 className="font-bold text-xl mb-4">Dokumen</h1>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mb-6">
            <div className="p-4 flex justify-between items-center border-b border-gray-50">
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

            <div className="p-4 pt-0">
              <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">Follow up Penawaran</p>
                    <p className="text-sm text-gray-400">Diunggah oleh Nanda • 13 Feb, 09:00</p>
                  </div>
                </div>
                <button className="text-cyan-500 font-bold text-sm flex items-center gap-1 hover:text-cyan-600">
                  Lihat Detail <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 flex justify-between items-center border-b border-gray-50">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
              </div>
              <button className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline">
                <Upload size={14} /> Upload File
              </button>
            </div>

            <div className="p-2 space-y-1">
              <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">BoQ_Draft_v2.pdf</p>
                    <p className="text-[10px] text-gray-400">Diunggah oleh Anda • 12 Feb, 10:30</p>
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
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">Screenshot follow up.png</p>
                    <p className="text-[10px] text-gray-400">Diunggah oleh Intan • 10 Feb, 09:00</p>
                  </div>
                </div>
                <a href="./Screenshot-follow-up.png" download className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
                  <Download size={18} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Log Aktivitas</h3>
            <button className="flex items-center gap-2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold relative hover:bg-cyan-600 transition-colors shadow-sm">
              <MessageSquareText size={14} />
              Chat
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_0_2px_#fff]">2</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            {logsByDate.map((section) => (
              <div key={section.title} className="space-y-4">
                <p className="text-[10px] font-bold text-gray-300 tracking-[2px] bg-gray-100 px-2 py-1 rounded inline-block text-gray-500">
                  {section.title}
                </p>
                <div className="relative space-y-6 pl-4 border-l border-gray-100">
                  {section.items.map((item) => (
                    <div key={item.id} className="relative">
                      <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300" />
                      <div className="flex justify-between items-start gap-2">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800">{item.title}</p>
                          <p className="text-[10px] text-gray-500 leading-relaxed">{item.description}</p>
                        </div>
                        <span className="text-[9px] text-gray-400 font-medium shrink-0">{item.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
