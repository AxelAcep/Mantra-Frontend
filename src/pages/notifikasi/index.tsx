import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useHeaderTitle } from "@/components/layout/layout";
import { useUnreadNotifikasiCount } from "@/hooks/use-notifikasi";
import { useTotalUnreadChatCount } from "@/hooks/use-activity";
import { useMasterReschedule, useMasterSelesai } from "@/hooks/use-master-activity";
import { useSupervisiActivityAktif } from "@/hooks/use-supervisi";
import { useActivityKonfirmasiKolaborasi } from "@/hooks/use-activity";
import { ApprovalTab } from "./approval";
import { AktivitasTab } from "./aktivitas";
import ChatPage from "./chat";
import { Badge } from "@/components/ui/badge";

export default function NotifikasiPage() {
    const { setTitle } = useHeaderTitle();
    const [searchParams, setSearchParams] = useSearchParams();

    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const role = user?.role;
    const isMaster = role === "MASTER";
    const isSupervisi = role === "SUPERVISI";

    // Default tab is 'approval'
    const defaultTab = "approval";
    const activeTab = searchParams.get("tab") || defaultTab;

    useEffect(() => {
        setTitle("Notifikasi");
    }, [setTitle]);

    // ── Badge Counts ──
    const { data: unreadNotifikasi = 0 } = useUnreadNotifikasiCount();
    const { data: totalUnreadChat = 0 } = useTotalUnreadChatCount();

    // Approvals counts (query if Master or Supervisi)
    const { data: rescheduleData } = useMasterReschedule(1, 1, "", isMaster);
    const { data: selesaiData } = useMasterSelesai(1, 1, "", "", "", isMaster);
    const { data: supervisiData } = useSupervisiActivityAktif(
        { page: 1, limit: 1, status: "KONFIRMASI_SELESAI", isSupervised: "false" },
        isSupervisi
    );
    const { data: kolaborasiData } = useActivityKonfirmasiKolaborasi();

    const approvalCount = isMaster
        ? (rescheduleData?.total ?? 0) + (selesaiData?.total ?? 0)
        : isSupervisi
        ? (supervisiData?.total ?? 0) + (kolaborasiData?.length ?? 0)
        : (kolaborasiData?.length ?? 0);

    const setActiveTab = (tab: string) => {
        const params = new URLSearchParams(searchParams);
        params.set("tab", tab);
        // Clear selected thread ID if shifting away from chat
        if (tab !== "chat") {
            params.delete("id");
        }
        setSearchParams(params, { replace: true });
    };

    // Get current date string formatted like "Hari ini, 24 Okt 2023"
    const getFormattedDate = () => {
        const d = new Date();
        const indonesianMonths = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
        return `Hari ini, ${d.getDate()} ${indonesianMonths[d.getMonth()]} ${d.getFullYear()}`;
    };

    const tabs = [
        { value: "approval", label: "Approval", badge: approvalCount },
        { value: "aktivitas", label: "Aktivitas", badge: unreadNotifikasi },
        { value: "chat", label: "Chat", badge: totalUnreadChat }
    ];

    return (
        <div className="flex flex-col h-[calc(100vh-64px)] w-full bg-[#FBFCFD] overflow-y-auto">
            {/* Header section consistent with design */}
            <div className="bg-slate-50 px-6 pt-3 border-b border-slate-100 shrink-0">
                {/* Tabs selection bar */}
                <div className="flex gap-6 border-b border-gray-200">
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
                            <span>{tab.label}</span>
                            {tab.badge > 0 && (
                                <Badge
                                    variant="destructive"
                                    className="rounded-full px-2 py-0.5 text-[10px] bg-red-100 text-red-600 border-none hover:bg-red-100 font-semibold"
                                >
                                    {tab.badge}
                                </Badge>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab content area */}
            <div className="flex-1 min-h-0 bg-[#FBFCFD]">
                {activeTab === "approval" && (
                    <ApprovalTab
                        role={role}
                        rescheduleCount={rescheduleData?.total ?? 0}
                        selesaiCount={selesaiData?.total ?? 0}
                        supervisiCount={supervisiData?.total ?? 0}
                        kolaborasiCount={kolaborasiData?.length ?? 0}
                    />
                )}

                {activeTab === "aktivitas" && (
                    <AktivitasTab />
                )}

                {activeTab === "chat" && (
                    <ChatPage hideHeader={true} />
                )}
            </div>
        </div>
    );
}
