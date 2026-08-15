/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useRef } from "react";
import {
  FileText,
  Upload,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DocumentItem } from "../components";
import type { FollowUpDokumen } from "@/services/follow-up.services";
import { useUnreadChatCount, useDetailActivity } from "@/hooks/use-activity";

interface ActivityRowProps {
  act: {
    id: string;
    judul: string;
    role: string;
    targetSelesai?: string;
    pegawai?: { nama?: string };
  };
  onChatClick: (activityId: string, activityJudul: string) => void;
}

function ActivityRow({ act, onChatClick }: ActivityRowProps) {
  const navigate = useNavigate();
  const { data: unreadChat = 0 } = useUnreadChatCount(act.id);

  return (
    <div
      key={act.id}
      className="flex items-center justify-between bg-white rounded-xl p-4 hover:bg-slate-50 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-gray-50 rounded-lg text-gray-500 shrink-0">
          <FileText size={18} />
        </div>

        <div>
          <p className="text-sm font-bold text-slate-800">{act.judul}</p>

          <p className="text-xs text-gray-400">
            {act.pegawai?.nama ?? "—"} · {act.role} ·{" "}
            {act.targetSelesai
              ? new Date(act.targetSelesai).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
              : "—"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => onChatClick(act.id, act.judul)}
          className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg relative transition-colors shadow-sm"
        >
          <MessageCircle size={13} />
          Chat
          {unreadChat > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
              {unreadChat > 9 ? "9+" : unreadChat}
            </span>
          )}
        </button>

        <button
          onClick={() => navigate(`/dailyactivity/${act.id}`)}
          className="text-cyan-500 font-bold text-xs flex items-center gap-1 hover:text-cyan-600"
        >
          Lihat Detail <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}

interface DocumentSectionFollowUpProps {
  dokumen: FollowUpDokumen[];
  isUploading: boolean;

  activityAdmin?: {
    id: string;
    judul: string;
    status: string;
    createdAt: string;
    targetSelesai?: string;
    pegawai?: {
      nama?: string;
      divisi?: string;
    };
  };

  activitySales?: {
    id: string;
    judul: string;
    status: string;
    createdAt: string;
    targetSelesai?: string;
    pegawai?: {
      nama?: string;
      divisi?: string;
    };
  };

  activityAdminProyek?: {
    id: string;
    judul: string;
    status: string;
    createdAt: string;
    targetSelesai?: string;
    pegawai?: {
      nama?: string;
      divisi?: string;
    };
  };

  onChatClick: (activityId: string, activityJudul: string) => void;
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}

export default function DocumentSectionFollowUp({
  dokumen,
  isUploading,
  activityAdmin,
  activitySales,
  activityAdminProyek,
  onChatClick,
  onUpload,
  onDelete,
}: DocumentSectionFollowUpProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPegawaiId = React.useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.pegawai?.id ?? "";
    } catch {
      return "";
    }
  }, []);

  const { data: adminActivityDetail } = useDetailActivity(
    activityAdmin?.id ?? "",
  );

  const { data: salesActivityDetail } = useDetailActivity(
    activitySales?.id ?? "",
  );

  const { data: adminProyekDetail } = useDetailActivity(
    activityAdminProyek?.id ?? "",
  );

  const combinedDokumen = React.useMemo(() => {
    const formatDateTime = (isoString: string) => {
      if (!isoString) return "-";

      const date = new Date(isoString);

      const dateStr = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      const timeStr =
        date.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }) + " WIB";

      return `${dateStr} pukul ${timeStr}`;
    };

    const stepDocs = dokumen.map((doc) => ({
      id: doc.id,
      namaFile: doc.namaFile,
      path: doc.path,
      createdAt: doc.createdAt,
      uploaderInfo: `${doc.pegawai?.nama || doc.uploadedBy || "System"
        } pada ${formatDateTime(doc.createdAt)}`,
      source: "step" as const,
      uploadedBy: doc.uploadedBy || "",
    }));

    const adminDocs =
      adminActivityDetail?.data?.dokumen?.map((doc: any) => ({
        id: doc.id,
        namaFile: doc.namaFile,
        path: doc.path,
        createdAt: doc.createdAt,
        uploaderInfo: `${doc.pegawai?.nama || doc.uploadedBy || "Karyawan"
          } pada ${formatDateTime(doc.createdAt)} - ${activityAdmin?.judul || "Admin Sekretariat"
          }`,
        source: "activity" as const,
        uploadedBy: doc.uploadedBy || "",
      })) ?? [];

    const salesDocs =
      salesActivityDetail?.data?.dokumen?.map((doc: any) => ({
        id: doc.id,
        namaFile: doc.namaFile,
        path: doc.path,
        createdAt: doc.createdAt,
        uploaderInfo: `${doc.pegawai?.nama || doc.uploadedBy || "Karyawan"
          } pada ${formatDateTime(doc.createdAt)} - ${activitySales?.judul || "Sales PIC"
          }`,
        source: "activity" as const,
        uploadedBy: doc.uploadedBy || "",
      })) ?? [];

    const seenPaths = new Set<string>();

    const result: Array<{
      id: string;
      namaFile: string;
      path: string;
      createdAt: string;
      uploaderInfo: string;
      source: "step" | "activity";
      uploadedBy: string;
    }> = [];

    stepDocs.forEach((d) => {
      if (!seenPaths.has(d.path)) {
        seenPaths.add(d.path);
        result.push(d);
      }
    });

    adminDocs.forEach((d) => {
      if (!seenPaths.has(d.path)) {
        seenPaths.add(d.path);
        result.push(d);
      }
    });

    salesDocs.forEach((d) => {
      if (!seenPaths.has(d.path)) {
        seenPaths.add(d.path);
        result.push(d);
      }
    });

    return result;
  }, [
    dokumen,
    adminActivityDetail,
    salesActivityDetail,
    adminProyekDetail,
    activityAdmin?.judul,
    activitySales?.judul,
  ]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (!file) return;

    onUpload(file);
    e.target.value = "";
  }

  // Daily Activity:
  // Admin Sekretariat -> Admin Proyek -> Sales PIC
  const activities = [
    ...(activityAdmin ? [{ ...activityAdmin, role: "Admin Sekretariat" }] : []),

    ...(activityAdminProyek
      ? [{ ...activityAdminProyek, role: "Admin Proyek" }]
      : []),

    ...(activitySales ? [{ ...activitySales, role: "Sales PIC" }] : []),
  ];

  const followUpStatus = (() => {
    if (
      activitySales?.status === "DITERIMA" &&
      activityAdmin?.status === "DITERIMA" &&
      activityAdminProyek?.status === "DITERIMA"
    ) {
      return "SELESAI";
    }

    return "ON_PROGRESS";
  })();

  const followUpStatusLabel =
    followUpStatus === "ON_PROGRESS" ? "Proses" : "Selesai";

  const followUpStatusColor = (() => {
    if (followUpStatus === "SELESAI") {
      return "bg-green-50 text-green-600 border-green-100 hover:bg-green-100";
    }

    return "bg-amber-50 text-amber-500 border-amber-100 hover:bg-amber-100";
  })();

  return (
    <div className="space-y-6">
      {/* ── Logbook Operasional ── */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
            <FileText size={16} className="text-gray-500" />
            Logbook Operasional
          </div>

          <div className="flex gap-2">
            {followUpStatus === "SELESAI" ? (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                <CheckCircle2 size={13} /> Diterima
              </span>
            ) : (
              <button
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors uppercase ${followUpStatusColor}`}
              >
                <CheckCircle2 size={13} /> {followUpStatusLabel}
              </button>
            )}
          </div>
        </div>

        <div className="p-2">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada logbook/daily activity untuk tahap ini.
            </p>
          ) : (
            activities.map((act) => (
              <ActivityRow key={act.id} act={act} onChatClick={onChatClick} />
            ))
          )}
        </div>
      </div>

      {/* ── Dokumen Pendukung ── */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
            <FileText size={16} className="text-gray-500" />
            Dokumen Pendukung
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={14} />
            {isUploading ? "Mengupload..." : "Upload File"}
          </button>

          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar"
          />
        </div>

        <div className="p-2">
          {combinedDokumen.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada dokumen pendukung yang diunggah.
            </p>
          ) : (
            combinedDokumen.map((item) => (
              <DocumentItem
                key={item.id}
                name={item.namaFile}
                size={item.uploaderInfo}
                path={item.path}
                allowDelete={
                  item.source === "step" && currentPegawaiId === item.uploadedBy
                }
                onDelete={() => onDelete(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
