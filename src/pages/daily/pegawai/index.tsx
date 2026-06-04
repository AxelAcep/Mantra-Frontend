import { useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Icons } from "@/assets"
import { StatCard } from "./card-stat"
import { ActivityTable } from "./card-table"
import { TambahJadwalModal } from "./card-create-modal"
import {
    useActivityBerjalan,
    useActivityAktif,
    useActivityPending,
    useActivityPerluTindakan,
    useActivityRiwayat,
    useActivityCount,
} from "@/hooks/use-activity"

const tabs = [
    { value: "semua", label: "Semua Aktivitas" },
    { value: "progress", label: "On Progress" },
    { value: "waiting", label: "Menunggu Approval" },
    { value: "perlu-tindakan", label: "Perlu Tindakan" },
    { value: "riwayat", label: "Riwayat" },
]

function TabContent({
    activeTab,
    page,
    onPageChange,
}: {
    activeTab: string
    page: number
    onPageChange: (p: number) => void
}) {

    const berjalan = useActivityBerjalan(page)
    const aktif = useActivityAktif(page)
    const pending = useActivityPending(page)
    const perluTindakan = useActivityPerluTindakan(page)
    const riwayat = useActivityRiwayat(page)

    const map: Record<string, typeof berjalan> = {
        semua: berjalan,
        progress: aktif,
        waiting: pending,
        "perlu-tindakan": perluTindakan,
        riwayat: riwayat,
    }

    const titles: Record<string, { title: string; desc: string }> = {
        semua: { title: "Semua Aktivitas", desc: "Daftar seluruh aktivitas operasional harian beserta status pengerjaannya." },
        progress: { title: "On Progress", desc: "Aktivitas yang sedang berlangsung." },
        waiting: { title: "Menunggu Approval", desc: "Aktivitas yang sedang menunggu approval MO sebagai tanda telah selesai." },
        "perlu-tindakan": { title: "Perlu Tindakan", desc: "Kumpulan aktivitas prioritas yang membutuhkan perhatian khusus, seperti tugas yang terlambat (overdue) maupun yang berstatus ditolak." },
        riwayat: { title: "Riwayat", desc: "Seluruh riwayat aktivitas." },
    }

    const current = map[activeTab] || map["semua"]
    const { title, desc } = titles[activeTab] || titles["semua"]

    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
            <div>
                <h2 className="text-xl font-bold">{title}</h2>
                <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <ActivityTable
                data={current.data}
                isLoading={current.isLoading}
                isError={current.isError}
                page={page}
                onPageChange={onPageChange}
            />
        </div>
    )
}

export default function ActivityPagePegawai() {
    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") || "semua"
    const page = parseInt(searchParams.get("page") || "1", 10)

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

    const [modalOpen, setModalOpen] = useState(false)
    const { data: count } = useActivityCount()
    const { data: perluTindakanData } = useActivityPerluTindakan(1, 1)

    const perluTindakanCount = perluTindakanData?.meta.total ?? 0
    const hasOverdue = (count?.overdue ?? 0) > 0

    return (
        <div className="p-6 bg-slate-50 min-h-screen space-y-8">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-xl font-bold">Ringkasan Aktivitas Harian</h1>
                        <p className="text-muted-foreground text-sm">
                            Pantau seluruh aktivitas operasional harian, status pengerjaan, dan tindak lanjut yang diperlukan agar target dapat tercapai secara optimal.
                        </p>
                    </div>
                    <Button
                        onClick={() => setModalOpen(true)}
                        className="bg-cyan-500 hover:bg-cyan-600"
                    >
                        <Plus className="mr-2 h-4 w-4" /> Tambah Jadwal
                    </Button>
                    <TambahJadwalModal
                        open={modalOpen}
                        onClose={() => setModalOpen(false)}
                        hasOverdue={hasOverdue}
                        onRescheduleClick={() => {
                            setActiveTab("perlu-tindakan")
                            setModalOpen(false)
                        }}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 border border-gray-200 p-6 rounded-xl shadow-sm bg-slate-50">
                    <StatCard label="Aktivitas Aktif" value={count?.aktif ?? 0} icon={Icons.Aktifitas} borderColor="border-blue-500" iconAlt="" />
                    <StatCard label="Deadline Hari Ini" value={count?.deadlineHariIni ?? 0} icon={Icons.AktifitasApproval} borderColor="border-amber-500" iconAlt="" />
                    <StatCard label="Menunggu Approval" value={count?.approval ?? 0} icon={Icons.AKtifitasDeadline} borderColor="border-indigo-500" iconAlt="" />
                    <StatCard label="Overdue" value={count?.overdue ?? 0} icon={Icons.AKtifitasOverdue} borderColor="border-red-500" iconAlt="" />
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex gap-6 border-b border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setActiveTab(tab.value)}
                            className={`py-3 text-sm whitespace-nowrap flex items-center gap-2 border-b-2 -mb-px transition-colors
                                ${activeTab === tab.value
                                    ? "border-cyan-500 text-cyan-500 font-medium"
                                    : "border-transparent text-gray-500 hover:text-gray-700"
                                }`}
                        >
                            <span>{tab.value === "perlu-tindakan" ? "Perlu Tindakan" : tab.label}</span>
                            {tab.value === "perlu-tindakan" && perluTindakanCount > 0 ? (
                                <Badge
                                    variant="destructive"
                                    className="rounded-full px-2 py-0.5 text-[10px] bg-red-100 text-red-600 border-none hover:bg-red-100 font-semibold"
                                >
                                    {perluTindakanCount}
                                </Badge>
                            ) : null}
                        </button>
                    ))}
                </div>

                <TabContent activeTab={activeTab} page={page} onPageChange={setPage} />
            </div>
        </div>
    )
}