import type { ChatThread } from "@/services/activity.services"

type Props = {
    thread: ChatThread
    isSelected: boolean
    onClick: () => void
}

export function ChatThreadItem({ thread, isSelected, onClick }: Props) {
    const lastMsgTime = new Date(thread.lastMessage.createdAt)
    const isToday = new Date().toDateString() === lastMsgTime.toDateString()

    const lastMessageText = (thread.lastMessage.pesan.startsWith("[SYSTEM_NOTIFICATION]:"))
        ? `${thread.lastMessage.pegawai.nama} ${thread.lastMessage.pesan.replace("[SYSTEM_NOTIFICATION]:", "").replace(/\*\*/g, "")}`
        : thread.lastMessage.pesan

    const displayTime = isToday
        ? lastMsgTime.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
        : lastMsgTime.toLocaleDateString("id-ID", { weekday: "short" })

    return (
        <div
            onClick={onClick}
            className={`flex flex-col gap-1.5 px-5 py-4 cursor-pointer transition-all border-b border-slate-50 last:border-none relative ${isSelected ? "bg-cyan-50/40" : "hover:bg-slate-50/50"}`}
        >
            {/* Header info */}
            <div className="flex items-center justify-between">
                <span className={`text-[13px] font-bold truncate flex-1 pr-2 ${isSelected ? "text-cyan-700" : "text-slate-800"}`}>
                    {thread.judul || "-"}
                </span>
                <span className="text-[11px] text-slate-400 shrink-0">
                    {displayTime}
                </span>
            </div>

            {/* Sub-info: Perusahaan & PO */}
            <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                {(!thread.perusahaan && !thread.terkaitPO) ? (
                    <span>-</span>
                ) : (
                    <>
                        {thread.perusahaan && <span className="truncate max-w-[150px]">{thread.perusahaan}</span>}
                        {thread.perusahaan && thread.terkaitPO && <div className="w-1 h-1 rounded-full bg-slate-200" />}
                        {thread.terkaitPO && <span className="truncate">{thread.terkaitPO}</span>}
                    </>
                )}
            </div>

            {/* Body */}
            <div className="flex items-start justify-between gap-4 mt-0.5">
                <p className={`text-[12px] line-clamp-2 flex-1 leading-relaxed break-all ${thread.unreadCount > 0 ? "text-slate-700 font-medium" : "text-slate-500 font-light"}`}>
                    {lastMessageText}
                </p>

                {thread.unreadCount > 0 && (
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-1 shadow-sm border border-red-50">
                        <span className="text-[10px] font-bold text-red-500">{thread.unreadCount}</span>
                    </div>
                )}
            </div>

            {/* Selection indicator */}
            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-cyan-500" />}
        </div>
    )
}

export default ChatThreadItem;
