import { useEffect, useState } from 'react';
import { Search, Phone, Clock, ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useHeaderTitle } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { DialogTambahPerusahaan } from './dialog-tambah-perusahaan';

const companies = [
  { name: "PT. ABC Maju Jaya", address: "Jl. Sudirman No. 45, Jakarta Sela...", phone: "(021) 555-0123", activity: "2 jam lalu", pengadaan: 3, maintenance: 1, total: 12, id: 1 },
  { name: "PT. Sumber Makmur", address: "Kawasan Industri Pulogadung Bl...", phone: "(021) 460-5678", activity: "1 hari lalu", pengadaan: 0, maintenance: 0, total: 5, id: 2 },
  { name: "Graha Pena Group", address: "Jl. Ahmad Yani No. 88, Surabaya", phone: "(031) 820-2000", activity: "30 hari lalu", pengadaan: 0, maintenance: 0, total: 8, id: 3 },
  { name: "Tekno Logistik", address: "Pergudangan Bandara Soetta Blo...", phone: "(021) 559-1122", activity: "3 jam lalu", pengadaan: 1, maintenance: 0, total: 20, id: 4 },
  { name: "Fire Safety Indo", address: "Gd. Cyber 2, Jl. Rasuna Said", phone: "(021) 290-2222", activity: "5 menit lalu", pengadaan: 5, maintenance: 2, total: 35, id: 5 },
  { name: "Mitra Mandiri", address: "Ruko Business Park, Kebon Jeruk", phone: "(021) 530-9988", activity: "4 jam lalu", pengadaan: 1, maintenance: 0, total: 4, id: 6 },
  // ... data duplikat lainnya sesuai gambar
];

export default function PerusahaanPage() {
  const { setTitle } = useHeaderTitle();
  const [companyList, setCompanyList] = useState(companies);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setTitle("Daftar Perusahaan");
  }, [setTitle]);

  const filteredCompanies = companyList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  function handleAddCompany(newCompany: { name: string; address: string; phone: string }) {
    const newId = companyList.length + 1;
    setCompanyList(prev => [
      ...prev,
      {
        id: newId,
        name: newCompany.name,
        address: newCompany.address || "-",
        phone: newCompany.phone || "-",
        activity: "Baru saja",
        pengadaan: 0,
        maintenance: 0,
        total: 0
      }
    ]);
  }

  return (
    <div className="m-6 flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            placeholder="Cari perusahaan..."
          />
        </div>
        <DialogTambahPerusahaan onAddCompany={handleAddCompany}>
          <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg px-4 shadow-none">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Perusahaan
          </Button>
        </DialogTambahPerusahaan>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 text-[11px] uppercase tracking-wider text-gray-500 font-semibold border-b border-gray-100">
              <th className="px-6 py-4">Nama Perusahaan ↕</th>
              <th className="px-6 py-4">Alamat ↕</th>
              <th className="px-6 py-4">Nomor Telepon ↕</th>
              <th className="px-6 py-4">Aktivitas Terakhir ↕</th>
              <th className="px-6 py-4 text-center">Pengadaan Barang ↕</th>
              <th className="px-6 py-4 text-center">Maintenance ↕</th>
              <th className="px-6 py-4 text-center">Total Proyek ↕</th>
              <th className="px-6 py-4 text-right">Aksi ↕</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filteredCompanies.map((item, idx) => (
              <tr key={idx} className="hover:bg-gray-50/80 transition-colors text-sm text-gray-700">
                <td className="px-6 py-4 font-md text-slate-800">{item.name}</td>
                <td className="px-6 py-4 text-gray-500 max-w-[200px] truncate">{item.address}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Phone size={14} className="text-gray-400" />
                    {item.phone}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2 text-gray-500">
                    <Clock size={14} className="text-gray-400" />
                    {item.activity}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  {item.pengadaan > 0 ? (
                    <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-md text-xs font-semibold border border-blue-100">
                      {item.pengadaan} Aktif
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  {item.maintenance > 0 ? (
                    <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-md text-xs font-semibold border border-orange-100">
                      {item.maintenance} Jalan
                    </span>
                  ) : (
                    <span className="text-gray-300">-</span>
                  )}
                </td>
                <td className="px-6 py-4 text-center font-bold text-slate-800">{item.total}</td>
                <td className="px-6 py-4 text-right">
                  <a className="inline-flex items-center gap-1 text-cyan-500 font-semibold hover:text-cyan-600 transition-colors" href={`/perusahaan/${item.id}`}>
                    Lihat Detail <ArrowRight size={14} />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 flex items-center justify-between border-t border-gray-100 text-xs text-gray-500">
        <div>
          Menampilkan <span className="font-semibold text-gray-700">1</span> sampai <span className="font-semibold text-gray-700">{filteredCompanies.length}</span> dari <span className="font-semibold text-gray-700">{filteredCompanies.length}</span> perusahaan
        </div>
        <div className="flex items-center gap-2">
          <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
            <ChevronLeft size={16} />
          </button>
          <button className="w-7 h-7 flex items-center justify-center rounded bg-cyan-500 text-white font-bold">1</button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100">2</button>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100">3</button>
          <span className="px-1 text-gray-300">...</span>
          <button className="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-100">8</button>
          <button className="p-1.5 rounded hover:bg-gray-100 text-gray-400">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}