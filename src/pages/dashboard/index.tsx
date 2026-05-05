import DailyActivityReport from "./card-daily-activity-report";
import LogbookMonitoring from "./card-logbook-monitoring";
import KpiKaryawan from "./card-kpi-karyawan";
import CardRingkasan from "./card-ringaksan";
import { useEffect } from "react";
import { useHeaderTitle } from "../../components/layout/layout"; // sesuaikan path
import { Icons } from "@/assets";
import { useMasterStats } from "@/hooks/use-kpi";

export default function DashboardPage() {
    const { setTitle } = useHeaderTitle();
    const { data: stats } = useMasterStats();

    useEffect(() => {
        setTitle("Dashboard Operasional");
    }, [setTitle]);

    return (
        <div className="p-6">
            <h1 className="text-md font-bold tracking-tight text-slate-500">
                RINGKASAN OPERASIONAL
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mt-6">
                <CardRingkasan
                    title="PENGADAAN BARANG"
                    count={12}
                    label="Request Penawaran"
                    icon={Icons.RequestPenawaran}
                    href="/dashboard/request-penawaran"
                    linkText="Lihat →"
                />
                <CardRingkasan
                    title="PENGADAAN BARANG"
                    count={45}
                    label="Penawaran Approval"
                    icon={Icons.PenawaranApproval}
                    href="/dashboard/penawaran-approval"
                    linkText="Tinjau →"
                />
                <CardRingkasan
                    title="PENGADAAN BARANG"
                    count={8}
                    label="Penawaran Final"
                    icon={Icons.PenawaranFinal}
                    href="/dashboard/penawaran-final"
                    linkText="Tinjau →"
                />
                <CardRingkasan
                    title="PENGADAAN BARANG"
                    count={12}
                    label="PO Aktif"
                    icon={Icons.POAktif}
                    href="/dashboard/po-aktif"
                    linkText="Lihat →"
                />
                <CardRingkasan
                    title="PENGADAAN BARANG"
                    count={24}
                    label="Penawaran Pengadaan"
                    icon={Icons.PenawaranPengadaan}
                    href="/dashboard/pengadaan-barang"
                    linkText="Tinjau →"
                />
                <CardRingkasan
                    title="PENGADAAN BARANG"
                    count={3}
                    label="Konfirmasi Selesai"
                    icon={Icons.KonfirmasiSelesai}
                    href="/dashboard/konfirmasi-selesai"
                    linkText="Tinjau →"
                />
                <CardRingkasan
                    title="DAILY ACTIVITY REPORT"
                    count={stats?.pengajuanReschedule ?? 0}
                    label="Reschedule"
                    icon={Icons.JadwalUlang}
                    href="/dailyactivity?tab=reschedule"
                    linkText="Tinjau →"
                />
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