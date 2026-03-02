import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/common/tabs-company-detail";
import { Icons } from "@/assets";
import DaftarPoPengadaan from "./table-daftar-po-pengadaan";
import DaftarPoMaintenance from "./table-daftar-po-maintenance";
import DaftarRiwayat from "./table-daftar-riwayat";

export default function TabsTableCompanyDetail() {
    return (
        <Tabs defaultValue="pengadaan-barang">
            <TabsList variant="line" className="border-b border-slate-200">
                <TabsTrigger value="pengadaan-barang" className="px-8 gap-2 text-slate-500 data-[state=active]:text-cyan-600">
                    <div 
                        className="w-4 h-4 bg-current" 
                        style={{
                            maskImage: `url(${Icons.Cart})`,
                            WebkitMaskImage: `url(${Icons.Cart})`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center'
                        }}
                    />
                    <span>Pengadaan Barang</span>
                </TabsTrigger>
                <TabsTrigger value="maintenance" className="px-8 gap-2 text-slate-500 data-[state=active]:text-cyan-600">
                    <div 
                        className="w-4 h-4 bg-current" 
                        style={{
                            maskImage: `url(${Icons.Maintenance})`,
                            WebkitMaskImage: `url(${Icons.Maintenance})`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center'
                        }}
                    />
                    <span>Maintenance</span>
                </TabsTrigger>
                <TabsTrigger value="riwayat" className="px-8 gap-2 text-slate-500 data-[state=active]:text-cyan-600">
                    <div 
                        className="w-4 h-4 bg-current" 
                        style={{
                            maskImage: `url(${Icons.LastActivity})`,
                            WebkitMaskImage: `url(${Icons.LastActivity})`,
                            maskSize: 'contain',
                            maskRepeat: 'no-repeat',
                            maskPosition: 'center'
                        }}
                    />
                    <span>Riwayat</span>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="pengadaan-barang" className="pt-4">
                <DaftarPoPengadaan />
            </TabsContent>
            <TabsContent value="maintenance" className="pt-4">
                <DaftarPoMaintenance />
            </TabsContent>
            <TabsContent value="riwayat" className="pt-4">
                <DaftarRiwayat />
            </TabsContent>
        </Tabs>
    )
}