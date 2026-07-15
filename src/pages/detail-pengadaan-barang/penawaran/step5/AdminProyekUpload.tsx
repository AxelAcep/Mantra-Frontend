import React, { useRef } from "react";
import { FileText, Upload } from "lucide-react";
import { DocumentItem } from "../components";

interface AdminProyekUploadProps {
  dokumen: { id: string; namaFile: string; kategori?: string; path: string; createdAt?: string; pegawai?: any; uploadedBy?: string }[];
  isUploading: boolean;
  isAdminProyek: boolean;
  onUpload: (file: File, kategori: string) => void;
  onDelete: (id: string) => void;
}

export default function AdminProyekUpload({
  dokumen,
  isUploading,
  isAdminProyek,
  onUpload,
  onDelete,
}: AdminProyekUploadProps) {
  const pgaRef = useRef<HTMLInputElement>(null);
  const financeRef = useRef<HTMLInputElement>(null);

  const docPGA = dokumen.find((d) => d.kategori === "DOKUMEN_PO_PGA");
  const docFinance = dokumen.find((d) => d.kategori === "DOKUMEN_PO_FINANCE");

  const currentPegawaiId = React.useMemo(() => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      return user.pegawai?.id ?? "";
    } catch {
      return "";
    }
  }, []);

  const formatDateTime = (isoString?: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    const dateStr = date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
    const timeStr = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
    return `${dateStr} pukul ${timeStr}`;
  };

  const getUploaderInfo = (doc: any) => {
    return `${doc.pegawai?.nama || doc.uploadedBy || "System"} pada ${formatDateTime(doc.createdAt)}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, kategori: string) => {
    if (e.target.files && e.target.files.length > 0) {
      onUpload(e.target.files[0], kategori);
    }
    e.target.value = "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Kolom Admin PGA */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <FileText size={16} className="text-cyan-500" />
            Dokumen PO untuk Admin PGA
          </div>
          <button
            onClick={() => pgaRef.current?.click()}
            disabled={isUploading || !isAdminProyek}
            className={`text-xs font-bold flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed ${!isAdminProyek ? "text-gray-400" : "text-cyan-500"}`}
          >
            <Upload size={14} />
            {isUploading ? "Mengupload..." : "Upload File"}
          </button>
          <input
            type="file"
            className="hidden"
            ref={pgaRef}
            onChange={(e) => handleFileChange(e, "DOKUMEN_PO_PGA")}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar"
          />
        </div>

        <div className="p-4 space-y-1">
          {docPGA ? (
            <DocumentItem
              name={docPGA.namaFile}
              size={getUploaderInfo(docPGA)}
              path={docPGA.path}
              allowDelete={currentPegawaiId === docPGA.uploadedBy}
              onDelete={() => onDelete(docPGA.id)}
            />
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada dokumen PO untuk Admin PGA yang diunggah.
            </p>
          )}
        </div>
      </div>

      {/* Kolom Finance */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
          <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
            <FileText size={16} className="text-cyan-500" />
            Dokumen PO untuk Finance
          </div>
          <button
            onClick={() => financeRef.current?.click()}
            disabled={isUploading || !isAdminProyek}
            className={`text-xs font-bold flex items-center gap-1 hover:underline disabled:opacity-50 disabled:cursor-not-allowed ${!isAdminProyek ? "text-gray-400" : "text-cyan-500"}`}
          >
            <Upload size={14} />
            {isUploading ? "Mengupload..." : "Upload File"}
          </button>
          <input
            type="file"
            className="hidden"
            ref={financeRef}
            onChange={(e) => handleFileChange(e, "DOKUMEN_PO_FINANCE")}
            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.png,.jpg,.jpeg,.gif,.webp,.svg,.zip,.rar"
          />
        </div>

        <div className="p-4 space-y-1">
          {docFinance ? (
            <DocumentItem
              name={docFinance.namaFile}
              size={getUploaderInfo(docFinance)}
              path={docFinance.path}
              allowDelete={currentPegawaiId === docFinance.uploadedBy}
              onDelete={() => onDelete(docFinance.id)}
            />
          ) : (
            <p className="text-sm text-slate-400 text-center py-4">
              Belum ada dokumen PO untuk Finance yang diunggah.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
