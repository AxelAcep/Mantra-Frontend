import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { usePenawaranList } from "@/hooks/use-create-penawaran";

interface UserSession {
  role?: string;
}

const getAuthData = () => {
  const session = localStorage.getItem("user");
  const user: UserSession = session ? JSON.parse(session) : {};
  return {
    isLoggedIn: !!user.role,
    role: user.role ?? "",
  };
};

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(nilai: number | null | undefined) {
  if (!nilai) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

type StatusType =
  | "ON_PROGRESS"
  | "PERLU_TINDAKAN"
  | "KONFIRMASI_SELESAI"
  | "SELESAI";

function StatusBadge({ status }: { status: StatusType }) {
  const config: Record<StatusType, string> = {
    ON_PROGRESS: "bg-orange-100 text-orange-700",
    PERLU_TINDAKAN: "bg-red-100 text-red-700",
    KONFIRMASI_SELESAI: "bg-amber-100 text-amber-700",
    SELESAI: "bg-emerald-100 text-emerald-700",
  };

  const label: Record<StatusType, string> = {
    ON_PROGRESS: "On Progress",
    PERLU_TINDAKAN: "Perlu Tindakan",
    KONFIRMASI_SELESAI: "Menunggu Konfirmasi",
    SELESAI: "Selesai",
  };

  const safeStatus: StatusType = config[status] ? status : "ON_PROGRESS";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent whitespace-nowrap ${config[safeStatus]}`}
    >
      {label[safeStatus]}
    </span>
  );
}

export default function TablePermintaanPenawaran() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { role } = getAuthData();
  const isMaster = role === "MASTER";

  const { data, isLoading, isError } = usePenawaranList({
    page,
    limit: 10,
    search,
  });

  return (
    <div>
      {/* Search */}
      <div className="px-6 py-4 border-b border-gray-100">
        <input
          type="text"
          placeholder="Cari no. penawaran, customer, lokasi..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full max-w-sm px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500 placeholder:text-gray-300"
        />
      </div>

      <div className="w-full overflow-x-auto px-6 pb-4 pt-2">
        <div className="w-full rounded-md border border-slate-200 bg-white min-w-[1000px]">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100 [&_th]:py-3.5 text-slate-600 text-xs font-medium uppercase tracking-wider">
              <th className="px-6 py-4">Tanggal Permintaan</th>
              <th className="px-6 py-4">No. Penawaran</th>
              <th className="px-6 py-4">PIC Req</th>
              <th className="px-6 py-4">Pembuat Penawaran</th>
              {isMaster && <th className="px-6 py-4">Estimasi Nilai</th>}
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-center">Tahapan</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {isLoading && (
              <tr>
                <td
                  colSpan={isMaster ? 8 : 7}
                  className="px-6 py-10 text-center text-gray-400 text-sm"
                >
                  Memuat data...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td
                  colSpan={isMaster ? 8 : 7}
                  className="px-6 py-10 text-center text-red-400 text-sm"
                >
                  Gagal memuat data.
                </td>
              </tr>
            )}
            {!isLoading && !isError && data?.data.length === 0 && (
              <tr>
                <td
                  colSpan={isMaster ? 8 : 7}
                  className="px-6 py-10 text-center text-gray-300 text-sm"
                >
                  Tidak ada data penawaran.
                </td>
              </tr>
            )}
            {!isError && data?.data.map((item) => {
              const status = (item.status ?? "ON_PROGRESS") as StatusType;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors border-b ${status === "PERLU_TINDAKAN"
                    ? "bg-[#fffbeb]"
                    : "hover:bg-slate-50/50"
                    } [&_td]:py-4`}
                >
                  <td className="px-6 text-gray-500">
                    {formatTanggal(item.tanggalMasuk)}
                  </td>
                  <td className="px-6 font-semibold text-slate-600">
                    {item.nomorPenawaran}
                  </td>
                  <td className="px-6 font-semibold text-slate-600">
                    {item.picReq?.nama ?? "—"}
                  </td>
                  <td className="px-6 text-gray-500 font-medium">
                    {item.pembuatPenawaran?.nama ?? "—"}
                  </td>
                  {isMaster && (
                    <td className="px-6 font-medium text-gray-500">
                      {formatRupiah(item.estimasiHarga) ?? (
                        <span className="text-gray-300">Belum Tersedia</span>
                      )}
                    </td>
                  )}
                  <td className="px-6">
                    <div className="flex justify-center">
                      <StatusBadge status={status} />
                    </div>
                  </td>
                  <td className="px-6 text-gray-500 font-medium text-center">
                    {item.stepSaatIni ? item.stepSaatIni.replace(/_/g, " ") : "—"}
                  </td>
                  <td className="px-6 text-right">
                    <Link
                      className="inline-flex items-center gap-1 text-cyan-600 font-semibold hover:text-cyan-700 transition-colors"
                      to={`/penawaran/${item.id}`}
                    >
                      Lihat Detail <ArrowRight size={14} />
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {data && data.meta.totalPages > 1 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
          <p className="text-xs text-gray-400">
            Menampilkan {data.data.length} dari {data.meta.total} data
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Sebelumnya
            </button>
            <span className="text-xs text-gray-500">
              {page} / {data.meta.totalPages}
            </span>
            <button
              onClick={() =>
                setPage((p) => Math.min(data.meta.totalPages, p + 1))
              }
              disabled={page === data.meta.totalPages}
              className="px-3 py-1.5 text-xs font-semibold border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Berikutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
