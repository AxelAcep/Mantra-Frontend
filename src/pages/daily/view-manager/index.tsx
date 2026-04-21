import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useMasterActivityDetail } from "@/hooks/use-master-activity"
import { useUnreadChatCount, useUploadDokumen, useDeleteDokumen, useUpdateActivityKPI } from "@/hooks/use-activity"
import { useMarkSupervised } from "@/hooks/use-supervisi"
import { OverviewCard } from "./card-overview"
import { DetailAktivitasCard } from "./card-detail-aktivitas"
import { KolaborasiCardAdmin } from "./card-kolaborasi"
import { DokumenCard } from "./card-dokumen"
import { RiwayatRescheduleCard } from "./card-riwayat-reschedule"
import { ActionButtonsAdmin, NilaiKPISelector } from "./action-button"
import { ChatPanel } from "./card-chat"
import { type StatusActivity } from "@/services/master-activity.services"
import { type NilaiKPI } from "@/services/kpi.services"
import { Icons } from "@/assets"
import { Button } from "@/components/ui/button"
import { useQueryClient } from "@tanstack/react-query"
import { EditActivityModal } from "@/pages/daily/view/edit-modal"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getPegawaiIdFromToken(): string {
    try {
        const token = localStorage.getItem("token") ?? ""
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload.pegawai?.id ?? ""
    } catch {
        return ""
    }
}

function getAuthRole(): string {
    try {
        const session = localStorage.getItem("user")
        const user = session ? JSON.parse(session) : {}
        return user.role ?? ""
    } catch {
        return ""
    }
}

// ─── KPI Modal ────────────────────────────────────────────────────────────────

const KPI_LABELS: Record<string, string> = {
    BAIK: "Baik",
    CUKUP: "Cukup",
    BURUK: "Buruk",
}

function KPIModal({ open, onOpenChange, onConfirm, isPending, initialValue }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: (nilai: string) => void
    isPending: boolean
    initialValue?: string
}) {
    const [nilai, setNilai] = useState<NilaiKPI | null>((initialValue as NilaiKPI) || null)

    function handleClose() {
        setNilai((initialValue as NilaiKPI) || null)
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[440px] bg-white rounded-2xl p-0 overflow-hidden border-none shadow-2xl">
                <div className="p-6">
                    <DialogHeader className="mb-4">
                        <DialogTitle className="text-xl font-bold text-gray-900">Edit Nilai</DialogTitle>
                    </DialogHeader>
                    {initialValue && (
                        <p className="text-sm text-gray-600 mb-6">
                            Nilai sebelumnya: <span className="font-bold text-gray-900">{KPI_LABELS[initialValue] || initialValue}</span>
                        </p>
                    )}
                    <div className="space-y-4 mb-8">
                        <NilaiKPISelector value={nilai} onChange={setNilai} variant="vertical" />
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
                            onClick={() => nilai && onConfirm(nilai)}
                            disabled={isPending || !nilai}
                            className={cn(
                                "flex-1 font-semibold h-11 rounded-xl transition-all shadow-sm",
                                isPending || !nilai
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed border-none"
                                    : "bg-cyan-500 hover:bg-cyan-600 text-white"
                            )}
                        >
                            {isPending ? "Memproses..." : "Simpan"}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Verifikasi Modal ─────────────────────────────────────────────────────────

function VerifikasiModal({ open, onOpenChange, onConfirm, isPending }: {
    open: boolean
    onOpenChange: (open: boolean) => void
    onConfirm: () => void
    isPending: boolean
}) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl p-6 gap-0">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg font-bold text-gray-900">Konfirmasi Supervised</DialogTitle>
                </DialogHeader>
                <p className="text-sm text-gray-600 mb-6">
                    Apakah Anda yakin ingin menandai aktivitas ini sebagai{" "}
                    <span className="font-semibold text-cyan-600">sudah disupervisi</span>?
                    Tindakan ini tidak dapat dibatalkan.
                </p>
                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isPending}
                        className="border-gray-200 text-gray-600 font-semibold"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isPending}
                        className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold"
                    >
                        {isPending ? "Memproses..." : "Ya, konfirmasi"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

// ─── Detail Content ───────────────────────────────────────────────────────────

function DetailContent({ id }: { id: string }) {
    const navigate = useNavigate()
    const [chatOpen, setChatOpen] = useState(false)
    const [kpiModalOpen, setKpiModalOpen] = useState(false)
    const [editDataModalOpen, setEditDataModalOpen] = useState(false)
    const [verifikasiModalOpen, setVerifikasiModalOpen] = useState(false)

    const currentPegawaiId = getPegawaiIdFromToken()
    const role = getAuthRole()
    const qc = useQueryClient()

    const { data, isLoading, isError } = useMasterActivityDetail(id)
    const { data: unreadCount = 0 } = useUnreadChatCount(id)
    const uploadMutation = useUploadDokumen(id)
    const deleteMutation = useDeleteDokumen(id)
    const kpiMutation = useUpdateActivityKPI(id, () => setKpiModalOpen(false))
    const markSupervised = useMarkSupervised(() => {
        setVerifikasiModalOpen(false)
        qc.invalidateQueries({ queryKey: ["master", "activity", id] })
    })

    if (isLoading) return <div className="p-6 text-center text-slate-400">Memuat data...</div>
    if (isError || !data) return <div className="p-6 text-center text-rose-400">Gagal memuat detail activity.</div>

    const { data: activity, isOverdue } = data
    const status = activity.status as StatusActivity
    const pendingReschedule = activity.reschedule?.find(r => r.status === "PENDING")
    const lastReschedule = [...(activity.reschedule ?? [])].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0]
    const alasanReschedule = lastReschedule?.alasan
    const alasanPenolakan = lastReschedule?.alasanPenolakan

    // Kondisi tampil tombol Verifikasi
    const hasPendingReschedule = !!pendingReschedule
    const showVerifikasi = role === "SUPERVISI"
        && !activity.isSupervised
        && (activity.status === "KONFIRMASI_SELESAI" || hasPendingReschedule)

    return (
        <div className="p-6 bg-slate-50 min-h-screen space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-11 h-11 rounded-xl border-slate-200 shadow-sm shrink-0 hover:bg-slate-50"
                    onClick={() => navigate(-1)}
                >
                    <img src={Icons.LeftArrow} alt="Back" className="w-4 h-4" />
                </Button>
                <h1 className="text-2xl font-bold text-[#111827] tracking-tight">Detail Aktivitas</h1>
            </div>

            {/* Overview */}
            <div className="w-full">
                <OverviewCard
                    isAdmin
                    namaPegawai={activity.pegawai.nama}
                    divisi={activity.pegawai.divisi}
                    kategori={activity.kategori}
                    terkaitPO={activity.terkaitPO}
                    status={status}
                    isOverdue={isOverdue}
                    jumlahReschedule={activity.reschedule?.length ?? 0}
                    unreadChat={unreadCount}
                    onChatClick={() => setChatOpen(true)}
                    parent={activity.parent}
                    nilaiKPI={activity.nilaiKPI}
                    onEditKPI={() => setKpiModalOpen(true)}
                    onEditData={() => setEditDataModalOpen(true)}
                    alasanPenolakan={activity.alasanPenolakan}
                    updatedAt={activity.updatedAt}
                    isSupervised={activity.isSupervised}
                />
            </div>

            {/* Modals */}
            <EditActivityModal
                open={editDataModalOpen}
                onClose={() => setEditDataModalOpen(false)}
                onSuccess={() => qc.invalidateQueries({ queryKey: ["master", "activity", id] })}
                activity={{
                    ...activity,
                    waktuMulai: activity.waktuMulai,
                    targetSelesai: activity.targetSelesai,
                }}
            />

            <KPIModal
                open={kpiModalOpen}
                onOpenChange={setKpiModalOpen}
                onConfirm={(nilai) => kpiMutation.mutate(nilai)}
                isPending={kpiMutation.isPending}
                initialValue={activity.nilaiKPI}
            />

            <VerifikasiModal
                open={verifikasiModalOpen}
                onOpenChange={setVerifikasiModalOpen}
                onConfirm={() => markSupervised.mutate(activity.id)}
                isPending={markSupervised.isPending}
            />

            {/* Konten Utama */}
            <div className="flex flex-col lg:flex-row gap-6 items-start">
                {/* Kolom Kiri */}
                <div className="flex-1 space-y-6 w-full">
                    <DetailAktivitasCard
                        status={status}
                        waktuMulai={activity.waktuMulai}
                        waktuSubmit={activity.waktuSubmit}
                        targetSelesai={activity.targetSelesai}
                        kategori={activity.kategori}
                        perusahaan={activity.perusahaan}
                        judul={activity.judul}
                        deskripsi={activity.deskripsi}
                        alasanReschedule={alasanReschedule}
                        alasanPenolakan={alasanPenolakan}
                    />
                    <KolaborasiCardAdmin
                        kolaborator={activity.kolaborator}
                        onLihatDetail={(childActivityId) => navigate(`/dailyactivity/${childActivityId}`)}
                    />
                    <DokumenCard
                        dokumen={activity.dokumen ?? []}
                        status={status}
                        isUploading={uploadMutation.isPending}
                        deletingId={deleteMutation.isPending ? (deleteMutation.variables ?? null) : null}
                        onUpload={(file) => uploadMutation.mutate(file)}
                        onDelete={(dokumenId) => deleteMutation.mutate(dokumenId)}
                        currentPegawaiId={currentPegawaiId}
                    />
                </div>

                {/* Kolom Kanan */}
                <div className="w-full lg:w-80 shrink-0 space-y-6 sticky top-6">
                    <RiwayatRescheduleCard reschedule={activity.reschedule ?? []} />
                    <ChatPanel
                        activityId={activity.id}
                        activityJudul={activity.judul}
                        terkaitPO={activity.terkaitPO}
                        open={chatOpen}
                        onClose={() => setChatOpen(false)}
                        currentPegawaiId={currentPegawaiId}
                    />
                </div>
            </div>

            {/* Action Buttonssssss */}
            {role === "SUPERVISI" ? (
                showVerifikasi && (
                    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 shadow-lg px-6 py-3 flex justify-end">
                        <Button
                            onClick={() => setVerifikasiModalOpen(true)}
                            className="bg-cyan-500 hover:bg-cyan-600 text-white font-semibold px-8 h-11 rounded-xl"
                        >
                            Verifikasi
                        </Button>
                    </div>
                )
            ) : (
                <ActionButtonsAdmin
                    activityId={activity.id}
                    status={status}
                    rescheduleId={pendingReschedule?.id}
                />
            )}
        </div>
    )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DetailActivityPageAdmin() {
    const { id } = useParams<{ id: string }>()
    if (!id) return <div className="p-6 text-center text-rose-400">ID tidak ditemukan.</div>
    return <DetailContent id={id} />
}