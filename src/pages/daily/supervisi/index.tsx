import { useSearchParams } from "react-router-dom"
import { useListParams } from "@/hooks/use-list-params"
import { Icons } from "@/assets"
import { StatCard } from "./card-stat"
import { CardAktifTable } from "./card-atkif-table"
import { CardRiwayatTable } from "./card-riwayat-table"
import { useSupervisiDashboardStats } from "@/hooks/use-supervisi"

const tabs = [
    { value: "aktifitas", label: "Aktivitas" },
    { value: "riwayat", label: "Riwayat" },
]

function TabContent({ activeTab, page, onPageChange }: {
    activeTab: string
    page: number
    onPageChange: (p: number) => void
}) {
    if (activeTab === "riwayat") {
        return <CardRiwayatTable page={page} onPageChange={onPageChange} />
    }
    return <CardAktifTable page={page} onPageChange={onPageChange} />
}

export default function ActivityPageSupervisi() {
    const [searchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") || "aktifitas"

    const { page, filters, setPage, update } = useListParams({ filters: { deadline: "" } })
    const deadlineFilter = filters.deadline

    const { data: stats, isLoading: statsLoading } = useSupervisiDashboardStats()

    const setActiveTab = (tab: string) => update({ tab, deadline: undefined })

    /**
     * Card ringkasan jadi shortcut filter. Filter deadline hanya berlaku di tab
     * Aktivitas, karena angka di card memang dihitung dari aktivitas berjalan.
     */
    const applyShortcut = (deadline?: string) => {
        if ((deadline ?? "") === deadlineFilter && activeTab === "aktifitas") {
            update({ tab: "aktifitas", deadline: undefined })
            return
        }
        update({ tab: "aktifitas", deadline })
    }

    const isShortcutAktif = (deadline?: string) =>
        activeTab === "aktifitas" && (deadline ?? "") === deadlineFilter

    return (
        <div className="p-6 bg-slate-50 min-h-screen space-y-8">
            {/* Stat Cards */}
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
                <div>
                    <h1 className="text-xl font-bold">Ringkasan Aktivitas Staff</h1>
                    <p className="text-muted-foreground text-sm">
                        Pantau seluruh aktivitas operasional harian, status pengerjaan, dan tindak lanjut yang diperlukan agar target dapat tercapai secara optimal.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border border-gray-200 p-6 rounded-xl shadow-sm bg-slate-50">
                    <StatCard
                        label="Total Aktivitas"
                        value={statsLoading ? "..." : (stats?.totalAktivitasBulanIni ?? 0)}
                        sublabel="Bulan ini"
                        icon={Icons.Aktifitas}
                        borderColor="border-blue-500"
                        iconAlt=""
                        active={isShortcutAktif()}
                        onClick={() => applyShortcut()}
                    />
                    <StatCard
                        label="Deadline Hari Ini"
                        value={statsLoading ? "..." : (stats?.deadlineHariIni ?? 0)}
                        sublabel="Aktivitas jatuh tempo"
                        icon={Icons.AktifitasApproval}
                        borderColor="border-amber-500"
                        iconAlt=""
                        active={isShortcutAktif("today")}
                        onClick={() => applyShortcut("today")}
                    />
                    <StatCard
                        label="Overdue"
                        value={statsLoading ? "..." : (stats?.jumlahOverdue ?? 0)}
                        sublabel="Perlu reschedule"
                        icon={Icons.AKtifitasOverdue}
                        borderColor="border-red-500"
                        iconAlt=""
                        active={isShortcutAktif("overdue")}
                        onClick={() => applyShortcut("overdue")}
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="space-y-4">
                <div className="flex gap-6 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors
                                ${activeTab === tab.value
                                    ? "border-cyan-500 text-cyan-500"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <TabContent activeTab={activeTab} page={page} onPageChange={setPage} />
            </div>
        </div>
    )
}