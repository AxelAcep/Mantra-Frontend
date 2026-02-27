import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/assets"

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-10 flex h-16 w-full items-center border-b bg-white px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-2xl font-bold tracking-tight text-slate-600">
                    Dashboard Operasional
                </h1>
                
                <Separator orientation="vertical" className="h-8! w-px! bg-slate-300" />
                
                <span className="text-lg text-slate-400">
                    Hari ini, 24 Februari 2026
                </span>
            </div>

            <div className="ml-auto flex items-center">
                <div className="relative w-64">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 z-20">
                        <img 
                            src={Icons.Search} 
                            alt="Search" 
                            width={16} 
                            height={16}
                            className="opacity-50" 
                        />
                    </div>
                    <Input 
                        placeholder="Cari proyek, customer..." 
                        className="bg-slate-50 pl-10 border-none focus-visible:ring-1 focus-visible:ring-slate-200"
                    />
                </div>
            </div>
        </header>
    );
}