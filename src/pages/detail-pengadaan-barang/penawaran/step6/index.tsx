import React, { useState } from "react";
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
} from "lucide-react";
import ActivityLogSection from "./ActivityLogSection";
import type { LogEntry } from "./ActivityLogSection";
import BarangSection from "./BarangSection";

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
            type="text"
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

// ─── Empty Logbook ─────────────────────────────────────────────────────────────

function EmptyLogbook({ title }: { title: string }) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
      <div className="p-4 border-b border-gray-100/80">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FileText size={16} className="text-cyan-500" />
          {title}
        </div>
      </div>
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
      className={`py-4 text-sm whitespace-nowrap border-b-2 transition-all font-medium ${
        isActive
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
  onChatClick?: () => void;
}

export default function Step6({ onChatClick }: Step6Props) {
  const userInfo = getUserInfo();
  const canEditOrders =
    userInfo.role === "MASTER" ||
    userInfo.divisi === "MANAGER_OPERASIONAL";

  // ── Tab State ──
  const [activeTab, setActiveTab] = useState<Tab>("pembelian");

  // ── Order Info State ──
  const [orderInfo, setOrderInfo] = useState({
    noPO: "",
    tanggalPO: "",
    noWO: "",
    tanggalWO: "",
    noDO: "",
    tanggalDO: "",
  });

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
    setOrderInfo((prev) => ({
      ...prev,
      [noField]: editNoValue,
      [tanggalField]: editTanggalValue,
    }));
    setEditingField(null);
  }

  function handleCancelEdit() {
    setEditingField(null);
  }

  // ── Logs (empty for now) ──
  const logs: LogEntry[] = [];

  // ── Dummy dokumen ──
  const dokumen: { name: string; uploader: string; date: string }[] = [];

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* ── Left Column ── */}
      <div className="col-span-12 lg:col-span-9 space-y-6">
        <SectionHeading title="Detail" />

        {/* Order Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            canEdit={canEditOrders}
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
            canEdit={canEditOrders}
            isEditing={editingField === "noWO"}
            editValue={editNoValue}
            onEditClick={() => handleEditField("noWO", "tanggalWO")}
            onEditChange={setEditNoValue}
            onSave={() => handleSaveField("noWO", "tanggalWO")}
            onCancel={handleCancelEdit}
            emptyLabel="Belum tersedia"
          />

          {/* Deliver Order */}
          <OrderCard
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
          />

          {/* Waktu Pengerjaan */}
          <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:border-cyan-100 transition-all">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-cyan-600">
                <Clock size={16} strokeWidth={2.5} />
                <p className="text-[10px] font-bold uppercase tracking-tight">
                  Waktu Pengerjaan
                </p>
              </div>
              <span className="text-[9px] bg-amber-50 text-amber-500 font-bold px-1.5 py-0.5 rounded">
                Menunggu
              </span>
            </div>
            <div className="flex items-end justify-between mb-1.5">
              <p className="text-[11px] text-gray-400 font-medium">
                Sisa waktu —
              </p>
              <p className="text-sm font-bold text-slate-800">0%</p>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-cyan-500 rounded-full"
                style={{ width: "0%" }}
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2">
              Menunggu estimasi waktu
            </p>
          </div>
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
              <TabButton
                value="instalasi"
                label="Instalasi"
                activeTab={activeTab}
                onClick={setActiveTab}
              />
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-slate-50/50 p-6 space-y-4">
            {activeTab === "pembelian" && <BarangSection />}

            {activeTab === "pengantaran" && (
              <EmptyLogbook title="Logbook Operasional Pengantaran" />
            )}

            {activeTab === "instalasi" && (
              <EmptyLogbook title="Logbook Operasional Instalasi" />
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
              <button className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline">
                <Upload size={14} /> Upload File
              </button>
            </div>

            {dokumen.length === 0 ? (
              <div className="p-8 flex flex-col items-center gap-3 text-center">
                <div className="p-3 bg-slate-50 rounded-full">
                  <FileText size={24} className="text-slate-300" />
                </div>
                <p className="text-sm font-medium text-slate-400">
                  Belum ada dokumen
                </p>
                <p className="text-xs text-slate-400">
                  Upload dokumen pendukung untuk tahap implementasi
                </p>
              </div>
            ) : (
              <div className="p-4 space-y-1">
                {dokumen.map((doc, i) => (
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
                          Diunggah oleh {doc.uploader} · {doc.date}
                        </p>
                      </div>
                    </div>
                    <button className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
                      <Download size={18} />
                    </button>
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
          onChatClick={onChatClick ?? (() => {})}
        />
      </div>
    </div>
  );
}
