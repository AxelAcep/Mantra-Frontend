"use client"

import { useState } from "react"
import { Plus, ChevronLeft, ChevronRight, Search, ChevronDown } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardAction } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DialogTambahKaryawan } from "./dialog-tambah-karyawan"
import { UserTable } from "./user-table"
import { useUsers } from "@/hooks/use-user"
import { useDebounce } from "@/hooks/use-debounce"

const LIMIT = 10
type TokenPayload = {
    role?: string
}

export default function ManajemenAkunPage() {
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [status, setStatus] = useState("")
    const [sortBy, setSortBy] = useState("nama")
    const [sortDir, setSortDir] = useState("asc")
    const debouncedSearch = useDebounce(search, 400)

    const { data, isLoading, isError } = useUsers(page, LIMIT, debouncedSearch, status, sortBy, sortDir)

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null
    if (token) {
        try {
            const encodedPayload = token.split(".")[1]
            const payload: TokenPayload = encodedPayload ? JSON.parse(atob(encodedPayload)) : {}
            if (payload.role !== "MASTER") {
                return (
                    <div className="p-6 flex items-center justify-center h-[60vh]">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-slate-700">Akses Ditolak</p>
                            <p className="text-slate-500 mt-2 font-medium">Halaman ini hanya bisa diakses oleh role Master.</p>
                        </div>
                    </div>
                )
            }
        } catch {
            return null
        }
    }

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
                    <CardTitle className="text-xl font-bold text-slate-800">Daftar Akun Karyawan</CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500 mt-1">
                        Kelola data dan akses akun seluruh karyawan di perusahaan Anda.
                    </CardDescription>
                    <CardAction>
                        <DialogTambahKaryawan>
                            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg px-4 shadow-none">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Karyawan
                            </Button>
                        </DialogTambahKaryawan>
                    </CardAction>
                </CardHeader>

                <div className="px-6 py-4 border-b border-slate-100 bg-white flex items-center gap-3">
                    <div className="relative max-w-sm flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Cari nama atau email..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-9 h-10 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                        />
                    </div>
                    <div className="relative w-44">
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value)
                                setPage(1)
                            }}
                            className="w-full appearance-none h-10 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all font-medium pr-10"
                        >
                            <option value="">Semua Status</option>
                            <option value="aktif">Aktif</option>
                            <option value="nonaktif">Nonaktif</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                            <ChevronDown className="h-4 w-4" />
                        </div>
                    </div>
                </div>

                <CardContent className="p-0">
                    {isLoading && <div className="py-16 text-center text-slate-400 font-medium">Memuat data...</div>}
                    {isError && <div className="py-16 text-center text-rose-400 font-medium">Gagal memuat data.</div>}
                    {data && data.data.length === 0 && (
                        <div className="py-16 text-center text-slate-400 font-medium">Tidak ada data ditemukan.</div>
                    )}
                    {data && data.data.length > 0 && (
                        <UserTable
                            users={data.data}
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
