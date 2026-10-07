import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"

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
  const navigate = useNavigate()

  // Kembali ke histori sebelumnya supaya tab, halaman, sorting, dan filter
  // pada daftar pengadaan tetap utuh (semuanya tersimpan di URL).
  const handleBack = () => {
    if (onBack) onBack()
    else navigate(-1)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
      <div className="flex items-start gap-4">
        <button
          type="button"
          onClick={handleBack}
          className="mt-0.5 h-11 w-11 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 shadow-sm inline-flex items-center justify-center text-slate-500 transition-colors"
        >
          <ArrowLeft size={18} />
        </button>

        <div className="space-y-2">
          <h1 className="text-[24px] leading-none font-bold tracking-tight text-slate-900">
            {title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-sm text-slate-500">
            <span className="text-[16px] text-slate-500">{company}</span>
            <span className="px-3 py-1 bg-slate-200 text-slate-500 text-sm font-medium rounded-full border border-slate-100">
              {project}
            </span>
            <span className="px-3 py-1 bg-slate-200 text-slate-500 text-sm font-medium rounded-full border border-slate-100">
              {code}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
