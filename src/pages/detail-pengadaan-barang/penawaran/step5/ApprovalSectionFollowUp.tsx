import React, { useState } from "react";
import { Clock3, CheckCircle2, AlertCircle, X, Check } from "lucide-react";

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
  adminProyekNama?: string;
  financeNama?: string;
  isAdminSekertariat: boolean;
  isSalesPIC: boolean;
  isDirekturKomisaris: boolean;
  isUpdating: boolean;
  isKonfirmasiDokumenPO: boolean;
  onUpdateStage: (nextStage: number) => void;
  onUpdateStatus: (
    status: "ON_PROGRESS" | "KONFIRMASI_SELESAI" | "SELESAI" | "PERLU_TINDAKAN",
  ) => void;
  onKonfirmasiDokumenPO: (
    status: "DITERIMA" | "PERLU_TINDAKAN",
    alasan?: string,
  ) => void;
}

export default function ApprovalSectionFollowUp({
  stage,
  status,
  customerName,
  salesName,
  adminProyekNama,
  financeNama,
  isAdminSekertariat,
  isSalesPIC,
  isDirekturKomisaris,
  isKonfirmasiDokumenPO,
  onKonfirmasiDokumenPO,
}: ApprovalSectionFollowUpProps) {
  const [alasanTolak, setAlasanTolak] = useState("");
  const [showTolakForm, setShowTolakForm] = useState(false);

  // Map stages timeline representation
  const timelineStatus1 =
    stage === 1 ? "active" : stage > 1 ? "done" : "locked";
  const timelineStatus2 =
    stage === 2
      ? status === "KONFIRMASI_SELESAI"
        ? "done"
        : "active"
      : stage > 2
        ? "done"
        : "locked";
  const timelineStatus3 =
    stage === 3 || stage === 4 ? "active" : stage > 4 ? "done" : "locked";
  const timelineStatus4 =
    stage === 5 ? "active" : stage > 5 ? "done" : "locked";
  const timelineStatus5 =
    stage === 6
      ? status === "SELESAI"
        ? "done"
        : "active"
      : status === "SELESAI"
        ? "done"
        : "locked";
  const timelineStatus6 = status === "SELESAI" ? "done" : "locked";

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
      title: "Pengecekan Dokumen PO (Admin Proyek & Finance)",
      description:
        "Admin Proyek dan Finance Supervisi masing-masing cek kelengkapan PO customer & kesiapan data",
      date: "",
      status: timelineStatus3,
    },
    {
      title: "Konfirmasi Dokumen PO oleh Direktur",
      description:
        "Menunggu Direktur/Komisaris mengonfirmasi hasil pengecekan dokumen PO",
      date: "",
      status: timelineStatus4,
    },
    {
      title: "Upload Dokumen PO",
      description:
        "Menunggu Admin Proyek input Total BAST dan mengunggah Dokumen PO untuk PGA dan Finance",
      date: "",
      status: timelineStatus5,
    },
    {
      title: "Follow Up Selesai",
      description:
        "Proses follow up penawaran telah diselesaikan. Penawaran beralih ke tahap implementasi.",
      date: "",
      status: timelineStatus6,
    },
  ];

  function handleTerima() {
    onKonfirmasiDokumenPO("DITERIMA");
  }

  function handleTolak() {
    if (!alasanTolak.trim()) return;
    onKonfirmasiDokumenPO("PERLU_TINDAKAN", alasanTolak.trim());
    setShowTolakForm(false);
    setAlasanTolak("");
  }

  // Get latest rejection reason
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 flex items-center gap-2 font-bold text-slate-800 text-[13px] tracking-tight">
        <Clock3 size={16} className="text-gray-500" />
        Status Follow Up
      </div>
      <div className="p-6 pt-4 space-y-6">
        <div className="bg-slate-50/70 rounded-xl border border-gray-100 p-6 space-y-6">
          <div>
            <p className="text-sm font-medium text-gray-500 mb-5">
              Progress Komunikasi
            </p>
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
                        {isDone ? (
                          <CheckCircle2 size={14} />
                        ) : (
                          <Clock3 size={14} />
                        )}
                      </div>
                      {index < followUpStages.length - 1 && (
                        <div className="w-px flex-1 min-h-[34px] bg-gray-200 mt-2" />
                      )}
                    </div>

                    <div className="pt-1">
                      <p
                        className={`text-base font-bold ${isActive || isDone ? "text-slate-800" : "text-slate-300"}`}
                      >
                        {item.title}
                      </p>
                      <p
                        className={`text-sm mt-1 ${isActive || isDone ? "text-gray-500" : "text-slate-300"}`}
                      >
                        {item.description}
                      </p>
                      {item.date && (
                        <p className="text-sm text-gray-400 mt-2 font-medium">
                          {item.date}
                        </p>
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
              <AlertCircle
                size={20}
                className="text-amber-500 shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-bold text-amber-800 text-sm">
                  Menunggu Penyelesaian Tugas
                </h4>
                <p className="text-xs text-amber-700 font-medium mt-0.5">
                  Status pengiriman dokumen diatur melalui penyelesaian Daily
                  Activity. Silakan ajukan selesai pada Daily Activity terkait
                  Anda dan tunggu persetujuan Master/Supervisi untuk beralih ke
                  tahap berikutnya.
                </p>
              </div>
            </div>
          </div>
        )}

        {stage === 2 && status === "ON_PROGRESS" && isSalesPIC && (
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-cyan-50/50 border border-cyan-100 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-cyan-500 shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-bold text-cyan-800 text-sm">
                  Menunggu Penyelesaian Tugas Sales
                </h4>
                <p className="text-xs text-cyan-700 font-medium mt-0.5">
                  Lakukan follow up ke customer untuk mendapatkan feedback /
                  persetujuan PO. Setelah selesai, silakan ajukan selesai pada
                  Daily Activity Anda.
                </p>
              </div>
            </div>
          </div>
        )}

        {stage === 2 &&
          (status === "KONFIRMASI_SELESAI" || status === "PERLU_TINDAKAN") && (
            <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800">
              <Clock3 size={20} className="text-amber-500 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">
                  Menunggu Persetujuan Master/Supervisi
                </h4>
                <p className="text-xs text-amber-700 font-medium mt-0.5">
                  Tugas follow up telah dikerjakan oleh sales. Menunggu
                  persetujuan pada Daily Activity untuk beralih ke tahap Admin
                  Proyek.
                </p>
              </div>
            </div>
          )}

        {stage === 3 && (
          <div className="flex items-center gap-3 bg-cyan-50/50 border border-cyan-100 rounded-xl p-4 text-cyan-800">
            <AlertCircle size={20} className="text-cyan-500 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">
                Menunggu Manager Operasional Memilih Admin Proyek
              </h4>
              <p className="text-xs text-cyan-700 font-medium mt-0.5">
                Setelah Admin Proyek dipilih, daily pengecekan dokumen PO
                otomatis dibuat untuk Admin Proyek dan Finance.
              </p>
            </div>
          </div>
        )}

        {stage === 4 && (
          <div className="flex items-center gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 text-amber-800">
            <Clock3 size={20} className="text-amber-500 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">
                Menunggu Pengecekan Dokumen PO
              </h4>
              <p className="text-xs text-amber-700 font-medium mt-0.5">
                Daily pengecekan{" "}
                {adminProyekNama ? `Admin Proyek (${adminProyekNama})` : "Admin Proyek"}{" "}
                dan {financeNama ? `Finance (${financeNama})` : "Finance"} harus
                dua-duanya selesai & disetujui sebelum lanjut ke konfirmasi
                Direktur.
              </p>
            </div>
          </div>
        )}

        {stage === 5 && (
          <div className="bg-purple-50/60 border border-purple-100 rounded-xl p-4 space-y-3">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={20}
                className="text-purple-500 shrink-0 mt-0.5"
              />
              <div>
                <h4 className="font-bold text-purple-800 text-sm">
                  Menunggu Konfirmasi Direktur/Komisaris
                </h4>
                <p className="text-xs text-purple-700 font-medium mt-0.5">
                  Daily pengecekan Admin Proyek & Finance sudah selesai.
                  {isDirekturKomisaris
                    ? " Silakan konfirmasi dokumen PO di bawah ini."
                    : " Menunggu Direktur/Komisaris mengonfirmasi."}
                </p>
              </div>
            </div>

            {isDirekturKomisaris && (
              <div className="pt-2 border-t border-purple-100 space-y-3">
                {!showTolakForm ? (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTerima}
                      disabled={isKonfirmasiDokumenPO}
                      className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <Check size={14} />
                      {isKonfirmasiDokumenPO ? "Memproses..." : "Konfirmasi Diterima"}
                    </button>
                    <button
                      onClick={() => setShowTolakForm(true)}
                      disabled={isKonfirmasiDokumenPO}
                      className="flex items-center gap-1.5 border border-red-300 text-red-600 hover:bg-red-50 text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <X size={14} />
                      Tolak
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={alasanTolak}
                      onChange={(e) => setAlasanTolak(e.target.value)}
                      placeholder="Alasan penolakan..."
                      rows={2}
                      className="w-full text-xs border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-red-400"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleTolak}
                        disabled={isKonfirmasiDokumenPO || !alasanTolak.trim()}
                        className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isKonfirmasiDokumenPO ? "Memproses..." : "Kirim Penolakan"}
                      </button>
                      <button
                        onClick={() => {
                          setShowTolakForm(false);
                          setAlasanTolak("");
                        }}
                        disabled={isKonfirmasiDokumenPO}
                        className="text-gray-500 text-xs font-bold px-4 py-2 hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-50"
                      >
                        Batal
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {stage === 6 && status !== "SELESAI" && (
          <div className="flex items-center gap-3 bg-cyan-50/50 border border-cyan-100 rounded-xl p-4 text-cyan-800">
            <Clock3 size={20} className="text-cyan-500 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">
                Menunggu Admin Proyek Upload Dokumen PO
              </h4>
              <p className="text-xs text-cyan-700 font-medium mt-0.5">
                Dokumen PO sudah dikonfirmasi Direktur/Komisaris. Admin Proyek
                sekarang bisa input Total BAST lalu upload Dokumen PO untuk PGA
                dan Finance.
              </p>
            </div>
          </div>
        )}

        {status === "SELESAI" && (
          <div className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl p-4 text-green-800">
            <CheckCircle2 size={20} className="text-green-500 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Follow Up Selesai</h4>
              <p className="text-xs text-green-700 font-medium mt-0.5">
                Proses follow up penawaran telah diselesaikan. Penawaran beralih
                ke tahap implementasi.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
