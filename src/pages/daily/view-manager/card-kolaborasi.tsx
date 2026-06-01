import { useState } from "react"
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<string, string> = {
    ON_PROGRESS: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    PENDING: "bg-amber-100  text-amber-700  hover:bg-amber-100",
    DITERIMA: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    DITOLAK: "bg-red-100    text-red-700    hover:bg-red-100",
    KONFIRMASI_SELESAI: "bg-blue-100   text-blue-700   hover:bg-blue-100",
}

const STATUS_LABEL: Record<string, string> = {
    ON_PROGRESS: "On Progress",
    PENDING: "Menunggu",
    DITERIMA: "Selesai",
    DITOLAK: "Ditolak",
    KONFIRMASI_SELESAI: "Menunggu Konfirmasi",
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Kolaborator = {
    id: string
    pegawai: { id: string; nama: string; divisi: string }
    judul: string
    status: string
    childActivityId?: string   // ← untuk link ke detail activity kolaborator
}

type Props = {
    kolaborator?: Kolaborator[]   // ← tambah ?
    onLihatDetail?: (childActivityId: string) => void
}

// ─── Field Box ────────────────────────────────────────────────────────────────

function FieldBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 min-w-0">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-800 truncate" title={value}>{value}</p>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function KolaborasiCardAdmin({ kolaborator = [], onLihatDetail }: Props) {
    const [open, setOpen] = useState(true)

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            {/* ── Collapsible Header ── */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
                <div className="text-left">
                    <p className="text-xs font-semibold text-cyan-500 mb-0.5">Bagian 2</p>
                    <h3 className="text-base font-bold text-gray-900">Kolaborasi</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Daftar rekan kerja yang terlibat dalam aktivitas ini beserta status penyelesaiannya.
                    </p>
                </div>
                {open
                    ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                }
            </button>

            {open && (
                <div className="px-6 pb-6 border-t border-gray-100">

                    {/* ── Empty state ── */}
                    {kolaborator.length === 0 && (
                        <p className="text-sm text-slate-400 mt-4">
                            Tidak ada kolaborator pada aktivitas ini.
                        </p>
                    )}

                    {/* ── Header kolom ── */}
                    {kolaborator.length > 0 && (
                        <div className="grid grid-cols-[2rem_1fr_1fr_2fr_1fr_auto] gap-3 mt-4 mb-1 px-1">
                            <div />

                            <div />
                        </div>
                    )}

                    {/* ── Rows ── */}
                    <div className="space-y-2">
                        {kolaborator.map((kol, i) => (
                            <div
                                key={kol.id}
                                className="grid grid-cols-[2rem_1fr_1fr_2fr_1fr_auto] gap-3 items-stretch"
                            >
                                {/* Nomor */}
                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 self-center">
                                    <span className="text-xs font-semibold text-slate-500">{i + 1}</span>
                                </div>

                                {/* Nama */}
                                <FieldBox label="Nama Karyawan" value={kol.pegawai.nama} />

                                {/* Divisi */}
                                <FieldBox label="Divisi" value={kol.pegawai.divisi} />

                                {/* Judul */}
                                <FieldBox label="Judul" value={kol.judul} />

                                {/* Status */}
                                <div className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <p className="text-xs text-gray-400 mb-1">Status</p>
                                    <Badge
                                        className={`${STATUS_STYLE[kol.status] ?? "bg-gray-100 text-gray-600"
                                            } border-none shadow-none px-2.5 text-xs`}
                                    >
                                        {STATUS_LABEL[kol.status] ?? kol.status}
                                    </Badge>
                                </div>

                                {/* Lihat Detail */}
                                <button
                                    onClick={() => kol.childActivityId && onLihatDetail?.(kol.childActivityId)}
                                    disabled={!kol.childActivityId}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-cyan-400 text-cyan-500 text-sm font-medium
                                        hover:bg-cyan-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap self-center"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Lihat Detail
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}
