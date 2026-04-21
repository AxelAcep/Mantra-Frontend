import React, { useState } from 'react';
import {
  User,
  FileText,
  Clock3,
  Send,
  Upload,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { DocumentItem, type LogEntry, LogSection } from './components';

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

function InfoCard({
  title,
  name,
  sub,
  initials,
  icon,
}: {
  title: string;
  name: string;
  sub: string;
  initials: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-[11px] uppercase tracking-tight mb-5">
        <span className="text-cyan-500">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-base shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800 leading-tight">{name}</p>
          <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-tight">{sub}</p>
        </div>
      </div>
    </div>
  );
}

function AssignCard({ icon }: { icon: React.ReactNode }) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-[11px] uppercase tracking-tight mb-5">
        <span className="text-cyan-500">{icon}</span>
        <span>Pembuat Penawaran</span>
      </div>
      <div className="flex items-center gap-3">
        <select className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500">
          <option>Pilih Pre-Sales</option>
          <option>Andi Pratama</option>
          <option>Dian Permata</option>
        </select>
        <button className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-xl px-8 py-3 text-sm shadow-sm transition-colors">
          Simpan
        </button>
      </div>
    </div>
  );
}

function WorkTimeCard() {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-[11px] uppercase tracking-tight">
          <Clock3 size={16} className="text-cyan-500" />
          <span>Waktu Pengerjaan</span>
        </div>
        <span className="text-[11px] bg-amber-50 text-amber-500 px-3 py-1 rounded-full font-bold uppercase tracking-tight">
          Proses
        </span>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm font-bold text-slate-800">
          <span className="text-gray-400 font-medium text-xs">Sisa waktu: 6 jam</span>
          <span className="text-lg">38%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-amber-400 rounded-full w-[38%]" />
        </div>
        <p className="text-sm text-gray-400 font-medium pt-1">Batas waktu: 17:00 WIB (hari ini)</p>
      </div>
    </div>
  );
}

function DetailField({
  label,
  value,
  badges,
  strong = true,
}: {
  label: string;
  value?: string;
  badges?: string[];
  strong?: boolean;
}) {
  return (
    <div className="bg-slate-50/70 rounded-xl border border-gray-100 p-4 min-h-[88px]">
      <p className="text-[11px] text-gray-400 font-bold mb-2 uppercase tracking-tight">{label}</p>
      {badges ? (
        <div className="flex flex-wrap gap-2">
          {badges.map((badge) => (
            <span
              key={badge}
              className="px-3 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded-full border border-cyan-100"
            >
              {badge}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-lg font-bold text-slate-800 leading-snug">
          {value}
        </p>
      )}
    </div>
  );
}

const documentItems = [
  { name: "BoQ_Draft_v2.pdf", size: "Dimas • 12 Feb, 10:30", path: "./BoQ_Draft_v2.pdf", allowDelete: true },
  { name: "List Barang.xlsx", size: "Rudi H. • 11 Feb, 16:45", path: "./List-Barang.xlsx" },
  { name: "Spesifikasi_Teknis.docx", size: "Febri • 10 Feb, 09:00", path: "./Spesifikasi-Teknis.docx" },
  { name: "Screenshot Permintaan Masuk.png", size: "Intan • 10 Feb, 09:00", path: "./Screenshot-Permintaan-Masuk.png" },
];

export default function Step1({ mode }: { mode: string }) {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, user: "Upload Dokumen", action: "Rudi H. mengunggah file Material_List_Raw.xlsx.", time: "16:45", date: "HARI INI", type: 'system' },
    { id: 2, user: "Tugas Dimulai", action: "Estimator mulai mengerjakan perhitungan.", time: "09:00", date: "HARI INI", type: 'system' },
    { id: 3, user: "Penugasan PIC", action: "Rudi Hartono ditugaskan sebagai PIC Estimator.", time: "08:30", date: "HARI INI", type: 'system' },
    { id: 4, user: "Upload Dokumen", action: "Rudi H. mengunggah file Material_List_Raw.xlsx.", time: "16:45", date: "KEMARIN", type: 'system' },
    { id: 5, user: "Tugas Dimulai", action: "Estimator mulai mengerjakan perhitungan.", time: "09:00", date: "KEMARIN", type: 'system' },
    { id: 6, user: "Penugasan PIC", action: "Rudi Hartono ditugaskan sebagai PIC Estimator.", time: "08:30", date: "KEMARIN", type: 'system' },
  ]);
  const [note, setNote] = useState("");

  const handleSendLog = () => {
    if (!note.trim()) return;
    const newLog: LogEntry = {
      id: Date.now(),
      user: "Komentar Sales",
      action: note,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "HARI INI",
      type: 'comment',
    };
    setLogs([newLog, ...logs]);
    setNote("");
  };

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
          <InfoCard
            icon={<User size={16} />}
            title="PIC Request"
            name="Rudi Hartono"
            sub="Sales"
            initials="RH"
          />

          {mode === "sales" ? (
            <InfoCard
              icon={<User size={16} />}
              title="Pembuat Penawaran"
              name="Dian Permata"
              sub="Pre-Sales"
              initials="DP"
            />
          ) : (
            <AssignCard icon={<User size={16} />} />
          )}

          <WorkTimeCard />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100/80 flex items-center gap-2 font-bold text-slate-800 text-sm">
            <FileText size={16} className="text-cyan-500" />
            Detail Permintaan Masuk
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            <DetailField label="Nomor Penawaran" value="#PNW-2025-0142" />
            <DetailField label="Customer Name" value="Alex Christine" />
            <DetailField label="Customer Phone Number" value="08961234633" />
            <DetailField label="Customer E-Mail" value="user@gmail.com" strong={false} />
            <DetailField label="Lokasi Proyek" value="Gedung Pusat Lt. 5, Jakarta Selatan" strong={false} />
            <DetailField label="Jenis Penawaran" badges={["PAC Montair", "Conventional Sys"]} strong={false} />
          </div>

          <div className="px-6 py-5 border-t border-gray-100/80">
            <button className="px-4 py-2 bg-amber-50 text-amber-500 text-sm font-semibold rounded-xl border border-amber-100 hover:bg-amber-100 transition-colors">
              Revisi
            </button>
          </div>
        </div>

        <div className="pt-2">
          <SectionHeading title="Dokumen" />
          <div className="mb-4" />

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
                    <p className="text-lg font-bold text-slate-800">Permintaan Masuk oleh Consumer PT. ABC</p>
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
            <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
              </div>
              <button className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline">
                <Upload size={14} /> Upload File
              </button>
            </div>

            <div className="p-4 space-y-1">
              {documentItems.map((item) => (
                <DocumentItem
                  key={item.name}
                  name={item.name}
                  size={item.size}
                  path={item.path}
                  allowDelete={item.allowDelete}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-base">Log Aktivitas</h3>
            <button className="flex items-center gap-2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold relative hover:bg-cyan-600 transition-all shadow-sm active:scale-95">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Chat
              <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm font-bold">2</span>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin">
            <LogSection title="23 Okt 2025" items={logs.filter((l) => l.date === "HARI INI")} />
            <LogSection title="Kemarin" items={logs.filter((l) => l.date === "KEMARIN")} />
          </div>
        </div>
      </div>
    </div>
  );
}
