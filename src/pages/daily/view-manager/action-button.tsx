import { useState } from "react"
import { CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { useKonfirmasiSelesai, useKonfirmasiReschedule } from "@/hooks/use-master-activity"
import { type NilaiKPI } from "@/services/kpi.services"

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    activityId: string
    rescheduleId?: string
    status: string
}

import { cn } from "@/lib/utils"

// ─── Nilai KPI Selector ───────────────────────────────────────────────────────

export function NilaiKPISelector({
    value,
    onChange,
    variant = "horizontal"
}: {
    value: NilaiKPI | null
    onChange: (v: NilaiKPI) => void
    variant?: "horizontal" | "vertical"
}) {
    const options: {
        nilai: NilaiKPI
        label: string
        style: string     // horizontal idle
        activeStyle: string // horizontal active
        vBg: string       // vertical bg
        vBorder: string   // vertical border
        vText: string     // vertical text
        vRadio: string    // vertical radio inner
    }[] = [
            {
                nilai: "BAIK",
                label: "Baik",
                style: "border-emerald-200 text-emerald-600 hover:bg-emerald-50",
                activeStyle: "bg-emerald-500 border-emerald-500 text-white",
                vBg: "bg-emerald-50",
                vBorder: "border-emerald-500",
                vText: "text-emerald-900",
                vRadio: "bg-emerald-500",
            },
            {
                nilai: "CUKUP",
                label: "Cukup",
                style: "border-amber-200 text-amber-600 hover:bg-amber-50",
                activeStyle: "bg-amber-400 border-amber-400 text-white",
                vBg: "bg-amber-50",
                vBorder: "border-amber-500",
                vText: "text-amber-900",
                vRadio: "bg-amber-500",
            },
            {
                nilai: "BURUK",
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
                    className={`flex-1 py-2.5 rounded-xl border-2 text-sm font-semibold transition-all ${value === opt.nilai ? opt.activeStyle : opt.style
                        }`}
                >
                    {opt.label}
                </button>
            ))}
        </div>
    )
}

// ─── Modal Terima Konfirmasi Selesai (dengan KPI) ─────────────────────────────

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

// ─── Modal Terima Reschedule (tanpa KPI) ──────────────────────────────────────

function ModalTerimaReschedule({
    open,
    isPending,
    onConfirm,
    onClose,
}: {
    open: boolean
    isPending: boolean
    onConfirm: () => void
    onClose: () => void
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[440px] bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            Setujui Reschedule
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600 mb-8">
                        Apakah Anda yakin ingin menyetujui pengajuan reschedule ini?
                    </p>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 border-gray-200 text-gray-600 font-semibold h-11 rounded-xl hover:bg-gray-50"
                        >
                            Tidak
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isPending}
                            className={cn(
                                "flex-1 font-semibold h-11 rounded-xl transition-all shadow-sm",
                                isPending
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border-none"
                                    : "bg-cyan-500 hover:bg-cyan-600 text-white"
                            )}
                        >
                            {isPending ? "Memproses..." : "Ya, setujui"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Modal Tolak ──────────────────────────────────────────────────────────────

function ModalTolak({
    open,
    label,
    isPending,
    onConfirm,
    onClose,
}: {
    open: boolean
    label: string
    isPending: boolean
    onConfirm: (alasan: string) => void
    onClose: () => void
}) {
    const [alasan, setAlasan] = useState("")

    function handleClose() {
        setAlasan("")
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[440px] bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-gray-900">
                            {label}
                        </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-2 mb-8">
                        <label className="text-sm font-semibold text-gray-700">
                            Alasan Penolakan
                        </label>
                        <Textarea
                            placeholder="Masukkan alasan penolakan..."
                            value={alasan}
                            onChange={e => setAlasan(e.target.value)}
                            className="bg-slate-50 border-gray-100 text-gray-700 resize-none rounded-xl focus:ring-cyan-500 min-h-[120px]"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <Button
                            variant="outline"
                            onClick={handleClose}
                            disabled={isPending}
                            className="flex-1 border-gray-200 text-gray-600 font-semibold h-11 rounded-xl hover:bg-gray-50"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={() => { if (alasan.trim()) onConfirm(alasan.trim()) }}
                            disabled={isPending || !alasan.trim()}
                            className={cn(
                                "flex-1 font-semibold h-11 rounded-xl transition-all shadow-sm",
                                isPending || !alasan.trim()
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border-none"
                                    : "bg-red-500 hover:bg-red-600 text-white"
                            )}
                        >
                            {isPending ? "Memproses..." : "Ya, tolak"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function ActionButtonsAdmin({
    activityId,
    rescheduleId,
    status,
}: Props) {
    const [showTerima, setShowTerima] = useState(false)
    const [showTolak, setShowTolak] = useState(false)

    const { mutate: konfirmasiSelesai, isPending: loadingSelesai } = useKonfirmasiSelesai()
    const { mutate: konfirmasiReschedule, isPending: loadingReschedule } = useKonfirmasiReschedule()

    const isPending = loadingSelesai || loadingReschedule
    const isKonfirmasiSelesai = status === "KONFIRMASI_SELESAI"
    const isKonfirmasiReschedule = status === "PENDING"

    if (!isKonfirmasiSelesai && !isKonfirmasiReschedule) return null

    const labelTolak = isKonfirmasiSelesai ? "Tolak Konfirmasi" : "Tolak Reschedule"
    const labelModalTolak = isKonfirmasiSelesai ? "Tolak Penyelesaian" : "Tolak Reschedule"

    // ── Handler Terima Selesai — trigger konfirmasi + KPI ─────────────────────
    function handleTerimaSelesai(nilai: NilaiKPI) {
        konfirmasiSelesai(
            { activityId, status: "DITERIMA", nilaiKPI: nilai },
            {
                onSuccess: () => {
                    setShowTerima(false)
                },
            },
        )
    }

    // ── Handler Terima Reschedule — tidak butuh KPI ───────────────────────────
    function handleTerimaReschedule() {
        if (!rescheduleId) return
        konfirmasiReschedule(
            { rescheduleId, status: "DITERIMA" },
            { onSuccess: () => setShowTerima(false) },
        )
    }

    function handleTolak(alasan: string) {
        if (isKonfirmasiSelesai) {
            konfirmasiSelesai(
                { activityId, status: "DITOLAK", alasan },
                { onSuccess: () => setShowTolak(false) },
            )
        } else if (rescheduleId) {
            konfirmasiReschedule(
                { rescheduleId, status: "DITOLAK", alasan },
                { onSuccess: () => setShowTolak(false) },
            )
        }
    }

    return (
        <>
            {/* Baris Action Buttons — Sticky di bawah */}
            <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 px-6 flex justify-end items-center gap-3 mt-8 -mx-6 -mb-6">
                <Button
                    variant="outline"
                    onClick={() => setShowTolak(true)}
                    disabled={isPending}
                    className={`font-semibold h-10 px-6 rounded-lg transition-all ${isPending
                        ? "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"
                        : "border-red-400 text-red-500 hover:bg-red-50"}`}
                >
                    <XCircle className="w-4 h-4 mr-2" />
                    {labelTolak}
                </Button>

                <Button
                    onClick={() => setShowTerima(true)}
                    disabled={isPending}
                    className={`font-semibold h-10 px-6 rounded-lg transition-all ${isPending
                        ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                        : "bg-cyan-600 hover:bg-cyan-700 text-white"}`}
                >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    {isKonfirmasiSelesai ? "Konfirmasi Selesai" : "Setujui Reschedule"}
                </Button>
            </div>

            {/* ── Modal Terima — beda per mode ── */}
            {isKonfirmasiSelesai ? (
                <ModalKonfirmasiSelesai
                    open={showTerima}
                    isPending={isPending}
                    onConfirm={handleTerimaSelesai}
                    onClose={() => setShowTerima(false)}
                />
            ) : (
                <ModalTerimaReschedule
                    open={showTerima}
                    isPending={isPending}
                    onConfirm={handleTerimaReschedule}
                    onClose={() => setShowTerima(false)}
                />
            )}

            {/* ── Modal Tolak ── */}
            <ModalTolak
                open={showTolak}
                label={labelModalTolak}
                isPending={isPending}
                onConfirm={handleTolak}
                onClose={() => setShowTolak(false)}
            />
        </>
    )
}
