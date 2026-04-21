type KPISummary = {
  baik: number
  cukup: number
  buruk: number
}

export function OverviewKaryawan({ summary }: { summary: KPISummary }) {
  const total = summary.baik + summary.cukup + summary.buruk
  return (
    <div className="bg-white p-6 rounded-lg shadow space-y-2">
      <h2 className="text-xl font-bold">Overview Karyawan</h2>
      <p>Total Penilaian: <strong>{total}</strong></p>
      <div className="flex gap-4">
        <div className="flex-1 p-4 bg-green-100 text-green-700 rounded-lg text-center">
          Baik<br /><strong>{summary.baik}</strong>
        </div>
        <div className="flex-1 p-4 bg-yellow-100 text-yellow-700 rounded-lg text-center">
          Cukup<br /><strong>{summary.cukup}</strong>
        </div>
        <div className="flex-1 p-4 bg-red-100 text-red-700 rounded-lg text-center">
          Buruk<br /><strong>{summary.buruk}</strong>
        </div>
      </div>
    </div>
  )
}
