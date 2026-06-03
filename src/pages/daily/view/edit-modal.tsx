import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList, CommandInput } from "@/components/ui/command"
import { useUpdateActivity } from "@/hooks/use-activity"
import { usePerusahaan } from "@/hooks/use-perusahaan"
import { cn } from "@/lib/utils"

const kategoriOptions = [
    { label: "Quotation", value: "QUOTATION" },
    { label: "Dokumentasi", value: "DOKUMENTASI" },
    { label: "Report Project", value: "REPORT_PROJECT" },
    { label: "Drawing", value: "DRAWING" },
    { label: "Kurva S", value: "KURVA_S" },
    { label: "MS Project", value: "MS_PROJECT" },
    { label: "Monitor Progress", value: "MONITOR_PROGRESS" },
    { label: "Monitor Project", value: "MONITOR_PROJECT" },
    { label: "Bill of Quantity", value: "BILL_OF_QUANTITY" },
    { label: "Akomodasi Project", value: "AKOMODASI_PROJECT" },
    { label: "Koordinasi Eksternal", value: "KOORDINASI_EKSTERNAL" },
    { label: "Dokumen Pendukung", value: "DOKUMEN_PENDUKUNG" },
    { label: "Work Order", value: "WORK_ORDER" },
    { label: "Approval User", value: "APPROVAL_USER" },
    { label: "Technical Advice", value: "TECHNICAL_ADVICE" },
    { label: "Lain-Lain", value: "LAIN_LAIN" },
]

interface EditActivityForm {
    tanggalInput: string
    waktu: string
    kategori: string
    perusahaan: string
    judul: string
    deskripsi: string
    deadlineTanggal: string
    deadlineWaktu: string
    nomorReferensi: string
}

interface EditActivityModalProps {
    open: boolean
    onClose: () => void
    onSuccess?: () => void
    activity: any
}

const toDateInput = (dateStr: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toISOString().split("T")[0]
}
const toTimeInput = (dateStr: string) => {
    if (!dateStr) return ""
    return new Date(dateStr).toTimeString().slice(0, 5)
}

export function EditActivityModal({ open, onClose, onSuccess, activity }: EditActivityModalProps) {
    const [form, setForm] = useState<EditActivityForm>({
        tanggalInput: "",
        waktu: "",
        kategori: "",
        perusahaan: "",
        judul: "",
        deskripsi: "",
        deadlineTanggal: "",
        deadlineWaktu: "",
        nomorReferensi: "",
    })

    const [openPerusahaan, setOpenPerusahaan] = useState(false)
    const { data: perusahaanList = [] } = usePerusahaan()

    useEffect(() => {
        if (open && activity) {
            setForm({
                tanggalInput: toDateInput(activity.waktuMulai),
                waktu: toTimeInput(activity.waktuMulai),
                kategori: activity.kategori || "",
                perusahaan: activity.perusahaan || "",
                judul: activity.judul || "",
                deskripsi: activity.deskripsi || "",
                deadlineTanggal: toDateInput(activity.targetSelesai),
                deadlineWaktu: toTimeInput(activity.targetSelesai),
                nomorReferensi: activity.terkaitPO || "",
            })
        }
    }, [open, activity])

    const { mutate, isPending } = useUpdateActivity(activity?.id, () => {
        onSuccess?.()
        onClose()
    })

    const set = (key: keyof EditActivityForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }))

    const hasChanges = () => {
        if (!activity) return false
        return (
            form.kategori !== (activity.kategori || "") ||
            form.perusahaan !== (activity.perusahaan || "") ||
            form.judul !== (activity.judul || "") ||
            form.deskripsi !== (activity.deskripsi || "") ||
            form.nomorReferensi !== (activity.terkaitPO || "")
        )
    }

    const isValid = form.judul && form.deskripsi && form.kategori

    function handleSubmit() {
        if (!isValid || !hasChanges()) return
        mutate({
            terkaitPO: form.nomorReferensi || undefined,
            perusahaan: form.perusahaan || undefined,
            kategori: form.kategori,
            judul: form.judul,
            deskripsi: form.deskripsi,
        })
    }

    return (
        <Dialog open={open} onOpenChange={(val) => { if (!val) onClose() }}>
            <DialogContent className="sm:max-w-xl bg-white rounded-2xl p-6 max-h-[90vh] flex flex-col">
                <DialogHeader className="mb-0 shrink-0">
                    <DialogTitle className="text-lg font-bold text-gray-900">Edit Jadwal Aktivitas</DialogTitle>
                </DialogHeader>

                <hr className="-mx-6 border-gray-100" />

                <div className="space-y-4 py-2 flex-1 overflow-y-auto px-1 -mx-1">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-600">Tanggal Input</Label>
                            <Input
                                type="date"
                                value={form.tanggalInput}
                                disabled
                                className="bg-slate-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-600">Waktu</Label>
                            <Input
                                type="time"
                                value={form.waktu}
                                disabled
                                className="bg-slate-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-600">Kategori</Label>
                        <Select value={form.kategori} onValueChange={(v) => setForm((p) => ({ ...p, kategori: v }))}>
                            <SelectTrigger className="bg-slate-50 border-gray-200 text-gray-700">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent position="popper" className="max-h-[200px]">
                                {kategoriOptions.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5 flex flex-col relative">
                        <Label className="text-sm text-gray-600">Perusahaan</Label>
                        <Popover open={openPerusahaan} onOpenChange={setOpenPerusahaan}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    className={cn(
                                        "w-full justify-between bg-slate-50 border-gray-200 text-gray-700 px-3 h-10 font-normal hover:bg-slate-50/80 focus:ring-cyan-600 focus:border-cyan-600 focus:ring-1 shadow-none",
                                        !form.perusahaan && "text-gray-400"
                                    )}
                                >
                                    <span className="truncate">
                                        {form.perusahaan || "Pilih perusahaan..."}
                                    </span>
                                    <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                align="start"
                                className="p-0 border-gray-200 shadow-lg"
                                style={{ width: "var(--radix-popover-trigger-width)" }}
                                onOpenAutoFocus={(e) => e.preventDefault()}
                            >
                                <Command>
                                    <CommandInput placeholder="Cari perusahaan..." className="h-9" />
                                    <CommandList>
                                        <CommandEmpty className="py-3 text-center text-sm text-gray-500">Tidak ditemukan.</CommandEmpty>
                                        <CommandGroup className="max-h-[220px] overflow-y-auto p-1">
                                            {/* Opsi Tanpa Perusahaan */}
                                            <CommandItem
                                                onSelect={() => {
                                                    setForm((prev) => ({ ...prev, perusahaan: "" }))
                                                    setOpenPerusahaan(false)
                                                }}
                                                className="flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                                            >
                                                <Check
                                                    className={cn(
                                                        "mr-2 h-4 w-4 shrink-0",
                                                        form.perusahaan === "" ? "opacity-100 text-cyan-600" : "opacity-0"
                                                    )}
                                                />
                                                <span className="text-sm font-semibold text-slate-400">Tanpa Perusahaan</span>
                                            </CommandItem>
                                            {perusahaanList.map((p) => (
                                                <CommandItem
                                                    key={p.id}
                                                    value={p.nama}
                                                    onSelect={() => {
                                                        setForm((prev) => ({ ...prev, perusahaan: p.nama }))
                                                        setOpenPerusahaan(false)
                                                    }}
                                                    className="flex items-center px-3 py-2 rounded-lg cursor-pointer hover:bg-slate-100 transition-colors"
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4 shrink-0",
                                                            form.perusahaan.toLowerCase() === p.nama.toLowerCase()
                                                                ? "opacity-100 text-cyan-600"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    <span className="text-sm text-gray-700 truncate">{p.nama}</span>
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-600">Judul <span className="text-rose-400">*</span></Label>
                        <Input
                            value={form.judul}
                            onChange={set("judul")}
                            placeholder="Masukkan judul aktivitas"
                            className="bg-slate-50 border-gray-200 text-gray-700"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-600">Deskripsi <span className="text-rose-400">*</span></Label>
                        <Textarea
                            value={form.deskripsi}
                            onChange={set("deskripsi")}
                            maxLength={3000}
                            placeholder="Masukkan deskripsi aktivitas"
                            className="bg-slate-50 border-gray-200 text-gray-700 resize-none"
                            rows={3}
                        />
                        <p className="text-xs text-right text-gray-500">
                            {form.deskripsi.length}/3000 karakter
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-600">Deadline Tanggal</Label>
                            <Input
                                type="date"
                                value={form.deadlineTanggal}
                                disabled
                                className="bg-slate-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-600">Deadline Waktu</Label>
                            <Input
                                type="time"
                                value={form.deadlineWaktu}
                                disabled
                                className="bg-slate-100 border-gray-200 text-gray-400 cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <Label className="text-sm text-gray-600">Nomor Referensi</Label>
                        <Input
                            value={form.nomorReferensi}
                            onChange={set("nomorReferensi")}
                            placeholder="Contoh: PO-26273-2132"
                            className="bg-slate-50 border-gray-200 text-gray-700"
                        />
                    </div>
                </div>

                <hr className="-mx-6 border-gray-100" />

                <div className="flex justify-end gap-3 mt-4 shrink-0">
                    <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-600 bg-white hover:bg-slate-50">
                        Batal
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={isPending || !isValid || !hasChanges()}
                        className={`shadow-none font-semibold ${isPending || !isValid || !hasChanges()
                            ? "bg-slate-200 text-slate-400 opacity-100 cursor-not-allowed"
                            : "bg-cyan-500 hover:bg-cyan-600 text-white"
                            }`}
                    >
                        {isPending ? "Menyimpan..." : "Simpan Aktivitas"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
