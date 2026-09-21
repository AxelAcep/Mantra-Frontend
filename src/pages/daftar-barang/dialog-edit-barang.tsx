import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEditBarang } from "@/hooks/use-barang"
import { DialogKonfirmasi } from "@/pages/manajemen-akun/dialog-konfirmasi"
import type { Barang } from "../../services/barang.services"

export function DialogEditBarang({ children, item }: { children: React.ReactNode; item: Barang }) {
    const [open, setOpen] = React.useState(false)
    const [konfirmasi, setKonfirmasi] = React.useState(false)
    const [form, setForm] = React.useState({
        noBarang: item.noBarang,
        deskripsi: item.deskripsi,
        satuan: item.satuan,
    })

    const isChanged =
        form.noBarang !== item.noBarang ||
        form.deskripsi !== item.deskripsi ||
        form.satuan !== item.satuan

    const { mutate, isPending } = useEditBarang(() => {
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
        mutate({ id: item.id, payload: form })
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>{children}</DialogTrigger>
                <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0 overflow-hidden bg-white gap-0 border-slate-100 shadow-xl rounded-xl">
                    <DialogHeader className="px-6 py-5 border-b border-slate-100 shrink-0">
                        <DialogTitle className="text-xl font-bold text-slate-800">Edit Barang</DialogTitle>
                    </DialogHeader>
                    <div className="px-6 py-6 flex-1 overflow-y-auto flex flex-col gap-5">
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-noBarang" className="text-sm font-medium text-slate-700">No. Barang</Label>
                            <Input
                                id="edit-noBarang"
                                name="noBarang"
                                value={form.noBarang}
                                onChange={handleChange}
                                className="h-11 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-deskripsi" className="text-sm font-medium text-slate-700">Deskripsi Barang</Label>
                            <Input
                                id="edit-deskripsi"
                                name="deskripsi"
                                value={form.deskripsi}
                                onChange={handleChange}
                                className="h-11 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="edit-satuan" className="text-sm font-medium text-slate-700">Satuan</Label>
                            <Input
                                id="edit-satuan"
                                name="satuan"
                                value={form.satuan}
                                onChange={handleChange}
                                className="h-11 border-slate-200 text-slate-700 focus-visible:ring-4 focus-visible:ring-cyan-500/10 focus-visible:border-cyan-500 font-medium rounded-lg shadow-none"
                            />
                        </div>
                    </div>
                    <DialogFooter className="px-6 py-4 border-t border-slate-100 flex items-center justify-end gap-3 sm:gap-3 flex-row bg-slate-50/30 shrink-0">
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
                description="Apakah kamu yakin ingin menyimpan perubahan data barang ini?"
                confirmLabel="Ya, simpan"
                onConfirm={handleConfirm}
            />
        </>
    )
}
