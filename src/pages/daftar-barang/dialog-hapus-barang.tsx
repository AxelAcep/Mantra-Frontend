import * as React from "react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useDeleteBarang } from "@/hooks/use-barang"
import type { Barang } from "../../services/barang.services"

export function DialogHapusBarang({ children, item }: { children: React.ReactNode; item: Barang }) {
    const [open, setOpen] = React.useState(false)

    const { mutate, isPending } = useDeleteBarang(() => {
        setOpen(false)
    })

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
            <AlertDialogContent className="sm:max-w-[400px] rounded-xl border-slate-100 shadow-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-bold text-slate-800">Hapus Barang</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-slate-500 font-medium">
                        Apakah kamu yakin ingin menghapus barang <span className="font-semibold text-slate-700">{item.noBarang}</span> — {item.deskripsi}? Tindakan ini tidak dapat dibatalkan.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold shadow-none rounded-lg">
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => mutate(item.id)}
                        disabled={isPending}
                        className="bg-rose-500 hover:bg-rose-600 text-white font-semibold shadow-none rounded-lg"
                    >
                        {isPending ? "Menghapus..." : "Ya, Hapus"}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
