import { AlertTriangle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { AccountingHighlightItem } from "@/services/accounting-dashboard.service";

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(nilai: number | null | undefined) {
  if (!nilai) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

function sisaWaktuLabel(item: AccountingHighlightItem) {
  if (item.flag === "LEWAT") {
    return `Terlambat ${Math.abs(item.hariTersisa)} hari`;
  }
  if (item.hariTersisa <= 0) return "Jatuh tempo hari ini";
  return `${item.hariTersisa} hari lagi`;
}

interface HighlightSectionProps {
  highlights: AccountingHighlightItem[];
}

export default function HighlightSection({ highlights }: HighlightSectionProps) {
  if (highlights.length === 0) return null;

  return (
    <div className="bg-red-50/60 border-2 border-red-200 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-red-200 flex items-center gap-2 bg-red-100/60">
        <AlertTriangle size={18} className="text-red-600" />
        <h3 className="font-bold text-red-700 text-sm">
          Termin Perlu Perhatian ({highlights.length})
        </h3>
        <span className="text-xs text-red-500 font-medium ml-1">
          — lewat tenggat atau jatuh tempo dalam 2 minggu
        </span>
      </div>

      <div className="divide-y divide-red-100">
        {highlights.map((item) => (
          <div
            key={item.itemTerminId}
            className="p-4 flex flex-wrap items-center justify-between gap-3 hover:bg-red-50 transition-colors"
          >
            <div className="min-w-[220px]">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-800">
                  {item.nomorPenawaran}
                </p>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${
                    item.flag === "LEWAT"
                      ? "bg-red-600 text-white"
                      : item.flag === "1_MINGGU"
                        ? "bg-amber-500 text-white"
                        : "bg-amber-100 text-amber-700"
                  }`}
                >
                  {sisaWaktuLabel(item)}
                </span>
              </div>
              <p className="text-xs text-gray-500">{item.perusahaanName}</p>
            </div>

            <div className="text-xs text-gray-500">
              <p className="font-semibold text-slate-700">{item.namaTermin}</p>
              <p>{item.persentase}% {formatRupiah(item.nominal) ? `· ${formatRupiah(item.nominal)}` : ""}</p>
            </div>

            <div className="text-xs text-gray-500">
              <p className="text-[10px] uppercase font-bold text-gray-400">
                Deadline
              </p>
              <p className="font-semibold text-slate-700">
                {formatTanggal(item.deadline)}
              </p>
            </div>

            <Link
              to={`/penawaran/${item.trackingId}`}
              className="inline-flex items-center gap-1 text-cyan-600 font-semibold text-xs hover:text-cyan-700 transition-colors shrink-0"
            >
              Lihat Detail <ArrowRight size={14} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
