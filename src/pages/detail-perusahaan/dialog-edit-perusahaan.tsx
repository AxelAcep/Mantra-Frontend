import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface CompanyData {
    name: string
    address: string
    phone: string
}

interface DialogEditPerusahaanProps {
    children: React.ReactNode
    company: CompanyData
    onEditCompany: (updatedCompany: CompanyData) => void
}

export function DialogEditPerusahaan({ children, company, onEditCompany }: DialogEditPerusahaanProps) {
    const [open, setOpen] = React.useState(false)
    const [form, setForm] = React.useState({
        nama: company.name,
        alamat: company.address === "-" ? "" : company.address,
        telepon: company.phone === "-" ? "" : company.phone,
    })

    // Sync state with props when modal opens
    React.useEffect(() => {
        if (open) {
            setForm({
                nama: company.name,
                alamat: company.address === "-" ? "" : company.address,
                telepon: company.phone === "-" ? "" : company.phone,
            })
        }
    }, [open, company])

    const isComplete = form.nama.trim() !== ""

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    }

    function handleSubmit() {
        if (!form.nama.trim()) return
        onEditCompany({
            name: form.nama.trim(),
            address: form.alamat.trim() || "-",
            phone: form.telepon.trim() || "-",
        })
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden bg-white gap-0 border-slate-100 shadow-xl rounded-xl">
                <DialogHeader className="px-6 py-5 border-b border-slate-100">
                    <DialogTitle className="text-xl font-bold text-slate-800">Edit Perusahaan</DialogTitle>
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
                        Simpan Perubahan
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
