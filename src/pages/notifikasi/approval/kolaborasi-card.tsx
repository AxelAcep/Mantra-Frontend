import { Check, X, Calendar } from "lucide-react";

interface KolaborasiCardProps {
    isPendingAction?: boolean;
    judul?: string;
    deskripsi?: string;
    pemberiTugas?: string;
    targetSelesai?: string;
    time: string;
    onApprove?: () => void;
    onReject?: () => void;
    onViewDetail?: () => void;
}

export function KolaborasiCard({
    isPendingAction = false,
    judul,
    deskripsi,
    pemberiTugas,
    targetSelesai,
    time,
    onApprove,
    onReject,
    onViewDetail
}: KolaborasiCardProps) {
    return (
        <div className={`flex items-center justify-between p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] border relative pl-8 overflow-hidden ${isPendingAction
            ? 'bg-[#F2FAFD] border-[#E0F2FE]/70'
            : 'bg-slate-50 border-slate-200'
            }`}>
            {/* Left vertical border indicator */}
            <div className={`absolute left-3 top-3 bottom-3 w-1.5 rounded-full ${isPendingAction ? 'bg-cyan-500' : 'bg-slate-300'}`} />

            <div className="flex-1 min-w-0 pr-4">
                <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide ${isPendingAction ? 'bg-cyan-100 text-cyan-600' : 'bg-slate-100 text-slate-500'}`}>
                        Ajakan Kolaborasi
                    </span>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed font-light">
                    <strong className="font-semibold text-slate-800">{judul}</strong>
                    {pemberiTugas && (
                        <>
                            <span className="text-slate-300 mx-2">|</span>
                            <span>Pemberi Tugas: <strong className="font-medium text-slate-700">{pemberiTugas}</strong></span>
                        </>
                    )}
                </p>
                {deskripsi && (
                    <p className="text-xs text-slate-400 mt-1 font-light italic truncate max-w-2xl">
                        "{deskripsi}"
                    </p>
                )}
                {targetSelesai && (
                    <div className="flex items-center gap-1 mt-2 text-[10px] text-slate-400">
                        <Calendar className="w-3 h-3 text-slate-300" />
                        <span>Deadline: {targetSelesai}</span>
                    </div>
                )}
            </div>

            {/* Right Side Info & Action */}
            <div className={`flex flex-col items-end shrink-0 ${isPendingAction ? 'justify-between h-full min-h-[52px]' : 'justify-center'}`}>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onViewDetail}
                        className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline bg-transparent border-none cursor-pointer"
                    >
                        Lihat Detail
                    </button>
                    <span className="text-slate-400 font-light text-[10px]">{time}</span>
                </div>
                {isPendingAction && (
                    <div className="flex items-center gap-2 mt-2">
                        {onApprove && (
                            <button
                                onClick={onApprove}
                                className="w-6 h-6 rounded-full border border-emerald-100 bg-emerald-50 text-emerald-500 flex items-center justify-center hover:bg-emerald-100 transition-colors cursor-pointer"
                                title="Terima Kolaborasi"
                            >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                        )}
                        {onReject && (
                            <button
                                onClick={onReject}
                                className="w-6 h-6 rounded-full border border-rose-100 bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-100 transition-colors cursor-pointer"
                                title="Tolak Kolaborasi"
                            >
                                <X className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
