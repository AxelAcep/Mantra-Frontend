/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import DocumentSectionBoQ from "./DocumentSectionBoQ";
import ActivityLogSection from "../step1/ActivityLogSection";
import DetailSectionBoQ from "./DetailSectionBoQ";
import { usePreloadBoQ, useUpdateSubTotalBoQ } from "@/hooks/use-boq";
//  1. IMPORT HOOK MUTASI YANG SUDAH KITA BUAT
import { useUploadDokumenBoQ, useDeleteDokumenBoQ } from "@/hooks/use-boq";
import type { Mode } from "../step1";
import type { FinancialSummary, WorkingTime } from "./DetailSectionBoQ";
import type { TrackingPenawaranDetail } from "@/services/penawaran.services";

export interface LogEntry {
  id: number;
  user: string;
  action: string;
  time: string;
  date: string;
  type: "system" | "user";
}

export interface Step2Props {
  mode: Mode;
  trackingId: string;
  data?: TrackingPenawaranDetail;
  onChatClick: () => void;
  financial?: FinancialSummary;
  workingTime?: WorkingTime;
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

function calculateWorkingTime(
  waktuMulaiStr: string,
  targetSelesaiStr: string,
): WorkingTime {
  const sekarang = new Date();
  const mulai = waktuMulaiStr ? new Date(waktuMulaiStr) : new Date();
  const selesai = targetSelesaiStr ? new Date(targetSelesaiStr) : null;

  if (!selesai || isNaN(selesai.getTime())) {
    return {
      waktuMulai: waktuMulaiStr,
      targetSelesai: targetSelesaiStr,
      remainingHours: 0,
      percentage: 0,
      deadline: "-",
      status: "Belum Diatur",
    };
  }

  const deadlineFormatted = selesai.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const totalDurasi = selesai.getTime() - mulai.getTime();
  const durasiBerjalan = sekarang.getTime() - mulai.getTime();

  let percentage = 0;
  if (totalDurasi > 0) {
    percentage = Math.min(
      100,
      Math.max(0, Math.round((durasiBerjalan / totalDurasi) * 100)),
    );
  }

  const sisaMilidetik = selesai.getTime() - sekarang.getTime();
  const remainingHours = Math.max(
    0,
    Math.round(sisaMilidetik / (1000 * 60 * 60)),
  );

  let status = "On Progress";
  if (sisaMilidetik <= 0) {
    status = "Overdue";
    percentage = 100;
  } else if (remainingHours <= 24) {
    status = "Mendekati Deadline";
  }

  return {
    waktuMulai: waktuMulaiStr,
    targetSelesai: targetSelesaiStr,
    remainingHours,
    percentage,
    deadline: deadlineFormatted,
    status,
  };
}

export default function Step2({ trackingId, onChatClick, mode }: Step2Props) {
  const { data: boqData, loading, error, refetch } = usePreloadBoQ(trackingId);

  //  2. INISIALISASI FUNGSI MUTASI UPLOAD & DELETE
  const uploadMut = useUploadDokumenBoQ(trackingId);
  const deleteMut = useDeleteDokumenBoQ(trackingId);
  const updateSubTotalMut = useUpdateSubTotalBoQ(trackingId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <p className="animate-pulse">Memuat detail Penyusunan BoQ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center border border-red-100 bg-red-50 rounded-xl space-y-3">
        <p className="text-red-600 font-medium">Gagal memuat data: {error}</p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium shadow-sm hover:bg-red-100 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const financialData: FinancialSummary = {
    estimasiHarga: boqData?.estimasiHarga ?? 0,
    harga1: boqData?.harga1 ?? 0,
    harga2: boqData?.harga2 ?? 0,
    harga3: boqData?.harga3 ?? 0,
  };

  const rawWaktuMulai =
    boqData?.activity?.waktuMulai || boqData?.createdAt || "";
  const rawTargetSelesai = boqData?.activity?.targetSelesai || "";
  const workingTimeData = calculateWorkingTime(rawWaktuMulai, rawTargetSelesai);

  const mappedLogs: LogEntry[] =
    boqData?.logs?.map((log: any, index: number) => {
      const dateObj = log.createdAt ? new Date(log.createdAt) : new Date();

      const formattedTime = dateObj.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
      const formattedDate = dateObj.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      return {
        id: index + 1,
        user: log.namaPegawai || "System",
        action: log.aksi || "Activity",
        time: formattedTime,
        date: formattedDate,
        type: "system",
      };
    }) || [];

  //  3. SINKRONISASI TOTAL: Map properti langsung ke namaFile dan path sesuai komponen kontrak baru
  const mappedDokumen =
    boqData?.dokumen?.map((doc: any) => ({
      id: doc.id,
      namaFile: doc.namaFile || "Dokumen Tanpa Nama",
      path: doc.path || "",
      createdAt: doc.createdAt || "",
    })) || [];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />
        <DetailSectionBoQ
          mode={mode}
          financial={financialData}
          workingTime={workingTimeData}
          onSave={(body) => updateSubTotalMut.mutate(body)} // ← tambahin ini
          isSaving={updateSubTotalMut.isPending} // ← tambahin ini
        />

        <SectionHeading title="Dokumen" />
        {/*  4. SEKARANG VALUE AMAN DIKONSUMSI TANPA MATCHING ERROR */}
        <DocumentSectionBoQ
          trackingId={trackingId}
          status={boqData?.status ?? "ON_PROGRESS"}
          dokumen={mappedDokumen}
          onUpload={(file) => uploadMut.mutate({ file })}
          onDelete={(id) => deleteMut.mutate(id)}
          activity={
            boqData?.activity
              ? {
                  id: boqData.activity.id,
                  judul: boqData.activity.judul || "Penyusunan BoQ",
                  createdAt: boqData.activity.waktuMulai || boqData.createdAt,
                }
              : undefined
          }
        />
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSection
          logs={mappedLogs}
          onAddLog={() => {}}
          onChatClick={onChatClick}
        />
      </div>
    </div>
  );
}
