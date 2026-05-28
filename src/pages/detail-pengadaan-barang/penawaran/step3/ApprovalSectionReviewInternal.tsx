import React, { useState } from "react";
import { ShieldCheck, ChevronDown, CheckCircle2, Clock3 } from "lucide-react";
import type { ReviewInternalResponse } from "@/services/review.internal.services";

interface Props {
  data: ReviewInternalResponse;
  canAdminAcc: boolean;
  canManajerAcc: boolean;
  canKonfirmasiUlang: boolean;
  isUpdating: boolean;
  onAcc: () => void;
  onPerluTindakan: (alasan: string) => void;
  onOnProgress: () => void;
}

function ApprovalCard({
  initials,
  title,
  name,
  approved,
  waiting,
  action,
}: {
  initials: string;
  title: string;
  name: string;
  approved: boolean;
  waiting: boolean;
  action?: React.ReactNode;
}) {
  return (
    <div className="bg-slate-50/70 rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
            {initials}
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{title}</p>
            <p className="text-sm text-gray-400 font-medium mt-1">{name}</p>
          </div>
        </div>
        {approved ? (
          <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-2 rounded-xl text-sm font-semibold">
            <CheckCircle2 size={14} /> Disetujui
          </span>
        ) : waiting ? (
          <div className="flex items-center gap-2 text-amber-500 text-sm font-semibold">
            <Clock3 size={14} /> Menunggu Persetujuan
          </div>
        ) : null}
      </div>
      {action && <div className="mt-5 ml-16">{action}</div>}
    </div>
  );
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
            onClick={() => {
              onConfirm(reason);
            }}
            className={`px-8 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${reason.trim() ? "bg-cyan-500 text-white hover:bg-cyan-600" : "bg-gray-100 text-gray-300 cursor-not-allowed"}`}
          >
            Konfirmasi
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ApprovalSectionReviewInternal({
  data,
  canAdminAcc,
  canManajerAcc,
  canKonfirmasiUlang,
  isUpdating,
  onAcc,
  onPerluTindakan,
  onOnProgress,
}: Props) {
  const [isFinancialExpanded, setIsFinancialExpanded] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const approvedCount =
    (data.accAdminDirektur ? 1 : 0) + (data.accManajerOps ? 1 : 0);
  const boq = data.trackingPenawaran;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <ShieldCheck size={18} className="text-cyan-500" />
            Persetujuan Review Internal
          </div>
          <span className="bg-cyan-50 text-cyan-600 px-3 py-1 rounded-full text-[11px] font-semibold border border-cyan-100">
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
                  className={`text-sm font-medium mb-2 transition-colors ${isFinancialExpanded ? "text-cyan-600" : "text-gray-500"}`}
                >
                  Nilai Penawaran yang Direview
                </p>
                <p
                  className={`text-[20px] font-bold transition-colors ${isFinancialExpanded ? "text-cyan-700" : "text-slate-800"}`}
                >
                  {boq?.perusahaan?.nama ?? "-"}
                </p>
                <p className="text-sm text-gray-500 mt-1">
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
          <ApprovalCard
            initials="AD"
            title="Admin Direktur"
            name="Admin Sekertariat"
            approved={data.accAdminDirektur}
            waiting={!data.accAdminDirektur}
            action={
              canAdminAcc ? (
                <div className="flex gap-3">
                  <button
                    onClick={onAcc}
                    disabled={isUpdating}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
                  >
                    {isUpdating ? "Memproses..." : "Setujui"}
                  </button>
                  <button
                    onClick={() => setShowRevisionModal(true)}
                    disabled={isUpdating}
                    className="bg-white border border-amber-200 text-amber-500 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors"
                  >
                    Perlu Tindakan
                  </button>
                </div>
              ) : undefined
            }
          />

          {/* Manajer Operasional */}
          <ApprovalCard
            initials="MO"
            title="Manager Operasional"
            name="Manajer Ops"
            approved={data.accManajerOps}
            waiting={!data.accManajerOps}
            action={
              canManajerAcc ? (
                <div className="flex gap-3">
                  <button
                    onClick={onAcc}
                    disabled={isUpdating}
                    className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
                  >
                    {isUpdating ? "Memproses..." : "Setujui"}
                  </button>
                  <button
                    onClick={() => setShowRevisionModal(true)}
                    disabled={isUpdating}
                    className="bg-white border border-amber-200 text-amber-500 px-6 py-3 rounded-xl text-sm font-semibold hover:bg-amber-50 transition-colors"
                  >
                    Perlu Tindakan
                  </button>
                </div>
              ) : canKonfirmasiUlang ? (
                <button
                  onClick={onOnProgress}
                  disabled={isUpdating}
                  className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors shadow-sm disabled:opacity-60"
                >
                  {isUpdating ? "Memproses..." : "Konfirmasi Ulang"}
                </button>
              ) : undefined
            }
          />
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
