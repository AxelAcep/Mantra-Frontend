import React from 'react';
import { FileText, CheckCircle2, Upload, Clock, ShieldCheck, Download, ChevronDown } from 'lucide-react';
import { DocumentItem } from './components';

export default function Step4() {
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <div className="flex items-center gap-2">
          <h1 className="font-bold text-xl">Detail</h1>
        </div>

        {/* Persetujuan Manajemen */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
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
          <h1 className="font-bold text-xl mb-4">Dokumen</h1>
          
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
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
            </div>
          </div>
        </div>
      </div>

      {/* Activity Log (Right) */}
      <div className="col-span-12 lg:col-span-3">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col">
          <div className="p-4 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-slate-800 text-sm">Log Aktivitas</h3>
            <button className="flex items-center gap-2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold relative hover:bg-cyan-600 transition-colors shadow-sm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
              Chat
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full shadow-[0_0_0_2px_#fff]">2</span>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-300 tracking-[2px] bg-gray-100 px-2 py-1 rounded inline-block text-gray-500">23 Okt 2025</p>
              <div className="relative space-y-6 pl-4 border-l border-gray-100">
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Upload Dokumen</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Rudi H. mengunggah file Material_List_Raw.xlsx.</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">16:45</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Tugas Dimulai</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Estimator mulai mengerjakan perhitungan.</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">09:00</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Penugasan PIC</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Rudi Hartono ditugaskan sebagai PIC Estimator.</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">08:30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-300 tracking-[2px] bg-gray-100 px-2 py-1 rounded inline-block text-gray-500">Kemarin</p>
              <div className="relative space-y-6 pl-4 border-l border-gray-100">
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Upload Dokumen</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Rudi H. mengunggah file Material_List_Raw.xlsx.</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">16:45</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Tugas Dimulai</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Estimator mulai mengerjakan perhitungan.</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">09:00</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Penugasan PIC</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Rudi Hartono ditugaskan sebagai PIC Estimator.</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">08:30</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <p className="text-[10px] font-bold text-gray-300 tracking-[2px] bg-gray-100 px-2 py-1 rounded inline-block text-gray-500">Hari Ini</p>
              <div className="relative space-y-6 pl-4 border-l border-gray-100">
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">BoQ Selesai (Draft)</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Rudi Hartono menyelesaikan perhitungan awal.</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">10:30</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center bg-slate-300"></div>
                  <div className="flex justify-between items-start gap-2">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800">Masuk Review</p>
                      <p className="text-[10px] text-gray-500 leading-relaxed">Draft v2 dikirim untuk review internal tim engineering.</p>
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium shrink-0">11:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
