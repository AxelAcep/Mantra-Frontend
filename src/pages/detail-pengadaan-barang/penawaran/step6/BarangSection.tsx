import React, { useState } from "react";
import {
  FileText,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  Search,
  Package,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type BarangItem = {
  id: string;
  namaBarang: string;
  status: "Ready" | "Perlu Beli";
  qty: number;
  satuan: string;
  hargaSatuan: number;
  metode: string;
  estimasiKedatangan?: string;
};

type FormDraft = {
  namaBarang: string;
  status: "Ready" | "Perlu Beli";
  qty: string;
  satuan: string;
  hargaSatuan: string;
  metode: string;
  estimasiKedatangan: string;
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

function makeid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

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

// ─── Form Card Component ───────────────────────────────────────────────────────

interface FormCardProps {
  isEdit: boolean;
  draft: FormDraft;
  onUpdate: (patch: Partial<FormDraft>) => void;
  onSave: () => void;
  onCancel: () => void;
}

function FormCard({ isEdit, draft, onUpdate, onSave, onCancel }: FormCardProps) {
  const canSave =
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
          className="text-gray-400 hover:text-red-500 transition-colors"
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
            onChange={(e) => onUpdate({ namaBarang: e.target.value })}
            placeholder="Masukkan nama barang..."
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Status */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Status
          </label>
          <select
            value={draft.status}
            onChange={(e) =>
              onUpdate({ status: e.target.value as "Ready" | "Perlu Beli" })
            }
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          >
            <option value="Ready">Ready</option>
            <option value="Perlu Beli">Perlu Beli</option>
          </select>
        </div>

        {/* Metode */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Metode Pengadaan
          </label>
          <select
            value={draft.metode}
            onChange={(e) => onUpdate({ metode: e.target.value })}
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
            onChange={(e) => onUpdate({ qty: e.target.value })}
            placeholder="0"
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
          />
        </div>

        {/* Satuan */}
        <div>
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Satuan
          </label>
          <select
            value={draft.satuan}
            onChange={(e) => onUpdate({ satuan: e.target.value })}
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
            onChange={(e) => onUpdate({ hargaSatuan: e.target.value })}
            placeholder="0"
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
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
            onChange={(e) => onUpdate({ estimasiKedatangan: e.target.value })}
            onClick={(e) => e.currentTarget.showPicker?.()}
            className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
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
          className="px-5 py-2 text-xs font-bold text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Batal
        </button>
        <button
          onClick={onSave}
          disabled={!canSave}
          className="px-5 py-2 text-xs font-bold bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-40 flex items-center gap-1.5 shadow-sm"
        >
          <Check size={13} />
          {isEdit ? "Simpan Perubahan" : "Tambah Barang"}
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function BarangSection() {
  const [items, setItems] = useState<BarangItem[]>([]);
  const [search, setSearch] = useState("");
  const [formMode, setFormMode] = useState<"add" | "edit" | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<FormDraft>(emptyDraft());

  function updateDraft(patch: Partial<FormDraft>) {
    setDraft((prev) => ({ ...prev, ...patch }));
  }

  function handleOpenAdd() {
    setFormMode("add");
    setEditingId(null);
    setDraft(emptyDraft());
  }

  function handleOpenEdit(item: BarangItem) {
    setFormMode("edit");
    setEditingId(item.id);
    setDraft({
      namaBarang: item.namaBarang,
      status: item.status,
      qty: String(item.qty),
      satuan: item.satuan,
      hargaSatuan: String(item.hargaSatuan),
      metode: item.metode,
      estimasiKedatangan: item.estimasiKedatangan ?? "",
    });
  }

  function handleCancel() {
    setFormMode(null);
    setEditingId(null);
  }

  function handleSaveAdd() {
    const newItem: BarangItem = {
      id: makeid(),
      namaBarang: draft.namaBarang.trim(),
      status: draft.status,
      qty: parseFloat(draft.qty),
      satuan: draft.satuan,
      hargaSatuan: parseFloat(draft.hargaSatuan),
      metode: draft.metode,
      estimasiKedatangan: draft.estimasiKedatangan || undefined,
    };
    setItems((prev) => [...prev, newItem]);
    setFormMode(null);
    setDraft(emptyDraft());
  }

  function handleSaveEdit() {
    if (!editingId) return;
    setItems((prev) =>
      prev.map((item) =>
        item.id === editingId
          ? {
              ...item,
              namaBarang: draft.namaBarang.trim(),
              status: draft.status,
              qty: parseFloat(draft.qty),
              satuan: draft.satuan,
              hargaSatuan: parseFloat(draft.hargaSatuan),
              metode: draft.metode,
              estimasiKedatangan: draft.estimasiKedatangan || undefined,
            }
          : item,
      ),
    );
    setFormMode(null);
    setEditingId(null);
  }

  function handleDelete(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) {
      setFormMode(null);
      setEditingId(null);
    }
  }

  // ── Derived ──────────────────────────────────────────────────────────────────

  const filtered = items.filter((item) =>
    item.namaBarang.toLowerCase().includes(search.toLowerCase()),
  );

  const totalReady = items.filter((i) => i.status === "Ready").length;
  const totalPerluBeli = items.filter((i) => i.status === "Perlu Beli").length;
  const progress =
    items.length > 0 ? Math.round((totalReady / items.length) * 100) : 0;

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
                  className="h-full bg-yellow-400 rounded-full transition-all"
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
              onClick={handleOpenAdd}
              className="bg-cyan-500 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-cyan-600 transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Plus size={14} /> Tambah Barang
            </button>
          </div>
        </div>

        {/* Inline Form Card (Add or Edit) */}
        {formMode !== null && (
          <FormCard
            isEdit={formMode === "edit"}
            draft={draft}
            onUpdate={updateDraft}
            onSave={formMode === "edit" ? handleSaveEdit : handleSaveAdd}
            onCancel={handleCancel}
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
                  {filtered.map((item) => (
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
                            onClick={() => handleOpenEdit(item)}
                            className={`transition-colors ${
                              editingId === item.id
                                ? "text-cyan-500"
                                : "text-gray-400 hover:text-cyan-500"
                            }`}
                            title="Edit"
                          >
                            <Pencil size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Hapus"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
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

      {/* Logbook Operasional — Kosong */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="p-4 border-b border-gray-100/80 flex items-center gap-2">
          <FileText size={16} className="text-cyan-500" />
          <h3 className="font-bold text-slate-800 text-sm">
            Logbook Operasional Pembelian Barang
          </h3>
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
    </div>
  );
}
