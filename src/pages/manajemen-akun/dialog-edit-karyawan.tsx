import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronDown, Eye, EyeOff } from "lucide-react"
import { useEditUser } from "@/hooks/use-user"
import { DIVISI_OPTIONS, ROLE_OPTIONS } from "./divisi-options"
import { DialogKonfirmasi } from "./dialog-konfirmasi"
import type { User } from "../../services/user.services"

export function DialogEditKaryawan({ children, user }: { children: React.ReactNode; user: User }) {
    const [showPassword, setShowPassword] = React.useState(false)
    const [open, setOpen] = React.useState(false)
    const [konfirmasi, setKonfirmasi] = React.useState(false)
    const [form, setForm] = React.useState({
        nama: user.pegawai.nama,
        email: user.email,
        role: user.role,
        divisi: user.pegawai.divisi,
        password: "",
    })

    const isChanged =
        form.nama !== user.pegawai.nama ||
        form.email !== user.email ||
        form.role !== user.role ||
        form.divisi !== user.pegawai.divisi ||
        form.password !== ""

    const { mutate, isPending } = useEditUser(() => {
        setOpen(false)
        setKonfirmasi(false)
    })

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSubmit() {
        setKonfirmasi(true)
    }

    function handleConfirm() {
        mutate({ id: user.id, payload: form })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white gap-0 border-slate-100 shadow-xl rounded-xl">
                    <DialogHeader className="px-6 py-5 border-b border-slate-100">
                        <DialogTitle className="text-xl font-bold text-slate-800">Edit Karyawan</DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-6 flex flex-col gap-5">
                        {[
                            { id: "nama", label: "Nama Karyawan", type: "text" },
                            { id: "email", label: "Email", type: "email" },
                            { id: "password", label: "Password Baru", type: "password" },
                        ].map((field) => (
                            <div key={field.id} className="flex flex-col gap-2">
                                <Label htmlFor={`edit-${field.id}`} className="text-sm font-medium text-slate-700">
                                    {field.label}
                                    {field.id === "password" && (
                                        <span className="text-slate-400 font-normal ml-1">(kosongkan jika tidak diubah)</span>
                                    )}
                                </Label>
                                <div className="relative group/input">
                                    <Input
                                        id={`edit-${field.id}`}
                                        name={field.id}
                                        type={field.id === "password" ? (showPassword ? "text" : "password") : field.type}
                                        value={form[field.id as keyof typeof form]}
                                        onChange={handleChange}
                                        className={`h-11 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none ${field.id === "password" ? "pr-11" : ""}`}
                                    />
                                    {field.id === "password" && (
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors p-1"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                        {[
                            { id: "divisi", label: "Divisi", options: DIVISI_OPTIONS },
                            { id: "role", label: "Role", options: ROLE_OPTIONS },
                        ].map((field) => (
                            <div key={field.id} className="flex flex-col gap-2">
                                <Label htmlFor={`edit-${field.id}`} className="text-sm font-medium text-slate-700">{field.label}</Label>
                                <div className="relative">
                                    <select
                                        id={`edit-${field.id}`}
                                        name={field.id}
                                        value={form[field.id as keyof typeof form]}
                                        onChange={handleChange}
                                        className="w-full appearance-none h-11 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all font-medium"
                                    >
                                        {field.options.map((opt) => (
                                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                                        ))}
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                        <ChevronDown className="h-4 w-4" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <DialogFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 sm:gap-3 flex-row bg-slate-50/30">
                        <DialogClose asChild>
                            <Button type="button" variant="outline" className="h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 font-semibold rounded-lg shadow-none">
                                Batal
                            </Button>
                        </DialogClose>
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !isChanged}
                            className={`h-10 px-6 font-semibold shadow-none rounded-lg transition-all ${!isChanged
                                    ? "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200"
                                    : "bg-cyan-500 hover:bg-cyan-600 text-white"
                                }`}
                        >
                            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <DialogKonfirmasi
                open={konfirmasi}
                onOpenChange={setKonfirmasi}
                title="Simpan Perubahan"
                description="Apakah kamu yakin ingin menyimpan perubahan data karyawan ini?"
                confirmLabel="Ya, simpan"
                onConfirm={handleConfirm}
            />
        </>
    )
}