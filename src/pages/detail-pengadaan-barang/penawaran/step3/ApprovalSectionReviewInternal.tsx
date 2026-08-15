import React, { useState } from "react";
import {
  ShieldCheck,
  ChevronDown,
  CheckCircle2,
  Clock3,
  ExternalLink,
  XCircle,
} from "lucide-react";
import type { ReviewInternalResponse } from "@/services/review.internal.services";

interface Props {
  data: ReviewInternalResponse;
  canAdminAcc: boolean;
  canManajerAcc: boolean;
  canKonfirmasiUlang: boolean;
  isUpdating: boolean;
  adminDailySelesai: boolean;
  onAcc: () => void;
  onPerluTindakan: (alasan: string) => void;
  onOnProgress: () => void;
  onLihatDaily: () => void;
}

function RevisionInlineModal({
  onClose,
  onConfirm,
}: {
  onClose: () => void;
  onConfirm: (r: string) => void;
}) {
  const [reason, setReason] = useState("");
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
      <div className="bg-white rounded-[2rem] w-full max-w-lg shadow-2xl p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-1">
          Perlu Tindakan
        </h2>
        <p className="text-sm text-gray-400 font-medium mb-6">
          Berikan alasan agar Sales/Presales bisa merevisi.
        </p>
        <textarea
          autoFocus
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Tuliskan alasan..."
          className="w-full h-32 p-4 text-sm border border-gray-200 rounded-2xl resize-none focus:outline-none focus:border-cyan-500"
        />
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-6 py-3 text-sm font-bold text-gray-400 hover:text-slate-600"
          >
            Batal
          </button>
          <button
            disabled={!reason.trim()}
            onClick={() => onConfirm(reason)}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${reason.trim() ? "bg-cyan-500 text-white hover:bg-cyan-600" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}

function renderBadge(state: "DISETUJUI" | "MENUNGGU" | "DITOLAK") {
  if (state === "DISETUJUI") {
    return (
      <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
        <CheckCircle2 size={13} /> Disetujui
      </span>
    );
  }
  if (state === "DITOLAK") {
    return (
      <span className="flex items-center gap-1.5 bg-red-50 text-red-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
        <XCircle size={13} /> Ditolak
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1.5 bg-amber-50 text-amber-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
      <Clock3 size={13} /> Menunggu Persetujuan
    </span>
  );
}

export default function ApprovalSectionReviewInternal({
  data,
  onPerluTindakan,
  onLihatDaily,
}: Props) {
  const [isFinancialExpanded, setIsFinancialExpanded] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const adminDailyStatus = data.activityAdmin?.status;

  const adBadgeState = (() => {
    const s = adminDailyStatus?.toUpperCase();
    if (s === "DITERIMA" || s === "SELESAI") return "DISETUJUI";
    if (s === "DITOLAK") return "DITOLAK";
    return "MENUNGGU";
  })();

  const moBadgeState = (() => {
    const s = adminDailyStatus?.toUpperCase();
    if (s === "DITERIMA" || s === "SELESAI") return "DISETUJUI";
    return "MENUNGGU";
  })();

  const AccAdminDirektur = adBadgeState === "DISETUJUI";
  const AccManagerOperasinal = moBadgeState === "DISETUJUI";

  const approvedCount =
    (AccAdminDirektur ? 1 : 0) + (AccManagerOperasinal ? 1 : 0);
  const boq = data.trackingPenawaran;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-[13px] tracking-tight">
            <ShieldCheck size={16} className="text-gray-500" />
            Persetujuan Review Internal
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${approvedCount === 2
                ? "bg-green-50 text-green-600 border-green-100"
                : "bg-amber-50 text-amber-600 border-amber-100"
              }`}
          >
            {approvedCount} dari 2 menyetujui
          </span>
        </div>

        <div className="p-6 space-y-5">
          {/* Financial Summary */}
          <div
            onClick={() => setIsFinancialExpanded(!isFinancialExpanded)}
            className={`rounded-2xl border p-5 cursor-pointer transition-all ${isFinancialExpanded ? "bg-cyan-50/50 border-cyan-100 shadow-sm" : "bg-slate-50/70 border-gray-100 hover:bg-slate-50"}`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={`text-xs font-medium mb-1 transition-colors ${isFinancialExpanded ? "text-cyan-600" : "text-gray-400"}`}
                >
                  Nilai Penawaran yang Direview
                </p>
                <p
                  className={`text-base font-bold transition-colors ${isFinancialExpanded ? "text-cyan-700" : "text-slate-800"}`}
                >
                  {boq?.perusahaan?.nama ?? "-"}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {boq?.lokasiProyek ?? "-"}
                </p>
              </div>
              <div
                className={`p-1 rounded-lg transition-all ${isFinancialExpanded ? "text-cyan-500 rotate-180" : "text-slate-400"}`}
              >
                <ChevronDown size={20} />
              </div>
            </div>
            {isFinancialExpanded && (
              <div className="mt-4 text-sm text-slate-600 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                <p>
                  <span className="font-semibold">No. Penawaran:</span>{" "}
                  {boq?.nomorPenawaran ?? "-"}
                </p>
                <p>
                  <span className="font-semibold">Jenis:</span>{" "}
                  {boq?.jenisPenawaran?.join(", ") ?? "-"}
                </p>
                <p>
                  <span className="font-semibold">Customer:</span>{" "}
                  {boq?.customerName ?? "-"}
                </p>
              </div>
            )}
          </div>

          {/* Admin Direktur */}
          <div className="bg-slate-50/70 rounded-2xl border border-gray-100 p-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-base shrink-0">
                AD
              </div>

              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Admin Direktur
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      {data.activityAdmin?.pegawai?.nama || "Admin Sekertariat"}
                    </p>
                  </div>
                  {renderBadge(adBadgeState)}
                </div>

                {/* Info Daily */}
                {data.activityAdmin && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Daily: {data.activityAdmin.judul}
                    </span>
                    <button
                      onClick={onLihatDaily}
                      className="flex items-center gap-1 text-xs text-cyan-500 hover:text-cyan-600 font-medium"
                    >
                      <ExternalLink size={12} /> Lihat Detail
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* {canAdminAcc && (
    <div className="mt-5 ml-14 flex gap-3">
      <button
        onClick={onAcc}
        disabled={isUpdating}
        className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
      >
        {isUpdating ? "Memproses..." : "Setujui"}
      </button>
      <button
        onClick={() => {
          setRevisionTarget("admin");
          setShowRevisionModal(true);
        }}
        disabled={isUpdating}
        className="bg-white border border-amber-200 text-amber-500 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors"
      >
        Perlu Tindakan
      </button>
    </div>
  )} */}
          </div>

          {/* Manajer Operasional */}
          <div className="bg-slate-50/70 rounded-2xl border border-gray-100 p-5">
            <div className="flex gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-base shrink-0">
                MO
              </div>
              <div className="flex-1 flex flex-col gap-3">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Manager Operasional
                    </p>
                    <p className="text-xs text-gray-400 font-medium mt-0.5">
                      Manajer Ops
                    </p>
                  </div>
                  {renderBadge(moBadgeState)}
                </div>
              </div>
            </div>

            {/* {canManajerAcc && (
              <div className="mt-5 ml-14 flex gap-3">
                <button
                  onClick={onAcc}
                  disabled={isUpdating}
                  className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
                >
                  {isUpdating ? "Memproses..." : "Setujui"}
                </button>
                <button
                  onClick={() => {
                    setRevisionTarget("manajer");
                    setShowRevisionModal(true);
                  }}
                  disabled={isUpdating}
                  className="bg-white border border-amber-200 text-amber-500 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors"
                >
                  Perlu Tindakan
                </button>
              </div>
            )} */}

            {/* {canKonfirmasiUlang && !canManajerAcc && (
              <div className="mt-5 ml-14">
                <button
                  onClick={onOnProgress}
                  disabled={isUpdating}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
                >
                  {isUpdating ? "Memproses..." : "Konfirmasi Ulang"}
                </button>
              </div>
            )} */}
          </div>
        </div>
      </div>

      {showRevisionModal && (
        <RevisionInlineModal
          onClose={() => setShowRevisionModal(false)}
          onConfirm={(alasan) => {
            onPerluTindakan(alasan);
            setShowRevisionModal(false);
          }}
        />
      )}
    </>
  );
}
