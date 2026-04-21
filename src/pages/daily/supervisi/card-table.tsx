import { useState, useMemo } from "react"
import {
    Table, TableBody, TableCell, TableHead,
    TableHeader, TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, ChevronsUpDown } from "lucide-react"
import type { Activity, PaginatedActivity } from "../../../services/activity.services"
import { CheckCircle, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useKonfirmasiKolaborasi } from "@/hooks/use-activity"
import { DialogKonfirmasi } from "./dialog-konfirmasi"


type SortKey = "kategori" | "terkaitPO" | "targetSelesai" | "status" | "perusahaan" | null
type SortDir = "asc" | "desc"

type Props = {
    data?: PaginatedActivity
    isLoading: boolean
    isError: boolean
    page: number
    onPageChange: (page: number) => void
}

function formatDate(iso: string) {
    const d = new Date(iso)
    return {
        tanggal: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        waktu: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
    }
}

function isOverdue(activity: Activity) {
    return (
        activity.status === "ON_PROGRESS" &&
        new Date(activity.targetSelesai) < new Date()
    )
}

const STATUS_LABEL: Record<string, string> = {
    ON_PROGRESS: "On Progress",
    PENDING: "Reschedule",
    KONFIRMASI_SELESAI: "Menunggu Konfirmasi",
    DITERIMA: "Selesai",
    DITOLAK: "Ditolak",
    PENDING_PEGAWAI: "Pending"
}

const STATUS_STYLE: Record<string, string> = {
    ON_PROGRESS: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    PENDING_PEGAWAI: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    KONFIRMASI_SELESAI: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    DITERIMA: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    DITOLAK: "bg-red-100 text-red-700 hover:bg-red-100",
    OVERDUE: "bg-red-100 text-red-700 hover:bg-red-100",
}

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

function SortButton({ label, active, onClick }: {
    label: string
    sortKey: SortKey
    active: boolean
    dir: SortDir
    onClick: () => void
}) {
    return (
        <button onClick={onClick} className="flex items-center gap-1 group">
            {label}
            <ChevronsUpDown className={`w-3 h-3 ${active ? "text-cyan-500" : "text-slate-300 group-hover:text-slate-400"}`} />
        </button>
    )
}

function AksiCell({ item, overdue }: { item: Activity; overdue: boolean }) {
    const navigate = useNavigate()
    const { mutate: konfirmasiKol, isPending: pendingKol } = useKonfirmasiKolaborasi()
    const [dialog, setDialog] = useState<"DITERIMA" | "DITOLAK" | null>(null)

    if (item.isKonfirmasiKolaborasi) {
        return (
            <>
                <div className="flex items-center justify-end gap-2">
                    <button
                        onClick={() => setDialog("DITERIMA")}
                        disabled={pendingKol}
                        className="text-green-500 hover:text-green-600 disabled:opacity-40 transition-colors"
                        title="Terima"
                    >
                        <CheckCircle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setDialog("DITOLAK")}
                        disabled={pendingKol}
                        className="text-red-400 hover:text-red-500 disabled:opacity-40 transition-colors"
                        title="Tolak"
                    >
                        <XCircle className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => navigate(`/dailyactivity/${item.id}`)}
                        className="text-cyan-600 font-medium hover:underline text-sm"
                    >
                        Lihat Detail →
                    </button>
                </div>

                <DialogKonfirmasi
                    open={dialog === "DITERIMA"}
                    onOpenChange={(o) => !o && setDialog(null)}
                    title="Terima Tugas"
                    description={`Kamu akan menerima tugas "${item.judul}". Setelah diterima, tugas akan masuk ke daftar aktivitasmu.`}
                    confirmLabel={pendingKol ? "Memproses..." : "Ya, terima"}
                    onConfirm={() => {
                        konfirmasiKol({ id: item.id, payload: { status: "DITERIMA" } })
                        setDialog(null)
                    }}
                />

                <DialogKonfirmasi
                    open={dialog === "DITOLAK"}
                    onOpenChange={(o) => !o && setDialog(null)}
                    title="Tolak Tugas"
                    description={`Kamu akan menolak tugas "${item.judul}". Tugas akan dibatalkan dan tidak bisa dikembalikan.`}
                    confirmLabel={pendingKol ? "Memproses..." : "Ya, tolak"}
                    variant="danger"
                    onConfirm={() => {
                        konfirmasiKol({ id: item.id, payload: { status: "DITOLAK" } })
                        setDialog(null)
                    }}
                />
            </>
        )
    }

    // Pending
    if (item.status === "PENDING") {
        return (
            <button
                onClick={() => navigate(`/dailyactivity/${item.id}`)}
                className="text-cyan-600 font-medium hover:underline text-sm"
            >
                Lihat Detail →
            </button>
        )
    }



    // Ditolak atau Overdue
    if (item.status === "DITOLAK" || overdue) {
        return (
            <button
                onClick={() => navigate(`/dailyactivity/${item.id}`)}
                className="text-cyan-600 font-medium hover:underline text-sm"
            >
                Reschedule Ulang →
            </button>
        )
    }

    return (
        <button
            onClick={() => navigate(`/dailyactivity/${item.id}`)}
            className="text-cyan-600 font-medium hover:underline text-sm"
        >
            Lihat Detail →
        </button>
    )
}

export function ActivityTable({ data, isLoading, isError, page, onPageChange }: Props) {
    const [sortKey, setSortKey] = useState<SortKey>(null)
    const [sortDir, setSortDir] = useState<SortDir>("asc")

    function handleSort(key: SortKey) {
        if (sortKey === key) {
            setSortDir((d) => (d === "asc" ? "desc" : "asc"))
        } else {
            setSortKey(key)
            setSortDir("asc")
        }
    }

    const sorted = useMemo(() => {
        if (!data?.data || !sortKey) return data?.data ?? []
        return [...data.data].sort((a, b) => {
            let aVal = ""
            let bVal = ""
            if (sortKey === "kategori") { aVal = a.kategori; bVal = b.kategori }
            if (sortKey === "perusahaan") { aVal = a.perusahaan ?? ""; bVal = b.perusahaan ?? "" }
            if (sortKey === "targetSelesai") { aVal = a.targetSelesai; bVal = b.targetSelesai }
            if (sortKey === "status") { aVal = a.status; bVal = b.status }
            return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
        })
    }, [data, sortKey, sortDir])

    const totalPages = data?.meta.totalPages ?? 1

    function renderPages() {
        const pages: (number | "...")[] = []
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (page > 3) pages.push("...")
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
            if (page < totalPages - 2) pages.push("...")
            pages.push(totalPages)
        }
        return pages
    }

    return (
        <div className="rounded-md border bg-white">
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50">
                        <TableHead className="text-slate-600 text-xs">TANGGAL INPUT</TableHead>
                        <TableHead className="text-slate-600 text-xs">JUDUL</TableHead>
                        <TableHead className="text-slate-600 text-xs">
                            <SortButton label="KATEGORI" sortKey="kategori" active={sortKey === "kategori"} dir={sortDir} onClick={() => handleSort("kategori")} />
                        </TableHead>
                        <TableHead className="text-slate-600 text-xs">
                            <SortButton label="PERUSAHAAN" sortKey="perusahaan" active={sortKey === "perusahaan"} dir={sortDir} onClick={() => handleSort("perusahaan")} />
                        </TableHead>
                        <TableHead className="text-slate-600 text-xs">
                            <SortButton label="DEADLINE" sortKey="targetSelesai" active={sortKey === "targetSelesai"} dir={sortDir} onClick={() => handleSort("targetSelesai")} />
                        </TableHead>
                        <TableHead className="text-slate-600 text-xs">
                            <SortButton label="STATUS" sortKey="status" active={sortKey === "status"} dir={sortDir} onClick={() => handleSort("status")} />
                        </TableHead>
                        <TableHead className="text-right text-slate-600 text-xs">AKSI</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-16 text-slate-400">Memuat data...</TableCell>
                        </TableRow>
                    )}
                    {isError && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-16 text-rose-400">Gagal memuat data.</TableCell>
                        </TableRow>
                    )}
                    {!isLoading && !isError && sorted.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={7} className="text-center py-16 text-slate-400">Tidak ada data.</TableCell>
                        </TableRow>
                    )}
                    {sorted.map((item) => {
                        const input = formatDate(item.createdAt)
                        const deadline = formatDate(item.targetSelesai)
                        const overdue = isOverdue(item)
                        return (
                            <TableRow key={item.id}>
                                <TableCell>
                                    <p className="text-sm text-muted-foreground leading-tight">{input.tanggal}</p>
                                    <p className="text-xs text-muted-foreground leading-tight">{input.waktu}</p>
                                </TableCell>
                                <TableCell className="font-medium text-slate-700 max-w-[200px] truncate">{item.judul}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{KATEGORI_LABEL[item.kategori] ?? item.kategori}</TableCell>
                                <TableCell className="text-sm text-muted-foreground">{item.perusahaan ?? "-"}</TableCell>
                                <TableCell>
                                    <p className={`text-sm leading-tight ${overdue ? "text-red-500 font-medium" : "text-muted-foreground"}`}>{deadline.tanggal}</p>
                                    <p className={`text-xs leading-tight ${overdue ? "text-red-400" : "text-muted-foreground"}`}>{deadline.waktu}</p>
                                </TableCell>
                                <TableCell>
                                    <Badge className={`${overdue ? STATUS_STYLE.OVERDUE : STATUS_STYLE[item.status]} border-none shadow-none px-3`}>
                                        {overdue ? "Overdue" : STATUS_LABEL[item.status]}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-right">
                                    <AksiCell item={item} overdue={overdue} />
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                <p className="text-sm text-slate-500">
                    Menampilkan <span className="font-semibold text-slate-700">{data?.data.length ?? 0}</span> dari{" "}
                    <span className="font-semibold text-slate-700">{data?.meta.total ?? 0}</span> data
                </p>
                <div className="flex items-center gap-1">
                    <button
                        onClick={() => onPageChange(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    {renderPages().map((p, i) =>
                        p === "..." ? (
                            <span key={`e-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400">...</span>
                        ) : (
                            <button
                                key={p}
                                onClick={() => onPageChange(p)}
                                className={`w-8 h-8 flex items-center justify-center font-medium rounded-md text-sm transition-colors ${page === p ? "bg-cyan-500 text-white" : "text-slate-600 hover:text-cyan-600 hover:bg-cyan-50"}`}
                            >
                                {p}
                            </button>
                        )
                    )}
                    <button
                        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}