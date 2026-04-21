import { useMasterStats } from "@/hooks/use-kpi"

export function InfoTabel() {
    const { data: stats, isLoading } = useMasterStats()

    const items = [
        {
            label:  "Total Aktivitas",
            value:  stats?.totalAktivitas         ?? 0,
            accent: false,
        },
        {
            label:  "Perlu Konfirmasi Selesai",
            value:  stats?.perluKonfirmasiSelesai ?? 0,
            accent: true,
        },
        {
            label:  "Pengajuan Reschedule",
            value:  stats?.pengajuanReschedule    ?? 0,
            accent: false,
        },
        {
            label:  "Overdue",
            value:  stats?.overdue                ?? 0,
            accent: false,
        },
    ]

    return (
        <div className="bg-white border border-gray-200 shadow-sm rounded-xl px-6 py-4">
            <div className="flex items-center divide-x divide-gray-100">
                {items.map((item, i) => (
                    <div
                        key={i}
                        className="flex-1 flex items-center justify-between px-6 first:pl-0 last:pr-0"
                    >
                        <p className={`text-sm leading-snug ${
                            item.accent
                                ? "text-cyan-600 font-medium"
                                : "text-muted-foreground"
                        }`}>
                            {item.label}
                        </p>
                        <p className={`text-3xl font-bold ml-4 ${
                            isLoading ? "text-gray-300" : "text-gray-900"
                        }`}>
                            {isLoading ? "—" : item.value}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    )
}
