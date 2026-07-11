import React from 'react';
import { ShieldAlert, Lock } from 'lucide-react';

interface StepRestrictedProps {
  currentStepName?: string;
}

export default function StepRestricted({ currentStepName }: StepRestrictedProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 bg-white border border-dashed border-gray-200 rounded-3xl shadow-sm">
      <div className="relative mb-6">
        <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center">
          <Lock className="w-10 h-10 text-slate-300" />
        </div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
          <ShieldAlert className="w-4 h-4 text-amber-600" />
        </div>
      </div>

      <h2 className="text-2xl font-bold text-slate-800 mb-3 text-center">
        Tahap Tidak Dapat Diakses
      </h2>

      <p className="text-slate-500 text-center max-w-md leading-relaxed font-medium">
        Maaf, Anda belum bisa mengakses detail dari tahapan ini.
        Saat ini proses pengadaan barang masih berada di <span className="text-cyan-600 font-bold">{currentStepName || "Tahap Sebelumnya"}</span>.
      </p>
    </div>
  );
}
