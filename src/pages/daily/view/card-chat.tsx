import { useEffect, useRef, useState, useMemo } from "react"
import { createPortal } from "react-dom"
import { X, Send, Search, ChevronUp, ChevronDown, Info, Check, CheckCheck } from "lucide-react"
import { useChat, useKirimChat, useReadChat, useUpdateChat } from "@/hooks/use-activity"
import type { Chat } from "../../../services/activity.services"

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

type Props = {
    activityId: string
    activityJudul: string
    terkaitPO?: string
    open: boolean
    onClose: () => void
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
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-cyan-100 text-cyan-600",
    "bg-orange-100 text-orange-600",
    "bg-indigo-100 text-indigo-600",
]

function getAvatarColor(id: string) {
    const index = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0)
    return AVATAR_COLORS[index % AVATAR_COLORS.length]
}

export function ChatPanel({ activityId, activityJudul, terkaitPO, open, onClose, currentPegawaiId }: Props) {
    const [pesan, setPesan] = useState("")
    const [firstUnreadId, setFirstUnreadId] = useState<string | null>(null)
    const [editingChat, setEditingChat] = useState<Chat | null>(null)
    const [searchQuery, setSearchQuery] = useState("")
    const [currentSearchIndex, setCurrentSearchIndex] = useState(-1)
    const bottomRef = useRef<HTMLDivElement>(null)
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const messageRefs = useRef<Record<string, HTMLDivElement | null>>({})

    const { data: chats = [], isLoading } = useChat(activityId, open)
    const { mutate: kirim, isPending: isSending } = useKirimChat(activityId)
    const { mutate: update, isPending: isUpdating } = useUpdateChat(activityId)
    const { mutate: markRead } = useReadChat(activityId)

    const isPending = isSending || isUpdating

    const searchMatches = useMemo(() => {
        if (!searchQuery.trim()) return []
        return chats.filter(c => c.pesan.toLowerCase().includes(searchQuery.toLowerCase().trim()))
    }, [chats, searchQuery])

    useEffect(() => {
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto"
            textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
        }
    }, [pesan])

    useEffect(() => {
        if (searchMatches.length > 0 && currentSearchIndex >= 0) {
            const match = searchMatches[currentSearchIndex]
            messageRefs.current[match.id]?.scrollIntoView({ behavior: "smooth", block: "center" })
        }
    }, [currentSearchIndex, searchMatches])

    useEffect(() => {
        if (open && !isLoading && chats.length > 0 && !firstUnreadId) {
            const first = chats.find(c => c.pegawaiId !== currentPegawaiId && !c.readBy.includes(currentPegawaiId))
            if (first) setFirstUnreadId(first.id)
        }
    }, [chats, isLoading, open, currentPegawaiId, firstUnreadId])

    useEffect(() => {
        if (!open) {
            setFirstUnreadId(null)
            setSearchQuery("")
            setEditingChat(null)
        }
    }, [activityId, open])

    // Auto scroll ke bawah
    useEffect(() => {
        if (open) {
            setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
        }
    }, [chats, open])

    useEffect(() => {
        if (open) {
            markRead(undefined)
        }
    }, [open, chats.length, markRead])

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
        <>
            {/* Overlay */}
            {open && createPortal(
                <div
                    className="fixed inset-0 m-0 bg-black/40 z-[100]"
                    onClick={onClose}
                />,
                document.body
            )}

            {/* Panel */}
            {createPortal(
                <div className={`fixed top-0 right-0 h-full w-[420px] max-w-full bg-white shadow-2xl z-[110] flex flex-col transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
                    {/* Header */}
                    <div className="px-5 py-4 border-b border-gray-100 flex items-start justify-between shrink-0">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="text-sm font-bold text-gray-900">{activityJudul}</h3>
                            </div>
                            {terkaitPO && (
                                <p className="text-xs text-slate-400 mt-0.5">{terkaitPO}</p>
                            )}
                        </div>
                        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 mt-0.5">
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Search */}
                    <div className="px-5 py-2 border-b border-gray-100 shrink-0 bg-slate-50/30">
                        <div className="relative flex items-center bg-white rounded-lg border border-gray-200 focus-within:border-cyan-400 transition-all px-3 py-1.5">
                            <Search className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <input
                                type="text"
                                placeholder="Cari percakapan..."
                                className="w-full text-xs bg-transparent border-none focus:ring-0 outline-none px-2 text-gray-700 placeholder:text-slate-400"
                                value={searchQuery}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                            {searchQuery && (
                                <div className="flex items-center gap-1 border-l border-slate-100 ml-1 pl-1 shrink-0">
                                    <span className="text-[9px] text-slate-400 px-1">
                                        {searchMatches.length > 0 ? currentSearchIndex + 1 : 0}/{searchMatches.length}
                                    </span>
                                    <button onClick={prevSearchResult} className="p-0.5 hover:bg-slate-100 rounded text-slate-400">
                                        <ChevronUp className="w-3 h-3" />
                                    </button>
                                    <button onClick={nextSearchResult} className="p-0.5 hover:bg-slate-100 rounded text-slate-400">
                                        <ChevronDown className="w-3 h-3" />
                                    </button>
                                    <button onClick={() => handleSearch("")} className="p-0.5 hover:bg-slate-100 rounded text-slate-400">
                                        <X className="w-3 h-3" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
                        {isLoading && (
                            <p className="text-center text-sm text-slate-400 mt-8">Memuat percakapan...</p>
                        )}

                        {!isLoading && chats.length === 0 && (
                            <p className="text-center text-sm text-slate-400 mt-8">Belum ada percakapan.</p>
                        )}

                        {Object.entries(grouped).map(([date, items]) => (
                            <div key={date}>
                                {/* Date separator */}
                                <div className="flex items-center gap-2 my-3">
                                    <div className="flex-1 h-px bg-gray-100" />
                                    <span className="text-xs text-slate-400 font-medium px-2">{date}</span>
                                    <div className="flex-1 h-px bg-gray-100" />
                                </div>

                                <div className="space-y-3">
                                    {items.map((chat) => {
                                        const isMe = chat.pegawaiId === currentPegawaiId
                                        const avatarColor = getAvatarColor(chat.pegawaiId)
                                        const isNotification = chat.pesan.startsWith("[SYSTEM_NOTIFICATION]:")
                                        const isEditable = isMe && (new Date().getTime() - new Date(chat.createdAt).getTime() < 3600000)
                                        const isHighlighted = searchMatches.some(m => m.id === chat.id) && currentSearchIndex !== -1 && searchMatches[currentSearchIndex].id === chat.id
                                        const isFirstUnread = chat.id === firstUnreadId

                                        return (
                                            <div key={chat.id} className="flex flex-col gap-3">
                                                {isFirstUnread && (
                                                    <div className="flex justify-center items-center gap-3 my-2">
                                                        <div className="h-px bg-red-100 flex-1" />
                                                        <span className="bg-red-500 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm">Pesan baru</span>
                                                        <div className="h-px bg-red-100 flex-1" />
                                                    </div>
                                                )}
                                                <div
                                                    ref={(el) => { messageRefs.current[chat.id] = el }}
                                                    className={`flex items-start gap-2 ${isMe ? "flex-row-reverse" : "flex-row"} min-w-0 transition-all ${isHighlighted ? "ring-2 ring-orange-200 ring-offset-4 rounded-lg bg-orange-50/30" : ""}`}
                                                >
                                                    {/* Avatar */}
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 shadow-sm ${avatarColor}`}>
                                                        {getInitials(chat.pegawai.nama)}
                                                    </div>

                                                    <div className={`max-w-[75%] flex flex-col gap-0.5 ${isMe ? "items-end" : "items-start"} min-w-0`}>
                                                        {!isMe && (
                                                            <div className="flex items-center gap-1.5 mb-0.5 px-1">
                                                                <span className="text-xs font-semibold text-gray-700">{chat.pegawai.nama}</span>
                                                                <span className="text-[10px] text-slate-400 font-normal">{chat.pegawai.divisi}</span>
                                                            </div>
                                                        )}
                                                        <div className={`px-3 py-2 rounded-2xl text-[13px] leading-relaxed break-all whitespace-pre-wrap shadow-sm ${isMe
                                                            ? "bg-cyan-500 text-white rounded-tr-none"
                                                            : "bg-white text-gray-800 border border-slate-100 rounded-tl-none"
                                                            }`}>
                                                            {isNotification ? (
                                                                <div className="flex flex-col gap-1">
                                                                    <div className="flex items-center gap-1.5 border-b border-slate-100 pb-1 mb-1">
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                                                                        <span className="text-[11px] font-bold text-slate-900">Sistem</span>
                                                                    </div>
                                                                    <div className="text-[12px] text-slate-600 font-medium">
                                                                        {chat.pesan.replace("[SYSTEM_NOTIFICATION]:", "").split("**").map((p, i) => i % 2 === 1 ? <span key={i} className="font-bold text-slate-900">{p}</span> : p)}
                                                                    </div>
                                                                </div>
                                                            ) : (
                                                                <HighlightText text={chat.pesan} query={searchQuery} />
                                                            )}
                                                        </div>
                                                        <div className={`flex items-center gap-2 px-1 ${isMe ? "flex-row-reverse" : ""}`}>
                                                            <div className="flex items-center gap-1">
                                                                <span className="text-[10px] text-slate-400">{formatTime(chat.createdAt)}</span>
                                                                {isMe && (
                                                                    <div className="flex items-center">
                                                                        {chat.readBy && chat.readBy.filter(id => id !== chat.pegawaiId).length > 0 ? (
                                                                            <CheckCheck className="w-3 h-3 text-cyan-600" />
                                                                        ) : (
                                                                            <Check className="w-3 h-3 text-slate-300" />
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            {isEditable && !isNotification && (
                                                                <button
                                                                    onClick={() => handleEdit(chat)}
                                                                    className="text-[10px] text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        ))}
                        <div ref={bottomRef} />
                    </div>

                    {/* Input */}
                    <div className="px-4 py-3 border-t border-gray-100 shrink-0 bg-white shadow-[0_-4px_12px_rgba(0,0,0,0.03)] relative z-10">
                        {editingChat && (
                            <div className="flex items-center justify-between bg-cyan-50 px-3 py-2 rounded-xl border border-cyan-100 mb-3 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-2">
                                    <Info className="w-4 h-4 text-cyan-500" />
                                    <span className="text-[11px] text-cyan-700 font-medium">Mengubah pesan...</span>
                                </div>
                                <button onClick={handleCancelEdit} className="text-[11px] text-cyan-600 hover:text-cyan-700 font-bold px-2 py-1 rounded-md hover:bg-cyan-100 transition-colors">
                                    BATAL
                                </button>
                            </div>
                        )}
                        <div className="flex items-end gap-2.5">
                            <textarea
                                ref={textareaRef}
                                value={pesan}
                                onChange={(e) => setPesan(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder={editingChat ? "Ubah pesan..." : "Ketik pesan..."}
                                rows={1}
                                className="flex-1 resize-none bg-slate-50 border border-gray-200 rounded-2xl px-4 py-2.5 text-sm text-gray-700 focus:outline-none focus:border-cyan-400 focus:bg-white transition-all overflow-y-auto"
                                style={{ minHeight: "44px", maxHeight: "200px" }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!pesan.trim() || isPending}
                                className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-all ${pesan.trim() && !isPending ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/20 hover:bg-cyan-600 hover:scale-105 active:scale-95" : "bg-slate-100 text-slate-300"}`}
                            >
                                <Send className="w-4.5 h-4.5" />
                            </button>
                        </div>
                        <p className="text-[10px] text-slate-400 mt-2 ml-1 italic font-light">Enter untuk kirim, Shift+Enter untuk baris baru</p>
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}