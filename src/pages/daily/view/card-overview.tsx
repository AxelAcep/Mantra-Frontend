import { Badge } from "@/components/ui/badge"
import { BadgeCheck, MessageSquare } from "lucide-react"
import { Icons } from "@/assets"

const KATEGORI_LABEL: Record<string, string> = {
    QUOTATION: "Quotation",
    DOKUMENTASI: "Dokumentasi",
    REPORT_PROJECT: "Report Project",
    DRAWING: "Drawing",
    KURVA_S: "Kurva S",
    MS_PROJECT: "MS Project",
    MONITOR_PROGRESS: "Monitor Progress",
    MONITOR_PROJECT: "Monitor Project",
    BILL_OF_QUANTITY: "Bill of Quantity",
    AKOMODASI_PROJECT: "Akomodasi Project",
    KOORDINASI_EKSTERNAL: "Koordinasi Eksternal",
    DOKUMEN_PENDUKUNG: "Dokumen Pendukung",
    WORK_ORDER: "Work Order",
    APPROVAL_USER: "Approval User",
    TECHNICAL_ADVICE: "Technical Advice",
    LAIN_LAIN: "Lain-Lain",
}

const STATUS_STYLE: Record<string, string> = {
    ON_PROGRESS: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    PENDING_PEGAWAI: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    DITERIMA: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    DITOLAK: "bg-red-100 text-red-700 hover:bg-red-100",
    OVERDUE: "bg-red-100 text-red-700 hover:bg-red-100",
    KONFIRMASI_SELESAI: "bg-amber-100 text-amber-700 hover:bg-amber-100"

}

const STATUS_LABEL: Record<string, string> = {
    ON_PROGRESS: "On Progress",
    PENDING: "Reschedule",
    DITERIMA: "Selesai",
    DITOLAK: "Ditolak",
    PENDING_PEGAWAI: "Pending",
    KONFIRMASI_SELESAI: "Menunggu Konfirmasi"

}

type Props = {
    kategori: string
    terkaitPO?: string
    status: string
    isOverdue: boolean
    unreadChat?: number
    onChatClick?: () => void
    onEdit?: () => void
    alasanPenolakan?: string
    updatedAt?: string
    parent?: { id: string; judul: string; pegawai: { nama: string } }
    isSupervised: boolean
}

export function OverviewCard({ isSupervised = false ,kategori, terkaitPO, status, isOverdue, unreadChat = 0, onChatClick, onEdit, alasanPenolakan, updatedAt, parent }: Props) {
    const displayStatus = isOverdue ? "OVERDUE" : status
    const displayLabel = isOverdue ? "Overdue" : STATUS_LABEL[status]

    return (
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 border border-gray-200 rounded-xl p-6 shadow-sm w-full">
            <div className="flex justify-between items-start mb-4">
                <Badge className={`${STATUS_STYLE[displayStatus]} border-none shadow-none px-3 py-1 text-xs font-medium`}>
                    {displayLabel}
                </Badge>
                <div className="flex items-center gap-2">
                     {isSupervised && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-300 text-green-600 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap">
                            <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            Terverifikasi Kepala Divisi
                        </div>
                    )}
                    <button
                        onClick={onChatClick}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg relative"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Chat
                        {unreadChat > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {unreadChat}
                            </span>
                        )}
                    </button>

                    {(status === "ON_PROGRESS" || status === "DITOLAK") && onEdit && (
                        <button
                            onClick={onEdit}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                        >
                            <img src={Icons.Edit} alt="Edit" className="w-4 h-4" />
                            Edit Data
                        </button>
                    )}
                </div>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-1">Overview</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-md">
                Halaman ini merangkum identitas karyawan, detail pekerjaan, validasi Monitoring Officer, serta riwayat pengajuan reschedule untuk aktivitas yang sedang ditinjau.
            </p>
            <div className="flex gap-4 max-w-lg">
                {parent && (
                    <div className="flex flex-col w-1/2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                        <label className="text-xs text-gray-400 mb-1">Pemberi Tugas</label>
                        <span className="text-sm font-semibold text-gray-900">
                            {parent.pegawai.nama}
                        </span>
                    </div>
                )}
                <div className="flex flex-col w-1/2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                    <label className="text-xs text-gray-400 mb-1">Kategori</label>
                    <span className="text-sm font-semibold text-gray-900">
                        {KATEGORI_LABEL[kategori] ?? kategori}
                    </span>
                </div>
                <div className="flex flex-col w-1/2 bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
                    <label className="text-xs text-gray-400 mb-1">Nomor Referensi</label>
                    <span className="text-sm font-semibold text-cyan-500">
                        {terkaitPO ?? "-"}
                    </span>
                </div>
            </div>

            {/* Alasan Penolakan */}
            {alasanPenolakan && status !== "DITERIMA" && (
                <div className="mt-4 max-w-lg bg-red-50 border border-red-200 rounded-lg px-4 py-3">
                    <label className="text-xs text-red-500 font-medium">
                        Alasan Penolakan {updatedAt && (
                            <span className="text-slate-400 font-normal ml-1">
                                ({getTimeAgo(updatedAt)})
                            </span>
                        )}
                    </label>
                    <p className="text-sm font-semibold text-red-900 mt-1">{alasanPenolakan}</p>
                </div>
            )}
        </div>
    )
}

function getTimeAgo(dateStr: string) {
    if (!dateStr) return null
    const now = new Date()
    const past = new Date(dateStr)
    const diffInMs = now.getTime() - past.getTime()
    const diffInSec = Math.floor(diffInMs / 1000)
    const diffInMin = Math.floor(diffInSec / 60)
    const diffInHour = Math.floor(diffInMin / 60)
    const diffInDay = Math.floor(diffInHour / 24)

    if (diffInSec < 60) return "beberapa detik yang lalu"
    if (diffInMin < 60) return `${diffInMin} menit yang lalu`
    if (diffInHour < 24) return `${diffInHour} jam yang lalu`
    return `${diffInDay} hari yang lalu`
}