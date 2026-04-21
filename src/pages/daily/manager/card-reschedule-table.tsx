import { useMemo, useState } from "react"
import { CheckCircle, ChevronsUpDown, Search, XCircle, ChevronUp, ChevronDown, BadgeCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom";
import {
    useMasterReschedule,
    useKonfirmasiReschedule,
    useTerimaSemuaReschedule,
} from "@/hooks/use-master-activity"
import { useDebounce } from "@/hooks/use-debounce";
import { TablePagination } from "./table-pagination"
import { ConfirmTerimaModal, TolakModal } from "./card-confirm-modal"
import { StatusBadge } from "./status-badge"    // ← NEW
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"

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

function formatDate(iso: string) {
    const d = new Date(iso)
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
}

function formatTime(iso: string) {
    const d = new Date(iso)
    return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} WIB`
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

type SortDir = "asc" | "desc" | ""

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
    title,
}: {
    label: string
    field: string
    sortBy: string | null
    sortDir: SortDir
    onSort: (field: string) => void
    title?: string
}) {
    const isActive = sortBy === field
    return (
        <TableHead
            className="cursor-pointer select-none group text-slate-600 text-xs"
            onClick={() => onSort(field)}
            title={title}
        >
            <div className="flex items-center gap-1">
                <span className={`uppercase font-medium transition-colors ${isActive ? "text-cyan-600" : ""} group-hover:text-cyan-600`}>
                    {label}
                </span>
                <SortIcon active={isActive} dir={isActive ? sortDir : ""} />
            </div>
        </TableHead>
    )
}

// ─── Component ────────────────────────────────────────────────────────────────

export function RescheduleTable({
    page,
    onPageChange,
}: {
    page: number
    onPageChange: (p: number) => void
}) {
    const [search, setSearch] = useState("")
    const [groupByKaryawan, setGroupByKaryawan] = useState(false)
    const [sortConfig, setSortConfig] = useState<{
        key: string | null,
        direction: SortDir
    }>({ key: null, direction: "" })

    const debouncedSearch = useDebounce(search, 400)

    const { data, isLoading, isError } = useMasterReschedule(page, 10, debouncedSearch)
    const konfirmasi = useKonfirmasiReschedule()
    const terimaSemuaMutation = useTerimaSemuaReschedule(data?.data ?? [])

    const [terimaTarget, setTerimaTarget] = useState<string | null>(null)
    const [tolakTarget, setTolakTarget] = useState<string | null>(null)
    const [terimaSemuaOpen, setTerimaSemuaOpen] = useState(false)

    const navigate = useNavigate()
    const items = data?.data ?? []
    const total = data?.total ?? 0
    const totalPages = data?.totalPages ?? 1

    // ── Sorting & Grouping Logic ──
    const sortedItems = useMemo(() => {
        let sortable = [...items]

        if (sortConfig.key && sortConfig.direction) {
            sortable.sort((a, b) => {
                let valA: any, valB: any
                if (sortConfig.key === "judul") {
                    valA = a.activity.judul.toLowerCase()
                    valB = b.activity.judul.toLowerCase()
                } else if (sortConfig.key === "awal") {
                    valA = new Date(a.activity.targetSelesai).getTime()
                    valB = new Date(b.activity.targetSelesai).getTime()
                } else if (sortConfig.key === "baru") {
                    valA = new Date(a.targetSelesaiBaru).getTime()
                    valB = new Date(b.targetSelesaiBaru).getTime()
                } else if (sortConfig.key === "karyawan") {
                    valA = a.activity.pegawai.nama.toLowerCase()
                    valB = b.activity.pegawai.nama.toLowerCase()
                }

                if (valA !== undefined && valB !== undefined) {
                    if (valA < valB) return sortConfig.direction === "asc" ? -1 : 1
                    if (valA > valB) return sortConfig.direction === "asc" ? 1 : -1
                }
                return 0
            })
        }

        if (groupByKaryawan) {
            // Jika grup aktif, sort utama by nama karyawan
            return [...sortable].sort((a, b) =>
                a.activity.pegawai.nama.localeCompare(b.activity.pegawai.nama)
            )
        }

        return sortable
    }, [items, groupByKaryawan, sortConfig])

    const handleTerima = () => {
        if (!terimaTarget) return
        konfirmasi.mutate(
            { rescheduleId: terimaTarget, status: "DITERIMA" },
            { onSuccess: () => setTerimaTarget(null) }
        )
    }

    const handleTolak = (alasan: string) => {
        if (!tolakTarget) return
        konfirmasi.mutate(
            { rescheduleId: tolakTarget, status: "DITOLAK", alasan },
            { onSuccess: () => setTolakTarget(null) }
        )
    }

    // Reset ke page 1 setiap kali search berubah
    const handleSearch = (val: string) => {
        setSearch(val)
        onPageChange(1)
    }

    const handleSort = (key: string) => {
        if (key !== "karyawan") setGroupByKaryawan(false)

        if (sortConfig.key !== key) {
            setSortConfig({ key, direction: "asc" })
        } else if (sortConfig.direction === "asc") {
            setSortConfig({ key, direction: "desc" })
        } else {
            setSortConfig({ key: null, direction: "" })
        }
    }

    return (
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden space-y-4">
            <div className="p-6 space-y-4">
                {/* Header */}
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold">Pengajuan Reschedule</h2>
                        <p className="text-sm text-muted-foreground">
                            Permintaan perubahan jadwal, termasuk yang sudah overdue agar mudah diprioritaskan.
                        </p>
                    </div>
                    <Button
                        onClick={() => setTerimaSemuaOpen(true)}
                        disabled={items.length === 0 || terimaSemuaMutation.isPending}
                        className={`font-semibold transition-all ${items.length === 0 || terimaSemuaMutation.isPending
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-cyan-600 hover:bg-cyan-700 text-white"
                            }`}
                    >
                        Terima Semua Pengajuan
                    </Button>
                </div>

                {/* ── Search Bar ── */}
                <div className="relative max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Cari nama karyawan atau judul..."
                        value={search}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                    />
                </div>

                {/* Table */}
                <div className="w-full overflow-x-auto">
                    <div className="w-full rounded-md border bg-white min-w-[800px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 border-b border-slate-100">
                                    <SortableHeader
                                        label="KARYAWAN"
                                        field="karyawan"
                                        sortBy={sortConfig.key}
                                        sortDir={sortConfig.direction}
                                        onSort={(f) => {
                                            handleSort(f)
                                            setGroupByKaryawan(prev => !prev)
                                        }}
                                        title="Klik untuk group per karyawan"
                                    />
                                    <SortableHeader
                                        label="JUDUL AKTIVITAS"
                                        field="judul"
                                        sortBy={sortConfig.key}
                                        sortDir={sortConfig.direction}
                                        onSort={handleSort}
                                    />
                                    <TableHead className="text-slate-600 text-xs">PERUSAHAAN</TableHead>
                                    <SortableHeader
                                        label="JADWAL AWAL"
                                        field="awal"
                                        sortBy={sortConfig.key}
                                        sortDir={sortConfig.direction}
                                        onSort={handleSort}
                                    />
                                    <SortableHeader
                                        label="JADWAL BARU"
                                        field="baru"
                                        sortBy={sortConfig.key}
                                        sortDir={sortConfig.direction}
                                        onSort={handleSort}
                                    />
                                    <TableHead className="text-slate-600 text-xs">ALASAN</TableHead>
                                    <TableHead className="text-slate-600 text-xs text-center">STATUS</TableHead>
                                    <TableHead className="text-right text-slate-600 text-xs">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && (
                                    <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">Memuat data...</TableCell></TableRow>
                                )}
                                {isError && (
                                    <TableRow><TableCell colSpan={8} className="text-center py-10 text-red-500 text-sm">Gagal memuat data.</TableCell></TableRow>
                                )}
                                {!isLoading && sortedItems.length === 0 && (
                                    <TableRow><TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">Tidak ada pengajuan reschedule.</TableCell></TableRow>
                                )}
                                {sortedItems.map((item, idx) => {
                                    const avatar = getAvatarColor(item.activity.pegawai.nama)

                                    // Kalau group aktif, sembunyikan nama jika baris sebelumnya sama
                                    const isSameKaryawan =
                                        groupByKaryawan &&
                                        idx > 0 &&
                                        sortedItems[idx - 1].activity.pegawai.nama === item.activity.pegawai.nama

                                    return (
                                        <TableRow key={item.id} className={`hover:bg-slate-50/50 transition-colors ${groupByKaryawan && !isSameKaryawan && idx !== 0 ? "border-t-2 border-t-cyan-100" : ""
                                            }`}>
                                            <TableCell>
                                                {!isSameKaryawan ? (
                                                    <div className="flex items-center gap-3">
                                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatar.bg} ${avatar.text}`}>
                                                            {getInitials(item.activity.pegawai.nama)}
                                                        </div>
                                                        <div title={item.activity.pegawai.nama} className="max-w-[150px]">
                                                            <p className="font-semibold text-gray-900 truncate">{item.activity.pegawai.nama}</p>
                                                            <p className="text-xs text-muted-foreground truncate">{item.activity.pegawai.divisi}</p>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    // Baris lanjutan karyawan yang sama → indent kecil
                                                    <div className="pl-12 text-xs text-muted-foreground italic">↳ sama</div>
                                                )}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-800 max-w-[200px] truncate" title={item.activity.judul}>{item.activity.judul}</TableCell>
                                            <TableCell className="font-medium text-gray-800 max-w-[150px] truncate" title={item.activity.perusahaan}>{item.activity.perusahaan}</TableCell>
                                            <TableCell className="text-gray-600">
                                                <p>{formatDate(item.activity.targetSelesai)}</p>
                                                <p className="text-xs">{formatTime(item.activity.targetSelesai)}</p>
                                            </TableCell>
                                            <TableCell className="text-cyan-600 font-semibold">
                                                <p>{formatDate(item.targetSelesaiBaru)}</p>
                                                <p className="text-xs">{formatTime(item.targetSelesaiBaru)}</p>
                                            </TableCell>
                                            <TableCell className="text-gray-600 max-w-[200px]" title={item.alasan}>
                                                <p className="truncate text-sm">{item.alasan}</p>
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <StatusBadge status="PENDING" />
                                                    {item.activity.isSupervised && <VerifiedBadge />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => setTerimaTarget(item.id)}
                                                        disabled={konfirmasi.isPending}
                                                        className="text-green-500 hover:text-green-600 disabled:opacity-40 transition-colors"
                                                        title="Terima"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setTolakTarget(item.id)}
                                                        disabled={konfirmasi.isPending}
                                                        className="text-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                                                        title="Tolak"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/dailyactivity/${item.activityId}`)}
                                                        className="text-cyan-600 text-sm font-medium hover:underline ml-1 whitespace-nowrap"
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
                </div>

                {!isLoading && (
                    <TablePagination
                        page={page}
                        totalPages={totalPages}
                        total={total}
                        showing={items.length}
                        onPageChange={onPageChange}
                    />
                )}

                {/* Modals (tidak berubah) */}
                <ConfirmTerimaModal open={!!terimaTarget} onClose={() => setTerimaTarget(null)} onConfirm={handleTerima} isPending={konfirmasi.isPending} />
                <TolakModal open={!!tolakTarget} onClose={() => setTolakTarget(null)} onConfirm={handleTolak} isPending={konfirmasi.isPending} />
                <ConfirmTerimaModal
                    open={terimaSemuaOpen}
                    onClose={() => setTerimaSemuaOpen(false)}
                    onConfirm={() => terimaSemuaMutation.mutate(undefined, { onSuccess: () => setTerimaSemuaOpen(false) })}
                    isPending={terimaSemuaMutation.isPending}
                    title="Terima Semua Pengajuan"
                    message={`Apakah Anda yakin ingin menerima semua ${items.length} pengajuan reschedule pada halaman ini?`}
                />
            </div>
        </div>
    )
}