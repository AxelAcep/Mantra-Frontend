import { useMe } from "@/hooks/use-user"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User } from "lucide-react"

export default function PengaturanPegawaiPage() {
    const { data, isLoading, error } = useMe()
    const user = data?.user

    if (isLoading) {
        return (
            <div className="p-8 bg-slate-50 min-h-full space-y-6">
                <div className="space-y-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-96" />
                </div>
                <Card className="max-w-3xl p-8 rounded-2xl shadow-sm border-gray-100 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Skeleton className="h-16 w-full" />
                        <Skeleton className="h-16 w-full" />
                    </div>
                </Card>
            </div>
        )
    }

    if (error || !user) {
        return <div className="p-8 text-red-500">Gagal memuat data profil. Silakan coba lagi.</div>
    }

    // Mapping data
    const userData = {
        nama: user.pegawai?.nama ?? "User",
        role: user.pegawai?.divisi ?? user.role ?? "-",
        email: user.email ?? "-"
    }

    return (
        <div className="p-8 bg-slate-50 min-h-full space-y-6">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold text-slate-900">Pengaturan Akun</h1>
                <p className="text-slate-500">Perbarui informasi email dan kata sandi Anda di bawah ini.</p>
            </div>

            <Card className="max-w-3xl p-8 rounded-2xl shadow-sm border-gray-100 bg-white">
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
                            value={userData.role}
                            readOnly
                            className="bg-slate-50 border-gray-200 text-slate-400 cursor-not-allowed h-11 rounded-xl px-4"
                        />
                    </div>
                </div>

                <div className="mt-6 space-y-2">
                    <Label className="text-slate-600 font-medium ml-1">Username</Label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            value={userData.email}
                            readOnly
                            className="bg-slate-50 border-gray-200 text-slate-400 cursor-not-allowed h-11 rounded-xl pl-11 pr-4 w-full"
                        />
                    </div>
                </div>
            </Card>
        </div>
    )
}
