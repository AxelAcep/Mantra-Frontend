import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Icons } from "@/assets";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { DialogEditPerusahaan } from "./dialog-edit-perusahaan";

export default function CardCompanyProfileDetail() {
  const [companyInfo, setCompanyInfo] = useState({
    name: "PT. ABC Maju Jaya",
    address: "Jl. Sudirman No. 45, Jakarta Selatan",
    phone: "(021) 555-0123",
    lastActivity: "2 jam yang lalu"
  });

  function handleEditCompany(updated: { name: string; address: string; phone: string }) {
    setCompanyInfo(prev => ({
      ...prev,
      name: updated.name,
      address: updated.address,
      phone: updated.phone
    }));
  }

  function truncateText(text: string, maxLength: number = 100): string {
    if (!text) return "";
    if (text.length > maxLength) {
      return text.slice(0, 97) + "...";
    }
    return text;
  }

  return (
    <Card className="p-6 rounded-xl border-slate-200 shadow-sm">

      {/* --- BAGIAN ATAS: Info Perusahaan --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h2 className="text-xl font-bold text-slate-800 break-words" title={companyInfo.name}>
            {truncateText(companyInfo.name)}
          </h2>

          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500">
            <div className="flex items-center gap-1.5 min-w-0" title={companyInfo.address}>
              <img src={Icons.Location} className="w-4 h-4 opacity-70 shrink-0" />
              <span>{truncateText(companyInfo.address)}</span>
            </div>
            <div className="flex items-center gap-1.5 min-w-0" title={companyInfo.phone}>
              <img src={Icons.Phone} className="w-4 h-4 opacity-70 shrink-0" />
              <span>{truncateText(companyInfo.phone)}</span>
            </div>
          </div>
        </div>

        {/* Badge & Button container */}
        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-between md:justify-start">
          {/* Badge Aktivitas Terakhir */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-md border border-slate-200 text-xs font-medium text-slate-600 shrink-0">
            <img src={Icons.LastActivity} className="w-3.5 h-3.5 opacity-70" />
            <span>Aktivitas terakhir: <strong>{companyInfo.lastActivity}</strong></span>
          </div>

          {/* Button Edit Perusahaan */}
          <DialogEditPerusahaan company={companyInfo} onEditCompany={handleEditCompany}>
            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg px-4 shadow-none shrink-0 h-9">
              <Pencil className="w-4 h-4 mr-2" />
              Edit Perusahaan
            </Button>
          </DialogEditPerusahaan>
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