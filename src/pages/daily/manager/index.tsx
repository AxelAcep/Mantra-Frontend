import { useSearchParams } from "react-router-dom"
import { RescheduleTable } from "./card-reschedule-table"
import { SelesaiTable } from "./card-selesai-table"
import { KPIChart } from "./card-kpi-chart"   // ← tambah import
import { KaryawanTable } from "./card-karyawan"
import { CardAktifTable } from "./card-atkif-table"
import { CardRiwayatTable } from "./card-riwayat-table"
import { Badge } from "@/components/ui/badge"
import { useMasterReschedule, useMasterSelesai } from "@/hooks/use-master-activity"

// ─── Tab config ───────────────────────────────────────────────────────────────

const tabs = [
    { value: "reschedule", label: "Pengajuan Reschedule" },
    { value: "selesai", label: "Konfirmasi Selesai" },
    { value: "aktif", label: "Seluruh Aktivitas" },
    { value: "karyawan", label: "Karyawan" },
    { value: "riwayat", label: "Riwayat" },
]



export default function ActivityPageMaster() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") || "reschedule"
    const page = parseInt(searchParams.get("page") || "1", 10)

    const { data: rescheduleData } = useMasterReschedule(1, 1, "")
    const { data: selesaiData } = useMasterSelesai(1, 1, "", "", "")
    const rescheduleCount = rescheduleData?.total ?? 0
    const selesaiCount = selesaiData?.total ?? 0

    const tabCounts: Record<string, number> = {
        reschedule: rescheduleCount,
        selesai: selesaiCount,
    }

    const setActiveTab = (tab: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("tab", tab)
        params.set("page", "1")
        setSearchParams(params, { replace: true })
    }

    const setPage = (p: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", p.toString())
        setSearchParams(params, { replace: true })
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen space-y-6 overflow-x-hidden">
            <KPIChart />
            <div className="bg-slate-50 rounded-xl px-4 pt-1">
                <div className="flex gap-6 border-b border-gray-200 scrollbar-hide">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors flex items-center gap-2
                                ${activeTab === tab.value
                                    ? "border-cyan-600 text-cyan-600 font-medium"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <span>{tab.label}</span>
                            {tabCounts[tab.value] ? (
                                <Badge
                                    variant="destructive"
                                    className="rounded-full px-2 py-0.5 text-[10px] bg-red-100 text-red-600 border-none hover:bg-red-100 font-semibold"
                                >
                                    {tabCounts[tab.value]}
                                </Badge>
                            ) : null}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content */}
            {activeTab === "reschedule" && <RescheduleTable page={page} onPageChange={setPage} />}
            {activeTab === "selesai" && <SelesaiTable page={page} onPageChange={setPage} />}

            {activeTab === "aktif" && (
                <CardAktifTable page={page} onPageChange={setPage} />
            )}

            {activeTab === "karyawan" && <KaryawanTable page={page} onPageChange={setPage} />}

            {activeTab === "riwayat" && (
                <CardRiwayatTable page={page} onPageChange={setPage} />
            )}
        </div>
    )
}
