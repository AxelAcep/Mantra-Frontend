import React, { useState } from "react";
import { User, Clock3 } from "lucide-react";
import type { TrackingPenawaranDetail } from "@/services/penawaran.services";
import {
  useAssignPreSales,
  useAssignMarketing,
  usePegawaiByDivisi,
} from "@/hooks/use-penawaran";
import type { Mode } from "./index";

function getInitials(nama: string) {
  return nama
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function InfoCard({
  title,
  name,
  sub,
  initials,
  icon,
}: {
  title: string;
  name: string;
  sub: string;
  initials: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-[11px] uppercase tracking-tight mb-5">
        <span className="text-cyan-500">{icon}</span>
        <span>{title}</span>
      </div>
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-base shrink-0">
          {initials}
        </div>
        <div>
          <p className="text-lg font-bold text-slate-800 leading-tight">
            {name}
          </p>
          <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-tight">
            {sub}
          </p>
        </div>
      </div>
    </div>
  );
}

function PegawaiSelect({
  divisi,
  value,
  onChange,
  placeholder,
}: {
  divisi: string;
  value: string;
  onChange: (id: string) => void;
  placeholder: string;
}) {
  const { data: options = [], isLoading } = usePegawaiByDivisi(divisi);

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={isLoading}
      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:opacity-50"
    >
      <option value="">{isLoading ? "Memuat..." : placeholder}</option>
      {options.map((p) => (
        <option key={p.id} value={p.id}>
          {p.nama}
        </option>
      ))}
    </select>
  );
}

function AssignCard({
  icon,
  title,
  divisi,
  currentPegawai,
  onAssign,
  isPending,
}: {
  icon: React.ReactNode;
  title: string;
  divisi: string;
  currentPegawai?: { id: string; nama: string; divisi?: string };
  onAssign: (id: string, onSuccess: () => void) => void; // ← callback
  isPending: boolean;
}) {
  const [selectedId, setSelectedId] = useState(currentPegawai?.id ?? "");
  const [isEditing, setIsEditing] = useState(!currentPegawai);

  React.useEffect(() => {
    if (currentPegawai?.id) {
      setSelectedId(currentPegawai.id);
      setIsEditing(false);
    }
  }, [currentPegawai?.id]);

  if (!isEditing && currentPegawai) {
    return (
      <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-[11px] uppercase tracking-tight mb-5">
          <span className="text-cyan-500">{icon}</span>
          <span>{title}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-base shrink-0">
              {getInitials(currentPegawai.nama)}
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 leading-tight">
                {currentPegawai.nama}
              </p>
              <p className="text-xs text-gray-400 font-medium mt-1 uppercase tracking-tight">
                {currentPegawai.divisi ?? divisi}
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedId(currentPegawai.id);
              setIsEditing(true);
            }}
            className="px-5 py-2 border-2 border-cyan-500 text-cyan-500 text-sm font-bold rounded-xl hover:bg-cyan-50 transition-all active:scale-95"
          >
            Ubah
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full flex flex-col">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-[11px] uppercase tracking-tight mb-5">
        <span className="text-cyan-500">{icon}</span>
        <span>{title}</span>
      </div>
      <PegawaiSelect
        divisi={divisi}
        value={selectedId}
        onChange={setSelectedId}
        placeholder={`Pilih ${title}`}
      />
      <div className="flex items-center gap-2 mt-3 justify-end">
        {currentPegawai && (
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Batal
          </button>
        )}
        <button
          onClick={() => {
            if (!selectedId || isPending) return;
            onAssign(selectedId, () => setIsEditing(false)); // ← pass callback
          }}
          disabled={!selectedId || isPending}
          className="px-4 py-1.5 text-xs bg-cyan-500 hover:bg-cyan-600 text-white font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Menyimpan..." : "Simpan"}
        </button>
      </div>
    </div>
  );
}

function WorkTimeCard({
  activity,
}: {
  activity?: {
    status: string;
    targetSelesai: string;
    waktuMulai: string;
  };
}) {
  const progress = React.useMemo(() => {
    if (!activity) return 0;
    const start = new Date(activity.waktuMulai).getTime();
    const end = new Date(activity.targetSelesai).getTime();
    // eslint-disable-next-line react-hooks/purity
    const now = Date.now();
    if (end <= start) return 0;
    return Math.min(
      100,
      Math.max(0, Math.round(((now - start) / (end - start)) * 100)),
    );
  }, [activity, activity?.status]);

  const sisaWaktu = React.useMemo(() => {
    if (!activity) return "-";
    if (activity.status == "DITERIMA") return "Selesai";
    // eslint-disable-next-line react-hooks/purity
    const diff = new Date(activity.targetSelesai).getTime() - Date.now();
    if (diff <= 0) return "Waktu habis";
    const jam = Math.floor(diff / 3600000);
    const menit = Math.floor((diff % 3600000) / 60000);
    return jam > 0 ? `${jam} jam ${menit} menit` : `${menit} menit`;
  }, [activity]);

  const batasWaktu = activity
    ? new Date(activity.targetSelesai).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      }) + " WIB"
    : "-";

  const statusLabel =
    activity?.status === "ON_PROGRESS"
      ? "Proses"
      : activity?.status === "SELESAI"
        ? "Selesai"
        : (activity?.status ?? "-");

  const progressColor =
    activity?.status === "DITERIMA"
      ? "bg-green-400"
      : progress >= 80
        ? "bg-red-400"
        : progress >= 50
          ? "bg-amber-400"
          : "bg-cyan-400";

  return (
    <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm h-full">
      <div className="flex justify-between items-center mb-5">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-[11px] uppercase tracking-tight">
          <Clock3 size={16} className="text-cyan-500" />
          <span>Waktu Pengerjaan</span>
        </div>
        <span className="text-[11px] bg-amber-50 text-amber-500 px-3 py-1 rounded-full font-bold uppercase tracking-tight">
          {statusLabel}
        </span>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-gray-400 font-medium text-xs">
            Sisa waktu: {sisaWaktu}
          </span>
          <span className="text-lg font-bold text-slate-800">{progress}%</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all ${progressColor}`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-gray-400 font-medium pt-1">
          Batas waktu: {batasWaktu}
        </p>
      </div>
    </div>
  );
}

interface DetailSectionProps {
  mode: Mode;
  trackingId: string;
  data?: TrackingPenawaranDetail;
  canAssignPreSales: boolean;
}

// DetailSection.tsx — bagian DetailSection export default

// DetailSection.tsx — bagian DetailSection export default

export default function DetailSection({
  trackingId,
  data,
  canAssignPreSales,
}: DetailSectionProps) {
  const marketing = data?.marketing;
  const preSales = data?.permintaanMasuk?.preSales;
  const activity = data?.permintaanMasuk?.activity;

  const { mutate: assignPreSales, isPending: isAssigningPreSales } =
    useAssignPreSales(trackingId);

  const { mutate: assignMarketing, isPending: isAssigningMarketing } =
    useAssignMarketing(trackingId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
      {/* PIC Request */}
      {canAssignPreSales ? (
        <AssignCard
          icon={<User size={16} />}
          title="PIC Request"
          divisi="SALES"
          currentPegawai={marketing}
          onAssign={(id, onSuccess) => {
            assignMarketing(id, { onSuccess }); // ← hit API sekarang
          }}
          isPending={isAssigningMarketing}
        />
      ) : (
        <InfoCard
          icon={<User size={16} />}
          title="PIC Request"
          name={marketing?.nama ?? "-"}
          sub={marketing?.divisi ?? "Sales"}
          initials={marketing ? getInitials(marketing.nama) : "-"}
        />
      )}

      {/* Pembuat Penawaran */}
      {canAssignPreSales ? (
        <AssignCard
          icon={<User size={16} />}
          title="Pembuat Penawaran"
          divisi="PRESALES"
          currentPegawai={preSales}
          onAssign={(id, onSuccess) => {
            assignPreSales(id, {
              onSuccess: () => {
                onSuccess(); // ← tutup edit mode
              },
            });
          }}
          isPending={isAssigningPreSales}
        />
      ) : (
        <InfoCard
          icon={<User size={16} />}
          title="Pembuat Penawaran"
          name={preSales?.nama ?? "Belum ditentukan"}
          sub="Pre-Sales"
          initials={preSales ? getInitials(preSales.nama) : "-"}
        />
      )}

      {/* Waktu Pengerjaan */}
      <WorkTimeCard activity={activity} />
    </div>
  );
}
