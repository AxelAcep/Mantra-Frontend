import React, { useState } from 'react';
import { 
  ArrowLeft, FileText, Download, Upload, Send, 
  CheckCircle2, Clock, MapPin, Mail, Phone, User
} from 'lucide-react';

// --- Types ---
interface LogEntry {
  id: number;
  user: string;
  action: string;
  time: string;
  date: 'HARI INI' | 'KEMARIN';
  type: 'comment' | 'system' | 'success';
}

export default function PenawaranPage() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, user: "Komentar Sales", action: "Tolong pastikan spek AC sesuai request terbaru user (Inverter).", time: "13:45", date: "HARI INI", type: 'comment' },
    { id: 2, user: "Masuk Review", action: "Draft v2 dikirim untuk review internal tim engineering.", time: "11:00", date: "HARI INI", type: 'system' },
    { id: 3, user: "BoQ Selesai (Draft)", action: "Rudi Hartono menyelesaikan perhitungan awal.", time: "10:30", date: "HARI INI", type: 'success' },
  ]);
  const [note, setNote] = useState("");

  const handleSendLog = () => {
    if (!note.trim()) return;
    const newLog: LogEntry = {
      id: Date.now(),
      user: "Anda",
      action: note,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      date: "HARI INI",
      type: 'comment'
    };
    setLogs([newLog, ...logs]);
    setNote("");
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm">
              <ArrowLeft size={18} />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-slate-800">Tracking Penawaran</h1>
                <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded uppercase">PAC Montair</span>
                <span className="px-2 py-0.5 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded uppercase">#PNW-2025-0142</span>
              </div>
              <p className="text-xs text-gray-500">PT ABC Indonesia</p>
            </div>
          </div>
          <span className="px-4 py-1.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-full text-xs font-bold">
            Status: Dalam Proses
          </span>
        </div>

        {/* Stepper Section */}
        <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
           <div className="flex justify-between relative">
              {/* Line Background */}
              <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-100 -z-0" />
              {[
                { n: 1, label: "Permintaan Masuk", active: true },
                { n: 2, label: "Penyusunan BoQ" },
                { n: 3, label: "Review Internal" },
                { n: 4, label: "Persetujuan" },
                { n: 5, label: "Follow Up" },
                { n: 6, label: "PO Diterima" },
                { n: 7, label: "Implementasi" },
                { n: 8, label: "BAST" },
                { n: 9, label: "Garansi" },
              ].map((step, i) => (
                <div key={i} className="flex flex-col items-center gap-3 z-10">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4 ${
                    step.active ? "bg-white border-cyan-500 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]" : "bg-white border-gray-50 text-gray-300"
                  }`}>
                    {step.active ? <div className="w-2 h-2 bg-cyan-500 rounded-full" /> : step.n}
                  </div>
                  <span className={`text-[10px] font-bold text-center max-w-[80px] ${step.active ? "text-cyan-600" : "text-gray-300"}`}>
                    {step.label}
                  </span>
                </div>
              ))}
           </div>
        </div>

        <div className="grid grid-cols-12 gap-6">
          {/* Main Content (Left) */}
          <div className="col-span-12 lg:col-span-9 space-y-6">
            
            {/* Top Info Cards */}
            {/* Top Info Cards - Responsive Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-center">
              <InfoCard 
                icon={<User size={16}/>} 
                title="PIC Request" 
                name="Rudi Hartono" 
                sub="Sales" 
                initials="RH" 
              />
              <InfoCard 
                icon={<User size={16}/>} 
                title="Pembuat Penawaran" 
                name="Dian Permata" 
                sub="-" 
                initials="DP" 
              />
              
              {/* Card Waktu Pengerjaan - Span full di tablet (md) agar rapi */}
              <div className="col-span-1 md:col-span-2 lg:col-span-1 bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center gap-2 text-cyan-600 font-bold text-xs uppercase">
                    <Clock size={14} /> Waktu Pengerjaan
                  </div>
                  <span className="text-[10px] bg-green-50 text-green-600 px-2 py-0.5 rounded-full font-bold">On Track</span>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-bold">
                    <span className="text-gray-400 uppercase">Sisa waktu: 6 jam</span>
                    <span className="text-slate-700">38%</span>
                  </div>
                  <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-500 rounded-full w-[38%]" />
                  </div>
                  <p className="text-[9px] text-gray-400 mt-2 italic">Batas waktu: 17:00 WIB (hari ini)</p>
                </div>
              </div>
            </div>

            {/* Detail Section */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-50 flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FileText size={16} className="text-cyan-500" /> Detail Permintaan Masuk
              </div>
              <div className="grid grid-cols-3 gap-y-6 p-6 bg-gray-50/30">
                <DetailItem label="Nomor Penawaran" value="#PNW-2025-0142" bold />
                <DetailItem label="Customer Name" value="Alex Christine" />
                <DetailItem label="Customer Phone Number" value="08961234633" />
                <DetailItem label="Customer E-mail" value="user@gmail.com" />
                <DetailItem label="Lokasi Proyek" value="Gedung Pusat Lt. 5, Jakarta Selatan" />
                <DetailItem label="Jenis Penawaran" value="PAC Montair" isBadge />
              </div>
            </div>

            {/* Documents Section */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="p-4 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
                </div>
                <button className="text-cyan-500 text-xs font-bold flex items-center gap-1">
                  <Upload size={14} /> Upload File
                </button>
              </div>
              <div className="p-2 space-y-1">
                <DocumentItem name="BoQ_Draft_v2.pdf" size="12 Feb, 10:30" tag="Versi Terbaru" path="./BoQ_Draft_v2.pdf" />
                <DocumentItem name="Material_List_Raw.xlsx" size="11 Feb, 16:45" path="./Material_List_Raw.xlsx" />
                <DocumentItem name="Spesifikasi_Teknis.docx" size="10 Feb, 09:00" path="./Spesifikasi_Teknis.docx" />
              </div>
            </div>
          </div>

          {/* Activity Log (Right) */}
          <div className="col-span-12 lg:col-span-3">
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col">
              <div className="p-4 border-b border-gray-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  Log Aktivitas <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px]">2 baru</span>
                </h3>
                <button className="text-[10px] text-cyan-600 font-bold uppercase hover:underline">Tandai telah dibaca</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin">
                <LogSection title="HARI INI" items={logs.filter(l => l.date === "HARI INI")} />
                <LogSection title="KEMARIN" items={logs.filter(l => l.date === "KEMARIN")} />
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-gray-50 space-y-3">
                <textarea 
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Tulis catatan cepat..."
                  className="w-full p-3 text-xs bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none h-20"
                />
                <button 
                  onClick={handleSendLog}
                  className="w-full py-2 bg-white border border-gray-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Kirim Catatan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-2 bg-white border border-gray-200 text-cyan-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
            Sebelumnya
          </button>
          <button className="px-6 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200">
            Selanjutnya
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Sub-components ---

function InfoCard({ title, name, sub, initials, icon }: any) {
  return (
    <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-start gap-3">
      <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold text-xs shrink-0">
        {initials}
      </div>
      <div className="space-y-1">
        <p className="text-[10px] text-cyan-600 font-bold uppercase flex items-center gap-1">
          {icon} {title}
        </p>
        <p className="text-sm font-bold text-slate-800 leading-none">{name}</p>
        <p className="text-[10px] text-gray-400">{sub}</p>
      </div>
    </div>
  );
}

function DetailItem({ label, value, bold, isBadge }: any) {
  return (
    <div className="space-y-1">
      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{label}</p>
      {isBadge ? (
        <span className="inline-block px-3 py-1 bg-cyan-50 text-cyan-600 text-[10px] font-bold rounded">{value}</span>
      ) : (
        <p className={`text-xs ${bold ? "font-bold text-slate-800" : "text-slate-600 font-semibold"}`}>{value}</p>
      )}
    </div>
  );
}

function DocumentItem({ name, size, tag, path }: any) {
  return (
    <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
          <FileText size={18} />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="text-xs font-bold text-slate-700">{name}</p>
            {tag && <span className="bg-green-100 text-green-600 text-[8px] font-bold px-1.5 py-0.5 rounded">{tag}</span>}
          </div>
          <p className="text-[10px] text-gray-400">Diunggah oleh Rudi H. • {size}</p>
        </div>
      </div>
      <a href={path} download className="p-2 text-gray-300 hover:text-cyan-500 transition-colors">
        <Download size={18} />
      </a>
    </div>
  );
}

function LogSection({ title, items }: { title: string, items: LogEntry[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold text-gray-300 tracking-[2px]">{title}</p>
      <div className="relative space-y-6 pl-4 border-l border-gray-100">
        {items.map((log) => (
          <div key={log.id} className="relative">
            <div className={`absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center ${
              log.type === 'success' ? "bg-green-400" : log.type === 'system' ? "bg-slate-400" : "bg-blue-400"
            }`}>
              {log.type === 'success' && <CheckCircle2 size={8} className="text-white" />}
            </div>
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-800">{log.user} <span className="text-red-500">{log.type === 'comment' ? '●' : ''}</span></p>
                <p className="text-[10px] text-gray-500 leading-relaxed">{log.action}</p>
              </div>
              <span className="text-[9px] text-gray-300 font-medium shrink-0">{log.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}