import { BrowserRouter, Routes, Route } from "react-router-dom";

// Sesuaikan import ini jika ada error path
import Layout from "./components/layout/layout";
import DashboardPage from "./pages/dashboard";
import PerusahaanPage from "./pages/perusahaan";
import DetailPerusahaanPage from "./pages/detail-perusahaan";
import LoginPage from "./pages/login";
import LogBookPage from "./pages/logbook";

function App() {
  return (
    <BrowserRouter>
      <Routes>
         <Route index element={<LoginPage />} />
           <Route path="/" element={<Layout />}>          
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="logbook" element={<LogBookPage />} />
            <Route path="perusahaan" element={<PerusahaanPage />} />
            <Route path="perusahaan/:id" element={<DetailPerusahaanPage />} />
          </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;