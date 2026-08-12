import { useEffect, useState } from 'react';
import { Search, Phone, Clock, ArrowRight, ChevronLeft, ChevronRight, Plus, ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react';
import { useHeaderTitle } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DialogTambahPerusahaan } from './dialog-tambah-perusahaan';
import { getPerusahaanList, createPerusahaan } from '@/services/perusahaan.services';
import { getTimeAgo, cn } from '@/lib/utils';

const truncate = (text: any, maxLength: number) => {
  const str = String(text || "");
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
};

type SortDir = "asc" | "desc" | "";

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  if (!active || !dir) return <ChevronsUpDown className="w-3 h-3 text-slate-400" />
  return dir === "asc"
    ? <ChevronUp className="w-3 h-3 text-cyan-600" />
    : <ChevronDown className="w-3 h-3 text-cyan-600" />
}

function SortableHeader({
  label, field, sortField, sortOrder, onSort, title, className = "", center = false
}: {
  label: string; field: string; sortField: string; sortOrder: "asc" | "desc"
  onSort: (field: string) => void
  title?: string
  className?: string
  center?: boolean
}) {
  const isActive = sortField === field
  return (
    <TableHead
      className={cn(
        "cursor-pointer select-none group text-slate-600 text-xs",
        center && "text-center",
        className
      )}
      onClick={() => onSort(field)}
      title={title}
    >
      <div className={cn("flex items-center gap-1", center && "justify-center")}>
        <span className={`uppercase font-medium ${isActive ? "text-cyan-600" : ""} group-hover:text-cyan-600 transition-colors`}>
          {label}
        </span>
        <SortIcon active={isActive} dir={isActive ? sortOrder : ""} />
      </div>
    </TableHead>
  )
}

export default function PerusahaanPage() {
  const { setTitle } = useHeaderTitle();
  const [companyList, setCompanyList] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
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
          activity: getTimeAgo(item.updatedAt || item.createdAt || ""),
          rawDate: item.updatedAt || item.createdAt || "",
          pengadaan: 0,
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

  // Reset page to 1 when search or sorting changes
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sortField, sortOrder]);

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortOrder(prev => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const filteredCompanies = companyList.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.address.toLowerCase().includes(search.toLowerCase()) ||
    c.phone.toLowerCase().includes(search.toLowerCase())
  );

  const sortedCompanies = [...filteredCompanies].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (sortField === "activity") {
      valA = a.rawDate || "";
      valB = b.rawDate || "";
    }

    if (typeof valA === "string" && typeof valB === "string") {
      return sortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    } else {
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    }
  });

  const totalPages = Math.ceil(sortedCompanies.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCompanies = sortedCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE);

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
          activity: getTimeAgo(created.updatedAt || created.createdAt || ""),
          rawDate: created.updatedAt || created.createdAt || "",
          pengadaan: 0,
          total: 0
        }
      ]);
    } catch (err: any) {
      alert(err.message || "Gagal membuat perusahaan.");
    }
  }

  return (
    <div className="m-6 flex-1 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col space-y-2">

      {/* Search Bar */}
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
            placeholder="Cari perusahaan..."
          />
        </div>
        <DialogTambahPerusahaan onAddCompany={handleAddCompany}>
          <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium rounded-lg px-4 shadow-none">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Perusahaan
          </Button>
        </DialogTambahPerusahaan>
      </div>

      {/* Table */}
      <div className="w-full overflow-x-auto px-6 pb-4">
        <div className="w-full rounded-md border border-slate-200 bg-white min-w-[1000px]">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 border-b border-slate-100 [&_th]:py-3.5">
                <SortableHeader label="NAMA PERUSAHAAN" field="name" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} className="w-[22%]" />
                <SortableHeader label="ALAMAT" field="address" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} className="w-[20%]" />
                <SortableHeader label="NOMOR TELEPON" field="phone" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} className="w-[15%]" />
                <SortableHeader label="AKTIVITAS TERAKHIR" field="activity" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} className="w-[15%]" />
                <SortableHeader label="PENGADAAN BARANG" field="pengadaan" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} center className="w-[12%]" />
                <SortableHeader label="TOTAL PROYEK" field="total" sortField={sortField} sortOrder={sortOrder} onSort={handleSort} center className="w-[10%]" />
                <TableHead className="text-right text-slate-600 text-xs w-[6%]">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16 text-slate-400">
                    Tidak ada perusahaan yang ditemukan.
                  </TableCell>
                </TableRow>
              ) : (
                paginatedCompanies.map((item, idx) => (
                  <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors [&_td]:py-4">
                    <TableCell className="max-w-[200px]" title={item.name}>
                      <p className="font-medium text-slate-800 truncate">{item.name}</p>
                    </TableCell>
                    <TableCell className="max-w-[200px]" title={item.address}>
                      <p className="text-sm text-slate-500 truncate">{item.address}</p>
                    </TableCell>
                    <TableCell className="whitespace-nowrap" title={item.phone}>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-600 truncate">{truncate(item.phone, 15)}</span>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap" title={item.activity}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="text-sm text-slate-600 truncate">{item.activity}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {item.pengadaan > 0 ? (
                        <span className="bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[11px] font-semibold border border-blue-100">
                          {item.pengadaan} Aktif
                        </span>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      {item.total > 0 ? (
                        <span className="font-bold text-slate-800 text-sm">{item.total}</span>
                      ) : (
                        <span className="text-slate-400 text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      <a className="text-cyan-600 text-sm font-medium hover:underline inline-flex items-center" href={`/perusahaan/${item.id}`}>
                        Lihat Detail
                      </a>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Footer / Pagination */}
      <div className="p-4 flex items-center justify-between border-t border-slate-100 text-xs text-slate-500 bg-white">
        <div>
          Menampilkan <span className="font-semibold text-slate-700">{filteredCompanies.length === 0 ? 0 : startIndex + 1}</span> sampai <span className="font-semibold text-slate-700">{Math.min(startIndex + ITEMS_PER_PAGE, filteredCompanies.length)}</span> dari <span className="font-semibold text-slate-700">{filteredCompanies.length}</span> perusahaan
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
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
                  ? "bg-cyan-600 text-white shadow-sm"
                  : "hover:bg-slate-100 text-slate-600"
                  }`}
              >
                {page}
              </button>
            );
          })}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1.5 rounded hover:bg-slate-100 text-slate-400 disabled:opacity-40 disabled:hover:bg-transparent transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}