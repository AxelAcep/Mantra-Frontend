/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { User, Pencil, Check, X, Loader2 } from "lucide-react";
import { useFollowUpAdmin } from "@/hooks/use-followUp-admin";

interface ManagerProyekCardProps {
  followUpId: string;
  currentNama?: string;
  onAssigned?: () => void;
}

export default function ManagerProyekCard({
  followUpId,
  currentNama,
  onAssigned,
}: ManagerProyekCardProps) {
  const [isEditing, setIsEditing] = useState(false);

  const {
    pegawaiList,
    loadingPegawai,
    errorPegawai,
    selectedPegawaiId,
    setSelectedPegawaiId,
    assigning,
    errorAssign,
    assignSuccess,
    handleAssign,
  } = useFollowUpAdmin(followUpId);

  useEffect(() => {
    if (assignSuccess) {
      setIsEditing(false);
      onAssigned?.();
    }
  }, [assignSuccess, onAssigned]);

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-sm">
          <User size={16} className="text-cyan-500" /> Manager Proyek
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="text-slate-400 hover:text-cyan-500 transition-colors"
            title="Edit Manager Proyek"
          >
            <Pencil size={15} />
          </button>
        )}
      </div>

      {!isEditing ? (
        <p className="text-sm font-bold text-slate-800 leading-tight">
          {currentNama || "Belum ditugaskan"}
        </p>
      ) : (
        <div className="space-y-3">
          {loadingPegawai ? (
            <p className="text-sm text-gray-400">Memuat daftar pegawai...</p>
          ) : errorPegawai ? (
            <p className="text-sm text-red-500">{errorPegawai}</p>
          ) : (
            <select
              value={selectedPegawaiId}
              onChange={(e) => setSelectedPegawaiId(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            >
              <option value="">Pilih Manager Proyek</option>
              {pegawaiList.map((p) => (
                <option key={p.pegawaiId} value={p.pegawaiId}>
                  {p.nama}
                </option>
              ))}
            </select>
          )}

          {errorAssign && <p className="text-sm text-red-500">{errorAssign}</p>}

          <div className="flex items-center gap-2">
            <button
              onClick={handleAssign}
              disabled={assigning || !selectedPegawaiId}
              className="flex items-center gap-1 px-3 py-1.5 bg-cyan-500 text-white text-sm font-medium rounded-lg hover:bg-cyan-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {assigning ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Check size={14} />
              )}
              Simpan
            </button>
            <button
              onClick={() => setIsEditing(false)}
              disabled={assigning}
              className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X size={14} />
              Batal
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
