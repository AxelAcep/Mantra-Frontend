import React, { useRef } from "react";
import { FileText, Upload, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DocumentItem } from "../components";
import type { PenawaranDokumen } from "@/services/penawaran.services";
import {
  useUploadPenawaranDokumen,
  useDeletePenawaranDokumen,
} from "@/hooks/use-penawaran";

interface DocumentSectionProps {
  trackingId: string;
  permintaanMasukId?: string;
  status?: string;
  dokumen: PenawaranDokumen[];
  activity?: {
    id: string;
    judul: string;
    createdAt: string;
  };
}

export default function DocumentSection({
  trackingId,
  permintaanMasukId,
  dokumen,
  activity,
  status,
}: DocumentSectionProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { mutate: upload, isPending: isUploading } =
    useUploadPenawaranDokumen(trackingId);

  const { mutate: deleteDok } = useDeletePenawaranDokumen(trackingId);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !permintaanMasukId) return;
    upload({ permintaanMasukId, file });
    e.target.value = "";
  }

  return (
    <div className="space-y-6">
      {/* ── Logbook Operasional ── */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <FileText size={16} className="text-cyan-500" />
            Logbook Operasional
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 bg-cyan-50 text-cyan-600 text-[11px] font-bold px-3 py-2 rounded-lg border border-cyan-100 hover:bg-cyan-100 transition-colors">
              <CheckCircle2 size={13} /> {status ?? "-"}
            </button>
          </div>
        </div>

        <div className="p-6">
          {activity ? (
            <div className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                  <FileText size={18} />
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-800">
                    {activity.judul}
                  </p>
                  <p className="text-sm text-gray-400">
                    {new Date(activity.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <button
                onClick={() => navigate(`/dailyactivity/${activity.id}`)}
                className="text-cyan-500 font-bold text-sm flex items-center gap-1 hover:text-cyan-600"
              >
                Lihat Detail <ArrowRight size={14} />
              </button>
            </div>
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada logbook.
            </p>
          )}
        </div>
      </div>

      {/* ── Dokumen Pendukung ── */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <FileText size={16} className="text-cyan-500" />
            Dokumen Pendukung
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || !permintaanMasukId}
            className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={14} />
            {isUploading ? "Mengupload..." : "Upload File"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar"
          />
        </div>

        <div className="p-4 space-y-1">
          {dokumen.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada dokumen.
            </p>
          ) : (
            dokumen.map((item) => (
              <DocumentItem
                key={item.id}
                name={item.namaFile}
                size={new Date(item.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
                path={item.path}
                allowDelete={true}
                onDelete={() =>
                  deleteDok({
                    permintaanMasukId: permintaanMasukId!,
                    dokumenId: item.id,
                  })
                }
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
