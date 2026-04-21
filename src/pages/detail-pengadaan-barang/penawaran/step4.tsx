import React from 'react';
import { FileText, CheckCircle2, Upload, Clock, ShieldCheck, Download, ChevronDown } from 'lucide-react';
import { DocumentItem } from './components';

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

export default function Step4() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        {/* Persetujuan Manajemen */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
              <ShieldCheck size={18} className="text-cyan-500" />
              Persetujuan Manajemen
            </div>
            <span className="bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full text-[10px] font-bold border border-cyan-100">
              2 dari 3 menyetujui
            </span>
          </div>

          <div className="p-6">
            <div className="bg-slate-50 p-4 border border-gray-100 rounded-xl mb-6">
              <p className="text-xs text-gray-600">
                Dokumen penawaran telah melewati tahap Review Internal dan kini menunggu persetujuan dari <span className="font-bold text-slate-800">Direktur Utama</span> untuk melanjutkan ke proses Follow Up.
              </p>
            </div>

            {/* Direktur Utama */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                  DR
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Direktur Utama</p>
                  <p className="text-[11px] text-gray-400">Budi Santoso, S.E., M.M.</p>
                </div>
              </div>
              <div className="flex items-center gap-1 text-yellow-500 text-[10px] font-bold">
                <Clock size={12} /> Menunggu Persetujuan
              </div>
            </div>

            {/* Riwayat Persetujuan Sebelumnya */}
            <div className="bg-slate-50 p-4 border border-gray-100 rounded-xl">
              <p className="text-xs text-gray-400 mb-3">Riwayat Persetujuan Sebelumnya</p>
              
              <div className="flex justify-between items-center py-2 border-b border-white space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={12} />
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Admin Direktur <span className="text-gray-400 font-normal">— Intan</span></p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  14 Feb, 09:30 <ChevronDown size={14} />
                </div>
              </div>

              <div className="flex justify-between items-center py-2 pt-3">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                    <CheckCircle2 size={12} />
                  </div>
                  <p className="text-xs text-slate-700 font-semibold">Manager Operasional <span className="text-gray-400 font-normal">— Septiana</span></p>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-gray-400">
                  14 Feb, 14:15 <ChevronDown size={14} />
                </div>
              </div>
            </div>

          </div>
        </div>

        <div className="pt-2">
          <SectionHeading title="Dokumen" />
          <div className="mb-4" />
          
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
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log (Right) */}
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
            {[
              { 
                date: "23 Okt 2025", 
                items: [
                  { title: "Upload Dokumen", desc: "Rudi H. mengunggah file Material_List_Raw.xlsx.", time: "16:45" },
                  { title: "Tugas Dimulai", desc: "Estimator mulai mengerjakan perhitungan.", time: "09:00" },
                  { title: "Penugasan PIC", desc: "Rudi Hartono ditugaskan sebagai PIC Estimator.", time: "08:30" }
                ]
              },
              { 
                date: "Kemarin", 
                items: [
                  { title: "Upload Dokumen", desc: "Rudi H. mengunggah file Material_List_Raw.xlsx.", time: "16:45" },
                  { title: "Tugas Dimulai", desc: "Estimator mulai mengerjakan perhitungan.", time: "09:00" },
                  { title: "Penugasan PIC", desc: "Rudi Hartono ditugaskan sebagai PIC Estimator.", time: "08:30" }
                ]
              },
              { 
                date: "Hari Ini", 
                items: [
                  { title: "BoQ Selesai (Draft)", desc: "Rudi Hartono menyelesaikan perhitungan awal.", time: "10:30" },
                  { title: "Masuk Review", desc: "Draft v2 dikirim untuk review internal tim engineering.", time: "11:00" }
                ]
              }
            ].map((section) => (
              <div key={section.date} className="space-y-4">
                <div className="flex">
                  <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{section.date}</p>
                </div>
                <div className="relative space-y-6 pl-5 ml-2.5 border-l-2 border-slate-50">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-[#94a3b8]">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                      </div>
                      <div className="flex justify-between items-start gap-4">
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-slate-800 leading-tight">{item.title}</p>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.desc}</p>
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
      </div>
    </div>
  );
}
