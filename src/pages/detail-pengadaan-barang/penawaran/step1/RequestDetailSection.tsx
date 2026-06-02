// RequestDetailSection.tsx — Full Final

import React, { useState } from "react";
import { FileText, Pencil } from "lucide-react";
import type { PermintaanMasukDetail } from "@/services/penawaran.services";
import type { TrackingPenawaranDetail } from "@/services/penawaran.services";
import { useUpdateDetailPenawaran } from "@/hooks/use-penawaran";
import type { Mode } from "./index";

const JENIS_LABEL: Record<string, string> = {
  PAC_MONTAIR: "PAC Montair",
  GENERATOR: "Generator",
  FIRE_PRO: "Fire Pro",
  CONVENTIONAL_SYS: "Conventional Sys",
  ADDRESSABLE_SYS: "Addressable Sys",
  STAND_ALONE_BTA: "Stand Alone BTA",
  BATTERY: "Battery",
  CHILLER: "Chiller",
  UPS: "UPS",
  AC_SPLIT_STANDING: "AC Split Standing",
};

// ── DetailField ───────────────────────────────────────────────────────────────

function DetailField({
  label,
  value,
  badges,
  strong = true,
  editing = false,
  inputValue,
  onInputChange,
}: {
  label: string;
  value?: string;
  badges?: string[];
  strong?: boolean;
  editing?: boolean;
  inputValue?: string;
  onInputChange?: (val: string) => void;
}) {
  return (
    <div className="bg-slate-50/70 rounded-xl border border-gray-100 p-4 min-h-[88px]">
      <p className="text-[11px] text-gray-400 font-bold mb-2 uppercase tracking-tight">
        {label}
      </p>
      {editing && onInputChange ? (
        <input
          value={inputValue ?? ""}
          onChange={(e) => onInputChange(e.target.value)}
          className="w-full bg-white border border-cyan-300 rounded-lg px-3 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
        />
      ) : badges ? (
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
        <p
          className={`text-lg leading-snug ${
            strong ? "font-bold text-slate-800" : "font-medium text-slate-700"
          }`}
        >
          {value ?? "-"}
        </p>
      )}
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface RequestDetailSectionProps {
  mode: Mode;
  trackingId: string;
  data?: PermintaanMasukDetail;
  tracking?: TrackingPenawaranDetail;
  onRevisiClick: () => void;
  canUpdateStatus: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function RequestDetailSection({
  trackingId,
  tracking,
}: RequestDetailSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateDetail, isPending: isSaving } =
    useUpdateDetailPenawaran(trackingId);

  // Form state — diisi dari data tracking
  const [form, setForm] = useState({
    customerName: tracking?.customerName ?? "",
    customerPhone: tracking?.customerPhone ?? "",
    customerEmail: tracking?.customerEmail ?? "",
    lokasiProyek: tracking?.lokasiProyek ?? "",
  });

  // Sync form kalau data berubah (misal setelah refetch)
  React.useEffect(() => {
    if (tracking) {
      setForm({
        customerName: tracking.customerName ?? "",
        customerPhone: tracking.customerPhone ?? "",
        customerEmail: tracking.customerEmail ?? "",
        lokasiProyek: tracking.lokasiProyek ?? "",
      });
    }
  }, [tracking]);

  function handleEdit() {
    setIsEditing(true);
  }

  function handleCancel() {
    // Reset ke data asal
    setForm({
      customerName: tracking?.customerName ?? "",
      customerPhone: tracking?.customerPhone ?? "",
      customerEmail: tracking?.customerEmail ?? "",
      lokasiProyek: tracking?.lokasiProyek ?? "",
    });
    setIsEditing(false);
  }

  async function handleSave() {
    updateDetail(form, {
      onSuccess: () => setIsEditing(false),
    });
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100/80 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FileText size={16} className="text-cyan-500" />
          Detail Permintaan Masuk
        </div>
        {!isEditing && (
          <button
            onClick={handleEdit}
            className="flex items-center gap-1.5 text-xs text-cyan-600 font-bold hover:underline"
          >
            <Pencil size={13} /> Edit
          </button>
        )}
      </div>

      {/* Fields */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <DetailField
          label="Nomor Penawaran"
          value={tracking?.nomorPenawaran ? `#${tracking.nomorPenawaran}` : "-"}
          // Nomor penawaran tidak bisa diedit
        />
        <DetailField
          label="Customer Name"
          value={tracking?.customerName}
          editing={isEditing}
          inputValue={form.customerName}
          onInputChange={(val) =>
            setForm((prev) => ({ ...prev, customerName: val }))
          }
        />
        <DetailField
          label="Customer Phone Number"
          value={tracking?.customerPhone}
          editing={isEditing}
          inputValue={form.customerPhone}
          onInputChange={(val) =>
            setForm((prev) => ({ ...prev, customerPhone: val }))
          }
        />
        <DetailField
          label="Customer E-Mail"
          value={tracking?.customerEmail}
          strong={false}
          editing={isEditing}
          inputValue={form.customerEmail}
          onInputChange={(val) =>
            setForm((prev) => ({ ...prev, customerEmail: val }))
          }
        />
        <DetailField
          label="Lokasi Proyek"
          value={tracking?.lokasiProyek}
          strong={false}
          editing={isEditing}
          inputValue={form.lokasiProyek}
          onInputChange={(val) =>
            setForm((prev) => ({ ...prev, lokasiProyek: val }))
          }
        />
        <DetailField
          label="Jenis Penawaran"
          badges={
            tracking?.jenisPenawaran
              ? tracking.jenisPenawaran.map((j) => JENIS_LABEL[j] ?? j)
              : []
          }
          // Jenis penawaran tidak diedit di sini
        />
      </div>

      {/* Footer */}
      {isEditing ? (
        <div className="px-6 py-5 border-t border-gray-100/80 flex items-center gap-3">
          <button
            onClick={handleCancel}
            className="px-4 py-2 text-sm text-slate-600 border border-gray-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 text-sm bg-cyan-500 text-white rounded-xl hover:bg-cyan-600 transition-colors font-semibold disabled:opacity-50 shadow-sm"
          >
            {isSaving ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      ) : null}
    </div>
  );
}
