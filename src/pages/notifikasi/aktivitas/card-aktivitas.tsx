import { cn, getTimeAgo } from "@/lib/utils";
import { type NotifikasiItem } from "@/services/notifikasi.services";

const KATEGORI_LABEL: Record<string, string> = {
    QUOTATION: "Quotation",
    DOKUMENTASI: "Dokumentasi",
    REPORT_PROJECT: "Report Project",
    DRAWING: "Drawing",
    KURVA_S: "Kurva S",
    MS_PROJECT: "MS Project",
    MONITOR_PROGRESS: "Monitor Progress",
    MONITOR_PROJECT: "Monitor Project",
    BILL_OF_QUANTITY: "Bill of Quantity",
    AKOMODASI_PROJECT: "Akomodasi Project",
    KOORDINASI_EKSTERNAL: "Koordinasi Eksternal",
    DOKUMEN_PENDUKUNG: "Dokumen Pendukung",
    WORK_ORDER: "Work Order",
    APPROVAL_USER: "Approval User",
    TECHNICAL_ADVICE: "Technical Advice",
    LAIN_LAIN: "Lain-Lain",
};

function FieldBox({ label, value }: { label: string; value: string }) {
    return (
        <div className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 min-w-0">
            <p className="text-xs text-gray-400 mb-1">{label}</p>
            <p className="text-sm font-semibold text-gray-850 truncate" title={value}>{value}</p>
        </div>
    );
}

interface CardAktivitasProps {
    item: NotifikasiItem;
    onRead: () => void;
}

export function CardAktivitas({ item, onRead }: CardAktivitasProps) {
    const checkIsOverdue = () => {
        if (!item.activity) return false;
        const isPast = new Date(item.activity.targetSelesai) < new Date();
        const notCompleted = item.activity.status === "ON_PROGRESS";
        return isPast && notCompleted;
    };

    const isOverdue = checkIsOverdue();
    const isUnread = !item.isRead || isOverdue;

    const formatDeadline = (iso?: string, overdue?: boolean) => {
        if (!iso) return "-";
        const d = new Date(iso);
        if (isNaN(d.getTime())) return iso;

        const indonesianMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateStr = "";
        if (d.toDateString() === today.toDateString()) {
            dateStr = "Hari ini";
        } else if (d.toDateString() === yesterday.toDateString()) {
            dateStr = "Kemarin";
        } else {
            dateStr = `${d.getDate()} ${indonesianMonths[d.getMonth()]} ${d.getFullYear()}`;
        }

        const timeStr = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")} WIB`;
        const overdueLabel = overdue ? " (Overdue)" : "";
        return `${dateStr}, ${timeStr}${overdueLabel}`;
    };

    return (
        <div
            className={cn(
                "p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] border relative pl-8 overflow-hidden transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] bg-white",
                isUnread ? "bg-[#F2FAFD] border-[#E0F2FE]/70" : "border-slate-200"
            )}
        >
            {/* Left border indicator */}
            <div className={cn(
                "absolute left-3 top-3 bottom-3 w-1.5 rounded-full",
                isUnread ? "bg-cyan-500" : "bg-slate-350"
            )} />

            <div>
                {/* Header Row */}
                <div className="flex items-center justify-between">
                    <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide",
                        isUnread ? "bg-cyan-100 text-cyan-600" : "bg-slate-100 text-slate-500"
                    )}>
                        Daily Activity
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={onRead}
                            className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline bg-transparent border-none cursor-pointer"
                        >
                            Lihat Detail
                        </button>
                        <span className="text-slate-400 font-light text-[10px]">
                            {getTimeAgo(item.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Expanded Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-100">
                    {/* Nama / Divisi */}
                    <FieldBox
                        label="Nama / Divisi"
                        value={
                            item.activity?.parent?.pegawai
                                ? `${item.activity.parent.pegawai.nama} / ${item.activity.parent.pegawai.divisi}`
                                : item.activity?.pegawai
                                    ? `${item.activity.pegawai.nama} / ${item.activity.pegawai.divisi}`
                                    : "-"
                        }
                    />

                    {/* Judul */}
                    <FieldBox label="Judul" value={item.activity?.judul || item.judul} />

                    {/* Kategori */}
                    <FieldBox
                        label="Kategori"
                        value={KATEGORI_LABEL[item.activity?.kategori || ""] || item.activity?.kategori || "-"}
                    />

                    {/* Deadline */}
                    <div className="bg-slate-50 border border-gray-200 rounded-lg px-3 py-2 min-w-0">
                        <p className="text-xs text-gray-400 mb-1">Deadline</p>
                        <span className={cn(
                            "text-sm font-semibold block truncate",
                            isOverdue ? "text-red-500 font-bold" : "text-gray-800"
                        )}>
                            {formatDeadline(item.activity?.targetSelesai, isOverdue)}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
