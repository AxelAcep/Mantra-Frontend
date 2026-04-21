import { ChevronDown, ChevronUp } from "lucide-react"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"

type Reschedule = {
    id: string
    targetSelesaiBaru: string
    alasan: string
    status: string
    createdAt: string
    alasanPenolakan?: string
}

type Props = {
    reschedule: Reschedule[]
}

const STATUS_STYLE: Record<string, string> = {
    PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    DITERIMA: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    DITOLAK: "bg-red-100 text-red-700 hover:bg-red-100",
}

const STATUS_LABEL: Record<string, string> = {
    PENDING: "Menunggu",
    DITERIMA: "Diterima",
    DITOLAK: "Ditolak",
}

function formatDateTime(iso: string) {
    const d = new Date(iso)
    return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) +
        ", " + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

export function RiwayatRescheduleCard({ reschedule }: Props) {
    const [open, setOpen] = useState(true)
    const [expandedIds, setExpandedIds] = useState<string[]>([])

    const toggleExpanded = (id: string) => {
        setExpandedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
    }

    const items = [...reschedule].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-50 transition-colors"
            >
                <h3 className="text-base font-bold text-gray-900">Riwayat Reschedule</h3>
                <div className="flex items-center gap-3">
                    {reschedule.length > 0 && (
                        <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {reschedule.length}x
                        </span>
                    )}
                    {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </div>
            </button>

            {open && (
                <div className="px-5 pb-5 pt-0 border-t border-gray-50 bg-white relative">
                    {reschedule.length === 0 ? (
                        <div className="py-8 text-center">
                            <p className="text-sm text-slate-400 font-medium">Belum ada riwayat reschedule.</p>
                            <p className="text-xs text-slate-300 mt-1">Jadwal aktif saat ini masih berlaku.</p>
                        </div>
                    ) : (
                        <div className="relative pt-4">
                            {/* Vertical Line Connector */}
                            <div className="absolute left-[15px] top-4 bottom-8 w-[1.5px] bg-slate-100" />

                            <div className="space-y-6">
                                {items.map((item, i) => {
                                    const isExpanded = expandedIds.includes(item.id)
                                    const isLatest = i === 0
                                    const displayIndex = items.length - i

                                    return (
                                        <div key={item.id} className="relative pl-10">
                                            {/* Node */}
                                            <div
                                                className={`absolute left-0 top-0 w-8 h-8 rounded-full border-4 border-white shadow-sm flex items-center justify-center z-10 transition-colors
                                                ${isLatest ? "bg-cyan-500 text-white" : "bg-slate-100 text-slate-500"}`}
                                            >
                                                <span className="text-[11px] font-bold">{displayIndex}</span>
                                            </div>

                                            {/* Header Row */}
                                            <div className={`rounded-xl transition-all ${isLatest ? "bg-cyan-50/40" : ""}`}>
                                                <div
                                                    className="flex flex-col p-2 cursor-pointer group"
                                                    onClick={() => toggleExpanded(item.id)}
                                                >
                                                    <div className="flex items-center justify-between mb-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">
                                                                {formatDateTime(item.createdAt)}
                                                            </span>
                                                            <Badge className={`${STATUS_STYLE[item.status]} border-none shadow-none text-[10px] px-2 py-0.5 font-bold uppercase tracking-wider`}>
                                                                {STATUS_LABEL[item.status]}
                                                            </Badge>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[11px] font-medium text-slate-400">
                                                                {getShortTimeAgo(item.createdAt)}
                                                            </span>
                                                            {isExpanded ? (
                                                                <ChevronUp className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                                                            ) : (
                                                                <ChevronDown className="w-4 h-4 text-slate-300 group-hover:text-slate-400 shrink-0" />
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-700 leading-relaxed">
                                                        {item.alasan}
                                                    </p>
                                                </div>

                                                {/* Expanded Content */}
                                                {isExpanded && (
                                                    <div className="px-2 pb-3 space-y-3 animate-in fade-in slide-in-from-top-1 duration-200">
                                                        {/* Target Baru Section */}
                                                        <div className="bg-[#F1F5F9] rounded-xl p-3 border border-slate-100">
                                                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Target Baru</p>
                                                            <p className="text-sm font-bold text-slate-700">
                                                                {formatDateTime(item.targetSelesaiBaru).split(",")[0]}
                                                            </p>
                                                        </div>

                                                        {/* Rejection Section */}
                                                        {item.status === "DITOLAK" && (
                                                            <div className="bg-[#FFF7ED] rounded-xl p-3 border border-orange-100">
                                                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-widest mb-1.5">Alasan penolakan MO</p>
                                                                <p className="text-xs text-orange-800 leading-relaxed font-medium">
                                                                    {item.alasanPenolakan || "Estimasi tambahan waktu dianggap belum proporsional dengan ruang lingkup pekerjaan."}
                                                                </p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* {items.length > 5 && (
                        <div className="pt-4 border-t border-slate-50 mt-4">
                            <button className="w-full py-2 text-xs font-bold text-cyan-500 hover:text-cyan-600 transition-colors">
                                Load {items.length - 5} more items...
                            </button>
                        </div>
                    )} */}
                </div>
            )}
        </div>
    )
}

function getShortTimeAgo(dateStr: string) {
    if (!dateStr) return ""
    const now = new Date()
    const past = new Date(dateStr)
    const diffInMs = Math.max(0, now.getTime() - past.getTime())
    const diffInSec = Math.floor(diffInMs / 1000)
    const diffInMin = Math.floor(diffInSec / 60)
    const diffInHour = Math.floor(diffInMin / 60)
    const diffInDay = Math.floor(diffInHour / 24)
    const diffInWeek = Math.floor(diffInDay / 7)
    const diffInMonth = Math.floor(diffInDay / 30)

    if (diffInMin < 1) return "baru saja"
    if (diffInMin < 60) return `${diffInMin}m`
    if (diffInHour < 24) return `${diffInHour}j`
    if (diffInDay < 7) return `${diffInDay}hr`
    if (diffInWeek < 4) return `${diffInWeek}mg`
    return `${diffInMonth}bln`
}
