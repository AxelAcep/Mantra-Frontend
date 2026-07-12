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
import Step7 from "./step7";
import Step8 from "./accounting/index";
import Step9 from "./step9";
import StepRestricted from "./step-restricted";
import { PenawaranChatPanel } from "@/components/penawaranChatPanel";
import { Button } from "@/components/ui/button";
import RevisionModal from "../penawaran/step1/RevisionModal";
import {
  useDetailPenawaran,
  useUpdateStatusPermintaan,
} from "@/hooks/use-penawaran";
import { useUpdateStatusBoQ, usePreloadBoQ } from "@/hooks/use-boq";
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
    case "PEMBAYARAN":
      return 8;
    case "GARANSI":
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
      return "Tahap 8 (Accounting)";
    case "GARANSI":
      return "Tahap 9 (Garansi)";
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
  8: "Accounting",
  9: "Garansi",
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

  function handleOpenChat(activityId: string, judul: string) {
    setActiveChatId(activityId);
    setActiveChatJudul(judul);
    setIsChatOpen(true);
  }
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionTarget, setRevisionTarget] = useState<
    "step1" | "step2" | "step4" | "step5"
  >("step1");

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
  const { mutate: updateStatusPermintaan, isPending: isUpdatingPermintaan } =
    useUpdateStatusPermintaan(trackingId);
  const { mutate: updateStatusBoQ, isPending: isUpdatingBoQ } =
    useUpdateStatusBoQ(trackingId);
  const { data: boqData } = usePreloadBoQ(trackingId);

  // ── Derived Status ─────────────────────────────────────────────────────
  const permintaanStatus = penawaran?.permintaanMasuk?.status as
    | string
    | undefined;
  const isPermintaanSelesai = permintaanStatus === "SELESAI";
  const isPermintaanKonfirmasi = permintaanStatus === "KONFIRMASI_SELESAI";
  const isPermintaanPerluTindakan = permintaanStatus === "PERLU_TINDAKAN";
  const isPermintaanOnProgress =
    !permintaanStatus || permintaanStatus === "ON_PROGRESS";

  const boqStatus = boqData?.status as string | undefined;
  const isBoQSelesai = boqStatus === "SELESAI";
  const isBoQKonfirmasi = boqStatus === "KONFIRMASI_SELESAI";
  const isBoQPerluTindakan = boqStatus === "PERLU_TINDAKAN";
  const isBoQOnProgress = !boqStatus || boqStatus === "ON_PROGRESS";

  // ── Role Flags ─────────────────────────────────────────────────────────
  const isMaster = userInfo.role === "MASTER";
  const isSupervisiOrPresales =
    (userInfo.role === "SUPERVISI" && userInfo.divisi === "SALES") ||
    (userInfo.role === "PROJEK" && userInfo.divisi === "PRESALES");

  // ── Action Permissions per Step ────────────────────────────────────────
  // Step 1
  const canKonfirmasiStep1 =
    isSupervisiOrPresales &&
    (isPermintaanOnProgress || isPermintaanPerluTindakan);
  const canMasterAccStep1 = isMaster && isPermintaanKonfirmasi;

  // Step 2
  const canKonfirmasiStep2 =
    ((userInfo.role === "SUPERVISI" && userInfo.divisi === "SALES") ||
      (userInfo.role === "PROJEK" && userInfo.divisi === "SALES") ||
      (userInfo.role === "PROJEK" && userInfo.divisi === "PRESALES")) &&
    (isBoQOnProgress || isBoQPerluTindakan);
  const canMasterAccStep2 = isMaster && isBoQKonfirmasi;

  // Step 3
  const { data: reviewInternalData } = useDetailReviewInternal(trackingId);
  const isReviewInternalSelesai = reviewInternalData?.status === "SELESAI";

  // Step 4
  const isStep4Selesai = step4Info?.status === "SELESAI";

  // Step 5
  const isStep5Selesai = getStepNumber(penawaran?.stepSaatIni) > 5;

  //Accounting
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

  // ── Handlers ───────────────────────────────────────────────────────────
  function handleKonfirmasiStep1() {
    updateStatusPermintaan({ status: "KONFIRMASI_SELESAI" });
  }

  function handleTerimaStep1() {
    updateStatusPermintaan({ status: "KONFIRMASI_SELESAI" });
  }

  function handleTolakStep1(alasan: string) {
    updateStatusPermintaan({
      status: "PERLU_TINDAKAN",
      alasanPenolakan: alasan,
    });
  }

  function handleKonfirmasiStep2() {
    updateStatusBoQ({ status: "KONFIRMASI_SELESAI" });
  }

  function handleTerimaStep2() {
    updateStatusBoQ({ status: "KONFIRMASI_SELESAI" });
  }

  function handleTolakStep2(alasan: string) {
    updateStatusBoQ({ status: "PERLU_TINDAKAN", alasanPenolakan: alasan });
  }

  function openRevisionModal(target: "step1" | "step2" | "step4" | "step5") {
    setRevisionTarget(target);
    setIsRevisionModalOpen(true);
  }

  function handleRevisionConfirm(alasan: string) {
    if (revisionTarget === "step1") handleTolakStep1(alasan);
    else if (revisionTarget === "step2") handleTolakStep2(alasan);
    else if (revisionTarget === "step4") step4Info?.onPerluTindakan(alasan);
    else if (revisionTarget === "step5") step5Info?.onPerluTindakan(alasan);
    setIsRevisionModalOpen(false);
  }

  if (isLoading) return <div className="p-10 text-center">Memuat...</div>;

  const isUpdating = isUpdatingPermintaan || isUpdatingBoQ;

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
          steps={[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => {
            const isAccounting = n === 8;

            return {
              n,
              label: STEP_LABELS[n] || `Tahap ${n}`,
              status:
                n === activeStep
                  ? "active"
                  : n < activeStep
                    ? "done"
                    : "inactive",
              disabled: isAccounting && !canAccessAccounting,
            };
          })}
          onStepClick={(step) => {
            if (step === 8 && !canAccessAccounting) return;
            setActiveStep(step);
          }}
        />

        {/* Step Content */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          {activeStep > getStepNumber(penawaran?.stepSaatIni) && !(activeStep === 8 && canAccessAccounting) ? (
            <StepRestricted currentStepName={getStepName(penawaran?.stepSaatIni)} />
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
                />
              )}
              {activeStep === 3 && (
                <Step3
                  trackingId={trackingId}
                />
              )}
              {activeStep === 4 && (
                <Step4
                  trackingId={trackingId}
                  onStatusChange={setStep4Info} // ✅
                />
              )}
              {activeStep === 5 && (
                <Step5
                  trackingId={trackingId}
                  onChatClick={handleOpenChat}
                  onStatusChange={setStep5Info}
                />
              )}
              {activeStep === 6 && (
                <Step6
                  trackingId={trackingId}
                  onChatClick={handleOpenChat}
                />
              )}
              {activeStep === 7 && <Step7 />}
              {activeStep === 8 && (
                <Step8
                  trackingId={trackingId}
                />
              )}
              {activeStep === 9 && <Step9 />}
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

          {/* Step 1: Supervisi/Presales konfirmasi selesai */}
          {activeStep === 1 && canKonfirmasiStep1 && (
            <Button
              onClick={handleKonfirmasiStep1}
              disabled={isUpdating}
              className="bg-emerald-400 hover:bg-emerald-600"
            >
              {isUpdatingPermintaan ? "Memproses..." : "Konfirmasi Selesai"}
            </Button>
          )}

          {/* Step 1: Master terima atau tolak */}
          {activeStep === 1 && canMasterAccStep1 && (
            <>
              <Button
                onClick={() => openRevisionModal("step1")}
                disabled={isUpdating}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Tolak
              </Button>
              <Button
                onClick={handleTerimaStep1}
                disabled={isUpdating}
                className="bg-emerald-400 hover:bg-emerald-600"
              >
                {isUpdatingPermintaan ? "Memproses..." : "Terima"}
              </Button>
            </>
          )}

          {/* Step 2: Supervisi/Presales konfirmasi selesai */}
          {activeStep === 2 && canKonfirmasiStep2 && (
            <Button
              onClick={handleKonfirmasiStep2}
              disabled={isUpdating}
              className="bg-emerald-400 hover:bg-emerald-600"
            >
              {isUpdatingBoQ ? "Memproses..." : "Konfirmasi Selesai"}
            </Button>
          )}

          {/* Step 2: Master terima atau tolak */}
          {activeStep === 2 && canMasterAccStep2 && (
            <>
              <Button
                onClick={() => openRevisionModal("step2")}
                disabled={isUpdating}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Tolak
              </Button>
              <Button
                onClick={handleTerimaStep2}
                disabled={isUpdating}
                className="bg-emerald-400 hover:bg-emerald-600"
              >
                {isUpdatingBoQ ? "Memproses..." : "Terima"}
              </Button>
            </>
          )}

          {activeStep === 4 && step4Info?.canAcc && (
            <>
              <Button
                onClick={() => openRevisionModal("step4")}
                disabled={step4Info.isUpdating}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Perlu Tindakan
              </Button>
              <Button
                onClick={step4Info.onAcc}
                disabled={step4Info.isUpdating}
                className="bg-emerald-400 hover:bg-emerald-600"
              >
                {step4Info.isUpdating ? "Memproses..." : "Approve"}
              </Button>
            </>
          )}

          {/* Step 4: Sales/PreSales/Supervisi/Manajer — Konfirmasi Ulang */}
          {activeStep === 4 && step4Info?.canKonfirmasiUlang && (
            <Button
              onClick={step4Info.onKonfirmasiUlang}
              disabled={step4Info.isUpdating}
              className="bg-emerald-400 hover:bg-emerald-600"
            >
              {step4Info.isUpdating ? "Memproses..." : "Konfirmasi Ulang"}
            </Button>
          )}

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

          {/* Step 5: Sales — Konfirmasi Ulang */}
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

      {/* Revision Modal — shared untuk step 1 & 2 */}
      <RevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onConfirm={handleRevisionConfirm}
      />

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
