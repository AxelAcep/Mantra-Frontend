import { Check, X, BadgeCheck } from "lucide-react";

interface DailyActivityCardProps {
    isPendingAction?: boolean;
    isSupervised?: boolean;
    judulProyek?: string;
    deskripsi?: string;
    pembuat?: string;
    time: string;
    onApprove?: () => void;
    onReject?: () => void;
    onViewDetail?: () => void;
}

export function DailyActivityCard({
    isPendingAction = false,
    isSupervised = false,
    judulProyek,
    deskripsi,
    pembuat,
    time,
    onApprove,
    onReject,
    onViewDetail
}: DailyActivityCardProps) {
    return (
        <div className={`flex items-center justify-between p-4 rounded-xl shadow-[0_1px_3px_rgba(0,0,0,0.01)] transition-all hover:shadow-[0_2px_8px_rgba(0,0,0,0.03)] border relative pl-8 overflow-hidden ${isPendingAction
                ? 'bg-[#F2FAFD] border-[#E0F2FE]/70'
                : 'bg-slate-50 border-slate-200'
            }`}>
            {/* Left vertical border indicator */}
            <div className={`absolute left-3 top-3 bottom-3 w-1.5 rounded-full ${isPendingAction ? 'bg-cyan-500' : 'bg-slate-300'}`} />

            <div className="flex-1 min-w-0 pr-4">
                {isPendingAction ? (
                    <>
                        <div className="flex items-center gap-2 mb-2.5">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-cyan-100 text-cyan-600">
                                Daily Activity
                            </span>
                            {isSupervised && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">
                                    <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                    Terverifikasi
                                </span>
                            )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed font-light">
                            <strong className="font-semibold text-slate-800">{judulProyek}</strong>
                            <span className="text-slate-300 mx-2">|</span>
                            {deskripsi}
                        </p>
                    </>
                ) : (
                    <div className="flex items-center gap-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wide bg-slate-100 text-slate-500 shrink-0">
                            Daily Activity
                        </span>
                        {isSupervised && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-green-50 border border-green-200 text-green-600 text-[10px] font-bold uppercase tracking-wide whitespace-nowrap">
                                <BadgeCheck className="w-3.5 h-3.5 text-green-500 shrink-0" />
                                Terverifikasi
                            </span>
                        )}
                        <p className="text-xs text-slate-500 font-light">
                            <strong className="font-semibold text-slate-800">{judulProyek}</strong> oleh <strong className="font-semibold text-slate-800">{pembuat || deskripsi}</strong>
                        </p>
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
                                title="Setujui"
                            >
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                            </button>
                        )}
                        {onReject && (
                            <button
                                onClick={onReject}
                                className="w-6 h-6 rounded-full border border-rose-100 bg-rose-50 text-rose-400 flex items-center justify-center hover:bg-rose-100 transition-colors cursor-pointer"
                                title="Tolak"
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
