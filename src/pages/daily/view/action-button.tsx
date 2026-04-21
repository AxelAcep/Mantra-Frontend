import { useState } from "react"
import { CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { DialogKonfirmasi } from "./dialog-konfirmasi"
import { usePengajuanReschedule, usePengajuanSelesai, useKonfirmasiKolaborasi } from "@/hooks/use-activity"

type Props = {
    activityId: string
    status: string
    isOverdue: boolean
    isOwner: boolean
    isKonfirmasiKolaborasi?: boolean
}

export function ActionButtons({ activityId, status, isOverdue, isOwner, isKonfirmasiKolaborasi }: Props) {
    const [rescheduleForm, setRescheduleForm] = useState({ alasan: "", tanggal: "", waktu: "" })
    const [showRescheduleModal, setShowRescheduleModal] = useState(false)
    const [konfirmasiSelesai, setKonfirmasiSelesai] = useState(false)
    const [konfirmasiReschedule, setKonfirmasiReschedule] = useState(false)
    const [konfirmasiTerima, setKonfirmasiTerima] = useState(false)
    const [konfirmasiTolak, setKonfirmasiTolak] = useState(false)

    const canReschedule = status === "ON_PROGRESS" || status === "DITOLAK" || isOverdue
    const canSelesai = status === "ON_PROGRESS" && !isOverdue

    const { mutate: ajukanSelesai, isPending: loadingSelesai } = usePengajuanSelesai(activityId, () => {
        setKonfirmasiSelesai(false)
    })

    const { mutate: ajukanReschedule, isPending: loadingReschedule } = usePengajuanReschedule(activityId, () => {
        setKonfirmasiReschedule(false)
        setShowRescheduleModal(false)
        setRescheduleForm({ alasan: "", tanggal: "", waktu: "" })
    })

    const { mutate: konfirmasi, isPending: loadingKonfirmasi } = useKonfirmasiKolaborasi(() => {
        setKonfirmasiTerima(false)
        setKonfirmasiTolak(false)
    })

    if (!isOwner) return null
    if (status === "DITERIMA") return null

    const formValid = rescheduleForm.alasan && rescheduleForm.tanggal && rescheduleForm.waktu

    return (
        <>
            {/* Baris Action Buttons — Sticky di bawah */}
            <div className="sticky bottom-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 px-6 flex justify-end items-center gap-3 mt-8 -mx-6 -mb-6">
                {isKonfirmasiKolaborasi ? (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setKonfirmasiTolak(true)}
                            disabled={loadingKonfirmasi}
                            className="border-red-500 text-red-500 hover:bg-red-50 font-semibold h-10 px-6 rounded-lg transition-all flex items-center gap-2"
                        >
                            <XCircle className="w-4 h-4" />
                            Tolak Tugas
                        </Button>
                        <Button
                            onClick={() => setKonfirmasiTerima(true)}
                            disabled={loadingKonfirmasi}
                            className="bg-cyan-600! hover:bg-cyan-700! text-white! font-semibold h-10 px-6 rounded-lg shadow-none flex items-center gap-2"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Terima Tugas
                        </Button>
                    </>
                ) : (
                    <>
                        <Button
                            variant="outline"
                            onClick={() => setShowRescheduleModal(true)}
                            disabled={!canReschedule}
                            className={`font-semibold h-10 px-6 rounded-lg transition-all ${canReschedule
                                ? "border-cyan-500 text-cyan-500 hover:bg-cyan-50"
                                : "bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed"}`}
                        >
                            Reschedule
                        </Button>
                        <Button
                            onClick={() => setKonfirmasiSelesai(true)}
                            disabled={!canSelesai || loadingSelesai}
                            className={`font-semibold h-10 px-6 rounded-lg shadow-none ${canSelesai ? "bg-cyan-600! hover:bg-cyan-700! text-white!" : "bg-slate-100 text-slate-400 opacity-40 cursor-not-allowed"}`}
                        >
                            Konfirmasi Selesai
                        </Button>
                    </>
                )}
            </div>

            <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
                <DialogContent className="sm:max-w-[460px] bg-white rounded-2xl p-6 gap-0">
                    <DialogHeader className="mb-5">
                        <DialogTitle className="text-lg font-bold text-gray-900">Ajukan Reschedule</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-600 font-medium">Tanggal</label>
                                <Input
                                    type="date"
                                    value={rescheduleForm.tanggal}
                                    onChange={(e) => setRescheduleForm((p) => ({ ...p, tanggal: e.target.value }))}
                                    onClick={(e) => {
                                        try {
                                            (e.target as HTMLInputElement).showPicker()
                                        } catch (err) { }
                                    }}
                                    className="bg-slate-50 border-gray-200 text-gray-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-sm text-gray-600 font-medium">Waktu</label>
                                <Input
                                    type="time"
                                    value={rescheduleForm.waktu}
                                    onChange={(e) => setRescheduleForm((p) => ({ ...p, waktu: e.target.value }))}
                                    onClick={(e) => {
                                        try {
                                            (e.target as HTMLInputElement).showPicker()
                                        } catch (err) { }
                                    }}
                                    className="bg-slate-50 border-gray-200 text-gray-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                />
                            </div>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-sm text-gray-600 font-medium">Alasan Reschedule</label>
                            <Textarea
                                placeholder="Masukkan alasan reschedule..."
                                value={rescheduleForm.alasan}
                                onChange={(e) => setRescheduleForm((p) => ({ ...p, alasan: e.target.value }))}
                                className="bg-slate-50 border-gray-200 text-gray-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                rows={4}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end gap-2 mt-6">
                        <Button variant="outline" onClick={() => setShowRescheduleModal(false)} className="border-gray-200 text-gray-600 font-semibold">
                            Batal
                        </Button>
                        <Button
                            onClick={() => { if (formValid) setKonfirmasiReschedule(true) }}
                            disabled={!formValid}
                            className={`shadow-none font-semibold ${!formValid
                                ? "bg-slate-200 hover:bg-slate-200 text-slate-400 opacity-100"
                                : "bg-cyan-500 hover:bg-cyan-600 text-white"
                                }`}
                        >
                            Kirim Pengajuan
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <DialogKonfirmasi
                open={konfirmasiSelesai}
                onOpenChange={setKonfirmasiSelesai}
                title="Konfirmasi Selesai"
                description="Apakah kamu yakin ingin mengajukan activity ini sebagai selesai? Status akan menjadi Pending menunggu ACC dari Manger Operasional."
                confirmLabel={loadingSelesai ? "Mengirim..." : "Ya, ajukan selesai"}
                onConfirm={() => ajukanSelesai()}
            />

            <DialogKonfirmasi
                open={konfirmasiReschedule}
                onOpenChange={setKonfirmasiReschedule}
                title="Konfirmasi Reschedule"
                description={`Ajukan reschedule ke ${rescheduleForm.tanggal} pukul ${rescheduleForm.waktu}? Pengajuan akan dikirim ke Manager Operasional untuk dikonfirmasi.`}
                confirmLabel={loadingReschedule ? "Mengirim..." : "Ya, ajukan"}
                onConfirm={() => ajukanReschedule({
                    alasan: rescheduleForm.alasan,
                    targetSelesaiBaru: new Date(`${rescheduleForm.tanggal}T${rescheduleForm.waktu}:00`).toISOString(),
                })}
            />

            <DialogKonfirmasi
                open={konfirmasiTerima}
                onOpenChange={setKonfirmasiTerima}
                title="Terima Tugas Kolaborasi"
                description="Apakah kamu yakin ingin menerima tugas kolaborasi ini? Dengan menerima, tugas ini akan masuk ke daftar tugas aktif kamu."
                confirmLabel={loadingKonfirmasi ? "Memproses..." : "Ya, Terima Tugas"}
                onConfirm={() => konfirmasi({ id: activityId, payload: { status: "DITERIMA" } })}
            />

            <DialogKonfirmasi
                open={konfirmasiTolak}
                onOpenChange={setKonfirmasiTolak}
                title="Tolak Tugas Kolaborasi"
                description="Apakah kamu yakin ingin menolak tugas kolaborasi ini? Tugas akan dibatalkan dan dikembalikan ke pemberi tugas."
                confirmLabel={loadingKonfirmasi ? "Memproses..." : "Ya, Tolak Tugas"}
                onConfirm={() => konfirmasi({ id: activityId, payload: { status: "DITOLAK" } })}
            />
        </>
    )
}