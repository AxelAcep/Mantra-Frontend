import { useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarProvider } from "../ui/sidebar";

// Definisikan tipe datanya
type ContextType = { setTitle: (title: string) => void };

export default function Layout() {
    const [title, setTitle] = useState("Default Title");

    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen">
                <AppSidebar />
                <div className="flex-1 flex flex-col">
                    {/* Kirim title yang sudah diupdate ke SiteHeader */}
                    <SiteHeader title={title} />
                    <main className="flex-1">
                        {/* Kirim fungsi setTitle ke semua halaman di dalam Outlet */}
                        <Outlet context={{ setTitle } satisfies ContextType} />
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}

// Helper hook agar manggilnya gampang di page
export function useHeaderTitle() {
    return useOutletContext<ContextType>();
}