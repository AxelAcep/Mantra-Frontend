import React, { useState } from "react";
import { useGaransi } from "@/hooks/use-garansi";
import TrackingGaransiSection from "./TrackingGaransi";
import LogBookSection from "./LogBook";
import DokumenPendukungSection from "./DokumenPendukung";
import ActivityLogSectionGaransi from "./ActivityLog";
import KonfigurasiGaransiCard from "./KonfigurasiGaransiCard";
import type { GaransiResponse } from "@/services/garansi.service";

const NAMA_BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

const TAB_LABEL: Record<string, string> = {
  PAC: "PAC",
  FIRE: "FirePro",
  UMUM: "Garansi",
};

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-4">
      <h1 className="font-bold text-xl text-slate-800">{title}</h1>
      <div className="h-px bg-slate-200 flex-1" />
    </div>
  );
}

interface Step8Props {
  trackingId: string;
}

// Isi satu tab Garansi (dipakai baik ada 1 Garansi doang maupun pas lagi
// nampilin salah satu dari 2 tab PAC/FirePro).
function GaransiTabContent({
  garansi,
  konfiguring,
  konfigurasiTimeline,
  updatingTanggal,
  updateTanggalKunjungan,
}: {
  garansi: GaransiResponse;
  konfiguring: boolean;
  konfigurasiTimeline: ReturnType<typeof useGaransi>["konfigurasiTimeline"];
  updatingTanggal: boolean;
  updateTanggalKunjungan: ReturnType<typeof useGaransi>["updateTanggalKunjungan"];
}) {
  const months = garansi.months ?? [];

  const periodeMulai =
    months.length > 0
      ? `${NAMA_BULAN_PANJANG[months[0].bulan - 1]} ${months[0].tahun}`
      : "-";
  const periodeAkhir =
    months.length > 0
      ? `${NAMA_BULAN_PANJANG[months[months.length - 1].bulan - 1]} ${months[months.length - 1].tahun}`
      : "-";

  const logbook = months
    .filter((m) => m.activityId)
    .map((m) => ({
      monthId: m.id,
      bulanKe: m.bulanKe,
      activityId: m.activityId,
      judul: m.activity?.judul,
      status: m.activity?.status,
      namaPegawai: m.activity?.pegawai?.nama,
      targetSelesai: m.activity?.targetSelesai,
    }));

  const dokumenPendukung = months.flatMap((m) =>
    (m.activity?.dokumen ?? []).map((doc) => ({
      id: doc.id,
      namaFile: doc.namaFile,
      path: doc.path,
      uploadedByNama: doc.pegawai?.nama,
      createdAt: doc.createdAt,
      bulanKe: m.bulanKe,
    })),
  );

  const mappedLogs =
    garansi.logs?.map((log, i) => {
      const d = log.createdAt ? new Date(log.createdAt) : new Date();
      return {
        id: i + 1,
        user: log.namaPegawai || "System",
        action: log.aksi || "-",
        description: log.keterangan || "",
        time: d.toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        }),
        date: d,
      };
    }) ?? [];

  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 lg:col-span-9 space-y-8">
        <div>
          <SectionHeading title="Detail" />
          {garansi.status === "BELUM_DIKONFIGURASI" ? (
            <KonfigurasiGaransiCard
              kategoriBast={garansi.kategoriBast}
              isSaving={konfiguring}
              onSubmit={konfigurasiTimeline}
            />
          ) : garansi.kategoriGaransi === "TIDAK_ADA" ? (
            <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 mt-6">
              <h3 className="font-bold text-slate-800 text-sm mb-2">
                Tidak Ada Garansi
              </h3>
              <p className="text-sm text-gray-500">
                Pengadaan ini tidak memiliki garansi.
              </p>
            </div>
          ) : (
            <TrackingGaransiSection
              picGaransi={garansi.pic?.nama ?? "-"}
              periodeMulai={periodeMulai}
              periodeAkhir={periodeAkhir}
              months={months}
              updatingTanggal={updatingTanggal}
              kategoriGaransi={garansi.kategoriGaransi}
              onSaveTanggal={updateTanggalKunjungan}
            />
          )}
        </div>

        {garansi.status !== "BELUM_DIKONFIGURASI" && garansi.kategoriGaransi !== "TIDAK_ADA" && (
          <div>
            <SectionHeading title="Dokumen" />
            <div className="space-y-4 mt-6">
              <LogBookSection logbook={logbook} />
              <DokumenPendukungSection dokumen={dokumenPendukung} />
            </div>
          </div>
        )}
      </div>

      <div className="col-span-12 lg:col-span-3">
        <ActivityLogSectionGaransi logs={mappedLogs} />
      </div>
    </div>
  );
}

export default function Step8({ trackingId }: Step8Props) {
  const {
    garansis,
    loading,
    error,
    refetch,
    konfiguring,
    konfigurasiTimeline,
    updatingTanggal,
    updateTanggalKunjungan,
  } = useGaransi(trackingId);

  // Tracking bisa punya sampai 2 Garansi (PAC & FirePro) kalau BAST-nya juga
  // kebentuk 2 — cuma dijadiin tab terpisah kalau memang ada 2. Kalau cuma 1
  // (PAC aja, Fire aja, atau UMUM) tetep tampil langsung tanpa tab.
  const [activeTab, setActiveTab] = useState(0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <p className="animate-pulse">Memuat data Garansi...</p>
      </div>
    );
  }

  if (error || !garansis || garansis.length === 0) {
    return (
      <div className="p-6 text-center border border-red-100 bg-red-50 rounded-xl space-y-3">
        <p className="text-red-600 font-medium">
          {error
            ? `Gagal memuat data Garansi: ${error}`
            : "Data Garansi belum tersedia. Garansi otomatis dibuat setelah BAST selesai."}
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-100 transition-colors"
        >
          Coba Lagi
        </button>
      </div>
    );
  }

  const current = garansis[Math.min(activeTab, garansis.length - 1)];

  return (
    <div className="space-y-6">
      {garansis.length > 1 && (
        <div className="flex items-center gap-2 border-b border-gray-100">
          {garansis.map((g, i) => (
            <button
              key={g.id}
              onClick={() => setActiveTab(i)}
              className={`px-4 py-2 text-sm font-bold border-b-2 -mb-px transition-colors ${
                i === activeTab
                  ? "border-cyan-500 text-cyan-600"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {TAB_LABEL[g.kategoriBast] ?? g.kategoriBast}
            </button>
          ))}
        </div>
      )}

      <GaransiTabContent
        garansi={current}
        konfiguring={konfiguring}
        konfigurasiTimeline={konfigurasiTimeline}
        updatingTanggal={updatingTanggal}
        updateTanggalKunjungan={updateTanggalKunjungan}
      />
    </div>
  );
}
