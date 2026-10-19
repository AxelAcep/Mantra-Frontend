import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Link } from "react-router"

interface CardRingkasanProps {
    /** Judul kategori di atas, misal "Pengadaan Barang" */
    title: string
    /** Tujuan saat seluruh card diklik */
    href: string
    /** Icon source (URL atau import asset) */
    icon: string
    /** Alt text untuk icon */
    iconAlt?: string
    /** Angka besar di tengah card */
    count: number | string
    /** Label keterangan di bawah angka */
    label: string
    /** Text petunjuk aksi di pojok kanan (opsional, default: "Lihat →") */
    linkText?: string
}

export default function CardRingkasan({
    title,
    href,
    icon,
    iconAlt = "",
    count,
    label,
    linkText = "Lihat →",
}: CardRingkasanProps) {
    return (
        // Seluruh card dibungkus Link agar bisa diklik sebagai shortcut; teks "Lihat →"
        // sengaja dibuat non-interaktif supaya tidak ada link di dalam link.
        <Link
            to={href}
            className="group block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2"
        >
            <Card className="rounded-xl border-slate-200 shadow-sm p-0 gap-0 h-full transition hover:border-cyan-300 hover:shadow-md">
                {/* Bagian Header: Judul, Ikon, dan Petunjuk Aksi */}
                <CardHeader className="p-4 pb-2 gap-2">
                    <CardTitle className="text-[10px] font-bold uppercase text-slate-400 leading-tight">
                        {title}
                    </CardTitle>
                    <div className="flex justify-between items-center">
                        <img
                            src={icon}
                            alt={iconAlt}
                            className="w-5 h-5 shrink-0 object-contain"
                        />
                        <span className="text-[11px] text-cyan-600 font-medium group-hover:underline">
                            {linkText}
                        </span>
                    </div>
                </CardHeader>

                {/* Bagian Content: Angka dan Keterangan */}
                <CardContent className="p-4 pt-0">
                    <div className="text-2xl font-bold text-slate-800 leading-none mb-1">{count}</div>
                    <p className="text-[11px] text-slate-500 leading-tight">{label}</p>
                </CardContent>
            </Card>
        </Link>
    )
}