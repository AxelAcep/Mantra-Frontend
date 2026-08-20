import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProgressCard from "../progress-card";
import TrackingHeader from "../header-card";
import Step1 from "./step1/index";
import Step2 from "./step2/index";
import Step3 from "./step3/index";
import Step4 from "./step4/index";
import Step5 from "./step5/index";
import Step6 from "./step6/index";
import Step7 from "./step7/index";
import Step8 from "./accounting/index";
import Step9 from "./step9";
import StepRestricted from "./step-restricted";
import { PenawaranChatPanel } from "@/components/penawaranChatPanel";
import { Button } from "@/components/ui/button";
import { useDetailPenawaran } from "@/hooks/use-penawaran";
import { usePreloadBoQ } from "@/hooks/use-boq";
import { useDetailReviewInternal } from "@/hooks/use-review-internal";

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

type Mode = "master" | "admin" | "sales" | "readonly" | "presales";

function detectMode(divisi: string, role: string): Mode {
  if (role === "MASTER") return "master";
  if (role === "SUPERVISI" && divisi === "SALES") return "admin";
  if (role === "PROJEK" && divisi === "SALES") return "sales";
  if (role === "PROJEK" && divisi === "PRESALES") return "presales";
  return "readonly";
}

function getNextButtonLabel(
  activeStep: number,
  isPermintaanSelesai: boolean,
  isBoQSelesai: boolean,
  isReviewInternalSelesai: boolean,
): string {
  if (activeStep === 1 && !isPermintaanSelesai)
    return "Permintaan Belum Selesai";
  if (activeStep === 2 && !isBoQSelesai) return "BoQ Belum Selesai";
  if (activeStep >= 3 && !isReviewInternalSelesai) return "Belum Tersedia";
  return "Selanjutnya";
}

function getStepNumber(step: string | undefined): number {
  switch (step) {
    case "PERMINTAAN_MASUK":
      return 1;
    case "PENYUSUNAN_BOQ":
      return 2;
    case "REVIEW_INTERNAL":
      return 3;
    case "PERSETUJUAN_MANAJEMEN":
      return 4;
    case "FOLLOW_UP":
      return 5;
    case "IMPLEMENTASI":
      return 6;
    case "BAST":
      return 7;
    case "GARANSI":
      return 8;
    case "PEMBAYARAN":
      return 9;
    default:
      return 1;
  }
}

function getStepName(step: string | undefined): string {
  switch (step) {
    case "PERMINTAAN_MASUK":
      return "Tahap 1 (Permintaan Masuk)";
    case "PENYUSUNAN_BOQ":
      return "Tahap 2 (Penyusunan BoQ)";
    case "REVIEW_INTERNAL":
      return "Tahap 3 (Review Internal)";
    case "PERSETUJUAN_MANAJEMEN":
      return "Tahap 4 (Persetujuan Manajemen)";
    case "FOLLOW_UP":
      return "Tahap 5 (Follow Up Klien)";
    case "IMPLEMENTASI":
      return "Tahap 6 (Implementasi)";
    case "BAST":
      return "Tahap 7 (BAST)";
    case "PEMBAYARAN":
      return "Tahap 8 (Garansi)";
    case "GARANSI":
      return "Tahap 9 (Accounting)";
    default:
      return "Tahap 1 (Permintaan Masuk)";
  }
}

const STEP_LABELS: Record<number, string> = {
  1: "Permintaan Masuk",
  2: "Penyusunan BoQ",
  3: "Review Internal",
  4: "Persetujuan Manajemen",
  5: "Follow Up Klien",
  6: "Implementasi",
  7: "BAST",
  8: "Garansi",
  9: "Accounting",
};

// ─── Main Component ─────────────────────────────────────────────────────────
export default function PenawaranPage() {
  const { id } = useParams<{ id: string }>();
  const trackingId = id ?? "";
  const userInfo = getUserInfo();
  const mode = detectMode(userInfo.divisi, userInfo.role);

  const [activeStep, setActiveStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [activeChatJudul, setActiveChatJudul] = useState<string>("");
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionTarget, setRevisionTarget] = useState<"step4" | "step5">(
    "step5",
  );

  function handleOpenChat(activityId: string, judul: string) {
    setActiveChatId(activityId);
    setActiveChatJudul(judul);
    setIsChatOpen(true);
  }

  const [step4Info, setStep4Info] = useState<{
    status: string;
    canAcc: boolean;
    canKonfirmasiUlang: boolean;
    isUpdating: boolean;
    onAcc: () => void;
    onPerluTindakan: (alasan: string) => void;
    onKonfirmasiUlang: () => void;
  } | null>(null);

  const [step5Info, setStep5Info] = useState<{
    status: string;
    canAcc: boolean;
    canKonfirmasiUlang: boolean;
    isUpdating: boolean;
    onAcc: () => void;
    onPerluTindakan: (alasan: string) => void;
    onKonfirmasiUlang: () => void;
  } | null>(null);

  // ── Data & Mutations ───────────────────────────────────────────────────
  const { data: penawaran, isLoading } = useDetailPenawaran(trackingId);
  const { data: boqData } = usePreloadBoQ(trackingId);

  // ── Derived Status ─────────────────────────────────────────────────────
  const permintaanStatus = penawaran?.permintaanMasuk?.status as
    | string
    | undefined;
  const isPermintaanSelesai = permintaanStatus === "SELESAI";

  const boqStatus = boqData?.status as string | undefined;
  const isBoQSelesai = boqStatus === "SELESAI";

  // Step 3
  const { data: reviewInternalData } = useDetailReviewInternal(trackingId);
  const isReviewInternalSelesai = reviewInternalData?.status === "SELESAI";

  // Step 4
  const isStep4Selesai = step4Info?.status === "SELESAI";

  // Step 5
  const isStep5Selesai = getStepNumber(penawaran?.stepSaatIni) > 5;

  function openRevisionModal(target: "step4" | "step5") {
    setRevisionTarget(target);
    setIsRevisionModalOpen(true);
  }

  // function handleRevisionConfirm(alasan: string) {
  //   if (revisionTarget === "step5") {
  //     step5Info?.onPerluTindakan(alasan);
  //   }
  //   setIsRevisionModalOpen(false);
  // }

  // Accounting
  const canAccessAccounting =
    [
      "KOMISARIS",
      "DIREKTUR",
      "MANAGER_OPERASIONAL",
      "FINANCE_ACCOUNTING",
    ].includes(userInfo.divisi) && getStepNumber(penawaran?.stepSaatIni) >= 5;

  // ── Next Button ────────────────────────────────────────────────────────
  const isNextBlocked =
    (activeStep === 1 && !isPermintaanSelesai) ||
    (activeStep === 2 && !isBoQSelesai) ||
    (activeStep === 3 && !isReviewInternalSelesai) ||
    (activeStep === 4 && !isStep4Selesai) ||
    (activeStep === 5 && !isStep5Selesai) ||
    activeStep >= 6;

  if (isLoading) return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full flex-1 p-6 pb-0 space-y-6">
        {/* Header */}
        <TrackingHeader
          title="Tracking Penawaran"
          project={penawaran?.jenisPenawaran?.join(", ") ?? "-"}
          code={`#${penawaran?.nomorPenawaran ?? ""}`}
          company={penawaran?.perusahaan?.nama ?? "-"}
          status={penawaran?.stepSaatIni ?? "-"}
        />

        {/* Progress */}
        <ProgressCard
          steps={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => ({
            n,
            label: STEP_LABELS[n] || `Tahap ${n}`,
            status:
              n === activeStep
                ? "active"
                : n < activeStep
                  ? "done"
                  : "inactive",
            disabled: n === 8 && !canAccessAccounting,
          }))}
          onStepClick={(step) => {
            if (step === 8 && !canAccessAccounting) return;
            setActiveStep(step);
          }}
        />

        {/* Step Content */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          {activeStep > getStepNumber(penawaran?.stepSaatIni) &&
          !(activeStep === 9 && canAccessAccounting) ? (
            <StepRestricted
              currentStepName={getStepName(penawaran?.stepSaatIni)}
            />
          ) : (
            <>
              {activeStep === 1 && (
                <Step1
                  mode={mode}
                  trackingId={trackingId}
                  data={penawaran}
                  onChatClick={handleOpenChat}
                />
              )}
              {activeStep === 2 && (
                <Step2
                  mode={mode}
                  trackingId={trackingId}
                  data={penawaran}
                  onChatClick={handleOpenChat}
                  userDivisi={userInfo.divisi}
                />
              )}
              {activeStep === 3 && <Step3 trackingId={trackingId} />}
              {activeStep === 4 && (
                <Step4 trackingId={trackingId} onStatusChange={setStep4Info} />
              )}
              {activeStep === 5 && (
                <Step5
                  trackingId={trackingId}
                  onChatClick={handleOpenChat}
                  onStatusChange={setStep5Info}
                />
              )}
              {activeStep === 6 && (
                <Step6 trackingId={trackingId} onChatClick={handleOpenChat} />
              )}
              {activeStep === 7 && <Step7 trackingId={trackingId} />}
              {activeStep === 8 && <Step9 />}
              {activeStep === 9 && <Step8 trackingId={trackingId} />}
            </>
          )}
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t py-4 z-50 mt-6">
        <div className="max-w-[1440px] mx-auto w-full px-6 flex justify-end items-center gap-3">
          <Button
            variant="outline"
            onClick={() => setActiveStep((p) => Math.max(1, p - 1))}
            disabled={activeStep === 1}
          >
            Sebelumnya
          </Button>

          {/* Step 5 action buttons tetap ada */}
          {activeStep === 5 && step5Info?.canAcc && (
            <>
              <Button
                onClick={() => openRevisionModal("step5")}
                disabled={step5Info.isUpdating}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Perlu Tindakan
              </Button>
              <Button
                onClick={step5Info.onAcc}
                disabled={step5Info.isUpdating}
                className="bg-emerald-400 hover:bg-emerald-600"
              >
                {step5Info.isUpdating ? "Memproses..." : "Approve"}
              </Button>
            </>
          )}

          {activeStep === 5 && step5Info?.canKonfirmasiUlang && (
            <Button
              onClick={step5Info.onKonfirmasiUlang}
              disabled={step5Info.isUpdating}
              className="bg-emerald-400 hover:bg-emerald-600"
            >
              {step5Info.isUpdating ? "Memproses..." : "Konfirmasi Ulang"}
            </Button>
          )}

          <Button
            onClick={() => setActiveStep((p) => Math.min(9, p + 1))}
            disabled={isNextBlocked}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {getNextButtonLabel(
              activeStep,
              isPermintaanSelesai,
              isBoQSelesai,
              isReviewInternalSelesai,
            )}
          </Button>
        </div>
      </div>

      {/* Chat Panel */}
      {activeChatId && (
        <PenawaranChatPanel
          activityId={activeChatId}
          activityJudul={activeChatJudul}
          open={isChatOpen}
          onClose={() => {
            setIsChatOpen(false);
            setActiveChatId(null);
          }}
          currentPegawaiId={userInfo.pegawaiId}
        />
      )}
    </div>
  );
}
