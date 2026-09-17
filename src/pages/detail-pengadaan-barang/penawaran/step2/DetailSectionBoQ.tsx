/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Wallet, Clock3, ChevronDown, Save, Hash } from "lucide-react";
import type { Mode } from "../step1";
import { formatNomorPenawaran } from "@/lib/utils";

export interface FinancialSummary {
  estimasiHarga: number;
  harga1: number;
  harga2: number;
  harga3: number;
}

export interface WorkingTime {
  waktuMulai: string;
  targetSelesai: string;
  remainingHours: number;
  percentage: number;
  deadline: string;
  status: string;
}

interface DetailSectionBoQProps {
  financial?: FinancialSummary;
  workingTime?: WorkingTime;
  mode?: Mode;
  nomorPenawaran?: string;
  onSave?: (body: {
    harga1?: number;
    harga2?: number;
    harga3?: number;
  }) => void;
  onSaveNomorPenawaran?: (nomor: string) => void;
  isSaving?: boolean;
  isSavingNomor?: boolean;
  // PROPS BARU
  isFinanceEditable?: boolean;
  boqActivityStatus?: string;
  userDivisi?: string;
}

const ALLOWED_DIVISI = [
  "DIREKTUR",
  "KOMISARIS",
  "MANAGER_OPERASIONAL",
  "ADMIN_SEKERTARIAT",
];

function formatRupiah(value: number) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
}

export default function DetailSectionBoQ({
  financial,
  workingTime,
  nomorPenawaran: nomorPenawaran初始,
  onSave,
  onSaveNomorPenawaran,
  isSaving,
  isSavingNomor,
  isFinanceEditable: isFinanceEditableProp,
  boqActivityStatus,
  userDivisi,
}: DetailSectionBoQProps) {
  const [isFinancialExpanded, setIsFinancialExpanded] = useState(false);
  const [nomorPenawaran, setNomorPenawaran] = useState(nomorPenawaran初始 ?? "");
  const [isEditingNomor, setIsEditingNomor] = useState(false);

  // Tentukan apakah input finance bisa diedit
  const isBoQActivitySelesai =
    boqActivityStatus === "DITERIMA" || boqActivityStatus === "Selesai";

  const isAllowedDivisi = userDivisi
    ? ALLOWED_DIVISI.includes(userDivisi)
    : false;

  const isPresales = userDivisi === "PRESALES";

  // Finance editable hanya jika activity BoQ selesai DAN user divisi yang diizinkan
  const isFinanceEditable =
    isFinanceEditableProp ?? (isBoQActivitySelesai && isAllowedDivisi);

  console.log("=== DEBUG DetailSectionBoQ ===");
  console.log("boqActivityStatus:", boqActivityStatus);
  console.log("isBoQActivitySelesai:", isBoQActivitySelesai);
  console.log("userDivisi:", userDivisi);
  console.log("isAllowedDivisi:", isAllowedDivisi);
  console.log("ALLOWED_DIVISI:", ALLOWED_DIVISI);
  console.log("isFinanceEditableProp:", isFinanceEditableProp);
  console.log("isFinanceEditable (final):", isFinanceEditable);
  console.log("================================");

  const [harga1, setHarga1] = useState(financial?.harga1 ?? 0);
  const [harga2, setHarga2] = useState(financial?.harga2 ?? 0);
  const [harga3, setHarga3] = useState(financial?.harga3 ?? 0);

  useEffect(() => {
    setHarga1(financial?.harga1 ?? 0);
    setHarga2(financial?.harga2 ?? 0);
    setHarga3(financial?.harga3 ?? 0);
  }, [financial]);

  useEffect(() => {
    setNomorPenawaran(nomorPenawaran初始 ?? "");
  }, [nomorPenawaran初始]);

  const total = harga1 + harga2 + harga3;

  const fields = [
    {
      label: "Sub Total I (Barang)",
      value: harga1,
      setValue: setHarga1,
      key: "harga1",
    },
    {
      label: "Sub Total II (Instalasi)",
      value: harga2,
      setValue: setHarga2,
      key: "harga2",
    },
    {
      label: "Sub Total III (Jasa)",
      value: harga3,
      setValue: setHarga3,
      key: "harga3",
    },
  ];

  const statusColor = (() => {
    const s = workingTime?.status;
    if (
      s === "Selesai" ||
      s === "Diterima" ||
      s === "DITERIMA" ||
      s === "SELESAI"
    ) {
      return "bg-green-50 text-green-600";
    }
    if (s === "Overdue" || s === "OVERDUE") {
      return "bg-red-50 text-red-600";
    }
    return "bg-amber-50 text-amber-500";
  })();

  const isDone = (() => {
    const s = workingTime?.status?.toUpperCase();
    return s === "SELESAI" || s === "DITERIMA";
  })();
  const displayedPercentage = isDone ? 100 : (workingTime?.percentage ?? 0);
  const displayedRemaining = isDone ? 0 : (workingTime?.remainingHours ?? "-");

  return (
    <div className="space-y-4 lg:space-y-5">
      {/* Nomor Penawaran */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-[13px] tracking-tight">
            <Hash size={16} className="text-gray-500" />
            <span>Nomor Penawaran</span>
          </div>
          {isEditingNomor ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setNomorPenawaran(nomorPenawaran初始 ?? "");
                  setIsEditingNomor(false);
                }}
                className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  onSaveNomorPenawaran?.(nomorPenawaran);
                  setIsEditingNomor(false);
                }}
                disabled={isSavingNomor}
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-600 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
              >
                <Save size={12} />
                {isSavingNomor ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          ) : isPresales || isAllowedDivisi ? (
            <button
              onClick={() => {
                setNomorPenawaran(
                  formatNomorPenawaran(nomorPenawaran初始) === "-"
                    ? ""
                    : (nomorPenawaran初始 ?? ""),
                );
                setIsEditingNomor(true);
              }}
              className="px-3 py-1.5 text-xs text-cyan-600 font-bold hover:underline"
            >
              Ubah
            </button>
          ) : null}
        </div>
        <div className="mt-4">
          {isEditingNomor ? (
            <input
              type="text"
              value={nomorPenawaran}
              onChange={(e) => setNomorPenawaran(e.target.value)}
              placeholder="cth. PNW-2025-0142"
              className="w-full bg-slate-50/70 border border-cyan-300 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-400"
            />
          ) : (
            <div className="bg-slate-50/70 rounded-xl border border-gray-100 p-4">
              <p className="text-sm font-bold text-slate-800">
                {formatNomorPenawaran(nomorPenawaran)}
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
      {/* Ringkasan Finansial */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-[13px] tracking-tight">
            <Wallet size={16} className="text-gray-500" />
            <span>Ringkasan Finansial</span>
          </div>
          {isFinanceEditable && (
            <button
              onClick={() => onSave?.({ harga1, harga2, harga3 })}
              disabled={isSaving}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-cyan-500 hover:bg-cyan-600 px-3 py-1.5 rounded-lg disabled:opacity-50 transition-colors"
            >
              <Save size={12} />
              {isSaving ? "Menyimpan..." : "Simpan"}
            </button>
          )}
        </div>

        <div className="space-y-4">
          <button
            onClick={() => setIsFinancialExpanded(!isFinancialExpanded)}
            className={`w-full text-left transition-all rounded-xl border p-5 group ${isFinancialExpanded
              ? "bg-cyan-50/50 border-cyan-100 shadow-sm"
              : "bg-slate-50/50 border-gray-100 hover:bg-slate-50"
              }`}
          >
            <p
              className={`text-xs font-bold mb-2 uppercase tracking-tight transition-colors ${isFinancialExpanded ? "text-cyan-600" : "text-slate-400"
                }`}
            >
              Sub Total I + II + III
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`text-xl md:text-xl font-bold transition-colors ${isFinancialExpanded ? "text-cyan-700" : "text-slate-800"
                  }`}
              >
                {formatRupiah(total)}
              </span>
              <div
                className={`p-1 rounded-lg transition-all ${isFinancialExpanded
                  ? "bg-white/50 text-cyan-500 rotate-180"
                  : "text-slate-400"
                  }`}
              >
                <ChevronDown size={20} />
              </div>
            </div>
          </button>

          {isFinancialExpanded && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              {fields.map((item) => (
                <div
                  key={item.key}
                  className="bg-slate-50/80 rounded-xl border border-slate-100 p-4"
                >
                  <p className="text-[10px] text-slate-400 font-bold mb-1.5 uppercase tracking-wider">
                    {item.label}
                  </p>
                  {isFinanceEditable ? (
                    <input
                      type="text"
                      inputMode="numeric"
                      value={
                        item.value ? item.value.toLocaleString("id-ID") : ""
                      }
                      onChange={(e) => {
                        // hapus semua karakter selain angka
                        const raw = e.target.value.replace(/\D/g, "");
                        // hapus leading zero
                        const cleaned = raw.replace(/^0+(?=\d)/, "");
                        item.setValue(cleaned ? parseInt(cleaned, 10) : 0);
                      }}
                      className="w-full text-sm font-bold text-slate-700 bg-white border border-cyan-200 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                    />
                  ) : (
                    <p className="text-sm font-bold text-slate-700">
                      {formatRupiah(item.value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Waktu Pengerjaan */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
        <div className="flex justify-between items-center mb-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-[13px] tracking-tight">
            <Clock3 size={16} className="text-gray-500" />
            <span>Waktu Pengerjaan</span>
          </div>
          <span
            className={`text-[11px] px-3 py-1 rounded-full font-bold uppercase tracking-tight ${statusColor}`}
          >
            {workingTime?.status ?? "-"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 font-medium text-xs">
              Sisa waktu: {isDone ? "Selesai" : `${displayedRemaining} jam`}
            </span>
            <span className="text-sm font-bold text-slate-800">
              {displayedPercentage}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${isDone ? "bg-green-500" : "bg-yellow-400"}`}
              style={{ width: `${displayedPercentage}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 font-medium pt-1">
            Batas Waktu {workingTime?.deadline ?? "-"}
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
