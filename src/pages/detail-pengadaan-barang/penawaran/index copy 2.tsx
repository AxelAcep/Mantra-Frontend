import React, { useState } from 'react';
import {
  ArrowLeft, FileText, Download, Upload, Send,
  CheckCircle2, Clock, MapPin, Mail, Phone, User,
  ShieldOff, ThumbsUp, ThumbsDown, Eye, Lock
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

// --- Role Detection ---
function getUserRole(): string {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return user.divisi || "";
  } catch {
    return "";
  }
}

const ADMIN_ROLES = ["SEKERTARIAT", "DIREKTUR", "MANAGER_OPERASIONAL", "KOMISARIS"];

function detectMode(divisi: string): "sales" | "admin" | "forbidden" {
  if (divisi === "SALES") return "sales";
  if (ADMIN_ROLES.includes(divisi)) return "admin";
  return "forbidden";
}

// ============================================================
// MAIN PAGE
// ============================================================
export default function PenawaranPage() {
  // For demo: override divisi here or read from localStorage
  const [divisiOverride, setDivisiOverride] = useState<string>(() => getUserRole() || "SALES");
  const mode = detectMode(divisiOverride);

  return (
    <>
      {/* DEV ONLY: Role switcher for preview */}
      <DevRoleSwitcher divisi={divisiOverride} onChange={setDivisiOverride} />

      {mode === "sales" && <SalesView />}
      {mode === "admin" && <AdminView divisi={divisiOverride} />}
      {mode === "forbidden" && <ForbiddenView divisi={divisiOverride} />}
    </>
  );
}

// ============================================================
// DEV ROLE SWITCHER (remove in production)
// ============================================================
function DevRoleSwitcher({ divisi, onChange }: { divisi: string; onChange: (d: string) => void }) {
  const roles = ["SALES", "SEKERTARIAT", "DIREKTUR", "MANAGER_OPERASIONAL", "KOMISARIS", "FINANCE", "IT"];
  return (
    <div className="fixed bottom-4 right-4 z-50 bg-slate-900 text-white text-[10px] rounded-xl p-3 shadow-2xl space-y-2 border border-slate-700">
      <p className="font-bold text-slate-400 uppercase tracking-wider">Dev: Switch Role</p>
      <div className="flex flex-wrap gap-1.5 max-w-[220px]">
        {roles.map(r => (
          <button
            key={r}
            onClick={() => onChange(r)}
            className={`px-2 py-1 rounded font-bold transition-colors ${
              divisi === r ? "bg-cyan-500 text-white" : "bg-slate-700 text-slate-300 hover:bg-slate-600"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
}

// ============================================================
// SHARED: STEPPER
// ============================================================
const STEPS = [
  { n: 1, label: "Permintaan Masuk", active: true },
  { n: 2, label: "Penyusunan BoQ" },
  { n: 3, label: "Review Internal" },
  { n: 4, label: "Persetujuan" },
  { n: 5, label: "Follow Up" },
  { n: 6, label: "PO Diterima" },
  { n: 7, label: "Implementasi" },
  { n: 8, label: "BAST" },
  { n: 9, label: "Garansi" },
];

function Stepper() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm">
      <div className="flex justify-between relative">
        <div className="absolute top-4 left-0 w-full h-[2px] bg-gray-100 -z-0" />
        {STEPS.map((step, i) => (
          <div key={i} className="flex flex-col items-center gap-3 z-10">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border-4 ${
              step.active
                ? "bg-white border-cyan-500 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.3)]"
                : "bg-white border-gray-50 text-gray-300"
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
  );
}

// ============================================================
// SHARED: PAGE HEADER
// ============================================================
function PageHeader({ statusLabel, statusColor }: { statusLabel: string; statusColor: string }) {
  return (
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
      <span className={`px-4 py-1.5 ${statusColor} border rounded-full text-xs font-bold`}>
        {statusLabel}
      </span>
    </div>
  );
}

// ============================================================
// SHARED: ACTIVITY LOG PANEL
// ============================================================
function ActivityLog({
  logs,
  onSend,
  readonly = false,
}: {
  logs: LogEntry[];
  onSend?: (note: string) => void;
  readonly?: boolean;
}) {
  const [note, setNote] = useState("");

  const handleSend = () => {
    if (!note.trim() || !onSend) return;
    onSend(note);
    setNote("");
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col">
      <div className="p-4 border-b border-gray-50 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
          Log Aktivitas{" "}
          <span className="bg-red-100 text-red-600 px-1.5 py-0.5 rounded text-[10px]">2 baru</span>
        </h3>
        <button className="text-[10px] text-cyan-600 font-bold uppercase hover:underline">
          Tandai telah dibaca
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        <LogSection title="HARI INI" items={logs.filter((l) => l.date === "HARI INI")} />
        <LogSection title="KEMARIN" items={logs.filter((l) => l.date === "KEMARIN")} />
      </div>

      {!readonly && onSend && (
        <div className="p-4 border-t border-gray-50 space-y-3">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Tulis catatan cepat..."
            className="w-full p-3 text-xs bg-gray-50 border border-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-cyan-500 resize-none h-20"
          />
          <button
            onClick={handleSend}
            className="w-full py-2 bg-white border border-gray-200 text-slate-600 text-xs font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <Send size={14} /> Kirim Catatan
          </button>
        </div>
      )}

      {readonly && (
        <div className="p-4 border-t border-gray-50">
          <p className="text-[10px] text-gray-400 text-center flex items-center justify-center gap-1.5">
            <Lock size={10} /> Log hanya bisa ditambah oleh Sales
          </p>
        </div>
      )}
    </div>
  );
}

// ============================================================
// SALES VIEW
// ============================================================
function SalesView() {
  const [logs, setLogs] = useState<LogEntry[]>([
    { id: 1, user: "Komentar Sales", action: "Tolong pastikan spek AC sesuai request terbaru user (Inverter).", time: "13:45", date: "HARI INI", type: "comment" },
    { id: 2, user: "Masuk Review", action: "Draft v2 dikirim untuk review internal tim engineering.", time: "11:00", date: "HARI INI", type: "system" },
    { id: 3, user: "BoQ Selesai (Draft)", action: "Rudi Hartono menyelesaikan perhitungan awal.", time: "10:30", date: "HARI INI", type: "success" },
  ]);

  const handleSendLog = (note: string) => {
    setLogs([
      {
        id: Date.now(),
        user: "Anda",
        action: note,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: "HARI INI",
        type: "comment",
      },
      ...logs,
    ]);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <PageHeader statusLabel="Status: Dalam Proses" statusColor="bg-blue-50 text-blue-600 border-blue-100" />
        <Stepper />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-center">
              <InfoCard icon={<User size={16} />} title="PIC Request" name="Rudi Hartono" sub="Sales" initials="RH" />
              <InfoCard icon={<User size={16} />} title="Pembuat Penawaran" name="Dian Permata" sub="-" initials="DP" />
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

            {/* Detail */}
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

            {/* Documents — editable for Sales */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="p-4 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
                </div>
                <button className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:text-cyan-600 transition-colors">
                  <Upload size={14} /> Upload File
                </button>
              </div>
              <div className="p-2 space-y-1">
                <DocumentItem name="BoQ_Draft_v2.pdf" size="12 Feb, 10:30" tag="Versi Terbaru" path="./BoQ_Draft_v2.pdf" canDownload />
                <DocumentItem name="Material_List_Raw.xlsx" size="11 Feb, 16:45" path="./Material_List_Raw.xlsx" canDownload />
                <DocumentItem name="Spesifikasi_Teknis.docx" size="10 Feb, 09:00" path="./Spesifikasi_Teknis.docx" canDownload />
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="col-span-12 lg:col-span-3">
            <ActivityLog logs={logs} onSend={handleSendLog} readonly={false} />
          </div>
        </div>

        {/* Footer — Sales actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-2 bg-white border border-gray-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
            Simpan Draft
          </button>
          <button className="px-6 py-2 bg-cyan-500 text-white text-sm font-bold rounded-lg hover:bg-cyan-600 transition-colors shadow-lg shadow-cyan-200">
            Kirim ke Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// ADMIN VIEW (SEKERTARIAT / DIREKTUR / MO / KOMISARIS)
// ============================================================
function AdminView({ divisi }: { divisi: string }) {
  const [logs] = useState<LogEntry[]>([
    { id: 1, user: "Komentar Sales", action: "Tolong pastikan spek AC sesuai request terbaru user (Inverter).", time: "13:45", date: "HARI INI", type: "comment" },
    { id: 2, user: "Masuk Review", action: "Draft v2 dikirim untuk review internal tim engineering.", time: "11:00", date: "HARI INI", type: "system" },
    { id: 3, user: "BoQ Selesai (Draft)", action: "Rudi Hartono menyelesaikan perhitungan awal.", time: "10:30", date: "HARI INI", type: "success" },
  ]);

  const [approvalState, setApprovalState] = useState<"idle" | "approved" | "rejected">("idle");

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans">
      <div className="max-w-[1440px] mx-auto space-y-6">
        <PageHeader statusLabel="Status: Menunggu Review" statusColor="bg-amber-50 text-amber-600 border-amber-100" />

        {/* Role badge */}
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full uppercase tracking-wider">
            Mode: {divisi}
          </span>
          <span className="text-[10px] text-gray-400">— Anda melihat halaman ini sebagai reviewer</span>
        </div>

        <Stepper />

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9 space-y-6">
            {/* Info Cards — read-only */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 items-center">
              <InfoCard icon={<User size={16} />} title="PIC Request" name="Rudi Hartono" sub="Sales" initials="RH" />
              <InfoCard icon={<User size={16} />} title="Pembuat Penawaran" name="Dian Permata" sub="-" initials="DP" />
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

            {/* Detail — read-only, all fields shown */}
            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText size={16} className="text-cyan-500" /> Detail Permintaan Masuk
                </div>
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Eye size={12} /> Hanya Lihat
                </span>
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

            {/* Documents — download only, no upload */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
              <div className="p-4 flex justify-between items-center border-b border-gray-50">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
                </div>
                <span className="flex items-center gap-1 text-[10px] text-gray-400">
                  <Eye size={12} /> Hanya Lihat &amp; Download
                </span>
              </div>
              <div className="p-2 space-y-1">
                <DocumentItem name="BoQ_Draft_v2.pdf" size="12 Feb, 10:30" tag="Versi Terbaru" path="./BoQ_Draft_v2.pdf" canDownload />
                <DocumentItem name="Material_List_Raw.xlsx" size="11 Feb, 16:45" path="./Material_List_Raw.xlsx" canDownload />
                <DocumentItem name="Spesifikasi_Teknis.docx" size="10 Feb, 09:00" path="./Spesifikasi_Teknis.docx" canDownload />
              </div>
            </div>

            {/* Approval Panel */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-50 flex items-center gap-2 font-bold text-slate-800 text-sm">
                <CheckCircle2 size={16} className="text-cyan-500" /> Keputusan Review
              </div>
              <div className="p-6">
                {approvalState === "idle" && (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setApprovalState("approved")}
                      className="flex-1 py-3 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-100"
                    >
                      <ThumbsUp size={16} /> Setujui Penawaran
                    </button>
                    <button
                      onClick={() => setApprovalState("rejected")}
                      className="flex-1 py-3 bg-white border-2 border-red-200 text-red-500 text-sm font-bold rounded-xl hover:bg-red-50 transition-colors flex items-center justify-center gap-2"
                    >
                      <ThumbsDown size={16} /> Kembalikan / Tolak
                    </button>
                  </div>
                )}
                {approvalState === "approved" && (
                  <div className="flex items-center gap-3 p-4 bg-green-50 border border-green-100 rounded-xl">
                    <CheckCircle2 size={20} className="text-green-500 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-green-700">Penawaran Disetujui</p>
                      <p className="text-[11px] text-green-600">Anda telah menyetujui penawaran ini. Sales akan diberitahu.</p>
                    </div>
                    <button onClick={() => setApprovalState("idle")} className="ml-auto text-[10px] text-gray-400 hover:underline">Batalkan</button>
                  </div>
                )}
                {approvalState === "rejected" && (
                  <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
                    <ThumbsDown size={20} className="text-red-400 shrink-0" />
                    <div>
                      <p className="text-sm font-bold text-red-700">Penawaran Dikembalikan</p>
                      <p className="text-[11px] text-red-500">Sales akan diminta untuk merevisi dan mengirim ulang.</p>
                    </div>
                    <button onClick={() => setApprovalState("idle")} className="ml-auto text-[10px] text-gray-400 hover:underline">Batalkan</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Activity Log — readonly for admin */}
          <div className="col-span-12 lg:col-span-3">
            <ActivityLog logs={logs} readonly={true} />
          </div>
        </div>

        {/* Footer — Admin actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button className="px-6 py-2 bg-white border border-gray-200 text-slate-600 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors">
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

// ============================================================
// FORBIDDEN VIEW
// ============================================================
function ForbiddenView({ divisi }: { divisi: string }) {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans flex items-center justify-center">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mx-auto">
          <ShieldOff size={36} className="text-red-400" />
        </div>
        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-800">Akses Ditolak</h2>
          <p className="text-sm text-gray-500 leading-relaxed">
            Anda tidak memiliki akses untuk melihat halaman <span className="font-semibold text-slate-700">Tracking Penawaran</span>.
          </p>
          {divisi && (
            <p className="text-[11px] text-gray-400">
              Role Anda saat ini: <span className="font-bold text-slate-600 uppercase">{divisi}</span>
            </p>
          )}
        </div>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left space-y-2">
          <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Role yang diizinkan:</p>
          <div className="flex flex-wrap gap-1.5">
            {["SALES", "SEKERTARIAT", "DIREKTUR", "MANAGER_OPERASIONAL", "KOMISARIS"].map(r => (
              <span key={r} className="px-2 py-0.5 bg-white border border-gray-200 text-[10px] font-bold text-slate-600 rounded">
                {r}
              </span>
            ))}
          </div>
        </div>
        <button className="px-6 py-2.5 bg-white border border-gray-200 text-slate-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2 mx-auto">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </button>
      </div>
    </div>
  );
}

// ============================================================
// SUB-COMPONENTS (shared)
// ============================================================

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

function DocumentItem({ name, size, tag, path, canDownload }: any) {
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
      {canDownload && (
        <a href={path} download className="p-2 text-gray-300 hover:text-cyan-500 transition-colors">
          <Download size={18} />
        </a>
      )}
    </div>
  );
}

function LogSection({ title, items }: { title: string; items: LogEntry[] }) {
  if (items.length === 0) return null;
  return (
    <div className="space-y-4">
      <p className="text-[10px] font-bold text-gray-300 tracking-[2px]">{title}</p>
      <div className="relative space-y-6 pl-4 border-l border-gray-100">
        {items.map((log) => (
          <div key={log.id} className="relative">
            <div className={`absolute -left-[21px] top-0 w-[14px] h-[14px] rounded-full border-2 border-white flex items-center justify-center ${
              log.type === "success" ? "bg-green-400" : log.type === "system" ? "bg-slate-400" : "bg-blue-400"
            }`}>
              {log.type === "success" && <CheckCircle2 size={8} className="text-white" />}
            </div>
            <div className="flex justify-between items-start gap-2">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-800">
                  {log.user} <span className="text-red-500">{log.type === "comment" ? "●" : ""}</span>
                </p>
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