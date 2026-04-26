import React, { useState } from 'react';
import {
  MessageSquareText,
  FileText,
  Upload,
  Download,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Hash,
  Trash2,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { Badge } from "@/components/ui/badge";

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

const logsByDate = [
  {
    title: "23 Okt 2025",
    items: [
      { id: 1, title: "Upload Dokumen", description: "Rudi H. mengunggah file Material_List_Raw.xlsx.", time: "16:45" },
      { id: 2, title: "Tugas Dimulai", description: "Estimator mulai mengerjakan perhitungan.", time: "09:00" },
      { id: 3, title: "Penugasan PIC", description: "Rudi Hartono ditugaskan sebagai PIC Estimator.", time: "08:30" },
    ],
  },
  {
    title: "Kemarin",
    items: [
      { id: 4, title: "Upload Dokumen", description: "Rudi H. mengunggah file Material_List_Raw.xlsx.", time: "16:45" },
      { id: 5, title: "Tugas Dimulai", description: "Estimator mulai mengerjakan perhitungan.", time: "09:00" },
      { id: 6, title: "Penugasan PIC", description: "Rudi Hartono ditugaskan sebagai PIC Estimator.", time: "08:30" },
    ],
  },
  {
    title: "Hari Ini",
    items: [
      { id: 7, title: "BoQ Selesai (Draft)", description: "Rudi Hartono menyelesaikan perhitungan awal.", time: "10:30" },
      { id: 8, title: "Masuk Review", description: "Draft v2 dikirim untuk review internal tim engineering.", time: "11:00" },
    ],
  },
];

function ActivitySidebar() {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm h-full flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-100/80 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 text-base">Log Aktivitas</h3>
        <button className="flex items-center gap-2 bg-cyan-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold relative hover:bg-cyan-600 transition-all shadow-sm active:scale-95">
          <MessageSquareText size={16} />
          Chat
          <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white shadow-sm font-bold">2</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-8 scrollbar-thin">
        {logsByDate.map((section) => (
          <div key={section.title} className="space-y-4">
            <div className="flex">
              <p className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                {section.title}
              </p>
            </div>
            <div className="relative space-y-6 pl-5 ml-2.5 border-l-2 border-slate-50">
              {section.items.map((item) => (
                <div key={item.id} className="relative">
                  <div className="absolute -left-[30px] top-0 w-5 h-5 rounded-full bg-slate-50 flex items-center justify-center border-2 border-white shadow-sm overflow-hidden text-[#94a3b8]">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#94a3b8]" />
                  </div>
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <p className="text-xs font-bold text-slate-800 leading-tight">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-medium">{item.description}</p>
                    </div>
                    <p className="text-[10px] text-slate-400 font-bold whitespace-nowrap">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Step8() {
  const [expandedTermins, setExpandedTermins] = useState<number[]>([2]);

  const toggleTermin = (id: number) => {
    setExpandedTermins(prev => 
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  const termins = [
    {
      id: 1,
      title: "Termin 1",
      status: "Lunas",
      desc: "Setelah PO",
      details: [
        { label: "Jumlah", value: "Rp 150.000.000" },
        { label: "Jatuh Tempo", value: "12 Februari 2026" },
        { label: "Status Overdue", value: "Tidak overdue" },
        { label: "Referensi Validasi", value: "Setelah PO" },
      ]
    },
    {
      id: 2,
      title: "Termin 2",
      status: "Berjalan",
      desc: "Barang Ready Log Book Setiap Barang Dibeli di ceklist",
      details: [
        { label: "Jumlah", value: "Rp 150.000.000" },
        { label: "Jatuh Tempo", value: "30 Maret 2026" },
        { label: "Status Overdue", value: "Belum overdue" },
        { label: "Dasar Progress", value: "Checklist logbook pembelian barang telah berjalan" },
      ]
    },
    {
      id: 3,
      title: "Termin 3",
      status: "Belum aktif",
      desc: "Pembayaran Setelah Barang Dikirim",
      details: []
    }
  ];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-8">
        <div>
          <SectionHeading title="Detail" />
          <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
            <div className="mb-6">
              <h3 className="font-bold text-slate-800 text-sm">Progress Termin</h3>
              <p className="text-xs text-gray-400 mt-1">Rincian pembayaran digabung ke masing-masing termin agar lebih rapi, mudah dibaca, dan tidak saling bentrokan.</p>
            </div>

            <div className="bg-cyan-50/50 border border-cyan-100/50 rounded-lg p-3 flex justify-between items-center mb-8">
              <p className="text-[10px] font-bold text-cyan-600">Posisi saat ini berada di Termin 2 dari total 3 termin pembayaran proyek.</p>
              <p className="text-[10px] font-bold text-cyan-600">Total proyek Rp 450.000.000</p>
            </div>

            <div className="relative space-y-4">
              {termins.map((termin, index) => (
                <div key={termin.id} className="relative flex gap-4">
                  {/* Line connector */}
                  {index !== termins.length - 1 && (
                    <div className="absolute left-[15px] top-[32px] bottom-[-16px] w-0.5 bg-slate-100" />
                  )}
                  
                  {/* Number Circle */}
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold z-10 shrink-0 shadow-sm border-2 ${
                    termin.status === 'Lunas' ? 'bg-cyan-500 border-white text-white' : 
                    termin.status === 'Berjalan' ? 'bg-white border-cyan-500 text-cyan-500' : 
                    'bg-white border-slate-200 text-slate-300'
                  }`}>
                    {termin.id}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div 
                      className={`border border-gray-100 rounded-xl overflow-hidden transition-all duration-300 ${
                        expandedTermins.includes(termin.id) ? 'shadow-md ring-1 ring-cyan-100 border-cyan-100' : 'hover:border-gray-200'
                      }`}
                    >
                      <div 
                        className="p-4 flex items-center justify-between cursor-pointer"
                        onClick={() => toggleTermin(termin.id)}
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-slate-800 text-xs">{termin.title}</h4>
                            <Badge 
                              className={`text-[9px] font-bold border-0 px-2 py-0.5 rounded-full ${
                                termin.status === 'Lunas' ? 'bg-cyan-50 text-cyan-500' : 
                                termin.status === 'Berjalan' ? 'bg-amber-50 text-amber-500' : 
                                'bg-gray-50 text-gray-400'
                              }`}
                            >
                              {termin.status}
                            </Badge>
                          </div>
                          <p className="text-[10px] text-gray-400 mt-1">{termin.desc}</p>
                        </div>
                        <div className="text-gray-400">
                          {expandedTermins.includes(termin.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </div>
                      </div>

                      {expandedTermins.includes(termin.id) && termin.details.length > 0 && (
                        <div className="p-4 pt-0">
                          <div className="grid grid-cols-2 gap-3 mt-2">
                            {termin.details.map((detail, dIdx) => (
                              <div key={dIdx} className="bg-slate-50/50 border border-gray-50 p-3 rounded-lg">
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">{detail.label}</p>
                                <p className="text-xs font-bold text-slate-800">{detail.value}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <SectionHeading title="Dokumen" />
          <div className="space-y-4 mt-6">
            {/* Logbook Operasional Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText size={16} className="text-cyan-500" /> Logbook Operasional
                </div>
                <div className="flex gap-2">
                  <div className="flex items-center bg-gray-50 p-1 rounded-lg">
                    <button className="flex items-center gap-1.5 text-gray-400 text-[10px] font-bold px-3 py-1.5 rounded-md hover:text-gray-600 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-slate-400" /> Bermasalah
                    </button>
                    <button className="flex items-center gap-1.5 bg-white text-cyan-600 text-[10px] font-bold px-3 py-1.5 rounded-md shadow-sm border border-gray-100">
                      <CheckCircle2 size={12} /> Semua
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-3">
                {[
                  { title: 'Logbook Pembelian Barang Pipa PVC Drainase (Indent Lokal)', user: 'Febri', time: '12 Feb, 09:00', badge: 'Perlu tindakan' },
                  { title: 'Logbook Pengantaran Barang Pipa PVC Drainase (Indent Lokal)', user: 'Febri', time: '11 Feb, 09:00' },
                  { title: 'Logbook Pembelian Pipa Tembaga', user: 'Febri', time: '10 Feb, 08:00' },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between bg-white rounded-xl border border-gray-100 p-4 hover:border-cyan-100 transition-all group">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                        <FileText size={18} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold text-slate-800">{log.title}</p>
                          {log.badge && (
                            <Badge variant="outline" className="bg-amber-50 text-amber-500 text-[9px] font-bold border-amber-100 px-1.5 py-0.5 rounded flex items-center gap-1 shadow-none">
                              <AlertCircle size={10} /> {log.badge}
                            </Badge>
                          )}
                        </div>
                        <p className="text-[10px] text-gray-400 mt-0.5 font-medium">Diunggah oleh {log.user} • {log.time}</p>
                      </div>
                    </div>
                    <button className="text-cyan-500 font-bold text-[10px] flex items-center gap-1 hover:underline">
                      Lihat Detail <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Dokumen Pendukung Card */}
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 bg-white border-b border-gray-100/80 flex justify-between items-center">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-sm">
                  <FileText size={16} className="text-cyan-500" /> Dokumen Pendukung
                </div>
                <button className="text-cyan-500 text-xs font-bold flex items-center gap-1 hover:underline">
                  <Upload size={14} /> Upload File
                </button>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg group transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-cyan-50 rounded-lg text-cyan-500">
                      <FileText size={18} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-700">BAST.pdf</p>
                      <p className="text-[10px] text-gray-400">Diunggah oleh Anda • 12 Feb, 10:30</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                      <Trash2 size={18} />
                    </button>
                    <button className="p-2 text-cyan-500 hover:text-cyan-600 hover:bg-cyan-50 rounded transition-colors">
                      <Download size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivitySidebar />
      </div>
    </div>
  );
}
