import React, { useState } from "react";
import { Hash, Calendar, Pencil, X, Check } from "lucide-react";

interface DetailSectionBastProps {
  noReferensi: string;
  tanggalTerbit?: string;
  tanggalSerahTerima?: string;
  isSaving: boolean;
  onSave: (payload: {
    noReferensi?: string;
    tanggalTerbit?: string;
    tanggalSerahTerima?: string;
  }) => Promise<unknown>;
}

function formatTanggal(dateStr?: string) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// input type="date" butuh format YYYY-MM-DD
function toDateInputValue(dateStr?: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

export default function DetailSectionBast({
  noReferensi,
  tanggalTerbit,
  tanggalSerahTerima,
  isSaving,
  onSave,
}: DetailSectionBastProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formNoReferensi, setFormNoReferensi] = useState(noReferensi);
  const [formTanggalTerbit, setFormTanggalTerbit] = useState(
    toDateInputValue(tanggalTerbit),
  );
  const [formTanggalSerahTerima, setFormTanggalSerahTerima] = useState(
    toDateInputValue(tanggalSerahTerima),
  );
  const [saveError, setSaveError] = useState<string | null>(null);

  const handleEditClick = () => {
    setFormNoReferensi(noReferensi);
    setFormTanggalTerbit(toDateInputValue(tanggalTerbit));
    setFormTanggalSerahTerima(toDateInputValue(tanggalSerahTerima));
    setSaveError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setSaveError(null);
    setIsEditing(false);
  };

  const handleSave = async () => {
    setSaveError(null);
    try {
      await onSave({
        noReferensi: formNoReferensi,
        tanggalTerbit: formTanggalTerbit,
        tanggalSerahTerima: formTanggalSerahTerima,
      });
      setIsEditing(false);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Gagal menyimpan perubahan.",
      );
    }
  };

  return (
    <div className="mt-6">
      <div className="flex justify-end mb-3">
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="flex items-center gap-1.5 text-cyan-600 text-xs font-bold hover:underline"
          >
            <Pencil size={14} /> Edit
          </button>
        ) : (
          <div className="flex items-center gap-2">
            {saveError && (
              <p className="text-[11px] text-red-500 font-medium">
                {saveError}
              </p>
            )}
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-slate-500 text-xs font-bold hover:underline disabled:opacity-50"
            >
              <X size={14} /> Batal
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-1.5 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cyan-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
            >
              <Check size={14} /> {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-cyan-100 transition-all">
          <div className="flex items-center gap-2 mb-4 text-cyan-600">
            <Hash size={16} strokeWidth={2.5} />
            <p className="text-[10px] font-bold uppercase tracking-tight">
              No. Referensi
            </p>
          </div>
          {isEditing ? (
            <input
              type="text"
              value={formNoReferensi}
              onChange={(e) => setFormNoReferensi(e.target.value)}
              placeholder="BAST-XXXX-XXX"
              className="w-full text-lg font-bold text-slate-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300"
            />
          ) : (
            <h3 className="text-xl font-bold text-slate-800">
              {noReferensi || "-"}
            </h3>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-cyan-100 transition-all">
          <div className="flex items-center gap-2 mb-4 text-cyan-600">
            <Calendar size={16} strokeWidth={2.5} />
            <p className="text-[10px] font-bold uppercase tracking-tight">
              Tanggal Terbit
            </p>
          </div>
          {isEditing ? (
            <input
              type="date"
              value={formTanggalTerbit}
              onChange={(e) => setFormTanggalTerbit(e.target.value)}
              className="w-full text-base font-bold text-slate-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300"
            />
          ) : (
            <h3 className="text-xl font-bold text-slate-800">
              {formatTanggal(tanggalTerbit)}
            </h3>
          )}
        </div>

        <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm hover:border-cyan-100 transition-all">
          <div className="flex items-center gap-2 mb-4 text-cyan-600">
            <Calendar size={16} strokeWidth={2.5} />
            <p className="text-[10px] font-bold uppercase tracking-tight">
              Tanggal Serah Terima
            </p>
          </div>
          {isEditing ? (
            <input
              type="date"
              value={formTanggalSerahTerima}
              onChange={(e) => setFormTanggalSerahTerima(e.target.value)}
              className="w-full text-base font-bold text-slate-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300"
            />
          ) : (
            <h3 className="text-xl font-bold text-slate-800">
              {formatTanggal(tanggalSerahTerima)}
            </h3>
          )}
        </div>
      </div>
    </div>
  );
}
