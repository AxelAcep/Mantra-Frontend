import { useState } from "react"
import {
    BarChart, Bar, XAxis, YAxis, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import { Filter } from "lucide-react"
import { useKPIBulan, useKPIYearly, useDistribusiKPI, useMasterStats } from "@/hooks/use-kpi"
import type { KPIItem } from "@/services/kpi.services"

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"]
const YEARS = [2024, 2025, 2026, 2027]
const COLOR = { baik: "#22c55e", cukup: "#f59e0b", buruk: "#f87171" }

function toPercentage(data: KPIItem[]) {
    return data.map(item => {
        const total = item.baik + item.cukup + item.buruk
        const fullNama = item.nama.split(" ")[0]
        const nama = fullNama.length > 12 ? fullNama.substring(0, 12) + "..." : fullNama

        if (total === 0) return { nama, baik: 0, cukup: 0, buruk: 0, raw: { baik: 0, cukup: 0, buruk: 0 } }
        return {
            nama,
            baik: Math.round((item.baik / total) * 100),
            cukup: Math.round((item.cukup / total) * 100),
            buruk: Math.round((item.buruk / total) * 100),
            raw: {
                baik: item.baik,
                cukup: item.cukup,
                buruk: item.buruk,
            }
        }
    })
}

// ─── Filter Dropdown ──────────────────────────────────────────────────────────

function FilterDropdown({ bulan, tahun, onBulan, onTahun, onClose }: {
    bulan: number; tahun: number
    onBulan: (b: number) => void
    onTahun: (t: number) => void
    onClose: () => void
}) {
    return (
        <div className="absolute right-0 top-11 z-50 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-52 space-y-3">
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Bulan</label>
                <select
                    value={bulan}
                    onChange={e => onBulan(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200"
                >
                    {MONTHS.map((m, i) => <option key={i + 1} value={i + 1}>{m}</option>)}
                </select>
            </div>
            <div className="space-y-1">
                <label className="text-xs font-medium text-gray-500">Tahun</label>
                <select
                    value={tahun}
                    onChange={e => onTahun(Number(e.target.value))}
                    className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-200"
                >
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>
            <button
                onClick={onClose}
                className="w-full bg-cyan-500 text-white rounded-lg py-1.5 text-sm hover:bg-cyan-600 transition-colors"
            >
                Terapkan
            </button>
        </div>
    )
}

// ─── Donut Chart ──────────────────────────────────────────────────────────────

function DonutChart({ baik, cukup, buruk }: { baik: number; cukup: number; buruk: number }) {
    const total = baik + cukup + buruk

    if (total === 0) {
        return (
            <div className="flex items-center justify-center h-40 text-muted-foreground text-sm">
                Belum ada data
            </div>
        )
    }

    const pct = (v: number) => Math.round((v / total) * 100)
    const slices = [
        { label: "Baik", value: baik, color: COLOR.baik },
        { label: "Cukup", value: cukup, color: COLOR.cukup },
        { label: "Buruk", value: buruk, color: COLOR.buruk },
    ].filter(s => s.value > 0)

    return (
        <div className="flex items-center gap-8">
            <div className="relative flex-shrink-0" style={{ width: 150, height: 150 }}>
                <PieChart width={150} height={150}>
                    <Pie
                        data={slices}
                        cx={71} cy={71}
                        innerRadius={48} outerRadius={70}
                        dataKey="value"
                        strokeWidth={2}
                        stroke="#fff"
                    >
                        {slices.map((s, i) => <Cell key={i} fill={s.color} />)}
                    </Pie>
                </PieChart>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <p className="text-2xl font-bold text-gray-900 leading-none">{total}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Aktivitas</p>
                </div>
            </div>

            {/* Legend */}
            <div className="space-y-2.5">
                {[
                    { label: "Baik", value: baik, color: COLOR.baik },
                    { label: "Cukup", value: cukup, color: COLOR.cukup },
                    { label: "Buruk", value: buruk, color: COLOR.buruk },
                ].map(item => (
                    <div key={item.label} className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                        <span className="text-gray-700">
                            {item.value} {item.label}{" "}
                            <span className="text-muted-foreground">({pct(item.value)}%)</span>
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

// ─── Custom Tooltip ───────────────────────────────────────────────────────────

function CustomTooltip({ active, payload, label }: any) {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-3 py-2 text-xs space-y-1">
            <p className="font-semibold text-gray-800 mb-1">{label}</p>
            {payload.map((p: any) => (
                <div key={p.name} className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.fill }} />
                    <span className="text-gray-600">{p.name}:</span>
                    <span className="font-medium">
                        {p.payload.raw?.[p.dataKey] ?? 0} ({p.value}%)
                    </span>
                </div>
            ))}
        </div>
    )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function KPIChart() {
    const now = new Date()
    const [mode, setMode] = useState<"bulan" | "tahun">("bulan")
    const [bulan, setBulan] = useState(now.getMonth() + 1)
    const [tahun, setTahun] = useState(now.getFullYear())
    const [showFilter, setShowFilter] = useState(false)

    const { data: dataBulan, isLoading: loadBulan } = useKPIBulan(bulan, tahun)
    const { data: dataTahunan, isLoading: loadTahunan } = useKPIYearly(tahun)
    const { data: dataDistrib } = useDistribusiKPI(bulan, tahun)
    const { data: stats } = useMasterStats()   // ← balik ke sini

    const isLoading = mode === "bulan" ? loadBulan : loadTahunan
    const allRawData = mode === "bulan" ? (dataBulan?.data ?? []) : (dataTahunan?.data ?? [])

    // Filter hanya karyawan yang punya aktivitas (total > 0)
    const rawData = allRawData.filter(item => (item.baik + item.cukup + item.buruk) > 0)

    const chartData = toPercentage(rawData)
    const distribusi = dataDistrib?.data ?? { baik: 0, cukup: 0, buruk: 0 }

    const statItems = [
        { label: "Total Aktivitas", value: stats?.totalAktivitas ?? 0, accent: false },
        { label: "Perlu Konfirmasi Selesai", value: stats?.perluKonfirmasiSelesai ?? 0, accent: false },
        { label: "Pengajuan Reschedule", value: stats?.pengajuanReschedule ?? 0, accent: false },
        { label: "Overdue", value: stats?.overdue ?? 0, accent: false },
    ]

    return (
        <div className="w-full bg-white border border-gray-200 shadow-sm rounded-xl overflow-hidden space-y-5">
            <div className="p-6 space-y-5">

                {/* ── Header ── */}
                <div className="flex justify-between items-start gap-4">
                    <div>
                        <h2 className="text-xl font-bold">Ringkasan KPI Karyawan</h2>
                        <p className="text-sm text-muted-foreground">
                            Komposisi penilaian KPI {rawData.length} karyawan —{" "}
                            {mode === "bulan" ? `${MONTHS[bulan - 1]} ${tahun}` : `Tahun ${tahun}`}
                        </p>
                    </div>

                    <div className="relative flex items-center gap-2 flex-shrink-0">
                        {(["bulan", "tahun"] as const).map(m => (
                            <button
                                key={m}
                                onClick={() => setMode(m)}
                                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${mode === m
                                    ? "bg-cyan-500 text-white border-cyan-500"
                                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                                    }`}
                            >
                                {m === "bulan" ? "1 Bulan" : "1 Tahun"}
                            </button>
                        ))}
                        <button
                            onClick={() => setShowFilter(v => !v)}
                            className="px-3 py-1.5 rounded-full text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center gap-1.5 transition-colors"
                        >
                            <Filter className="w-3.5 h-3.5" />
                            Filter
                        </button>
                        {showFilter && (
                            <FilterDropdown
                                bulan={bulan} tahun={tahun}
                                onBulan={setBulan} onTahun={setTahun}
                                onClose={() => setShowFilter(false)}
                            />
                        )}
                    </div>
                </div>

                {/* ── Bar Chart (full width) ── */}
                <div>
                    <p className="text-sm font-semibold text-gray-700 mb-3">
                        Komposisi Penilaian KPI per Karyawan
                    </p>

                    {isLoading ? (
                        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                            Memuat data...
                        </div>
                    ) : chartData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
                            Belum ada data KPI.
                        </div>
                    ) : (
                        <>
                            <div style={{ width: "100%", height: 320 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={chartData}
                                        margin={{ top: 20, right: 20, left: -20, bottom: 0 }}
                                        barCategoryGap="25%"
                                    >
                                        <XAxis
                                            dataKey="nama"
                                            tick={{ fontSize: 10, fill: "#6b7280" }}
                                            axisLine={false}
                                            tickLine={false}
                                            interval={0}
                                            angle={-45}
                                            textAnchor="end"
                                            height={70}
                                        />
                                        <YAxis
                                            tickFormatter={v => `${v}%`}
                                            tick={{ fontSize: 11, fill: "#6b7280" }}
                                            axisLine={false} tickLine={false}
                                            domain={[0, 100]}
                                            ticks={[0, 25, 50, 75, 100]}
                                        />
                                        <Tooltip content={<CustomTooltip />} />
                                        <Bar dataKey="baik" stackId="s" fill={COLOR.baik} name="Baik" radius={[0, 0, 4, 4]} />
                                        <Bar dataKey="cukup" stackId="s" fill={COLOR.cukup} name="Cukup" radius={[0, 0, 0, 0]} />
                                        <Bar dataKey="buruk" stackId="s" fill={COLOR.buruk} name="Buruk" radius={[4, 4, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Legend */}
                            <div className="flex items-center justify-center gap-6 mt-0">
                                {[
                                    { color: COLOR.baik, label: "Baik" },
                                    { color: COLOR.cukup, label: "Cukup" },
                                    { color: COLOR.buruk, label: "Buruk" },
                                ].map(item => (
                                    <div key={item.label} className="flex items-center gap-1.5 text-xs text-gray-600">
                                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                        {item.label}
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ── Bottom Row: Informasi Tabel (kiri) | Distribusi KPI (kanan) ── */}
                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">

                    {/* ── Informasi Tabel — 2x2 grid ── */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Informasi Tabel</p>
                        <div className="grid grid-cols-2 gap-3">
                            {statItems.map(item => (
                                <div
                                    key={item.label}
                                    className="border border-gray-100 rounded-xl p-4 space-y-2 hover:bg-gray-50 transition-colors"
                                >
                                    <p className={`text-xs leading-snug ${item.accent ? "text-cyan-600 font-medium" : "text-muted-foreground"
                                        }`}>
                                        {item.label}
                                    </p>
                                    <p className="text-3xl font-bold text-gray-900">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ── Distribusi KPI ── */}
                    <div>
                        <p className="text-sm font-semibold text-gray-700 mb-3">Distribusi KPI</p>
                        <div className="border border-gray-100 rounded-xl p-5 flex items-center justify-center min-h-[185px]">
                            <DonutChart
                                baik={distribusi.baik}
                                cukup={distribusi.cukup}
                                buruk={distribusi.buruk}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
