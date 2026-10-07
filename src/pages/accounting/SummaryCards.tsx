import type { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { Wallet, CheckCircle2, AlertTriangle, Clock } from "lucide-react";
import type { AccountingSummaryResponse } from "@/services/accounting-dashboard.service";

interface SummaryCardsProps {
  summary: AccountingSummaryResponse;
}

/** Kombinasi filter tabel yang dipasang saat card diklik. */
type CardFilter = { status?: string; flag?: string };

function Card({
  icon,
  label,
  value,
  tone,
  active,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  value: number;
  tone: "slate" | "emerald" | "amber" | "red";
  active: boolean;
  onClick: () => void;
}) {
  const toneClass: Record<string, string> = {
    slate: "bg-slate-50 text-slate-500",
    emerald: "bg-emerald-50 text-emerald-500",
    amber: "bg-amber-50 text-amber-500",
    red: "bg-red-50 text-red-500",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={active ? `Klik lagi untuk melepas filter ${label}` : `Filter tabel: ${label}`}
      className={`w-full text-left bg-white border rounded-xl p-5 shadow-sm flex items-center gap-4 transition-colors cursor-pointer hover:border-cyan-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500/40 ${
        active ? "border-cyan-500 ring-2 ring-cyan-500/20" : "border-gray-100"
      }`}
    >
      <div className={`p-3 rounded-xl ${toneClass[tone]}`}>{icon}</div>
      <div>
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
          {label}
        </p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </button>
  );
}

export default function SummaryCards({ summary }: SummaryCardsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = searchParams.get("status") ?? "";
  const flag = searchParams.get("flag") ?? "";
  const adaFilter = Boolean(status || flag);

  const isActive = (filter: CardFilter) =>
    status === (filter.status ?? "") && flag === (filter.flag ?? "");

  /** Klik card aktif = lepas filter; selain itu pasang filter card tsb. */
  const applyFilter = (filter: CardFilter) => {
    const next = new URLSearchParams(searchParams);
    const lepas = isActive(filter);
    const nilai: CardFilter = lepas ? {} : filter;

    for (const name of ["status", "flag"] as const) {
      if (nilai[name]) next.set(name, nilai[name] as string);
      else next.delete(name);
    }
    // Hasil filter baru belum tentu punya halaman sebanyak sebelumnya.
    next.delete("page");

    setSearchParams(next, { replace: true });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      <Card
        icon={<Wallet size={20} />}
        label="Total PO Accounting"
        value={summary.totalPO}
        tone="slate"
        active={!adaFilter}
        onClick={() => applyFilter({})}
      />
      <Card
        icon={<Clock size={20} />}
        label="Termin Belum Dibayar"
        value={summary.totalTerminBelum}
        tone="amber"
        active={isActive({ status: "BELUM_LUNAS" })}
        onClick={() => applyFilter({ status: "BELUM_LUNAS" })}
      />
      <Card
        icon={<CheckCircle2 size={20} />}
        label="Termin Sudah Dibayar"
        value={summary.totalTerminSudah}
        tone="emerald"
        active={isActive({ status: "LUNAS" })}
        onClick={() => applyFilter({ status: "LUNAS" })}
      />
      <Card
        icon={<AlertTriangle size={20} />}
        label="Mendekati Tenggat (≤2 Minggu)"
        value={summary.totalMendekati}
        tone="amber"
        active={isActive({ flag: "MENDEKATI" })}
        onClick={() => applyFilter({ flag: "MENDEKATI" })}
      />
      <Card
        icon={<AlertTriangle size={20} />}
        label="Lewat Tenggat"
        value={summary.totalLewat}
        tone="red"
        active={isActive({ status: "OVERDUE" })}
        onClick={() => applyFilter({ status: "OVERDUE" })}
      />
    </div>
  );
}
