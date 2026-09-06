import React, { useState } from "react";
import { Settings } from "lucide-react";

const BULAN_OPTIONS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Maret" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Juni" },
  { value: 7, label: "Juli" },
  { value: 8, label: "Agustus" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Desember" },
];

interface KonfigurasiGaransiCardProps {
  isSaving: boolean;
  onSubmit: (payload: {
    lamaTahun: number;
    bulanMulai: number;
    tahunMulai: number;
  }) => Promise<unknown>;
}

export default function KonfigurasiGaransiCard({
  isSaving,
  onSubmit,
}: KonfigurasiGaransiCardProps) {
  const now = new Date();
  const [lamaTahun, setLamaTahun] = useState(1);
  const [bulanMulai, setBulanMulai] = useState(now.getMonth() + 1);
  const [tahunMulai, setTahunMulai] = useState(now.getFullYear());
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setFormError(null);
    if (lamaTahun <= 0) {
      setFormError("Lama tahun garansi wajib diisi.");
      return;
    }
    try {
      await onSubmit({ lamaTahun, bulanMulai, tahunMulai });
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Gagal mengkonfigurasi timeline Garansi.",
      );
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center gap-2 mb-1 text-cyan-600">
        <Settings size={16} strokeWidth={2.5} />
        <h3 className="font-bold text-slate-800 text-sm">
          Konfigurasi Garansi
        </h3>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        BAST sudah selesai. Isi lama garansi dan bulan mulai untuk membuat
        timeline kunjungan garansi bulanan.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
            Lama Garansi (tahun)
          </label>
          <input
            type="number"
            min={1}
            value={lamaTahun}
            onChange={(e) => setLamaTahun(Number(e.target.value))}
            className="w-full text-sm font-bold text-slate-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
            Bulan Mulai
          </label>
          <select
            value={bulanMulai}
            onChange={(e) => setBulanMulai(Number(e.target.value))}
            className="w-full text-sm font-bold text-slate-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300"
          >
            {BULAN_OPTIONS.map((b) => (
              <option key={b.value} value={b.value}>
                {b.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
            Tahun Mulai
          </label>
          <input
            type="number"
            min={now.getFullYear() - 1}
            value={tahunMulai}
            onChange={(e) => setTahunMulai(Number(e.target.value))}
            className="w-full text-sm font-bold text-slate-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300"
          />
        </div>
      </div>

      {formError && (
        <p className="text-[11px] text-red-500 font-medium mb-3">
          {formError}
        </p>
      )}

      <button
        onClick={handleSubmit}
        disabled={isSaving}
        className="flex items-center gap-1.5 bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
      >
        {isSaving ? "Menyimpan..." : "Buat Timeline Garansi"}
      </button>
    </div>
  );
}
