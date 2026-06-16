import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { RescheduleCard } from "./reschedule-card";
import { DailyActivityCard } from "./daily-activity-card";
import { KonfirmasiProyekCard } from "./konfirmasi-proyek-card";
import { KolaborasiCard } from "./kolaborasi-card";
import { SlidersHorizontal, Check, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    useMasterReschedule,
    useMasterSelesai,
    useKonfirmasiReschedule,
    useKonfirmasiSelesai
} from "@/hooks/use-master-activity";
import {
    useSupervisiActivityAktif,
    useMarkSupervised
} from "@/hooks/use-supervisi";
import {
    useActivityKonfirmasiKolaborasi,
    useKonfirmasiKolaborasi
} from "@/hooks/use-activity";
import { ConfirmTerimaModal, TolakModal } from "@/pages/daily/manager/card-confirm-modal";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { NilaiKPISelector } from "@/pages/daily/view-manager/action-button";
import { type NilaiKPI } from "@/services/kpi.services";
import { getTimeAgo, cn } from "@/lib/utils";

interface ApprovalTabProps {
    role?: string;
    rescheduleCount?: number;
    selesaiCount?: number;
    supervisiCount?: number;
    kolaborasiCount?: number;
}

const konfirmasiProyekData: any[] = [];

function formatDate(iso: string) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    const months = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function isToday(dateStr: string) {
    if (!dateStr) return false;
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return false;
    return d.toDateString() === new Date().toDateString();
}

export function ApprovalTab({
    role,
    rescheduleCount = 0,
    selesaiCount = 0,
    supervisiCount = 0,
    kolaborasiCount = 0
}: ApprovalTabProps) {
    const isMaster = role === "MASTER";
    const isSupervisi = role === "SUPERVISI";
    const isPegawai = !isMaster && !isSupervisi;
    const [selectedFilter, setSelectedFilter] = useState(
        isMaster ? "reschedule" : isSupervisi ? "daily-activity" : "kolaborasi"
    );
    const [currentPage, setCurrentPage] = useState(1);
    const navigate = useNavigate();

    // Modal state
    const [terimaRescheduleId, setTerimaRescheduleId] = useState<string | null>(null);
    const [tolakRescheduleId, setTolakRescheduleId] = useState<string | null>(null);
    const [terimaSelesaiId, setTerimaSelesaiId] = useState<string | null>(null);
    const [tolakSelesaiId, setTolakSelesaiId] = useState<string | null>(null);
    const [verifySupervisiId, setVerifySupervisiId] = useState<string | null>(null);
    const [terimaKolaborasiId, setTerimaKolaborasiId] = useState<string | null>(null);
    const [tolakKolaborasiId, setTolakKolaborasiId] = useState<string | null>(null);

    // Queries
    const { data: realReschedule, isLoading: rescheduleLoading } = useMasterReschedule(
        currentPage,
        7,
        "",
        isMaster && selectedFilter === "reschedule"
    );

    const { data: realSelesai, isLoading: selesaiLoading } = useMasterSelesai(
        currentPage,
        7,
        "",
        "",
        "",
        isMaster && selectedFilter === "daily-activity"
    );

    const { data: supervisiSelesai, isLoading: supervisiLoading } = useSupervisiActivityAktif(
        {
            page: currentPage,
            limit: 7,
            status: "KONFIRMASI_SELESAI"
        },
        isSupervisi && selectedFilter === "daily-activity"
    );

    const { data: kolaborasiList, isLoading: kolaborasiLoading } = useActivityKonfirmasiKolaborasi();

    // Mutations
    const konfirmasiReschedule = useKonfirmasiReschedule();
    const konfirmasiSelesai = useKonfirmasiSelesai();
    const markSupervised = useMarkSupervised();
    const konfirmasiKolaborasi = useKonfirmasiKolaborasi();

    useEffect(() => {
        if (isSupervisi && selectedFilter !== "daily-activity") {
            setSelectedFilter("daily-activity");
        } else if (isPegawai && selectedFilter !== "kolaborasi") {
            setSelectedFilter("kolaborasi");
        }
    }, [role, isSupervisi, isPegawai]);

    useEffect(() => {
        setCurrentPage(1);
    }, [selectedFilter]);

    // Reschedule Handlers
    const handleConfirmReschedule = () => {
        if (!terimaRescheduleId) return;
        konfirmasiReschedule.mutate(
            { rescheduleId: terimaRescheduleId, status: "DITERIMA" },
            { onSuccess: () => setTerimaRescheduleId(null) }
        );
    };

    const handleTolakReschedule = (alasan: string) => {
        if (!tolakRescheduleId) return;
        konfirmasiReschedule.mutate(
            { rescheduleId: tolakRescheduleId, status: "DITOLAK", alasan },
            { onSuccess: () => setTolakRescheduleId(null) }
        );
    };

    // Selesai Handlers (Manager)
    const handleConfirmSelesai = (nilai: NilaiKPI) => {
        if (!terimaSelesaiId) return;
        konfirmasiSelesai.mutate(
            { activityId: terimaSelesaiId, status: "DITERIMA", nilaiKPI: nilai },
            { onSuccess: () => setTerimaSelesaiId(null) }
        );
    };

    const handleTolakSelesai = (alasan: string) => {
        if (!tolakSelesaiId) return;
        konfirmasiSelesai.mutate(
            { activityId: tolakSelesaiId, status: "DITOLAK", alasan },
            { onSuccess: () => setTolakSelesaiId(null) }
        );
    };

    // Supervisi Verifikasi Handler
    const handleConfirmSupervisi = () => {
        if (!verifySupervisiId) return;
        markSupervised.mutate(verifySupervisiId, {
            onSuccess: () => setVerifySupervisiId(null)
        });
    };

    // Kolaborasi Handlers
    const handleConfirmKolaborasi = () => {
        if (!terimaKolaborasiId) return;
        konfirmasiKolaborasi.mutate(
            { id: terimaKolaborasiId, payload: { status: "DITERIMA" } },
            { onSuccess: () => setTerimaKolaborasiId(null) }
        );
    };

    const handleTolakKolaborasi = () => {
        if (!tolakKolaborasiId) return;
        konfirmasiKolaborasi.mutate(
            { id: tolakKolaborasiId, payload: { status: "DITOLAK" } },
            { onSuccess: () => setTolakKolaborasiId(null) }
        );
    };

    // Pagination helper variables
    let totalItems = 0;
    let totalPages = 0;
    let isLoading = false;

    if (selectedFilter === "reschedule") {
        totalItems = realReschedule?.total ?? 0;
        totalPages = realReschedule?.totalPages ?? 0;
        isLoading = rescheduleLoading;
    } else if (selectedFilter === "daily-activity") {
        if (isMaster) {
            totalItems = realSelesai?.total ?? 0;
            totalPages = realSelesai?.totalPages ?? 0;
            isLoading = selesaiLoading;
        } else if (isSupervisi) {
            totalItems = supervisiSelesai?.total ?? 0;
            totalPages = supervisiSelesai?.totalPages ?? 0;
            isLoading = supervisiLoading;
        }
    } else if (selectedFilter === "konfirmasi-proyek") {
        totalItems = konfirmasiProyekData.length;
        totalPages = Math.ceil(totalItems / 7);
    } else if (selectedFilter === "kolaborasi") {
        totalItems = kolaborasiList?.length ?? 0;
        totalPages = Math.ceil(totalItems / 7);
        isLoading = kolaborasiLoading;
    }

    const indexOfLastItem = currentPage * 7;
    const indexOfFirstItem = (currentPage - 1) * 7;

    return (
        <div className="flex flex-col gap-4 p-6 bg-[#FBFCFD] min-h-[calc(100vh-140px)]">
            {/* Top Toolbar containing Dropdown, Filter, and Mark All Read */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider whitespace-nowrap">Tampilkan</span>
                    {isMaster ? (
                        <Select
                            value={selectedFilter}
                            onValueChange={(value) => setSelectedFilter(value)}
                        >
                            <SelectTrigger className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg h-9 px-3 focus:ring-2 focus:ring-cyan-500 cursor-pointer shadow-sm hover:border-slate-300 transition-colors w-[220px]">
                                <SelectValue placeholder="Pilih Kategori" />
                            </SelectTrigger>
                            <SelectContent className="bg-white" position="popper">
                                <SelectItem value="reschedule" className="cursor-pointer">
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <span>Reschedule</span>
                                        {rescheduleCount > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="rounded-full px-2 py-0.5 text-[10px] bg-red-100 text-red-600 border-none hover:bg-red-100 font-semibold"
                                            >
                                                {rescheduleCount}
                                            </Badge>
                                        )}
                                    </div>
                                </SelectItem>
                                <SelectItem value="daily-activity" className="cursor-pointer">
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <span>Daily Activity</span>
                                        {selesaiCount > 0 && (
                                            <Badge
                                                variant="destructive"
                                                className="rounded-full px-2 py-0.5 text-[10px] bg-red-100 text-red-600 border-none hover:bg-red-100 font-semibold"
                                            >
                                                {selesaiCount}
                                            </Badge>
                                        )}
                                    </div>
                                </SelectItem>
                                <SelectItem value="konfirmasi-proyek" className="cursor-pointer">
                                    <div className="flex items-center justify-between w-full gap-2">
                                        <span>Konfirmasi Proyek</span>
                                    </div>
                                </SelectItem>
                            </SelectContent>
                        </Select>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 rounded-lg text-xs font-semibold uppercase tracking-wider border border-cyan-200/50 flex items-center gap-2">
                                <span>{isSupervisi ? "Daily Activity" : "Kolaborasi"}</span>
                                {(isSupervisi ? supervisiCount : kolaborasiCount) > 0 && (
                                    <Badge
                                        variant="destructive"
                                        className="rounded-full px-2 py-0.5 text-[10px] bg-red-100 text-red-600 border-none hover:bg-red-100 font-semibold"
                                    >
                                        {isSupervisi ? supervisiCount : kolaborasiCount}
                                    </Badge>
                                )}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* CARD LISTINGS BY CATEGORY */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white border border-slate-100 rounded-2xl">
                    <div className="text-sm text-slate-400 font-light">Memuat data...</div>
                </div>
            ) : (
                <>
                    {selectedFilter === "reschedule" && (() => {
                        const items = realReschedule?.data ?? [];
                        const rescheduleToday = items.filter(item => isToday(item.createdAt));
                        const rescheduleOlder = items.filter(item => !isToday(item.createdAt));

                        if (items.length === 0) {
                            return (
                                <div className="text-center py-12 text-slate-400 font-light text-sm bg-white rounded-xl border border-slate-100">
                                    Tidak ada pengajuan reschedule.
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-6">
                                {/* HARI INI */}
                                {rescheduleToday.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari Ini</h3>
                                            <button
                                                onClick={() => navigate("/dailyactivity?tab=reschedule&page=1")}
                                                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline bg-transparent border-none cursor-pointer"
                                            >
                                                Lihat Selengkapnya
                                            </button>
                                        </div>
                                        {rescheduleToday.map((item) => (
                                            <RescheduleCard
                                                key={item.id}
                                                isPendingAction={item.status === "PENDING"}
                                                jadwalBaru={formatDate(item.targetSelesaiBaru)}
                                                jadwalLama={formatDate(item.activity?.targetSelesai)}
                                                alasan={item.alasan}
                                                time={getTimeAgo(item.createdAt)}
                                                onApprove={() => setTerimaRescheduleId(item.id)}
                                                onReject={() => setTolakRescheduleId(item.id)}
                                                onViewDetail={() => navigate(`/dailyactivity/${item.activityId}`)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* KEMARIN & SEBELUMNYA */}
                                {rescheduleOlder.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kemarin & Sebelumnya</h3>
                                            {rescheduleToday.length === 0 && (
                                                <button
                                                    onClick={() => navigate("/dailyactivity?tab=reschedule&page=1")}
                                                    className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline bg-transparent border-none cursor-pointer"
                                                >
                                                    Lihat Selengkapnya
                                                </button>
                                            )}
                                        </div>
                                        {rescheduleOlder.map((item) => (
                                            <RescheduleCard
                                                key={item.id}
                                                isPendingAction={item.status === "PENDING"}
                                                jadwalBaru={formatDate(item.targetSelesaiBaru)}
                                                jadwalLama={formatDate(item.activity?.targetSelesai)}
                                                alasan={item.alasan}
                                                time={getTimeAgo(item.createdAt)}
                                                onApprove={() => setTerimaRescheduleId(item.id)}
                                                onReject={() => setTolakRescheduleId(item.id)}
                                                onViewDetail={() => navigate(`/dailyactivity/${item.activityId}`)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {selectedFilter === "daily-activity" && (() => {
                        const items = isMaster ? (realSelesai?.data ?? []) : (supervisiSelesai?.data ?? []);
                        const dailyToday = items.filter(item => isToday(item.waktuSubmit));
                        const dailyOlder = items.filter(item => !isToday(item.waktuSubmit));

                        if (items.length === 0) {
                            return (
                                <div className="text-center py-12 text-slate-400 font-light text-sm bg-white rounded-xl border border-slate-100">
                                    Tidak ada aktivitas menunggu konfirmasi selesai.
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-6">
                                {/* HARI INI */}
                                {dailyToday.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari Ini</h3>
                                            <button
                                                onClick={() => navigate(isMaster ? "/dailyactivity?tab=selesai&page=1" : "/dailyactivity/supervisi")}
                                                className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline bg-transparent border-none cursor-pointer"
                                            >
                                                Lihat Selengkapnya
                                            </button>
                                        </div>
                                        {dailyToday.map((item) => (
                                            <DailyActivityCard
                                                key={item.id}
                                                isPendingAction={isMaster ? item.status === "KONFIRMASI_SELESAI" : !item.isSupervised}
                                                isSupervised={item.isSupervised}
                                                judulProyek={item.judul}
                                                deskripsi={`| ${item.pegawai?.nama || "Karyawan"} menandai proyek telah selesai 100%. Menunggu approval Anda.`}
                                                pembuat={`${item.pegawai?.nama || "Karyawan"} / ${item.pegawai?.divisi || ""}`}
                                                time={getTimeAgo(item.waktuSubmit)}
                                                onApprove={isMaster ? () => setTerimaSelesaiId(item.id) : () => setVerifySupervisiId(item.id)}
                                                onReject={isMaster ? () => setTolakSelesaiId(item.id) : undefined}
                                                onViewDetail={() => navigate(isMaster ? `/dailyactivity/${item.id}` : `/dailyactivity/supervisi/${item.id}`)}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* KEMARIN & SEBELUMNYA */}
                                {dailyOlder.length > 0 && (
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kemarin & Sebelumnya</h3>
                                            {dailyToday.length === 0 && (
                                                <button
                                                    onClick={() => navigate(isMaster ? "/dailyactivity?tab=selesai&page=1" : "/dailyactivity/supervisi")}
                                                    className="text-xs font-semibold text-cyan-600 hover:text-cyan-700 hover:underline bg-transparent border-none cursor-pointer"
                                                >
                                                    Lihat Selengkapnya
                                                </button>
                                            )}
                                        </div>
                                        {dailyOlder.map((item) => (
                                            <DailyActivityCard
                                                key={item.id}
                                                isPendingAction={isMaster ? item.status === "KONFIRMASI_SELESAI" : !item.isSupervised}
                                                isSupervised={item.isSupervised}
                                                judulProyek={item.judul}
                                                deskripsi={`| ${item.pegawai?.nama || "Karyawan"} menandai proyek telah selesai 100%. Menunggu approval Anda.`}
                                                pembuat={`${item.pegawai?.nama || "Karyawan"} / ${item.pegawai?.divisi || ""}`}
                                                time={getTimeAgo(item.waktuSubmit)}
                                                onApprove={isMaster ? () => setTerimaSelesaiId(item.id) : () => setVerifySupervisiId(item.id)}
                                                onReject={isMaster ? () => setTolakSelesaiId(item.id) : undefined}
                                                onViewDetail={() => navigate(isMaster ? `/dailyactivity/${item.id}` : `/dailyactivity/supervisi/${item.id}`)}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {selectedFilter === "konfirmasi-proyek" && (() => {
                        const allProyekItems = konfirmasiProyekData;
                        const proyekToday = allProyekItems.slice(indexOfFirstItem, indexOfLastItem).filter(item => item.isToday);
                        const proyekOlder = allProyekItems.slice(indexOfFirstItem, indexOfLastItem).filter(item => !item.isToday);

                        if (allProyekItems.length === 0) {
                            return (
                                <div className="text-center py-12 text-slate-400 font-light text-sm bg-white rounded-xl border border-slate-100">
                                    Tidak ada konfirmasi proyek.
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-6">
                                {/* HARI INI */}
                                {proyekToday.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hari Ini</h3>
                                        {proyekToday.map((item) => (
                                            <KonfirmasiProyekCard
                                                key={item.id}
                                                isPendingAction={item.isPendingAction}
                                                noRef={item.noRef}
                                                jenisPenawaran={item.jenisPenawaran}
                                                perusahaan={item.perusahaan}
                                                tanggalBAST={item.tanggalBAST}
                                                time={item.time}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* KEMARIN & SEBELUMNYA */}
                                {proyekOlder.length > 0 && (
                                    <div className="space-y-3">
                                        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Kemarin & Sebelumnya</h3>
                                        {proyekOlder.map((item) => (
                                            <KonfirmasiProyekCard
                                                key={item.id}
                                                isPendingAction={item.isPendingAction}
                                                noRef={item.noRef}
                                                jenisPenawaran={item.jenisPenawaran}
                                                perusahaan={item.perusahaan}
                                                tanggalBAST={item.tanggalBAST}
                                                time={item.time}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })()}

                    {selectedFilter === "kolaborasi" && (() => {
                        const items = kolaborasiList ?? [];
                        const slicedItems = items.slice(indexOfFirstItem, indexOfLastItem);

                        if (items.length === 0) {
                            return (
                                <div className="text-center py-12 text-slate-400 font-light text-sm bg-white rounded-xl border border-slate-100">
                                    Tidak ada ajakan kolaborasi.
                                </div>
                            );
                        }

                        return (
                            <div className="space-y-3">
                                {slicedItems.map((item) => (
                                    <KolaborasiCard
                                        key={item.id}
                                        isPendingAction={true}
                                        judul={item.judul}
                                        deskripsi={item.deskripsi}
                                        pemberiTugas={item.parent?.pegawai?.nama}
                                        targetSelesai={formatDate(item.targetSelesai)}
                                        time={getTimeAgo(item.createdAt)}
                                        onApprove={() => setTerimaKolaborasiId(item.id)}
                                        onReject={() => setTolakKolaborasiId(item.id)}
                                        onViewDetail={() => navigate(`/dailyactivity/${item.id}`)}
                                    />
                                ))}
                            </div>
                        );
                    })()}
                </>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-slate-100 pt-4 mt-2">
                    <span className="text-xs text-slate-400 font-light">
                        Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} dari {totalItems} data
                    </span>
                    <div className="flex items-center gap-1">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${currentPage === page
                                    ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/20'
                                    : 'border border-slate-200 bg-white hover:bg-slate-50 text-slate-600'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}
                        <button
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            className="p-2 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed transition-colors"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Modal Dialogs */}
            <ConfirmTerimaModal
                open={!!terimaRescheduleId}
                onClose={() => setTerimaRescheduleId(null)}
                onConfirm={handleConfirmReschedule}
                isPending={konfirmasiReschedule.isPending}
                title="Setujui Reschedule"
                message="Apakah Anda yakin ingin menyetujui pengajuan reschedule ini?"
            />

            <TolakModal
                open={!!tolakRescheduleId}
                onClose={() => setTolakRescheduleId(null)}
                onConfirm={handleTolakReschedule}
                isPending={konfirmasiReschedule.isPending}
            />

            <ModalKonfirmasiSelesai
                open={!!terimaSelesaiId}
                isPending={konfirmasiSelesai.isPending}
                onConfirm={handleConfirmSelesai}
                onClose={() => setTerimaSelesaiId(null)}
            />

            <TolakModal
                open={!!tolakSelesaiId}
                onClose={() => setTolakSelesaiId(null)}
                onConfirm={handleTolakSelesai}
                isPending={konfirmasiSelesai.isPending}
            />

            <ConfirmTerimaModal
                open={!!verifySupervisiId}
                onClose={() => setVerifySupervisiId(null)}
                onConfirm={handleConfirmSupervisi}
                isPending={markSupervised.isPending}
                title="Verifikasi Daily Activity"
                message="Apakah Anda yakin ingin memverifikasi (supervisi) daily activity ini?"
            />

            {/* Kolaborasi Modals */}
            <ConfirmTerimaModal
                open={!!terimaKolaborasiId}
                onClose={() => setTerimaKolaborasiId(null)}
                onConfirm={handleConfirmKolaborasi}
                isPending={konfirmasiKolaborasi.isPending}
                title="Terima Tugas Kolaborasi"
                message="Apakah kamu yakin ingin menerima tugas kolaborasi ini? Dengan menerima, tugas ini akan masuk ke daftar tugas aktif kamu."
            />

            <ConfirmTerimaModal
                open={!!tolakKolaborasiId}
                onClose={() => setTolakKolaborasiId(null)}
                onConfirm={handleTolakKolaborasi}
                isPending={konfirmasiKolaborasi.isPending}
                title="Tolak Tugas Kolaborasi"
                message="Apakah kamu yakin ingin menolak tugas kolaborasi ini? Tugas akan dibatalkan."
            />
        </div>
    );
}

// ─── Modal Terima Konfirmasi Selesai (dengan KPI) ───
interface ModalKonfirmasiSelesaiProps {
    open: boolean;
    isPending: boolean;
    onConfirm: (nilai: NilaiKPI) => void;
    onClose: () => void;
}

function ModalKonfirmasiSelesai({
    open,
    isPending,
    onConfirm,
    onClose,
}: ModalKonfirmasiSelesaiProps) {
    const [nilai, setNilai] = useState<NilaiKPI | null>(null);

    useEffect(() => {
        if (!open) {
            setNilai(null);
        }
    }, [open]);

    function handleClose() {
        if (isPending) return;
        setNilai(null);
        onClose();
    }

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[420px] bg-white rounded-2xl p-6 gap-0">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg font-bold text-gray-900">
                        Konfirmasi Aktivitas Selesai
                    </DialogTitle>
                </DialogHeader>

                <p className="text-sm text-gray-600 mb-5">
                    Apakah Anda yakin aktivitas ini telah benar-benar selesai dikerjakan?
                    Berikan penilaian performa karyawan sebelum melanjutkan.
                </p>

                <div className="space-y-4 mb-8">
                    <p className="text-sm font-semibold text-gray-700">
                        Bagaimana performa karyawan?
                    </p>
                    <NilaiKPISelector
                        value={nilai}
                        onChange={setNilai}
                        variant="vertical"
                    />
                    {!nilai && (
                        <p className="text-xs text-gray-400 mt-1">
                            Pilih salah satu penilaian untuk melanjutkan.
                        </p>
                    )}
                </div>

                <div className="flex justify-end gap-2">
                    <Button
                        variant="outline"
                        onClick={handleClose}
                        disabled={isPending}
                        className="border-gray-200 text-gray-600 font-semibold"
                    >
                        Tidak
                    </Button>
                    <Button
                        onClick={() => nilai && onConfirm(nilai)}
                        disabled={isPending || !nilai}
                        className={cn(
                            "font-semibold transition-all shadow-sm",
                            isPending || !nilai
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed border-none"
                                : "bg-cyan-600 hover:bg-cyan-700 text-white"
                        )}
                    >
                        {isPending ? "Memproses..." : "Ya, konfirmasi"}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
