/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight, MessageCircle } from "lucide-react";

// ─── TYPES ──────────────────────────────────────────────────────────────────

interface LogbookCardProps {
  title: string;
  activity?: {
    id: string;
    judul: string;
    targetSelesai?: string;
    pegawai?: { nama?: string; divisi?: string };
    children?: any[];
  };
  onChatClick: (activityId: string, activityJudul: string) => void;
  onAssignPGA?: () => void;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function LogbookCard({
  title,
  activity,
  onChatClick,
  onAssignPGA,
}: LogbookCardProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-left">
      <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FileText size={16} className="text-cyan-500" />
          {title}
        </div>
        {onAssignPGA && (
          <button
            onClick={onAssignPGA}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Pilih Staff PGA
          </button>
        )}
      </div>
      <div className="p-6">
        {activity ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
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
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onChatClick(activity.id, activity.judul)}
                  className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg relative transition-colors shadow-sm"
                >
                  <MessageCircle size={13} /> Chat
                </button>
                <button
                  onClick={() => navigate(`/dailyactivity/${activity.id}`)}
                  className="text-cyan-500 font-bold text-xs flex items-center gap-1 hover:text-cyan-600"
                >
                  Lihat Detail <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Render children (Staff PGA) */}
            {activity.children && activity.children.length > 0 && (
              <div className="ml-6 pl-4 border-l-2 border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                  Penugasan Staff PGA
                </p>
                {activity.children.map((child: any) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-3 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {child.judul}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {child.pegawai?.nama ?? "—"} ·{" "}
                          {child.pegawai?.divisi?.replace("_", " ") ?? "—"} ·{" "}
                          {child.targetSelesai
                            ? new Date(child.targetSelesai).toLocaleDateString(
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
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => onChatClick(child.id, child.judul)}
                        className="flex items-center gap-1.5 text-cyan-600 bg-cyan-50 hover:bg-cyan-100 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MessageCircle size={12} /> Chat
                      </button>
                      <button
                        onClick={() => navigate(`/dailyactivity/${child.id}`)}
                        className="text-cyan-500 font-bold text-[11px] flex items-center gap-1 hover:text-cyan-600 shrink-0"
                      >
                        Detail <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-full">
              <FileText size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Belum ada logbook operasional
            </p>
            <p className="text-xs text-slate-400">
              Logbook akan muncul setelah ada aktivitas pada tahap ini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
