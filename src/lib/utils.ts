import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTimeAgo(dateStr: string) {
  if (!dateStr || dateStr.startsWith("0001-01-01") || dateStr === "null") return "-"
  const now = new Date()
  const past = new Date(dateStr)
  // Check if past date is invalid
  if (isNaN(past.getTime())) return "-"
  const diffInMs = now.getTime() - past.getTime()
  const diffInSec = Math.floor(diffInMs / 1000)
  const diffInMin = Math.floor(diffInSec / 60)
  const diffInHour = Math.floor(diffInMin / 60)
  const diffInDay = Math.floor(diffInHour / 24)

  if (diffInSec < 60) return "Baru saja"
  if (diffInMin < 60) return `${diffInMin} menit yang lalu`
  if (diffInHour < 24) return `${diffInHour} jam yang lalu`
  return `${diffInDay} hari yang lalu`
}

// Nomor penawaran belum diisi disimpan backend sebagai placeholder
// "PENDING-<trackingId>" (lihat CreateTrackingPenawaran) biar gak bentrok
// sama constraint unique/not-null. Di FE ditampilkan sebagai "-".
export function formatNomorPenawaran(nomorPenawaran?: string | null) {
  if (!nomorPenawaran || nomorPenawaran.startsWith("PENDING")) return "-"
  return nomorPenawaran
}
