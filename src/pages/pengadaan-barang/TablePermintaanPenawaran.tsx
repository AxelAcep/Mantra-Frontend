import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router";
import { usePenawaranList } from "@/hooks/use-create-penawaran";

interface UserSession {
  role?: "MASTER" | "PEGAWAI" | "KARYAWAN" | "SUPERVISI";
}

const getAuthData = () => {
  const session = localStorage.getItem("user");
  const user: UserSession = session ? JSON.parse(session) : {};
  return {
    isLoggedIn: !!user.role,
    role: user.role,
  };
};

function formatTanggal(iso: string) {
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatRupiah(nilai: number | null) {
  if (!nilai) return null;
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(nilai);
}

function stepToStatus(step: string): PermintaanPenawaran["status"] {
  const map: Record<string, PermintaanPenawaran["status"]> = {
    PERMINTAAN_MASUK: "Perlu tindakan",
    PENYUSUNAN_BOQ: "Draft",
    REVIEW_INTERNAL: "Review",
    PERSETUJUAN_MANAJEMEN: "Review",
  };
  return map[step] ?? "Draft";
}

type PermintaanPenawaran = {
  status: "Perlu tindakan" | "Review" | "Revisi" | "Draft";
};

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

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50/50 border-y border-gray-100">
            <tr className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
              <th className="px-6 py-4">Tanggal Permintaan</th>
              <th className="px-6 py-4">No. Penawaran</th>
              <th className="px-6 py-4">PIC Req</th>
              <th className="px-6 py-4">Pembuat Penawaran</th>
              {isMaster && <th className="px-6 py-4">Estimasi Nilai</th>}
              <th className="px-6 py-4 text-center">Status</th>
              <th className="px-6 py-4 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-sm">
            {isLoading && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-400 text-sm"
                >
                  Memuat data...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-red-400 text-sm"
                >
                  Gagal memuat data.
                </td>
              </tr>
            )}
            {!isLoading && !isError && data?.data.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-10 text-center text-gray-300 text-sm"
                >
                  Tidak ada data penawaran.
                </td>
              </tr>
            )}
            {data?.data.map((item) => {
              const status = stepToStatus(item.stepSaatIni);
              const isAlert = false;
              return (
                <tr
                  key={item.id}
                  className={`transition-colors ${isAlert ? "bg-[#fffbeb]" : "hover:bg-gray-50/50"}`}
                >
                  <td className="px-6 py-5 text-gray-500">
                    {formatTanggal(item.tanggalMasuk)}
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700">
                    {item.nomorPenawaran}
                  </td>
                  <td className="px-6 py-5 font-bold text-slate-700">
                    {item.picReq?.nama ?? "—"}
                  </td>
                  <td className="px-6 py-5 text-gray-400 font-medium">
                    {item.pembuatPenawaran?.nama ?? "—"}
                  </td>
                  {isMaster && (
                    <td className="px-6 py-5 font-semibold text-gray-400">
                      {formatRupiah(item.estimasiHarga) ?? (
                        <span className="text-gray-300">Belum Tersedia</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-5">
                    <div className="flex justify-center">
                      <StatusBadge status={status} />
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <Link
                      className="inline-flex items-center gap-1 text-cyan-500 font-bold hover:text-cyan-600 transition-colors"
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

function StatusBadge({ status }: { status: PermintaanPenawaran["status"] }) {
  const config = {
    "Perlu tindakan":
      "bg-[#fff7ed] text-[#ea580c] border-[#ffedd5] ring-1 ring-[#fed7aa]",
    Review: "bg-[#fefce8] text-[#ca8a04] border-[#fef9c3]",
    Revisi: "bg-[#fef2f2] text-[#dc2626] border-[#fee2e2]",
    Draft: "bg-[#f8fafc] text-[#64748b] border-[#f1f5f9]",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold border shadow-sm ${config[status]}`}
    >
      {status === "Perlu tindakan" && <span>⚠️</span>}
      {status}
    </span>
  );
}
