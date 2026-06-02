/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react";
import { Wallet, Clock3, ChevronDown, Save } from "lucide-react";
import type { Mode } from "../step1";

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
  onSave?: (body: {
    harga1?: number;
    harga2?: number;
    harga3?: number;
  }) => void;
  isSaving?: boolean;
}

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
  mode,
  onSave,
  isSaving,
}: DetailSectionBoQProps) {
  const [isFinancialExpanded, setIsFinancialExpanded] = useState(false);
  const isEditable = mode === "presales" || mode === "master";

  const [harga1, setHarga1] = useState(financial?.harga1 ?? 0);
  const [harga2, setHarga2] = useState(financial?.harga2 ?? 0);
  const [harga3, setHarga3] = useState(financial?.harga3 ?? 0);

  useEffect(() => {
    setHarga1(financial?.harga1 ?? 0);
    setHarga2(financial?.harga2 ?? 0);
    setHarga3(financial?.harga3 ?? 0);
  }, [financial]);

  const total = harga1 + harga2 + harga3;

  const fields = [
    {
      label: "Sub Total I (Main Equipment)",
      value: harga1,
      setValue: setHarga1,
      key: "harga1",
    },
    {
      label: "Sub Total II (Material Instalasi)",
      value: harga2,
      setValue: setHarga2,
      key: "harga2",
    },
    {
      label: "Sub Total III (Biaya Jasa)",
      value: harga3,
      setValue: setHarga3,
      key: "harga3",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
      {/* Ringkasan Finansial */}
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Wallet size={16} className="text-cyan-500" />
            <span>Ringkasan Finansial</span>
          </div>
          {isEditable && (
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
            className={`w-full text-left transition-all rounded-xl border p-5 group ${
              isFinancialExpanded
                ? "bg-cyan-50/50 border-cyan-100 shadow-sm"
                : "bg-slate-50/50 border-gray-100 hover:bg-slate-50"
            }`}
          >
            <p
              className={`text-xs font-bold mb-2 uppercase tracking-tight transition-colors ${
                isFinancialExpanded ? "text-cyan-600" : "text-slate-400"
              }`}
            >
              Sub Total I + II + III
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`text-xl md:text-2xl font-bold transition-colors ${
                  isFinancialExpanded ? "text-cyan-700" : "text-slate-800"
                }`}
              >
                {formatRupiah(total)}
              </span>
              <div
                className={`p-1 rounded-lg transition-all ${
                  isFinancialExpanded
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
                  {isEditable ? (
                    <input
                      type="number"
                      value={item.value}
                      onChange={(e) =>
                        item.setValue(parseFloat(e.target.value) || 0)
                      }
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
          <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
            <Clock3 size={16} className="text-cyan-500" />
            <span>Waktu Pengerjaan</span>
          </div>
          <span className="text-[11px] bg-amber-50 text-amber-500 px-3 py-1 rounded-full font-bold">
            {workingTime?.status ?? "-"}
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-500 font-medium">
              Sisa waktu: {workingTime?.remainingHours ?? "-"} jam
            </span>
            <span className="text-slate-800 font-bold">
              {workingTime?.percentage ?? 0}%
            </span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-yellow-400 rounded-full"
              style={{ width: `${workingTime?.percentage ?? 0}%` }}
            />
          </div>
          <p className="text-sm text-gray-400 font-medium pt-1">
            Batas Waktu {workingTime?.deadline ?? "-"}
          </p>
        </div>
      </div>
    </div>
  );
}
