import { BrowserRouter, Routes, Route } from "react-router-dom";

// Sesuaikan import ini jika ada error path
import Layout from "./components/layout/layout";
import DashboardPage from "./pages/dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route Induk menggunakan Layout */}
        <Route path="/" element={<Layout />}>
          
          {/* Halaman utama (localhost:5173/) akan menampilkan Dashboard */}
          <Route index element={<DashboardPage />} />
          
          {/* Halaman (localhost:5173/dashboard) juga menampilkan Dashboard */}
          <Route path="dashboard" element={<DashboardPage />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;