import { Card } from "@/components/ui/card";
import { Icons } from "@/assets";

export default function CardCompanyProfileDetail() {
  return (
    <Card className="p-6 rounded-xl border-slate-200 shadow-sm mt-6">
      
      {/* --- BAGIAN ATAS: Info Perusahaan --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">PT. ABC Maju Jaya</h2>
          
          <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5">
              <img src={Icons.Location} className="w-4 h-4 opacity-70" />
              <span>Jl. Sudirman No. 45, Jakarta Selatan</span>
            </div>
            <div className="flex items-center gap-1.5">
              <img src={Icons.Phone} className="w-4 h-4 opacity-70" />
              <span>(021) 555-0123</span>
            </div>
          </div>
        </div>

        {/* Badge Aktivitas Terakhir */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-md border border-slate-200 text-xs font-medium text-slate-600 shrink-0">
          <img src={Icons.LastActivity} className="w-3.5 h-3.5 opacity-70" />
          <span>Aktivitas terakhir: <strong>2 jam yang lalu</strong></span>
        </div>
      </div>

      {/* --- BAGIAN BAWAH: Ringkasan Proyek (Grid 2 Kolom) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Kolom Kiri: Proyek Pengadaan Barang */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <img src={Icons.Pengadaan} className="w-4 h-4 text-cyan-600" />
            <h3 className="text-sm font-bold text-slate-700">Proyek Pengadaan Barang</h3>
          </div>
          
          {/* Sub-grid untuk 3 Status */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center flex flex-col justify-center">
              <p className="text-[10px] text-slate-500 mb-1">Aktif</p>
              <p className="text-lg font-bold text-emerald-500">3</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center flex flex-col justify-center">
              <p className="text-[10px] text-slate-500 mb-1">Menunggu Persetujuan</p>
              <p className="text-lg font-bold text-slate-800">1</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center flex flex-col justify-center">
              <p className="text-[10px] text-slate-500 mb-1">Selesai</p>
              <p className="text-lg font-bold text-slate-800">12</p>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Proyek Maintenance */}
        <div className="bg-slate-50/50 p-4 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 mb-4">
            <img src={Icons.Maintenance} className="w-4 h-4 text-cyan-600" />
            <h3 className="text-sm font-bold text-slate-700">Proyek Maintenance</h3>
          </div>
          
          {/* Sub-grid untuk 3 Status */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center flex flex-col justify-center">
              <p className="text-[10px] text-slate-500 mb-1">Aktif</p>
              <p className="text-lg font-bold text-emerald-500">1</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center flex flex-col justify-center">
              <p className="text-[10px] text-slate-500 mb-1">Menunggu Persetujuan</p>
              <p className="text-lg font-bold text-slate-800">0</p>
            </div>
            <div className="bg-white p-3 rounded-lg shadow-sm border border-slate-100 text-center flex flex-col justify-center">
              <p className="text-[10px] text-slate-500 mb-1">Selesai</p>
              <p className="text-lg font-bold text-slate-800">5</p>
            </div>
          </div>
        </div>

      </div>
    </Card>
  );
}