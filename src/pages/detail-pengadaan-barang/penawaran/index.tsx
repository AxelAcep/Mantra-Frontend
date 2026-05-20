/* eslint-disable @typescript-eslint/no-unused-vars */
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
  useUnreadPenawaranCount,
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

// ── Main Component ─────────────────────────────────────────────────────────
export default function PenawaranPage() {
  const { id } = useParams<{ id: string }>();
  const trackingId = id ?? "";
  const userInfo = getUserInfo();
  const mode = detectMode(userInfo.divisi, userInfo.role);

  const [activeStep, setActiveStep] = useState(1);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);

  const { data: penawaran, isLoading } = useDetailPenawaran(trackingId);
  const { mutate: updateStatusPermintaan, isPending: isUpdatingPermintaan } =
    useUpdateStatusPermintaan(trackingId);
  const { mutate: updateStatusBoQ, isPending: isUpdatingBoQ } =
    useUpdateStatusBoQ(trackingId);

  const { data: boqData } = usePreloadBoQ(trackingId);
  const boqStatus = boqData?.status as string | undefined;
  const isBoQSelesai = boqStatus === "SELESAI";
  const isBoQKonfirmasi = boqStatus === "KONFIRMASI_SELESAI";
  const isBoQPerluTindakan = boqStatus === "PERLU_TINDAKAN";
  const isBoQOnProgress = !boqStatus || boqStatus === "ON_PROGRESS";

  // Siapa yang bisa apa
  const isMaster = userInfo.role === "MASTER";
  const isSupervisiOrPresales =
    (userInfo.role === "SUPERVISI" && userInfo.divisi === "SALES") ||
    (userInfo.role === "PROJEK" && userInfo.divisi === "PRESALES");

  // Bisa konfirmasi selesai: supervisi/presales saat ON_PROGRESS atau PERLU_TINDAKAN
  const canKonfirmasi =
    isSupervisiOrPresales && (isBoQOnProgress || isBoQPerluTindakan);

  // Bisa terima/tolak: master saat KONFIRMASI_SELESAI
  const canMasterAcc = isMaster && isBoQKonfirmasi;

  // Tombol next diblock sampai BoQ SELESAI
  const isNextBlocked = activeStep === 2 && !isBoQSelesai;

  function handleKonfirmasiSelesai() {
    updateStatusBoQ({ status: "KONFIRMASI_SELESAI" });
  }

  function handleTerima() {
    updateStatusBoQ({ status: "KONFIRMASI_SELESAI" }); // master confirm → SELESAI di BE
  }

  function handleTolak(alasan: string) {
    updateStatusBoQ({ status: "PERLU_TINDAKAN", alasanPenolakan: alasan });
  }

  if (isLoading) return <div className="p-10 text-center">Memuat...</div>;

  return (
    <div className="min-h-screen bg-[#f8fafc] p-6 flex flex-col">
      <div className="max-w-[1440px] mx-auto w-full flex-1 space-y-6">
        <TrackingHeader
          title="Tracking Penawaran"
          project={penawaran?.jenisPenawaran?.join(", ") ?? "-"}
          code={`#${penawaran?.nomorPenawaran ?? ""}`}
          company={penawaran?.perusahaan?.nama ?? "-"}
          status={penawaran?.stepSaatIni ?? "-"}
        />

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

          {/* Step 2: Supervisi/Presales konfirmasi selesai (ON_PROGRESS atau PERLU_TINDAKAN) */}
          {activeStep === 2 && canKonfirmasi && (
            <Button
              onClick={handleKonfirmasiSelesai}
              disabled={isUpdatingBoQ}
              className="bg-emerald-400 hover:bg-emerald-600"
            >
              {isUpdatingBoQ ? "Memproses..." : "Konfirmasi Selesai"}
            </Button>
          )}

          {/* Step 2: Master terima atau tolak (KONFIRMASI_SELESAI) */}
          {activeStep === 2 && canMasterAcc && (
            <>
              <Button
                onClick={() => setIsRevisionModalOpen(true)}
                disabled={isUpdatingBoQ}
                variant="outline"
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Tolak
              </Button>
              <Button
                onClick={handleTerima}
                disabled={isUpdatingBoQ}
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
            {isNextBlocked ? "BoQ Belum Selesai" : "Selanjutnya"}
          </Button>
        </div>
      </div>

      <RevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onConfirm={(alasan) => {
          handleTolak(alasan);
          setIsRevisionModalOpen(false);
        }}
      />

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
