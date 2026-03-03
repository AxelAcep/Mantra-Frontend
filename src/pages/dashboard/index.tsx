import CardJadwalUlang from "./card-penawaran-Single";
import DailyActivityReport from "./card-daily-activity-report";
import LogbookMonitoring from "./card-logbook-monitoring";
import KpiKaryawan from "./card-kpi-karyawan";
import CardPenawaranDouble from "./card-penawaran-Double";

export default function DashboardPage() {
    return (
        <div className="p-3">
            <h1 className="text-md font-bold tracking-tight text-slate-500">
                RINGKASAN OPERASIONAL
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-7 gap-4 mt-6">
                <CardPenawaranDouble title="REQUEST PENAWARAN" value1={12} value2={5} link1="/request-penawaran" link2="/request-penawaran" />
                <CardPenawaranDouble title="PENAWARAN APPROVAL" value1={45} value2={18} link1="/penawaran-approval" link2="/penawaran-approval" />
                <CardPenawaranDouble title="PENAWARAN FINAL" value1={8} value2={0} link1="/penawaran-final" link2="/penawaran-final" />
                <CardPenawaranDouble title="PO AKTIF" value1={24} value2={3} link1="/po-aktif" link2="/po-aktif" />
                <CardJadwalUlang title="Pengadaan Barang" value1={12} desc="Pengadaan Barang" link="/pengadaan-barang" />
                <CardPenawaranDouble title="KONFIRMASI SELESAI" value1={8} value2={2} link1="/konfirmasi-selesai" link2="/konfirmasi-selesai" />
                <CardJadwalUlang title="Jadwal Ulang" value1={5} desc="Jadwal Ulang" link="/jadwal-ulang" />
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