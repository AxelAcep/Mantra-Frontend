import { useState } from "react"
import { ChevronDown, ChevronUp, Plus, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useTambahKolaborator } from "@/hooks/use-activity"
import { DialogKonfirmasi } from "./dialog-konfirmasi"
import { usePegawai } from "@/hooks/use-user"
import { PegawaiSelect } from "./card-select"

const KATEGORI_OPTIONS = [
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

const STATUS_STYLE: Record<string, string> = {
    ON_PROGRESS: "bg-orange-100 text-orange-700 hover:bg-orange-100",
    PENDING: "bg-amber-100 text-amber-700 hover:bg-amber-100",
    DITERIMA: "bg-emerald-100 text-emerald-700 hover:bg-emerald-100",
    DITOLAK: "bg-red-100 text-red-700 hover:bg-red-100",
}

const STATUS_LABEL: Record<string, string> = {
    ON_PROGRESS: "On Progress",
    PENDING: "Menunggu",
    DITERIMA: "Selesai",
    DITOLAK: "Ditolak",
}

type Kolaborator = {
    id: string;
    activityId: string;
    pegawaiId: string;
    pegawai: { id: string; nama: string; divisi: string };
    childActivityId?: string | null;  // was: void | undefined
    judul: string;
    status: string;
};
type Props = {
    activityId: string
    kolaborator: Kolaborator[]
    activityStatus: string
    onLihatDetail?: (childActivityId: string) => void
    isKonfirmasiKolaborasi?: boolean
}

export function KolaborasiCard({ activityId, kolaborator, activityStatus, onLihatDetail, isKonfirmasiKolaborasi }: Props) {
    const isSelesai = activityStatus === "DITERIMA" || activityStatus === "PENDING";
    const [open, setOpen] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [konfirmasi, setKonfirmasi] = useState(false)
    const [form, setForm] = useState({ pegawaiId: "", judul: "", deskripsi: "", kategori: "BILL_OF_QUANTITY" })
    const { pegawai, loading: loadingPegawai } = usePegawai()

    const { mutate, isPending } = useTambahKolaborator(activityId, () => {
        setShowForm(false)
        setKonfirmasi(false)
        setForm({ pegawaiId: "", judul: "", deskripsi: "", kategori: "BILL_OF_QUANTITY" })
    })

    function handleSubmit() {
        if (!form.pegawaiId || !form.judul || !form.deskripsi) return
        setKonfirmasi(true)
    }

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <button
                    onClick={() => setOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                    <div className="text-left">
                        <p className="text-xs font-semibold text-cyan-500 mb-0.5">Bagian 2</p>
                        <h3 className="text-base font-bold text-gray-900">Kolaborasi</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Libatkan rekan kerja dalam aktivitasmu dan pantau progresnya langsung dari sini.
                        </p>
                    </div>
                    {open ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
                </button>

                {open && (
                    <div className="px-6 pb-6 border-t border-gray-100">
                        {kolaborator.length === 0 && !showForm && (
                            <p className="text-sm text-slate-400 mt-4">Belum ada kolaborator.</p>
                        )}

                        {kolaborator.map((kol, i) => (
                            <div
                                key={kol.id}
                                className="grid grid-cols-[2rem_1fr_1fr_1fr_1fr_1fr] gap-3 items-stretch mt-4"
                            >
                                {/* Nomor */}
                                <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 self-center">
                                    <span className="text-xs font-semibold text-slate-500">{i + 1}</span>
                                </div>

                                {/* Nama Karyawan */}
                                <div className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 min-w-0">
                                    <p className="text-xs text-gray-400 mb-1">Nama Karyawan</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate" title={kol.pegawai.nama}>{kol.pegawai.nama}</p>
                                </div>

                                {/* Divisi */}
                                <div className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 min-w-0">
                                    <p className="text-xs text-gray-400 mb-1">Divisi</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate" title={kol.pegawai.divisi}>{kol.pegawai.divisi}</p>
                                </div>

                                {/* Judul */}
                                <div className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 min-w-0">
                                    <p className="text-xs text-gray-400 mb-1">Judul</p>
                                    <p className="text-sm font-semibold text-gray-800 truncate" title={kol.judul}>{kol.judul}</p>
                                </div>

                                {/* Status */}
                                <div className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2">
                                    <p className="text-xs text-gray-400 mb-1">Status</p>
                                    <Badge className={`${STATUS_STYLE[kol.status]} border-none shadow-none px-2.5 text-xs`}>
                                        {STATUS_LABEL[kol.status] ?? kol.status}
                                    </Badge>
                                </div>

                                <button
                                    onClick={() => kol.childActivityId && onLihatDetail?.(kol.childActivityId)}
                                    disabled={!kol.childActivityId}
                                    className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-cyan-400 text-cyan-500 text-sm font-medium
                                        hover:bg-cyan-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors whitespace-nowrap self-center"
                                >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    Lihat Detail
                                </button>
                            </div>
                        ))}


                        {showForm && (
                            <div className="mt-5 border border-dashed border-cyan-300 rounded-xl p-4 space-y-3 bg-cyan-50/30">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">Pegawai</p>
                                        <PegawaiSelect
                                            value={form.pegawaiId}
                                            onChange={(id) => setForm((p) => ({ ...p, pegawaiId: id }))}
                                            pegawai={pegawai}
                                            loading={loadingPegawai}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-xs text-gray-500 font-medium">Kategori</p>
                                        <Select value={form.kategori} onValueChange={(v) => setForm((p) => ({ ...p, kategori: v }))}>
                                            <SelectTrigger className="bg-white border-gray-200 text-sm focus:ring-cyan-600 focus:border-cyan-600 focus:ring-1">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {KATEGORI_OPTIONS.map((opt) => (
                                                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-medium">Judul Tugas</p>
                                    <Input
                                        placeholder="Masukkan judul tugas"
                                        value={form.judul}
                                        onChange={(e) => setForm((p) => ({ ...p, judul: e.target.value }))}
                                        className="bg-white border-gray-200 text-sm focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <p className="text-xs text-gray-500 font-medium">Deskripsi</p>
                                    <Textarea
                                        placeholder="Masukkan deskripsi tugas"
                                        value={form.deskripsi}
                                        onChange={(e) => setForm((p) => ({ ...p, deskripsi: e.target.value }))}
                                        className="bg-white border-gray-200 text-sm resize-none focus-visible:ring-cyan-600 focus-visible:border-cyan-600 focus-visible:ring-1"
                                        rows={2}
                                    />
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button variant="outline" onClick={() => setShowForm(false)} className="text-sm border-gray-200">
                                        Batal
                                    </Button>
                                    <Button
                                        onClick={handleSubmit}
                                        disabled={isPending || !form.pegawaiId || !form.judul || !form.deskripsi}
                                        className="bg-cyan-500 hover:bg-cyan-600 text-white text-sm"
                                    >
                                        Simpan
                                    </Button>
                                </div>
                            </div>
                        )}

                        {!showForm && !isSelesai && (
                            <button
                                onClick={() => !isKonfirmasiKolaborasi && setShowForm(true)}
                                disabled={isKonfirmasiKolaborasi}
                                className={`mt-4 flex items-center gap-1.5 text-sm font-medium transition-colors ${isKonfirmasiKolaborasi
                                    ? "text-[#9D9D9D] cursor-not-allowed"
                                    : "text-cyan-500 hover:text-cyan-600"
                                    }`}
                            >
                                <Plus className="w-4 h-4" />
                                Tambah tugas dan kolaborator
                            </button>
                        )}
                    </div>
                )}
            </div>

            <DialogKonfirmasi
                open={konfirmasi}
                onOpenChange={setKonfirmasi}
                title="Tambah Kolaborator"
                description={`Tambahkan kolaborator dengan tugas "${form.judul.length > 50 ? form.judul.substring(0, 50) + "..." : form.judul}"? Kolaborator akan mendapat notifikasi.`}
                confirmLabel="Ya, tambahkan"
                onConfirm={() => mutate(form)}
            />

        </>
    )
}