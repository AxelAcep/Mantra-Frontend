import React from "react";
import { useGaransi } from "@/hooks/use-garansi";
import TrackingGaransiSection from "./TrackingGaransi";
import LogBookSection from "./LogBook";
import DokumenPendukungSection from "./DokumenPendukung";
import ActivityLogSectionGaransi from "./ActivityLog";
import KonfigurasiGaransiCard from "./KonfigurasiGaransiCard";

const NAMA_BULAN_PANJANG = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
];

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

export default function Step8({ trackingId }: Step8Props) {
  const {
    garansi,
    loading,
    error,
    refetch,
    konfiguring,
    konfigurasiTimeline,
    updatingTanggal,
    updateTanggalKunjungan,
  } = useGaransi(trackingId);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-500">
        <p className="animate-pulse">Memuat data Garansi...</p>
      </div>
    );
  }

  if (error || !garansi) {
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
              isSaving={konfiguring}
              onSubmit={konfigurasiTimeline}
            />
          ) : (
            <TrackingGaransiSection
              picGaransi={garansi.pic?.nama ?? "-"}
              periodeMulai={periodeMulai}
              periodeAkhir={periodeAkhir}
              months={months}
              updatingTanggal={updatingTanggal}
              onSaveTanggal={updateTanggalKunjungan}
            />
          )}
        </div>

        {garansi.status !== "BELUM_DIKONFIGURASI" && (
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
