import React, { useState } from "react";
import DetailSection from "./DetailSection";
import RequestDetailSection from "./RequestDetailSection";
import DocumentSection from "./DocumentSection";
import ActivityLogSection from "./ActivityLogSection";
import RevisionModal from "./RevisionModal";
import type { TrackingPenawaranDetail } from "@/services/penawaran.services";

export type Mode = "master" | "admin" | "sales" | "readonly";

export interface LogEntry {
  id: number;
  user: string;
  action: string;
  time: string;
  date: string;
  type: "system" | "user";
}

interface Step1Props {
  mode: Mode;
  trackingId: string;
  data?: TrackingPenawaranDetail;
  onChatClick: () => void;
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

export default function Step1({
  mode,
  trackingId,
  data,
  onChatClick,
}: Step1Props) {
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const isAdmin = mode === "master" || mode === "admin";

  const logs: LogEntry[] = React.useMemo(() => {
    const result: LogEntry[] = [];

    // Activity dibuat
    if (data?.permintaanMasuk?.activity) {
      const act = data.permintaanMasuk.activity;
      result.push({
        id: 1,
        user: "Sistem",
        action: `Activity dibuat: ${act.judul}`,
        time: new Date(act.waktuMulai).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: new Date(act.waktuMulai).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "short",
          year: "numeric",
        }),
        type: "system",
      });
    }

    // Upload dokumen
    if (data?.permintaanMasuk?.dokumen) {
      data.permintaanMasuk.dokumen.forEach((dok, i) => {
        result.push({
          id: i + 10,
          user: "Upload Dokumen",
          action: `Mengunggah file ${dok.namaFile}`,
          time: new Date(dok.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(dok.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          type: "user",
        });
      });
    }

    // Log dari backend (assign, tolak, konfirmasi, dll)
    if (data?.permintaanMasuk?.logs) {
      data.permintaanMasuk.logs.forEach((log, i) => {
        result.push({
          id: i + 100,
          user: log.namaPegawai,
          action: `${log.aksi}${log.keterangan ? `: ${log.keterangan}` : ""}`,
          time: new Date(log.createdAt).toLocaleTimeString("id-ID", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          date: new Date(log.createdAt).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          type: "system",
        });
      });
    }

    return result;
  }, [data]);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />
        <DetailSection
          mode={mode}
          trackingId={trackingId}
          data={data}
          canAssignPreSales={isAdmin}
        />
        <RequestDetailSection
          mode={mode}
          trackingId={trackingId}
          data={data?.permintaanMasuk}
          tracking={data}
          onRevisiClick={() => setIsRevisionModalOpen(true)}
          canUpdateStatus={isAdmin}
        />
        <SectionHeading title="Dokumen" />
        <DocumentSection
          trackingId={trackingId}
          permintaanMasukId={data?.permintaanMasuk?.id}
          dokumen={data?.permintaanMasuk?.dokumen ?? []}
          activity={
            data?.permintaanMasuk?.activity
              ? {
                  id: data.permintaanMasuk.activity.id,
                  judul: data.permintaanMasuk.activity.judul,
                  createdAt: data.permintaanMasuk.activity.waktuMulai,
                }
              : undefined
          }
        />
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSection
          logs={logs}
          onAddLog={() => {}}
          onChatClick={onChatClick}
        />
      </div>

      <RevisionModal
        isOpen={isRevisionModalOpen}
        onClose={() => setIsRevisionModalOpen(false)}
        onConfirm={() => setIsRevisionModalOpen(false)}
      />
    </div>
  );
}
