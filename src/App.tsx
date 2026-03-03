import { BrowserRouter, Routes, Route } from "react-router-dom";

// Sesuaikan import ini jika ada error path
import Layout from "./components/layout/layout";
import DashboardPage from "./pages/dashboard";
import DetailPerusahaanPage from "./pages/detail-perusahaan";
import LoginPage from "./pages/login";
import LogBookPage from "./pages/logbook";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route index element={<LoginPage />} />
        {/* Route Induk menggunakan Layout */}
        <Route path="/" element={<Layout />}>
          
          
          {/* Halaman (localhost:5173/dashboard) juga menampilkan Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="logbook" element={<LogBookPage />} />
          
          {/* Halaman Detail Perusahaan */}
          <Route path="detail-perusahaan" element={<DetailPerusahaanPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;