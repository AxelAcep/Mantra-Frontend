import { Outlet } from "react-router-dom";
import { AppSidebar } from "@/components/layout/app-sidebar";
import { SiteHeader } from "@/components/layout/site-header";
import { SidebarProvider } from "../ui/sidebar";

export default function Layout() {
    return (
        <SidebarProvider>
            <div className="flex w-full min-h-screen">
            <AppSidebar />
                <div className="flex-1 flex flex-col">
                <SiteHeader />
                <main className="flex-1 p-3">
                    <Outlet />
                </main>
                </div>
            </div>
        </SidebarProvider>
    );
}