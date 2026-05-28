import React from "react";
import { MessageSquareText } from "lucide-react";

interface LogItem {
  id: number;
  title: string;
  description: string;
  time: string;
}

interface LogSection {
  title: string;
  items: LogItem[];
}

interface Props {
  logs: LogSection[];
  onChatClick: () => void;
  unreadCount?: number;
}

export default function ActivitySidebar({
  logs,
  onChatClick,
  unreadCount = 0,
}: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-base">Log Aktivitas</h3>
        <button
          onClick={onChatClick}
          className="flex items-center gap-2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold relative hover:bg-cyan-600 transition-all shadow-sm active:scale-95"
        >
          <MessageSquareText size={16} />
          Chat
          {unreadCount > 0 && (
            <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm font-bold">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin">
        {logs.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex">
              <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {section.title}
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
                        {item.title}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        {item.description}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                      {item.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
