import React from 'react';
import { ShieldAlert, Lock, AlertCircle } from 'lucide-react';

export default function StepRestricted() {
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
        Akses Terbatas
      </h2>

      <p className="text-slate-500 text-center max-w-md leading-relaxed">
        Maaf, Anda tidak memiliki izin untuk melihat detail dari tahapan ini.
        Akses ini dibatasi berdasarkan peran (role) Anda dalam sistem.
      </p>
    </div>
  );
}
