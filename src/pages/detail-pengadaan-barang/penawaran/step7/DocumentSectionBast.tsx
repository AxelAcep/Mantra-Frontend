import React from "react";
import { FileText, Download } from "lucide-react";

interface ActivityDokumen {
  id: string;
  namaFile: string;
  path: string;
  uploadedBy: string;
  pegawai?: { nama: string };
  createdAt: string;
}

interface DocumentSectionBastProps {
  dokumen: ActivityDokumen[];
}

export default function DocumentSectionBast({
  dokumen,
}: DocumentSectionBastProps) {
  if (dokumen.length === 0) {
    return (
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6 text-center text-sm text-gray-400">
        Belum ada dokumen yang diunggah.
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden mt-6">
      <div className="p-4 bg-white border-b border-gray-100/80 flex items-center gap-2 font-bold text-slate-800 text-sm">
        <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
      </div>

      <div className="p-4 divide-y divide-gray-50">
        {dokumen.map((doc) => {
          const d = doc.createdAt ? new Date(doc.createdAt) : null;
          const uploadedDate = d
            ? `${d.toLocaleDateString("id-ID", { day: "numeric", month: "short" })}, ${d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })}`
            : "-";

          return (
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
                    Diunggah oleh {doc.pegawai?.nama ?? "-"} • {uploadedDate}
                  </p>
                </div>
              </div>
              <a
                href={doc.path}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
              >
                <Download size={18} />
              </a>
            </div>
          );
        })}
      </div>
    </div>
  );
}
