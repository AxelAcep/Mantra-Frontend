import { ArrowRight } from 'lucide-react';

interface PengadaanAktif {
  po: string;
  tgl: string;
  perusahaan: string;
  lokasi: string;
  jenis: string;
  status: 'Penyusunan WO' | 'Perlu tindakan' | 'Pengiriman Terjadwal' | 'Pembelian Barang';
  alert?: boolean;
}

const data: PengadaanAktif[] = [
  { po: "PO-2310-089", tgl: "22 Okt 2023", perusahaan: "PT Graha Mandiri", lokasi: "Jakarta Selatan", jenis: "PAC Montair", status: "Penyusunan WO" },
  { po: "PO-2310-088", tgl: "21 Okt 2023", perusahaan: "CV Baja Konstruksi", lokasi: "Bandung Kota", jenis: "Fire GeneratorPro", status: "Perlu tindakan", alert: true },
  { po: "PO-2310-087", tgl: "20 Okt 2023", perusahaan: "PT Sinar Jaya", lokasi: "Surabaya Barat", jenis: "Fire GeneratorPro", status: "Pengiriman Terjadwal" },
  { po: "PO-2310-086", tgl: "19 Okt 2023", perusahaan: "Mitra Abadi Sentosa", lokasi: "Tangerang", jenis: "Fire GeneratorPro", status: "Pembelian Barang" },
  { po: "PO-2310-085", tgl: "18 Okt 2023", perusahaan: "PT Bangun Persada", lokasi: "Semarang", jenis: "PAC Montair", status: "Penyusunan WO" },
  { po: "PO-2310-084", tgl: "18 Okt 2023", perusahaan: "CV Cipta Karya", lokasi: "Medan", jenis: "PAC Montair", status: "Pengiriman Terjadwal" },
];

export default function TablePengadaanAktif() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50/50 border-y border-gray-100">
          <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
            <th className="px-6 py-4">Nomor PO ↕</th>
            <th className="px-6 py-4">Tanggal Terbit ↕</th>
            <th className="px-6 py-4">Nama Perusahaan ↕</th>
            <th className="px-6 py-4">Lokasi Proyek ↕</th>
            <th className="px-6 py-4">Jenis Pengadaan ↕</th>
            <th className="px-6 py-4 text-center">Status ↕</th>
            <th className="px-6 py-4 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 text-sm">
          {data.map((item, idx) => (
            <tr key={idx} className={`transition-colors ${item.alert ? 'bg-[#fffbeb]' : 'hover:bg-gray-50/50'}`}>
              <td className="px-6 py-5 font-bold text-slate-700">{item.po}</td>
              <td className="px-6 py-5 text-gray-500">{item.tgl}</td>
              <td className="px-6 py-5 font-bold text-slate-700">{item.perusahaan}</td>
              <td className="px-6 py-5 text-gray-500">{item.lokasi}</td>
              <td className="px-6 py-5">
                 <span className="px-3 py-1 bg-gray-100 text-slate-600 rounded text-[10px] font-bold">
                    {item.jenis}
                 </span>
              </td>
              <td className="px-6 py-5 text-center">
                <StatusBadge status={item.status} />
              </td>
              <td className="px-6 py-5 text-right">
                <button className="inline-flex items-center gap-1 text-cyan-500 font-bold hover:text-cyan-600">
                  Lihat Detail <ArrowRight size={14} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }: { status: PengadaanAktif['status'] }) {
  const styles = {
    "Penyusunan WO": "bg-blue-50 text-blue-600 border-blue-100",
    "Perlu tindakan": "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5] ring-1 ring-[#fed7aa]",
    "Pengiriman Terjadwal": "bg-green-50 text-green-600 border-green-100",
    "Pembelian Barang": "bg-orange-50 text-orange-600 border-orange-100",
  };

  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[10px] font-bold border ${styles[status]}`}>
      {status === "Perlu tindakan" && "⚠️"} {status}
    </span>
  );
}