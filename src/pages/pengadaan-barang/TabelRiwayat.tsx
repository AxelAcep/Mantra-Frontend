import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TableRiwayat() {

  return (
    <div className="overflow-x-auto bg-white rounded-xl border border-gray-100 shadow-sm">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-b border-gray-100">
          <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <th className="px-6 py-4">Nomor PO ↕</th>
            <th className="px-6 py-4">Perusahaan ↕</th>
            <th className="px-6 py-4">Jenis Pengadaan ↕</th>
            <th className="px-6 py-4">Tanggal Pesan ↕</th>
            <th className="px-6 py-4">Tanggal Serah Terima ↕</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {[1, 2, 3, 4, 5, 6].map((_, idx) => (
            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-5 font-bold text-slate-700 uppercase">PO-2023-10-00{idx + 1}</td>
              <td className="px-6 py-5 font-bold text-slate-700">PT Maju Sejahtera</td>
              <td className="px-6 py-5">
                 <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                    PAC MONTAIR
                 </span>
              </td>
              <td className="px-6 py-5 text-gray-500 font-medium">20 Okt 2023</td>
              <td className="px-6 py-5 text-gray-500 font-medium">23 Okt 2023</td>
              <td className="px-6 py-5 text-right">
                <Link to="#" className="inline-flex items-center gap-1 text-cyan-500 font-bold hover:text-cyan-600 transition-colors">
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