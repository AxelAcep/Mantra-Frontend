import { useState, useEffect } from "react";
import { Outlet, useOutletContext, useLocation } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

// Definisikan tipe datanya
type ContextType = { setTitle: (title: string) => void };

export default function Layout() {
    const location = useLocation();
    const [title, setTitle] = useState("Default Title");

    useEffect(() => {
        const path = location.pathname;
        if (path.includes("/dailyactivity")) {
            setTitle("Daily Activity");
        } else if (path.includes("/akunkaryawan") || path.includes("/manajemen-akun")) {
            setTitle("Akun Karyawan");
        } else if (path.includes("/dashboard")) {
            setTitle("Beranda");
        } else if (path.includes("/notifikasi")) {
            setTitle("Notifikasi");
        } else if (path.includes("/pengadaan-barang")) {
            setTitle("Pengadaan Barang");
        } else if (path.includes("/perusahaan")) {
            setTitle("Daftar Perusahaan");
        }
    }, [location.pathname]);

    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen">
                <AppSidebar />
                <SidebarInset>
                    {/* Kirim title yang sudah diupdate ke SiteHeader */}
                    <SiteHeader title={title} />
                    <main className="flex-1">
                        {/* Kirim fungsi setTitle ke semua halaman di dalam Outlet */}
                        <Outlet context={{ setTitle } satisfies ContextType} />
                    </main>
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
}

// Helper hook agar manggilnya gampang di page
export function useHeaderTitle() {
    return useOutletContext<ContextType>();
}