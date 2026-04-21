import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

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
}

export default function CardRingkasan({
    title,
    href,
    icon,
    iconAlt = "",
    count,
    label,
}: CardRingkasanProps) {
    return (
        <Card className="rounded-xl border-slate-200 shadow-sm p-0 gap-0">
            {/* Bagian Header: Judul, Ikon, dan Tombol */}
            <CardHeader className="p-4 pb-2 gap-2">
                <CardTitle className="text-[12px] font-bold uppercase text-slate-400">
                    {title}
                </CardTitle>
                <div className="flex justify-between items-center">
                    {/* Catatan: Gunakan tag <img> jika menggunakan Vite, atau <Image> jika menggunakan Next.js */}
                    <img
                        src={icon}
                        alt={iconAlt}
                        className="w-5 h-5 shrink-0 opacity-50 object-contain"
                    />
                    <a
                        href={href}
                        className="text-[12px] text-cyan-600 font-medium hover:underline"
                    >
                        Lihat →
                    </a>
                </div>
            </CardHeader>

            {/* Bagian Content: Angka dan Keterangan */}
            <CardContent className="p-4 pt-0">
                <div className="text-xl font-bold text-slate-800">{count}</div>
                <p className="text-[12px] text-slate-500 mt-1">{label}</p>
            </CardContent>
        </Card>
    )
}