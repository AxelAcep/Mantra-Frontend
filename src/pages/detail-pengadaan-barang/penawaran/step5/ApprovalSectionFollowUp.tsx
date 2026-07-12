import React from "react";
import { Clock3, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FollowUpStage {
  title: string;
  description: string;
  date: string;
  status: "active" | "locked" | "done";
}

interface ApprovalSectionFollowUpProps {
  stage: number;
  status: string;
  logs: { aksi: string; keterangan: string }[];
  customerName: string;
  salesName: string;
  isAdminSekertariat: boolean;
  isSalesPIC: boolean;
  isUpdating: boolean;
  onUpdateStage: (nextStage: number) => void;
  onUpdateStatus: (status: "ON_PROGRESS" | "KONFIRMASI_SELESAI" | "SELESAI" | "PERLU_TINDAKAN") => void;
}

export default function ApprovalSectionFollowUp({
  stage,
  status,
  logs,
  customerName,
  salesName,
  isAdminSekertariat,
  isSalesPIC,
  isUpdating,
  onUpdateStage,
  onUpdateStatus,
}: ApprovalSectionFollowUpProps) {
  // Map stages timeline representation
  const timelineStatus1 = stage === 1 ? "active" : stage > 1 ? "done" : "locked";
  const timelineStatus2 =
    stage === 2
      ? status === "KONFIRMASI_SELESAI"
        ? "done"
        : "active"
      : stage > 2
      ? "done"
      : "locked";
  const timelineStatus3 = stage === 3 ? "done" : "locked";

  const followUpStages: FollowUpStage[] = [
    {
      title: "Penawaran Terkirim ke Customer",
      description: `Menunggu pengiriman dokumen penawaran lengkap via email ke ${customerName} oleh Admin Sekretariat`,
      date: "",
      status: timelineStatus1,
    },
    {
      title: "Menunggu Feedback Customer",
      description: `Tugas Sales (${salesName}) untuk follow up ke customer dan menunggu feedback/PO`,
      date: "",
      status: timelineStatus2,
    },
    {
      title: "PO Diterima",
      description: "Feedback customer diterima dan disetujui oleh Manager Operasional",
      date: "",
      status: timelineStatus3,
    },
  ];

  // Get latest rejection reason
  const rejectionLog = [...(logs || [])]
    .reverse()
    .find((l) => l.aksi?.startsWith("Feedback Customer Perlu Tindakan"));
  const rejectionReason = rejectionLog?.keterangan || "Tidak ada alasan spesifik.";

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 flex items-center gap-2 font-bold text-slate-800 text-sm">
        <Clock3 size={16} className="text-cyan-500" />
        Status Follow Up
      </div>
      <div className="p-6 pt-4 space-y-6">
        <div className="bg-slate-50/70 rounded-xl border border-gray-100 p-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-5">Progress Komunikasi</p>
            <div className="space-y-5">
              {followUpStages.map((item, index) => {
                const isActive = item.status === "active";
                const isDone = item.status === "done";

                return (
                  <div key={item.title} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center ${
                          isActive
                            ? "bg-amber-50 border-amber-200 text-amber-500"
                            : isDone
                            ? "bg-green-50 border-green-200 text-green-500"
                            : "bg-slate-100 border-slate-200 text-slate-300"
                        }`}
                      >
                        {isDone ? <CheckCircle2 size={14} /> : <Clock3 size={14} />}
                      </div>
                      {index < followUpStages.length - 1 && (
                        <div className="w-px flex-1 min-h-[34px] bg-gray-200 mt-2" />
                      )}
                    </div>

                    <div className="pt-1">
                      <p className={`text-base font-bold ${isActive || isDone ? "text-slate-800" : "text-slate-300"}`}>
                        {item.title}
                      </p>
                      <p className={`text-sm mt-1 ${isActive || isDone ? "text-gray-500" : "text-slate-300"}`}>
                        {item.description}
                      </p>
                      {item.date && (
                        <p className="text-sm text-gray-400 mt-2 font-medium">{item.date}</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Action Button Section */}
        {stage === 1 && isAdminSekertariat && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-amber-50/50 border border-amber-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">Persetujuan Kirim Penawaran</h4>
                <p className="text-xs text-amber-700 font-medium mt-0.5">
                  Tugas pengiriman dokumen penawaran oleh Admin Sekretariat. Silakan klik tombol jika email penawaran sudah terkirim ke klien.
                </p>
              </div>
            </div>
            <Button
              onClick={() => onUpdateStage(2)}
              disabled={isUpdating}
              className="bg-amber-500 hover:bg-amber-600 font-bold shrink-0 shadow-sm"
            >
              {isUpdating ? "Memproses..." : "Tandai Penawaran Terkirim"}
            </Button>
          </div>
        )}

        {stage === 2 && status === "ON_PROGRESS" && isSalesPIC && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-cyan-50/50 border border-cyan-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-cyan-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-cyan-800 text-sm">Menunggu Feedback & Negosiasi</h4>
                <p className="text-xs text-cyan-700 font-medium mt-0.5">
                  Lakukan follow up ke customer untuk mendapatkan feedback / persetujuan PO. Setelah PO diterima atau disetujui, klik tombol di sebelah kanan.
                </p>
              </div>
            </div>
            <Button
              onClick={() => onUpdateStatus("KONFIRMASI_SELESAI")}
              disabled={isUpdating}
              className="bg-cyan-500 hover:bg-cyan-600 font-bold shrink-0 shadow-sm"
            >
              {isUpdating ? "Memproses..." : "Feedback Customer Diterima"}
            </Button>
          </div>
        )}

        {stage === 2 && status === "KONFIRMASI_SELESAI" && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800">
            <Clock3 size={20} className="text-amber-500 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Menunggu Persetujuan Manager Operasional</h4>
              <p className="text-xs text-amber-700 font-medium mt-0.5">
                Feedback dari klien sudah dilaporkan oleh sales. Menunggu pemeriksaan dan persetujuan dari Manager Operasional untuk beralih ke tahap implementasi.
              </p>
            </div>
          </div>
        )}

        {stage === 2 && status === "PERLU_TINDAKAN" && (
          <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-2">
            <div className="flex items-start gap-3 text-red-800">
              <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Perlu Tindakan (Revisi Ditolak Manager)</h4>
                <p className="text-xs text-red-700 font-medium mt-0.5">
                  Laporan feedback customer memerlukan revisi atau belum lengkap. Harap periksa catatan di bawah ini dan ajukan konfirmasi ulang di bar bagian bawah.
                </p>
              </div>
            </div>
            <div className="bg-white border border-red-100 rounded-lg p-3 text-xs font-semibold text-red-600">
              Catatan: {rejectionReason}
            </div>
          </div>
        )}

        {stage === 3 && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-4 text-green-800">
            <CheckCircle2 size={20} className="text-green-500 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Follow Up Selesai</h4>
              <p className="text-xs text-green-700 font-medium mt-0.5">
                Proses follow up penawaran telah diselesaikan dan disetujui oleh Manager Operasional. Penawaran beralih ke tahap implementasi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
