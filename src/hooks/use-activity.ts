import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
    getAllActivityBerjalan,
    getAllActivityAktif,
    getAllActivityPending,
    getAllActivityPerluTindakan,
    getAllActivityRiwayat,
    getActivityCount,
    createActivity,
    updateActivity,
    getDetailActivity,
    tambahKolaborator,
    pengajuanReschedule,
    pengajuanSelesai,
    konfirmasiReschedule,
    konfirmasiSelesai,
    getChat,
    kirimChat,
    updateChat,
    getChatThreads,
    getUnreadChatCount,
    getTotalUnreadChatCount,
    readChat,
    readAllChat,
    getActivityKonfirmasiKolaborasi,
    konfirmasiKolaborasi,
    type CreateActivityPayload,
    type UpdateActivityPayload,
    type KolaboratorPayload,
} from "../services/activity.services"

export function useChatThreads() {
    return useQuery({
        queryKey: ["chat", "threads"],
        queryFn: getChatThreads,
        refetchInterval: 10000,
    })
}
import { updateActivityKPI } from "../services/master-activity.services"
import { uploadDokumen, deleteDokumen } from "../services/dokumen.services"
import { toast } from "sonner"

export function useActivityBerjalan(page = 1, limit = 10) {
    return useQuery({ queryKey: ["activity", "berjalan", page], queryFn: () => getAllActivityBerjalan(page, limit) })
}

export function useActivityAktif(page = 1, limit = 10) {
    return useQuery({ queryKey: ["activity", "aktif", page], queryFn: () => getAllActivityAktif(page, limit) })
}

export function useActivityPending(page = 1, limit = 10) {
    return useQuery({ queryKey: ["activity", "pending", page], queryFn: () => getAllActivityPending(page, limit) })
}

export function useActivityPerluTindakan(page = 1, limit = 10) {
    return useQuery({ queryKey: ["activity", "perlu-tindakan", page], queryFn: () => getAllActivityPerluTindakan(page, limit) })
}

export function useActivityRiwayat(page = 1, limit = 10) {
    return useQuery({ queryKey: ["activity", "riwayat", page], queryFn: () => getAllActivityRiwayat(page, limit) })
}

export function useActivityCount() {
    return useQuery({ queryKey: ["activity", "count"], queryFn: getActivityCount })
}

export function useCreateActivity(onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: CreateActivityPayload) => createActivity(payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity"] })
            toast.success("Activity berhasil dibuat.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useUpdateActivity(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: UpdateActivityPayload) => updateActivity(activityId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            qc.invalidateQueries({ queryKey: ["activity"] })
            toast.success("Activity berhasil diperbarui.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useDetailActivity(id: string) {
    return useQuery({
        queryKey: ["activity", id],
        queryFn: () => getDetailActivity(id),
        enabled: !!id,
        refetchInterval: 10000,
    })
}

export function useTambahKolaborator(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: KolaboratorPayload) => tambahKolaborator(activityId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            toast.success("Kolaborator berhasil ditambahkan.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function usePengajuanReschedule(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: { alasan: string; targetSelesaiBaru: string }) =>
            pengajuanReschedule(activityId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            toast.success("Pengajuan reschedule berhasil dikirim.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function usePengajuanSelesai(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => pengajuanSelesai(activityId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            toast.success("Pengajuan selesai berhasil dikirim.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useKonfirmasiReschedule(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ rescheduleId, payload }: { rescheduleId: string; payload: { status: string; alasan?: string } }) =>
            konfirmasiReschedule(rescheduleId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            toast.success("Konfirmasi reschedule berhasil.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useKonfirmasiSelesai(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (payload: { status: string; alasan?: string }) =>
            konfirmasiSelesai(activityId, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            toast.success("Konfirmasi selesai berhasil.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useChat(activityId: string, enabled: boolean) {
    return useQuery({
        queryKey: ["chat", activityId],
        queryFn: () => getChat(activityId),
        enabled,
        refetchInterval: enabled ? 5000 : false,
    })
}

export function useKirimChat(activityId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (pesan: string) => kirimChat(activityId, pesan),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["chat", activityId] })
            qc.invalidateQueries({ queryKey: ["chat", "threads"] })
            qc.invalidateQueries({ queryKey: ["chat-unread-total"] })
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useUpdateChat(activityId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ chatId, pesan }: { chatId: string; pesan: string }) => updateChat(chatId, pesan),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["chat", activityId] })
            qc.invalidateQueries({ queryKey: ["chat", "threads"] })
            qc.invalidateQueries({ queryKey: ["chat-unread-total"] })
            toast.success("Pesan diperbarui.")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}


export function useUnreadChatCount(activityId: string) {
    return useQuery({
        queryKey: ["chat-unread", activityId],
        queryFn: () => getUnreadChatCount(activityId),
        refetchInterval: 10000,
    })
}

export function useTotalUnreadChatCount() {
    return useQuery({
        queryKey: ["chat-unread-total"],
        queryFn: getTotalUnreadChatCount,
        refetchInterval: 10000,
    })
}

export function useReadChat(activityId: string) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () => readChat(activityId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["chat-unread", activityId] })
            qc.invalidateQueries({ queryKey: ["chat", activityId] })
            qc.invalidateQueries({ queryKey: ["chat", "threads"] })
            qc.invalidateQueries({ queryKey: ["chat-unread-total"] })
        },
    })
}

export function useActivityKonfirmasiKolaborasi() {
    return useQuery({
        queryKey: ["activity", "konfirmasi-kolaborasi"],
        queryFn: getActivityKonfirmasiKolaborasi,
    })
}

export function useKonfirmasiKolaborasi(onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: { status: string; deskripsi?: string; kategori?: string } }) =>
            konfirmasiKolaborasi(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", "konfirmasi-kolaborasi"] })
            qc.invalidateQueries({ queryKey: ["activity"] })
            toast.success("Konfirmasi berhasil.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useUploadDokumen(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (file: File) => uploadDokumen(activityId, file),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            qc.invalidateQueries({ queryKey: ["master", "activity", activityId] })
            toast.success("File berhasil diunggah.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useDeleteDokumen(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (dokumenId: string) => deleteDokumen(activityId, dokumenId),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            qc.invalidateQueries({ queryKey: ["master", "activity", activityId] })
            toast.success("Dokumen berhasil dihapus.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useUpdateActivityKPI(activityId: string, onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (nilai: string) => updateActivityKPI(activityId, nilai),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["activity", activityId] })
            qc.invalidateQueries({ queryKey: ["master", "activity", activityId] })
            qc.invalidateQueries({ queryKey: ["master", "selesai"] })
            qc.invalidateQueries({ queryKey: ["master", "kpi"] })
            toast.success("KPI berhasil diperbarui.")
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useReadAllChat() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: readAllChat,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["chat-unread-total"] })
            qc.invalidateQueries({ queryKey: ["chat", "threads"] })
            qc.invalidateQueries({ queryKey: ["chat-unread"] })
            toast.success("Semua chat ditandai sudah dibaca.")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}
