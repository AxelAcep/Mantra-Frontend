import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    supervisiActivityService,
    type SupervisiActivityParams,
} from "@/services/supervisi.services"

// ─── Keys ─────────────────────────────────────────────────────────────────────

export const supervisiActivityKeys = {
    all: ["supervisi-activity"] as const,
    aktif: (params: SupervisiActivityParams) => [...supervisiActivityKeys.all, "aktif", params] as const,
    riwayat: (params: SupervisiActivityParams) => [...supervisiActivityKeys.all, "riwayat", params] as const,
}

// ─── Get Aktif ────────────────────────────────────────────────────────────────

export function useSupervisiActivityAktif(params: SupervisiActivityParams = {}) {
    return useQuery({
        queryKey: supervisiActivityKeys.aktif(params),
        queryFn: () => supervisiActivityService.getAktif(params),
        placeholderData: (prev) => prev,
    })
}

// ─── Get Riwayat ──────────────────────────────────────────────────────────────

export function useSupervisiActivityRiwayat(params: SupervisiActivityParams = {}) {
    return useQuery({
        queryKey: supervisiActivityKeys.riwayat(params),
        queryFn: () => supervisiActivityService.getRiwayat(params),
        placeholderData: (prev) => prev,
    })
}

// ─── Mark Supervised ──────────────────────────────────────────────────────────

export function useMarkSupervised(onSuccess?: () => void) {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (activityId: string) => supervisiActivityService.markSupervised(activityId),
        onSuccess: () => {
            // Invalidate semua query aktif supervisi supaya tabel refresh
            queryClient.invalidateQueries({ queryKey: supervisiActivityKeys.all })
            onSuccess?.()
        },
    })
}

export function useSupervisiDashboardStats() {
    return useQuery({
        queryKey: ["supervisi", "dashboard", "stats"],
        queryFn: () => supervisiActivityService.fetchSupervisiDashboardStats(),
    })
}