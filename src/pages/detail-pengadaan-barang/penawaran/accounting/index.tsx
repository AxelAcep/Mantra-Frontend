import React from "react";
import { useAccounting } from "@/hooks/use-accounting";
import { useDetailFollowUp } from "@/hooks/use-follow-up";
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
}

export default function Step8({ trackingId }: Props) {
  const { data, isLoading, isError } = useAccounting(trackingId);
  const { data: followUpData } = useDetailFollowUp(trackingId);

  const { divisi } = getUserInfo();

  const financeDocs = React.useMemo(() => {
    if (!followUpData?.dokumen) return [];
    return followUpData.dokumen
      .filter((doc: any) => doc.kategori === "DOKUMEN_PO_FINANCE")
      .map((doc: any) => ({
        id: doc.id,
        namaFile: doc.namaFile,
        path: doc.path,
        createdAt: doc.createdAt,
      }));
  }, [followUpData]);

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
              dokumen={financeDocs}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivitySidebar logs={[]} />
      </div>
    </div>
  );
}
