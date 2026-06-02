import React, { useRef } from "react";
import { FolderOpen, Upload, FileText, Download, Trash2 } from "lucide-react";

interface Dokumen {
  id: string;
  namaFile: string;
  path: string;
  createdAt: string;
}

interface Props {
  dokumen: Dokumen[];
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
  isUploading?: boolean;
}

export default function DocumentSectionReviewInternal({
  dokumen,
  onUpload,
  onDelete,
  isUploading,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
        <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FolderOpen size={16} className="text-cyan-500" /> Dokumen Pendukung
        </div>
        <button
          onClick={() => fileRef.current?.click()}
          disabled={isUploading}
          className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline disabled:opacity-50"
        >
          <Upload size={14} /> {isUploading ? "Mengupload..." : "Upload File"}
        </button>
        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            if (e.target.files?.[0]) onUpload(e.target.files[0]);
            e.target.value = "";
          }}
        />
      </div>

      <div className="p-4 space-y-1">
        {dokumen.length === 0 ? (
          <p className="text-center text-sm text-gray-400 py-6">
            Belum ada dokumen.
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
                  href={`${import.meta.env.VITE_API_URL}${doc.path}`}
                  target="_blank"
                  rel="noreferrer"
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
