/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProgressCard from "../progress-card";
import TrackingHeader from "../header-card";
import Step1 from "./step1/index";
import Step2 from "./step2";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";
import Step7 from "./step7";
import Step8 from "./step8";
import Step9 from "./step9";
import { PenawaranChatPanel } from "@/components/penawaranChatPanel";
import { Button } from "@/components/ui/button";
import {
  useDetailPenawaran,
  useUnreadPenawaranCount,
  useUpdateStatusPermintaan,
} from "@/hooks/use-penawaran";

// ── Helpers ────────────────────────────────────────────────────────────────

function getUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      pegawaiId: user.pegawai?.id ?? "",
      divisi: user.pegawai?.divisi ?? "",
      role: user.role ?? "",
    };
  } catch {
    return { pegawaiId: "", divisi: "", role: "" };
  }
}

// master   → role MASTER
// admin    → role SUPERVISI divisi SALES
// sales    → role PROJEK divisi SALES
// readonly → sisanya
type Mode = "master" | "admin" | "sales" | "readonly";

function detectMode(divisi: string, role: string): Mode {
  if (role === "MASTER") return "master";
  if (role === "SUPERVISI" && divisi === "SALES") return "admin";
  if (role === "PROJEK" && divisi === "SALES") return "sales";
  return "readonly";
}

// Cek apakah step berikutnya sudah ada
function isNextStepExist(penawaran: any, activeStep: number): boolean {
  if (activeStep === 1) return !!penawaran?.penyusunanBoQ;
  if (activeStep === 2) return !!penawaran?.reviewInternal;
  if (activeStep === 3) return !!penawaran?.persetujuanManajemen;
  return true;
}

interface Step {
  n: number;
  label: string;
  status: "active" | "inactive" | "done";
}

// ── Tolak Modal ────────────────────────────────────────────────────────────

function TolakModal({
  onClose,
  onConfirm,
  isPending,
}: {
  onClose: () => void;
  onConfirm: (alasan: string) => void;
  isPending: boolean;
}) {
  const [alasan, setAlasan] = useState("");
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        <div className="p-6 border-b border-gray-100">
          <h3 className="font-bold text-slate-800">Tolak Permintaan</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Alasan akan dicatat di log aktivitas
          </p>
        </div>
        <div className="p-6">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-tight block mb-2">
            Alasan Penolakan
          </label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Contoh: Data customer tidak lengkap..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
          />
        </div>
        <div className="px-6 pb-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
          >
            Batal
          </button>
          <button
            onClick={() => alasan.trim() && onConfirm(alasan.trim())}
            disabled={!alasan.trim() || isPending}
            className="px-6 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 font-semibold disabled:opacity-50"
          >
            {isPending ? "Menyimpan..." : "Tolak"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Component ──────────────────────────────────────────────────────────────

export default function PenawaranPage() {
  const { id } = useParams<{ id: string }>();
  const trackingId = id ?? "";

  const userInfo = getUserInfo();
  const mode = detectMode(userInfo.divisi, userInfo.role);

  const [activeStep, setActiveStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showTolakModal, setShowTolakModal] = useState(false);

  const { data: penawaran, isLoading } = useDetailPenawaran(trackingId);
  const { data: unreadCount = 0 } = useUnreadPenawaranCount(trackingId);
  const { mutate: updateStatus, isPending: isUpdatingStatus } =
    useUpdateStatusPermintaan(trackingId);

  const nextStepExist = isNextStepExist(penawaran, activeStep);
  const canTolak = mode === "master";
  const canKonfirmasi =
    mode === "master" || mode === "admin" || mode === "sales";

  const stepsBase = [
    { n: 1, label: "Permintaan Masuk" },
    { n: 2, label: "Penyusunan BoQ" },
    { n: 3, label: "Review Internal" },
    { n: 4, label: "Persetujuan Manajemen" },
    { n: 5, label: "Follow Up" },
    { n: 6, label: "Implementasi" },
    { n: 7, label: "BAST" },
    { n: 8, label: "Pembayaran" },
    { n: 9, label: "Garansi" },
  ];

  const steps: Step[] = stepsBase.map((s) => ({
    ...s,
    status:
      s.n === activeStep ? "active" : s.n < activeStep ? "done" : "inactive",
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-400 text-sm">Memuat data penawaran...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 font-sans flex flex-col">
      {showTolakModal && (
        <TolakModal
          onClose={() => setShowTolakModal(false)}
          onConfirm={(alasan) => {
            updateStatus(
              { status: "PERLU_TINDAKAN", alasanPenolakan: alasan },
              { onSuccess: () => setShowTolakModal(false) },
            );
          }}
          isPending={isUpdatingStatus}
        />
      )}

      <div className="max-w-[1440px] mx-auto w-full flex-1 flex flex-col space-y-6">
        <TrackingHeader
          title="Tracking Penawaran"
          project={penawaran?.jenisPenawaran?.join(", ") ?? "-"}
          code={`#${penawaran?.nomorPenawaran ?? ""}`}
          company={penawaran?.perusahaan?.nama ?? "-"}
          status={penawaran?.stepSaatIni ?? "-"}
        />

        <ProgressCard steps={steps} onStepClick={setActiveStep} />

        <div className="flex-1">
          {mode === "readonly" && (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 text-center flex items-center justify-center min-h-[300px]">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  Akses Ditolak
                </h2>
                <p className="text-gray-600">
                  Anda tidak memiliki izin untuk melihat detail penawaran ini.
                </p>
              </div>
            </div>
          )}

          {mode !== "readonly" && (
            <>
              {activeStep === 1 && (
                <Step1
                  mode={mode}
                  trackingId={trackingId}
                  data={penawaran}
                  onChatClick={() => setIsChatOpen(true)}
                />
              )}
              {activeStep === 2 && <Step2 />}
              {activeStep === 3 && <Step3 />}
              {activeStep === 4 && <Step4 />}
              {activeStep === 5 && <Step5 />}
              {activeStep === 6 && <Step6 />}
              {activeStep === 7 && <Step7 />}
              {activeStep === 8 && <Step8 />}
              {activeStep === 9 && <Step9 />}
            </>
          )}
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 px-6 flex justify-end items-center gap-3 mt-8 -mx-6 -mb-6">
          {/* Tolak — hanya Master */}
          {canTolak && (
            <Button
              variant="outline"
              onClick={() => setShowTolakModal(true)}
              disabled={isUpdatingStatus}
              className="bg-red-50 border-red-100 text-red-500 hover:bg-red-100 hover:text-red-600 font-bold px-6 h-10 rounded-lg"
            >
              Tolak
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => setActiveStep((prev) => Math.max(1, prev - 1))}
            disabled={activeStep === 1}
            className="border-cyan-500 text-cyan-500 hover:bg-cyan-50 font-bold px-6 h-10 rounded-lg disabled:opacity-50"
          >
            Sebelumnya
          </Button>

          {/* Selanjutnya atau Konfirmasi Selesai */}
          {/* Selanjutnya atau Konfirmasi Selesai */}
          {penawaran?.permintaanMasuk?.status !== "SELESAI" ? (
            <Button
              onClick={() => updateStatus({ status: "KONFIRMASI_SELESAI" })}
              disabled={
                isUpdatingStatus ||
                (mode === "master" &&
                  penawaran?.permintaanMasuk?.status !==
                    "KONFIRMASI_SELESAI") ||
                (mode !== "master" &&
                  penawaran?.permintaanMasuk?.status === "KONFIRMASI_SELESAI")
              }
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 h-10 rounded-lg shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUpdatingStatus
                ? "Memproses..."
                : mode === "master"
                  ? "Acc & Lanjut ke BoQ"
                  : "Konfirmasi Selesai"}
            </Button>
          ) : (
            <Button
              onClick={() => setActiveStep((prev) => Math.min(9, prev + 1))}
              disabled={activeStep === 9}
              className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold px-6 h-10 rounded-lg shadow-sm"
            >
              Selanjutnya
            </Button>
          )}
        </div>
      </div>

      <PenawaranChatPanel
        activityId={trackingId}
        activityJudul={`Chat · ${penawaran?.nomorPenawaran ?? ""}`}
        terkaitPO={penawaran?.nomorPO}
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentPegawaiId={userInfo.pegawaiId}
      />
    </div>
  );
}
