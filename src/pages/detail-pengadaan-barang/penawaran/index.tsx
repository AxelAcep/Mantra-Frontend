import React, { useState } from "react";
import { useParams } from "react-router-dom";
import ProgressCard from "../progress-card";
import TrackingHeader from "../header-card";
import Step1 from "./step1/index";
import Step2 from "./step2/index";
import Step3 from "./step3";
import Step4 from "./step4";
import Step5 from "./step5";
import Step6 from "./step6";
import Step7 from "./step7";
import Step8 from "./step8";
import Step9 from "./step9";
import { PenawaranChatPanel } from "@/components/penawaranChatPanel";
import { Button } from "@/components/ui/button";
import RevisionModal from "../penawaran/step1/RevisionModal";
import {
  useDetailPenawaran,
  useUpdateStatusPermintaan,
} from "@/hooks/use-penawaran";
import { useUpdateStatusBoQ, usePreloadBoQ } from "@/hooks/use-boq";

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
): string {
  if (activeStep === 1 && !isPermintaanSelesai)
    return "Permintaan Belum Selesai";
  if (activeStep === 2 && !isBoQSelesai) return "BoQ Belum Selesai";
  if (activeStep >= 3) return "Belum Tersedia";
  return "Selanjutnya";
}

// ── Main Component ─────────────────────────────────────────────────────────
export default function PenawaranPage() {
  const { id } = useParams<{ id: string }>();
  const trackingId = id ?? "";
  const userInfo = getUserInfo();
  const mode = detectMode(userInfo.divisi, userInfo.role);

  const [activeStep, setActiveStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionTarget, setRevisionTarget] = useState<"step1" | "step2">(
    "step1",
  );

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

  // ── Next Button ────────────────────────────────────────────────────────
  const isNextBlocked =
    (activeStep === 1 && !isPermintaanSelesai) ||
    (activeStep === 2 && !isBoQSelesai) ||
    activeStep >= 3;

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

  function openRevisionModal(target: "step1" | "step2") {
    setRevisionTarget(target);
    setIsRevisionModalOpen(true);
  }

  function handleRevisionConfirm(alasan: string) {
    if (revisionTarget === "step1") handleTolakStep1(alasan);
    else handleTolakStep2(alasan);
    setIsRevisionModalOpen(false);
  }

  if (isLoading) return <div className="p-10 text-center">Memuat...</div>;

  const isUpdating = isUpdatingPermintaan || isUpdatingBoQ;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full flex-1 space-y-6">
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
            label: `Tahap ${n}`,
            status:
              n === activeStep
                ? "active"
                : n < activeStep
                  ? "done"
                  : "inactive",
          }))}
          onStepClick={setActiveStep}
        />

        {/* Step Content */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          {activeStep === 1 && (
            <Step1
              mode={mode}
              trackingId={trackingId}
              data={penawaran}
              onChatClick={() => setIsChatOpen(true)}
            />
          )}
          {activeStep === 2 && (
            <Step2
              mode={mode}
              trackingId={trackingId}
              data={penawaran}
              onChatClick={() => setIsChatOpen(true)}
            />
          )}
          {activeStep === 3 && <Step3 />}
          {activeStep === 4 && <Step4 />}
          {activeStep === 5 && <Step5 />}
          {activeStep === 6 && <Step6 />}
          {activeStep === 7 && <Step7 />}
          {activeStep === 8 && <Step8 />}
          {activeStep === 9 && <Step9 />}
        </div>

        {/* Bottom Action Bar */}
        <div className="sticky bottom-0 bg-white/80 backdrop-blur-md border-t p-4 flex justify-end items-center gap-3 mt-8">
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

          <Button
            onClick={() => setActiveStep((p) => Math.min(9, p + 1))}
            disabled={isNextBlocked}
            className="bg-cyan-500 hover:bg-cyan-600"
          >
            {getNextButtonLabel(activeStep, isPermintaanSelesai, isBoQSelesai)}
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
      <PenawaranChatPanel
        activityId={trackingId}
        activityJudul={`Chat · ${penawaran?.nomorPenawaran ?? ""}`}
        open={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        currentPegawaiId={userInfo.pegawaiId}
      />
    </div>
  );
}
