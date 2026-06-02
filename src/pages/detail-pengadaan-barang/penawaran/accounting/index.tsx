import React from "react";
import { useAccounting } from "@/hooks/use-accounting";
import TerminSection from "./TerminSection";
import DocumentSection from "./DocumentsSection";
import ActivitySidebar from "./ActivitySidebar";

function getUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      divisi: user.pegawai?.divisi ?? "",
      role: user.role ?? "",
    };
  } catch {
    return { divisi: "", role: "" };
  }
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

interface Props {
  trackingId: string;
  onChatClick: () => void;
}

export default function Step8({ trackingId, onChatClick }: Props) {
  const { data, isLoading, isError } = useAccounting(trackingId);

  const { divisi } = getUserInfo();

  const canBayar = [
    "FINANCE_ACCOUNTING",
    "DIREKTUR",
    "MANAGER_OPERASIONAL",
  ].includes(divisi);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <p className="animate-pulse">Memuat data accounting...</p>
      </div>
    );
  }

  const items = data?.items ?? [];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-8">
        <div>
          <SectionHeading title="Detail" />

          <div className="mt-6">
            <TerminSection
              trackingId={trackingId}
              items={items}
              canBayar={canBayar}
            />
          </div>
        </div>

        <div>
          <SectionHeading title="Dokumen" />

          <div className="mt-6">
            <DocumentSection
              dokumen={[]}
              onUpload={() => {}}
              onDelete={() => {}}
              isUploading={false}
            />
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivitySidebar logs={[]} onChatClick={onChatClick} unreadCount={0} />
      </div>
    </div>
  );
}
