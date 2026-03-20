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
import { ChevronDown } from "lucide-react"

export function DialogTambahKaryawan({ children }: { children: React.ReactNode }) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white gap-0 border-slate-100 shadow-xl rounded-xl">
                <DialogHeader className="px-6 py-5 border-b border-slate-100">
                    <DialogTitle className="text-xl font-bold text-slate-800">Tambah Karyawan</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-2 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nama" className="text-sm font-medium text-slate-700">Nama Karyawan</Label>
                        <Input
                            id="nama"
                            placeholder="Masukkan nama karyawan"
                            className="h-11 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="divisi" className="text-sm font-medium text-slate-700">Divisi</Label>
                        <div className="relative">
                            <select
                                id="divisi"
                                className="w-full appearance-none h-11 px-3 py-2 border border-slate-200 rounded-lg bg-white text-slate-700 text-sm focus:outline-none focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 transition-all font-medium"
                                defaultValue="sales"
                            >
                                <option value="sales">Sales</option>
                                <option value="pre_sales">Pre-Sales</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-slate-400">
                                <ChevronDown className="h-4 w-4" />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="username" className="text-sm font-medium text-slate-700">Username</Label>
                        <Input
                            id="username"
                            placeholder="Masukkan username karyawan"
                            className="h-11 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="password" className="text-sm font-medium text-slate-700">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            placeholder="Masukkan password karyawan"
                            className="h-11 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                        />
                    </div>
                </div>
                <DialogFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 sm:gap-3 flex-row bg-slate-50/30">
                    <DialogClose asChild>
                        <Button type="button" variant="outline" className="h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-800 font-semibold rounded-lg shadow-none">
                            Batal
                        </Button>
                    </DialogClose>
                    <Button type="submit" className="h-10 px-6 bg-cyan-500 hover:bg-cyan-600 text-white font-semibold shadow-none rounded-lg">
                        Tambah Karyawan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
