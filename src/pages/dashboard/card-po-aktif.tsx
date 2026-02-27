import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/assets"

export default function CardPOAktif() {
    return (
        <Card className="rounded-xl border-slate-200 shadow-sm p-0 gap-0">
            {/* Bagian Header: Judul, Ikon, dan Tombol */}
            <CardHeader className="p-4 pb-2 gap-2">
            <CardTitle className="text-[14px] font-bold uppercase text-slate-400">
                Pengadaan Barang
            </CardTitle>
            <div className="flex justify-between items-center">
                {/* Catatan: Gunakan tag <img> jika menggunakan Vite, atau <Image> jika menggunakan Next.js */}
                <img 
                src={Icons.POAktif} 
                alt="PO Aktif" 
                className="w-5 h-5 shrink-0 opacity-50 object-contain"
                />
                <button className="text-[12px] text-cyan-600 font-medium hover:underline">
                Lihat →
                </button>
            </div>
            </CardHeader>

            {/* Bagian Content: Angka dan Keterangan */}
            <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold text-slate-800">12</div>
            <p className="text-[12px] text-slate-500 mt-1">PO Aktif</p>
            </CardContent>
        </Card>
    );
}