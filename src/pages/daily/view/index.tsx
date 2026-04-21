import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDetailActivity, useUnreadChatCount, useUploadDokumen, useDeleteDokumen } from "@/hooks/use-activity"
import { OverviewCard } from "./card-overview"
import { EditActivityModal } from "./edit-modal"
import { DetailAktivitasCard } from "./card-detail-aktivitas"
import { KolaborasiCard } from "./card-kolaborasi"
import { DokumenCard } from "./card-dokumen"
import { RiwayatRescheduleCard } from "./card-riwayat-reschedule"
import { ActionButtons } from "./action-button"
import { ChatPanel } from "./card-chat"
import { Icons } from "@/assets"
import { Button } from "@/components/ui/button"

function getPegawaiIdFromToken(): string {
    try {
        const token = localStorage.getItem("token") ?? ""
        const payload = JSON.parse(atob(token.split(".")[1]))
        return payload.pegawai?.id ?? ""
    } catch {
        return ""
    }
}

function DetailContent({ id }: { id: string }) {
    const { data, isLoading, isError } = useDetailActivity(id)
    const { data: unreadCount = 0 } = useUnreadChatCount(id)
    const [chatOpen, setChatOpen] = useState(false)
    const [editModalOpen, setEditModalOpen] = useState(false)
    const currentPegawaiId = getPegawaiIdFromToken()
    const navigate = useNavigate()

    // ✅ Pakai `id` dari props, bukan activity.id — karena hooks tidak boleh dipanggil setelah early return
    const uploadMutation = useUploadDokumen(id)
    const deleteMutation = useDeleteDokumen(id)

    if (isLoading) return <div className="p-6 text-center text-slate-400">Memuat data...</div>
    if (isError || !data) return <div className="p-6 text-center text-rose-400">Gagal memuat detail activity.</div>

    const { data: activity, isOverdue } = data

    return (
        <div className="p-6 bg-slate-50 min-h-screen space-y-6">
            <div className="flex items-center gap-4">
                <Button
                    variant="outline"
                    size="icon"
                    className="w-11 h-11 rounded-xl border-slate-200 shadow-sm shrink-0 hover:bg-slate-50"
                    onClick={() => navigate(-1)}
                >
                    <img src={Icons.LeftArrow} alt="Back" className="w-4 h-4" />
                </Button>

                <div className="flex flex-col">
                    <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
                        Detail Aktivitas
                    </h1>
                </div>
            </div>

            <div className="w-full">
                <OverviewCard
                    kategori={activity.kategori}
                    terkaitPO={activity.terkaitPO}
                    status={activity.status}
                    alasanPenolakan={activity.alasanPenolakan}
                    updatedAt={activity.updatedAt}
                    isOverdue={isOverdue}
                    unreadChat={unreadCount}
                    onChatClick={() => setChatOpen(true)}
                    onEdit={currentPegawaiId === activity.pegawaiId ? () => setEditModalOpen(true) : undefined}
                    parent={activity.parent}
                    isSupervised={activity.isSupervised}
                />
                <EditActivityModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    activity={activity}
                />
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-start">
                <div className="flex-1 space-y-6 w-full">
                    <DetailAktivitasCard
                        waktuMulai={activity.waktuMulai}
                        waktuSubmit={activity.waktuSubmit}
                        targetSelesai={activity.targetSelesai}
                        kategori={activity.kategori}
                        perusahaan={activity.perusahaan}
                        judul={activity.judul}
                        deskripsi={activity.deskripsi}
                    />
                    <KolaborasiCard
                        activityId={activity.id}
                        kolaborator={activity.kolaborator ?? []}
                        activityStatus={activity.status}
                        onLihatDetail={(childActivityId) => {
                            navigate(`/dailyactivity/${childActivityId}`)
                        }}
                        isKonfirmasiKolaborasi={activity.isKonfirmasiKolaborasi}
                    />
                    <DokumenCard
                        dokumen={activity.dokumen ?? []}
                        status={activity.status}
                        isUploading={uploadMutation.isPending}
                        deletingId={deleteMutation.isPending ? (deleteMutation.variables ?? null) : null}
                        onUpload={(file) => uploadMutation.mutate(file)}
                        onDelete={(dokumenId) => deleteMutation.mutate(dokumenId)}
                        currentPegawaiId={currentPegawaiId}
                        isKonfirmasiKolaborasi={activity.isKonfirmasiKolaborasi}
                    />
                </div>
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
            <ActionButtons
                activityId={activity.id}
                status={activity.status}
                isOverdue={isOverdue}
                isOwner={currentPegawaiId === activity.pegawaiId}
                isKonfirmasiKolaborasi={activity.isKonfirmasiKolaborasi}
            />
        </div>
    )
}

export default function DetailActivityPagePegawai() {
    const { id } = useParams<{ id: string }>()
    if (!id) return <div className="p-6 text-center text-rose-400">ID tidak ditemukan.</div>
    return <DetailContent id={id} />
}

//test