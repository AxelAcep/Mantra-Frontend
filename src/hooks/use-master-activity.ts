import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import {
    getMasterReschedule,
    getMasterSelesai,
    getMasterAktif,
    getMasterRiwayat,
    masterKonfirmasiReschedule,
    masterKonfirmasiSelesai,
    getMasterActivityDetail,
    getDetailKPI,
    getAllActivityRiwayat,
    type DetailKPIResponse,
    type ActivityDetailResult,
    type MasterRescheduleItem,
    type KonfirmasiPayload,
    getMasterKaryawan, type KaryawanListResult, 
    type PaginatedActivity
} from "../services/master-activity.services"

export function useMasterReschedule(page = 1, limit = 10, search = "", enabled = true) {
    return useQuery({
        queryKey: ["master", "reschedule", page, search],
        queryFn: () => getMasterReschedule(page, limit, search),
        enabled,
    })
}

export function useMasterSelesai(
    page = 1,
    limit = 10,
    search = "",
    sortBy = "",
    sortDir = "",
    enabled = true
) {
    return useQuery({
        queryKey: ["master", "selesai", page, search, sortBy, sortDir],
        queryFn: () => getMasterSelesai(page, limit, search, sortBy, sortDir),
        enabled,
    })
}

// ✅ Tambah sortBy & sortOrder ke queryKey + queryFn
export function useMasterAktif(
    page = 1,
    limit = 10,
    search = "",
    sortBy = "",
    sortDir = "",
    karyawan = "",
    kategori = "",
    status = "",
) {
    return useQuery({
        queryKey: ["master", "aktif", page, search, sortBy, sortDir, karyawan, kategori, status],
        queryFn: () => getMasterAktif(page, limit, search, sortBy, sortDir, karyawan, kategori, status),
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
        placeholderData: (previousData) => previousData,
    })
}

export function useMasterRiwayat(
    page = 1,
    limit = 10,
    search = "",
    sortBy = "",
    sortDir = "",
    karyawan = "",
    kategori = "",
    status = "",
) {
    return useQuery({
        queryKey: ["master", "aktif", page, search, sortBy, sortDir, karyawan, kategori, status],
        queryFn: () => getMasterRiwayat(page, limit, search, sortBy, sortDir, karyawan, kategori, status),
        refetchInterval: 10000,
        refetchIntervalInBackground: true,
        placeholderData: (previousData) => previousData,
    })
}


export function useKonfirmasiReschedule(onSuccess?: () => void) {
    const qc = useQueryClient()
    
    return useMutation({
        mutationFn: ({ rescheduleId, ...payload }: { rescheduleId: string } & KonfirmasiPayload) =>
            masterKonfirmasiReschedule(rescheduleId, payload),
        
        onSuccess: (_data, variables) => { // 'variables' berisi payload yang kita kirim (status)
            qc.invalidateQueries({ queryKey: ["master", "reschedule"] })
            
            // CEK STATUS: Jika DITOLAK, kasih toast warna merah
            if (variables.status === "DITOLAK") {
                toast.error("Pengajuan Reschedule ditolak", {
                    style: { 
                        background: "#fef2f2", 
                        color: "#991b1b", 
                        border: "1px solid #fecaca" 
                    }
                })
            } else {
                // Jika DITERIMA, tetap hijau/default
                toast.success("Reschedule berhasil diterima.")
            }
            
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useKonfirmasiSelesai(onSuccess?: () => void) {
    const qc = useQueryClient()
    
    return useMutation({
        mutationFn: ({ activityId, ...payload }: { activityId: string } & KonfirmasiPayload) =>
            masterKonfirmasiSelesai(activityId, payload),
        
        onSuccess: (_data, variables) => {
            // Invalidate query agar tabel refresh otomatis
            qc.invalidateQueries({ queryKey: ["master", "selesai"] })
            
            // Logika notifikasi berdasarkan status yang dikirim
            if (variables.status === "DITOLAK") {
                toast.error("Konfirmasi selesai ditolak", {
                    description: "Status aktivitas akan dikembalikan atau ditinjau ulang.",
                    style: { 
                        background: "#fef2f2", 
                        color: "#991b1b", 
                        border: "1px solid #fecaca" 
                    }
                })
            } else {
                toast.success("Aktivitas berhasil dikonfirmasi selesai.")
            }
            
            // Jalankan callback tambahan jika ada (seperti menutup modal)
            onSuccess?.()
        },
        onError: (err: Error) => toast.error(err.message),
    })
}
// Terima semua → iterate current page items
export function useTerimaSemuaReschedule(items: MasterRescheduleItem[]) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: () =>
            Promise.all(items.map((item) => masterKonfirmasiReschedule(item.id, { status: "DITERIMA" }))),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["master", "reschedule"] })
            toast.success(`${items.length} pengajuan reschedule telah diterima.`)
        },
        onError: (err: Error) => toast.error(err.message),
    })
}

export function useMasterActivityDetail(id: string) {
    return useQuery<ActivityDetailResult>({
        queryKey: ["master", "activity", id],
        queryFn:  () => getMasterActivityDetail(id),
        enabled:  !!id,
    })
}

export function useMasterKaryawan(
    page:    number,
    search:  string,
    mode:    "bulan" | "tahun",
    bulan:   number,
    tahun:   number,
    sortBy:  string = "",
    sortDir: string = "",
    limit:   number = 10,
) {
    return useQuery<KaryawanListResult>({
        queryKey: ["master", "karyawan", page, search, mode, bulan, tahun, sortBy, sortDir, limit],
        queryFn:  () => getMasterKaryawan(page, search, mode, bulan, tahun, sortBy, sortDir, limit),
    })
}

export function useDetailKPI(
    pegawaiId: string,
    mode:      "bulan" | "tahun",
    bulan:     number,
    tahun:     number,
) {
    return useQuery<DetailKPIResponse>({
        queryKey: ["master", "kpi", pegawaiId, mode, bulan, tahun],
        queryFn:  () => getDetailKPI(pegawaiId, mode, bulan, tahun),
        enabled:  !!pegawaiId,
    })
}

export function useActivityRiwayat(page = 1, limit = 10, search = "") {
  return useQuery<PaginatedActivity>({
    queryKey: ["activity", "riwayat", page, search],
    queryFn: () => getAllActivityRiwayat(page, limit, search),
  })
}

