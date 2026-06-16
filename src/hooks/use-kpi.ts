import { getKPIBulan, getKPIYearly, getDistribusiKPI, getMasterStats, addKPI, getKPIOverview, type KPIOverviewResponse, type AddKPIPayload } from "@/services/kpi.services"
import { useMutation, useQueryClient, useQuery} from "@tanstack/react-query" 

export function useKPIBulan(bulan: number, tahun: number) {
    return useQuery({
        queryKey: ["kpi", "bulan", bulan, tahun],
        queryFn:  () => getKPIBulan(bulan, tahun),
    })
}

export function useKPIYearly(startBulan: number, startTahun: number, endBulan: number, endTahun: number) {
    return useQuery({
        queryKey: ["kpi", "yearly", startBulan, startTahun, endBulan, endTahun],
        queryFn:  () => getKPIYearly(startBulan, startTahun, endBulan, endTahun),
    })
}

export function useDistribusiKPI(bulan: number, tahun: number, startBulan?: number, startTahun?: number, endBulan?: number, endTahun?: number) {
    return useQuery({
        queryKey: ["kpi", "distribusi", bulan, tahun, startBulan, startTahun, endBulan, endTahun],
        queryFn:  () => getDistribusiKPI(bulan, tahun, startBulan, startTahun, endBulan, endTahun),
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
  filterType: "semua" | "range",
  startBulan: number,
  startTahun: number,
  endBulan: number,
  endTahun: number,
  tab: string,
  search?: string,
  status?: string,
  sortBy?: string,
  sortDir?: string
) {
  return useQuery<KPIOverviewResponse>({
    queryKey: ["kpi", "overview", pegawaiId, page, filterType, startBulan, startTahun, endBulan, endTahun, tab, search, status, sortBy, sortDir],
    queryFn: () => getKPIOverview(pegawaiId, page, filterType, startBulan, startTahun, endBulan, endTahun, tab, search, status, sortBy, sortDir),
    enabled: !!pegawaiId,
  })
}
