import React from "react";
import { useNavigate } from "react-router-dom";
import { FileText, Download, ArrowRight, CheckCircle2 } from "lucide-react";

interface ActivityDokumen {
  id: string;
  namaFile: string;
  path: string;
  uploadedBy: string;
  pegawai?: { nama: string };
  createdAt: string;
}

interface ActivityAdminProyek {
  id: string;
  judul: string;
  status: string;
  targetSelesai?: string;
  pegawai?: { nama?: string; divisi?: string };
  dokumen?: ActivityDokumen[];
}

interface DocumentSectionBastProps {
  activityAdminProyek?: ActivityAdminProyek | null;
}

export default function DocumentSectionBast({
  activityAdminProyek,
}: DocumentSectionBastProps) {
  const navigate = useNavigate();
  const dokumen = activityAdminProyek?.dokumen ?? [];

  return (
    <div className="space-y-6 mt-6">
      {/* Logbook Operasional */}
      {activityAdminProyek && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
            <div className="flex items-center gap-2 font-bold text-slate-800 text-[0.75rem]">
              <FileText size={16} className="text-gray-500" />
              Logbook Operasional
            </div>
            <div className="flex gap-2">
              {activityAdminProyek.status === "DITERIMA" ? (
                <span className="flex items-center gap-1.5 bg-green-50 text-green-600 px-3 py-1.5 rounded-lg text-xs font-semibold">
                  <CheckCircle2 size={13} /> Diterima
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border bg-amber-50 text-amber-600 border-amber-100">
                  {activityAdminProyek.status.replace(/_/g, " ")}
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
                    {activityAdminProyek.judul}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {activityAdminProyek.pegawai?.nama ?? "—"} ·{" "}
                    {activityAdminProyek.pegawai?.divisi ?? "—"} ·{" "}
                    {activityAdminProyek.targetSelesai
                      ? new Date(
                          activityAdminProyek.targetSelesai,
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
              <button
                onClick={() =>
                  navigate(`/dailyactivity/${activityAdminProyek.id}`)
                }
                className="text-cyan-500 font-bold text-xs flex items-center gap-1 hover:text-cyan-600 shrink-0"
              >
                Lihat Detail <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dokumen Pendukung */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex items-center gap-2 font-bold text-slate-800 text-sm">
          <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
        </div>

        {dokumen.length === 0 ? (
          <p className="text-xs text-gray-400 text-center py-6">
            Belum ada dokumen yang diunggah.
          </p>
        ) : (
          <div className="p-2 divide-y divide-gray-50">
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
                        Diunggah oleh {doc.pegawai?.nama ?? "-"} •{" "}
                        {uploadedDate}
                      </p>
                    </div>
                  </div>
                  href={doc.path}
                  target="_blank" rel="noopener noreferrer" className="p-2
                  text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded
                  transition-colors"
                  <a>
                    <Download size={18} />
                  </a>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
