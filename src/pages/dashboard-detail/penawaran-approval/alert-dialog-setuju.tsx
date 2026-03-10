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
interface AlertDialogSetujuProps {
  children: React.ReactNode;
  onConfirm: () => void;
}

export function AlertDialogSetuju({ children, onConfirm }: AlertDialogSetujuProps) {
  return (
    <AlertDialog>
      
      {/* asChild akan mengambil elemen <Button> dari file induk dan menjadikannya pemicu */}
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>

      <AlertDialogContent className="rounded-xl sm:max-w-[425px]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-slate-800 text-lg">
            Setujui Penawaran
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-500 mt-2 text-sm leading-relaxed">
            Apakah Anda yakin ingin menyetujui penawaran untuk aktivitas ini?
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
            Ya, Setujui
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>

    </AlertDialog>
  );
}