import React from "react";
import { MessageSquare } from "lucide-react";

interface LogItem {
  id: number;
  user: string;
  action: string;
  time: string;
  date: string;
}

interface GroupedLog {
  date: string;
  items: LogItem[];
}

interface Props {
  logs: LogItem[];
  onChatClick: () => void;
}

export default function ActivityLogSectionPersetujuan({
  logs,
  onChatClick,
}: Props) {
  const grouped = logs.reduce<GroupedLog[]>((acc, log) => {
    const existing = acc.find((g) => g.date === log.date);
    if (existing) existing.items.push(log);
    else acc.push({ date: log.date, items: [log] });
    return acc;
  }, []);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-base">Log Aktivitas</h3>
        <button
          onClick={onChatClick}
          className="flex items-center gap-2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-cyan-600 transition-all shadow-sm active:scale-95"
        >
          <MessageSquare size={14} />
          Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin">
        {grouped.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            Belum ada aktivitas.
          </p>
        ) : (
          grouped.map((section) => (
            <div key={section.date} className="space-y-4">
              <div className="flex">
                <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {section.date}
                </p>
              </div>
              <div className="relative space-y-6 pl-5 ml-2.5 border-l-2 border-slate-50">
                {section.items.map((item) => (
                  <div key={item.id} className="relative">
                    <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                    </div>
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800 leading-tight">
                          {item.action}
                        </p>
                        <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                          {item.user}
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-400 font-semibold shrink-0">
                        {item.time}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
