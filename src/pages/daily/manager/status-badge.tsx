// Shared status badge — pakai di semua table

type StatusKey = "ON_PROGRESS" | "PENDING" | "DITERIMA" | "DITOLAK" | "OVERDUE" | "MENUNGGU_KONFIRMASI" | "KONFIRMASI_SELESAI" | "PENDING_PEGAWAI"

const STATUS_CONFIG: Record<StatusKey, { style: string; label: string }> = {
    ON_PROGRESS: { style: "bg-orange-100 text-orange-700", label: "On Progress" },
    PENDING: { style: "bg-amber-100  text-amber-700", label: "Reschedule" },
    PENDING_PEGAWAI: { style: "bg-amber-100  text-amber-700", label: "Pending Pegawai" },
    DITERIMA: { style: "bg-emerald-100 text-emerald-700", label: "Diterima" },
    DITOLAK: { style: "bg-red-100    text-red-700", label: "Ditolak" },
    OVERDUE: { style: "bg-red-100    text-red-700", label: "Overdue" },
    MENUNGGU_KONFIRMASI: { style: "bg-amber-100  text-amber-700", label: "Menunggu Konfirmasi" },
    KONFIRMASI_SELESAI: { style: "bg-amber-100  text-amber-700", label: "Menunggu Konfirmasi" },
}

type Props = {
    status: StatusKey | string
}

export function StatusBadge({ status }: Props) {
    const config = STATUS_CONFIG[status as StatusKey] ?? {
        style: "bg-gray-100 text-gray-600",
        label: status,
    }

    return (
        <span
            className={`inline-flex items-center px-2.5 py-1 rounded-full
                        text-xs font-medium border border-transparent
                        ${config.style}`}
        >
            {config.label}
        </span>
    )
}
