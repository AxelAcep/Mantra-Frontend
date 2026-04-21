import { useState } from "react"
import { useMe, useEditUser } from "@/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { DialogKonfirmasi } from "@/pages/manajemen-akun/dialog-konfirmasi"

export default function PengaturanManagerPage() {
    const { data: profileData, isLoading, error: profileError } = useMe()
    const [showPassword, setShowPassword] = useState(false)
    const [password, setPassword] = useState("")
    const [konfirmasi, setKonfirmasi] = useState(false)

    const { mutate, isPending } = useEditUser(() => {
        setKonfirmasi(false)
        setPassword("")
    })

    if (isLoading) {
        return (
            <div className="p-8 bg-slate-50 min-h-full space-y-6">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Card className="max-w-2xl p-6 rounded-2xl shadow-sm border-gray-100 bg-white space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </Card>
            </div>
        )
    }

    if (profileError || !profileData?.user) {
        return <div className="p-8 text-red-500">Gagal memuat data profil. Silakan coba lagi.</div>
    }

    const user = profileData.user

    // Mapping data untuk tampilan
    const userData = {
        id: user.id,
        nama: user.pegawai?.nama ?? "User",
        role: user.role ?? "MASTER",
        divisi: user.pegawai?.divisi ?? "Manager",
        email: user.email ?? "-"
    }

    function handleSubmit() {
        setKonfirmasi(true)
    }

    const isChanged = password.trim() !== ""

    function handleConfirm() {
        if (!userData) return

        const payload: any = {
            nama: userData.nama,
            email: userData.email,
            role: userData.role,
            divisi: userData.divisi,
        }

        // Hanya kirim password jika diisi
        if (isChanged) {
            payload.password = password
        }

        mutate({ id: userData.id, payload })
    }

    if (!userData) return null

    return (
        <div className="p-8 bg-slate-50 min-h-full space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
                <p className="text-slate-500">Perbarui informasi email dan kata sandi Anda di bawah ini.</p>
            </div>

            <Card className="max-w-2xl p-6 rounded-2xl shadow-sm border-gray-100 bg-white space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <Label className="text-slate-600 font-medium ml-1">Nama</Label>
                        <Input
                            value={userData.nama}
                            readOnly
                            className="bg-slate-50 border-gray-200 text-slate-400 cursor-not-allowed h-11 rounded-xl px-4"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="text-slate-600 font-medium ml-1">Jabatan</Label>
                        <Input
                            value={userData.divisi}
                            readOnly
                            className="bg-slate-50 border-gray-200 text-slate-400 cursor-not-allowed h-11 rounded-xl px-4"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-600 font-medium ml-1">Email</Label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            value={userData.email}
                            readOnly
                            className="bg-white border-gray-200 text-slate-700 h-11 rounded-xl pl-11 pr-4 w-full"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="text-slate-600 font-medium ml-1">
                        Kata Sandi Baru
                        <span className="text-xs text-slate-400 font-normal ml-2">(kosongkan jika tidak diubah)</span>
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-white border-gray-200 text-slate-700 h-11 rounded-xl pl-11 pr-11 w-full focus-visible:ring-cyan-500/20 focus-visible:border-cyan-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                        >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <Button
                        variant="outline"
                        onClick={() => setPassword("")}
                        className="h-11 px-8 rounded-xl border-gray-200 text-slate-600 font-semibold"
                    >
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !isChanged}
                        className={`h-11 px-8 rounded-xl font-semibold flex-1 md:flex-none transition-all ${!isChanged
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200"
                            : "bg-cyan-500 hover:bg-cyan-600 text-white"
                            }`}
                    >
                        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                    </Button>
                </div>
            </Card>

            <DialogKonfirmasi
                open={konfirmasi}
                onOpenChange={setKonfirmasi}
                title="Simpan Perubahan"
                description="Apakah kamu yakin ingin menyimpan perubahan data akun Anda?"
                confirmLabel="Ya, simpan"
                onConfirm={handleConfirm}
            />
        </div>
    )
}
