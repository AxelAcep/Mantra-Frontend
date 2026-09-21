"use client"

import { useState } from "react"
import { Plus, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogTambahBarang } from "./dialog-tambah-barang"
import { BarangTable } from "./barang-table"
import { useBarangList } from "@/hooks/use-barang"
import { useDebounce } from "@/hooks/use-debounce"

const LIMIT = 15

export default function DaftarBarangPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [sortBy, setSortBy] = useState("noBarang")
    const [sortDir, setSortDir] = useState("asc")
    const debouncedSearch = useDebounce(search, 400)

    const { data, isLoading, isError } = useBarangList(page, LIMIT, debouncedSearch, sortBy, sortDir)

    const meta = data?.meta
    const totalPages = meta?.totalPages ?? 1

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setSearch(e.target.value)
        setPage(1)
    }

    function renderPages() {
        const pages: (number | "...")[] = []
        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i)
        } else {
            pages.push(1)
            if (page > 3) pages.push("...")
            for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
                pages.push(i)
            }
            if (page < totalPages - 2) pages.push("...")
            pages.push(totalPages)
        }
        return pages
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <Card className="shadow-none border rounded-xl overflow-hidden py-0! gap-0!">
                <CardHeader className="border-b px-6 py-5 bg-white">
                    <CardTitle className="text-xl font-bold text-slate-800">Daftar Barang</CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500 mt-1">
                        Kelola data master barang yang digunakan dalam proses pengadaan.
                    </CardDescription>
                    <CardAction>
                        <DialogTambahBarang>
                            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg px-4 shadow-none">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Barang
                            </Button>
                        </DialogTambahBarang>
                    </CardAction>
                </CardHeader>

                <div className="px-6 py-4 border-b border-slate-100 bg-white">
                    <div className="relative max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Cari no. barang, deskripsi, satuan..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-9 h-10 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                        />
                    </div>
                </div>

                <CardContent className="p-0">
                    {isLoading && <div className="py-16 text-center text-slate-400 font-medium">Memuat data...</div>}
                    {isError && <div className="py-16 text-center text-rose-400 font-medium">Gagal memuat data.</div>}
                    {data && data.data.length === 0 && (
                        <div className="py-16 text-center text-slate-400 font-medium">Tidak ada data ditemukan.</div>
                    )}
                    {data && data.data.length > 0 && (
                        <BarangTable
                            items={data.data}
                            sortBy={sortBy}
                            sortDir={sortDir}
                            onSort={(field) => {
                                if (sortBy === field) {
                                    setSortDir((d) => (d === "asc" ? "desc" : "asc"))
                                } else {
                                    setSortBy(field)
                                    setSortDir("asc")
                                }
                                setPage(1)
                            }}
                        />
                    )}

                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500 font-medium">
                            Menampilkan <span className="text-slate-700 font-semibold">{data?.data.length ?? 0}</span>{" "}
                            dari <span className="text-slate-700 font-semibold">{meta?.total ?? 0}</span> data
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            {renderPages().map((p, i) =>
                                p === "..." ? (
                                    <span key={`ellipsis-${i}`} className="w-8 h-8 flex items-center justify-center text-slate-400 tracking-widest">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        onClick={() => setPage(p)}
                                        className={`w-8 h-8 flex items-center justify-center font-medium rounded-md text-sm transition-colors ${
                                            page === p
                                                ? "bg-cyan-500 text-white"
                                                : "text-slate-600 hover:text-cyan-600 hover:bg-cyan-50"
                                        }`}
                                    >
                                        {p}
                                    </button>
                                )
                            )}
                            <button
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md disabled:opacity-30 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
