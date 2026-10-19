import { useCallback, useMemo } from "react"
import { useSearchParams } from "react-router-dom"

export type SortDir = "asc" | "desc"

export type ListParams = {
    page: number
    sortBy: string
    sortDir: SortDir
    search: string
}

type Options = {
    /** Prefix supaya beberapa tabel dalam satu halaman tidak saling menimpa, mis. "garansi". */
    prefix?: string
    defaultSortBy?: string
    defaultSortDir?: SortDir
    /** Filter tambahan khusus halaman, mis. { status: "", kategori: "" }. */
    filters?: Record<string, string>
}

/**
 * Menyimpan state tabel (halaman, sorting, pencarian, filter) di URL, bukan di
 * useState lokal. Dengan begitu posisi halaman & filter ikut terbawa saat user
 * membuka detail lalu menekan tombol kembali, dan URL-nya bisa dibagikan.
 */
export function useListParams(options: Options = {}) {
    const { prefix, defaultSortBy = "", defaultSortDir = "asc", filters = {} } = options
    const [searchParams, setSearchParams] = useSearchParams()

    const key = useCallback((name: string) => (prefix ? `${prefix}_${name}` : name), [prefix])

    const filterKeys = Object.keys(filters)
    const filterDefaults = JSON.stringify(filters)

    const params = useMemo(() => {
        const defaults: Record<string, string> = JSON.parse(filterDefaults)
        const activeFilters: Record<string, string> = {}
        for (const name of filterKeys) {
            activeFilters[name] = searchParams.get(key(name)) ?? defaults[name] ?? ""
        }

        const rawPage = parseInt(searchParams.get(key("page")) ?? "1", 10)
        const rawDir = searchParams.get(key("sortDir"))

        return {
            page: Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1,
            sortBy: searchParams.get(key("sortBy")) ?? defaultSortBy,
            sortDir: (rawDir === "desc" ? "desc" : rawDir === "asc" ? "asc" : defaultSortDir) as SortDir,
            search: searchParams.get(key("search")) ?? "",
            filters: activeFilters,
        }
    }, [searchParams, key, defaultSortBy, defaultSortDir, filterKeys, filterDefaults])

    /**
     * Menulis beberapa param sekaligus. Nilai kosong dihapus dari URL supaya
     * alamatnya tetap pendek. Mengubah apa pun selain `page` otomatis
     * mengembalikan ke halaman 1, karena hasil filter/sorting yang baru belum
     * tentu punya halaman sebanyak sebelumnya.
     */
    const update = useCallback(
        (changes: Record<string, string | number | undefined>) => {
            const next = new URLSearchParams(searchParams)
            const resetPage = Object.keys(changes).some((name) => name !== "page")

            for (const [name, value] of Object.entries(changes)) {
                const param = key(name)
                if (value === undefined || value === "") next.delete(param)
                else next.set(param, String(value))
            }

            if (resetPage && changes.page === undefined) next.delete(key("page"))

            setSearchParams(next, { replace: true })
        },
        [searchParams, setSearchParams, key],
    )

    const setPage = useCallback((page: number) => update({ page: page > 1 ? page : undefined }), [update])

    /**
     * Klik header kolom berputar tiga langkah: asc → desc → kembali ke urutan
     * bawaan. Langkah ketiga dipertahankan karena tabel-tabel lama di aplikasi
     * ini sudah berperilaku begitu.
     */
    const toggleSort = useCallback(
        (column: string) => {
            if (params.sortBy !== column) {
                update({ sortBy: column, sortDir: "asc" })
                return
            }
            if (params.sortDir === "asc") {
                update({ sortBy: column, sortDir: "desc" })
                return
            }
            update({ sortBy: undefined, sortDir: undefined })
        },
        [params.sortBy, params.sortDir, update],
    )

    const setFilter = useCallback(
        (name: string, value: string) => update({ [name]: value }),
        [update],
    )

    return { ...params, setPage, toggleSort, setFilter, update }
}
