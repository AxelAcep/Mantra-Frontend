import { useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { useChatThreads, useTotalUnreadChatCount, useReadAllChat } from "@/hooks/use-activity"
import { ChatList } from "./chat-list"
import { ChatWindow } from "./chat-window"
import { MessageSquare, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

const tabs = [
    { value: "chat", label: "Chat" },
]

export default function ChatPage() {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    const currentPegawaiId = user?.pegawai?.id || ""

    const [searchParams, setSearchParams] = useSearchParams()
    const activeTab = searchParams.get("tab") || "chat"
    const selectedThreadId = searchParams.get("id")

    const setActiveTab = (tab: string) => {
        const params = new URLSearchParams(searchParams)
        params.set("tab", tab)
        setSearchParams(params, { replace: true })
    }

    const setSelectedThreadId = (id: string | null) => {
        const params = new URLSearchParams(searchParams)
        if (id) {
            params.set("id", id)
        } else {
            params.delete("id")
        }
        setSearchParams(params, { replace: true })
    }

    const { data: threads = [], isLoading } = useChatThreads()
    const { data: totalUnread = 0 } = useTotalUnreadChatCount()
    const readAllMutation = useReadAllChat()

    const selectedThread = useMemo(() =>
        threads.find(t => t.id === selectedThreadId),
        [threads, selectedThreadId]
    )

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#FBFCFD]">
            <div className="flex flex-col h-full w-full">
                <div className="bg-slate-50 px-6 pt-4">
                    <div className="flex items-center justify-between border-b border-gray-200">
                        <div className="flex gap-6">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    onClick={() => setActiveTab(tab.value)}
                                    className={`py-3 text-sm whitespace-nowrap border-b-2 -mb-px transition-colors flex items-center gap-2
                                        ${activeTab === tab.value
                                            ? "border-cyan-500 text-cyan-500 font-medium"
                                            : "border-transparent text-gray-500 hover:text-gray-700"
                                        }`}
                                >
                                    {tab.label}
                                    {tab.value === "chat" && totalUnread > 0 && (
                                        <span className="bg-red-500 text-white text-[10px] font-bold rounded-full h-5 min-w-[20px] flex items-center justify-center px-1">
                                            {totalUnread}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            className="h-9 gap-2 mb-2 px-4 text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-700 transition-all rounded-lg bg-white"
                            onClick={() => readAllMutation.mutate()}
                            disabled={readAllMutation.isPending || totalUnread === 0}
                        >
                            <Check className="w-4 h-4 text-slate-400" />
                            <span className="text-xs font-medium">Tandai semua telah dibaca</span>
                        </Button>
                    </div>
                </div>

                <div className="flex-1 overflow-hidden">
                    {activeTab === "chat" && (
                        <div className="flex h-full w-full bg-[#F8F9FA] px-2 pb-4">
                            {/* Sidebar List (already has p-4 inside) */}
                            <ChatList
                                threads={threads}
                                selectedId={selectedThreadId || undefined}
                                onSelect={setSelectedThreadId}
                                isLoading={isLoading}
                            />

                            {/* Main Chat Area wrapped in Card */}
                            <div className="flex-1 h-full min-w-0 pr-4 pt-4 pb-4">
                                <div className="h-full w-full bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
                                    {selectedThread ? (
                                        <ChatWindow
                                            key={selectedThread.id}
                                            activityId={selectedThread.id}
                                            activityJudul={selectedThread.judul}
                                            terkaitPO={selectedThread.terkaitPO}
                                            perusahaan={selectedThread.perusahaan}
                                            currentPegawaiId={currentPegawaiId}
                                        />
                                    ) : (
                                        <div className="h-full flex flex-col items-center justify-center bg-[#FDFDFD] px-10 text-center">
                                            <div className="w-20 h-20 rounded-full bg-white shadow-sm flex items-center justify-center mb-6 border border-slate-50">
                                                <MessageSquare className="w-10 h-10 text-slate-200" />
                                            </div>
                                            <h2 className="text-2xl font-light text-slate-800 mb-2 tracking-tight">Pilih obrolan</h2>
                                            <p className="text-sm text-slate-400 max-w-sm font-light">
                                                Pilih salah satu aktivitas di samping untuk melihat riwayat percakapan dan mengirim pesan baru.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

