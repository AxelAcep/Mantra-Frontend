import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useKPIOverview } from "@/hooks/use-kpi"
import { Icons } from "@/assets"
import { Button } from "@/components/ui/button"
import type { KPISummary, WeeklyTrend, Activity, NilaiKPI } from "@/services/kpi.services" // adjust path as neededdd
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import { StatusBadge } from "@/pages/daily/manager/status-badge"

// ─── Donuts Chartsss ─────────────────────────────────────────────────────────────
function DonutChart({ baik, cukup, buruk }: KPISummary) {
  const total = baik + cukup + buruk || 1
  const r = 54
  const cx = 70
  const cy = 70
  const circumference = 2 * Math.PI * r

  const segments = [
    { value: baik, color: "#22c55e", label: "Baik" },
    { value: cukup, color: "#eab308", label: "Cukup" },
    { value: buruk, color: "#ef4444", label: "Buruk" },
  ]

  let offset = 0
  const slices = segments.map((seg) => {
    const dash = (seg.value / total) * circumference
    const gap = circumference - dash
    const slice = { ...seg, dash, gap, offset }
    offset += dash
    return slice
  })

  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      {slices.map((s, i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={s.color}
          strokeWidth={14}
          strokeDasharray={`${s.dash} ${s.gap}`}
          strokeDashoffset={-s.offset + circumference * 0.25}
          style={{ transition: "stroke-dasharray 0.5s" }}
        />
      ))}
      <text x={cx} y={cy - 6} textAnchor="middle" fontSize={20} fontWeight="700" fill="#1e293b">
        {total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fontSize={10} fill="#64748b">
        Aktivitas
      </text>
    </svg>
  )
}

// ─── Trend Line Chart ─────────────────────────────────────────────────────────
type SeriesKey = "baik" | "cukup" | "buruk"

function TrendChart({ trends }: { trends: WeeklyTrend[] }) {
  const weeks = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4", "Minggu 5", "Minggu 6"]
  const W = 340, H = 140, padL = 28, padB = 24, padT = 10, padR = 10
  const innerW = W - padL - padR
  const innerH = H - padT - padB

  const byWeek: Record<number, WeeklyTrend> = {}
  trends.forEach((t) => { byWeek[t.minggu] = t })

  const series: Record<SeriesKey, number[]> = {
    baik: weeks.map((_, i) => byWeek[i + 1]?.baik ?? 0),
    cukup: weeks.map((_, i) => byWeek[i + 1]?.cukup ?? 0),
    buruk: weeks.map((_, i) => byWeek[i + 1]?.buruk ?? 0),
  }

  const maxVal = Math.max(...Object.values(series).flat(), 1)
  const xStep = innerW / (weeks.length - 1)

  const pts = (arr: number[]) =>
    arr.map((v, i) => `${padL + i * xStep},${padT + innerH - (v / maxVal) * innerH}`).join(" ")

  const colors: Record<SeriesKey, string> = {
    baik: "#22c55e",
    cukup: "#eab308",
    buruk: "#ef4444",
  }

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      {[0, 0.25, 0.5, 0.75, 1].map((f, i) => {
        const y = padT + innerH - f * innerH
        return (
          <g key={i}>
            <line x1={padL} x2={W - padR} y1={y} y2={y} stroke="#e2e8f0" strokeWidth={1} />
            <text x={padL - 4} y={y + 4} fontSize={8} fill="#94a3b8" textAnchor="end">
              {Math.round(f * maxVal)}
            </text>
          </g>
        )
      })}
      {(Object.entries(series) as [SeriesKey, number[]][]).map(([key, arr]) => (
        <polyline
          key={key}
          points={pts(arr)}
          fill="none"
          stroke={colors[key]}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      ))}
      {(Object.entries(series) as [SeriesKey, number[]][]).map(([key, arr]) =>
        arr.map((v, i) => (
          <circle
            key={`${key}-${i}`}
            cx={padL + i * xStep}
            cy={padT + innerH - (v / maxVal) * innerH}
            r={3}
            fill={colors[key]}
          />
        ))
      )}
      {weeks.map((w, i) => (
        <text key={i} x={padL + i * xStep} y={H - 4} fontSize={7.5} fill="#94a3b8" textAnchor="middle">
          {w}
        </text>
      ))}
    </svg>
  )
}


// ─── Activity Table ───────────────────────────────────────────────────────────
interface ActivityTableProps {
  data: Activity[]
  page: number
  total: number
  totalPages: number
  activeTab: "aktivitas" | "riwayat"
  onPageChange: (page: number) => void
}

function KPIRatingBadge({ rating }: { rating?: NilaiKPI }) {
  if (!rating) return <span className="text-gray-400 text-[10px]">-</span>

  const config = {
    BAIK: { style: "bg-emerald-100 text-emerald-700", label: "Baik" },
    CUKUP: { style: "bg-amber-100 text-amber-700", label: "Cukup" },
    BURUK: { style: "bg-red-100 text-red-700", label: "Buruk" },
  }

  const { style, label } = config[rating]
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border border-transparent ${style}`}>
      {label}
    </span>
  )
}

function formatDateFull(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })
}

function formatTimeOnly(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", hour12: false }).replace(".", ":")
}

function ActivityTable({ data, page, total, totalPages, activeTab, onPageChange }: ActivityTableProps) {
  const navigate = useNavigate()

  const isRiwayat = activeTab === "riwayat"

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-6 pt-5 pb-3 border-b border-gray-100">
        <h2 className="font-bold text-gray-800 text-base">
          {isRiwayat ? "Tabel Riwayat Aktivitas" : "Seluruh Aktivitas"}
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          {isRiwayat
            ? "Riwayat terbaru aktivitas karyawan, termasuk waktu pelaksanaan, perusahaan terkait, kategori pekerjaan, serta hasil penilaian KPI oleh atasan."
            : "Aktivitas dari seluruh karyawan."}
        </p>
      </div>

      {data.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-center">
          <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <img src={Icons.CalendarX} alt="Empty" className="w-6 h-6 opacity-60" />
          </div>
          <h3 className="text-slate-700 font-semibold text-sm mb-1">
            {isRiwayat ? "Tidak ada riwayat aktivitas" : "Tidak ada aktivitas berjalan"}
          </h3>
          <p className="text-slate-400 text-[11px]">Saat ini belum ada data yang tersedia.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-b-xl">
          <Table className="table-fixed w-full min-w-[1000px]">
            <TableHeader>
              <TableRow className="bg-slate-50/50">
                {isRiwayat ? (
                  <>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-[15%]">Tanggal</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-[35%]">Aktivitas</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-[15%]">Perusahaan</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-[15%]">Kategori</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-center w-[10%]">Penilaian</TableHead>
                  </>
                ) : (
                  <>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-[15%]">Kategori Pekerjaan</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-[35%]">Judul Aktivitas</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-[15%]">Nomor Referensi</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider w-[15%]">Perusahaan</TableHead>
                    <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-center w-[10%]">Status</TableHead>
                  </>
                )}
                <TableHead className="px-6 py-4 text-slate-500 text-xs font-bold uppercase tracking-wider text-right w-[10%]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="divide-y divide-gray-50">
              {data.map((row) => (
                <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors group">
                  {isRiwayat ? (
                    <>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-700 font-semibold text-xs mb-0.5">{formatDateFull(row.targetSelesai)}</div>
                        <div className="text-[10px] text-slate-400 font-medium">{formatTimeOnly(row.waktuMulai)} - {formatTimeOnly(row.targetSelesai)}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="text-gray-800 font-bold text-xs mb-0.5 line-clamp-1">{row.judul}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{row.deskripsi}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-gray-700 font-medium text-xs line-clamp-1 mt-2">{row.perusahaan || "-"}</TableCell>
                      <TableCell className="px-6 py-4 text-gray-700 font-medium text-xs capitalize">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold">
                          {row.kategori.toLowerCase().replace(/_/g, " ")}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center"><KPIRatingBadge rating={row.nilaiKPI} /></TableCell>
                    </>
                  ) : (
                    <>
                      <TableCell className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-500 rounded text-[10px] font-bold capitalize">
                          {row.kategori.toLowerCase().replace(/_/g, " ")}
                        </span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="text-gray-800 font-bold text-xs mb-0.5 line-clamp-1">{row.judul}</div>
                        <div className="text-[10px] text-slate-400 line-clamp-1">{row.deskripsi}</div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-cyan-600 font-bold text-xs tracking-tight">{row.terkaitPO || "-"}</TableCell>
                      <TableCell className="px-6 py-4 text-gray-700 font-medium text-xs line-clamp-1 mt-2">{row.perusahaan || "-"}</TableCell>
                      <TableCell className="px-6 py-4 text-center"><StatusBadge status={row.status} /></TableCell>
                    </>
                  )}
                  <TableCell className="px-6 py-4 text-right">
                    <button
                      onClick={() => navigate(`/dailyactivity/${row.id}`)}
                      className="text-cyan-500 text-xs font-bold hover:text-cyan-600 flex items-center gap-1 justify-end ml-auto"
                    >
                      Lihat Detail
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="transition-transform group-hover:translate-x-0.5">
                        <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-[10px] text-slate-400 font-medium">
            Menampilkan <span className="text-slate-600 font-bold">{data.length}</span> dari <span className="text-slate-600 font-bold">{total}</span> data
          </p>
          <div className="flex gap-1 items-center">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {(() => {
              const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
              const visiblePages = pages.length <= 5
                ? pages
                : [1, 2, 3, Math.max(page - 1, 3), page, Math.min(page + 1, totalPages - 1), totalPages - 1, totalPages]
                  .filter((p, i, arr) => p >= 1 && p <= totalPages && arr.indexOf(p) === i)
                  .sort((a, b) => a - b)
                  .slice(0, 7);

              return visiblePages.map((p, idx) => {
                const prev = visiblePages[idx - 1];
                const showEllipsis = prev !== undefined && p - prev > 1;
                return (
                  <span key={p} className="flex items-center gap-1">
                    {showEllipsis && <span className="px-1 text-slate-400 text-xs font-bold">...</span>}
                    <button
                      onClick={() => onPageChange(p)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${page === p
                        ? "bg-cyan-500 text-white shadow-sm shadow-cyan-200"
                        : "bg-white text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100"
                        }`}
                    >
                      {p}
                    </button>
                  </span>
                )
              });
            })()}

            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-slate-400 hover:text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
type TimePeriod = "bulan" | "tahun"
type Tab = "aktivitas" | "riwayat"

const BULAN_LABELS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember",
]

export default function KPIOverviewPage() {
  const { pegawaiId } = useParams<{ pegawaiId: string }>()
  const navigate = useNavigate()
  const now = new Date()

  const [timePeriod, setTimePeriod] = useState<TimePeriod>("bulan")
  const [activeTab, setActiveTab] = useState<Tab>("aktivitas")
  const [page, setPage] = useState<number>(1)
  const [bulan, setBulan] = useState<number>(now.getMonth() + 1)
  const [tahun, setTahun] = useState<number>(now.getFullYear())
  const [filterOpen, setFilterOpen] = useState<boolean>(false)
  // draft state — only applied when user clicks Terapkan
  const [draftBulan, setDraftBulan] = useState<number>(now.getMonth() + 1)
  const [draftTahun, setDraftTahun] = useState<number>(now.getFullYear())

  const { data, isLoading, isError } = useKPIOverview(pegawaiId ?? "", page, bulan, tahun, activeTab)

  const handlePeriod = (period: TimePeriod) => {
    setTimePeriod(period)
    setPage(1)
    if (period === "bulan") {
      setBulan(now.getMonth() + 1)
      setTahun(now.getFullYear())
    } else {
      setBulan(0)
      setTahun(now.getFullYear())
    }
  }

  const applyFilter = () => {
    setBulan(draftBulan)
    setTahun(draftTahun)
    setPage(1)
    setFilterOpen(false)
  }

  const resetFilter = () => {
    setDraftBulan(now.getMonth() + 1)
    setDraftTahun(now.getFullYear())
  }

  // Generate year options: 3 years back to current
  const yearOptions = Array.from({ length: 4 }, (_, i) => now.getFullYear() - i)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-gray-500">Memuat data KPI...</p>
        </div>
      </div>
    )
  }

  if (isError || !data) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="text-4xl">⚠️</div>
          <p className="text-sm text-red-500 font-medium">Gagal memuat data KPI.</p>
          <button onClick={() => navigate(-1)} className="text-xs text-cyan-500 hover:underline">
            Kembali
          </button>
        </div>
      </div>
    )
  }

  const { pegawai, kpiSummary, weeklyTrends, activities } = data
  const totalKPI = kpiSummary.baik + kpiSummary.cukup + kpiSummary.buruk

  const initials = pegawai.nama
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="p-6 bg-slate-50 min-h-screen space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon"
          className="w-11 h-11 rounded-xl border-slate-200 shadow-sm shrink-0 hover:bg-slate-50"
          onClick={() => navigate(-1)}
        >
          <img src={Icons.LeftArrow} alt="Back" className="w-4 h-4" />
        </Button>

        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-[#111827] tracking-tight">
            Detail Karyawan
          </h1>
        </div>
      </div>

      <div className="space-y-5">
        {/* Employee Header Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-cyan-100 flex items-center justify-center text-cyan-600 font-bold text-sm border border-cyan-200">
              {initials}
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-lg leading-tight">{pegawai.nama}</h1>
              <p className="text-xs text-gray-500">{pegawai.divisi}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {(["bulan", "tahun"] as TimePeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => handlePeriod(p)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${timePeriod === p ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                1 {p.charAt(0).toUpperCase() + p.slice(1)}
              </button>
            ))}
            <div className="relative">
              <button
                onClick={() => { setFilterOpen((o) => !o); setDraftBulan(bulan); setDraftTahun(tahun) }}
                className={`px-3 py-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${filterOpen ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M2 4h12M4 8h8M6 12h4" />
                </svg>
                Filter
                {(bulan !== now.getMonth() + 1 || tahun !== now.getFullYear()) && (
                  <span className="ml-1 w-1.5 h-1.5 rounded-full bg-cyan-300 inline-block" />
                )}
              </button>

              {filterOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-100 z-50 p-4 space-y-4">
                  {/* Tahun */}
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Tahun</p>
                    <div className="flex flex-wrap gap-1.5">
                      {yearOptions.map((y) => (
                        <button
                          key={y}
                          onClick={() => setDraftTahun(y)}
                          className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${draftTahun === y ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {y}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Bulan */}
                  <div>
                    <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide mb-2">Bulan</p>
                    <div className="grid grid-cols-3 gap-1.5">
                      {BULAN_LABELS.map((label, idx) => (
                        <button
                          key={idx}
                          onClick={() => setDraftBulan(idx + 1)}
                          className={`py-1 rounded-md text-xs font-medium transition-colors ${draftBulan === idx + 1 ? "bg-cyan-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                          {label.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-1 border-t border-gray-100">
                    <button
                      onClick={resetFilter}
                      className="flex-1 py-1.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                    >
                      Reset
                    </button>
                    <button
                      onClick={applyFilter}
                      className="flex-1 py-1.5 rounded-md text-xs font-medium bg-cyan-500 text-white hover:bg-cyan-600 transition-colors"
                    >
                      Terapkan
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Three Stats Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Overview */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-xs font-semibold text-gray-700 mb-1">Overview Aktivitas Karyawan</h2>
            <p className="text-xs text-gray-400 mb-4">
              Pie chart menampilkan total aktivitas karyawan dan rata-rata kontribusi kategori Baik, Cukup, dan Buruk pada periode terpilih.
            </p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">Total Aktivitas</div>
                <div className="text-xl font-bold text-gray-900">{totalKPI}</div>
                <div className="text-[10px] text-gray-400">Bulan ini</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">Rata-rata Nilai</div>
                <div className="text-xl font-bold text-gray-900">
                  {totalKPI === 0
                    ? "0%"
                    : `${Math.round(((kpiSummary.baik + kpiSummary.cukup) / totalKPI) * 100)}%`}
                </div>
                <div className="text-[10px] text-gray-400">Baik + Cukup</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">Reschedule</div>
                <div className="text-xl font-bold text-gray-900">0x</div>
                <div className="text-[10px] text-gray-400">perlu monitoring</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-3 text-center">
                <div className="text-[10px] text-gray-500 mb-1">Aktivitas Terakhir</div>
                <div className="text-sm font-bold text-gray-900">-</div>
                <div className="text-[10px] text-gray-400">–</div>
              </div>
            </div>
          </div>

          {/* Donut KPI */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-xs font-semibold text-gray-700 mb-1">Distribusi KPI per Kategori</h2>
            <p className="text-xs text-gray-400 mb-4">
              Pie chart menampilkan total aktivitas karyawan dan rata-rata kontribusi kategori Baik, Cukup, dan Buruk pada periode terpilih.
            </p>
            <div className="flex items-center gap-4">
              <DonutChart {...kpiSummary} />
              <div className="space-y-2">
                {(
                  [
                    { label: "Baik", count: kpiSummary.baik, color: "#22c55e" },
                    { label: "Cukup", count: kpiSummary.cukup, color: "#eab308" },
                    { label: "Buruk", count: kpiSummary.buruk, color: "#ef4444" },
                  ] as { label: string; count: number; color: string }[]
                ).map(({ label, count, color }) => (
                  <div key={label} className="flex items-center gap-2 text-xs">
                    <span className="w-2.5 h-2.5 rounded-full inline-block flex-shrink-0" style={{ background: color }} />
                    <span className="text-gray-600 w-10">{label}</span>
                    <span className="font-semibold text-gray-800">
                      {count} ({totalKPI === 0 ? "0" : Math.round((count / totalKPI) * 100)}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Trend Chart */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="text-xs font-semibold text-gray-700 mb-1">Tren Kualitas Aktivitas</h2>
            <p className="text-xs text-gray-400 mb-3">
              Tiga garis menunjukkan perubahan jumlah aktivitas kategori Baik, Cukup, dan Buruk. Dapat dipakai untuk membandingkan kestabilan performa bulanan atau tahunan.
            </p>
            <TrendChart trends={weeklyTrends ?? []} />
            <div className="flex items-center gap-3 mt-2 justify-center">
              {(
                [
                  { label: "Baik", color: "#22c55e" },
                  { label: "Cukup", color: "#eab308" },
                  { label: "Buruk", color: "#ef4444" },
                ] as { label: string; color: string }[]
              ).map(({ label, color }) => (
                <div key={label} className="flex items-center gap-1 text-[10px] text-gray-500">
                  <span className="w-5 h-0.5 inline-block rounded" style={{ background: color }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-200 mt-4 mb-4">
          {(["aktivitas", "riwayat"] as Tab[]).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab)
                setPage(1)
              }}
              className={`py-3 text-sm capitalize whitespace-nowrap flex items-center gap-1.5 border-b-2 -mb-px transition-colors ${activeTab === tab
                ? "border-cyan-500 text-cyan-500"
                : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Activity Table */}
        <ActivityTable
          data={activities.data}
          page={page}
          total={activities.total}
          totalPages={activities.totalPages}
          activeTab={activeTab}
          onPageChange={setPage}
        />
      </div>
    </div>
  )
}