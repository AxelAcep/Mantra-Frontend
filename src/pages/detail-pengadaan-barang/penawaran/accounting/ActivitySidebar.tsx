import React from "react";


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
}

export default function ActivitySidebar({
  logs,
}: Props) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-base">Log Aktivitas</h3>
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
