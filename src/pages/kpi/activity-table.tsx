type Activity = {
  id: string
  judul: string
  kategori: string
  targetSelesai: string
  status: string
  pegawai: { nama: string; divisi: string }
}

type ActivityTableProps = {
  data: Activity[]
  page: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function ActivityTable({ data }: ActivityTableProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Riwayat Aktivitas</h2>
      <table className="w-full text-sm border-collapse border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="border border-gray-300 p-3 text-left">Judul</th>
            <th className="border border-gray-300 p-3 text-left">Kategori</th>
            <th className="border border-gray-300 p-3 text-left">Target Selesai</th>
            <th className="border border-gray-300 p-3 text-left">Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={4} className="text-center p-4 text-gray-500">
                Tidak ada aktivitas.
              </td>
            </tr>
          ) : (
            data.map((item) => (
              <tr key={item.id} className="border border-gray-300 hover:bg-gray-50">
                <td className="border border-gray-300 p-3">{item.judul}</td>
                <td className="border border-gray-300 p-3">{item.kategori}</td>
                <td className="border border-gray-300 p-3">{new Date(item.targetSelesai).toLocaleDateString("id-ID")}</td>
                <td className="border border-gray-300 p-3">{item.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      {/* Pagination bisa ditambahkan di sini */}
      {/* <TablePagination page={page} totalPages={totalPages} onPageChange={onPageChange} /> */}
    </div>
  )
}
