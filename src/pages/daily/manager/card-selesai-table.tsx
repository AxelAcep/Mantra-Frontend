import { useEffect, useState, useRef } from "react"
import { CheckCircle, XCircle, Search, ChevronUp, ChevronDown, ChevronsUpDown, BadgeCheck } from "lucide-react"
import { useMasterSelesai, useKonfirmasiSelesai } from "@/hooks/use-master-activity"
import { TablePagination } from "./table-pagination"
import { TolakModal } from "./card-confirm-modal"
import { StatusBadge } from "./status-badge"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type NilaiKPI } from "@/services/kpi.services"
import { useDebounce } from "@/hooks/use-debounce"
import { cn } from "@/lib/utils"
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

function formatDateTime(iso: string) {
    const d = new Date(iso)
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
}: {
    label: string
    field: string
    sortBy: string
    sortDir: SortDir
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

// ─── Nilai KPI Selector ───────────────────────────────────────────────────────

function NilaiKPISelector({
    value,
    onChange,
    variant = "horizontal"
}: {
    value: NilaiKPI | null
    onChange: (v: NilaiKPI) => void
    variant?: "horizontal" | "vertical"
}) {
    const options = [
        {
            nilai: "BAIK" as NilaiKPI,
            label: "Baik",
            style: "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
            activeStyle: "bg-emerald-500 border-emerald-500 text-white",
            vBg: "bg-emerald-50",
            vBorder: "border-emerald-500",
            vText: "text-emerald-900",
            vRadio: "bg-emerald-500",
        },
        {
            nilai: "CUKUP" as NilaiKPI,
            label: "Cukup",
            style: "border-amber-200 text-amber-600 hover:bg-amber-50",
            activeStyle: "bg-amber-400 border-amber-400 text-white",
            vBg: "bg-amber-50",
            vBorder: "border-amber-500",
            vText: "text-amber-900",
            vRadio: "bg-amber-500",
        },
        {
            nilai: "BURUK" as NilaiKPI,
            label: "Buruk",
            style: "border-red-200 text-red-500 hover:bg-red-50",
            activeStyle: "bg-red-500 border-red-500 text-white",
            vBg: "bg-red-50",
            vBorder: "border-red-500",
            vText: "text-red-900",
            vRadio: "bg-red-500",
        },
    ]

    if (variant === "vertical") {
        return (
            <div className="flex flex-col gap-3 w-full">
                {options.map(opt => {
                    const isActive = value === opt.nilai
                    return (
                        <button
                            key={opt.nilai}
                            type="button"
                            onClick={() => onChange(opt.nilai)}
                            className={cn(
                                "flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all text-left",
                                isActive
                                    ? `${opt.vBg} ${opt.vBorder} ${opt.vText} shadow-sm`
                                    : "bg-white border-gray-100 text-gray-600 hover:border-gray-200"
                            )}
                        >
                            <div className={cn(
                                "w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors",
                                isActive ? opt.vBorder : "border-gray-300"
                            )}>
                                {isActive && <div className={cn("w-2.5 h-2.5 rounded-full", opt.vRadio)} />}
                            </div>
                            <span className="font-semibold">{opt.label}</span>
                        </button>
                    )
                })}
            </div>
        )
    }

    return (
        <div className="flex gap-2">
            {options.map(opt => (
                <button
                    key={opt.nilai}
                    type="button"
                    onClick={() => onChange(opt.nilai)}
                    className={cn(
                        "flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all",
                        value === opt.nilai ? opt.activeStyle : opt.style
                    )}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

// ─── Modal Konfirmasi Selesai + KPI ───────────────────────────────────────────

function ModalKonfirmasiSelesai({
    open,
    isPending,
    onConfirm,
    onClose,
}: {
    open: boolean
    isPending: boolean
    onConfirm: (nilai: NilaiKPI) => void
    onClose: () => void
}) {
    const [nilai, setNilai] = useState<NilaiKPI | null>(null)

    function handleClose() {
        setNilai(null)
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl p-6 gap-0">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg font-bold text-gray-900">
                        Konfirmasi Aktivitas Selesai
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600 mb-5">
                    Apakah Anda yakin aktivitas ini telah benar-benar selesai dikerjakan?
                    Berikan penilaian performa karyawan sebelum melanjutkan.
                </p>

                <div className="space-y-4 mb-8">
                    <p className="text-sm font-semibold text-gray-700">
                        Bagaimana performa karyawan?
                    </p>
                    <NilaiKPISelector
                        value={nilai}
                        onChange={setNilai}
                        variant="vertical"
                    />
                    {!nilai && (
                        <p className="text-xs text-gray-400 mt-1">
                            Pilih salah satu penilaian untuk melanjutkan.
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isPending}
                        className="border-gray-200 text-gray-600 font-semibold"
                    >
                        Tidak
                    </Button>
                    <Button
                        onClick={() => nilai && onConfirm(nilai)}
                        disabled={isPending || !nilai}
                        className={cn(
                            "font-semibold transition-all shadow-sm",
                            isPending || !nilai
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-none"
                                : "bg-cyan-600 hover:bg-cyan-700 text-white"
                        )}
                    >
                        {isPending ? "Memproses..." : "Ya, konfirmasi"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Tipe target ──────────────────────────────────────────────────────────────

type TerimaTarget = {
    activityId: string
    pegawaiId: string
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function SelesaiTable({
    page,
    onPageChange,
}: {
    page: number
    onPageChange: (p: number) => void
}) {
    const [searchInput, setSearchInput] = useState("")
    const search = useDebounce(searchInput, 400)
    const [sortBy, setSortBy] = useState("")
    const [sortDir, setSortDir] = useState<SortDir>("")
    const navigate = useNavigate()

    const { data, isLoading, isError } = useMasterSelesai(page, 5, search, sortBy, sortDir)

    const [terimaTarget, setTerimaTarget] = useState<TerimaTarget | null>(null)
    const [tolakTarget, setTolakTarget] = useState<string | null>(null)

    // ── Hooks ─────────────────────────────────────────────────────────────────
    const { mutateAsync: konfirmasiSelesaiAsync, isPending: loadingKonfirmasi } =
        useKonfirmasiSelesai()

    const { mutate: tolakSelesai, isPending: loadingTolak } =
        useKonfirmasiSelesai()

    const isPending = loadingKonfirmasi || loadingTolak

    const items = data?.data ?? []
    const total = data?.total ?? 0
    const totalPages = data?.totalPages ?? 1

    // ── Sort Handler ──────────────────────────────────────────────────────────

    function handleSort(field: string) {
        if (sortBy !== field) {
            setSortBy(field)
            setSortDir("asc")
        } else if (sortDir === "asc") {
            setSortDir("desc")
        } else if (sortDir === "desc") {
            // klik ketiga: reset sort
            setSortBy("")
            setSortDir("")
        }
        onPageChange(1)
    }

    // ── Search Handler ────────────────────────────────────────────────────────

    function handleSearch() {
        onPageChange(1)
    }

    function handleSearchKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key === "Enter") handleSearch()
    }

    // ── Handlers ──────────────────────────────────────────────────────────────

    async function handleTerima(nilai: NilaiKPI) {
        if (!terimaTarget) return
        try {
            await konfirmasiSelesaiAsync({
                activityId: terimaTarget.activityId,
                status: "DITERIMA",
                nilaiKPI: nilai,
            })
            setTerimaTarget(null)
        } catch {
            // error di-handle hook
        }
    }

    function handleTolak(alasan: string) {
        if (!tolakTarget) return
        tolakSelesai(
            { activityId: tolakTarget, status: "DITOLAK", alasan },
            { onSuccess: () => setTolakTarget(null) },
        )
    }

    const prevSearch = useRef(search)
    useEffect(() => {
        if (prevSearch.current === search) {
            return
        }
        prevSearch.current = search
        onPageChange(1)
    }, [search])

    return (
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden space-y-4">
            <div className="p-6 space-y-4">
                <div>
                    <h2 className="text-xl font-bold">Konfirmasi Selesai</h2>
                    <p className="text-sm text-muted-foreground">
                        Aktivitas yang telah dilaporkan selesai oleh karyawan dan menunggu konfirmasi.
                    </p>
                </div>

                {/* ── Search Bar ── */}
                <div className="flex gap-2">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Cari karyawan, judul, perusahaan..."
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                        />
                    </div>

                </div>

                <div className="w-full overflow-x-auto pb-4">
                    <div className="w-full rounded-md border bg-white min-w-[800px]">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-slate-50 border-b border-slate-100">
                                    <SortableHeader label="KARYAWAN" field="karyawan" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableHeader label="JUDUL AKTIVITAS" field="judul" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableHeader label="PERUSAHAAN" field="perusahaan" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableHeader label="KATEGORI" field="kategori" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableHeader label="TARGET SELESAI" field="targetSelesai" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <SortableHeader label="TANGGAL SUBMIT" field="waktuSubmit" sortBy={sortBy} sortDir={sortDir} onSort={handleSort} />
                                    <TableHead className="text-slate-600 text-xs text-center">STATUS</TableHead>
                                    <TableHead className="text-right text-slate-600 text-xs">AKSI</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                                            Memuat data...
                                        </TableCell>
                                    </TableRow>
                                )}
                                {isError && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-10 text-red-500 text-sm">
                                            Gagal memuat data.
                                        </TableCell>
                                    </TableRow>
                                )}
                                {!isLoading && items.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-10 text-muted-foreground text-sm">
                                            {search
                                                ? `Tidak ada hasil untuk "${search}".`
                                                : "Tidak ada aktivitas menunggu konfirmasi selesai."
                                            }
                                        </TableCell>
                                    </TableRow>
                                )}
                                {items.map((item) => {
                                    const avatar = getAvatarColor(item.pegawai.nama)
                                    return (
                                        <TableRow
                                            key={item.id}
                                            className="hover:bg-slate-50/50 transition-colors"
                                        >
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatar.bg} ${avatar.text}`}>
                                                        {getInitials(item.pegawai.nama)}
                                                    </div>
                                                    <div title={item.pegawai.nama} className="max-w-[150px]">
                                                        <p className="font-semibold text-gray-900 truncate">{item.pegawai.nama}</p>
                                                        <p className="text-xs text-muted-foreground truncate">{item.pegawai.divisi}</p>
                                                    </div>
                                                </div>
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-800 max-w-[200px] truncate" title={item.judul}>
                                                {item.judul}
                                            </TableCell>
                                            <TableCell className="font-medium text-gray-800 max-w-[150px] truncate" title={item.perusahaan}>
                                                {item.perusahaan}
                                            </TableCell>
                                            <TableCell>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                                                    {item.kategori?.replace(/_/g, " ")}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-gray-600 text-sm">
                                                {formatDateTime(item.targetSelesai)}
                                            </TableCell>
                                            <TableCell className="text-cyan-600 text-sm">
                                                {formatDateTime(item.waktuSubmit)}
                                            </TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-1 items-center">
                                                    <StatusBadge status="MENUNGGU_KONFIRMASI" />
                                                    {item.isSupervised && <VerifiedBadge />}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex items-center gap-2 justify-end">
                                                    <button
                                                        onClick={() => setTerimaTarget({
                                                            activityId: item.id,
                                                            pegawaiId: item.pegawaiId,
                                                        })}
                                                        disabled={isPending}
                                                        className="text-green-500 hover:text-green-600 disabled:opacity-40 transition-colors"
                                                        title="Konfirmasi Selesai"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => setTolakTarget(item.id)}
                                                        disabled={isPending}
                                                        className="text-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                                                        title="Tolak"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => navigate(`/dailyactivity/${item.id}`)}
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

                <ModalKonfirmasiSelesai
                    open={!!terimaTarget}
                    isPending={isPending}
                    onConfirm={handleTerima}
                    onClose={() => setTerimaTarget(null)}
                />

                <TolakModal
                    open={!!tolakTarget}
                    onClose={() => setTolakTarget(null)}
                    onConfirm={handleTolak}
                    isPending={loadingTolak}
                />
            </div>
        </div>
    )
}