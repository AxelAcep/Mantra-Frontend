import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TableImplementasi() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-y border-gray-100">
          <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <th className="px-6 py-4">Nomor PO ↕</th>
            <th className="px-6 py-4">Nama Perusahaan ↕</th>
            <th className="px-6 py-4">Lokasi Proyek ↕</th>
            <th className="px-6 py-4 text-center">Jenis Pengadaan ↕</th>
            <th className="px-6 py-4 text-center">Jenis Proyek ↕</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {[1, 2, 3].map((_, idx) => (
            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-5 font-bold text-slate-700 uppercase">PO-IMP-2310-001</td>
              <td className="px-6 py-5 font-bold text-slate-700">PT Maju Bersama</td>
              <td className="px-6 py-5 text-gray-500 font-medium">Gedung Pusat Lt. 5</td>
              <td className="px-6 py-5">
                <div className="flex justify-center">
                   <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                    PAC MONTAIR
                   </span>
                </div>
              </td>
              <td className="px-6 py-5">
                 <div className="flex justify-center">
                    <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      INSTALASI BARU
                    </span>
                 </div>
              </td>
              <td className="px-6 py-5 text-right">
                <Link to={`/Pengadaan/Implementasi/1`} className="inline-flex items-center gap-1 text-cyan-500 font-bold hover:text-cyan-600 transition-colors">
                  Lihat Detail <ArrowRight size={14} />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}