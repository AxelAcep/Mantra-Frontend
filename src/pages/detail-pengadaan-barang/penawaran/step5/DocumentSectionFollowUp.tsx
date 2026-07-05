import React, { useRef } from "react";
import { FileText, Upload, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DocumentItem } from "../components";
import type { FollowUpDokumen } from "@/services/follow-up.services";

interface DocumentSectionFollowUpProps {
  dokumen: FollowUpDokumen[];
  isUploading: boolean;
  activityAdmin?: { id: string; judul: string; status: string; createdAt: string; targetSelesai?: string; pegawai?: { nama?: string; divisi?: string } };
  activitySales?: { id: string; judul: string; status: string; createdAt: string; targetSelesai?: string; pegawai?: { nama?: string; divisi?: string } };
  onUpload: (file: File) => void;
  onDelete: (id: string) => void;
}

export default function DocumentSectionFollowUp({
  dokumen,
  isUploading,
  activityAdmin,
  activitySales,
  onUpload,
  onDelete,
}: DocumentSectionFollowUpProps) {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    onUpload(file);
    e.target.value = "";
  }

  const activities = [
    ...(activityAdmin ? [{ ...activityAdmin, role: "Admin Sekretariat" }] : []),
    ...(activitySales ? [{ ...activitySales, role: "Sales PIC" }] : []),
  ];

  const followUpStatus = activitySales?.status === "DITERIMA" ? "SELESAI" : "ON_PROGRESS";

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
              <CheckCircle2 size={13} /> {followUpStatus}
            </button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {activities.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada logbook/daily activity untuk tahap ini.
            </p>
          ) : (
            activities.map((act) => (
              <div
                key={act.id}
                className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500 shrink-0">
                    <FileText size={18} />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      {act.judul}
                    </p>
                    <p className="text-sm text-gray-400">
                      {act.pegawai?.nama ?? "—"} · {act.role} ·{" "}
                      {act.targetSelesai
                        ? new Date(act.targetSelesai).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })
                        : "—"}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => navigate(`/dailyactivity/${act.id}`)}
                  className="text-cyan-500 font-bold text-sm flex items-center gap-1 hover:text-cyan-600"
                >
                  Lihat Detail <ArrowRight size={14} />
                </button>
              </div>
            ))
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
            disabled={isUploading}
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
              Belum ada dokumen pendukung yang diunggah.
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
                onDelete={() => onDelete(item.id)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
