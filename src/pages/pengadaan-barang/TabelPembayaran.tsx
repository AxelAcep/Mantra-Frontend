import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TablePembayaran() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-y border-gray-100">
          <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <th className="px-6 py-4">Nomor PO ↕</th>
            <th className="px-6 py-4">Jenis Pengadaan ↕</th>
            <th className="px-6 py-4 text-right">Total Nilai ↕</th>
            <th className="px-6 py-4 text-center">Termin Ke ↕</th>
            <th className="px-6 py-4 text-center">Status ↕</th>
            <th className="px-6 py-4">Jatuh Tempo ↕</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {[1, 2, 3].map((_, idx) => (
            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
              <td className="px-6 py-5 font-bold text-slate-700 uppercase">PO-IMP-2310-001</td>
              <td className="px-6 py-5">
                 <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600 border border-slate-200 uppercase">
                    PAC MONTAIR
                 </span>
              </td>
              <td className="px-6 py-5 text-right font-bold text-slate-700">Rp 450.000.000</td>
              <td className="px-6 py-5 text-center">
                 <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-600 border border-blue-100">
                    1 DARI 3
                 </span>
              </td>
              <td className="px-6 py-5">
                <div className="flex justify-center">
                  <StatusBadgePembayaran status={idx === 0 ? "Lunas" : "Menunggu Pembayaran"} />
                </div>
              </td>
              <td className="px-6 py-5 text-gray-500 font-medium">15 Nov 2023</td>
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

function StatusBadgePembayaran({ status }: { status: any }) {
  const config: any = {
    "Lunas": "bg-[#f0fdf4] text-[#16a34a] border-[#dcfce7]",
    "Menunggu Pembayaran": "bg-[#fffbeb] text-[#d97706] border-[#fef3c7]",
    "Jatuh Tempo": "bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]",
  };

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm ${config[status]}`}>
      {status.toUpperCase()}
    </span>
  );
}