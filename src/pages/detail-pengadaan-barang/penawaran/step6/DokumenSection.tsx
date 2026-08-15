import React from "react";
import { FileText, Download } from "lucide-react";
import SectionHeading from "./SectionHeading";

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface DokumenItem {
  name: string;
  uploader: string;
  path: string;
}

interface DokumenSectionProps {
  dokumen: DokumenItem[];
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function DokumenSection({ dokumen }: DokumenSectionProps) {
  return (
    <div className="pt-2">
      <SectionHeading title="Dokumen" />
      <div className="mt-4 bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
            <FileText size={16} className="text-gray-500" />
            Dokumen Pendukung
          </div>
        </div>

        {dokumen.length === 0 ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-full">
              <FileText size={24} className="text-slate-300" />
            </div>
            <p className="text-sm font-medium text-slate-400">
              Belum ada dokumen
            </p>
            <p className="text-xs text-slate-400">
              Upload dokumen pendukung melalui daily activity terkait pembelian,
              pengantaran, atau instalasi
            </p>
          </div>
        ) : (
          <div className="p-2">
            {dokumen.map((doc, i) => (
              <div
                key={i}
                className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg text-gray-500">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-700">
                      {doc.name}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Diunggah oleh {doc.uploader}
                    </p>
                  </div>
                </div>
                <a
                  href={
                    doc.path.startsWith("http")
                      ? doc.path
                      : `${import.meta.env.VITE_API_URL}${doc.path}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors"
                >
                  <Download size={18} />
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
