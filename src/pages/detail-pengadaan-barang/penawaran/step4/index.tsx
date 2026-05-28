import React from "react";
import { useDetailPersetujuanManajemen } from "@/hooks/use-review-manajemen";
import {
  useUploadDokumenPersetujuanManajemen,
  useDeleteDokumenPersetujuanManajemen,
  useUpdateStatusPersetujuanManajemen,
} from "@/hooks/use-review-manajemen";
import ApprovalSectionPersetujuan from "./ApprovalSectionPersetujuan";
import DocumentSectionPersetujuan from "./DocumentSectionPersetujuan";
import ActivityLogSectionPersetujuan from "./ActivityLogSectionPersetujuan";

function getUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return { divisi: user.pegawai?.divisi ?? "", role: user.role ?? "" };
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
  // ✅ Tambahan: callback agar parent tahu status & aksi yang tersedia
  onStatusChange?: (info: {
    status: string;
    canAcc: boolean;
    canKonfirmasiUlang: boolean;
    isUpdating: boolean;
    onAcc: () => void;
    onPerluTindakan: (alasan: string) => void;
    onKonfirmasiUlang: () => void;
  }) => void;
}

export default function Step4({
  trackingId,
  onChatClick,
  onStatusChange,
}: Props) {
  const { data, loading, error, refetch } =
    useDetailPersetujuanManajemen(trackingId);
  const uploadMut = useUploadDokumenPersetujuanManajemen(trackingId);
  const deleteMut = useDeleteDokumenPersetujuanManajemen(trackingId);
  const updateStatusMut = useUpdateStatusPersetujuanManajemen(trackingId);

  const { divisi, role } = getUserInfo();

  const isDirekturKomisaris = divisi === "DIREKTUR" || divisi === "KOMISARIS";
  const isSalesPresalesSupervisiManajer =
    divisi === "SALES" ||
    divisi === "PRESALES" ||
    divisi === "MANAGER_OPERASIONAL" ||
    (role === "SUPERVISI" && divisi === "SALES");

  const isOnProgress = data?.status === "ON_PROGRESS";
  const isPerluTindakan = data?.status === "PERLU_TINDAKAN";

  const canAcc =
    isDirekturKomisaris && isOnProgress && !data?.accDirekturKomisaris;
  const canKonfirmasiUlang = isSalesPresalesSupervisiManajer && isPerluTindakan;
  const isUpdating = updateStatusMut.isPending;

  const handlers = {
    status: data?.status ?? "",
    canAcc,
    canKonfirmasiUlang,
    isUpdating,
    onAcc: () => updateStatusMut.mutate({ status: "SELESAI" }),
    onPerluTindakan: (alasan: string) =>
      updateStatusMut.mutate({
        status: "PERLU_TINDAKAN",
        alasanPenolakan: alasan,
      }),
    onKonfirmasiUlang: () => updateStatusMut.mutate({ status: "ON_PROGRESS" }),
  };

  // ✅ Beritahu parent setiap kali info berubah
  React.useEffect(() => {
    if (data) onStatusChange?.(handlers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.status, canAcc, canKonfirmasiUlang, isUpdating]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <p className="animate-pulse">Memuat Persetujuan Manajemen...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
              <span className="text-2xl text-red-600">!</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-red-700">
                Gagal Memuat Data
              </h2>
              <p className="text-sm leading-relaxed text-red-600">
                Terjadi kesalahan saat mengambil data Persetujuan Manajemen.
              </p>
              {error && (
                <p className="rounded-lg bg-white/70 px-3 py-2 text-xs text-red-500 border border-red-100">
                  {String(error)}
                </p>
              )}
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
              >
                Coba Lagi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const mappedLogs =
    data.logs?.map((log, i) => {
      const d = log.createdAt ? new Date(log.createdAt) : new Date();
      return {
        id: i + 1,
        user: log.namaPegawai || "System",
        action: log.aksi || "-",
        time: d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      };
    }) ?? [];

  const mappedDokumen =
    data.dokumen?.map((doc) => ({
      id: doc.id,
      namaFile: doc.namaFile,
      path: doc.path,
      createdAt: doc.createdAt,
    })) ?? [];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />
        <ApprovalSectionPersetujuan
          data={data}
          canAcc={canAcc}
          canKonfirmasiUlang={canKonfirmasiUlang}
          isUpdating={isUpdating}
          onAcc={() => updateStatusMut.mutate({ status: "SELESAI" })}
          onPerluTindakan={(alasan) =>
            updateStatusMut.mutate({
              status: "PERLU_TINDAKAN",
              alasanPenolakan: alasan,
            })
          }
          onKonfirmasiUlang={() =>
            updateStatusMut.mutate({ status: "ON_PROGRESS" })
          }
        />

        <SectionHeading title="Dokumen" />
        <DocumentSectionPersetujuan
          dokumen={mappedDokumen}
          onUpload={(file) => uploadMut.mutate({ file })}
          onDelete={(id) => deleteMut.mutate(id)}
          isUploading={uploadMut.isPending}
        />
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSectionPersetujuan
          logs={mappedLogs}
          onChatClick={onChatClick}
        />
      </div>
    </div>
  );
}
