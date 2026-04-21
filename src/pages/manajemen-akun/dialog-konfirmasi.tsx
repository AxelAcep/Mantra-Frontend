import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Props = {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    onConfirm: () => void
    confirmLabel?: string
    variant?: "danger" | "default"
}

export function DialogKonfirmasi({ open, onOpenChange, title, description, onConfirm, confirmLabel = "Ya, lanjutkan", variant = "default" }: Props) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent className="sm:max-w-[400px] rounded-xl border-slate-100 shadow-xl">
                <AlertDialogHeader>
                    <AlertDialogTitle className="text-lg font-bold text-slate-800">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-sm text-slate-500 font-medium">{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold shadow-none rounded-lg">
                        Batal
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className={`font-semibold shadow-none rounded-lg ${variant === "danger"
                                ? "bg-rose-500 hover:bg-rose-600 text-white"
                                : "bg-cyan-500! hover:bg-cyan-600! text-white"
                            }`}
                    >
                        {confirmLabel}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}