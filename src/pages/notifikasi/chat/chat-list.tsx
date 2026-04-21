import type { ChatThread } from "@/services/activity.services"
import ChatThreadItem from "./chat-thread-item"
import { Search } from "lucide-react"
import { useState, useMemo } from "react"

type Props = {
    threads: ChatThread[]
    selectedId?: string
    onSelect: (id: string) => void
    isLoading: boolean
}

export function ChatList({ threads, selectedId, onSelect, isLoading }: Props) {
    const [search, setSearch] = useState("")

    const filtered = threads.filter(t =>
        t.judul.toLowerCase().includes(search.toLowerCase()) ||
        t.pegawai.nama.toLowerCase().includes(search.toLowerCase()) ||
        t.perusahaan?.toLowerCase().includes(search.toLowerCase())
    )

    const unreadTotal = useMemo(() =>
        threads.reduce((acc, t) => acc + (t.unreadCount > 0 ? 1 : 0), 0),
        [threads]
    )

    return (
        <div className="w-[420px] h-full  border-slate-200 flex flex-col bg-[#F8F9FA] p-4 overflow-hidden">
            {/* Main Card Container */}
            <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

                {/* Header Area Inside Card */}
                <div className="p-5 pb-3 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-slate-800 tracking-tight">Daftar Chat</h2>
                        {unreadTotal > 0 && (
                            <span className="bg-cyan-50 text-cyan-500 font-bold px-2.5 py-1 text-[11px] rounded-lg">
                                {unreadTotal} baru
                            </span>
                        )}
                    </div>

                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Cari nama, proyek, atau perusahaan"
                            className="w-full bg-[#F3F6F8] border-none rounded-xl py-2.5 pl-10 pr-4 text-sm focus:ring-2 focus:ring-cyan-500/10 outline-none placeholder:text-slate-400 transition-all font-light"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="border-b border-slate-100 -mx-5 px-5">
                        <div className="flex gap-6">
                            <button
                                className="py-3 text-[13px] whitespace-nowrap border-b-2 border-cyan-600 text-cyan-600 font-bold transition-colors flex items-center gap-2 -mb-px"
                            >
                                Daily Activity
                                {unreadTotal > 0 && (
                                    <span className="bg-red-500 text-white text-[10px] font-bold rounded-full h-4.5 min-w-[18px] flex items-center justify-center px-1 shadow-sm">
                                        {unreadTotal}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* List Area Inside Card */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {isLoading && (
                        <div className="p-8 text-center">
                            <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-2" />
                            <p className="text-xs text-slate-400 font-medium">Memuat pesan...</p>
                        </div>
                    )}

                    {!isLoading && filtered.length === 0 && (
                        <div className="p-8 text-center text-slate-400">
                            <p className="text-xs font-medium">
                                {search ? "Pencarian tidak ditemukan." : "Belum ada percakapan."}
                            </p>
                        </div>
                    )}

                    {!isLoading && filtered.map((thread) => (
                        <ChatThreadItem
                            key={thread.id}
                            thread={thread}
                            isSelected={selectedId === thread.id}
                            onClick={() => onSelect(thread.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}
