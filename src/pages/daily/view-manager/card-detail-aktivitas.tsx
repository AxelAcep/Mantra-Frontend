import { useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    waktuMulai: string
    waktuSubmit?: string
    targetSelesai: string
    kategori: string
    perusahaan?: string
    judul: string
    deskripsi: string
    status: string

    // Opsional — muncul hanya kalau ada
    alasanReschedule?: string
    alasanPenolakan?: string
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(iso: string) {
    const d = new Date(iso)
    return (
        d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }) +
        ", " +
        d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) +
        " WIB"
    )
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

// ─── Sub-components ───────────────────────────────────────────────────────────

function FieldItem({ label, value }: { label: string; value: string }) {
    return (
        <div>
            <p className="text-xs text-gray-500 font-medium mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-800 break-words">{value}</p>
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function DetailAktivitasCard({
    waktuMulai,
    waktuSubmit,
    targetSelesai,
    kategori,
    perusahaan,
    judul,
    deskripsi,
    alasanReschedule,
    alasanPenolakan,
}: Props) {
    const [open, setOpen] = useState(true)
    const [isExpanded, setIsExpanded] = useState(false)

    // Tampilkan section "Alasan" hanya kalau minimal salah satu ada
    const showAlasanSection = !!alasanReschedule || !!alasanPenolakan

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

            {/* ── Collapsible Header ── */}
            <button
                onClick={() => setOpen(o => !o)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
            >
                <div className="text-left">
                    <p className="text-xs font-semibold text-cyan-500 mb-0.5">Bagian 1</p>
                    <h3 className="text-base font-bold text-gray-900">Detail Aktivitas Pekerjaan</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Ringkasan teknis pekerjaan yang dikerjakan, konteks perusahaan terkait, target waktu, serta kondisi akhir dari aktivitas yang dilaporkan.
                    </p>
                </div>
                {open
                    ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                }
            </button>

            {open && (
                <div className="px-6 pb-6 space-y-5 border-t border-gray-100">

                    {/* ── Grid fields ── */}
                    <div className="grid grid-cols-2 gap-6 mt-5">
                        <FieldItem
                            label="Waktu Mulai"
                            value={formatDateTime(waktuMulai)}
                        />
                        <FieldItem
                            label="Kategori Pekerjaan"
                            value={KATEGORI_LABEL[kategori] ?? kategori}
                        />
                        <FieldItem
                            label="Waktu Submit"
                            value={waktuSubmit ? formatDateTime(waktuSubmit) : "-"}
                        />
                        <FieldItem
                            label="Target Selesai"
                            value={formatDateTime(targetSelesai)}
                        />
                    </div>

                    {/* ── Perusahaan ── */}
                    <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Perusahaan</p>
                        {perusahaan ? (
                            <p className="text-sm font-semibold text-cyan-500">{perusahaan}</p>
                        ) : (
                            <p className="text-sm font-semibold text-gray-800">-</p>
                        )}
                    </div>

                    {/* ── Judul ── */}
                    <FieldItem label="Judul" value={judul} />

                    {/* ── Deskripsi ── */}
                    <div>
                        <p className="text-xs text-gray-500 font-medium mb-1">Deskripsi</p>
                        <div className={cn(
                            "text-sm text-gray-700 leading-relaxed break-all whitespace-pre-wrap transition-all duration-300",
                            !isExpanded && "line-clamp-2 overflow-hidden"
                        )}>
                            {deskripsi}
                        </div>
                        {deskripsi.length > 100 && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-cyan-500 hover:underline mt-1 font-medium text-sm inline-block"
                            >
                                {isExpanded ? "lihat lebih sedikit" : "lihat selengkapnya"}
                            </button>
                        )}
                    </div>

                    {/* ── Alasan Section — muncul hanya kalau ada reschedule/penolakan ── */}
                    {showAlasanSection && (
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            <h4 className="text-base font-bold text-gray-900">Alasan Reschedule</h4>

                            <div className={`grid gap-4 ${alasanReschedule && alasanPenolakan
                                ? "grid-cols-2"
                                : "grid-cols-1"
                                }`}>

                                {/* Alasan Reschedule — abu-abu */}
                                {alasanReschedule && (
                                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
                                        <p className="text-xs text-slate-400 font-medium">
                                            Alasan Reschedule
                                        </p>
                                        <p className="text-sm text-gray-700 leading-relaxed">
                                            {alasanReschedule}
                                        </p>
                                    </div>
                                )}

                                {/* Alasan Penolakan MO — oranye */}
                                {alasanPenolakan && (
                                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 space-y-2">
                                        <p className="text-xs text-orange-400 font-medium">
                                            Alasan Penolakan MO
                                        </p>
                                        <p className="text-sm text-orange-600 leading-relaxed">
                                            {alasanPenolakan}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}
