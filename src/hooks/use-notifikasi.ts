import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    getNotifikasiList,
    getUnreadNotifikasiCount,
    readNotifikasi,
    readAllNotifikasi,
} from "../services/notifikasi.services"

export function useNotifikasiList(page = 1, limit = 10, filter?: string) {
    return useQuery({
        queryKey: ["notifikasi", "list", page, limit, filter],
        queryFn: () => getNotifikasiList(page, limit, filter),
        refetchInterval: 10000,
    })
}

export function useUnreadNotifikasiCount(filter?: string) {
    return useQuery({
        queryKey: ["notifikasi", "unread-count", filter],
        queryFn: () => getUnreadNotifikasiCount(filter),
        refetchInterval: 10000,
    })
}

export function useReadNotifikasi() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (id: string) => readNotifikasi(id),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["notifikasi"] })
            qc.invalidateQueries({ queryKey: ["notifikasi", "unread-count"] })
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useReadAllNotifikasi() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: readAllNotifikasi,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["notifikasi"] })
            qc.invalidateQueries({ queryKey: ["notifikasi", "unread-count"] })
            toast.success("Semua notifikasi ditandai sudah dibaca.")
        },
        onError: (err: Error) => toast.error(err.message),
    })
}
