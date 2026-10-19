import { useState } from "react";
import { useParams } from "react-router-dom";
import TablePermintaanPenawaran from "../pengadaan-barang/TablePermintaanPenawaran";
import TabelPengadaanAktif from "../pengadaan-barang/TabelPengadaanAktif";
import TablePembayaran from "../pengadaan-barang/TabelPembayaran";
import TabelGaransi from "../pengadaan-barang/TabelGaransi";
import TableRiwayat from "../pengadaan-barang/TabelRiwayat";

type TabName =
  | "Permintaan Penawaran"
  | "PO Aktif"
  | "BAST"
  | "Garansi"
  | "Riwayat";

// Tab "Konfirmasi Selesai" sengaja tidak ditampilkan di halaman ini — sama
// seperti permintaan, tabel itu tidak diperlukan di detail perusahaan.
const ALL_TABS: TabName[] = [
  "Permintaan Penawaran",
  "PO Aktif",
  "BAST",
  "Garansi",
  "Riwayat",
];

// Role KARYAWAN hanya melihat tab PO Aktif — konsisten dengan halaman
// pengadaan-barang dan batasan role di backend (endpoint tab lain butuh
// minimal SUPERVISI).
const KARYAWAN_TABS: TabName[] = ["PO Aktif"];

interface UserSession {
  role?: string;
}

const getRole = (): string | undefined => {
  const session = localStorage.getItem("user");
  const user: UserSession = session ? JSON.parse(session) : {};
  return user.role;
};

export default function TabsTableCompanyDetail() {
  const { id } = useParams<{ id: string }>();
  const tabs = getRole() === "KARYAWAN" ? KARYAWAN_TABS : ALL_TABS;
  const [activeTab, setActiveTab] = useState<TabName>(tabs[0]);

  const renderTable = () => {
    switch (activeTab) {
      case "Permintaan Penawaran":
        return <TablePermintaanPenawaran perusahaanId={id} />;
      case "PO Aktif":
        return <TabelPengadaanAktif perusahaanId={id} />;
      case "BAST":
        return <TablePembayaran perusahaanId={id} />;
      case "Garansi":
        return <TabelGaransi perusahaanId={id} />;
      case "Riwayat":
        return <TableRiwayat perusahaanId={id} />;
      default:
        return null;
    }
  };

  return (
    <div>
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
        {renderTable()}
      </div>
    </div>
  );
}
