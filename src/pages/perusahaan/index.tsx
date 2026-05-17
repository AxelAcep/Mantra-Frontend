import { useEffect, useState } from 'react';
import { Search, Phone, Clock, ArrowRight, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { useHeaderTitle } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { DialogTambahPerusahaan } from './dialog-tambah-perusahaan';
import { getPerusahaanList, createPerusahaan } from '@/services/perusahaan.services';

export default function PerusahaanPage() {
  const { setTitle } = useHeaderTitle();
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setTitle("Daftar Perusahaan");
  }, [setTitle]);

  useEffect(() => {
    async function loadCompanies() {
      try {
        setLoading(true);
        const data = await getPerusahaanList();
        const mapped = data.map((item) => ({
          id: item.id,
          name: item.nama,
          address: item.alamat || "-",
          phone: item.nomor_telepon || "-",
          activity: "Baru saja",
          pengadaan: 0,
          maintenance: 0,
          total: 0
        }));
        setCompanyList(mapped);
      } catch (err: any) {
        setError(err.message || "Gagal mengambil data perusahaan.");
      } finally {
        setLoading(false);
      }
    }
    loadCompanies();
  }, []);

  // Reset page to 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search]);

  const filteredCompanies = companyList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) {
        pages.push("...");
      }
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }
      if (currentPage < totalPages - 2) {
        pages.push("...");
      }
      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  async function handleAddCompany(newCompany: { name: string; address: string; phone: string }) {
    try {
      const created = await createPerusahaan({
        nama: newCompany.name,
        alamat: newCompany.address,
        telepon: newCompany.phone
      });
      setCompanyList(prev => [
        ...prev,
        {
          id: created.id,
          name: created.nama,
          address: created.alamat || "-",
          phone: created.nomor_telepon || "-",
          activity: "Baru saja",
          pengadaan: 0,
          maintenance: 0,
          total: 0
        }
      ]);
    } catch (err: any) {
      alert(err.message || "Gagal membuat perusahaan.");
    }
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
            {paginatedCompanies.map((item, idx) => (
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
          Menampilkan <span className="font-semibold text-gray-700">{filteredCompanies.length === 0 ? 0 : startIndex + 1}</span> sampai <span className="font-semibold text-gray-700">{Math.min(startIndex + ITEMS_PER_PAGE, filteredCompanies.length)}</span> dari <span className="font-semibold text-gray-700">{filteredCompanies.length}</span> perusahaan
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {getPageNumbers().map((page, idx) => {
            if (page === "...") {
              return <span key={idx} className="px-1 text-gray-300">...</span>;
            }
            return (
              <button
                key={idx}
                onClick={() => setCurrentPage(Number(page))}
                className={`w-7 h-7 flex items-center justify-center rounded font-bold text-xs transition-all ${currentPage === page
                    ? "bg-cyan-500 text-white shadow-sm"
                    : "hover:bg-gray-100 text-gray-600"
                  }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded hover:bg-gray-100 text-gray-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}