import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"

type WeeklyTrend = {
  minggu: number
  baik: number
  cukup: number
  buruk: number
}

type TrenKualitasProps = {
  trends: WeeklyTrend[]
}

export function TrenKualitas({ trends }: TrenKualitasProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Tren Kualitas Mingguan</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={trends}>
          <XAxis dataKey="minggu" label={{ value: "Minggu", position: "insideBottomRight", offset: -5 }} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="baik" stackId="a" fill="#22c55e" />
          <Bar dataKey="cukup" stackId="a" fill="#fbbf24" />
          <Bar dataKey="buruk" stackId="a" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
