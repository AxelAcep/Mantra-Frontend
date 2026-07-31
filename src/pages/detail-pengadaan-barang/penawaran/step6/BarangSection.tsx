import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Package,
  ArrowRight,
  MessageCircle,
  Loader2,
} from "lucide-react";
import {
  useAddBarangImplementasi,
  useUpdateBarangImplementasi,
  useDeleteBarangImplementasi,
  useDetailImplementasi,
} from "@/hooks/use-implementasi";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUnreadChatCount } from "@/hooks/use-activity";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BarangItem = {
  id: string;
  namaBarang: string;
  status: "Ready" | "Perlu Beli" | "Indent" | "PO" | "Pending" | "Pengiriman";
  qty: number;
  satuan: string;
  hargaSatuan: number;
  metode: string;
  estimasiKedatangan?: string;
};

type FormDraft = {
  namaBarang: string;
  status: "Ready" | "Perlu Beli" | "Indent" | "PO" | "Pending" | "Pengiriman";
  qty: string;
  satuan: string;
  hargaSatuan: string;
  metode: string;
  estimasiKedatangan: string;
};

type ResultModalInfo = {
  type: "success" | "error";
  message: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const SATUAN_OPTIONS = [
  "Lot",
  "Batang",
  "Set",
  "Unit",
  "Pcs",
  "m",
  "m²",
  "kg",
  "Roll",
  "Buah",
];

const METODE_OPTIONS = [
  "Stok Gudang",
  "Indent Lokal",
  "Indent Luar Negeri",
  "Pembelian Langsung",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function emptyDraft(): FormDraft {
  return {
    namaBarang: "",
    status: "Perlu Beli",
    qty: "",
    satuan: "Unit",
    hargaSatuan: "",
    metode: "Pembelian Langsung",
    estimasiKedatangan: "",
  };
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}

function getErrorMessage(err: any, fallback: string): string {
  return err?.response?.data?.message || err?.message || fallback;
}

// ─── Form Card Component ───────────────────────────────────────────────────────

interface FormCardProps {
  isEdit: boolean;
  isSaving: boolean;
  draft: FormDraft;
  onUpdate: (patch: Partial<FormDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
}

function FormCard({
  isEdit,
  isSaving,
  draft,
  onUpdate,
  onSave,
  onCancel,
}: FormCardProps) {
  const canSave =
    !isSaving &&
    draft.namaBarang.trim() !== "" &&
    draft.qty !== "" &&
    parseFloat(draft.qty) > 0 &&
    draft.hargaSatuan !== "" &&
    parseFloat(draft.hargaSatuan) >= 0;

  return (
    <div className="mb-5 border border-cyan-100 rounded-xl p-5 bg-cyan-50/20 space-y-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-cyan-700 uppercase tracking-wide">
          {isEdit ? "Edit Data Barang" : "Tambah Barang Baru"}
        </span>
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          title="Tutup"
        >
          <X size={16} />
        </button>
      </div>

      {/* Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nama Barang — full width */}
        <div className="md:col-span-2">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Nama Barang *
          </label>
          <input
            type="text"
            value={draft.namaBarang}
            disabled={isSaving}
            onChange={(e) => onUpdate({ namaBarang: e.target.value })}
            placeholder="Masukkan nama barang..."
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Status
          </label>
          <select
            value={draft.status}
            disabled={isSaving}
            onChange={(e) =>
              onUpdate({
                status: e.target.value as
                  | "Ready"
                  | "Perlu Beli"
                  | "Indent"
                  | "PO"
                  | "Pending"
                  | "Pengiriman",
              })
            }
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-60"
          >
            <option value="Ready">Ready</option>
            <option value="Perlu Beli">Perlu Beli</option>
            <option value="Indent">Indent</option>
            <option value="PO">PO</option>
            <option value="Pending">Pending</option>
            <option value="Pengiriman">Pengiriman</option>
          </select>
        </div>

        {/* Metode */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Metode Pengadaan
          </label>
          <select
            value={draft.metode}
            disabled={isSaving}
            onChange={(e) => onUpdate({ metode: e.target.value })}
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-60"
          >
            {METODE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Qty */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Qty *
          </label>
          <input
            type="number"
            min={1}
            value={draft.qty}
            disabled={isSaving}
            onChange={(e) => onUpdate({ qty: e.target.value })}
            placeholder="0"
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Satuan */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Satuan
          </label>
          <select
            value={draft.satuan}
            disabled={isSaving}
            onChange={(e) => onUpdate({ satuan: e.target.value })}
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-60"
          >
            {SATUAN_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Harga Satuan */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Harga Satuan (Rp) *
          </label>
          <input
            type="number"
            min={0}
            value={draft.hargaSatuan}
            disabled={isSaving}
            onChange={(e) => onUpdate({ hargaSatuan: e.target.value })}
            placeholder="0"
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 disabled:opacity-60"
          />
        </div>

        {/* Estimasi Kedatangan */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Estimasi Kedatangan (opsional)
          </label>
          <input
            type="date"
            value={draft.estimasiKedatangan}
            disabled={isSaving}
            onChange={(e) => onUpdate({ estimasiKedatangan: e.target.value })}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer disabled:opacity-60"
          />
        </div>
      </div>

      {/* Preview total */}
      {draft.qty && draft.hargaSatuan && (
        <div className="bg-white border border-gray-100 rounded-lg px-4 py-2.5 flex items-center justify-between">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Total Harga
          </span>
          <span className="text-sm font-bold text-cyan-600">
            {formatCurrency(
              parseFloat(draft.qty || "0") *
                parseFloat(draft.hargaSatuan || "0"),
            )}
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          onClick={onCancel}
          disabled={isSaving}
          className="px-5 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Batal
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="px-5 py-2 text-xs font-bold bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-sm"
        >
          {isSaving ? (
            <>
              <Loader2 size={13} className="animate-spin" />
              Menyimpan...
            </>
          ) : (
            <>
              <Check size={13} />
              {isEdit ? "Simpan Perubahan" : "Tambah Barang"}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

// ─── Result Modal Component (Sukses / Gagal) ───────────────────────────────────

interface ResultModalProps {
  info: ResultModalInfo | null;
  onClose: () => void;
}

function ResultModal({ info, onClose }: ResultModalProps) {
  return (
    <Dialog open={!!info} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-[380px] bg-white rounded-2xl p-6 gap-0 text-center">
        <div
          className={`mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center ${
            info?.type === "success"
              ? "bg-green-50 text-green-500"
              : "bg-red-50 text-red-500"
          }`}
        >
          {info?.type === "success" ? <Check size={24} /> : <X size={24} />}
        </div>
        <DialogHeader>
          <DialogTitle className="text-base font-bold text-slate-800 text-center">
            {info?.type === "success" ? "Berhasil" : "Gagal"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-gray-500 mt-1 mb-5">{info?.message}</p>
        <Button
          onClick={onClose}
          className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold w-full"
        >
          Tutup
        </Button>
      </DialogContent>
    </Dialog>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

interface BarangSectionProps {
  trackingId?: string;
  activityPembelian?: any;
  onChatClick: (activityId: string, activityJudul: string) => void;
  onAssignPGA?: () => void;
}

export default function BarangSection({
  trackingId,
  activityPembelian,
  onChatClick,
  onAssignPGA,
}: BarangSectionProps) {
  const navigate = useNavigate();
  const { data: implData } = useDetailImplementasi(trackingId);
  const { data: unreadChat = 0 } = useUnreadChatCount(
    activityPembelian?.id ?? "",
  );

  const addBarangMut = useAddBarangImplementasi(trackingId ?? "");
  const updateBarangMut = useUpdateBarangImplementasi(trackingId ?? "");
  const deleteBarangMut = useDeleteBarangImplementasi(trackingId ?? "");

  const items = (implData?.barang as any as BarangItem[]) ?? [];
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<FormDraft>(emptyDraft());
  const [deleteTarget, setDeleteTarget] = useState<BarangItem | null>(null);
  const [resultModalInfo, setResultModalInfo] =
    useState<ResultModalInfo | null>(null);

  // Satu flag global: true kalau ada mutation barang (add/edit/delete) yang lagi jalan.
  // Dipakai buat nge-lock tombol-tombol lain biar gak bisa di-spam klik.
  const isMutating =
    addBarangMut.isPending ||
    updateBarangMut.isPending ||
    deleteBarangMut.isPending;

  function updateDraft(patch: Partial<FormDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function onOpenAdd() {
    setFormMode("add");
    setEditingId(null);
    setDraft(emptyDraft());
  }

  function onOpenEdit(item: BarangItem) {
    setFormMode("edit");
    setEditingId(item.id);
    setDraft({
      namaBarang: item.namaBarang,
      status: item.status,
      qty: String(item.qty),
      satuan: item.satuan,
      hargaSatuan: String(item.hargaSatuan),
      metode: item.metode,
      estimasiKedatangan: item.estimasiKedatangan
        ? item.estimasiKedatangan.split("T")[0]
        : "",
    });
  }

  function onCancelForm() {
    if (isMutating) return;
    setFormMode(null);
    setEditingId(null);
  }

  function onSaveAdd() {
    const newItem = {
      namaBarang: draft.namaBarang.trim(),
      status: draft.status,
      qty: parseFloat(draft.qty),
      satuan: draft.satuan,
      hargaSatuan: parseFloat(draft.hargaSatuan),
      metode: draft.metode,
      estimasiKedatangan: draft.estimasiKedatangan || undefined,
    };
    addBarangMut.mutate(newItem, {
      onSuccess: () => {
        setFormMode(null);
        setDraft(emptyDraft());
        setResultModalInfo({
          type: "success",
          message: "Barang berhasil ditambahkan.",
        });
      },
      onError: (err: any) => {
        setResultModalInfo({
          type: "error",
          message: getErrorMessage(
            err,
            "Gagal menambahkan barang. Silakan coba lagi.",
          ),
        });
      },
    });
  }

  function onSaveEdit() {
    if (!editingId) return;
    const updatedItem = {
      namaBarang: draft.namaBarang.trim(),
      status: draft.status,
      qty: parseFloat(draft.qty),
      satuan: draft.satuan,
      hargaSatuan: parseFloat(draft.hargaSatuan),
      metode: draft.metode,
      estimasiKedatangan: draft.estimasiKedatangan || undefined,
    };
    updateBarangMut.mutate(
      {
        barangId: editingId,
        payload: updatedItem,
      },
      {
        onSuccess: () => {
          setFormMode(null);
          setEditingId(null);
          setResultModalInfo({
            type: "success",
            message: "Perubahan barang berhasil disimpan.",
          });
        },
        onError: (err: any) => {
          setResultModalInfo({
            type: "error",
            message: getErrorMessage(
              err,
              "Gagal menyimpan perubahan barang. Silakan coba lagi.",
            ),
          });
        },
      },
    );
  }

  function onDeleteClick(item: BarangItem) {
    if (isMutating) return;
    setDeleteTarget(item);
  }

  function onConfirmDelete() {
    if (!deleteTarget || deleteBarangMut.isPending) return;
    deleteBarangMut.mutate(deleteTarget.id, {
      onSuccess: () => {
        if (editingId === deleteTarget.id) {
          setFormMode(null);
          setEditingId(null);
        }
        setDeleteTarget(null);
        setResultModalInfo({
          type: "success",
          message: "Barang berhasil dihapus.",
        });
      },
      onError: (err: any) => {
        setDeleteTarget(null);
        setResultModalInfo({
          type: "error",
          message: getErrorMessage(
            err,
            "Gagal menghapus barang. Silakan coba lagi.",
          ),
        });
      },
    });
  }

  // ── Derived ──────────────────────────────────────────────────────────────────

  const filtered = items.filter((item) =>
    item.namaBarang.toLowerCase().includes(search.toLowerCase()),
  );

  const totalReady = items.filter((i) => i.status === "Ready").length;
  const totalPerluBeli = items.filter((i) => i.status === "Perlu Beli").length;
  const progress =
    items.length > 0 ? Math.round((totalReady / items.length) * 100) : 0;

  const isSavingForm =
    formMode === "edit" ? updateBarangMut.isPending : addBarangMut.isPending;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Total Item
            </p>
            <p className="text-base font-bold text-slate-800">
              {items.length} barang proyek
            </p>
          </div>
          <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Barang Ready
            </p>
            <p className="text-base font-bold text-slate-800">
              {totalReady} barang
            </p>
          </div>
          <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Barang Perlu Beli
            </p>
            <p className="text-base font-bold text-slate-800">
              {totalPerluBeli} barang
            </p>
          </div>
          <div className="bg-slate-50/50 border border-gray-100 p-4 rounded-xl">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">
              Progres Pembelian Barang
            </p>
            <div className="flex items-center gap-3 mt-1">
              <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${progress === 100 ? "bg-green-500" : "bg-yellow-400"}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[11px] font-bold text-slate-700 whitespace-nowrap">
                {totalReady} dari {items.length} terbeli
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        {/* Header bar */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <FileText size={16} className="text-cyan-500" />
            <h3 className="font-bold text-slate-800 text-sm">
              Daftar Barang Pembelian
            </h3>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama barang..."
                className="bg-gray-50 border border-gray-100 rounded-lg pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-cyan-500 w-56"
              />
            </div>
            <button
              onClick={onOpenAdd}
              disabled={isMutating || formMode !== null}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} /> Tambah Barang
            </button>
          </div>
        </div>

        {/* Inline Form Card (Add or Edit) */}
        {formMode !== null && (
          <FormCard
            isEdit={formMode === "edit"}
            isSaving={isSavingForm}
            draft={draft}
            onUpdate={updateDraft}
            onSave={formMode === "edit" ? onSaveEdit : onSaveAdd}
            onCancel={onCancelForm}
          />
        )}

        {/* Empty State */}
        {filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center gap-3 text-center">
            <div className="p-4 bg-slate-50 rounded-full">
              <Package size={32} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Belum ada data barang
            </p>
            <p className="text-xs text-slate-400">
              Klik "Tambah Barang" untuk menambahkan item baru
            </p>
          </div>
        ) : (
          <>
            <div className="rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-gray-100">
                    <th className="px-4 py-3 text-left text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      Nama Barang
                    </th>
                    <th className="px-4 py-3 text-center text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      Qty
                    </th>
                    <th className="px-4 py-3 text-center text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      Harga Satuan
                    </th>
                    <th className="px-4 py-3 text-center text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-4 py-3 text-left text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      Metode / Estimasi
                    </th>
                    <th className="px-4 py-3 text-right text-slate-600 text-[11px] font-bold uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((item) => {
                    const isRowDeleting =
                      deleteBarangMut.isPending && deleteTarget?.id === item.id;
                    const isRowDisabled = isMutating;

                    return (
                      <tr
                        key={item.id}
                        className={`border-b border-gray-50 last:border-0 transition-all ${
                          editingId === item.id
                            ? "bg-cyan-50/20"
                            : "bg-white hover:bg-slate-50/30"
                        }`}
                      >
                        <td className="px-4 py-4">
                          <p className="text-xs font-bold text-slate-800">
                            {item.namaBarang}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              item.status === "Ready"
                                ? "bg-green-50 text-green-500"
                                : "bg-amber-50 text-amber-500"
                            }`}
                          >
                            {item.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-600 font-medium text-center">
                          {item.qty} {item.satuan}
                        </td>
                        <td className="px-4 py-4 text-xs text-slate-600 font-medium text-center">
                          {formatCurrency(item.hargaSatuan)}
                        </td>
                        <td className="px-4 py-4 text-xs font-bold text-slate-800 text-center">
                          {formatCurrency(item.qty * item.hargaSatuan)}
                        </td>
                        <td className="px-4 py-4">
                          <p className="text-xs font-bold text-slate-700">
                            {item.metode}
                          </p>
                          {item.estimasiKedatangan ? (
                            <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                              {new Date(
                                item.estimasiKedatangan,
                              ).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              })}
                            </p>
                          ) : (
                            <span className="text-[10px] font-bold text-red-400 mt-0.5 block">
                              Belum Tersedia
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => onOpenEdit(item)}
                              disabled={isRowDisabled}
                              className={`transition-colors disabled:opacity-30 disabled:cursor-not-allowed ${
                                editingId === item.id
                                  ? "text-cyan-500"
                                  : "text-gray-400 hover:text-cyan-500"
                              }`}
                              title="Edit"
                            >
                              <Pencil size={14} />
                            </button>
                            <button
                              onClick={() => onDeleteClick(item)}
                              disabled={isRowDisabled}
                              className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                              title="Hapus"
                            >
                              {isRowDeleting ? (
                                <Loader2 size={14} className="animate-spin" />
                              ) : (
                                <Trash2 size={14} />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Footer */}
            <div className="mt-3">
              <p className="text-[11px] text-gray-400 font-medium">
                Menampilkan {filtered.length} dari {items.length} data
              </p>
            </div>
          </>
        )}
      </div>

      {/* Logbook Operasional */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm text-left">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <FileText size={16} className="text-cyan-500" />
            Logbook Operasional Pembelian Barang
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
          {activityPembelian ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      {activityPembelian.judul}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {activityPembelian.pegawai?.nama ?? "—"} ·{" "}
                      {activityPembelian.pegawai?.divisi?.replace("_", " ") ??
                        "—"}{" "}
                      ·{" "}
                      {activityPembelian.targetSelesai
                        ? new Date(
                            activityPembelian.targetSelesai,
                          ).toLocaleDateString("id-ID", {
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
                    onClick={() =>
                      onChatClick(activityPembelian.id, activityPembelian.judul)
                    }
                    className="flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg relative transition-colors shadow-sm"
                  >
                    <MessageCircle size={13} /> Chat
                  </button>
                  <button
                    onClick={() =>
                      navigate(`/dailyactivity/${activityPembelian.id}`)
                    }
                    className="text-cyan-500 font-bold text-xs flex items-center gap-1 hover:text-cyan-600 shrink-0"
                  >
                    Lihat Detail <ArrowRight size={14} />
                  </button>
                </div>
              </div>

              {/* Render children (Staff PGA) */}
              {activityPembelian.children &&
                activityPembelian.children.length > 0 && (
                  <div className="ml-6 pl-4 border-l-2 border-gray-100 space-y-3">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
                      Penugasan Staff PGA
                    </p>
                    {activityPembelian.children.map((child: any) => (
                      <div
                        key={child.id}
                        className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-3 hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-50 rounded-lg text-slate-400">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-700">
                              {child.judul}
                            </p>
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {child.pegawai?.nama ?? "—"} ·{" "}
                              {child.pegawai?.divisi?.replace("_", " ") ?? "—"}{" "}
                              ·{" "}
                              {child.targetSelesai
                                ? new Date(
                                    child.targetSelesai,
                                  ).toLocaleDateString("id-ID", {
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
                            onClick={() =>
                              navigate(`/dailyactivity/${child.id}`)
                            }
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

      {/* ── Dialog Konfirmasi Hapus ── */}
      <Dialog
        open={!!deleteTarget}
        onOpenChange={(v) => {
          if (!v && !deleteBarangMut.isPending) setDeleteTarget(null);
        }}
      >
        <DialogContent className="sm:max-w-[400px] bg-white rounded-2xl p-6 gap-0">
          <DialogHeader className="mb-3">
            <DialogTitle className="text-lg font-bold text-gray-900">
              Hapus Barang
            </DialogTitle>
          </DialogHeader>

          <p className="text-sm text-gray-600 mb-1">
            Apakah Anda yakin ingin menghapus barang ini?
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-6 truncate">
            📦 {deleteTarget?.namaBarang}
          </p>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              disabled={deleteBarangMut.isPending}
              className="border-gray-200 text-gray-600 font-semibold disabled:opacity-40"
            >
              Batal
            </Button>
            <Button
              onClick={onConfirmDelete}
              disabled={deleteBarangMut.isPending}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold disabled:opacity-60 flex items-center gap-1.5"
            >
              {deleteBarangMut.isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Menghapus...
                </>
              ) : (
                "Ya, hapus"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ── Modal Hasil (Sukses / Gagal) ── */}
      <ResultModal
        info={resultModalInfo}
        onClose={() => setResultModalInfo(null)}
      />
    </div>
  );
}
