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

interface AlertDialogTolakProps {
  children: React.ReactNode;
  onConfirm: (alasan: string) => void;
}

export function AlertDialogTolak({ children, onConfirm }: AlertDialogTolakProps) {
  // State untuk menyimpan teks alasan dari textarea
  const [alasan, setAlasan] = React.useState("");

  return (
    <AlertDialog>
      {/* Pemicu Dialog */}
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      {/* p-0 dan gap-0 digunakan agar kita bisa membuat garis batas (border)
        yang membentang penuh dari ujung ke ujung pada Header dan Footer 
      */}
      <AlertDialogContent className="sm:max-w-[500px] p-0 gap-0 rounded-xl overflow-hidden">
        
        {/* --- HEADER --- */}
        <AlertDialogHeader className="p-5 border-b border-slate-100 gap-0! pb-3!">
          <AlertDialogTitle className="text-xl font-bold text-slate-800">
            Tolak Penawaran
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 mt-1.5 text-sm">
            Konfirmasi pengajuan penawaran
          </AlertDialogDescription>
        </AlertDialogHeader>

        {/* --- BODY / CONTENT --- */}
        <div className="p-5 flex flex-col gap-5 py-3">
          
          <p className="text-sm text-slate-600 leading-relaxed">
            Apakah Anda yakin ingin menolak penawaran ini? Tindakan ini akan mengembalikan status penawaran ke pembuat untuk direvisi.
          </p>

          {/* Form Textarea Alasan */}
          <div className="flex flex-col gap-2.5">
            <label className="text-[14px] font-semibold text-slate-700">
              Alasan Penolakan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={alasan}
              onChange={(e) => setAlasan(e.target.value)}
              placeholder="Tuliskan alasan penolakan agar pembuat penawaran dapat memahami keputusan ini..."
              className="w-full min-h-[100px] rounded-lg border border-slate-200 p-3 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none transition-all"
            />
          </div>

        </div>

        {/* --- FOOTER --- */}
        <AlertDialogFooter className="p-4 px-5 border-t border-slate-100 flex justify-end gap-2 bg-slate-50/30">
          
          <AlertDialogCancel 
            className="rounded-xl px-5 border-slate-200 text-slate-600 hover:bg-slate-100 font-medium m-0"
          >
            Batal
          </AlertDialogCancel>
          
          <AlertDialogAction 
            className="rounded-xl bg-[#DC2626]! hover:bg-red-700 text-white px-5 font-medium shadow-sm transition-colors m-0"
            // 1. Logika Disabled: tombol mati jika alasan kosong atau hanya berisi spasi
            disabled={alasan.trim() === ""} 
            onClick={(e) => {
              // 2. Proteksi ekstra: cegah aksi jika ternyata masih kosong
              if (alasan.trim() === "") {
                e.preventDefault(); 
                return;
              }
              
              onConfirm(alasan);
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