import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DialogEditKaryawan } from "./dialog-edit-karyawan"
import { DialogKonfirmasi } from "./dialog-konfirmasi"
import { useDeleteUser } from "@/hooks/use-user"
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

export function UserTable({ users }: { users: User[] }) {
    const { mutate: deleteUser } = useDeleteUser()
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null)

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                        <TableHead className="font-semibold text-slate-500 h-12 px-6">KARYAWAN</TableHead>
                        <TableHead className="font-semibold text-slate-500 h-12">DIVISI</TableHead>
                        <TableHead className="font-semibold text-slate-500 h-12">EMAIL</TableHead>
                        <TableHead className="font-semibold text-slate-500 h-12">ROLE</TableHead>
                        <TableHead className="font-semibold text-slate-500 h-12">AKTIVITAS TERAKHIR</TableHead>
                        <TableHead className="font-semibold text-slate-500 h-12 text-right px-6">AKSI</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => {
                        const { tanggal, waktu } = formatDate(user.lastLogin)
                        const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length]
                        return (
                            <TableRow key={user.id} className="hover:bg-slate-50/50">
                                <TableCell className="px-6">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${avatarColor}`}>
                                            {getInitials(user.pegawai.nama)}
                                        </div>
                                        <span className="font-medium text-slate-700">{user.pegawai.nama}</span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-slate-500 font-medium">{user.pegawai.divisi}</TableCell>
                                <TableCell className="text-slate-500 font-medium">{user.email}</TableCell>
                                <TableCell>
                                    <span className="text-xs font-semibold px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                                        {user.role}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium text-slate-700">{tanggal}</span>
                                        {waktu && <span className="text-sm text-slate-500 mt-0.5 font-medium">{waktu}</span>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right px-6">
                                    <div className="flex items-center justify-end gap-3">
                                        <DialogEditKaryawan user={user}>
                                            <button className="text-cyan-500 font-semibold hover:text-cyan-600 text-sm">
                                                Edit
                                            </button>
                                        </DialogEditKaryawan>
                                        <button
                                            onClick={() => setDeleteTarget(user)}
                                            className="text-rose-400 font-semibold hover:text-rose-600 text-sm"
                                        >
                                            Hapus
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>

            <DialogKonfirmasi
                open={!!deleteTarget}
                onOpenChange={(open) => !open && setDeleteTarget(null)}
                title="Hapus Akun"
                description={`Apakah kamu yakin ingin menghapus akun ${deleteTarget?.pegawai.nama}? Tindakan ini tidak bisa dibatalkan.`}
                confirmLabel="Ya, hapus"
                variant="danger"
                onConfirm={() => {
                    if (deleteTarget) {
                        deleteUser(deleteTarget.id)
                        setDeleteTarget(null)
                    }
                }}
            />
        </>
    )
}