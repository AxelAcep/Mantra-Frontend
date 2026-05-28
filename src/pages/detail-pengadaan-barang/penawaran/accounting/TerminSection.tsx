import React, { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  Pencil,
  Check,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { ItemTermin, FlagTermin } from "@/services/accounting.services";
import {
  useCreateAccounting,
  useUpdateAccounting,
  useBayarItemTermin,
} from "@/hooks/use-accounting";

// ─── Constants ────────────────────────────────────────────────────────────────

const KONDISI_OPTIONS = [
  "Setelah PO",
  "Barang Ready",
  "Pembayaran Setelah Barang Dikirim",
  "Progress Pekerjaan 25%",
  "Progress Pekerjaan 50%",
  "Progress Pekerjaan 100%",
  "Retensi 1 Bulan",
  "Retensi 3 Bulan",
  "Lain Lain",
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface TerminDraft {
  id: string; // local only, bukan dari server
  namaTermin: string;
  customNama: string; // hanya untuk "Lain Lain"
  persentase: string; // string supaya input bisa kosong
  keterangan: string;
  deadline: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getFlagLabel(flag: FlagTermin) {
  if (flag === "LEWAT")
    return { label: "Overdue", cls: "bg-red-50 text-red-500" };
  if (flag === "1_MINGGU")
    return { label: "< 1 Minggu", cls: "bg-amber-50 text-amber-500" };
  if (flag === "2_MINGGU")
    return { label: "< 2 Minggu", cls: "bg-yellow-50 text-yellow-500" };
  return null;
}

function getStatusStyle(sudahDibayar: boolean, flag: FlagTermin) {
  if (sudahDibayar)
    return {
      label: "Lunas",
      circle: "bg-cyan-500 border-white text-white",
      card: "",
    };
  if (flag === "LEWAT")
    return {
      label: "Overdue",
      circle: "bg-red-50 border-red-400 text-red-400",
      card: "ring-1 ring-red-100 border-red-100",
    };
  return {
    label: "Berjalan",
    circle: "bg-white border-cyan-500 text-cyan-500",
    card: "",
  };
}

function makeDraftId() {
  return Math.random().toString(36).slice(2);
}

function emptyDraft(): TerminDraft {
  return {
    id: makeDraftId(),
    namaTermin: "",
    customNama: "",
    persentase: "",
    keterangan: "",
    deadline: "",
  };
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  trackingId: string;
  items: ItemTermin[];
  canBayar: boolean;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function TerminSection({ trackingId, items, canBayar }: Props) {
  const isCreateMode = items.length === 0;

  // ── Create state ──
  const [drafts, setDrafts] = useState<TerminDraft[]>([emptyDraft()]);

  // ── Edit state (per-item) ──
  // key = item.id dari server, value = draft editan
  const [editingMap, setEditingMap] = useState<Record<string, TerminDraft>>({});

  // ── Expand state (view mode) ──
  const [expanded, setExpanded] = useState<string[]>(
    items[0] ? [items[0].id] : [],
  );

  // ── Hooks ──
  const {
    submit: submitCreate,
    loading: isCreating,
    error: createError,
  } = useCreateAccounting(trackingId);
  const {
    submit: submitUpdate,
    loading: isUpdating,
    error: updateError,
  } = useUpdateAccounting(trackingId);
  const { bayar, loading: isBayaring } = useBayarItemTermin(trackingId);

  // ─── Create mode helpers ───────────────────────────────────────────────────

  const usedKondisi = drafts
    .map((d) => d.namaTermin)
    .filter((n) => n !== "Lain Lain" && n !== "");

  const addDraft = () => setDrafts((prev) => [...prev, emptyDraft()]);

  const removeDraft = (id: string) =>
    setDrafts((prev) => prev.filter((d) => d.id !== id));

  const updateDraft = (id: string, patch: Partial<TerminDraft>) =>
    setDrafts((prev) =>
      prev.map((d) => (d.id === id ? { ...d, ...patch } : d)),
    );

  const totalDraftPersen = drafts.reduce(
    (sum, d) => sum + (parseFloat(d.persentase) || 0),
    0,
  );

  const canSubmitCreate =
    drafts.length > 0 &&
    drafts.every(
      (d) =>
        d.namaTermin !== "" &&
        (d.namaTermin !== "Lain Lain" || d.customNama.trim() !== "") &&
        parseFloat(d.persentase) > 0,
    ) &&
    totalDraftPersen <= 100;

  const handleCreate = async () => {
    if (!canSubmitCreate) return;
    await submitCreate({
      items: drafts.map((d) => ({
        namaTermin:
          d.namaTermin === "Lain Lain" ? d.customNama.trim() : d.namaTermin,
        persentase: parseFloat(d.persentase),
        keterangan: d.keterangan || undefined,
        deadline: d.deadline ? new Date(d.deadline).toISOString() : undefined,
      })),
    });
  };

  // ─── Edit mode helpers ─────────────────────────────────────────────────────

  const startEdit = (item: ItemTermin) => {
    setEditingMap((prev) => ({
      ...prev,
      [item.id]: {
        id: item.id,
        namaTermin: item.namaTermin,
        customNama: "",
        persentase: String(item.persentase),
        keterangan: item.keterangan ?? "",
        deadline: item.deadline
          ? item.deadline.slice(0, 10) // yyyy-mm-dd
          : "",
      },
    }));
  };

  const cancelEdit = (itemId: string) => {
    setEditingMap((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
  };

  const updateEditDraft = (itemId: string, patch: Partial<TerminDraft>) => {
    setEditingMap((prev) => ({
      ...prev,
      [itemId]: { ...prev[itemId], ...patch },
    }));
  };

  const saveEdit = async (itemId: string) => {
    const draft = editingMap[itemId];
    if (!draft) return;

    const payload = {
      items: items.map((item) => {
        if (item.id === itemId) {
          return {
            namaTermin: draft.namaTermin,
            persentase: parseFloat(draft.persentase),
            keterangan: draft.keterangan || undefined,
            deadline: draft.deadline
              ? new Date(draft.deadline).toISOString()
              : undefined,
          };
        }
        return {
          namaTermin: item.namaTermin,
          persentase: item.persentase,
          keterangan: item.keterangan || undefined,
          deadline: draft.deadline
            ? new Date(draft.deadline).toISOString()
            : undefined,
        };
      }),
    };

    await submitUpdate(payload);
    cancelEdit(itemId);
  };

  const handleDeleteItem = async (itemId: string) => {
    const payload = {
      items: items
        .filter((item) => item.id !== itemId)
        .map((item) => ({
          namaTermin: item.namaTermin,
          persentase: item.persentase,
          keterangan: item.keterangan || undefined,
          deadline: item.deadline
            ? new Date(item.deadline).toISOString()
            : undefined,
        })),
    };
    await submitUpdate(payload);
  };

  const toggle = (id: string) =>
    setExpanded((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );

  // ─── Render: Create Mode ───────────────────────────────────────────────────

  if (isCreateMode) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h3 className="font-bold text-slate-800 text-sm">
            Buat Termin Pembayaran
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            Tambahkan termin sesuai kebutuhan. Total persentase tidak boleh
            melebihi 100%.
          </p>
        </div>

        <div className="space-y-4">
          {drafts.map((draft, index) => {
            const isLainLain = draft.namaTermin === "Lain Lain";
            const availableOptions = KONDISI_OPTIONS.filter(
              (opt) =>
                opt === "Lain Lain" ||
                opt === draft.namaTermin ||
                !usedKondisi.includes(opt),
            );

            return (
              <div
                key={draft.id}
                className="border border-gray-100 rounded-xl p-4 space-y-3 bg-slate-50/40"
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Termin {index + 1}
                  </span>
                  {drafts.length > 1 && (
                    <button
                      onClick={() => removeDraft(draft.id)}
                      className="text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>

                {/* Kondisi */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Kondisi Termin
                  </label>
                  <select
                    value={draft.namaTermin}
                    onChange={(e) =>
                      updateDraft(draft.id, {
                        namaTermin: e.target.value,
                        customNama: "",
                      })
                    }
                    className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  >
                    <option value="">Pilih kondisi...</option>
                    {availableOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Custom nama untuk Lain Lain */}
                {isLainLain && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Nama Termin
                    </label>
                    <input
                      type="text"
                      value={draft.customNama}
                      onChange={(e) =>
                        updateDraft(draft.id, { customNama: e.target.value })
                      }
                      placeholder="Ketik nama termin..."
                      className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                )}

                {/* Persentase & Deadline */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Persentase (%)
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={draft.persentase}
                      onChange={(e) =>
                        updateDraft(draft.id, { persentase: e.target.value })
                      }
                      placeholder="0"
                      className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Deadline
                    </label>
                    <input
                      type="date"
                      value={draft.deadline}
                      onChange={(e) =>
                        updateDraft(draft.id, { deadline: e.target.value })
                      }
                      className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                    />
                  </div>
                </div>

                {/* Keterangan */}
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Keterangan (opsional)
                  </label>
                  <input
                    type="text"
                    value={draft.keterangan}
                    onChange={(e) =>
                      updateDraft(draft.id, { keterangan: e.target.value })
                    }
                    placeholder="Tambah keterangan..."
                    className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Total persen indicator */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  totalDraftPersen > 100 ? "bg-red-400" : "bg-cyan-400"
                }`}
                style={{ width: `${Math.min(totalDraftPersen, 100)}%` }}
              />
            </div>
            <span
              className={`text-[10px] font-bold ${
                totalDraftPersen > 100 ? "text-red-500" : "text-cyan-600"
              }`}
            >
              {totalDraftPersen.toFixed(0)}% / 100%
            </span>
          </div>

          {/* Tambah termin */}
          {drafts.length < KONDISI_OPTIONS.length && (
            <button
              onClick={addDraft}
              className="flex items-center gap-1 text-[10px] font-bold text-cyan-600 hover:text-cyan-700 transition-colors"
            >
              <Plus size={12} />
              Tambah Termin
            </button>
          )}
        </div>

        {createError && (
          <p className="mt-3 text-xs text-red-500">{createError}</p>
        )}

        <button
          onClick={handleCreate}
          disabled={!canSubmitCreate || isCreating}
          className="mt-5 w-full py-2.5 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-40"
        >
          {isCreating ? "Menyimpan..." : "Simpan Termin"}
        </button>
      </div>
    );
  }

  // ─── Render: View / Edit Mode ──────────────────────────────────────────────

  const totalPersen = items.reduce((a, b) => a + b.persentase, 0);
  const terbayar = items
    .filter((i) => i.sudahDibayar)
    .reduce((a, b) => a + b.persentase, 0);
  const aktifIndex = items.findIndex((i) => !i.sudahDibayar);

  // Kondisi yang sudah dipakai (dari server items), untuk dropdown edit
  const usedKondisiServer = items.map((i) => i.namaTermin);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6">
      <div className="mb-6">
        <h3 className="font-bold text-slate-800 text-sm">Progress Termin</h3>
        <p className="text-xs text-gray-400 mt-1">
          Rincian pembayaran digabung ke masing-masing termin agar lebih rapi
          dan mudah dibaca.
        </p>
      </div>

      <div className="bg-cyan-50/50 border border-cyan-100/50 rounded-lg p-3 flex justify-between items-center mb-8">
        <p className="text-[10px] font-bold text-cyan-600">
          {aktifIndex >= 0
            ? `Posisi saat ini berada di Termin ${aktifIndex + 1} dari total ${items.length} termin pembayaran.`
            : "Semua termin telah lunas."}
        </p>
        <p className="text-[10px] font-bold text-cyan-600">
          Terbayar {terbayar.toFixed(0)}% dari {totalPersen.toFixed(0)}%
        </p>
      </div>

      {updateError && (
        <p className="mb-4 text-xs text-red-500">{updateError}</p>
      )}

      <div className="relative space-y-4">
        {items.map((item, index) => {
          const { label, circle, card } = getStatusStyle(
            item.sudahDibayar,
            item.flag,
          );
          const flagInfo = getFlagLabel(item.flag);
          const isExpanded = expanded.includes(item.id);
          const isEditing = !!editingMap[item.id];
          const editDraft = editingMap[item.id];
          const isLocked = item.sudahDibayar;

          // Kondisi yang tersedia untuk dropdown edit item ini
          const availableEditOptions = KONDISI_OPTIONS.filter(
            (opt) =>
              opt === "Lain Lain" ||
              opt === item.namaTermin ||
              !usedKondisiServer.includes(opt),
          );

          return (
            <div key={item.id} className="relative flex gap-4">
              {index !== items.length - 1 && (
                <div className="absolute left-[15px] top-[32px] bottom-[-16px] w-0.5 bg-slate-100" />
              )}

              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold z-10 shrink-0 shadow-sm border-2 ${circle}`}
              >
                {item.index}
              </div>

              <div className="flex-1">
                <div
                  className={`border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 ${
                    isExpanded ? `shadow-md ${card}` : "hover:border-gray-200"
                  }`}
                >
                  {/* Header */}
                  <div
                    className="p-4 flex items-center justify-between cursor-pointer"
                    onClick={() => !isEditing && toggle(item.id)}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-800 text-xs">
                          Termin {item.index}
                        </h4>
                        <Badge
                          className={`text-[9px] font-bold border-0 px-2 py-0.5 rounded-full ${
                            item.sudahDibayar
                              ? "bg-cyan-50 text-cyan-500"
                              : item.flag === "LEWAT"
                                ? "bg-red-50 text-red-500"
                                : "bg-amber-50 text-amber-500"
                          }`}
                        >
                          {label}
                        </Badge>
                        {flagInfo && !item.sudahDibayar && (
                          <Badge
                            className={`text-[9px] font-bold border-0 px-2 py-0.5 rounded-full ${flagInfo.cls}`}
                          >
                            {flagInfo.label}
                          </Badge>
                        )}
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {item.namaTermin}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* Edit / Delete — hanya kalau belum lunas */}
                      {!isLocked && !isEditing && (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              startEdit(item);
                              setExpanded((prev) =>
                                prev.includes(item.id)
                                  ? prev
                                  : [...prev, item.id],
                              );
                            }}
                            className="text-gray-400 hover:text-cyan-500 transition-colors"
                            title="Edit termin"
                          >
                            <Pencil size={13} />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteItem(item.id);
                            }}
                            disabled={isUpdating}
                            className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40"
                            title="Hapus termin"
                          >
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}

                      {isEditing ? (
                        <div
                          className="flex items-center gap-1"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <button
                            onClick={() => saveEdit(item.id)}
                            disabled={isUpdating}
                            className="text-cyan-500 hover:text-cyan-600 transition-colors disabled:opacity-40"
                            title="Simpan"
                          >
                            <Check size={14} />
                          </button>
                          <button
                            onClick={() => cancelEdit(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                            title="Batal"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <div className="text-gray-400">
                          {isExpanded ? (
                            <ChevronUp size={16} />
                          ) : (
                            <ChevronDown size={16} />
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Expanded body */}
                  {isExpanded && (
                    <div className="p-4 pt-0 space-y-3">
                      {isEditing ? (
                        // ── Edit form inline ──────────────────────────────
                        <div className="space-y-3 mt-2">
                          {/* Kondisi */}
                          <div>
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                              Kondisi Termin
                            </label>
                            <select
                              value={editDraft.namaTermin}
                              onChange={(e) =>
                                updateEditDraft(item.id, {
                                  namaTermin: e.target.value,
                                })
                              }
                              className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                            >
                              {availableEditOptions.map((opt) => (
                                <option key={opt} value={opt}>
                                  {opt}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Persentase & Deadline */}
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                Persentase (%)
                              </label>
                              <input
                                type="number"
                                min={1}
                                max={100}
                                value={editDraft.persentase}
                                onChange={(e) =>
                                  updateEditDraft(item.id, {
                                    persentase: e.target.value,
                                  })
                                }
                                className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                              />
                            </div>
                            <div>
                              <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                                Deadline
                              </label>
                              <input
                                type="date"
                                value={editDraft.deadline}
                                onChange={(e) =>
                                  updateEditDraft(item.id, {
                                    deadline: e.target.value,
                                  })
                                }
                                className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                              />
                            </div>
                          </div>

                          {/* Keterangan */}
                          <div>
                            <label className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">
                              Keterangan (opsional)
                            </label>
                            <input
                              type="text"
                              value={editDraft.keterangan}
                              onChange={(e) =>
                                updateEditDraft(item.id, {
                                  keterangan: e.target.value,
                                })
                              }
                              placeholder="Tambah keterangan..."
                              className="mt-1 w-full text-xs font-medium text-slate-800 border border-gray-200 rounded-lg px-3 py-2 bg-white focus:outline-none focus:ring-1 focus:ring-cyan-400"
                            />
                          </div>
                        </div>
                      ) : (
                        // ── View detail ───────────────────────────────────
                        <div className="grid grid-cols-2 gap-3 mt-2">
                          <div className="bg-slate-50/50 border border-gray-50 p-3 rounded-lg">
                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                              Persentase
                            </p>
                            <p className="text-xs font-bold text-slate-800">
                              {item.persentase}%
                            </p>
                          </div>
                          {item.deadline && (
                            <div className="bg-slate-50/50 border border-gray-50 p-3 rounded-lg">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Deadline
                              </p>
                              <p className="text-xs font-bold text-slate-800">
                                {new Date(item.deadline).toLocaleDateString(
                                  "id-ID",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  },
                                )}
                              </p>
                            </div>
                          )}
                          {item.sudahDibayar && item.tanggalDibayar && (
                            <div className="bg-slate-50/50 border border-gray-50 p-3 rounded-lg">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Tanggal Dibayar
                              </p>
                              <p className="text-xs font-bold text-slate-800">
                                {new Date(
                                  item.tanggalDibayar,
                                ).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "long",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                          )}
                          {item.keterangan && (
                            <div className="bg-slate-50/50 border border-gray-50 p-3 rounded-lg col-span-2">
                              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Keterangan
                              </p>
                              <p className="text-xs font-bold text-slate-800">
                                {item.keterangan}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Tandai Lunas */}
                      {canBayar && !item.sudahDibayar && !isEditing && (
                        <button
                          onClick={() => bayar(item.id)}
                          disabled={isBayaring}
                          className="mt-2 w-full py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50"
                        >
                          {isBayaring ? "Memproses..." : "Tandai Lunas"}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
