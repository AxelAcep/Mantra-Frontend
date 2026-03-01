import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Icons } from "@/assets";
import DaftarPoPengadaan from "./table-company-detail";

export default function TabsTableCompanyDetail() {
    return (
        <Tabs defaultValue="pengadaan-barang">
            <TabsList variant="line" className="border-b border-slate-200">
                <TabsTrigger value="pengadaan-barang" className="px-8 gap-2">
                    <img src={Icons.Cart} className="w-4 h-4 text-cyan-600" />
                    <span>Pengadaan Barang</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="px-8 gap-2">
                    <img src={Icons.Maintenance2} className="w-4 h-4 text-cyan-600" />
                    <span>Maintenance</span>
                </TabsTrigger>
                <TabsTrigger value="riwayat" className="px-8 gap-2">
                    <img src={Icons.LastActivity} className="w-4 h-4 text-cyan-600" />
                    <span>Riwayat</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="pengadaan-barang" className="pt-4">
                <DaftarPoPengadaan />
            </TabsContent>
            <TabsContent value="maintenance" className="pt-4">
                <DaftarPoPengadaan />
            </TabsContent>
            <TabsContent value="riwayat" className="pt-4">
            </TabsContent>
        </Tabs>
    )
}