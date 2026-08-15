import React, { useRef } from "react";
import { FileText, Upload, Download, Trash2, ArrowRight, CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DokumenItem {
  id: string;
  namaFile: string;
  path: string;
  createdAt: string;
}

interface ActivityAdmin {
  id: string;
  judul: string;
  status: string;
  targetSelesai?: string;
  pegawai?: { nama?: string; divisi?: string };
}

interface Props {
  dokumen: DokumenItem[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
  activityAdmin?: ActivityAdmin | null;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export default function DocumentSectionPersetujuan({
  dokumen,
  onUpload,
  onDelete,
  isUploading,
  activityAdmin,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      {/* Card Pemantauan Daily Admin */}
      {activityAdmin && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
              <FileText size={16} className="text-gray-500" />
              Logbook Operasional
            </div>
            <div className="flex gap-2">
              {activityAdmin.status === "DITERIMA" || activityAdmin.status === "Diterima" ? (
                <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <CheckCircle2 size={13} /> Diterima
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-amber-50 text-amber-600 border-amber-100">
                  {activityAdmin.status.replace(/_/g, " ")}
                </span>
              )}
            </div>
          </div>
          <div className="p-2">
            <div className="flex items-center justify-between bg-white rounded-xl p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    {activityAdmin.judul}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activityAdmin.pegawai?.nama ?? "—"} ·{" "}
                    {activityAdmin.pegawai?.divisi ?? "—"} ·{" "}
                    {activityAdmin.targetSelesai
                      ? new Date(
                        activityAdmin.targetSelesai,
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
                  onClick={() => navigate(`/dailyactivity/${activityAdmin.id}`)}
                  className="text-cyan-500 font-bold text-xs flex items-center gap-1 hover:text-cyan-600"
                >
                  Lihat Detail <ArrowRight size={14} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dokumen Pendukung */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
            <FileText size={16} className="text-gray-500" />
            Dokumen Pendukung
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline disabled:opacity-50"
          >
            <Upload size={14} />
            {isUploading ? "Mengupload..." : "Upload File"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="p-2">
          {dokumen.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-6">
              Belum ada dokumen diunggah.
            </p>
          ) : (
            dokumen.map((doc) => (
              <div
                key={doc.id}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {doc.namaFile}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {new Date(doc.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onDelete(doc.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                  <a
                    href={`${BASE_URL}${doc.path}`}
                    download={doc.namaFile}
                    className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                  >
                    <Download size={18} />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
