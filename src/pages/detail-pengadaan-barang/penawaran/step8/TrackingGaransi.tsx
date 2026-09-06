import React, { useState } from "react";
import { CalendarPlus, Pencil, X, Check } from "lucide-react";

export interface GaransiMonthItem {
  id: string;
  bulanKe: number;
  bulan: number;
  tahun: number;
  tanggalKunjungan?: string;
  status: string; // PENDING | ON_PROGRESS | DITERIMA
}

const NAMA_BULAN = [
  "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des",
];

function statusLabel(status: string) {
  if (status === "DITERIMA") return "Selesai";
  if (status === "ON_PROGRESS") return "Berjalan";
  return "Belum aktif";
}

function formatTanggal(dateStr?: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function toDateInputValue(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

interface MonthCardProps {
  month: GaransiMonthItem;
  isSaving: boolean;
  onSaveTanggal: (monthId: string, tanggal: string) => Promise<unknown>;
}

function MonthCard({ month, isSaving, onSaveTanggal }: MonthCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tanggal, setTanggal] = useState(
    toDateInputValue(month.tanggalKunjungan),
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  // Bisa diedit selama daily bulan ini masih berjalan (ON_PROGRESS) — begitu
  // daily disetujui selesai (status jadi DITERIMA), tanggal terkunci.
  const canEditTanggal = month.status === "ON_PROGRESS";

  const handleEditClick = () => {
    setTanggal(toDateInputValue(month.tanggalKunjungan));
    setSaveError(null);
    setIsEditing(true);
  };

  const handleSave = async () => {
    if (!tanggal) {
      setSaveError("Tanggal wajib diisi.");
      return;
    }
    setSaveError(null);
    try {
      await onSaveTanggal(month.id, tanggal);
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Gagal menyimpan tanggal.",
      );
    }
  };

  return (
    <div
      className={`rounded-xl border p-4 transition-all ${
        month.status === "DITERIMA"
          ? "bg-cyan-50/30 border-cyan-100/50"
          : month.status === "ON_PROGRESS"
            ? "bg-amber-50/30 border-amber-100/50"
            : "bg-slate-50/30 border-gray-100 opacity-60"
      }`}
    >
      <div className="flex justify-between items-start mb-3">
        <h5 className="font-bold text-slate-800 text-[11px]">
          Bulan ke-{month.bulanKe} ({NAMA_BULAN[month.bulan - 1]} {month.tahun}
          )
        </h5>
        <span
          className={`text-[9px] font-bold shrink-0 ${
            month.status === "DITERIMA"
              ? "text-cyan-500"
              : month.status === "ON_PROGRESS"
                ? "text-amber-500"
                : "text-gray-400"
          }`}
        >
          {statusLabel(month.status)}
        </span>
      </div>

      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <p className="text-[9px] text-gray-400 font-medium uppercase tracking-tight">
            Tanggal Kunjungan
          </p>
          {canEditTanggal && !isEditing && (
            <button
              onClick={handleEditClick}
              className="text-cyan-500 hover:text-cyan-600"
            >
              <Pencil size={11} />
            </button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-1.5 mt-1">
            <input
              type="date"
              value={tanggal}
              onChange={(e) => setTanggal(e.target.value)}
              className="w-full text-[10px] font-bold text-slate-800 border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300"
            />
            {saveError && (
              <p className="text-[9px] text-red-500 font-medium">
                {saveError}
              </p>
            )}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsEditing(false)}
                disabled={isSaving}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <X size={13} />
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="text-cyan-500 hover:text-cyan-600 disabled:opacity-50"
              >
                <Check size={13} />
              </button>
            </div>
          </div>
        ) : (
          <p className="text-[10px] font-bold text-slate-700 flex items-center gap-1">
            {month.tanggalKunjungan ? (
              formatTanggal(month.tanggalKunjungan)
            ) : (
              <span className="text-gray-400 font-medium flex items-center gap-1">
                <CalendarPlus size={11} /> Belum diisi
              </span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

interface TrackingGaransiSectionProps {
  picGaransi: string;
  periodeMulai: string;
  periodeAkhir: string;
  months: GaransiMonthItem[];
  updatingTanggal: boolean;
  onSaveTanggal: (monthId: string, tanggal: string) => Promise<unknown>;
}

export default function TrackingGaransiSection({
  picGaransi,
  periodeMulai,
  periodeAkhir,
  months,
  updatingTanggal,
  onSaveTanggal,
}: TrackingGaransiSectionProps) {
  const totalBulan = months.length;
  const bulanTerlaksana = months.filter(
    (m) => m.status === "DITERIMA" || m.status === "ON_PROGRESS",
  ).length;
  const progressPercent = totalBulan ? (bulanTerlaksana / totalBulan) * 100 : 0;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
      <h3 className="font-bold text-slate-800 text-sm mb-4">
        Tracking Garansi
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
            PIC Garansi
          </p>
          <p className="text-sm font-bold text-slate-800">
            {picGaransi || "-"}
          </p>
        </div>
        <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
            Periode Garansi
          </p>
          <p className="text-sm font-bold text-slate-800">
            {periodeMulai} - {periodeAkhir}
          </p>
        </div>
      </div>

      <div className="bg-white border border-gray-100 rounded-xl p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-slate-800 text-xs">
            Progress Kunjungan Garansi
          </h4>
          <p className="text-[10px] font-bold text-gray-400">
            {bulanTerlaksana} / {totalBulan} bulan
          </p>
        </div>
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-yellow-400 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[10px] text-gray-400 font-medium">
          {bulanTerlaksana} dari {totalBulan} kunjungan telah terlaksana atau
          sedang berjalan.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {months.map((month) => (
          <MonthCard
            key={month.id}
            month={month}
            isSaving={updatingTanggal}
            onSaveTanggal={onSaveTanggal}
          />
        ))}
      </div>
    </div>
  );
}
