import { CheckCircle, ChevronUp, ChevronDown, ChevronsUpDown, Search, BadgeCheck } from "lucide-react"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { TablePagination } from "./table-pagination"
import { StatusBadge } from "./status-badge"
import { useSupervisiActivityAktif, useMarkSupervised } from "@/hooks/use-supervisi"
import type { SupervisiActivityItem } from "@/services/supervisi.services"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useDebounce } from "@/hooks/use-debounce"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
    { value: "ON_PROGRESS", label: "On Progress" },
    { value: "PENDING", label: "Pending" },
    { value: "PENDING_PEGAWAI", label: "Pending Pegawai" },
    { value: "OVERDUE", label: "Overdue" },
    { value: "KONFIRMASI_SELESAI_UNSUPERVISED", label: "Konfirmasi Selesai" },
    { value: "VERIFIED", label: "Terverifikasi" },
    { value: "DITOLAK", label: "Ditolak" },
]

// ─── Types ────────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc" | ""

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getInitials(name: string) {
    return name.split(" ").slice(0, 2).map((n) => n[0]).join("").toUpperCase()
}

const PASTEL_COLORS = [
    { bg: "bg-blue-100", text: "text-blue-500" },
    { bg: "bg-purple-100", text: "text-purple-500" },
    { bg: "bg-green-100", text: "text-green-600" },
    { bg: "bg-amber-100", text: "text-amber-600" },
    { bg: "bg-red-100", text: "text-red-500" },
    { bg: "bg-indigo-100", text: "text-indigo-500" },
    { bg: "bg-pink-100", text: "text-pink-500" },
    { bg: "bg-teal-100", text: "text-teal-600" },
    { bg: "bg-orange-100", text: "text-orange-500" },
]

function getAvatarColor(name: string) {
    return PASTEL_COLORS[name.charCodeAt(0) % PASTEL_COLORS.length]
}

function formatDate(iso?: string) {
    if (!iso) return "-"
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "-"
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active || !dir) return <ChevronsUpDown className="w-3 h-3 text-slate-400" />
    return dir === "asc"
        ? <ChevronUp className="w-3 h-3 text-cyan-600" />
        : <ChevronDown className="w-3 h-3 text-cyan-600" />
}

function SortableHeader({ label, field, sortBy, sortDir, onSort, className = "" }: {
    label: string; field: string; sortBy: string; sortDir: SortDir
    onSort: (field: string) => void; className?: string
}) {
    const isActive = sortBy === field
    return (
        <TableHead
            className={`cursor-pointer select-none group text-slate-600 text-xs ${className}`}
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                <span className={`uppercase font-medium ${isActive ? "text-cyan-600" : ""} group-hover:text-cyan-600 transition-colors`}>
                    {label}
                </span>
                <SortIcon active={isActive} dir={isActive ? sortDir : ""} />
            </div>
        </TableHead>
    )
}

// ─── Verified Badge ───────────────────────────────────────────────────────────

function VerifiedBadge() {
    return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-600 text-[10px] font-semibold uppercase tracking-wide whitespace-nowrap">
            <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
            Terverifikasi
        </span>
    )
}

// ─── Confirm Modal ────────────────────────────────────────────────────────────

function ConfirmSupervisedModal({ open, isPending, onConfirm, onClose }: {
    open: boolean
    isPending: boolean
    onConfirm: () => void
    onClose: () => void
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl p-6 gap-0">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg font-bold text-gray-900">Konfirmasi Supervised</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600 mb-6">
                    Apakah Anda yakin ingin menandai aktivitas ini sebagai{" "}
                    <span className="font-semibold text-cyan-600">sudah disupervisi</span>?
                    Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isPending}
                        className="border-gray-200 text-gray-600 font-semibold"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                    >
                        {isPending ? "Memproses..." : "Ya, konfirmasi"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Supervise Button Logic ───────────────────────────────────────────────────

function shouldShowSuperviseButton(item: SupervisiActivityItem): boolean {
    if (item.isSupervised) return false
    const hasPendingReschedule = item.reschedule?.some((r) => r.status === "PENDING") ?? false
    const isKonfirmasiSelesai = item.status === "KONFIRMASI_SELESAI"
    return hasPendingReschedule || isKonfirmasiSelesai
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
    const [sortBy, setSortBy] = useState("")
    const [sortDir, setSortDir] = useState<SortDir>("")
    const [search, setSearch] = useState("")
    const [filterStatus, setFilterStatus] = useState("")
    const [confirmTarget, setConfirmTarget] = useState<string | null>(null)

    const debouncedSearch = useDebounce(search, 400)

    const { data, isLoading } = useSupervisiActivityAktif({
        page,
        search: debouncedSearch || undefined,
        sortBy: sortBy || undefined,
        sortDir: sortDir || undefined,
        status:
            filterStatus === "KONFIRMASI_SELESAI_UNSUPERVISED" ? "KONFIRMASI_SELESAI" :
                filterStatus === "VERIFIED" ? undefined :
                    filterStatus || undefined,
        isSupervised:
            filterStatus === "KONFIRMASI_SELESAI_UNSUPERVISED" ? "false" :
                filterStatus === "VERIFIED" ? "true" :
                    undefined,
    })

    const markSupervised = useMarkSupervised()

    function handleSort(field: string) {
        if (sortBy !== field) { setSortBy(field); setSortDir("asc") }
        else if (sortDir === "asc") setSortDir("desc")
        else { setSortBy(""); setSortDir("") }
    }

    function handleConfirm() {
        if (!confirmTarget) return
        markSupervised.mutate(confirmTarget, {
            onSuccess: () => setConfirmTarget(null),
        })
    }

    const items: SupervisiActivityItem[] = data?.data ?? []

    return (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Seluruh Aktivitas</h2>
                    <p className="text-sm text-slate-500">Aktivitas dari seluruh karyawan.</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* Filter Status */}
                    <select
                        value={filterStatus}
                        onChange={(e) => { setFilterStatus(e.target.value); onPageChange(1) }}
                        className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                    >
                        <option value="">Semua Status</option>
                        {STATUS_OPTIONS.map(s => (
                            <option key={s.value} value={s.value}>{s.label}</option>
                        ))}
                    </select>

                    {/* Search */}
                    <div className="relative min-w-[240px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari karyawan, judul, perusahaan..."
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); onPageChange(1) }}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <Table className="w-full table-fixed">
                    <TableHeader>
                        <TableRow className="bg-white border-b border-slate-100">
                            <SortableHeader label="Karyawan" field="karyawan" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[160px] pl-6" />
                            <SortableHeader label="Kategori" field="kategori" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[130px]" />
                            <TableHead className="text-slate-600 text-xs uppercase font-medium w-[220px]">Judul Aktivitas</TableHead>
                            <TableHead className="text-slate-600 text-xs uppercase font-medium w-[110px]">No. Referensi</TableHead>
                            <SortableHeader label="Tgl Selesai / Mulai" field="targetselesai" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[140px]" />
                            <SortableHeader label="Status" field="status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[140px]" />
                            <TableHead className="text-right text-slate-600 text-xs uppercase font-medium pr-6 w-[100px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-16 text-slate-400">
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-16 text-slate-400">
                                    {search ? "Tidak ada hasil yang cocok." : "Tidak ada aktivitas."}
                                </TableCell>
                            </TableRow>
                        ) : items.map((item) => {
                            const avatar = getAvatarColor(item.pegawai.nama)
                            const showSuperviseBtn = shouldShowSuperviseButton(item)

                            return (
                                <TableRow
                                    key={item.id}
                                    className={`transition-colors border-b border-slate-50 hover:bg-slate-50/50`}
                                >
                                    {/* Karyawan */}
                                    <TableCell className="pl-6">
                                        <div className="flex items-center gap-2.5">
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${avatar.bg} ${avatar.text}`}>
                                                {getInitials(item.pegawai.nama)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-semibold text-slate-700 leading-tight">{item.pegawai.nama}</p>
                                                <p className="text-[10px] text-slate-400 uppercase">{item.pegawai.divisi}</p>
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/* Kategori */}
                                    <TableCell>
                                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                            {item.kategori}
                                        </span>
                                    </TableCell>

                                    {/* Judul + Perusahaan (biru, kecil) */}
                                    <TableCell>
                                        <p className="text-xs font-medium text-slate-800 line-clamp-1">{item.judul}</p>
                                        {item.perusahaan && (
                                            <p className="text-[10px] text-blue-500 mt-0.5 line-clamp-1">{item.perusahaan}</p>
                                        )}
                                    </TableCell>

                                    {/* No. Referensi */}
                                    <TableCell className="font-mono text-[12px] text-cyan-600">
                                        {item.terkaitPO || "-"}
                                    </TableCell>

                                    {/* Tgl Selesai / Mulai */}
                                    <TableCell>
                                        <p className="text-[11px] font-medium text-slate-800">{formatDate(item.targetSelesai)}</p>
                                        <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(item.waktuMulai)}</p>
                                    </TableCell>

                                    {/* Status */}
                                    <TableCell>
                                        <div className="flex flex-col gap-1 items-start">
                                            <StatusBadge status={item.status} />
                                            {item.isSupervised && <VerifiedBadge />}
                                        </div>
                                    </TableCell>

                                    {/* Aksi */}
                                    <TableCell className="text-right pr-6">
                                        <div className="flex items-center justify-end gap-2">
                                            {showSuperviseBtn && (
                                                <button
                                                    onClick={() => setConfirmTarget(item.id)}
                                                    className="text-green-500 hover:text-green-600 transition-colors"
                                                    title="Tandai sebagai supervised"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                </button>
                                            )}
                                            <button
                                                onClick={() => navigate(`/dailyactivity/supervisi/${item.id}`)}
                                                className="text-cyan-600 text-xs font-medium hover:underline whitespace-nowrap"
                                            >
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

            {/* Pagination */}
            <div className="p-4 border-t border-slate-100">
                <TablePagination
                    page={page}
                    totalPages={data?.totalPages ?? 1}
                    total={data?.total ?? 0}
                    showing={items.length}
                    onPageChange={onPageChange}
                />
            </div>

            {/* Modal */}
            <ConfirmSupervisedModal
                open={!!confirmTarget}
                isPending={markSupervised.isPending}
                onConfirm={handleConfirm}
                onClose={() => setConfirmTarget(null)}
            />
        </div>
    )
}