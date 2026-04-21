import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Icons } from "@/assets"

export function SiteHeader({ title }: { title: string }) {
    return (
        <header className="sticky top-0 z-20 flex h-16 w-full items-center border-b bg-white px-6">
            <div className="flex items-center gap-4">
                <h1 className="text-xl font-bold tracking-tight text-slate-600">
                    {title}
                </h1>

                <Separator orientation="vertical" className="h-8! w-px! bg-slate-300" />

                <span className="text-md text-slate-400">
                    Hari ini, {new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date())}
                </span>
            </div>

            <div className="ml-auto flex items-center">
                {/* Search Bar - Hidden for now but preserved for future use */}
                {false && (
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
                            className="pl-10 border-none focus-visible:ring-1 focus-visible:ring-slate-200 bg-cyan-50 text-cyan-900 font-medium placeholder:text-cyan-500"
                        />
                    </div>
                )}
            </div>
        </header>
    );
}