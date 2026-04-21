import { ChevronUp, ChevronDown, ChevronsUpDown, Search } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { TablePagination } from "./table-pagination"
import { useSupervisiActivityRiwayat } from "@/hooks/use-supervisi"
import type { SupervisiActivityItem } from "@/services/supervisi.services"

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

function formatTanggal(iso?: string) {
    if (!iso) return "-"
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "-"
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function formatJam(iso?: string) {
    if (!iso) return "-"
    const d = new Date(iso)
    if (isNaN(d.getTime())) return "-"
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`
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

// ─── Main Component ───────────────────────────────────────────────────────────

export function CardRiwayatTable({
    page,
    onPageChange,
}: {
    page: number
    onPageChange: (p: number) => void
}) {
    const navigate = useNavigate()
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("")
    const [sortDir, setSortDir] = useState<SortDir>("")

    const { data, isLoading } = useSupervisiActivityRiwayat({
        page,
        search: search || undefined,
        sortBy: sortBy || undefined,
        sortDir: sortDir || undefined,
    })

    function handleSort(field: string) {
        if (sortBy !== field) { setSortBy(field); setSortDir("asc") }
        else if (sortDir === "asc") setSortDir("desc")
        else { setSortBy(""); setSortDir("") }
    }

    const items: SupervisiActivityItem[] = data?.data ?? []

    return (
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold text-slate-800">Tabel Riwayat Aktivitas</h2>
                    <p className="text-sm text-cyan-600 mt-0.5">
                        Riwayat terbaru aktivitas karyawan, termasuk waktu pelaksanaan, perusahaan terkait, kategori pekerjaan.
                    </p>
                </div>
                <div className="relative min-w-[220px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Cari informasi..."
                        value={search}
                        onChange={(e) => { setSearch(e.target.value); onPageChange(1) }}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="w-full overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-white border-b border-slate-100">
                            <SortableHeader label="Karyawan" field="karyawan" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="pl-6 w-[180px]" />
                            <SortableHeader label="Tanggal" field="tanggal" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[140px]" />
                            <TableHead className="text-slate-600 text-xs uppercase font-medium">Aktivitas</TableHead>
                            <TableHead className="text-slate-600 text-xs uppercase font-medium w-[160px]">Perusahaan</TableHead>
                            <SortableHeader label="Kategori" field="kategori" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="w-[140px]" />
                            <TableHead className="text-right text-slate-600 text-xs uppercase font-medium pr-6 w-[120px]">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                                    Memuat data...
                                </TableCell>
                            </TableRow>
                        ) : items.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16 text-slate-400">
                                    {search ? "Tidak ada hasil yang cocok." : "Tidak ada riwayat aktivitas."}
                                </TableCell>
                            </TableRow>
                        ) : items.map((item) => {
                            const avatar = getAvatarColor(item.pegawai.nama)
                            return (
                                <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50">
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

                                    {/* Tanggal */}
                                    <TableCell>
                                        <p className="text-xs font-medium text-slate-800">{formatTanggal(item.waktuMulai)}</p>
                                        <p className="text-[11px] text-slate-400 mt-0.5">
                                            {formatJam(item.waktuMulai)} - {formatJam(item.targetSelesai)}
                                        </p>
                                    </TableCell>

                                    {/* Aktivitas */}
                                    <TableCell className="max-w-[320px]">
                                        <p className="text-xs font-semibold text-slate-800">{item.judul}</p>
                                        <p className="text-[11px] text-cyan-600 mt-0.5 line-clamp-2">{item.deskripsi}</p>
                                    </TableCell>

                                    {/* Perusahaan */}
                                    <TableCell className="text-xs text-slate-700">
                                        {item.perusahaan || "-"}
                                    </TableCell>

                                    {/* Kategori */}
                                    <TableCell className="text-xs text-slate-700">
                                        {item.kategori}
                                    </TableCell>

                                    {/* Aksi */}
                                    <TableCell className="text-right pr-6">
                                        <button
                                            onClick={() => navigate(`/dailyactivity/${item.id}`)}
                                            className="text-cyan-600 text-xs font-medium hover:underline whitespace-nowrap"
                                        >
                                            Lihat Detail →
                                        </button>
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
        </div>
    )
}