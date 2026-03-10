import React from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { AlertTriangle } from "lucide-react";

// Mengubah nama interface untuk penyesuaian (Opsional)
interface AlertDialogTolakRescheduleProps {
  children: React.ReactNode;
  onConfirm: (alasan: string) => void;
}

export function AlertDialogTolakReschedule({ children, onConfirm }: AlertDialogTolakRescheduleProps) {
  // State untuk menyimpan teks alasan dari textarea
  const [alasan, setAlasan] = React.useState("");

  return (
    <AlertDialog>
      {/* Pemicu Dialog */}
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-xl overflow-hidden">
        
        {/* --- HEADER --- */}
        <AlertDialogHeader className="p-5 border-b border-slate-100 gap-0! pb-3!">
          <AlertDialogTitle className="text-xl font-bold text-slate-800">
            Tolak Pengajuan Reschedule
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 mt-1.5 text-sm">
            Konfirmasi penolakan jadwal baru.
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* --- BODY / CONTENT --- */}
        <div className="p-5 flex flex-col gap-5 py-3">
          
          {/* Warning Box (Kotak Perhatian Merah) */}
          <div className="bg-red-50/80 border border-red-100 rounded-lg p-4 flex gap-3 items-start">
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex flex-col">
              <span className="font-semibold text-red-800 text-sm tracking-tight">
                Perhatian
              </span>
              <span className="text-red-600 text-[13px] mt-1 leading-relaxed">
                Aksi ini akan mengirim notifikasi penolakan kepada karyawan yang bersangkutan.
              </span>
            </div>
          </div>

          {/* Form Textarea Alasan */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-semibold text-slate-700">
              Alasan Penolakan <span className="text-slate-400 font-normal">(Opsional)</span>
            </label>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Tuliskan alasan penolakan agar karyawan dapat memahami keputusan ini..."
              className="w-full min-h-[100px] rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all"
            />
          </div>

        </div>

        {/* --- FOOTER --- */}
        <AlertDialogFooter className="py-3 px-5 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/30">
          
          {/* AlertDialogCancel otomatis memiliki fungsi tutup (close) */}
          <AlertDialogCancel 
            className="rounded-xl px-5 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium m-0"
          >
            Batal
          </AlertDialogCancel>
          
          {/* AlertDialogAction juga otomatis menutup modal ketika diklik */}
          <AlertDialogAction 
            className="rounded-xl bg-[#DC2626]! hover:bg-red-700 text-white px-5 font-medium shadow-sm transition-colors m-0"
            onClick={() => {
              onConfirm(alasan);
              // Reset textarea setelah dikirim
              setAlasan("");
            }}
          >
            Konfirmasi Tolak
          </AlertDialogAction>

        </AlertDialogFooter>

      </AlertDialogContent>
    </AlertDialog>
  );
}