import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Icons } from "@/assets"
import { Separator } from "@/components/common/separator-vertical"

export default function CardJadwalUlang() {
    return (
        <Card className="rounded-xl border-slate-200 shadow-sm p-0 gap-0">
            {/* Bagian Header: Judul, Ikon, dan Tombol */}
            <CardHeader className="p-4 pb-0 gap-2 h-[34%]">
                <div className="flex justify-between items-center">
                    <CardTitle className="text-[12px] font-bold uppercase text-slate-400">
                        JADWAL ULANG
                    </CardTitle>
                    <button className="text-[12px] text-cyan-600 font-medium hover:underline">
                        Lihat →
                    </button>
                </div>
            </CardHeader>

            <div className="px-4">
                <Separator className="bg-slate-200" />
            </div>

            {/* Bagian Content: Angka dan Keterangan */}
            <CardContent className="flex justify-between items-center w-full p-0">
                <button className="flex-1 flex flex-col items-center justify-center p-2 bg-white hover:bg-slate-50 transition-colors">
                    {/* Lingkaran Background Ikon (Cyan) */}
                    <div className="w-6 h-6 rounded-full bg-cyan-50 flex items-center justify-center mb-3 mt-1">
                        <img 
                        src={Icons.JadwalUlang} 
                        alt="Jadwal Ulang" 
                        className="w-6 h-6 object-contain" 
                        />
                    </div>
                    
                    <span className="text-xl font-bold text-slate-700 mb-2 leading-none">
                        8
                    </span>
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider text-center">
                        Jadwal Ulang
                    </span>
                </button>
            </CardContent>
        </Card>
    );
}