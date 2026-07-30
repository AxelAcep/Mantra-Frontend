import React from "react";
import { User } from "lucide-react";
import {
  useDetailFollowUp,
  useUpdateStatusFollowUp,
  useUploadDokumenFollowUp,
  useDeleteDokumenFollowUp,
} from "@/hooks/use-follow-up";
import ApprovalSectionFollowUp from "./ApprovalSectionFollowUp";
import DocumentSectionFollowUp from "./DocumentSectionFollowUp";
import ActivityLogSectionFollowUp from "./ActivityLogSectionFollowUp";
import AdminProyekUpload from "./AdminProyekUpload";
import ManagerProyekCard from "./AssignAdminProyekCard";

interface Step5Props {
  trackingId: string;
  onChatClick: (activityId: string, activityJudul: string) => void;
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

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

export default function Step5({
  trackingId,
  onChatClick,
  onStatusChange,
}: Step5Props) {
  const { data, loading, error, refetch } = useDetailFollowUp(trackingId);
  const updateStatusMut = useUpdateStatusFollowUp(trackingId);
  const uploadMut = useUploadDokumenFollowUp(trackingId);
  const deleteMut = useDeleteDokumenFollowUp(trackingId);

  const { pegawaiId, divisi, role } = getUserInfo();

  const isManagerOps = divisi === "MANAGER_OPERASIONAL" || role === "MASTER";
  const isAdminProyek =
    (divisi === "MAINTENANCE_PAC" || divisi === "MAINTENANCE_FIRE") &&
    role == "SUPERVISI";
  const isSalesPIC = data
    ? pegawaiId === data.salesId && divisi !== "ADMIN_SEKERTARIAT"
    : false;

  const isKonfirmasiSelesai = data?.status === "KONFIRMASI_SELESAI";
  const isPerluTindakan = data?.status === "PERLU_TINDAKAN";

  const canAcc = isManagerOps && isKonfirmasiSelesai;
  const canKonfirmasiUlang = isSalesPIC && isPerluTindakan;
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

  React.useEffect(() => {
    if (data) {
      onStatusChange?.(handlers);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data?.status, canAcc, canKonfirmasiUlang, isUpdating]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <p className="animate-pulse">Memuat data Follow Up...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 text-center border border-red-100 bg-red-50 rounded-xl space-y-3">
        <p className="text-red-600 font-medium">
          Gagal memuat data Follow Up: {error}
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

  const tracking = data.trackingPenawaran;
  const salesName = tracking?.marketing?.nama || "Sales PIC";
  const customerName = tracking?.customerName || "Customer Name";
  const customerPhone = tracking?.customerPhone || "-";
  const customerEmail = tracking?.customerEmail || "-";

  const isAdminSekertariat = divisi === "ADMIN_SEKERTARIAT";

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

  const mappedDokumen = data.dokumen ?? [];

  // Generate initials for Sales Avatar
  const salesInitials = salesName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-5">
              <User size={16} className="text-cyan-500" /> PIC Follow Up
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-lg shrink-0">
                {salesInitials}
              </div>
              <div>
                <p className="text-xl font-bold text-slate-800 leading-tight">
                  {salesName}
                </p>
                <p className="text-sm text-gray-400 font-medium mt-1">
                  Sales Marketing
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 text-slate-800 font-bold text-sm mb-5">
              <User size={16} className="text-cyan-500" /> Kontak Klien
            </div>
            <div className="grid grid-cols-2 gap-4 bg-slate-50/60 rounded-xl border border-gray-100 p-5">
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Customer Name
                </p>
                <p className="text-base font-bold text-slate-800">
                  {customerName}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-medium mb-1">Kontak</p>
                <p className="text-sm font-bold text-slate-800 break-all">
                  {customerEmail} <br />
                  <span className="text-xs text-gray-400 font-medium font-mono">
                    {customerPhone}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
        <ApprovalSectionFollowUp
          stage={data.stage}
          status={data.status}
          logs={data.logs}
          customerName={customerName}
          salesName={salesName}
          isAdminSekertariat={isAdminSekertariat}
          isSalesPIC={isSalesPIC}
          isUpdating={updateStatusMut.isPending}
          onUpdateStage={(nextStage) =>
            updateStatusMut.mutate({ stage: nextStage })
          }
          onUpdateStatus={(nextStatus) =>
            updateStatusMut.mutate({ status: nextStatus })
          }
        />

        <SectionHeading title="Admin Proyek" />
        <ManagerProyekCard
          followUpId={data.id}
          currentNama={data.activityAdminProyek?.status}
          onAssigned={refetch}
        />

        {data.stage >= 3 && (
          <>
            <SectionHeading title="Upload Dokumen PO" />
            <AdminProyekUpload
              dokumen={mappedDokumen}
              isUploading={uploadMut.isPending}
              isAdminProyek={
                ((divisi === "MAINTENANCE_PAC" ||
                  divisi === "MAINTENANCE_FIRE") &&
                  role === "SUPERVISI" &&
                  data.activityAdminProyek?.status === "DITERIMA") ||
                role === "MASTER" ||
                divisi === "MANAGER_OPERASIONAL" ||
                divisi === "MONITORING_CONTROL_ADVISOR"
              }
              onUpload={(file, kategori) =>
                uploadMut.mutate({ file, kategori })
              }
              onDelete={(id) => deleteMut.mutate(id)}
            />
          </>
        )}

        <DocumentSectionFollowUp
          dokumen={mappedDokumen}
          isUploading={uploadMut.isPending}
          activityAdmin={data.activityAdmin}
          activitySales={data.activitySales}
          activityAdminProyek={data.activityAdminProyek}
          onChatClick={onChatClick}
          onUpload={(file) => uploadMut.mutate({ file })}
          onDelete={(id) => deleteMut.mutate(id)}
        />
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSectionFollowUp logs={mappedLogs} />
      </div>
    </div>
  );
}
