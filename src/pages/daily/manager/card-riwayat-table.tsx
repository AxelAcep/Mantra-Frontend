import { useEffect, useState, useRef } from "react"
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
    useMasterRiwayat,
} from "@/hooks/use-master-activity"
import type { ActivityPegawai } from "../../../services/master-activity.services"
import { TablePagination } from "./table-pagination"
import { StatusBadge } from "./status-badge"
import { useDebounce } from "@/hooks/use-debounce"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"

// ─── Types ────────────────────────────────────────────────────────────────────

export type MasterRescheduleItem = {
    id: string
    activityId: string
    targetSelesaiBaru: string
    alasan: string
    status: "DITERIMA" | "DIBATALKAN"
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

// const STATUS_OPTIONS = [
//     { value: "ON_PROGRESS", label: "On Progress" },
//     { value: "PENDING", label: "Pending" },
//     { value: "PENDING_PEGAWAI", label: "Pending Pegawai" },
//     { value: "KONFIRMASI_SELESAI", label: "Konfirmasi Selesai" },
//     { value: "DITOLAK", label: "Ditolak" },
// ]  TestBuatAcep

// ─── Helpers ────────────────────────────────────────────────────────────────── mark

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

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active || !dir) return <ChevronsUpDown className="w-3 h-3 text-slate-400" />
    return dir === "asc"
        ? <ChevronUp className="w-3 h-3 text-cyan-600" />
        : <ChevronDown className="w-3 h-3 text-cyan-600" />
}

function SortableHeader({
    label, field, sortBy, sortDir, onSort,
}: {
    label: string; field: string; sortBy: string; sortDir: SortDir
    onSort: (field: string) => void
}) {
    const isActive = sortBy === field
    return (
        <TableHead
            className="cursor-pointer select-none group text-slate-600 text-xs"
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


// ─── Main Component ───────────────────────────────────────────────────────────

export function CardRiwayatTable({
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

    const { data, isLoading } = useMasterRiwayat(
        page, 10, search, sortBy, sortDir, filterKaryawan, filterKategori, filterStatus
    )

    // ── Sort Handler ──────────────────────────────────────────────────────────
    function handleSort(field: string) {
        if (sortBy !== field) { setSortBy(field); setSortDir("asc") }
        else if (sortDir === "asc") setSortDir("desc")
        else { setSortBy(""); setSortDir("") }
    }


    const items = data?.data ?? []

    // ── Render ────────────────────────────────────────────────────────────────
    return (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden space-y-4">
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
                {/* <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 text-sm border border-slate-200 rounded-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 bg-white"
                >
                    <option value="">Semua Status</option>
                    {STATUS_OPTIONS.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select> */}

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
            <div className="w-full overflow-x-auto px-6 pb-6">
                <div className="w-full rounded-md border bg-white min-w-[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-100">
                                <SortableHeader label="KARYAWAN" field="karyawan" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                <SortableHeader label="KATEGORI" field="kategori" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                <TableHead className="text-slate-600 text-xs">JUDUL / PERUSAHAAN</TableHead>
                                <TableHead className="text-slate-600 text-xs">NO. REFERENSI</TableHead>
                                <TableHead className="text-slate-600 text-xs">DEADLINE / SUBMIT</TableHead>
                                <SortableHeader label="STATUS" field="status" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
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
                                            <StatusBadge status={item.status} />
                                        </TableCell>

                                        {/* Aksi */}
                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
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

        </div>
    )
}