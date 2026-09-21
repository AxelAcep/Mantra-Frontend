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
    if (!active || !dir) return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-400" />
    return dir === "asc"
        ? <ChevronUp className="w-3.5 h-3.5 text-cyan-600" />
        : <ChevronDown className="w-3.5 h-3.5 text-cyan-600" />
}

function SortableHeader({ label, field, sortBy, sortDir, onSort, className = "" }: {
    label: string; field: string; sortBy: string; sortDir: SortDir
    onSort: (field: string) => void; className?: string
}) {
    const isActive = sortBy === field
    return (
        <TableHead
            className={`cursor-pointer select-none group text-[#000000] text-xs font-semibold ${className}`}
            onClick={() => onSort(field)}
        >
            <div className="flex items-center gap-1">
                <span className={`uppercase font-semibold`}>
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
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50 border-b border-slate-100">
                        <SortableHeader label="KARYAWAN" field="karyawan" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                        <SortableHeader label="DIVISI" field="divisi" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                        <SortableHeader label="EMAIL" field="email" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                        <SortableHeader label="ROLE" field="role" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                        <SortableHeader label="STATUS" field="status" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                        <SortableHeader label="AKTIVITAS TERAKHIR" field="last_login" sortBy={sortBy} sortDir={sortDir as SortDir} onSort={onSort} />
                        <TableHead className="text-[#000000] text-xs font-semibold text-right">AKSI</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => {
                        const { tanggal, waktu } = formatDate(user.lastLogin)
                        const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
                        return (
                            <TableRow key={user.id} className="hover:bg-slate-50/50 transition-colors">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${avatarColor}`}>
                                            {getInitials(user.pegawai.nama)}
                                        </div>
                                        <div title={user.pegawai.nama} className="max-w-[150px]">
                                            <p className="font-semibold text-gray-900 truncate">{user.pegawai.nama}</p>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full text-xs font-semibold">
                                        {user.pegawai.divisi?.replace(/_/g, " ").toLowerCase().replace(/\b\w/g, c => c.toUpperCase())}
                                    </span>
                                </TableCell>
                                <TableCell className="text-gray-800 truncate" title={user.email}>{user.email}</TableCell>
                                <TableCell>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
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
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="text-gray-800">{tanggal}</span>
                                        {waktu && <span className="text-xs text-gray-800 mt-0.5">{waktu}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <DialogEditKaryawan user={user}>
                                            <button className="text-cyan-600 text-sm font-medium hover:underline">
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