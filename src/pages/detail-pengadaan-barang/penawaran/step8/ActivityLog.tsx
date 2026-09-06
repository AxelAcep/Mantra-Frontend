import React from "react";

export interface GaransiLogItem {
  id: number;
  user: string;
  action: string;
  description: string;
  time: string;
  date: Date;
}

interface ActivityLogSectionGaransiProps {
  logs: GaransiLogItem[];
}

function getDateLabel(date: Date) {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getDate() === b.getDate() &&
    a.getMonth() === b.getMonth() &&
    a.getFullYear() === b.getFullYear();

  if (isSameDay(date, today)) return "Hari Ini";
  if (isSameDay(date, yesterday)) return "Kemarin";
  return date.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function ActivityLogSectionGaransi({
  logs,
}: ActivityLogSectionGaransiProps) {
  const grouped = logs.reduce<Record<string, GaransiLogItem[]>>((acc, log) => {
    const label = getDateLabel(log.date);
    if (!acc[label]) acc[label] = [];
    acc[label].push(log);
    return acc;
  }, {});

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100/80">
        <h3 className="font-bold text-slate-800 text-base">Log Aktivitas</h3>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin">
        {Object.keys(grouped).length === 0 && (
          <p className="text-xs text-gray-400 text-center">
            Belum ada aktivitas.
          </p>
        )}
        {Object.entries(grouped).map(([label, items]) => (
          <div key={label} className="space-y-4">
            <div className="flex">
              <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {label}
              </p>
            </div>
            <div className="relative space-y-6 pl-5 ml-2.5 border-l-2 border-slate-50">
              {items.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-[#94a3b8]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight">
                        {item.action}
                      </p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">
                        {item.description}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {item.user}
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
