import React from 'react';
import {
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  FolderOpen,
  Upload,
  FileText,
  Download,
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

function ApprovalCard({
  initials,
  title,
  name,
  status,
  note,
  action,
}: {
  initials: string;
  title: string;
  name: string;
  status: "approved" | "waiting";
  note?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50/70 rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{title}</p>
            <p className="text-sm text-gray-400 font-medium mt-1">{name}</p>
          </div>
        </div>

        {status === "approved" ? (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-2 rounded-xl text-sm font-semibold">
              <CheckCircle2 size={14} /> Disetujui
            </span>
            <span className="text-sm text-gray-400 font-medium">14 Feb, 09:30</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-amber-500 text-sm font-semibold">
            <Clock3 size={14} /> Menunggu Persetujuan
          </div>
        )}
      </div>

      {note && (
        <div className="mt-4 ml-16 bg-white rounded-xl px-4 py-3 text-sm italic text-gray-500 border border-gray-100">
          "{note}"
        </div>
      )}

      {action && <div className="mt-5 ml-16">{action}</div>}
    </div>
  );
}

export default function Step3() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <ShieldCheck size={18} className="text-cyan-500" />
              Persetujuan Review Internal
            </div>
            <span className="bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full text-[11px] font-semibold border border-cyan-100">
              1 dari 2 menyetujui
            </span>
          </div>

          <div className="p-6 space-y-5">
            <div className="bg-slate-50/70 rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-500 font-medium mb-2">Nilai Penawaran yang Direview</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-[20px] font-bold text-slate-800">Rp 485.000.000</span>
                    <span className="px-3 py-1 bg-cyan-50 text-cyan-600 text-xs font-semibold rounded-full border border-cyan-100">
                      PAC Montair
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">PT ABC Indonesia — Gedung Pusat Lt. 5, Jakarta Selatan</p>
                </div>
                <button className="text-slate-400 hover:text-slate-500">
                  <ChevronDown size={18} />
                </button>
              </div>
            </div>

            <ApprovalCard
              initials="AD"
              title="Admin Direktur"
              name="Intan"
              status="approved"
              note="BoQ sudah sesuai standar. Approve."
            />

            <ApprovalCard
              initials="MO"
              title="Manager Operasional"
              name="Septiana"
              status="waiting"
              action={
                <div className="flex items-center gap-3">
                  <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm">
                    Setujui & Lanjut
                  </button>
                  <button className="bg-white border border-amber-200 text-amber-500 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors">
                    Revisi
                  </button>
                </div>
              }
            />
          </div>
        </div>

        <div className="pt-2 space-y-6">
          <SectionHeading title="Dokumen" />

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
