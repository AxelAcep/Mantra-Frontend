import React, { useState } from "react";
import { Settings, ArrowLeft, ArrowRight, ShieldCheck, Flame, X } from "lucide-react";
import {
  type KategoriGaransi,
  KATEGORI_GARANSI_LABELS,
  KATEGORI_GARANSI_JUMLAH,
} from "@/services/garansi.service";

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

type KategoriOption = {
  id: KategoriGaransi;
  icon: React.ReactNode;
  color: string;
  borderColor: string;
};

const KATEGORI_OPTIONS: KategoriOption[] = [
  {
    id: "PAC_DALAM_KOTA",
    icon: <ShieldCheck size={20} />,
    color: "text-blue-600",
    borderColor: "border-blue-200 hover:border-blue-400",
  },
  {
    id: "FIRE_DALAM_KOTA",
    icon: <Flame size={20} />,
    color: "text-orange-600",
    borderColor: "border-orange-200 hover:border-orange-400",
  },
  {
    id: "PAC_LUAR_KOTA",
    icon: <ShieldCheck size={20} />,
    color: "text-blue-500",
    borderColor: "border-blue-100 hover:border-blue-300",
  },
  {
    id: "FIRE_LUAR_KOTA",
    icon: <Flame size={20} />,
    color: "text-orange-500",
    borderColor: "border-orange-100 hover:border-orange-300",
  },
  {
    id: "TIDAK_ADA",
    icon: <X size={20} />,
    color: "text-slate-500",
    borderColor: "border-slate-200 hover:border-slate-400",
  },
];

interface KonfigurasiGaransiCardProps {
  isSaving: boolean;
  onSubmit: (payload: {
    kategoriGaransi: KategoriGaransi;
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
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedKategori, setSelectedKategori] =
    useState<KategoriGaransi | null>(null);
  const [lamaTahun, setLamaTahun] = useState(1);
  const [bulanMulai, setBulanMulai] = useState(now.getMonth() + 1);
  const [tahunMulai, setTahunMulai] = useState(now.getFullYear());
  const [formError, setFormError] = useState<string | null>(null);

  const handleSelectKategori = (kategori: KategoriGaransi) => {
    if (kategori === "TIDAK_ADA") {
      setSelectedKategori(kategori);
      handleSubmitKategori(kategori);
    } else {
      setSelectedKategori(kategori);
      setStep(2);
    }
  };

  const handleSubmitKategori = async (kategori: KategoriGaransi) => {
    setFormError(null);
    try {
      await onSubmit({
        kategoriGaransi: kategori,
        lamaTahun: 1,
        bulanMulai: now.getMonth() + 1,
        tahunMulai: now.getFullYear(),
      });
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Gagal mengkonfigurasi garansi.",
      );
    }
  };

  const handleSubmitTimeline = async () => {
    setFormError(null);
    if (lamaTahun <= 0) {
      setFormError("Lama tahun garansi wajib diisi.");
      return;
    }
    if (!selectedKategori) return;
    try {
      await onSubmit({
        kategoriGaransi: selectedKategori,
        lamaTahun,
        bulanMulai,
        tahunMulai,
      });
    } catch (err) {
      setFormError(
        err instanceof Error
          ? err.message
          : "Gagal mengkonfigurasi timeline Garansi.",
      );
    }
  };

  const previewJumlah = (() => {
    if (!selectedKategori || selectedKategori === "TIDAK_ADA") return null;
    const map: Record<string, number> = {
      PAC_DALAM_KOTA: 12,
      PAC_LUAR_KOTA: 2,
      FIRE_DALAM_KOTA: 4,
      FIRE_LUAR_KOTA: 2,
    };
    const perTahun = map[selectedKategori] ?? 0;
    return perTahun * lamaTahun;
  })();

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
      <div className="flex items-center gap-2 mb-1 text-cyan-600">
        <Settings size={16} strokeWidth={2.5} />
        <h3 className="font-bold text-slate-800 text-sm">
          Konfigurasi Garansi
          {step === 2 && selectedKategori && (
            <span className="ml-2 text-xs font-normal text-slate-400">
              — {KATEGORI_GARANSI_LABELS[selectedKategori]}
            </span>
          )}
        </h3>
      </div>
      <p className="text-xs text-gray-400 mb-6">
        {step === 1
          ? "Pilih jenis garansi untuk pengadaan ini."
          : "atur lama garansi dan bulan mulai untuk membuat timeline kunjungan."}
      </p>

      {step === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
          {KATEGORI_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => handleSelectKategori(opt.id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all hover:shadow-md cursor-pointer ${opt.borderColor} ${
                selectedKategori === opt.id
                  ? "ring-2 ring-cyan-400"
                  : ""
              }`}
            >
              <div className={opt.color}>{opt.icon}</div>
              <span className="text-xs font-bold text-slate-700 text-center">
                {KATEGORI_GARANSI_LABELS[opt.id]}
              </span>
              <span className="text-[10px] text-slate-400 text-center">
                {KATEGORI_GARANSI_JUMLAH[opt.id]}
              </span>
            </button>
          ))}
        </div>
      )}

      {step === 2 && selectedKategori && (
        <>
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

          {previewJumlah !== null && (
            <p className="text-xs text-slate-500 mb-4">
              Preview:{" "}
              <span className="font-bold text-slate-700">
                {previewJumlah} kunjungan
              </span>{" "}
              ({KATEGORI_GARANSI_JUMLAH[selectedKategori]} × {lamaTahun} tahun)
            </p>
          )}
        </>
      )}

      {formError && (
        <p className="text-[11px] text-red-500 font-medium mb-3">
          {formError}
        </p>
      )}

      {step === 2 && (
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setStep(1);
              setSelectedKategori(null);
              setFormError(null);
            }}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all disabled:opacity-50"
          >
            <ArrowLeft size={14} />
            Kembali
          </button>
          <button
            onClick={handleSubmitTimeline}
            disabled={isSaving}
            className="flex items-center gap-1.5 bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan-600 transition-all shadow-sm active:scale-95 disabled:opacity-50"
          >
            {isSaving ? "Menyimpan..." : "Buat Timeline Garansi"}
            {!isSaving && <ArrowRight size={14} />}
          </button>
        </div>
      )}
    </div>
  );
}
