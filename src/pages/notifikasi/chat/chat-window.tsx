import { useEffect, useRef, useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { Send, Info, Search, ChevronUp, ChevronDown, X, Check, CheckCheck } from "lucide-react"
import { useChat, useKirimChat, useReadChat, useUpdateChat } from "@/hooks/use-activity"
import type { Chat } from "@/services/activity.services"

type Props = {
    activityId: string
    activityJudul: string
    terkaitPO?: string
    perusahaan?: string
    currentPegawaiId: string
}

function getInitials(nama: string) {
    return nama.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
}

function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

function groupByDate(chats: Chat[]) {
    const groups: Record<string, Chat[]> = {}
    chats.forEach((chat) => {
        const date = new Date(chat.createdAt)
        const today = new Date()
        const yesterday = new Date()
        yesterday.setDate(today.getDate() - 1)

        let key = date.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })
        if (date.toDateString() === today.toDateString()) key = "Hari Ini"
        else if (date.toDateString() === yesterday.toDateString()) key = "Kemarin"

        if (!groups[key]) groups[key] = []
        groups[key].push(chat)
    })
    return groups
}

const AVATAR_COLORS = [
    "bg-red-50 text-red-600",
    "bg-blue-50 text-blue-600",
    "bg-green-50 text-green-600",
    "bg-purple-50 text-purple-600",
    "bg-orange-50 text-orange-600",
    "bg-cyan-50 text-cyan-600",
]

function getAvatarColor(id: string) {
    const index = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

function HighlightText({ text, query }: { text: string; query: string }) {
    if (!query) return <>{text}</>
    const parts = text.split(new RegExp(`(${query})`, "gi"))
    return (
        <>
            {parts.map((part, i) =>
                part.toLowerCase() === query.toLowerCase() ? (
                    <mark key={i} className="bg-yellow-200 text-slate-900 rounded-px px-0.5">
                        {part}
                    </mark>
                ) : (
                    part
                )
            )}
        </>
    )
}

export function ChatWindow({ activityId, activityJudul, terkaitPO, perusahaan, currentPegawaiId }: Props) {
    const [pesan, setPesan] = useState("")
    const [firstUnreadId, setFirstUnreadId] = useState<string | null>(null)
    const [editingChat, setEditingChat] = useState<Chat | null>(null)
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState("")
    const [currentSearchIndex, setCurrentSearchIndex] = useState(-1)
    const bottomRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const messageRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const { data: chats = [], isLoading } = useChat(activityId, true)
    const { mutate: kirim, isPending: isSending } = useKirimChat(activityId)
    const { mutate: update, isPending: isUpdating } = useUpdateChat(activityId)
    const { mutate: markRead } = useReadChat(activityId)

    const isPending = isSending || isUpdating

    const searchMatches = useMemo(() => {
        if (!searchQuery.trim()) return []
        return chats.filter(c => c.pesan.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    }, [chats, searchQuery])

    useEffect(() => {
        if (searchMatches.length > 0 && currentSearchIndex >= 0) {
            const match = searchMatches[currentSearchIndex]
            messageRefs.current[match.id]?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }, [currentSearchIndex, searchMatches])

    // Mencari pesan pertama yang belum dibaca saat buka chat
    useEffect(() => {
        if (!isLoading && chats.length > 0 && !firstUnreadId) {
            const first = chats.find(c => c.pegawaiId !== currentPegawaiId && !c.readBy.includes(currentPegawaiId))
            if (first) setFirstUnreadId(first.id)
        }
    }, [chats, isLoading, currentPegawaiId, firstUnreadId])

    // Reset unread marker saat ganti activity
    useEffect(() => {
        setFirstUnreadId(null)
    }, [activityId])

    const handleSearch = (q: string) => {
        setSearchQuery(q)
        setCurrentSearchIndex(q ? 0 : -1)
    }

    const nextSearchResult = () => {
        if (searchMatches.length === 0) return
        setCurrentSearchIndex((prev) => (prev + 1) % searchMatches.length)
    }

    const prevSearchResult = () => {
        if (searchMatches.length === 0) return
        setCurrentSearchIndex((prev) => (prev - 1 + searchMatches.length) % searchMatches.length)
    }

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
        }
    }, [pesan])

    // Auto scroll ke bawah saat chats berubah
    useEffect(() => {
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
    }, [chats, activityId])

    // Mark as read saat activityId berubah atau ada pesan baru masuk
    useEffect(() => {
        if (activityId) {
            markRead()
        }
    }, [activityId, chats.length, markRead])

    function handleSend() {
        if (!pesan.trim() || isPending) return

        if (editingChat) {
            update({ chatId: editingChat.id, pesan: pesan.trim() }, {
                onSuccess: () => {
                    handleCancelEdit()
                }
            })
        } else {
            kirim(pesan.trim(), {
                onSuccess: () => {
                    setPesan("")
                    if (textareaRef.current) textareaRef.current.style.height = "auto"
                },
            })
        }
    }

    function handleEdit(chat: Chat) {
        setEditingChat(chat)
        setPesan(chat.pesan)
        textareaRef.current?.focus()
    }

    function handleCancelEdit() {
        setEditingChat(null)
        setPesan("")
        if (textareaRef.current) textareaRef.current.style.height = "auto"
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        } else if (e.key === "Escape" && editingChat) {
            handleCancelEdit()
        }
    }

    const grouped = groupByDate(chats)

    return (
        <div className="flex-1 flex flex-col h-full bg-[#FBFCFD] relative overflow-hidden">
            {/* Header */}
            <header className="h-[88px] px-8 bg-white border-b border-slate-100 flex items-center justify-between shrink-0 z-10 gap-4">
                <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                    <div className="flex items-center gap-3">
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate" title={activityJudul}>
                            {activityJudul}
                        </h2>
                        <button
                            onClick={() => navigate(`/dailyactivity/${activityId}`)}
                            className="text-[13px] font-medium text-cyan-500 hover:text-cyan-600 transition-colors shrink-0"
                        >
                            Lihat Detail
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-[12px] text-slate-400 font-normal truncate">
                        {perusahaan && <span className="truncate">{perusahaan}</span>}
                        {perusahaan && terkaitPO && <span className="w-1 h-1 rounded-full bg-slate-200 shrink-0" />}
                        {terkaitPO && <span className="truncate">{terkaitPO}</span>}
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="relative group">
                        <div className="flex items-center bg-[#F3F6F8] rounded-xl px-3 py-2 border border-transparent focus-within:border-slate-200 focus-within:bg-white transition-all w-[300px]">
                            <Search className="w-4 h-4 text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Cari percakapan..."
                                className="bg-transparent border-none focus:ring-0 outline-none text-sm px-2 w-full placeholder:text-slate-400 font-light"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {searchQuery && (
                                <div className="flex items-center gap-1 border-l border-slate-200 ml-1 pl-1">
                                    <span className="text-[10px] text-slate-400 px-1">
                                        {searchMatches.length > 0 ? currentSearchIndex + 1 : 0}/{searchMatches.length}
                                    </span>
                                    <button onClick={prevSearchResult} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                                        <ChevronUp className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={nextSearchResult} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                                        <ChevronDown className="w-3.5 h-3.5" />
                                    </button>
                                    <button onClick={() => handleSearch("")} className="p-1 hover:bg-slate-100 rounded text-slate-400 transition-colors">
                                        <X className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-8 py-8 space-y-8 custom-scrollbar bg-[#FBFCFD]">
                {isLoading && (
                    <div className="flex justify-center mt-10">
                        <div className="animate-pulse bg-white px-4 py-2 rounded-full shadow-sm border border-slate-100">
                            <span className="text-xs text-slate-400">Memuat percakapan...</span>
                        </div>
                    </div>
                )}

                {!isLoading && chats.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full opacity-50">
                        <div className="bg-white p-4 rounded-3xl shadow-sm mb-4">
                            <Send className="w-8 h-8 text-cyan-500/50" />
                        </div>
                        <p className="text-sm text-slate-400">Belum ada pesan. Mulai obrolan!</p>
                    </div>
                )}

                {Object.entries(grouped).map(([date, items]) => (
                    <div key={date} className="space-y-6">
                        <div className="flex justify-center my-8">
                            <span className="px-3 py-1 rounded-md bg-[#F1F3F5] text-[11px] text-slate-500 font-medium tracking-tight">
                                {date}
                            </span>
                        </div>

                        {items.map((chat) => {
                            const isSystem = !chat.pegawaiId || (chat.pegawai.nama === "System")
                            const isNotification = chat.pesan.startsWith("[SYSTEM_NOTIFICATION]:")
                            const isMe = chat.pegawaiId === currentPegawaiId
                            const isEditable = isMe && (new Date().getTime() - new Date(chat.createdAt).getTime() < 3600000)
                            const avatarColor = getAvatarColor(chat.pegawaiId || "system")
                            const isHighlighted = searchMatches.some(m => m.id === chat.id) && currentSearchIndex !== -1 && searchMatches[currentSearchIndex].id === chat.id
                            const isFirstUnread = chat.id === firstUnreadId

                            if (isNotification) {
                                const content = chat.pesan.replace("[SYSTEM_NOTIFICATION]:", "")
                                const parts = content.split("**")

                                return (
                                    <div key={chat.id} className="flex flex-col gap-4 my-6">
                                        {isFirstUnread && (
                                            <div className="flex justify-center items-center gap-4 mb-2">
                                                <div className="h-px bg-red-100 flex-1" />
                                                <span className="bg-red-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">Pesan baru</span>
                                                <div className="h-px bg-red-100 flex-1" />
                                            </div>
                                        )}
                                        <div className="flex justify-center">
                                            <div className="bg-white/80 backdrop-blur-sm shadow-sm border border-slate-100 rounded-full px-5 py-2 flex items-center gap-2.5">
                                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                <span className="text-[12px] text-slate-500 font-medium tracking-tight">
                                                    <span className="font-bold text-slate-900">{chat.pegawai.nama}</span>{" "}
                                                    {parts.map((p, i) => i % 2 === 1 ? <span key={i} className="font-bold text-slate-800">{p}</span> : p)}
                                                </span>
                                                <span className="text-[10px] text-slate-300 ml-1 font-normal tracking-tighter">{formatTime(chat.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            if (isSystem) {
                                return (
                                    <div key={chat.id} className="flex flex-col gap-4 my-4">
                                        {isFirstUnread && (
                                            <div className="flex justify-center items-center gap-4">
                                                <div className="h-px bg-red-100 flex-1" />
                                                <span className="bg-red-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">Pesan baru</span>
                                                <div className="h-px bg-red-100 flex-1" />
                                            </div>
                                        )}
                                        <div className="flex justify-center">
                                            <div className="bg-[#F1F3F5] rounded-full px-4 py-1.5 flex items-center gap-2 border border-slate-100/50">
                                                <span className="text-[11px] text-slate-500 font-medium">{chat.pesan}</span>
                                                <span className="w-[1px] h-3 bg-slate-300 mx-1" />
                                                <span className="text-[10px] text-slate-400">{formatTime(chat.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }

                            return (
                                <div key={chat.id} className="flex flex-col gap-6">
                                    {isFirstUnread && (
                                        <div className="flex justify-center items-center gap-4 my-2">
                                            <div className="h-px bg-red-100 flex-1" />
                                            <span className="bg-red-500 text-white text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-tighter shadow-sm">Pesan baru</span>
                                            <div className="h-px bg-red-100 flex-1" />
                                        </div>
                                    )}
                                    <div
                                        ref={(el) => { messageRefs.current[chat.id] = el }}
                                        className={`flex items-start gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
                                    >
                                        {/* Avatar */}
                                        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm transition-all ${avatarColor} ${isHighlighted ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}>
                                            {getInitials(chat.pegawai.nama)}
                                        </div>

                                        {/* Content Area */}
                                        <div className={`flex flex-col gap-1.5 max-w-[75%] min-w-0 ${isMe ? "items-end" : "items-start"}`}>
                                            {/* Header: Name, Role, Time */}
                                            <div className={`flex items-center gap-2 px-1 ${isMe ? "flex-row-reverse" : "flex-row"}`}>
                                                <div className={`flex items-center gap-1.5 ${isMe ? "flex-row-reverse" : ""}`}>
                                                    <span className="text-[13px] font-bold text-slate-800">{isMe ? "Anda" : chat.pegawai.nama}</span>
                                                    <span className="text-[11px] text-slate-400 font-normal">
                                                        {chat.pegawai.divisi}
                                                    </span>
                                                </div>
                                                <div className={`flex items-center gap-2 ${isMe ? "flex-row-reverse" : ""}`}>
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-[11px] text-slate-400">
                                                            {formatTime(chat.createdAt)}
                                                        </span>
                                                        {isMe && (
                                                            <div className="flex items-center">
                                                                {chat.readBy && chat.readBy.filter(id => id !== chat.pegawaiId).length > 0 ? (
                                                                    <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
                                                                ) : (
                                                                    <Check className="w-3.5 h-3.5 text-slate-400" />
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {isEditable && (
                                                        <button
                                                            onClick={() => handleEdit(chat)}
                                                            className="text-[11px] text-cyan-500 hover:text-cyan-600 font-medium ml-1"
                                                        >
                                                            Edit Pesan
                                                        </button>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Bubble */}
                                            <div className={`px-4 py-3 rounded-2xl text-[13px] leading-relaxed shadow-sm transition-all ${isMe
                                                ? "bg-[#E3F2FD] text-slate-700 rounded-tr-none"
                                                : "bg-[#F1F3F5] text-slate-700 rounded-tl-none"
                                                } ${isHighlighted ? "ring-2 ring-orange-400 ring-opacity-50 scale-[1.02]" : ""}`}>
                                                <div className="whitespace-pre-wrap break-all">
                                                    <HighlightText text={chat.pesan} query={searchQuery} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ))}
                <div ref={bottomRef} className="h-4" />
            </div>

            {/* Input Area */}
            <div className="p-6 bg-white border-t border-slate-100 shrink-0">
                <div className="max-w-5xl mx-auto flex flex-col gap-3">
                    {editingChat && (
                        <div className="flex items-center justify-between bg-cyan-50 px-4 py-2 rounded-lg border border-cyan-100">
                            <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-cyan-500" />
                                <span className="text-[12px] text-cyan-700 font-medium">Mengubah pesan...</span>
                            </div>
                            <button onClick={handleCancelEdit} className="text-[11px] text-cyan-600 hover:text-cyan-700 font-bold flex items-center gap-1">
                                <X className="w-3 h-3" /> BATAL
                            </button>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <div className="flex-1 bg-white rounded-xl border border-slate-200 focus-within:border-cyan-500 focus-within:ring-2 focus-within:ring-cyan-500/5 transition-all px-4 py-2">
                            <textarea
                                ref={textareaRef}
                                value={pesan}
                                onChange={(e) => setPesan(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={editingChat ? "Ubah pesan..." : "Tulis pesan..."}
                                rows={1}
                                className="w-full resize-none bg-transparent border-none focus:ring-0 outline-none text-[14px] text-slate-700 placeholder:text-slate-400 min-h-[44px] max-h-[150px] py-2.5 leading-relaxed"
                            />
                        </div>
                        <button
                            onClick={handleSend}
                            disabled={!pesan.trim() || isPending}
                            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 shadow-md ${pesan.trim() && !isPending ? "bg-cyan-500 text-white hover:bg-cyan-600 hover:scale-105 active:scale-95" : "bg-slate-100 text-slate-300"}`}
                        >
                            <Send className={`w-5 h-5 ${pesan.trim() && !isPending ? "translate-x-0.5" : ""}`} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
