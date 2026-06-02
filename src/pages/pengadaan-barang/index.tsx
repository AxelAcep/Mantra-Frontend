import { useState } from "react";
import {
  // Search,
  // Filter,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
} from "lucide-react";
import TablePermintaanPenawaran from "./TablePermintaanPenawaran";
import TablePengadaanAktif from "./TabelPengadaanAktif";
import TabelImplementasi from "./TabelImplementasi";
import TabelPembayaran from "./TabelPembayaran";
import TableKonfirmasiSelesai from "./TabelKonfirmasi";
import TableRiwayat from "./TabelRiwayat";
import { useNavigate } from "react-router-dom";

type TabName =
  | "Permintaan Penawaran"
  | "Pengadaan Aktif"
  | "Implementasi"
  | "Pembayaran"
  | "Konfirmasi Selesai"
  | "Riwayat";

const tabs: TabName[] = [
  "Permintaan Penawaran",
  "Pengadaan Aktif",
  "Implementasi",
  "Pembayaran",
  "Konfirmasi Selesai",
  "Riwayat",
];

interface UserSession {
  role?: string;
  pegawai?: {
    id?: string;
    nama?: string;
    divisi?: string;
  };
}

const getAuthData = () => {
  const session = localStorage.getItem("user");
  const user: UserSession = session ? JSON.parse(session) : {};
  return {
    isLoggedIn: !!user.role,
    role: user.role,
    divisi: user.pegawai?.divisi,
  };
};

export default function ListPengadaan() {
  const [activeTab, setActiveTab] = useState<TabName>("Permintaan Penawaran");
  const navigate = useNavigate();

  const { role, divisi } = getAuthData();
  const canCreatePenawaran =
    role === "MASTER" || divisi?.toUpperCase() === "SALES";

  const renderTable = () => {
    switch (activeTab) {
      case "Permintaan Penawaran":
        return <TablePermintaanPenawaran />;
      case "Pengadaan Aktif":
        return <TablePengadaanAktif />;
      case "Implementasi":
        return <TabelImplementasi />;
      case "Pembayaran":
        return <TabelPembayaran />;
      case "Konfirmasi Selesai":
        return <TableKonfirmasiSelesai />;
      case "Riwayat":
        return <TableRiwayat />;
      default:
        return (
          <div className="py-24 text-center text-gray-400">
            <p className="text-lg font-medium">
              Konten {activeTab} Belum Tersedia
            </p>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-50 p-6 font-sans">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-4">
            <button className="p-2 bg-white border border-gray-200 rounded-full hover:bg-gray-50 shadow-sm">
              <ArrowLeft size={18} />
            </button>
            <h1 className="text-2xl font-bold text-slate-800">
              Daftar Pengadaan Barang
            </h1>
          </div>

          {canCreatePenawaran && (
            <button
              onClick={() => {
                navigate("/penawaran/create");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors"
            >
              <Plus size={16} />
              Buat Penawaran
            </button>
          )}
        </div>
        <p className="text-sm text-gray-500 mb-8 ml-12">
          Kelola dan pantau progres pengadaan barang dari seluruh daftar
          penawaran yang diajukan dan aktif.
        </p>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-[2px] ${
                activeTab === tab
                  ? "border-cyan-500 text-cyan-500"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          {/* <div className="p-4 flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-xs">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Cari perusahaan, no. penawaran..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
              <Filter size={16} /> Filter
            </button>
          </div> */}

          {renderTable()}

          {/* Footer */}
          <div className="p-4 flex items-center justify-between border-t border-gray-100 text-[11px] text-gray-400">
            <p>
              Menampilkan <span className="font-bold text-gray-700">6</span>{" "}
              dari <span className="font-bold text-gray-700">42</span> data
            </p>
            <div className="flex items-center gap-1">
              <button className="p-1">
                <ChevronLeft size={16} />
              </button>
              <button className="w-7 h-7 rounded bg-cyan-500 text-white font-bold">
                1
              </button>
              <button className="w-7 h-7 rounded hover:bg-gray-100">2</button>
              <button className="w-7 h-7 rounded hover:bg-gray-100">3</button>
              <span className="px-1">...</span>
              <button className="w-7 h-7 rounded hover:bg-gray-100">7</button>
              <button className="p-1">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
