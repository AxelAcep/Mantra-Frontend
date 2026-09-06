import { ShieldAlert } from "lucide-react";
import { useAccountingSummary } from "@/hooks/use-accounting-dashboard";
import SummaryCards from "./SummaryCards";
import HighlightSection from "./HighlightSection";
import POTable from "./POTable";

const ALLOWED_DIVISI = [
  "FINANCE_ACCOUNTING",
  "MANAGER_OPERASIONAL",
  "DIREKTUR",
  "KOMISARIS",
];

function getUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      divisi: user.pegawai?.divisi ?? "",
      role: user.role ?? "",
    };
  } catch {
    return { divisi: "", role: "" };
  }
}

function canAccessAccountingDashboard(divisi: string, role: string) {
  return role === "MASTER" || ALLOWED_DIVISI.includes(divisi);
}

export default function AccountingDashboardPage() {
  const { divisi, role } = getUserInfo();
  const canAccess = canAccessAccountingDashboard(divisi, role);

  const { data: summary, isLoading, isError } = useAccountingSummary(canAccess);

  if (!canAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mx-auto">
            <ShieldAlert size={22} className="text-red-500" />
          </div>
          <h2 className="font-bold text-slate-800">Tidak Punya Akses</h2>
          <p className="text-sm text-gray-500">
            Dashboard Accounting cuma bisa diakses oleh divisi Finance
            Accounting, Manager Operasional, Direktur, dan Komisaris.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 p-6 font-sans min-h-screen">
      <div className="mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Dashboard Accounting
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau progres termin pembayaran dari seluruh PO yang sudah masuk
            tahap Accounting.
          </p>
        </div>

        {isLoading && (
          <p className="text-sm text-gray-400 animate-pulse">
            Memuat ringkasan...
          </p>
        )}
        {isError && (
          <p className="text-sm text-red-500">
            Gagal memuat ringkasan dashboard Accounting.
          </p>
        )}

        {summary && (
          <>
            <SummaryCards summary={summary} />
            <HighlightSection highlights={summary.highlights} />
          </>
        )}

        <div>
          <h2 className="font-bold text-slate-800 text-sm mb-3">
            Semua PO Accounting
          </h2>
          <POTable />
        </div>
      </div>
    </div>
  );
}
