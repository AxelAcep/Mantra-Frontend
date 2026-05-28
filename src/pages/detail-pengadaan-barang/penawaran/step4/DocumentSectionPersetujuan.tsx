import React, { useRef } from "react";
import { FileText, Upload, Download, Trash2 } from "lucide-react";

interface DokumenItem {
  id: string;
  namaFile: string;
  path: string;
  createdAt: string;
}

interface Props {
  dokumen: DokumenItem[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
  isUploading: boolean;
}

const BASE_URL = import.meta.env.VITE_API_URL;

export default function DocumentSectionPersetujuan({
  dokumen,
  onUpload,
  onDelete,
  isUploading,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
    e.target.value = "";
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FileText size={16} className="text-cyan-500" />
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

      <div className="p-4 space-y-1">
        {dokumen.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            Belum ada dokumen diunggah.
          </p>
        ) : (
          dokumen.map((doc) => (
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
  );
}
