import { useEffect, useState, useRef } from "react"
import { CheckCircle, XCircle, Search, ChevronUp, ChevronDown, ChevronsUpDown, BadgeCheck } from "lucide-react"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import {
    useMasterAktif,
    useKonfirmasiReschedule,
    useKonfirmasiSelesai,
} from "@/hooks/use-master-activity"
import type { ActivityPegawai } from "../../../services/master-activity.services"
import { TablePagination } from "./table-pagination"
import { ConfirmTerimaModal, TolakModal } from "./card-confirm-modal"
import { StatusBadge } from "./status-badge"
import { type NilaiKPI } from "@/services/kpi.services"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type MasterRescheduleItem = {
    id: string
    activityId: string
    targetSelesaiBaru: string
    alasan: string
    status: "PENDING" | "DITERIMA" | "DITOLAK" | "KONFIRMASI_SELESAI"
    createdAt: string
    activity: {
        perusahaan: string
        id: string
        judul: string
        targetSelesai: string
        kategori: string
        status: string
        terkaitPO?: string
        pegawai: ActivityPegawai
        reschedule?: any[]
    }
}

type SelesaiTarget = { activityId: string; pegawaiId: string } | null
type SortDir = "asc" | "desc" | ""

// ─── Constants ────────────────────────────────────────────────────────────────

const PASTEL_COLORS = [
    { bg: "bg-blue-100", text: "text-blue-500" },
    { bg: "bg-purple-100", text: "text-purple-500" },
    { bg: "bg-indigo-100", text: "text-indigo-500" },
    { bg: "bg-emerald-100", text: "text-emerald-600" },
]

const KATEGORI_OPTIONS = [
    "QUOTATION", "DOKUMENTASI", "REPORT_PROJECT", "DRAWING", "KURVA_S",
    "MS_PROJECT", "MONITOR_PROGRESS", "MONITOR_PROJECT", "BILL_OF_QUANTITY",
    "AKOMODASI_PROJECT", "KOORDINASI_EKSTERNAL", "DOKUMEN_PENDUKUNG",
    "WORK_ORDER", "APPROVAL_USER", "TECHNICAL_ADVICE", "LAIN_LAIN",
]

const STATUS_OPTIONS = [
    { value: "ON_PROGRESS", label: "On Progress" },
    { value: "PENDING", label: "Pending" },
    { value: "PENDING_PEGAWAI", label: "Pending Pegawai" },
    { value: "OVERDUE", label: "Overdue" },
    { value: "KONFIRMASI_SELESAI", label: "Konfirmasi Selesai" },
    { value: "DITOLAK", label: "Ditolak" },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name?.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase() || "??"
}

function formatDateTime(iso?: string) {
    if (!iso) return "-"
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "-"
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} WIB`
}

function VerifiedBadge() {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-600 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap">
            <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
            Terverifikasi
        </span>
    )
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active || !dir) return <ChevronsUpDown className="w-3 h-3 text-slate-400" />
    return dir === "asc"
        ? <ChevronUp className="w-3 h-3 text-cyan-600" />
        : <ChevronDown className="w-3 h-3 text-cyan-600" />
}

function SortableHeader({
    label, field, sortBy, sortDir, onSort, title, className = "", center = false
}: {
    label: string; field: string; sortBy: string; sortDir: SortDir
    onSort: (field: string) => void
    title?: string
    className?: string
    center?: boolean
}) {
    const isActive = sortBy === field
    return (
        <TableHead
            className={cn(
                "cursor-pointer select-none group text-slate-600 text-xs",
                center && "text-center",
                className
            )}
            onClick={() => onSort(field)}
            title={title}
        >
            <div className={cn("flex items-center gap-1", center && "justify-center")}>
                <span className={`uppercase font-medium ${isActive ? "text-cyan-600" : ""} group-hover:text-cyan-600 transition-colors`}>
                    {label}
                </span>
                <SortIcon active={isActive} dir={isActive ? sortDir : ""} />
            </div>
        </TableHead>
    )
}

// ─── Nilai KPI Selector ───────────────────────────────────────────────────────

function NilaiKPISelector({ value, onChange }: { value: NilaiKPI | null; onChange: (v: NilaiKPI) => void }) {
    const options: { nilai: NilaiKPI; label: string; idle: string; active: string }[] = [
        { nilai: "BAIK", label: "Baik", idle: "border-emerald-200 text-emerald-600 hover:bg-emerald-50", active: "bg-emerald-500 border-emerald-500 text-white" },
        { nilai: "CUKUP", label: "Cukup", idle: "border-amber-200 text-amber-600 hover:bg-amber-50", active: "bg-amber-400 border-amber-400 text-white" },
        { nilai: "BURUK", label: "Buruk", idle: "border-red-200 text-red-500 hover:bg-red-50", active: "bg-red-500 border-red-500 text-white" },
    ]
    return (
        <div className="flex gap-2">
            {options.map(opt => (
                <button key={opt.nilai} type="button" onClick={() => onChange(opt.nilai)}
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${value === opt.nilai ? opt.active : opt.idle}`}>
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

function ModalKonfirmasiSelesai({ open, isPending, onConfirm, onClose }: {
    open: boolean; isPending: boolean
    onConfirm: (nilai: NilaiKPI) => void; onClose: () => void
}) {
    const [nilai, setNilai] = useState<NilaiKPI | null>(null)
    function handleClose() { setNilai(null); onClose() }
    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl p-6 gap-0">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg font-bold text-gray-900">Konfirmasi Aktivitas Selesai</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600 mb-5">
                    Apakah Anda yakin aktivitas ini telah benar-benar selesai dikerjakan?
                    Berikan penilaian performa karyawan sebelum melanjutkan.
                </p>
                <div className="space-y-2 mb-6">
                    <p className="text-sm font-semibold text-gray-700">Bagaimana performa karyawan?</p>
                    <NilaiKPISelector value={nilai} onChange={setNilai} />
                    {!nilai && <p className="text-xs text-gray-400 mt-1">Pilih salah satu penilaian untuk melanjutkan.</p>}
                </div>
                <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={handleClose} disabled={isPending} className="border-gray-200 text-gray-600 font-semibold">Tidak</Button>
                    <Button onClick={() => nilai && onConfirm(nilai)} disabled={isPending || !nilai}
                        className={cn(
                            "font-semibold transition-all shadow-sm",
                            isPending || !nilai ? "bg-slate-100 text-slate-400 cursor-not-allowed border-none" : "bg-cyan-600 hover:bg-cyan-700 text-white"
                        )}>
                        {isPending ? "Memproses..." : "Ya, konfirmasi"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function CardAktifTable({
    page,
    onPageChange,
}: {
    page: number
    onPageChange: (p: number) => void
}) {
    const navigate = useNavigate()

    // ── Search & Filter State ─────────────────────────────────────────────────
    const [searchInput, setSearchInput] = useState("")
    const [filterKaryawan, setFilterKaryawan] = useState("")
    const [filterKategori, setFilterKategori] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [sortDir, setSortDir] = useState<SortDir>("")

    const search = useDebounce(searchInput, 400)

    const prevDeps = useRef({ search, filterKaryawan, filterKategori, filterStatus, sortBy, sortDir })
    // Reset page setiap filter/search berubah
    useEffect(() => {
        const p = prevDeps.current
        if (p.search === search && p.filterKaryawan === filterKaryawan && p.filterKategori === filterKategori && p.filterStatus === filterStatus && p.sortBy === sortBy && p.sortDir === sortDir) {
            return
        }
        prevDeps.current = { search, filterKaryawan, filterKategori, filterStatus, sortBy, sortDir }
        onPageChange(1)
    }, [search, filterKaryawan, filterKategori, filterStatus, sortBy, sortDir])

    const { data, isLoading, refetch } = useMasterAktif(
        page, 10, search, sortBy, sortDir, filterKaryawan, filterKategori, filterStatus
    )

    // ── Modal State ───────────────────────────────────────────────────────────
    const [terimaTarget, setTerimaTarget] = useState<string | null>(null)
    const [tolakTarget, setTolakTarget] = useState<string | null>(null)
    const [terimaSelesaiTarget, setTerimaSelesaiTarget] = useState<SelesaiTarget>(null)
    const [tolakSelesaiTarget, setTolakSelesaiTarget] = useState<SelesaiTarget>(null)

    const konfirmasi = useKonfirmasiReschedule()
    const konfirmasiSelesaiMutation = useKonfirmasiSelesai(() => refetch())
    const isPendingSelesai = konfirmasiSelesaiMutation.isPending

    // ── Sort Handler ──────────────────────────────────────────────────────────
    function handleSort(field: string) {
        if (sortBy !== field) { setSortBy(field); setSortDir("asc") }
        else if (sortDir === "asc") setSortDir("desc")
        else { setSortBy(""); setSortDir("") }
    }

    // ── Handlers: Reschedule ──────────────────────────────────────────────────
    const handleTerima = () => {
        if (!terimaTarget) return
        konfirmasi.mutate(
            { rescheduleId: terimaTarget, status: "DITERIMA" },
            { onSuccess: () => { setTerimaTarget(null); refetch() } }
        )
    }

    const handleTolak = (alasan: string) => {
        if (!tolakTarget) return
        konfirmasi.mutate(
            { rescheduleId: tolakTarget, status: "DITOLAK", alasan },
            { onSuccess: () => { setTolakTarget(null); refetch() } }
        )
    }

    // ── Handlers: Konfirmasi Selesai ──────────────────────────────────────────
    const handleTerimaSelesai = async (nilai: NilaiKPI) => {
        if (!terimaSelesaiTarget) return
        konfirmasiSelesaiMutation.mutate(
            {
                activityId: terimaSelesaiTarget.activityId,
                status: "DITERIMA",
                nilaiKPI: nilai,
            },
            { onSuccess: () => setTerimaSelesaiTarget(null) }
        )
    }

    const handleTolakSelesai = (alasan: string) => {
        if (!tolakSelesaiTarget) return
        konfirmasiSelesaiMutation.mutate(
            { activityId: tolakSelesaiTarget.activityId, status: "DITOLAK", alasan },
            { onSuccess: () => setTolakSelesaiTarget(null) }
        )
    }

    const items = data?.data ?? []

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="w-full bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden space-y-4">
            {/* Header */}
            <div className="p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-800">Manajemen Aktivitas & Reschedule</h2>
                <p className="text-sm text-slate-500">Validasi permintaan perubahan jadwal dan progres harian.</p>
            </div>

            {/* ── Search + Filter Bar ── */}
            <div className="px-6 flex flex-wrap gap-2">
                {/* Search */}
                <div className="relative flex-1 min-w-[200px] max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari karyawan, judul, perusahaan, no. referensi..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                </div>

                {/* Filter Kategori */}
                <select
                    value={filterKategori}
                    onChange={(e) => setFilterKategori(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                    <option value="">Semua Kategori</option>
                    {KATEGORI_OPTIONS.map(k => (
                        <option key={k} value={k}>{k.replace(/_/g, " ")}</option>
                    ))}
                </select>

                {/* Filter Status */}
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                    <option value="">Semua Status</option>
                    {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>

                {/* Reset */}
                {(search || filterKategori || filterStatus) && (
                    <button
                        onClick={() => { setSearchInput(""); setFilterKaryawan(""); setFilterKategori(""); setFilterStatus("") }}
                        className="px-3 py-2 text-sm text-slate-400 hover:text-slate-600 border border-slate-200 rounded-lg transition-colors"
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto px-6">
                <div className="w-full rounded-md border bg-white min-w-[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-100">
                                <SortableHeader label="KARYAWAN" field="karyawan" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                <SortableHeader label="KATEGORI" field="kategori" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                <TableHead className="text-slate-600 text-xs">JUDUL / PERUSAHAAN</TableHead>
                                <TableHead className="text-slate-600 text-xs">NO. REFERENSI</TableHead>
                                <SortableHeader label="DEADLINE / SUBMIT" field="targetSelesai" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                <SortableHeader label="STATUS" field="status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} center />
                                <TableHead className="text-right text-slate-600 text-xs">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-16 text-slate-400">Memuat data...</TableCell>
                                </TableRow>
                            ) : items.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-16 text-slate-400">
                                        {search || filterKategori || filterStatus
                                            ? "Tidak ada hasil yang cocok dengan filter."
                                            : "Tidak ada aktivitas aktif."
                                        }
                                    </TableCell>
                                </TableRow>
                            ) : items.filter((item: any) => !!item.pegawai).map((item: any) => {
                                const avatar = PASTEL_COLORS[item.pegawai.nama.charCodeAt(0) % PASTEL_COLORS.length]
                                const pendingReschedule = item.reschedule?.find((r: any) => r.status === "PENDING")
                                const isKonfirmasiSelesai = item.status === "KONFIRMASI_SELESAI"

                                return (
                                    <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                                        {/* Karyawan */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold ${avatar.bg} ${avatar.text}`}>
                                                    {getInitials(item.pegawai.nama)}
                                                </div>
                                                <div title={item.pegawai.nama} className="max-w-[150px]">
                                                    <p className="font-semibold text-slate-700 truncate">{item.pegawai.nama}</p>
                                                    <p className="text-[10px] text-slate-400 uppercase truncate">{item.pegawai.divisi}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* Kategori */}
                                        <TableCell>
                                            <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                                {item.kategori}
                                            </span>
                                        </TableCell>

                                        {/* Judul / Perusahaan */}
                                        <TableCell className="max-w-[200px]" title={`${item.judul} - ${item.perusahaan}`}>
                                            <p className="font-medium text-slate-800 truncate">{item.judul}</p>
                                            <p className="text-[11px] text-slate-400 truncate">{item.perusahaan}</p>
                                        </TableCell>

                                        {/* No. Referensi */}
                                        <TableCell className="font-mono text-[12px] text-cyan-600 max-w-[120px] truncate" title={item.terkaitPO || "-"}>
                                            {item.terkaitPO || "-"}
                                        </TableCell>

                                        {/* Deadline / Submit */}
                                        <TableCell>
                                            <p className="text-[11px] font-medium text-slate-800">{formatDateTime(item.targetSelesai)}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDateTime(item.waktuSubmit)}</p>
                                        </TableCell>

                                        {/* Status */}
                                        <TableCell>
                                            <div className="flex flex-col gap-1 items-center">
                                                <StatusBadge status={item.status} />
                                                {item.isSupervised && <VerifiedBadge />}
                                            </div>
                                        </TableCell>

                                        {/* Aksi */}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                {pendingReschedule && (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setTerimaTarget(pendingReschedule.id)}
                                                            className="text-green-500 hover:text-green-600 transition-colors" title="Terima Reschedule">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => setTolakTarget(pendingReschedule.id)}
                                                            className="text-red-400 hover:text-red-500 transition-colors" title="Tolak Reschedule">
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}
                                                {isKonfirmasiSelesai && (
                                                    <div className="flex items-center gap-1">
                                                        <button onClick={() => setTerimaSelesaiTarget({ activityId: item.id, pegawaiId: item.pegawaiId })}
                                                            className="text-green-500 hover:text-green-600 transition-colors" title="Konfirmasi Selesai">
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => setTolakSelesaiTarget({ activityId: item.id, pegawaiId: item.pegawaiId })}
                                                            className="text-red-400 hover:text-red-500 transition-colors" title="Tolak Selesai">
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                )}
                                                <button onClick={() => navigate(`/dailyactivity/${item.id}`)}
                                                    className="text-cyan-600 text-sm font-medium hover:underline ml-4 whitespace-nowrap">
                                                    Lihat Detail
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Pagination */}
            {!isLoading && (
                <div className="p-4 border-t border-slate-50">
                    <TablePagination
                        page={page}
                        totalPages={data?.totalPages ?? 1}
                        total={data?.total ?? 0}
                        showing={items.length}
                        onPageChange={onPageChange}
                    />
                </div>
            )}

            {/* Modals */}
            <ConfirmTerimaModal open={!!terimaTarget} onClose={() => setTerimaTarget(null)} onConfirm={handleTerima} isPending={konfirmasi.isPending} />
            <TolakModal open={!!tolakTarget} onClose={() => setTolakTarget(null)} onConfirm={handleTolak} isPending={konfirmasi.isPending} />
            <ModalKonfirmasiSelesai open={!!terimaSelesaiTarget} onClose={() => setTerimaSelesaiTarget(null)} onConfirm={handleTerimaSelesai} isPending={isPendingSelesai} />
            <TolakModal open={!!tolakSelesaiTarget} onClose={() => setTolakSelesaiTarget(null)} onConfirm={handleTolakSelesai} isPending={konfirmasiSelesaiMutation.isPending} />
        </div>
    )
}