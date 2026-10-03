/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import { ClipboardCheck, CheckCircle2 } from "lucide-react";
import { inputBASTFollowup } from "@/services/follow-up.services";
import { detectBastKategori } from "@/utils/bast-kategori";

interface InputTotalBastFollowUpProps {
  trackingId: string;
  jenisPenawaran: string[];
  totalBast: number | null | undefined;
  totalBastPAC: number | null | undefined;
  totalBastFire: number | null | undefined;
  totalBastBattery?: number | null | undefined;
  canInput: boolean;
  onUpdated: () => void;
}

export default function InputTotalBastFollowUp({
  trackingId,
  jenisPenawaran,
  totalBast,
  totalBastPAC,
  totalBastFire,
  totalBastBattery,
  canInput,
  onUpdated,
}: InputTotalBastFollowUpProps) {
  // >1 kategori garansi terdeteksi (PAC/FIRE/BATTERY, maksimal 3) -> input
  // terpisah per kategori. Kalau cuma 1 kategori / gak ada -> 1 input generik.
  const kategoriList = detectBastKategori(jenisPenawaran);
  const isMulti = kategoriList.length > 1;
  const hasPAC = kategoriList.includes("PAC");
  const hasFire = kategoriList.includes("FIRE");
  const hasBattery = kategoriList.includes("BATTERY");

  const [value, setValue] = useState<number>(totalBast ?? 0);
  const [valuePAC, setValuePAC] = useState<number>(totalBastPAC ?? 0);
  const [valueFire, setValueFire] = useState<number>(totalBastFire ?? 0);
  const [valueBattery, setValueBattery] = useState<number>(totalBastBattery ?? 0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setValue(totalBast ?? 0);
  }, [totalBast]);
  useEffect(() => {
    setValuePAC(totalBastPAC ?? 0);
  }, [totalBastPAC]);
  useEffect(() => {
    setValueFire(totalBastFire ?? 0);
  }, [totalBastFire]);
  useEffect(() => {
    setValueBattery(totalBastBattery ?? 0);
  }, [totalBastBattery]);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      if (isMulti) {
        await inputBASTFollowup(trackingId, {
          ...(hasPAC ? { total_bast_pac: valuePAC } : {}),
          ...(hasFire ? { total_bast_fire: valueFire } : {}),
          ...(hasBattery ? { total_bast_battery: valueBattery } : {}),
        });
      } else {
        await inputBASTFollowup(trackingId, { total_bast: value });
      }
      onUpdated();
    } catch (err: any) {
      setError(err.message ?? "Gagal update Total BAST.");
    } finally {
      setSubmitting(false);
    }
  }

  const isFilled = isMulti
    ? (!hasPAC || totalBastPAC != null) &&
      (!hasFire || totalBastFire != null) &&
      (!hasBattery || totalBastBattery != null)
    : totalBast !== null && totalBast !== undefined;

  const multiTitle = kategoriList
    .map((k) => (k === "PAC" ? "PAC" : k === "FIRE" ? "Fire" : k === "BATTERY" ? "Battery" : k))
    .join(" & ");

  const kategoriInputStyle =
    "w-32 px-3 py-2 bg-slate-50/60 border border-gray-100 rounded-lg text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-100 focus:border-cyan-300 disabled:opacity-50";

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
          <ClipboardCheck size={16} className="text-gray-500" />
          {isMulti ? `Total Termin BAST (${multiTitle})` : "Total Termin BAST"}
        </div>

        {isFilled && (
          <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
            <CheckCircle2 size={13} /> Terisi
          </span>
        )}
      </div>

      <div className="p-4">
        {canInput ? (
          <div className="flex flex-wrap items-end gap-3">
            {isMulti ? (
              <>
                {hasPAC && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                      Total BAST PAC
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={valuePAC}
                      onChange={(e) => setValuePAC(Number(e.target.value))}
                      disabled={submitting}
                      className={kategoriInputStyle}
                    />
                  </div>
                )}
                {hasFire && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                      Total BAST Fire
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={valueFire}
                      onChange={(e) => setValueFire(Number(e.target.value))}
                      disabled={submitting}
                      className={kategoriInputStyle}
                    />
                  </div>
                )}
                {hasBattery && (
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                      Total BAST Battery
                    </label>
                    <input
                      type="number"
                      min={0}
                      value={valueBattery}
                      onChange={(e) => setValueBattery(Number(e.target.value))}
                      disabled={submitting}
                      className={kategoriInputStyle}
                    />
                  </div>
                )}
              </>
            ) : (
              <input
                type="number"
                min={0}
                value={value}
                onChange={(e) => setValue(Number(e.target.value))}
                disabled={submitting}
                className={kategoriInputStyle}
              />
            )}
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
        ) : isMulti ? (
          <div className="flex flex-wrap gap-3">
            {hasPAC && (
              <div className="bg-slate-50/60 rounded-xl border border-gray-100 px-4 py-3 w-fit">
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Total BAST PAC
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {totalBastPAC ?? "-"}
                </p>
              </div>
            )}
            {hasFire && (
              <div className="bg-slate-50/60 rounded-xl border border-gray-100 px-4 py-3 w-fit">
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Total BAST Fire
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {totalBastFire ?? "-"}
                </p>
              </div>
            )}
            {hasBattery && (
              <div className="bg-slate-50/60 rounded-xl border border-gray-100 px-4 py-3 w-fit">
                <p className="text-xs text-gray-400 font-medium mb-1">
                  Total BAST Battery
                </p>
                <p className="text-sm font-bold text-slate-800">
                  {totalBastBattery ?? "-"}
                </p>
              </div>
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
