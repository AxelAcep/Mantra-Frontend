import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search, ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { useMasterKaryawan } from "@/hooks/use-master-activity"
import { TablePagination } from "./table-pagination"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"

// ─── Helpers ──────────────────────────────────────────────────────────────────

type SortDir = "asc" | "desc" | ""

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

function getInitials(name: string) {
    return name.split(" ").slice(0, 2).map(n => n[0]).join("").toUpperCase()
}

// ─── Sort Icon ────────────────────────────────────────────────────────────────

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active || !dir) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
    return dir === "asc"
        ? <ChevronUp className="w-3.5 h-3.5 text-cyan-600" />
        : <ChevronDown className="w-3.5 h-3.5 text-cyan-600" />
}

// ─── Sortable Header ──────────────────────────────────────────────────────────

function SortableHeader({
    label,
    field,
    sortBy,
    sortDir,
    onSort,
    className = ""
}: {
    label: string
    field: string
    sortBy: string
    sortDir: SortDir
    onSort: (field: string) => void
    className?: string
}) {
    const isActive = sortBy === field
    return (
        <TableHead
            className={`cursor-pointer select-none group text-slate-600 text-xs ${className}`}
            onClick={() => onSort(field)}
        >
            <div className={`flex items-center gap-1 ${className.includes("text-center") ? "justify-center" : "justify-start"}`}>
                <span className={`uppercase font-medium ${isActive ? "text-cyan-600" : ""} group-hover:text-cyan-600 transition-colors`}>
                    {label}
                </span>
                <SortIcon active={isActive} dir={isActive ? sortDir : ""} />
            </div>
        </TableHead>
    )
}

// ─── KPI Bar ──────────────────────────────────────────────────────────────────

function KPIBar({ baik, cukup, buruk }: { baik: number; cukup: number; buruk: number }) {
    const total = baik + cukup + buruk

    if (total === 0) {
        return (
            <div className="flex items-center gap-2">
                <div className="h-2.5 w-48 bg-gray-100 rounded-full" />
                <span className="text-xs text-gray-300">Belum ada</span>
            </div>
        )
    }

    const pctBaik = (baik / total) * 100
    const pctCukup = (cukup / total) * 100
    const pctBuruk = (buruk / total) * 100

    return (
        <div className="flex items-center gap-3">
            {/* Bar */}
            <div className="flex h-2.5 w-48 rounded-full overflow-hidden">
                {baik > 0 && (
                    <div
                        style={{ width: `${pctBaik}%` }}
                        className="bg-emerald-400"
                    />
                )}
                {cukup > 0 && (
                    <div
                        style={{ width: `${pctCukup}%` }}
                        className="bg-amber-400"
                    />
                )}
                {buruk > 0 && (
                    <div
                        style={{ width: `${pctBuruk}%` }}
                        className="bg-red-400"
                    />
                )}
            </div>
            {/* Counts */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <span className="text-emerald-500 font-medium">{baik}</span>
                <span>/</span>
                <span className="text-amber-500 font-medium">{cukup}</span>
                <span>/</span>
                <span className="text-red-400 font-medium">{buruk}</span>
            </div>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function KaryawanTable({
    page,
    onPageChange,
}: {
    page: number
    onPageChange: (p: number) => void
}) {
    const navigate = useNavigate()
    const now = new Date()

    const [search, setSearch] = useState("")
    const [query, setQuery] = useState("")   // debounced search
    const [mode, setMode] = useState<"bulan" | "tahun">("tahun")
    const [bulan] = useState(now.getMonth() + 1)
    const [tahun] = useState(now.getFullYear())

    const [sortBy, setSortBy] = useState("nama")
    const [sortDir, setSortDir] = useState<SortDir>("asc")

    const { data, isLoading, isError } = useMasterKaryawan(page, query, mode, bulan, tahun, sortBy, sortDir)

    const items = data?.data ?? []
    const total = data?.total ?? 0
    const totalPages = data?.totalPages ?? 1

    // Sort Handler
    function handleSort(field: string) {
        if (sortBy !== field) {
            setSortBy(field)
            setSortDir("asc")
        } else if (sortDir === "asc") {
            setSortDir("desc")
        } else {
            // klik ketiga: reset sort ke nama asc
            setSortBy("nama")
            setSortDir("asc")
        }
        onPageChange(1)
    }

    // Search dengan debounce manual — reset page
    function handleSearch(val: string) {
        setSearch(val)
        clearTimeout((handleSearch as any)._t)
            ; (handleSearch as any)._t = setTimeout(() => {
                setQuery(val)
                onPageChange(1)
            }, 400)
    }

    return (
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl p-6 space-y-4">

            {/* ── Header ── */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-xl font-bold">Karyawan</h2>
                    <p className="text-sm text-muted-foreground">
                        Ringkasan performa dan aktivitas karyawan untuk screening cepat sebelum masuk ke detail masing-masing user.
                    </p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari nama.."
                            value={search}
                            onChange={e => handleSearch(e.target.value)}
                            className="pl-9 pr-4 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-200 w-48"
                        />
                    </div>

                    {/* Mode toggle */}
                    {(["bulan", "tahun"] as const).map(m => (
                        <button
                            key={m}
                            onClick={() => { setMode(m); onPageChange(1) }}
                            className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${mode === m
                                ? "bg-cyan-600 text-white border-cyan-600"
                                : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                }`}
                        >
                            {m === "bulan" ? "1 Bulan" : "1 Tahun"}
                        </button>
                    ))}
                </div>
            </div>

            {/* ── Table ── */}
            <div className="w-full overflow-x-auto">
                <div className="w-full rounded-md border bg-white min-w-[800px]">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50 border-b border-slate-100">
                                <SortableHeader label="KARYAWAN" field="nama" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                <TableHead className="text-slate-600 text-xs">
                                    PENILAIAN KINERJA
                                    <span className="ml-1 text-gray-400">
                                        ({mode === "bulan" ? "Bulan Ini" : "1 Tahun"})
                                    </span>
                                </TableHead>
                                <SortableHeader label="DAILY ACTIVITY BERJALAN" field="aktivitasberjalan" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} className="text-center" />
                                <SortableHeader label="TOTAL DAILY ACTIVITY" field="totalaktivitas" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                <TableHead className="text-right text-slate-600 text-xs">AKSI</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                                        Memuat data...
                                    </TableCell>
                                </TableRow>
                            )}
                            {isError && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-red-500 text-sm">
                                        Gagal memuat data.
                                    </TableCell>
                                </TableRow>
                            )}
                            {!isLoading && items.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-10 text-muted-foreground text-sm">
                                        {query ? `Tidak ada karyawan dengan nama "${query}".` : "Tidak ada data."}
                                    </TableCell>
                                </TableRow>
                            )}
                            {items.map(item => {
                                const avatar = getAvatarColor(item.nama)
                                return (
                                    <TableRow
                                        key={item.id}
                                        className="hover:bg-slate-50/50 transition-colors"
                                    >
                                        {/* Karyawan */}
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatar.bg} ${avatar.text}`}>
                                                    {getInitials(item.nama)}
                                                </div>
                                                <div>
                                                    <p className="font-semibold text-gray-900">{item.nama}</p>
                                                    <p className="text-xs text-muted-foreground">{item.divisi}</p>
                                                </div>
                                            </div>
                                        </TableCell>

                                        {/* KPI Bar */}
                                        <TableCell>
                                            <KPIBar
                                                baik={item.baik}
                                                cukup={item.cukup}
                                                buruk={item.buruk}
                                            />
                                        </TableCell>

                                        {/* Aktivitas Berjalan */}
                                        <TableCell className="text-center">
                                            {item.aktivitasBerjalan > 0
                                                ? <span className="font-semibold text-gray-900">{item.aktivitasBerjalan}</span>
                                                : <span className="text-gray-300">-</span>
                                            }
                                        </TableCell>

                                        {/* Total Aktivitas */}
                                        <TableCell>
                                            <p className="font-bold text-gray-900">{item.totalAktivitas}</p>
                                            <p className="text-xs text-muted-foreground">aktivitas / tahun</p>
                                        </TableCell>

                                        {/* Aksi */}
                                        <TableCell className="text-right">
                                            <button
                                                onClick={() => navigate(`/kpi/${item.id}`)}
                                                className="text-cyan-600 text-sm font-medium hover:underline whitespace-nowrap"
                                            >
                                                Lihat Detail
                                            </button>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* ── Pagination ── */}
            {!isLoading && (
                <TablePagination
                    page={page}
                    totalPages={totalPages}
                    total={total}
                    showing={items.length}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    )
}
