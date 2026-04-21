import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

// ─── Terima Modal ─────────────────────────────────────────────────────────────

type ConfirmTerimaProps = {
    open: boolean
    onClose: () => void
    onConfirm: () => void
    isPending?: boolean
    title?: string
    message?: string
}

export function ConfirmTerimaModal({
    open,
    onClose,
    onConfirm,
    isPending,
    title = "Konfirmasi Penerimaan",
    message = "Apakah Anda yakin ingin menerima pengajuan ini?",
}: ConfirmTerimaProps) {
    return (
        <Dialog open={open} onOpenChange={(v) => !v && !isPending && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <p className="text-sm text-muted-foreground leading-relaxed">
                    {message}
                </p>

                <DialogFooter className="gap-2 mt-2">
                    <Button variant="outline" onClick={onClose} disabled={isPending}>
                        Batal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isPending}
                        className={`font-semibold transition-all ${isPending
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-cyan-600 hover:bg-cyan-700 text-white"}`}
                    >
                        {isPending ? "Memproses..." : "Ya, Terima"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

// ─── Tolak Modal ──────────────────────────────────────────────────────────────

type TolakModalProps = {
    open: boolean
    onClose: () => void
    onConfirm: (alasan: string) => void
    isPending?: boolean
}

export function TolakModal({ open, onClose, onConfirm, isPending }: TolakModalProps) {
    const [alasan, setAlasan] = useState("")

    useEffect(() => {
        if (!open) {
            setAlasan("")
        }
    }, [open])

    const handleConfirm = () => {
        if (!alasan.trim()) return
        onConfirm(alasan.trim())
    }

    const handleClose = () => {
        if (isPending) return
        setAlasan("")
        onClose()
    }

    return (
        <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Tolak Pengajuan</DialogTitle>
                </DialogHeader>

                <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">
                        Berikan alasan penolakan. Alasan ini akan diteruskan kepada karyawan.
                    </p>
                    <textarea
                        rows={4}
                        value={alasan}
                        onChange={(e) => setAlasan(e.target.value)}
                        placeholder="Tulis alasan penolakan..."
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none
                                   focus:outline-none focus:ring-2 focus:ring-red-100 focus:border-red-300 transition"
                    />
                </div>

                <DialogFooter className="gap-2 mt-2">
                    <Button variant="outline" onClick={handleClose} disabled={isPending}>
                        Batal
                    </Button>
                    <Button
                        onClick={handleConfirm}
                        disabled={isPending || !alasan.trim()}
                        className={`font-semibold transition-all ${isPending || !alasan.trim()
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                            : "bg-red-500 hover:bg-red-600 text-white"}`}
                    >
                        {isPending ? "Memproses..." : "Ya, Tolak"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
