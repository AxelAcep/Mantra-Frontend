import CardRequestPenawaran from "./card-request-penawaran";
import CardPenawaranApproval from "./card-penawaran-approval";
import CardPenawaranFinal from "./card-penawaran-final";
import CardPOAktif from "./card-po-aktif";
import CardPenawaranPengadaan from "./card-penawaran-pengadaan";
import CardKonfirmasiSelesai from "./card-konfirmasi-selesai";
import CardJadwalUlang from "./card-jadwal-ulang";
import DailyActivityReport from "./card-daily-activity-report";
import LogbookMonitoring from "./card-logbook-monitoring";
import KpiKaryawan from "./card-kpi-karyawan";

export default function DashboardPage() {
    return (
        <div className="p-3">
            <h1 className="text-xl font-bold tracking-tight text-slate-500">
                Ringkasan Operasional
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mt-6">
                <CardRequestPenawaran />
                <CardPenawaranApproval />
                <CardPenawaranFinal />
                <CardPOAktif />
                <CardPenawaranPengadaan />
                <CardKonfirmasiSelesai />
                <CardJadwalUlang />
            </div>

            <div className="mt-6">
                <DailyActivityReport />
            </div>

            <div className="mt-6">
                <LogbookMonitoring />
            </div>

            <div className="mt-6">
                <KpiKaryawan />
            </div>
        </div>
    );
}