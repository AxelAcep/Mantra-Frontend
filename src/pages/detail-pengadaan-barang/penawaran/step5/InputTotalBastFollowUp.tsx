/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ClipboardCheck, CheckCircle2 } from "lucide-react";
import { inputBASTFollowup } from "@/services/follow-up.services";

interface InputTotalBastFollowUpProps {
  trackingId: string;
  totalBast: number | null | undefined;
  canInput: boolean;
  onUpdated: () => void;
}

export default function InputTotalBastFollowUp({
  trackingId,
  totalBast,
  canInput,
  onUpdated,
}: InputTotalBastFollowUpProps) {
  const [value, setValue] = useState<number>(totalBast ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(totalBast ?? 0);
  }, [totalBast]);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      await inputBASTFollowup(trackingId, { total_bast: value });
      onUpdated();
    } catch (err: any) {
      setError(err.message ?? "Gagal update Total BAST.");
    } finally {
      setSubmitting(false);
    }
  }

  const isFilled = totalBast !== null && totalBast !== undefined;

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
          <ClipboardCheck size={16} className="text-gray-500" />
          Total Termin BAST
        </div>

        {isFilled && (
          <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <CheckCircle2 size={13} /> Terisi
          </span>
        )}
      </div>

      <div className="p-4">
        {canInput ? (
          <div className="flex items-center gap-3">
            <input
              type="number"
              min={0}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              disabled={submitting}
              className="w-32 px-3 py-2 bg-slate-50/60 border border-gray-100 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300 disabled:opacity-50"
            />
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? "Menyimpan..." : "Simpan"}
            </button>
            {error && (
              <p className="text-xs text-red-500 font-medium">{error}</p>
            )}
          </div>
        ) : (
          <div className="bg-slate-50/60 rounded-xl border border-gray-100 px-4 py-3 w-fit">
            <p className="text-xs text-gray-400 font-medium mb-1">Total BAST</p>
            <p className="text-sm font-bold text-slate-800">
              {totalBast ?? "-"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
