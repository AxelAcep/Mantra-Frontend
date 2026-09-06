import type { ReactNode } from "react";
import { Wallet, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import type { AccountingSummaryResponse } from "@/services/accounting-dashboard.service";

interface SummaryCardsProps {
  summary: AccountingSummaryResponse;
}

function Card({
  icon,
  label,
  value,
  tone,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone: "slate" | "emerald" | "amber" | "red";
}) {
  const toneClass: Record<string, string> = {
    slate: "bg-slate-50 text-slate-500",
    emerald: "bg-emerald-50 text-emerald-500",
    amber: "bg-amber-50 text-amber-500",
    red: "bg-red-50 text-red-500",
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${toneClass[tone]}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card
        icon={<Wallet size={20} />}
        label="Total PO Accounting"
        value={summary.totalPO}
        tone="slate"
      />
      <Card
        icon={<Clock size={20} />}
        label="Termin Belum Dibayar"
        value={summary.totalTerminBelum}
        tone="amber"
      />
      <Card
        icon={<CheckCircle2 size={20} />}
        label="Termin Sudah Dibayar"
        value={summary.totalTerminSudah}
        tone="emerald"
      />
      <Card
        icon={<AlertTriangle size={20} />}
        label="Mendekati Tenggat (≤2 Minggu)"
        value={summary.totalMendekati}
        tone="amber"
      />
      <Card
        icon={<AlertTriangle size={20} />}
        label="Lewat Tenggat"
        value={summary.totalLewat}
        tone="red"
      />
    </div>
  );
}
