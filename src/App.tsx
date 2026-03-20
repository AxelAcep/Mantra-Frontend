import { BrowserRouter, Routes, Route } from "react-router-dom";

// Sesuaikan import ini jika ada error path
import Layout from "./components/layout/layout";
import DashboardPage from "./pages/dashboard";
import PerusahaanPage from "./pages/perusahaan";
import DetailPerusahaanPage from "./pages/detail-perusahaan";
import LoginPage from "./pages/login";
import LogBookPage from "./pages/logbook";
import ListPengadaan from "./pages/pengadaan-barang";
import Penawaran from "./pages/penawaran";
import RequestPenawaranPage from "./pages/dashboard-detail/request-penawaran";
import PenawaranApprovalPage from "./pages/dashboard-detail/penawaran-approval";
import KonfirmasiSelesaiPage from "./pages/dashboard-detail/konfirmasi-selesai";
import PenawaranFinalPage from "./pages/dashboard-detail/penawaran-final";
import POAktifPage from "./pages/dashboard-detail/po-aktif";
import PengadaanBarangPage from "./pages/dashboard-detail/pengadaan-barang";
import JadwalUlangPage from "./pages/dashboard-detail/jadwal-ulang";
import ManajemenAkunPage from "./pages/manajemen-akun";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/" element={<Layout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="logbook" element={<LogBookPage />} />
          <Route path="pengadaan-barang" element={<ListPengadaan />} />
          <Route path="perusahaan" element={<PerusahaanPage />} />
          <Route path="perusahaan/:id" element={<DetailPerusahaanPage />} />
          <Route path="penawaran/:id" element={<Penawaran />} />
          <Route path="dashboard/request-penawaran" element={<RequestPenawaranPage />} />
          <Route path="dashboard/konfirmasi-selesai" element={<KonfirmasiSelesaiPage />} />
          <Route path="dashboard/penawaran-approval" element={<PenawaranApprovalPage />} />
          <Route path="dashboard/penawaran-final" element={<PenawaranFinalPage />} />
          <Route path="dashboard/po-aktif" element={<POAktifPage />} />
          <Route path="dashboard/pengadaan-barang" element={<PengadaanBarangPage />} />
          <Route path="dashboard/jadwal-ulang" element={<JadwalUlangPage />} />
          <Route path="manajemen-akun" element={<ManajemenAkunPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;