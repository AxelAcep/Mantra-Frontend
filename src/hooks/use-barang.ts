import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
    getBarangList,
    createBarang,
    updateBarang,
    deleteBarang,
} from "../services/barang.services"

export function useBarangList(
    page: number,
    limit: number,
    search: string,
    sortBy: string,
    sortDir: string
) {
    return useQuery({
        queryKey: ["barang-list", page, limit, search, sortBy, sortDir],
        queryFn: () => getBarangList(page, limit, search, sortBy, sortDir),
    })
}

export function useCreateBarang(onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createBarang,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["barang-list"] })
            onSuccess?.()
        },
    })
}

export function useEditBarang(onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: ({ id, payload }: { id: string; payload: { noBarang: string; deskripsi: string; satuan: string } }) =>
            updateBarang(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["barang-list"] })
            onSuccess?.()
        },
    })
}

export function useDeleteBarang(onSuccess?: () => void) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteBarang,
        onSuccess: () => {
            qc.invalidateQueries({ queryKey: ["barang-list"] })
            onSuccess?.()
        },
    })
}
