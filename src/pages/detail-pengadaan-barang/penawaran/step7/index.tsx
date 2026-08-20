import React from "react";
import { useBast } from "@/hooks/use-bast";
import DetailSectionBast from "./DetailSectionBast";
import DocumentSectionBast from "./DocumentSectionBast";
import ActivityLogSectionBast from "./ActivityLogSection";

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

function SubHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-1">
      <h2 className="font-bold text-sm text-cyan-600 uppercase tracking-tight">
        {title}
      </h2>
      <div className="h-px bg-cyan-100 flex-1" />
    </div>
  );
}

interface Step7Props {
  trackingId: string;
}

export default function Step7({ trackingId }: Step7Props) {
  const { bast, loading, error, refetch, updateBast, updating } =
    useBast(trackingId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <p className="animate-pulse">Memuat data BAST...</p>
      </div>
    );
  }

  if (error || !bast) {
    return (
      <div className="p-6 text-center border border-red-100 bg-red-50 rounded-xl space-y-3">
        <p className="text-red-600 font-medium">
          Gagal memuat data BAST: {error}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const mappedLogs =
    bast.logs?.map((log, i) => {
      const d = log.createdAt ? new Date(log.createdAt) : new Date();
      return {
        id: i + 1,
        user: log.namaPegawai || "System",
        action: log.aksi || "-",
        description: log.keterangan || "",
        time: d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: d,
      };
    }) ?? [];

  const entries = bast.entries ?? [];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-8">
        <div>
          <SectionHeading title="Detail" />

          {entries.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-6">
              Belum ada entry BAST.
            </p>
          ) : (
            <div className="space-y-8 mt-4">
              {entries.map((entry, i) => (
                <div key={entry.id}>
                  <SubHeading title={`BAST ${i + 1}`} />
                  <DetailSectionBast
                    noReferensi={entry.noReferensi}
                    tanggalTerbit={entry.tanggalTerbit}
                    tanggalSerahTerima={entry.tanggalSerahTerima}
                    isSaving={updating}
                    onSave={(payload) => updateBast(entry.id, payload)}
                  />
                  <DocumentSectionBast
                    activityAdminProyek={entry.activityAdminProyek}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSectionBast logs={mappedLogs} />
      </div>
    </div>
  );
}
