import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tabs-company-detail";
import DaftarKonfirmasiSelesaiPengadaanBarang from "./table-pengadaan-barang";
import DaftarKonfirmasiSelesaiMaintenance from "./table-maintenance";

export default function TabsTableKonfirmasiSelesai() {
    return (
        <Tabs defaultValue="pengadaan-barang">
            <TabsList variant="line" className="border-b border-slate-200">
                <TabsTrigger value="pengadaan-barang" className="px-8 gap-2 text-slate-500 data-[state=active]:text-cyan-600">
                    <span>Pengadaan Barang</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="px-8 gap-2 text-slate-500 data-[state=active]:text-cyan-600">
                    <span>Maintenance</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="pengadaan-barang" className="pt-4">
                <DaftarKonfirmasiSelesaiPengadaanBarang />
            </TabsContent>
            <TabsContent value="maintenance" className="pt-4">
                <DaftarKonfirmasiSelesaiMaintenance />
            </TabsContent>
        </Tabs>
    );
}