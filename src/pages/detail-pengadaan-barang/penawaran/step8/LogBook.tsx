import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, ArrowRight, CheckCircle2 } from "lucide-react";

export interface LogbookMonthItem {
  monthId: string;
  bulanKe: number;
  activityId?: string;
  judul?: string;
  status?: string;
  namaPegawai?: string;
  targetSelesai?: string;
}

interface LogBookSectionProps {
  logbook: LogbookMonthItem[];
}

export default function LogBookSection({ logbook }: LogBookSectionProps) {
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FileText size={16} className="text-cyan-500" /> Logbook Operasional
        </div>
      </div>

      <div className="p-2">
        {logbook.length === 0 ? (
          <p className="text-xs text-slate-400 text-center py-6">
            Belum ada kunjungan garansi yang berjalan.
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {logbook.map((item) => (
              <div
                key={item.monthId}
                className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg group transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-slate-800">
                        {item.judul ?? `Kunjungan Garansi Bulan ke-${item.bulanKe}`}
                      </p>
                      {item.status === "DITERIMA" && (
                        <span className="flex items-center gap-1 text-[9px] font-semibold text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 size={10} /> Diterima
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-0.5 font-medium">
                      {item.namaPegawai ?? "-"}
                      {item.targetSelesai
                        ? ` • Target ${new Date(item.targetSelesai).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })}`
                        : ""}
                    </p>
                  </div>
                </div>
                {item.activityId && (
                  <button
                    onClick={() => navigate(`/dailyactivity/${item.activityId}`)}
                    className="text-cyan-500 font-bold text-[10px] flex items-center gap-1 hover:underline shrink-0"
                  >
                    Lihat Detail <ArrowRight size={12} />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
