import { useQuery } from "@tanstack/react-query"
import { getPerusahaanList } from "../services/perusahaan.services"

export function usePerusahaan() {
    return useQuery({
        queryKey: ["perusahaan"],
        queryFn: getPerusahaanList,
    })
}
