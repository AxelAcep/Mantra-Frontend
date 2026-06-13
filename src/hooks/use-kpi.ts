import { getKPIBulan, getKPIYearly, getDistribusiKPI, getMasterStats, addKPI, getKPIOverview, type KPIOverviewResponse, type AddKPIPayload } from "@/services/kpi.services"
import { useMutation, useQueryClient, useQuery} from "@tanstack/react-query" 

export function useKPIBulan(bulan: number, tahun: number) {
    return useQuery({
        queryKey: ["kpi", "bulan", bulan, tahun],
        queryFn:  () => getKPIBulan(bulan, tahun),
    })
}

export function useKPIYearly(tahun: number, bulanAwal = 1, bulanAkhir = 12) {
    return useQuery({
        queryKey: ["kpi", "yearly", tahun, bulanAwal, bulanAkhir],
        queryFn:  () => getKPIYearly(tahun, bulanAwal, bulanAkhir),
    })
}

export function useDistribusiKPI(bulan: number, tahun: number) {
    return useQuery({
        queryKey: ["kpi", "distribusi", bulan, tahun],
        queryFn:  () => getDistribusiKPI(bulan, tahun),
    })
}

export function useMasterStats() {
    return useQuery({
        queryKey: ["master", "stats"],
        queryFn:  getMasterStats,
    })
}

export function useAddKPI(pegawaiId: string) {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (payload: AddKPIPayload) => addKPI(pegawaiId, payload),
        onSuccess: () => {
            // Invalidate semua query KPI supaya chart refresh
            queryClient.invalidateQueries({ queryKey: ["kpi"] })
        },
    })
}

export function useKPIOverview(
  pegawaiId: string,
  page: number,
  bulan: number,
  tahun: number,
  tab: string,
  search?: string,
  status?: string,
  sortBy?: string,
  sortDir?: string
) {
  return useQuery<KPIOverviewResponse>({
    queryKey: ["kpi", "overview", pegawaiId, page, bulan, tahun, tab, search, status, sortBy, sortDir],
    queryFn: () => getKPIOverview(pegawaiId, page, bulan, tahun, tab, search, status, sortBy, sortDir),
    enabled: !!pegawaiId,
  })
}
