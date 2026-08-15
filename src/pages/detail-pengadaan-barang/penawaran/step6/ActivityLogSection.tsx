import React, { useState } from "react";
import { Activity, ChevronDown } from "lucide-react";

export interface LogEntry {
  id: number;
  user: string;
  action: string;
  time: string;
  date: string;
  type: "system" | "user";
}

interface ActivityLogSectionProps {
  logs: LogEntry[];
}

export default function ActivityLogSection({
  logs,
}: ActivityLogSectionProps) {
  const [showAll, setShowAll] = useState(false);
  const sorted = [...logs].reverse();
  const LIMIT = 5;
  const hasMore = sorted.length > LIMIT;
  const displayed = showAll ? sorted : sorted.slice(0, LIMIT);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4 sticky top-20 z-10">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <Activity size={16} className="text-gray-500" />
          Log Aktivitas
        </div>
      </div>

      {sorted.length === 0 ? (
        <p className="text-xs text-slate-400 text-center py-4">
          Belum ada aktivitas.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            {displayed.map((log) => (
              <div key={log.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full mt-1 shrink-0 bg-gray-400" />
                  <div className="w-px flex-1 bg-slate-100 mt-1" />
                </div>
                <div className="pb-4 min-w-0">
                  <p className="text-xs font-semibold text-slate-700 leading-tight">
                    {log.user}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {log.action}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-1">
                    {log.date} · {log.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {hasMore && !showAll && (
            <button
              onClick={() => setShowAll(true)}
              className="mt-2 w-full flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-cyan-600 hover:bg-slate-50 py-2 rounded-lg transition-colors"
            >
              <ChevronDown size={14} />
              Tampilkan semua ({sorted.length})
            </button>
          )}
        </>
      )}
    </div>
  );
}
