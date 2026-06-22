import { useState, useEffect } from "react";
import {
    useNotifikasiList,
    useReadNotifikasi,
    useUnreadNotifikasiCount
} from "@/hooks/use-notifikasi";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CardAktivitas } from "./card-aktivitas";

const getPaginationRange = (current: number, total: number) => {
    const range: (number | string)[] = [];
    if (total <= 7) {
        for (let i = 1; i <= total; i++) {
            range.push(i);
        }
        return range;
    }

    range.push(1);

    const leftSibling = Math.max(current - 1, 2);
    const rightSibling = Math.min(current + 1, total - 1);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < total - 1;

    if (showLeftEllipsis) {
        range.push("...");
    }

    for (let i = leftSibling; i <= rightSibling; i++) {
        range.push(i);
    }

    if (showRightEllipsis) {
        range.push("...");
    }

    range.push(total);
    return range;
};

export function AktivitasTab() {
    const [page, setPage] = useState(1);
    const [selectedFilter, setSelectedFilter] = useState("daily-activity");

    // Fetch unread count for dropdown items
    const { data: dailyActivityUnread = 0 } = useUnreadNotifikasiCount("daily-activity");
    const { data: penawaranUnread = 0 } = useUnreadNotifikasiCount("penawaran");

    // Pass the selectedFilter to backend for server-side filtering
    const { data: response, isLoading, isError } = useNotifikasiList(page, 10, selectedFilter);
    const readNotifMutation = useReadNotifikasi();
    const navigate = useNavigate();

    const notifikasi = response?.data ?? [];
    const meta = response?.meta ?? { total: 0, totalPages: 1 };

    const handleRead = (id: string, activityId?: string) => {
        readNotifMutation.mutate(id);
        if (activityId) {
            navigate(`/dailyactivity/${activityId}`);
        }
    };

    const isToday = (dateStr: string) => {
        if (!dateStr) return false;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return false;
        return d.toDateString() === new Date().toDateString();
    };

    // Reset page to 1 when the filter changes
    useEffect(() => {
        setPage(1);
    }, [selectedFilter]);

    const todayNotifications = notifikasi.filter(item => isToday(item.createdAt));
    const olderNotifications = notifikasi.filter(item => !isToday(item.createdAt));

    return (
        <div className="flex flex-col gap-4 p-6 bg-[#FBFCFD] min-h-[calc(100vh-140px)]">
            {/* Row 2: Filter */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Tampilkan</span>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                    <SelectTrigger className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg h-9 px-3 focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm hover:border-slate-300 transition-colors w-[220px]">
                        <SelectValue placeholder="Pilih Kategori" />
                    </SelectTrigger>
                    <SelectContent className="bg-white" position="popper">
                        <SelectItem value="daily-activity" className="cursor-pointer">
                            <div className="flex items-center justify-between w-full gap-2">
                                <span>Daily Activity</span>
                                {dailyActivityUnread > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="rounded-full px-2 py-0.5 text-[10px] bg-red-100 text-red-600 border-none hover:bg-red-100 font-semibold"
                                    >
                                        {dailyActivityUnread}
                                    </Badge>
                                )}
                            </div>
                        </SelectItem>
                        <SelectItem value="penawaran" className="cursor-pointer">
                            <div className="flex items-center justify-between w-full gap-2">
                                <span>Penawaran</span>
                                {penawaranUnread > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="rounded-full px-2 py-0.5 text-[10px] bg-red-100 text-red-600 border-none hover:bg-red-100 font-semibold"
                                    >
                                        {penawaranUnread}
                                    </Badge>
                                )}
                            </div>
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* List Contents */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-100 rounded-2xl shadow-sm">
                    <div className="text-sm text-slate-400 font-light">Memuat notifikasi...</div>
                </div>
            ) : isError ? (
                <div className="text-center py-12 text-red-500 text-sm bg-white rounded-xl border border-slate-100 shadow-sm">
                    Gagal memuat notifikasi. Silakan coba lagi.
                </div>
            ) : notifikasi.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-sm bg-white rounded-xl border border-slate-100 shadow-sm">
                    Tidak ada notifikasi baru untuk Anda.
                </div>
            ) : (
                <div className="space-y-6">
                    {/* HARI INI */}
                    {todayNotifications.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari Ini</h3>
                                <button
                                    onClick={() => navigate("/dailyactivity?tab=aktif&page=1&status=OVERDUE")}
                                    className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline bg-transparent border-none cursor-pointer"
                                >
                                    Lihat Selengkapnya
                                </button>
                            </div>
                            {todayNotifications.map((item) => (
                                <CardAktivitas
                                    key={item.id}
                                    item={item}
                                    onRead={() => handleRead(item.id, item.activityId)}
                                />
                            ))}
                        </div>
                    )}

                    {/* KEMARIN & SEBELUMNYA */}
                    {olderNotifications.length > 0 && (
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kemarin & Sebelumnya</h3>
                                {todayNotifications.length === 0 && (
                                    <button
                                        onClick={() => navigate("/dailyactivity?tab=aktif&page=1&status=OVERDUE")}
                                        className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline bg-transparent border-none cursor-pointer"
                                    >
                                        Lihat Selengkapnya
                                    </button>
                                )}
                            </div>
                            {olderNotifications.map((item) => (
                                <CardAktivitas
                                    key={item.id}
                                    item={item}
                                    onRead={() => handleRead(item.id, item.activityId)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {!isLoading && !isError && meta.totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <span className="text-xs text-slate-400 font-light">
                        Menampilkan {(page - 1) * 10 + 1}-{Math.min(page * 10, meta.total)} dari {meta.total} notifikasi
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            className="p-2 w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        {getPaginationRange(page, meta.totalPages).map((p, index) => {
                            if (p === "...") {
                                return (
                                    <span key={`ellipsis-${index}`} className="px-2 text-xs font-semibold text-slate-400 self-center">
                                        ...
                                    </span>
                                );
                            }
                            return (
                                <button
                                    key={`page-${p}`}
                                    onClick={() => setPage(p as number)}
                                    className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${page === p
                                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
                                        : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                                        }`}
                                >
                                    {p}
                                </button>
                            );
                        })}
                        <Button
                            disabled={page === meta.totalPages}
                            onClick={() => setPage(prev => Math.min(prev + 1, meta.totalPages))}
                            className="p-2 w-8 h-8 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
