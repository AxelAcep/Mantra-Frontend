import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router';

interface PermintaanPenawaran {
  tgl: string;
  no: string;
  pic: string;
  pembuat: string;
  nilai: string;
  status: 'Perlu tindakan' | 'Review' | 'Revisi' | 'Draft';
  alert?: boolean;
}

const data: PermintaanPenawaran[] = [
  { tgl: "24 Okt 2023", no: "PEN-2310-001", pic: "Ahmad Rizki", pembuat: "Abdul", nilai: "Belum Tersedia", status: "Perlu tindakan", alert: true },
  { tgl: "23 Okt 2023", no: "PEN-2310-002", pic: "Siti Nurhaliza", pembuat: "Siti", nilai: "Belum Tersedia", status: "Review" },
  { tgl: "23 Okt 2023", no: "PEN-2310-003", pic: "Budi Santoso", pembuat: "Aminah", nilai: "Rp 67.200.000", status: "Revisi" },
  { tgl: "22 Okt 2023", no: "PEN-2310-004", pic: "Dewi Lestari", pembuat: "Alex", nilai: "Belum Tersedia", status: "Draft" },
  { tgl: "21 Okt 2023", no: "PEN-2310-005", pic: "Eko Prasetyo", pembuat: "Petrus", nilai: "Rp 89.750.000", status: "Review" },
  { tgl: "21 Okt 2023", no: "PEN-2310-006", pic: "Fitria Ananda", pembuat: "Quen", nilai: "Rp 34.600.000", status: "Revisi" },
];

export default function TablePermintaanPenawaran() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-y border-gray-100">
          <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <th className="px-6 py-4">Tanggal Permintaan ↕</th>
            <th className="px-6 py-4">No. Penawaran ↕</th>
            <th className="px-6 py-4">Pic Req ↕</th>
            <th className="px-6 py-4">Pembuat Penawaran</th>
            <th className="px-6 py-4">Estimasi Nilai ↕</th>
            <th className="px-6 py-4 text-center">Status ↕</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {data.map((item, idx) => (
            <tr key={idx} className={`transition-colors ${item.alert ? 'bg-[#fffbeb]' : 'hover:bg-gray-50/50'}`}>
              <td className="px-6 py-5 text-gray-500">{item.tgl}</td>
              <td className="px-6 py-5 font-bold text-slate-700">{item.no}</td>
              <td className="px-6 py-5 font-bold text-slate-700">{item.pic}</td>
              <td className="px-6 py-5 text-gray-400 font-medium">{item.pembuat}</td>
              <td className="px-6 py-5 text-gray-300 font-semibold">{item.nilai}</td>
              <td className="px-6 py-5">
                <div className="flex justify-center">
                  <StatusBadge status={item.status} />
                </div>
              </td>
              <td className="px-6 py-5 text-right">
                <Link className="inline-flex items-center gap-1 text-cyan-500 font-bold hover:text-cyan-600 transition-colors" to={`/penawaran/${item.no}`}>
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

function StatusBadge({ status }: { status: PermintaanPenawaran['status'] }) {
  const config = {
    "Perlu tindakan": "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5] ring-1 ring-[#fed7aa]",
    "Review": "bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]",
    "Revisi": "bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]",
    "Draft": "bg-[#f8fafc] text-[#64748b] border-[#f1f5f9]",
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm ${config[status]}`}>
      {status === "Perlu tindakan" && <span>⚠️</span>}
      {status}
    </span>
  );
}