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
    /** URL/href tombol "Lihat →" */
    href: string
    /** Icon source (URL atau import asset) */
    icon: string
    /** Alt text untuk icon */
    iconAlt?: string
    /** Angka besar di tengah card */
    count: number | string
    /** Label keterangan di bawah angka */
    label: string
    /** Text untuk link (opsional, default: "Lihat →") */
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
        <Card className="rounded-xl border-slate-200 shadow-sm p-0 gap-0">
            {/* Bagian Header: Judul, Ikon, dan Tombol */}
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
                    <Link
                        to={href}
                        className="text-[11px] text-cyan-600 font-medium hover:underline"
                    >
                        {linkText}
                    </Link>
                </div>
            </CardHeader>

            {/* Bagian Content: Angka dan Keterangan */}
            <CardContent className="p-4 pt-0">
                <div className="text-2xl font-bold text-slate-800 leading-none mb-1">{count}</div>
                <p className="text-[11px] text-slate-500 leading-tight">{label}</p>
            </CardContent>
        </Card>
    )
}