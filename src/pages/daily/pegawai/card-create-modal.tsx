import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Check, ChevronsUpDown } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "@/components/ui/command"
import { DialogKonfirmasi } from "./dialog-konfirmasi"
import { useCreateActivity } from "@/hooks/use-activity"
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

interface JadwalForm {
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

interface TambahJadwalModalProps {
    open: boolean
    onClose: () => void
    hasOverdue?: boolean
    onRescheduleClick?: () => void
}

const toDateInput = (date: Date) => date.toISOString().split("T")[0]
const toTimeInput = (date: Date) => date.toTimeString().slice(0, 5)

function buildISO(tanggal: string, waktu: string): string {
    return new Date(`${tanggal}T${waktu}:00`).toISOString()
}

export function TambahJadwalModal({ open, onClose, hasOverdue, onRescheduleClick }: TambahJadwalModalProps) {
    const now = new Date()
    const plus24 = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    hasOverdue = false

    const [form, setForm] = useState<JadwalForm>({
        tanggalInput: toDateInput(now),
        waktu: toTimeInput(now),
        kategori: "BILL_OF_QUANTITY",
        perusahaan: "",
        judul: "",
        deskripsi: "",
        deadlineTanggal: toDateInput(plus24),
        deadlineWaktu: toTimeInput(plus24),
        nomorReferensi: "",
    })

    const [konfirmasi, setKonfirmasi] = useState(false)
    const [openPerusahaan, setOpenPerusahaan] = useState(false)
    const { data: perusahaanList = [] } = usePerusahaan()

    useEffect(() => {
        if (!open) {
            setForm((prev) => ({
                ...prev,
                kategori: "BILL_OF_QUANTITY",
                perusahaan: "",
                judul: "",
                deskripsi: "",
                nomorReferensi: "",
            }))
            setKonfirmasi(false)
            return
        }

        const updateWaktu = () => {
            const current = new Date()
            const currentPlus24 = new Date(current.getTime() + 24 * 60 * 60 * 1000)

            setForm((prev) => ({
                ...prev,
                tanggalInput: toDateInput(current),
                waktu: toTimeInput(current),
                deadlineTanggal: toDateInput(currentPlus24),
                deadlineWaktu: toTimeInput(currentPlus24),
            }))
        }

        // Update immediately when opened
        updateWaktu()

        // Update every 1 minute
        const interval = setInterval(updateWaktu, 60000)

        return () => clearInterval(interval)
    }, [open])

    const { mutate, isPending } = useCreateActivity(() => {
        onClose()
    })

    const set = (key: keyof JadwalForm) =>
        (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setForm((prev) => ({ ...prev, [key]: e.target.value }))

    function handleSubmit() {
        if (!form.judul || !form.deskripsi || !form.kategori) {
            return
        }
        setKonfirmasi(true)
    }

    function handleConfirm() {
        mutate({
            terkaitPO: form.nomorReferensi || undefined,
            perusahaan: form.perusahaan || undefined,
            kategori: form.kategori,
            judul: form.judul,
            deskripsi: form.deskripsi,
            waktuMulai: buildISO(form.tanggalInput, form.waktu),
            targetSelesai: buildISO(form.deadlineTanggal, form.deadlineWaktu),
            kolaborator: [],
        })
    }

    return (
        <>
            <Dialog open={open && !konfirmasi} onOpenChange={(val) => {
                if (!val) onClose()
            }}>
                <DialogContent className="sm:max-w-xl bg-white rounded-2xl p-6 max-h-[90vh] flex flex-col">
                    <DialogHeader className="mb-0 shrink-0">
                        <DialogTitle className="text-lg font-bold text-gray-900">Jadwal Aktivitas</DialogTitle>
                        {hasOverdue && (
                            <div className="flex items-start gap-3 bg-red-50/80 border border-red-100 rounded-xl p-3">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                                <div className="space-y-1 text-sm">
                                    <h3 className="font-semibold text-red-700">Perhatian</h3>
                                    <p className="text-red-600 leading-relaxed">
                                        Kamu memiliki aktivitas yang perlu reschedule. Silahkan kunjungi halaman <a href="#" onClick={(e) => { e.preventDefault(); onRescheduleClick?.() }} className="text-cyan-500 font-medium hover:underline">Reschedule</a> sebelum menambah aktivitas baru.
                                    </p>
                                </div>
                            </div>
                        )}

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
                                    className="bg-slate-100 border-gray-200 text-gray-400 cursor-not-allowed focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-gray-600">Waktu</Label>
                                <Input
                                    type="time"
                                    value={form.waktu}
                                    disabled
                                    className="bg-slate-100 border-gray-200 text-gray-400 cursor-not-allowed focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-600">Kategori</Label>
                            <Select disabled={hasOverdue} value={form.kategori} onValueChange={(v) => setForm((p) => ({ ...p, kategori: v }))}>
                                <SelectTrigger className="bg-slate-50 border-gray-200 text-gray-700 focus:ring-cyan-600 focus:border-cyan-600 focus:ring-1 disabled:opacity-50 disabled:cursor-not-allowed">
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
                                    <div className="relative cursor-text">
                                        <Input
                                            disabled={hasOverdue}
                                            value={form.perusahaan}
                                            onChange={(e) => {
                                                setForm((prev) => ({ ...prev, perusahaan: e.target.value }))
                                                if (!openPerusahaan) setOpenPerusahaan(true)
                                            }}
                                            onFocus={() => {
                                                if (perusahaanList.length > 0) setOpenPerusahaan(true)
                                            }}
                                            placeholder="Pilih atau ketik perusahaan..."
                                            className="bg-slate-50 border-gray-200 text-gray-700 pr-10 focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                        />
                                        <ChevronsUpDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 shrink-0 opacity-50 pointer-events-none" />
                                    </div>
                                </PopoverTrigger>
                                <PopoverContent
                                    align="start"
                                    className="p-0 border-gray-200 shadow-lg"
                                    style={{ width: "var(--radix-popover-trigger-width)" }}
                                    onOpenAutoFocus={(e) => e.preventDefault()}
                                >
                                    <Command>
                                        <CommandList>
                                            <CommandEmpty className="py-3 text-center text-sm text-gray-500">Tidak ditemukan.</CommandEmpty>
                                            <CommandGroup className="max-h-[220px] overflow-y-auto p-1">
                                                {perusahaanList
                                                    .filter((p) =>
                                                        p.nama.toLowerCase().includes(form.perusahaan.toLowerCase())
                                                    )
                                                    .map((p) => (
                                                        <CommandItem
                                                            key={p.id}
                                                            value={p.nama}
                                                            onSelect={(currentValue) => {
                                                                setForm((prev) => ({ ...prev, perusahaan: currentValue }))
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
                                disabled={hasOverdue}
                                value={form.judul}
                                onChange={set("judul")}
                                placeholder="Masukkan judul aktivitas"
                                className="bg-slate-50 border-gray-200 text-gray-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-600">Deskripsi <span className="text-rose-400">*</span></Label>
                            <Textarea
                                disabled={hasOverdue}
                                value={form.deskripsi}
                                onChange={set("deskripsi")}
                                maxLength={3000}
                                placeholder="Masukkan deskripsi aktivitas"
                                className="bg-slate-50 border-gray-200 text-gray-700 resize-none focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
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
                                    onChange={set("deadlineTanggal")}
                                    disabled
                                    className="bg-slate-50 border-gray-200 text-gray-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-sm text-gray-600">Deadline Waktu</Label>
                                <Input
                                    type="time"
                                    value={form.deadlineWaktu}
                                    onChange={set("deadlineWaktu")}
                                    disabled
                                    className="bg-slate-50 border-gray-200 text-gray-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <Label className="text-sm text-gray-600">Nomor Referensi</Label>
                            <Input
                                disabled={hasOverdue}
                                value={form.nomorReferensi}
                                onChange={set("nomorReferensi")}
                                placeholder="Contoh: PO-26273-2132"
                                className="bg-slate-50 border-gray-200 text-gray-700 focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            />
                        </div>
                    </div>

                    <hr className="-mx-6 border-gray-100" />

                    <div className="flex justify-end gap-3 mt-2 shrink-0">
                        <Button variant="outline" onClick={onClose} className="border-gray-200 text-gray-600 bg-white hover:bg-slate-50">
                            Batal
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={isPending || !form.judul || !form.deskripsi || hasOverdue}
                            className={`shadow-none font-semibold ${isPending || !form.judul || !form.deskripsi || hasOverdue
                                ? "bg-slate-200 hover:bg-slate-200 text-slate-400 opacity-100"
                                : "bg-cyan-500 hover:bg-cyan-600 text-white"
                                }`}
                        >
                            Konfirmasi
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            <DialogKonfirmasi
                open={konfirmasi}
                onOpenChange={setKonfirmasi}
                title="Konfirmasi Tambah Aktivitas"
                description={`Pastikan informasi sudah benar.\n\nJudul: ${form.judul}\nKategori: ${form.kategori}\nDeadline: ${form.deadlineTanggal} ${form.deadlineWaktu}\n\nLanjutkan?`}
                confirmLabel={isPending ? "Menyimpan..." : "Ya, Tambahkan"}
                onConfirm={handleConfirm}
            />
        </>
    )
}