import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { type KPISummary, type WeeklyTrend } from "@/services/kpi.services"

type KPIChartProps = {
  summary: KPISummary
  trends: WeeklyTrend[]
  bulan: number
  tahun: number
}

export function KPIChart({ summary, trends }: KPIChartProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Distribusi KPI</h2>
      <div className="flex gap-4">
        <div className="flex-1">
          <p className="text-sm">Baik: {summary.baik}</p>
          <p className="text-sm">Cukup: {summary.cukup}</p>
          <p className="text-sm">Buruk: {summary.buruk}</p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={trends}>
            <XAxis dataKey="minggu" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="baik" fill="#22c55e" />
            <Bar dataKey="cukup" fill="#f59e0b" />
            <Bar dataKey="buruk" fill="#ef4444" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
