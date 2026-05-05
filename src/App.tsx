import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import type { JSX } from "react";

// Sesuaikan import ini jika ada error path
import Layout from "./components/layout/layout";
import DashboardPage from "./pages/dashboard";
import PerusahaanPage from "./pages/perusahaan";
import DetailPerusahaanPage from "./pages/detail-perusahaan";
import LoginPage from "./pages/login";
import LogBookPage from "./pages/logbook";
import ListPengadaan from "./pages/pengadaan-barang";
import RequestPenawaranPage from "./pages/dashboard-detail/request-penawaran";
import PenawaranApprovalPage from "./pages/dashboard-detail/penawaran-approval";
import KonfirmasiSelesaiPage from "./pages/dashboard-detail/konfirmasi-selesai";
import PenawaranFinalPage from "./pages/dashboard-detail/penawaran-final";
import POAktifPage from "./pages/dashboard-detail/po-aktif";
import PengadaanBarangPage from "./pages/dashboard-detail/pengadaan-barang";
import JadwalUlangPage from "./pages/dashboard-detail/jadwal-ulang";
import ManajemenAkunPage from "./pages/manajemen-akun";
import Penawaran from "./pages/detail-pengadaan-barang/penawaran";
import ActivityPagePegawai from "./pages/daily/pegawai";
import ActivityPageAdmin from "./pages/daily/manager";
import ActivityPageSupervisi from "./pages/daily/supervisi";
import DetailActivityPagePegawai from "./pages/daily/view";
import DetailActivityPagePegawaiAdmin from "./pages/daily/view-manager";
import ChatPage from "./pages/notifikasi/chat";
import DetailKPIPage from "./pages/kpi";
import PengaturanPegawaiPage from "./pages/pengaturan/pegawai";
import PengaturanManagerPage from "./pages/pengaturan/manager";
import BuatPenawaran from "./pages/detail-pengadaan-barang/create-penawaran/index";

interface UserSession {
  role?: "MASTER" | "PEGAWAI" | "KARYAWAN" | "SUPERVISI";
}

const getAuthData = () => {
  const session = localStorage.getItem("user");
  const user: UserSession = session ? JSON.parse(session) : {};
  return {
    isLoggedIn: !!user.role,
    role: user.role,
  };
};

const DailyActivityWrapper = (): JSX.Element => {
  const { role } = getAuthData();
  return role === "MASTER" ? <ActivityPageAdmin /> : <ActivityPagePegawai />;
};

const DetailActivityWrapper = (): JSX.Element => {
  const { role } = getAuthData();
  return role === "MASTER" ? (
    <DetailActivityPagePegawaiAdmin />
  ) : (
    <DetailActivityPagePegawai />
  );
};

const PengaturanWrapper = (): JSX.Element => {
  const { role } = getAuthData();
  return role === "MASTER" ? (
    <PengaturanManagerPage />
  ) : (
    <PengaturanPegawaiPage />
  );
};

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
          <Route path="penawaran/create" element={<BuatPenawaran />} />
          <Route
            path="dashboard/request-penawaran"
            element={<RequestPenawaranPage />}
          />
          <Route
            path="dashboard/konfirmasi-selesai"
            element={<KonfirmasiSelesaiPage />}
          />
          <Route
            path="dashboard/penawaran-approval"
            element={<PenawaranApprovalPage />}
          />
          <Route
            path="dashboard/penawaran-final"
            element={<PenawaranFinalPage />}
          />
          <Route path="dashboard/po-aktif" element={<POAktifPage />} />
          <Route
            path="dashboard/pengadaan-barang"
            element={<PengadaanBarangPage />}
          />
          <Route path="dashboard/jadwal-ulang" element={<JadwalUlangPage />} />
          <Route path="manajemen-akun" element={<ManajemenAkunPage />} />
          <Route path="akunkaryawan" element={<ManajemenAkunPage />} />
          <Route path="dailyactivity" element={<DailyActivityWrapper />} />
          <Route path="dailyactivity/:id" element={<DetailActivityWrapper />} />
          <Route
            path="dailyactivity/supervisi"
            element={<ActivityPageSupervisi />}
          />
          <Route
            path="dailyactivity/supervisi/:id"
            element={<DetailActivityPagePegawaiAdmin />}
          />
          <Route path="notifikasi/chat" element={<ChatPage />} />
          <Route path="kpi/:pegawaiId" element={<DetailKPIPage />} />
          <Route path="pengaturan" element={<PengaturanWrapper />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
