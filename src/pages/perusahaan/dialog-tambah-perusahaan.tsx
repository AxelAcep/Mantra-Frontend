import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface DialogTambahPerusahaanProps {
    children: React.ReactNode
    onAddCompany: (company: { name: string; address: string; phone: string }) => void
}

export function DialogTambahPerusahaan({ children, onAddCompany }: DialogTambahPerusahaanProps) {
    const [open, setOpen] = React.useState(false)
    const [form, setForm] = React.useState({
        nama: "",
        alamat: "",
        telepon: "",
    })

    const isComplete = form.nama.trim() !== ""

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSubmit() {
        if (!form.nama.trim()) return
        onAddCompany({
            name: form.nama.trim(),
            address: form.alamat.trim(),
            phone: form.telepon.trim(),
        })
        setOpen(false)
        setForm({ nama: "", alamat: "", telepon: "" })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white gap-0 border-slate-100 shadow-xl rounded-xl">
                <DialogHeader className="px-6 py-5 border-b border-slate-100">
                    <DialogTitle className="text-xl font-bold text-slate-800">Tambah Perusahaan</DialogTitle>
                </DialogHeader>
                <div className="px-6 py-6 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="nama" className="text-sm font-medium text-slate-700">
                            Nama Perusahaan <span className="text-rose-400">*</span>
                        </Label>
                        <Input
                            id="nama"
                            name="nama"
                            placeholder="Masukkan nama perusahaan"
                            value={form.nama}
                            onChange={handleChange}
                            className="h-11 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="alamat" className="text-sm font-medium text-slate-700">Alamat</Label>
                        <Textarea
                            id="alamat"
                            name="alamat"
                            placeholder="Masukkan alamat perusahaan"
                            value={form.alamat}
                            onChange={handleChange}
                            className="border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none resize-none"
                            rows={3}
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="telepon" className="text-sm font-medium text-slate-700">Nomor Telepon</Label>
                        <Input
                            id="telepon"
                            name="telepon"
                            placeholder="Masukkan nomor telepon perusahaan"
                            value={form.telepon}
                            onChange={handleChange}
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
                    <Button
                        onClick={handleSubmit}
                        disabled={!isComplete}
                        className={`h-10 px-6 font-semibold shadow-none rounded-lg transition-all ${!isComplete
                            ? "bg-slate-200 text-slate-400 cursor-not-allowed hover:bg-slate-200"
                            : "bg-cyan-500 hover:bg-cyan-600 text-white"
                            }`}
                    >
                        Tambah Perusahaan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
