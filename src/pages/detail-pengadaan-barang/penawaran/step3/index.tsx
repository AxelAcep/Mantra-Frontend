import React from "react";
import { useDetailReviewInternal } from "@/hooks/use-review-internal";
import {
  useUploadDokumenReviewInternal,
  useDeleteDokumenReviewInternal,
  useUpdateStatusReviewInternal,
} from "@/hooks/use-review-internal";
import ApprovalSectionReviewInternal from "./ApprovalSectionReviewInternal";
import DocumentSectionReviewInternal from "./DocumentSectionReviewInternal";
import ActivityLogSectionReviewInternal from "./ActivityLogSectionReviewInternal";

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
}

export default function Step3({ trackingId, onChatClick }: Props) {
  const { data, loading, error, refetch } = useDetailReviewInternal(trackingId);
  const uploadMut = useUploadDokumenReviewInternal(trackingId);
  const deleteMut = useDeleteDokumenReviewInternal(trackingId);
  const updateStatusMut = useUpdateStatusReviewInternal(trackingId);

  const { divisi, role } = getUserInfo();

  const isAdminSekertariat = divisi === "ADMIN_SEKERTARIAT";
  const isManajerOps = divisi === "MANAGER_OPERASIONAL";
  const isSalesPresalesSupervisi =
    divisi === "SALES" ||
    divisi === "PRESALES" ||
    (role === "SUPERVISI" && divisi === "SALES");

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
                Terjadi kesalahan saat mengambil data Review Internal. Silakan
                coba beberapa saat lagi.
              </p>

              {error && (
                <p className="rounded-lg bg-white/70 px-3 py-2 text-xs text-red-500 border border-red-100">
                  {String(error)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
  const isPerluTindakan = data.status === "PERLU_TINDAKAN";
  const isOnProgress = data.status === "ON_PROGRESS";

  // Admin Sekertariat: bisa ACC/Tolak hanya kalau ON_PROGRESS & belum acc & status bukan PERLU_TINDAKAN
  const canAdminAcc =
    isAdminSekertariat && !data.accAdminDirektur && isOnProgress;

  // Manajer Ops: bisa ACC/Tolak hanya kalau Admin sudah acc & Manajer belum acc & ON_PROGRESS
  const canManajerAcc =
    isManajerOps &&
    data.accAdminDirektur &&
    !data.accManajerOps &&
    isOnProgress;

  // Sales/Presales/Supervisi: konfirmasi ulang hanya kalau PERLU_TINDAKAN
  const canKonfirmasiUlang = isSalesPresalesSupervisi && isPerluTindakan;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <p className="animate-pulse">Memuat Review Internal...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center border border-red-100 bg-red-50 rounded-xl space-y-3">
        <p className="text-red-600 font-medium">Gagal memuat data: {error}</p>
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

  const isUpdating = updateStatusMut.isPending;

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />
        <ApprovalSectionReviewInternal
          data={data}
          canAdminAcc={canAdminAcc}
          canManajerAcc={canManajerAcc}
          canKonfirmasiUlang={canKonfirmasiUlang}
          isUpdating={isUpdating}
          onAcc={() => updateStatusMut.mutate({ status: "ACC" })}
          onPerluTindakan={(alasan) =>
            updateStatusMut.mutate({
              status: "PERLU_TINDAKAN",
              alasanPenolakan: alasan,
            })
          }
          onOnProgress={() => updateStatusMut.mutate({ status: "ON_PROGRESS" })}
        />

        <SectionHeading title="Dokumen" />
        <DocumentSectionReviewInternal
          dokumen={mappedDokumen}
          onUpload={(file) => uploadMut.mutate({ file })}
          onDelete={(id) => deleteMut.mutate(id)}
          isUploading={uploadMut.isPending}
        />
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSectionReviewInternal
          logs={mappedLogs}
          onChatClick={onChatClick}
        />
      </div>
    </div>
  );
}
