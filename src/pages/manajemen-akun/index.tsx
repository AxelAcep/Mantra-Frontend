import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardAction,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DialogTambahKaryawan } from "./dialog-tambah-karyawan";
import { DialogEditKaryawan } from "./dialog-edit-karyawan";

const dataKaryawan = [
    {
        inisial: "BJ",
        nama: "Budi Johan",
        divisi: "Sales",
        username: "budi.santoso",
        aktivitasTanggal: "24 Okt 2023",
        aktivitasWaktu: "09:00 WIB",
        warnaInisial: "bg-blue-100 text-blue-600",
    },
    {
        inisial: "RA",
        nama: "Rina Amalia",
        divisi: "Sales",
        username: "rina.amalia",
        aktivitasTanggal: "24 Okt 2023",
        aktivitasWaktu: "09:00 WIB",
        warnaInisial: "bg-purple-100 text-purple-600",
    },
    {
        inisial: "JS",
        nama: "Joko Susilo",
        divisi: "Sales",
        username: "joko.susilo",
        aktivitasTanggal: "24 Okt 2023",
        aktivitasWaktu: "09:00 WIB",
        warnaInisial: "bg-cyan-100 text-cyan-600",
    },
    {
        inisial: "DK",
        nama: "Deni Kurniawan",
        divisi: "Pre-Sales",
        username: "deni.kurniawan",
        aktivitasTanggal: "24 Okt 2023",
        aktivitasWaktu: "09:00 WIB",
        warnaInisial: "bg-orange-100 text-orange-600",
    },
    {
        inisial: "SS",
        nama: "Sari Simorangkir",
        divisi: "Pre-Sales",
        username: "sari.simorangkir",
        aktivitasTanggal: "24 Okt 2023",
        aktivitasWaktu: "09:00 WIB",
        warnaInisial: "bg-indigo-100 text-indigo-600",
    },
];

export default function ManajemenAkunPage() {
    return (
        <div className="p-5">
            <Card className="shadow-none border rounded-xl overflow-hidden py-0! gap-0!">
                <CardHeader className="border-b px-6 py-5 bg-white">
                    <CardTitle className="text-xl font-bold text-slate-800">
                        Daftar Akun Karyawan
                    </CardTitle>
                    <CardDescription className="text-sm font-medium text-slate-500 mt-1">
                        Kelola data dan akses akun seluruh karyawan di perusahaan Anda.
                    </CardDescription>
                    <CardAction>
                        <DialogTambahKaryawan>
                            <Button className="bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-lg px-4 shadow-none">
                                <Plus className="w-4 h-4 mr-2" />
                                Tambah Karyawan
                            </Button>
                        </DialogTambahKaryawan>
                    </CardAction>
                </CardHeader>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-slate-50/50 hover:bg-slate-50/50">
                                <TableHead className="font-semibold text-slate-500 h-12 px-6">
                                    KARYAWAN
                                </TableHead>
                                <TableHead className="font-semibold text-slate-500 h-12">
                                    DIVISI
                                </TableHead>
                                <TableHead className="font-semibold text-slate-500 h-12">
                                    USERNAME
                                </TableHead>
                                <TableHead className="font-semibold text-slate-500 h-12">
                                    AKTIVITAS TERAKHIR
                                </TableHead>
                                <TableHead className="font-semibold text-slate-500 h-12 text-right px-6">
                                    AKSI
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {dataKaryawan.map((karyawan, index) => (
                                <TableRow key={index} className="hover:bg-slate-50/50">
                                    <TableCell className="px-6">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold ${karyawan.warnaInisial}`}
                                            >
                                                {karyawan.inisial}
                                            </div>
                                            <span className="font-medium text-slate-700">
                                                {karyawan.nama}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-medium">
                                        {karyawan.divisi}
                                    </TableCell>
                                    <TableCell className="text-slate-500 font-medium">
                                        {karyawan.username}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-700">
                                                {karyawan.aktivitasTanggal}
                                            </span>
                                            <span className="text-sm text-slate-500 mt-0.5 font-medium">
                                                {karyawan.aktivitasWaktu}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right px-6 ">
                                        <DialogEditKaryawan>
                                            <button className="text-cyan-500 font-semibold hover:text-cyan-600 text-sm">
                                                Edit
                                            </button>
                                        </DialogEditKaryawan>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>

                    {/* Pagination */}
                    <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
                        <div className="text-sm text-slate-500 font-medium">
                            Menampilkan <span className="text-slate-700 font-semibold">5</span>{" "}
                            dari <span className="text-slate-700 font-semibold">40</span> data
                        </div>
                        <div className="flex items-center gap-1">
                            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center bg-cyan-500 hover:bg-cyan-600 text-white font-medium rounded-md text-sm">
                                1
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 font-medium rounded-md text-sm transition-colors">
                                2
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 font-medium rounded-md text-sm transition-colors">
                                3
                            </button>
                            <span className="w-8 h-8 flex items-center justify-center text-slate-400 font-medium tracking-widest">
                                ...
                            </span>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-600 hover:text-cyan-600 hover:bg-cyan-50 font-medium rounded-md text-sm transition-colors">
                                8
                            </button>
                            <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-md">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}