import React, { useState } from "react";
import { ShieldCheck, CheckCircle2, Clock, ChevronDown } from "lucide-react";
import type { PersetujuanManajemenResponse } from "@/services/review.managemen.services";

interface Props {
  data: PersetujuanManajemenResponse;
  canAcc: boolean;
  canKonfirmasiUlang: boolean;
  isUpdating: boolean;
  onAcc: () => void;
  onPerluTindakan: (alasan: string) => void;
  onKonfirmasiUlang: () => void;
}

export default function ApprovalSectionPersetujuan({
  data,
  canAcc,
  canKonfirmasiUlang,
  isUpdating,
  onAcc,
  onPerluTindakan,
  onKonfirmasiUlang,
}: Props) {
  const [showTolakInput, setShowTolakInput] = useState(false);
  const [alasan, setAlasan] = useState("");

  const isSelesai = data.status === "SELESAI";
  const isPerluTindakan = data.status === "PERLU_TINDAKAN";

  const accLog = data.logAktivitas?.find(
    (log) => log.aksi === "Approve Direktur/Komisaris",
  );

  const totalAcc = data.accDirekturKomisaris ? 3 : 2;

  function handleTolakSubmit() {
    if (!alasan.trim()) return;
    onPerluTindakan(alasan.trim());
    setAlasan("");
    setShowTolakInput(false);
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <ShieldCheck size={18} className="text-cyan-500" />
          Persetujuan Manajemen
        </div>
        <span className="bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full text-[10px] font-bold border border-cyan-100">
          {totalAcc} dari 3 menyetujui
        </span>
      </div>

      <div className="p-6 space-y-6">
        {/* Info */}
        <div className="bg-slate-50 p-4 border border-gray-100 rounded-xl">
          <p className="text-xs text-gray-600">
            Dokumen penawaran telah melewati tahap Review Internal dan kini
            menunggu persetujuan dari{" "}
            <span className="font-bold text-slate-800">
              Direktur / Komisaris
            </span>{" "}
            untuk melanjutkan ke proses Follow Up.
          </p>
        </div>

        {/* Status Perlu Tindakan */}
        {isPerluTindakan && (
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-amber-700 mb-1">
              Perlu Tindakan
            </p>
            {(() => {
              const tolakLog = [...(data.logAktivitas ?? [])]
                .reverse()
                .find((l) => l.aksi.startsWith("Perlu Tindakan:"));
              return tolakLog ? (
                <p className="text-xs text-amber-600">{tolakLog.keterangan}</p>
              ) : null;
            })()}
          </div>
        )}

        {/* Direktur / Komisaris — pending atau sudah acc */}
        {!isSelesai && !isPerluTindakan && (
          <div className="bg-slate-50/70 p-5 rounded-2xl border border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-xs shrink-0">
                DK
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">
                  Direktur / Komisaris
                </p>
                <p className="text-[11px] text-gray-400">
                  Menunggu persetujuan
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-amber-500 text-[11px] font-bold">
              <Clock size={14} /> Menunggu
            </div>
          </div>
        )}

        {/* Action buttons */}
        {canAcc && !showTolakInput && (
          <div className="flex gap-3 justify-end">
            <button
              onClick={() => setShowTolakInput(true)}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-semibold border border-red-200 text-red-500 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              Tolak
            </button>
            <button
              onClick={onAcc}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Memproses..." : "Approve"}
            </button>
          </div>
        )}

        {/* Tolak input */}
        {showTolakInput && (
          <div className="space-y-3">
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Tuliskan alasan penolakan..."
              rows={3}
              className="w-full text-sm border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-200 resize-none"
            />
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => {
                  setShowTolakInput(false);
                  setAlasan("");
                }}
                className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleTolakSubmit}
                disabled={!alasan.trim() || isUpdating}
                className="px-4 py-2 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                {isUpdating ? "Memproses..." : "Kirim"}
              </button>
            </div>
          </div>
        )}

        {/* Konfirmasi Ulang */}
        {canKonfirmasiUlang && (
          <div className="flex justify-end">
            <button
              onClick={onKonfirmasiUlang}
              disabled={isUpdating}
              className="px-4 py-2 text-sm font-semibold bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
            >
              {isUpdating ? "Memproses..." : "Konfirmasi Ulang"}
            </button>
          </div>
        )}

        {/* Riwayat Persetujuan */}
        <div className="bg-slate-50 p-4 border border-gray-100 rounded-xl">
          <p className="text-xs text-gray-400 mb-3">Riwayat Persetujuan</p>

          {/* Hardcode: Admin Sekertariat */}
          <div className="flex justify-between items-center py-2 border-b border-white">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                <CheckCircle2 size={12} />
              </div>
              <p className="text-xs text-slate-700 font-semibold">
                Admin Sekertariat
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              Sudah Approve <ChevronDown size={14} />
            </div>
          </div>

          {/* Hardcode: Manager Operasional */}
          <div className="flex justify-between items-center py-2 border-b border-white">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                <CheckCircle2 size={12} />
              </div>
              <p className="text-xs text-slate-700 font-semibold">
                Manager Operasional
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              Sudah Approve <ChevronDown size={14} />
            </div>
          </div>

          {/* Direktur/Komisaris — dinamis */}
          <div className="flex justify-between items-center py-2 pt-3">
            <div className="flex items-center gap-2">
              {data.accDirekturKomisaris ? (
                <div className="w-4 h-4 rounded-full bg-green-50 flex items-center justify-center text-green-500">
                  <CheckCircle2 size={12} />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full bg-amber-50 flex items-center justify-center">
                  <Clock size={10} className="text-amber-400" />
                </div>
              )}
              <p className="text-xs text-slate-700 font-semibold">
                Direktur / Komisaris
                {accLog && (
                  <span className="text-gray-400 font-normal">
                    {" "}
                    — {accLog.namaPegawai}
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-gray-400">
              {data.accDirekturKomisaris ? "Approved" : "Menunggu"}
              <ChevronDown size={14} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
