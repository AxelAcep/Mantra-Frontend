/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Truck, CheckCircle2 } from "lucide-react";
import { useSetKondisiPengantaran } from "@/hooks/use-follow-up";

interface KondisiPengantaranCardProps {
  trackingId: string;
  kondisiPengantaran?: "SEBELUM_DP" | "SESUDAH_DP" | null;
  canInput: boolean;
  onUpdated: () => void;
}

export default function KondisiPengantaranCard({
  trackingId,
  kondisiPengantaran,
  canInput,
  onUpdated,
}: KondisiPengantaranCardProps) {
  const [selected, setSelected] = useState<
    "SEBELUM_DP" | "SESUDAH_DP" | null
  >(kondisiPengantaran ?? null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const setKondisiMut = useSetKondisiPengantaran(trackingId);

  const isFilled = kondisiPengantaran != null;

  async function handleSubmit() {
    if (!selected) return;
    setSubmitting(true);
    setError(null);
    try {
      await setKondisiMut.mutateAsync({ kondisiPengantaran: selected });
      onUpdated();
    } catch (err: any) {
      setError(err.message ?? "Gagal menyimpan kondisi pengantaran.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
          <Truck size={16} className="text-gray-500" />
          Kondisi Pengantaran Barang
        </div>

        {isFilled && (
          <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <CheckCircle2 size={13} /> Terisi
          </span>
        )}
      </div>

      <div className="p-4">
        {canInput ? (
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setSelected("SEBELUM_DP")}
              disabled={submitting}
              className={`flex-1 min-w-[160px] px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                selected === "SEBELUM_DP"
                  ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                  : "border-gray-100 bg-slate-50/60 text-slate-600 hover:border-gray-200"
              } disabled:opacity-50`}
            >
              Diantar Sebelum DP
            </button>
            <button
              type="button"
              onClick={() => setSelected("SESUDAH_DP")}
              disabled={submitting}
              className={`flex-1 min-w-[160px] px-4 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                selected === "SESUDAH_DP"
                  ? "border-cyan-400 bg-cyan-50 text-cyan-700"
                  : "border-gray-100 bg-slate-50/60 text-slate-600 hover:border-gray-200"
              } disabled:opacity-50`}
            >
              Diantar Setelah Klien DP
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting || !selected}
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-4 py-2.5 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>
        ) : (
          <div className="bg-slate-50/60 rounded-xl border border-gray-100 px-4 py-3 w-fit">
            <p className="text-xs text-gray-400 font-medium mb-1">
              Kondisi Pengantaran
            </p>
            <p className="text-sm font-bold text-slate-800">
              {kondisiPengantaran === "SESUDAH_DP"
                ? "Diantar Setelah Klien DP"
                : kondisiPengantaran === "SEBELUM_DP"
                  ? "Diantar Sebelum DP"
                  : "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
