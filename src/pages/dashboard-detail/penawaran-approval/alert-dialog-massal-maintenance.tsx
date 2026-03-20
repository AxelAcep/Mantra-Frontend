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
import React from "react";

// Definisikan tipe props yang akan diterima komponen ini
interface AlertDialogMassalProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

export function AlertDialogMassalMaintenance({ children, onConfirm }: AlertDialogMassalProps) {
  return (
    <AlertDialog>

      {/* asChild akan mengambil elemen <Button> dari file induk dan menjadikannya pemicu */}
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-xl sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-800 text-lg">
            Konfirmasi Persetujuan Massal
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 mt-2 text-sm leading-relaxed">
            Apakah Anda yakin ingin mengonfirmasi bahwa seluruh <strong>Penawaran Maintenance</strong> dalam daftar ini telah selesai?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 gap-2">
          <AlertDialogCancel className="rounded-full text-xs font-medium border-slate-200 text-slate-600 hover:bg-slate-50">
            Batal
          </AlertDialogCancel>

          <AlertDialogAction
            className="rounded-full bg-cyan-500! hover:bg-cyan-600! text-white! text-xs font-medium shadow-sm"
            onClick={onConfirm}
          >
            Ya, Konfirmasi Semua
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  );
}