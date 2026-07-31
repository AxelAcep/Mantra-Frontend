import React from "react";
import { Pencil, Check, X } from "lucide-react";

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface OrderCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  tanggal?: string;
  canEdit: boolean;
  isEditing: boolean;
  editValue: string;
  onEditClick: () => void;
  onEditChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  emptyLabel?: string;
  inputType?: string;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function OrderCard({
  icon,
  label,
  value,
  tanggal,
  canEdit,
  isEditing,
  editValue,
  onEditClick,
  onEditChange,
  onSave,
  onCancel,
  emptyLabel = "Belum tersedia",
  inputType = "text",
}: OrderCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group hover:border-cyan-100 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-cyan-600">
          {icon}
          <p className="text-[10px] font-bold uppercase tracking-tight">
            {label}
          </p>
        </div>
        {canEdit && !isEditing && (
          <button
            onClick={onEditClick}
            className="text-gray-300 hover:text-cyan-500 transition-colors opacity-0 group-hover:opacity-100"
            title={`Edit ${label}`}
          >
            <Pencil size={13} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type={inputType}
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            autoFocus
            placeholder={`Masukkan ${label}...`}
            className="w-full text-sm font-bold text-slate-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-1 text-[10px] font-bold bg-cyan-500 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <Check size={11} /> Simpan
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X size={11} /> Batal
            </button>
          </div>
        </div>
      ) : value ? (
        <>
          <h3 className="text-lg font-bold text-slate-800 mb-1">{value}</h3>
          {tanggal && <p className="text-xs text-gray-400">{tanggal}</p>}
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold text-slate-400 mb-1">—</h3>
          <p className="text-xs text-gray-400">{emptyLabel}</p>
        </>
      )}
    </div>
  );
}
