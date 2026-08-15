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
        <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
          <FileText size={16} className="text-gray-500" />
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
      <div className="p-2">
        {activity ? (
          <div className="">
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
              <>
                {activity.children.map((child: any) => (
                  <div
                    key={child.id}
                    className="flex items-center justify-between bg-white rounded-xl p-4 hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">
                          {child.judul}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
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
                        className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg relative transition-colors shadow-sm"
                      >
                        <MessageCircle size={13} /> Chat
                      </button>
                      <button
                        onClick={() => navigate(`/dailyactivity/${child.id}`)}
                        className="text-cyan-500 font-bold text-xs flex items-center gap-1 hover:text-cyan-600 shrink-0"
                      >
                        Lihat Detail <ArrowRight size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </>
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
