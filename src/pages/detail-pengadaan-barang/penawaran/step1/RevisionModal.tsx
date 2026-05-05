import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";

interface RevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (alasan: string) => void;
}

export default function RevisionModal({
  isOpen,
  onClose,
  onConfirm,
}: RevisionModalProps) {
  const [alasan, setAlasan] = useState("");

  if (!isOpen) return null;

  function handleConfirm() {
    if (!alasan.trim()) return;
    onConfirm(alasan.trim());
    setAlasan("");
    onClose();
  }

  function handleClose() {
    setAlasan("");
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center">
              <AlertTriangle size={20} className="text-amber-500" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Ajukan Revisi</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Jelaskan alasan revisi yang diperlukan
              </p>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          <label className="text-xs font-bold text-slate-600 uppercase tracking-tight block mb-2">
            Alasan Revisi
          </label>
          <textarea
            value={alasan}
            onChange={(e) => setAlasan(e.target.value)}
            placeholder="Contoh: Data customer tidak lengkap, mohon dilengkapi..."
            rows={4}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          />
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex justify-end gap-2">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition-colors font-medium"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={!alasan.trim()}
            className="px-6 py-2 text-sm bg-amber-500 text-white rounded-xl hover:bg-amber-600 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Kirim Revisi
          </button>
        </div>
      </div>
    </div>
  );
}
