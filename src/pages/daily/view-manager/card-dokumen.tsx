import { useRef, useState } from "react"
import { Icons } from "@/assets"
import { ChevronDown, ChevronUp, FileText, Trash2, Download, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { type StatusActivity } from "../../../services/master-activity.services"

type Dokumen = {
    id: string
    namaFile: string
    path: string
    uploadedBy: string
    pegawai: { id: string; nama: string }
    createdAt: string
}

type Props = {
    dokumen: Dokumen[]
    status: StatusActivity
    onUpload: (file: File) => void
    onDelete: (id: string) => void
    isUploading?: boolean
    deletingId?: string | null
    currentPegawaiId: string
}

const LOCKED_STATUSES: StatusActivity[] = ["DITERIMA", "DIBATALKAN", "PENDING"]

function formatDate(iso: string) {
    const d = new Date(iso)
    return (
        d.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) +
        ", " +
        d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
    )
}

export function DokumenCard({
    dokumen,
    status,
    onUpload,
    onDelete,
    isUploading = false,
    deletingId = null,
    currentPegawaiId,
}: Props) {
    const [open, setOpen] = useState(true)
    const [deleteTarget, setDeleteTarget] = useState<Dokumen | null>(null)  // ← NEW
    const inputRef = useRef<HTMLInputElement>(null)

    const isLocked = LOCKED_STATUSES.includes(status)

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0]
        if (file) onUpload(file)
        e.target.value = ""
    }

    function handleConfirmDelete() {
        if (!deleteTarget) return
        onDelete(deleteTarget.id)
        setDeleteTarget(null)
    }

    return (
        <>
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <button
                    onClick={() => setOpen(o => !o)}
                    className="w-full flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
                >
                    <div className="text-left">
                        <h3 className="text-base font-bold text-gray-900">Dokumen</h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            File pendukung yang dilampirkan pada aktivitas ini.
                        </p>
                    </div>
                    {open
                        ? <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                        : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                    }
                </button>

                {open && (
                    <div className="px-6 pb-6 border-t border-gray-100 space-y-3">
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <img src={Icons.File} className="w-5 h-5 object-contain" alt="icon-file" /> Lampiran
                            </p>

                            {isLocked ? (
                                <span className="text-xs text-slate-400 italic">
                                    Aktivitas selesai, file terkunci
                                </span>
                            ) : isUploading ? (
                                <span className="flex items-center gap-1 text-sm text-cyan-500">
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                    Mengunggah...
                                </span>
                            ) : (
                                <label className="text-sm text-cyan-500 hover:text-cyan-600 font-medium cursor-pointer">
                                    + Upload File
                                    <input
                                        ref={inputRef}
                                        type="file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg"
                                        disabled={isLocked || isUploading}
                                    />
                                </label>
                            )}
                        </div>

                        {dokumen.length === 0 && (
                            <p className="text-sm text-slate-400">Belum ada dokumen.</p>
                        )}

                        {dokumen.map((doc) => {
                            const isDeleting = deletingId === doc.id
                            const fileUrl = doc.path.startsWith("http")
                                ? doc.path
                                : `${import.meta.env.VITE_API_URL}${doc.path}`

                            return (
                                <div
                                    key={doc.id}
                                    className="flex items-center justify-between bg-slate-50 border border-gray-200 rounded-lg px-4 py-3"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-cyan-500 shrink-0" />
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">{doc.namaFile}</p>
                                            <p className="text-xs text-gray-400">
                                                Diunggah oleh {doc.pegawai.nama} • {formatDate(doc.createdAt)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <a
                                            href={fileUrl}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-cyan-500 hover:bg-slate-200/60 p-2 rounded-lg transition-colors"
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </a>

                                        {!isLocked && currentPegawaiId === doc.uploadedBy && (
                                            <button
                                                onClick={() => setDeleteTarget(doc)}  // ← buka dialog
                                                disabled={isDeleting}
                                                className="text-red-500 hover:bg-slate-200/60 p-2 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                                                title="Hapus"
                                            >
                                                {isDeleting
                                                    ? <Loader2 className="w-4 h-4 animate-spin" />
                                                    : <Trash2 className="w-4 h-4" />
                                                }
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* ── Dialog Konfirmasi Hapus ── */}
            <Dialog
                open={!!deleteTarget}
                onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}
            >
                <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl p-6 gap-0">
                    <DialogHeader className="mb-3">
                        <DialogTitle className="text-lg font-bold text-gray-900">
                            Hapus Dokumen
                        </DialogTitle>
                    </DialogHeader>

                    <p className="text-sm text-gray-600 mb-1">
                        Apakah Anda yakin ingin menghapus file ini?
                    </p>
                    <p className="text-sm font-semibold text-gray-800 mb-6 truncate">
                        📄 {deleteTarget?.namaFile}
                    </p>

                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setDeleteTarget(null)}
                            className="border-gray-200 text-gray-600 font-semibold"
                        >
                            Batal
                        </Button>
                        <Button
                            onClick={handleConfirmDelete}
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                        >
                            Ya, hapus
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
}
