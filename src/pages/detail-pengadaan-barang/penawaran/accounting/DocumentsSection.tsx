import React from "react";
import { FileText, Upload, Download, Trash2 } from "lucide-react";

interface Dokumen {
  id: string;
  namaFile: string;
  path: string;
  createdAt: string;
}

interface Props {
  dokumen?: Dokumen[]; // biar aman kalau null/undefined
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
}

export default function DocumentSection({
  dokumen = [],
  onUpload,
  onDelete,
  isUploading,
}: Props) {
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
        </div>

        <label className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline cursor-pointer">
          <Upload size={14} />
          {isUploading ? "Mengupload..." : "Upload File"}

          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </div>

      <div className="p-4 space-y-2">
        {dokumen.length === 0 && (
          <p className="text-xs text-gray-400 text-center py-4">
            Belum ada dokumen.
          </p>
        )}

        {dokumen.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
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
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onDelete(doc.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={18} />
              </button>

              <a
                href={doc.path}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
              >
                <Download size={18} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
