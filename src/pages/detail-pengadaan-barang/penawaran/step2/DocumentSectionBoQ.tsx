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
import { useUnreadChatCount } from "@/hooks/use-activity";

interface DocumentSectionBoQProps {
  trackingId: string;
  status?: string;
  dokumen: Array<{
    id: string;
    namaFile: string;
    path: string;
    createdAt: string;
    uploadedBy?: string;
    pegawai?: { id: string; nama: string; divisi?: string };
  }>;
  onChatClick: (activityId: string, activityJudul: string) => void;
  activity?: {
    id: string;
    judul: string;
    createdAt: string;
    targetSelesai?: string;
    pegawai?: { nama?: string; divisi?: string };
  };
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}

function formatDateTime(isoString: string) {
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
}

export default function DocumentSectionBoQ({
  dokumen,
  activity,
  status,
  onChatClick,
  onUpload,
  onDelete,
}: DocumentSectionBoQProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentPegawaiId = React.useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.pegawai?.id ?? "";
    } catch {
      return "";
    }
  }, []);

  const { data: unreadChat = 0 } = useUnreadChatCount(activity?.id ?? "");

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(file);
    e.target.value = "";
  }

  const isOverdue = React.useMemo(() => {
    if (status === "DITERIMA" || status === "SELESAI") return false;
    if (status === "OVERDUE") return true;
    if (!activity?.targetSelesai) return false;
    const targetTime = new Date(activity.targetSelesai).getTime();
    const nowTime = new Date().getTime();
    return targetTime - nowTime <= 0;
  }, [status, activity?.targetSelesai]);

  const badgeColor = (() => {
    if (status === "DITERIMA" || status === "SELESAI") {
      return "bg-green-50 text-green-600 border-green-100 hover:bg-green-100";
    }
    if (isOverdue) {
      return "bg-red-50 text-red-600 border-red-100 hover:bg-red-100";
    }
    return "bg-amber-50 text-amber-500 border-amber-100 hover:bg-amber-100";
  })();

  const badgeLabel =
    status === "ON_PROGRESS"
      ? isOverdue
        ? "Overdue"
        : "Proses"
      : status === "SELESAI"
        ? "Selesai"
        : (status ?? "-");

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
            {status === "DITERIMA" || status === "SELESAI" ? (
              <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                <CheckCircle2 size={13} /> Diterima
              </span>
            ) : (
              <button
                className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors uppercase ${badgeColor}`}
              >
                <CheckCircle2 size={13} /> {badgeLabel}
              </button>
            )}
          </div>
        </div>

        <div className="p-2">
          {activity ? (
            <div className="flex items-center justify-between bg-white rounded-xl p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {activity.judul}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.pegawai?.nama ?? "—"} ·{" "}
                    {activity.pegawai?.divisi ?? "—"} ·{" "}
                    {activity.targetSelesai
                      ? new Date(activity.targetSelesai).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onChatClick(activity.id, activity.judul)}
                  className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg relative transition-colors shadow-sm"
                >
                  <MessageCircle size={12} /> Chat
                  {unreadChat > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[8px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {unreadChat > 9 ? "9+" : unreadChat}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => navigate(`/dailyactivity/${activity.id}`)}
                  className="text-cyan-500 font-bold text-xs flex items-center gap-1 hover:text-cyan-600"
                >
                  Lihat Detail <ArrowRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada logbook.
            </p>
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
            className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={14} />
            Upload File
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar"
          />
        </div>

        <div className="p-2 space-y-1">
          {dokumen.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada dokumen.
            </p>
          ) : (
            dokumen.map((item) => (
              <DocumentItem
                key={item.id}
                name={item.namaFile}
                size={`${item.pegawai?.nama || item.uploadedBy || "System"} pada ${formatDateTime(item.createdAt)}`}
                path={item.path}
                allowDelete={currentPegawaiId === item.uploadedBy}
                onDelete={() => onDelete(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
