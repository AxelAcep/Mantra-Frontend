import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"

interface TrackingHeaderProps {
  title: string
  project: string
  code: string
  company: string
  status: string
  onBack?: () => void
}

export default function TrackingHeader({
  title,
  project,
  code,
  company,
  status,
  onBack
}: TrackingHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        <Link
          to="/pengadaan-barang"
          className="mt-0.5 h-11 w-11 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm inline-flex items-center justify-center text-slate-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </Link>

        <div className="space-y-2">
          <h1 className="text-[24px] leading-none font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="text-[16px] text-slate-500">{company}</span>
            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-sm font-medium rounded-xl border border-cyan-100">
              {project}
            </span>
            <span className="px-3 py-1 bg-cyan-50 text-cyan-700 text-sm font-medium rounded-xl border border-cyan-100">
              {code}
            </span>
          </div>
        </div>
      </div>

      <span className="self-start md:self-center px-6 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-sm font-medium shadow-sm">
        Status: {status}
      </span>
    </div>
  )
}
