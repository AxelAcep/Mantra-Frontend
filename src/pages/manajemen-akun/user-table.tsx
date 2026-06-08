import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { DialogEditKaryawan } from "./dialog-edit-karyawan"
import type { User } from "../../services/user.services"

function getInitials(nama: string) {
    return nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

const AVATAR_COLORS = [
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-cyan-100 text-cyan-600",
    "bg-orange-100 text-orange-600",
    "bg-indigo-100 text-indigo-600",
    "bg-rose-100 text-rose-600",
    "bg-emerald-100 text-emerald-600",
]

function formatDate(dateStr?: string) {
    if (!dateStr) return { tanggal: "-", waktu: "" }
    const d = new Date(dateStr)
    return {
        tanggal: d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        waktu: d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB",
    }
}

type SortDir = "asc" | "desc" | ""

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
    if (!active || !dir) return <ChevronsUpDown className="w-3 h-3 text-slate-400 shrink-0" />
    return dir === "asc"
        ? <ChevronUp className="w-3 h-3 text-cyan-600 shrink-0" />
        : <ChevronDown className="w-3 h-3 text-cyan-600 shrink-0" />
}

function SortableHeader({ label, field, sortBy, sortDir, onSort, className = "" }: {
    label: string; field: string; sortBy: string; sortDir: SortDir
    onSort: (field: string) => void; className?: string
}) {
    const isActive = sortBy === field
    return (
        <TableHead
            className={`cursor-pointer select-none group text-slate-500 font-semibold h-12 transition-colors ${className}`}
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                <span className={`uppercase text-xs ${isActive ? "text-cyan-600" : ""} group-hover:text-cyan-600 transition-colors`}>
                    {label}
                </span>
                <SortIcon active={isActive} dir={isActive ? sortDir : ""} />
            </div>
        </TableHead>
    )
}

export interface UserTableProps {
    users: User[]
    sortBy: string
    sortDir: string
    onSort: (field: string) => void
}

export function UserTable({ users, sortBy, sortDir, onSort }: UserTableProps) {
    return (
        <>
            <Table className="w-full table-fixed min-w-[1000px]">
                <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <SortableHeader label="KARYAWAN" field="karyawan" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} className="w-[22%] px-6" />
                        <SortableHeader label="DIVISI" field="divisi" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} className="w-[14%]" />
                        <SortableHeader label="EMAIL" field="email" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} className="w-[21%]" />
                        <SortableHeader label="ROLE" field="role" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} className="w-[10%]" />
                        <SortableHeader label="STATUS" field="status" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} className="w-[10%]" />
                        <SortableHeader label="AKTIVITAS TERAKHIR" field="last_login" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} className="w-[15%]" />
                        <TableHead className="text-xs font-semibold text-slate-500 h-12 text-right pl-2 pr-6 w-[8%]">AKSI</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => {
                        const { tanggal, waktu } = formatDate(user.lastLogin)
                        const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
                        return (
                            <TableRow key={user.id} className="hover:bg-slate-50/50">
                                <TableCell className="px-6 truncate">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${avatarColor}`}>
                                            {getInitials(user.pegawai.nama)}
                                        </div>
                                        <span className="font-medium text-slate-700 truncate" title={user.pegawai.nama}>{user.pegawai.nama}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500 font-medium truncate" title={user.pegawai.divisi}>{user.pegawai.divisi}</TableCell>
                                <TableCell className="text-slate-500 font-medium truncate" title={user.email}>{user.email}</TableCell>
                                <TableCell className="truncate">
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell className="truncate">
                                    {user.activeStatus ?? true ? (
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                                            Aktif
                                        </span>
                                    ) : (
                                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-700">
                                            Nonaktif
                                        </span>
                                    )}
                                </TableCell>
                                <TableCell className="truncate">
                                    <div className="flex flex-col truncate">
                                        <span className="font-medium text-slate-700 truncate">{tanggal}</span>
                                        {waktu && <span className="text-xs text-slate-400 mt-0.5 font-medium truncate">{waktu}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right pl-2 pr-6">
                                    <div className="flex items-center justify-end gap-3">
                                        <DialogEditKaryawan user={user}>
                                            <button className="text-cyan-500 font-semibold hover:text-cyan-600 text-sm">
                                                Edit
                                            </button>
                                        </DialogEditKaryawan>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </>
    )
}