import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  FileText,
  Truck,
  Clock,
  Pencil,
  Check,
  X,
  Upload,
  Download,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import ActivityLogSection from "./ActivityLogSection";
import type { LogEntry } from "./ActivityLogSection";
import BarangSection from "./BarangSection";
import { useDetailImplementasi, useUpdateDetailImplementasi, useAssignPGAStaff } from "@/hooks/use-implementasi";
import { useUnreadChatCount, useDetailActivity } from "@/hooks/use-activity";
import { usePegawaiByDivisi } from "@/hooks/use-penawaran";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getUserInfo() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    return {
      divisi: user.pegawai?.divisi ?? "",
      role: user.role ?? "",
      nama: user.pegawai?.nama ?? "",
    };
  } catch {
    return { divisi: "", role: "", nama: "" };
  }
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

// ─── Order Info Card ───────────────────────────────────────────────────────────

interface OrderCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  tanggal?: string;
  canEdit: boolean;
  isEditing: boolean;
  editValue: string;
  onEditClick: () => void;
  onEditChange: (v: string) => void;
  onSave: () => void;
  onCancel: () => void;
  emptyLabel?: string;
  inputType?: string;
}

function OrderCard({
  icon,
  label,
  value,
  tanggal,
  canEdit,
  isEditing,
  editValue,
  onEditClick,
  onEditChange,
  onSave,
  onCancel,
  emptyLabel = "Belum tersedia",
  inputType = "text",
}: OrderCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm group hover:border-cyan-100 transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2 text-cyan-600">
          {icon}
          <p className="text-[10px] font-bold uppercase tracking-tight">
            {label}
          </p>
        </div>
        {canEdit && !isEditing && (
          <button
            onClick={onEditClick}
            className="text-gray-300 hover:text-cyan-500 transition-colors opacity-0 group-hover:opacity-100"
            title={`Edit ${label}`}
          >
            <Pencil size={13} />
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <input
            type={inputType}
            value={editValue}
            onChange={(e) => onEditChange(e.target.value)}
            autoFocus
            placeholder={`Masukkan ${label}...`}
            className="w-full text-sm font-bold text-slate-800 border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
          <div className="flex items-center gap-2">
            <button
              onClick={onSave}
              className="flex items-center gap-1 text-[10px] font-bold bg-cyan-500 text-white px-3 py-1.5 rounded-lg hover:bg-cyan-600 transition-colors"
            >
              <Check size={11} /> Simpan
            </button>
            <button
              onClick={onCancel}
              className="flex items-center gap-1 text-[10px] font-bold text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <X size={11} /> Batal
            </button>
          </div>
        </div>
      ) : value ? (
        <>
          <h3 className="text-lg font-bold text-slate-800 mb-1">{value}</h3>
          {tanggal && <p className="text-xs text-gray-400">{tanggal}</p>}
        </>
      ) : (
        <>
          <h3 className="text-lg font-bold text-slate-400 mb-1">—</h3>
          <p className="text-xs text-gray-400">{emptyLabel}</p>
        </>
      )}
    </div>
  );
}

// ─── Logbook Card ─────────────────────────────────────────────────────────────

interface LogbookCardProps {
  title: string;
  activity?: {
    id: string;
    judul: string;
    targetSelesai?: string;
    pegawai?: { nama?: string; divisi?: string };
    children?: any[];
  };
  onChatClick: (activityId: string, activityJudul: string) => void;
  onAssignPGA?: () => void;
}

function LogbookCard({ title, activity, onChatClick, onAssignPGA }: LogbookCardProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-left">
      <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FileText size={16} className="text-cyan-500" />
          {title}
        </div>
        {onAssignPGA && (
          <button
            onClick={onAssignPGA}
            className="flex items-center gap-1.5 text-xs font-bold text-cyan-600 bg-cyan-50 hover:bg-cyan-100 px-3 py-1.5 rounded-lg transition-colors"
          >
            Pilih Staff PGA
          </button>
        )}
      </div>
      <div className="p-6">
        {activity ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {activity.judul}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activity.pegawai?.nama ?? "—"} · {activity.pegawai?.divisi ?? "—"} ·{" "}
                    {activity.targetSelesai
                      ? new Date(activity.targetSelesai).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                      : "—"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => onChatClick(activity.id, activity.judul)}
                  className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg relative transition-colors shadow-sm"
                >
                  <MessageCircle size={13} /> Chat
                </button>
                <button
                  onClick={() => navigate(`/dailyactivity/${activity.id}`)}
                  className="text-cyan-500 font-bold text-xs flex items-center gap-1 hover:text-cyan-600"
                >
                  Lihat Detail <ArrowRight size={14} />
                </button>
              </div>
            </div>

            {/* Render children (Staff PGA) */}
            {activity.children && activity.children.length > 0 && (
              <div className="ml-6 pl-4 border-l-2 border-gray-100 space-y-3">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Penugasan Staff PGA</p>
                {activity.children.map((child: any) => (
                  <div key={child.id} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-3 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                        <FileText size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {child.judul}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          {child.pegawai?.nama ?? "—"} · {child.pegawai?.divisi?.replace("_", " ") ?? "—"} ·{" "}
                          {child.targetSelesai
                            ? new Date(child.targetSelesai).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                            : "—"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <button
                        onClick={() => onChatClick(child.id, child.judul)}
                        className="flex items-center gap-1.5 text-cyan-600 bg-cyan-50 hover:bg-cyan-100 text-[11px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                      >
                        <MessageCircle size={12} /> Chat
                      </button>
                      <button
                        onClick={() => navigate(`/dailyactivity/${child.id}`)}
                        className="text-cyan-500 font-bold text-[11px] flex items-center gap-1 hover:text-cyan-600 shrink-0"
                      >
                        Detail <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-full">
              <FileText size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Belum ada logbook operasional
            </p>
            <p className="text-xs text-slate-400">
              Logbook akan muncul setelah ada aktivitas pada tahap ini
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Tab Button ───────────────────────────────────────────────────────────────

type Tab = "pembelian" | "pengantaran" | "instalasi";

interface TabButtonProps {
  value: Tab;
  label: string;
  activeTab: Tab;
  onClick: (tab: Tab) => void;
}

function TabButton({ value, label, activeTab, onClick }: TabButtonProps) {
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => onClick(value)}
      className={`py-4 text-sm whitespace-nowrap border-b-2 transition-all font-medium ${isActive
        ? "border-cyan-500 text-cyan-500 font-bold"
        : "border-transparent text-gray-400 hover:text-gray-600"
        }`}
    >
      {label}
    </button>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface Step6Props {
  trackingId?: string;
  onChatClick: (activityId: string, activityJudul: string) => void;
}

export default function Step6({ trackingId, onChatClick }: Step6Props) {
  const userInfo = getUserInfo();
  const isMasterOrManager = userInfo.role === "MASTER" || userInfo.divisi === "MANAGER_OPERASIONAL";
  const isAdminProyek = userInfo.divisi === "MAINTENANCE_PAC" || userInfo.divisi === "MAINTENANCE_FIRE";
  const isKepalaPGA = userInfo.divisi === "PROCUREMENT_GA" && userInfo.role === "SUPERVISI";

  const canEditPOAndWaktu = isMasterOrManager || isAdminProyek;
  const canEditWO = isMasterOrManager || isKepalaPGA;
  // ── Tab State ──
  const [activeTab, setActiveTab] = useState<Tab>("pembelian");

  // ── Query & Mutation ──
  const { data: implData, loading: implLoading } = useDetailImplementasi(trackingId);
  const updateDetailMut = useUpdateDetailImplementasi(trackingId ?? "");

  // ── Staff PGA Modal State ──
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedStaffs, setSelectedStaffs] = useState<string[]>([]);
  const [assignPhase, setAssignPhase] = useState<"pembelian" | "pengantaran" | "instalasi">("pembelian");
  const { data: pgaStaffs } = usePegawaiByDivisi("PROCUREMENT_GA");
  const assignPgaMut = useAssignPGAStaff(trackingId ?? "");

  function handleAssignSubmit() {
    if (selectedStaffs.length === 0) return;
    assignPgaMut.mutate({ staffIds: selectedStaffs, phase: assignPhase }, {
      onSuccess: () => {
        setIsAssignModalOpen(false);
        setSelectedStaffs([]);
        setAssignPhase("pembelian");
      }
    });
  }

  // ── Order Info State ──
  const [orderInfo, setOrderInfo] = useState({
    noPO: "",
    tanggalPO: "",
    noWO: "",
    tanggalWO: "",
    noDO: "",
    tanggalDO: "",
    waktuPengerjaan: "",
  });

  useEffect(() => {
    if (implData) {
      setOrderInfo({
        noPO: implData.noPO ?? "",
        tanggalPO: implData.tanggalPO ? new Date(implData.tanggalPO).toISOString().slice(0, 10) : "",
        noWO: implData.noWO ?? "",
        tanggalWO: implData.tanggalWO ? new Date(implData.tanggalWO).toISOString().slice(0, 10) : "",
        noDO: implData.noDO ?? "",
        tanggalDO: implData.tanggalDO ? new Date(implData.tanggalDO).toISOString().slice(0, 10) : "",
        waktuPengerjaan: (implData as any).waktuPengerjaan ? new Date((implData as any).waktuPengerjaan).toISOString().slice(0, 10) : "",
      });
    }
  }, [implData]);

  // ── Order Editing State ──
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editNoValue, setEditNoValue] = useState("");
  const [editTanggalValue, setEditTanggalValue] = useState("");

  function handleEditField(noField: string, tanggalField: string) {
    setEditingField(noField);
    setEditNoValue(orderInfo[noField as keyof typeof orderInfo]);
    setEditTanggalValue(orderInfo[tanggalField as keyof typeof orderInfo]);
  }

  function handleSaveField(noField: string, tanggalField: string) {
    const defaultDate = orderInfo[tanggalField as keyof typeof orderInfo] || new Date().toISOString().slice(0, 10);
    const newOrderInfo = {
      ...orderInfo,
      [noField]: editNoValue,
      [tanggalField]: noField === "waktuPengerjaan" ? editNoValue : defaultDate,
    };

    updateDetailMut.mutate({
      noPO: newOrderInfo.noPO,
      tanggalPO: newOrderInfo.tanggalPO || undefined,
      noWO: newOrderInfo.noWO,
      tanggalWO: newOrderInfo.tanggalWO || undefined,
      noDO: newOrderInfo.noDO,
      tanggalDO: newOrderInfo.tanggalDO || undefined,
      waktuPengerjaan: newOrderInfo.waktuPengerjaan || undefined,
    });
    setEditingField(null);
  }

  function handleCancelEdit() {
    setEditingField(null);
  }

  // ── Logs mapping ──
  const logs: LogEntry[] =
    implData?.logs?.map((log, i) => {
      const d = log.createdAt ? new Date(log.createdAt) : new Date();
      return {
        id: i + 1,
        user: log.namaPegawai || "System",
        action: log.keterangan ? `${log.aksi}: ${log.keterangan}` : log.aksi || "-",
        time: d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: d.toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        type: "system" as const,
      };
    }) ?? [];

  // ── Fetch Daily Activity Details for Documents ──
  const { data: pembelianDetail } = useDetailActivity(implData?.activityPembelian?.id ?? "");
  const { data: pengantaranDetail } = useDetailActivity(implData?.activityPengantaran?.id ?? "");
  const { data: instalasiDetail } = useDetailActivity(implData?.activityInstalasi?.id ?? "");

  const combinedDokumen = React.useMemo(() => {
    const formatDateTime = (isoString: string) => {
      if (!isoString) return "-";
      const date = new Date(isoString);
      const dateStr = date.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
      const timeStr = date.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB";
      return `${dateStr} pukul ${timeStr}`;
    };

    const docs: { name: string; uploader: string; path: string }[] = [];

    pembelianDetail?.data?.dokumen?.forEach((doc: any) => {
      docs.push({
        name: doc.namaFile,
        uploader: `${doc.pegawai?.nama || doc.uploadedBy || "Karyawan"} pada ${formatDateTime(doc.createdAt)} - ${implData?.activityPembelian?.judul || "Pembelian Barang"}`,
        path: doc.path,
      });
    });

    pengantaranDetail?.data?.dokumen?.forEach((doc: any) => {
      docs.push({
        name: doc.namaFile,
        uploader: `${doc.pegawai?.nama || doc.uploadedBy || "Karyawan"} pada ${formatDateTime(doc.createdAt)} - ${implData?.activityPengantaran?.judul || "Pengantaran"}`,
        path: doc.path,
      });
    });

    instalasiDetail?.data?.dokumen?.forEach((doc: any) => {
      docs.push({
        name: doc.namaFile,
        uploader: `${doc.pegawai?.nama || doc.uploadedBy || "Karyawan"} pada ${formatDateTime(doc.createdAt)} - ${implData?.activityInstalasi?.judul || "Instalasi"}`,
        path: doc.path,
      });
    });

    // Deduplicate by path
    const seenPaths = new Set<string>();
    const result: typeof docs = [];
    docs.forEach((d) => {
      if (!seenPaths.has(d.path)) {
        seenPaths.add(d.path);
        result.push(d);
      }
    });

    return result;
  }, [pembelianDetail, pengantaranDetail, instalasiDetail, implData?.activityPembelian?.judul, implData?.activityPengantaran?.judul, implData?.activityInstalasi?.judul]);

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ── Left Column ── */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Purchase Order */}
          <OrderCard
            icon={<ShoppingCart size={16} strokeWidth={2.5} />}
            label="No. Purchase Order"
            value={orderInfo.noPO}
            tanggal={
              orderInfo.tanggalPO
                ? `Terbit ${new Date(orderInfo.tanggalPO).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "short", year: "numeric" },
                )}`
                : undefined
            }
            canEdit={canEditPOAndWaktu}
            isEditing={editingField === "noPO"}
            editValue={editNoValue}
            onEditClick={() => handleEditField("noPO", "tanggalPO")}
            onEditChange={setEditNoValue}
            onSave={() => handleSaveField("noPO", "tanggalPO")}
            onCancel={handleCancelEdit}
            emptyLabel="Belum tersedia"
          />

          {/* Work Order */}
          <OrderCard
            icon={<FileText size={16} strokeWidth={2.5} />}
            label="No. Work Order"
            value={orderInfo.noWO}
            tanggal={
              orderInfo.tanggalWO
                ? `Terbit ${new Date(orderInfo.tanggalWO).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "short", year: "numeric" },
                )}`
                : undefined
            }
            canEdit={canEditWO}
            isEditing={editingField === "noWO"}
            editValue={editNoValue}
            onEditClick={() => handleEditField("noWO", "tanggalWO")}
            onEditChange={setEditNoValue}
            onSave={() => handleSaveField("noWO", "tanggalWO")}
            onCancel={handleCancelEdit}
            emptyLabel="Belum tersedia"
          />

          {/* Deliver Order */}
          {/* <OrderCard
            icon={<Truck size={16} strokeWidth={2.5} />}
            label="No. Deliver Order"
            value={orderInfo.noDO}
            tanggal={
              orderInfo.tanggalDO
                ? `Terbit ${new Date(orderInfo.tanggalDO).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "short", year: "numeric" },
                )}`
                : undefined
            }
            canEdit={canEditOrders}
            isEditing={editingField === "noDO"}
            editValue={editNoValue}
            onEditClick={() => handleEditField("noDO", "tanggalDO")}
            onEditChange={setEditNoValue}
            onSave={() => handleSaveField("noDO", "tanggalDO")}
            onCancel={handleCancelEdit}
            emptyLabel="Belum tersedia"
          /> */}

          {/* Waktu Pengerjaan */}
          <OrderCard
            icon={<Clock size={16} strokeWidth={2.5} />}
            label="Waktu Pengerjaan"
            value={
              orderInfo.waktuPengerjaan
                ? new Date(orderInfo.waktuPengerjaan).toLocaleDateString(
                  "id-ID",
                  { day: "numeric", month: "long", year: "numeric" },
                )
                : ""
            }
            canEdit={canEditPOAndWaktu}
            isEditing={editingField === "waktuPengerjaan"}
            editValue={editNoValue}
            inputType="date"
            onEditClick={() => handleEditField("waktuPengerjaan", "waktuPengerjaan")}
            onEditChange={setEditNoValue}
            onSave={() => handleSaveField("waktuPengerjaan", "waktuPengerjaan")}
            onCancel={handleCancelEdit}
            emptyLabel="Menunggu estimasi waktu"
          />
        </div>

        {/* Tabs */}
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          {/* Tab Bar */}
          <div className="px-6 border-b border-gray-100 bg-white">
            <div className="flex gap-8">
              <TabButton
                value="pembelian"
                label="Pembelian Barang"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              <TabButton
                value="pengantaran"
                label="Pengantaran"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
              { /* <TabButton
                value="instalasi"
                label="Instalasi"
                activeTab={activeTab}
                onClick={setActiveTab}
              /> */}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-50/50 p-6 space-y-4">
            {activeTab === "pembelian" && (
              <BarangSection
                trackingId={trackingId}
                activityPembelian={implData?.activityPembelian}
                onChatClick={onChatClick}
                onAssignPGA={userInfo.divisi === "PROCUREMENT_GA" && userInfo.role === "SUPERVISI" && implData?.activityPembelian ? () => {
                  setAssignPhase("pembelian");
                  setIsAssignModalOpen(true);
                } : undefined}
              />
            )}

            {activeTab === "pengantaran" && (
              <LogbookCard
                title="Logbook Operasional Pengantaran"
                activity={implData?.activityPengantaran}
                onChatClick={onChatClick}
                onAssignPGA={userInfo.divisi === "PROCUREMENT_GA" && userInfo.role === "SUPERVISI" && implData?.activityPengantaran ? () => {
                  setAssignPhase("pengantaran");
                  setIsAssignModalOpen(true);
                } : undefined}
              />
            )}

            {activeTab === "instalasi" && (
              <LogbookCard
                title="Logbook Operasional Instalasi"
                activity={implData?.activityInstalasi}
                onChatClick={onChatClick}
                onAssignPGA={userInfo.divisi === "PROCUREMENT_GA" && userInfo.role === "SUPERVISI" && implData?.activityInstalasi ? () => {
                  setAssignPhase("instalasi");
                  setIsAssignModalOpen(true);
                } : undefined}
              />
            )}
          </div>
        </div>

        {/* Dokumen */}
        <div className="pt-2">
          <SectionHeading title="Dokumen" />
          <div className="mt-4 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
              <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                <FileText size={16} className="text-cyan-500" />
                Dokumen Pendukung
              </div>
            </div>

            {combinedDokumen.length === 0 ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-full">
                  <FileText size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-400">
                  Belum ada dokumen
                </p>
                <p className="text-xs text-slate-400">
                  Upload dokumen pendukung melalui daily activity terkait pembelian, pengantaran, atau instalasi
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-1">
                {combinedDokumen.map((doc, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                        <FileText size={18} />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-700">
                          {doc.name}
                        </p>
                        <p className="text-[10px] text-gray-400">
                          Diunggah oleh {doc.uploader}
                        </p>
                      </div>
                    </div>
                    <a
                      href={doc.path.startsWith("http") ? doc.path : `${import.meta.env.VITE_API_URL}${doc.path}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Right Column: Log Aktivitas ── */}
      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSection
          logs={logs}
        />
      </div>

      {/* ── Modal Pilih Staff PGA ── */}
      <Dialog open={isAssignModalOpen} onOpenChange={setIsAssignModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white rounded-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-slate-800">
              Pilih Staff PGA
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-4">
              Pilih staff PGA untuk ditugaskan mengecek barang. Mereka akan mendapatkan daily activity terpisah.
            </p>
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
              {pgaStaffs?.filter((p: any) => p.role !== "SUPERVISI").map((staff: any) => {
                let currentParent = implData?.activityPembelian;
                if (assignPhase === "pengantaran") currentParent = implData?.activityPengantaran;
                if (assignPhase === "instalasi") currentParent = implData?.activityInstalasi;

                const isAlreadyAssigned = currentParent?.children?.some((child: any) => child.pegawaiId === staff.id);
                if (isAlreadyAssigned) return null;
                return (
                  <label
                    key={staff.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:bg-slate-50 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-cyan-500 border-gray-300 rounded focus:ring-cyan-500"
                      checked={selectedStaffs.includes(staff.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedStaffs([...selectedStaffs, staff.id]);
                        } else {
                          setSelectedStaffs(selectedStaffs.filter((id) => id !== staff.id));
                        }
                      }}
                    />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{staff.nama}</p>
                      <p className="text-xs text-gray-400">Divisi {staff.divisi.replace("_", " ")}</p>
                    </div>
                  </label>
                );
              })}
              {(!pgaStaffs || pgaStaffs.filter((p: any) => {
                let currentParent = implData?.activityPembelian;
                if (assignPhase === "pengantaran") currentParent = implData?.activityPengantaran;
                if (assignPhase === "instalasi") currentParent = implData?.activityInstalasi;
                return p.role !== "SUPERVISI" && !currentParent?.children?.some((child: any) => child.pegawaiId === p.id);
              }).length === 0) && (
                  <p className="text-sm text-gray-400 text-center py-4">Tidak ada staff PGA tersedia atau semua staff sudah ditugaskan.</p>
                )}
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="outline"
                onClick={() => setIsAssignModalOpen(false)}
                className="font-bold border-gray-200 text-gray-600"
              >
                Batal
              </Button>
              <Button
                onClick={handleAssignSubmit}
                disabled={selectedStaffs.length === 0 || assignPgaMut.isPending}
                className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold"
              >
                {assignPgaMut.isPending ? "Menyimpan..." : "Tugaskan Staff"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
