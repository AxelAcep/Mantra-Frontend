import React, { useState } from "react";
import { Ban, AlertTriangle } from "lucide-react";

interface BatalkanPermintaanCardProps {
  isBatalkan: boolean;
  onConfirm: (alasan: string) => void;
}

export default function BatalkanPermintaanCard({
  isBatalkan,
  onConfirm,
}: BatalkanPermintaanCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [alasan, setAlasan] = useState("");

  function handleClose() {
    setAlasan("");
    setIsOpen(false);
  }

  function handleConfirm() {
    if (!alasan.trim()) return;
    onConfirm(alasan.trim());
    setAlasan("");
    setIsOpen(false);
  }

  return (
    <>
      <div className="flex justify-end">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors"
        >
          <Ban size={16} />
          Case Closed
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-500" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800">
                    Case Closed
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Tindakan ini permanen — penawaran tidak bisa dilanjutkan lagi
                    setelah ditutup.
                  </p>
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              <label className="text-xs font-bold text-slate-600 uppercase tracking-tight block mb-2">
                Alasan Case Closed
              </label>
              <textarea
                value={alasan}
                onChange={(e) => setAlasan(e.target.value)}
                placeholder="Contoh: Customer membatalkan proyek, budget tidak disetujui, dsb..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              />
            </div>

            {/* Footer */}
            <div className="px-6 pb-6 flex justify-end gap-2">
              <button
                onClick={handleClose}
                disabled={isBatalkan}
                className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleConfirm}
                disabled={!alasan.trim() || isBatalkan}
                className="px-6 py-2 text-sm bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBatalkan ? "Menutup..." : "Ya, Tutup"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
