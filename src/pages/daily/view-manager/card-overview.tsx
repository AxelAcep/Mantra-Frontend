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
    KONFIRMASI_SELESAI: "bg-amber-100 text-amber-700 hover:bg-amber-100",
}

const STATUS_LABEL: Record<string, string> = {
    ON_PROGRESS: "On Progress",
    PENDING: "Reschedule",
    DITERIMA: "Selesai",
    DITOLAK: "Ditolak",
    KONFIRMASI_SELESAI: "Menunggu Konfirmasi",
    PENDING_PEGAWAI: "Pending Pegawai",
}

const KPI_STYLE: Record<string, string> = {
    BAIK: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CUKUP: "bg-amber-50 text-amber-700 border-amber-200",
    BURUK: "bg-rose-50 text-rose-700 border-rose-200",
}

// ─── Info Box ─────────────────────────────────────────────────────────────────

function InfoBox({
    label,
    value,
    accent = false,
}: {
    label: string
    value: string
    accent?: boolean
}) {
    return (
        <div className="flex flex-col bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm min-w-0">
            <label className="text-xs text-gray-400 mb-1 whitespace-nowrap">{label}</label>
            <span className={`text-sm font-semibold truncate ${accent ? "text-cyan-500" : "text-gray-900"
                }`}>
                {value}
            </span>
        </div>
    )
}

// ─── Props ────────────────────────────────────────────────────────────────────

type Props = {
    // Data karyawan — hanya ada di versi admin
    namaPegawai?: string
    divisi?: string

    // Data aktivitas
    kategori: string
    terkaitPO?: string
    status: string
    isOverdue: boolean

    // Reschedule — hanya admin yang lihat jumlah pengajuan
    jumlahReschedule?: number

    // Chat
    unreadChat?: number
    onChatClick?: () => void

    parent?: { id: string; judul: string; pegawai: { nama: string } }

    // Mode
    isAdmin?: boolean
    nilaiKPI?: string
    onEditKPI?: () => void
    onEditData?: () => void
    alasanPenolakan?: string
    updatedAt?: string

    isSupervised?: boolean
}

// ─── Component ────────────────────────────────────────────────────────────────

export function OverviewCard({
    namaPegawai,
    divisi,
    kategori,
    terkaitPO,
    status,
    isOverdue,
    jumlahReschedule = 0,
    unreadChat = 0,
    onChatClick,
    parent,
    isAdmin = false,
    nilaiKPI,
    onEditKPI,
    alasanPenolakan,
    updatedAt,
    isSupervised = false,
}: Props) {
    const displayStatus = isOverdue ? "OVERDUE" : status
    const displayLabel = isOverdue ? "Overdue" : (STATUS_LABEL[status] ?? status)

    return (
        <div className="relative bg-gradient-to-br from-slate-50 to-blue-50 border border-gray-200 rounded-xl p-6 shadow-sm w-full">

            {/* ── Top Row ── */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-2">
                    <Badge
                        className={`${STATUS_STYLE[displayStatus] ?? "bg-gray-100 text-gray-600"} border-none shadow-none px-3 py-1 text-xs font-medium`}
                    >
                        {displayLabel}
                    </Badge>

                    {nilaiKPI && (
                        <Badge className={`${KPI_STYLE[nilaiKPI] ?? "bg-cyan-50 text-cyan-700 border-cyan-200"} border shadow-none px-3 py-1 text-xs font-semibold uppercase tracking-wider`}>
                            KPI: {nilaiKPI}
                        </Badge>
                    )}
                </div>


                <div className="flex items-center gap-2">
                    {isSupervised && (
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 border border-green-300 text-green-600 text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap">
                            <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                            Terverifikasi Kepala Divisi
                        </div>
                    )}

                    <button
                        onClick={onChatClick}
                        className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg relative transition-colors shadow-sm"
                    >
                        <MessageSquare className="w-4 h-4" />
                        Chat
                        {unreadChat > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                {unreadChat > 9 ? "9+" : unreadChat}
                            </span>
                        )}
                    </button>

                    {/* Edit Data — Always visible for manager if callback exists */}
                    {/* {onEditData && (
                        <button
                            onClick={onEditData}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                        >
                            <img src={Icons.Edit} alt="Edit" className="w-4 h-4" />
                            Edit Data
                        </button>
                    )} */}

                    {/* Edit KPI — Only visible when DITERIMA */}
                    {status === "DITERIMA" && onEditKPI && (
                        <button
                            onClick={onEditKPI}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
                        >
                            <img src={Icons.Edit} alt="Edit" className="w-4 h-4 brightness-0 invert" />
                            Edit KPI
                        </button>
                    )}
                </div>
            </div>

            {/* ── Title & Desc ── */}
            <h2 className="text-xl font-bold text-gray-900 mb-1">Overview</h2>
            <p className="text-sm text-muted-foreground mb-6 max-w-xl">
                {isAdmin
                    ? "Halaman ini merangkum identitas karyawan, detail pekerjaan, validasi Monitoring Officer, serta riwayat pengajuan reschedule untuk aktivitas yang sedang ditinjau."
                    : "Halaman ini merangkum detail pekerjaan Anda, beserta riwayat pengajuan reschedule."}
            </p>

            {/* ── Info Boxes ── */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 ${parent ? "lg:grid-cols-6" : "lg:grid-cols-5"} gap-3`}>
                {/* Hanya admin yang lihat nama & divisi */}
                {isAdmin && namaPegawai && (
                    <InfoBox
                        label="Nama Karyawan / Divisi"
                        value={namaPegawai}
                    />
                )}
                {isAdmin && divisi && (
                    <InfoBox
                        label="Divisi"
                        value={divisi}
                    />
                )}
                {parent && (
                    <InfoBox
                        label="Pemberi Tugas"
                        value={parent.pegawai.nama}
                    />
                )}

                <InfoBox
                    label="Kategori"
                    value={KATEGORI_LABEL[kategori] ?? kategori}
                />

                {/* Hanya admin yang lihat jumlah reschedule */}
                {isAdmin !== undefined && (
                    <InfoBox
                        label="Reschedule"
                        value={`${jumlahReschedule} pengajuan`}
                    />
                )}

                <InfoBox
                    label="Terkait"
                    value={terkaitPO ?? "-"}
                    accent={!!terkaitPO}
                />
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
