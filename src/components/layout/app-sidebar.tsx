import { NavLink, useLocation } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { Icons } from "@/assets";

const menuOperasional = [
  { title: "Beranda", icon: Icons.Beranda, url: "/dashboard", active: true },
  { title: "Notifikasi", icon: Icons.Notifikasi, url: "#", badge: 5 },
  { title: "Pengadaan Barang", icon: Icons.Pengadaan, url: "#", badge: 3 },
  { title: "Tracking Barang", icon: Icons.Tracking, url: "#" },
  { title: "Maintenance", icon: Icons.Maintenance, url: "#", badge: 1 },
  { title: "Daftar Perusahaan", icon: Icons.DaftarPerusahaan, url: "/perusahaan" },
];

const menuManajemen = [
  { title: "Logbook", icon: Icons.Logbook, url: "/logbook" },
  { title: "Aktivitas Harian", icon: Icons.AktivitasHarian, url: "#" },
  { title: "Akun Karyawan", icon: Icons.AkunKaryawan, url: "#" },
];

export function AppSidebar() {
  const location = useLocation();
  const pathname = location.pathname;

  return (
    <Sidebar className="border-r border-slate-200">
      <SidebarHeader className="p-4 h-16 flex flex-row items-center gap-3">
        <NavLink to="/dashboard" className="flex items-center gap-3">
          <img
            src={Icons.Mantra}
            alt="Mantra Logo"
            width={55}
            height={24}
            className="object-contain"
          />
          <span className="text-xl font-bold tracking-tight text-slate-800">CRM</span>
        </NavLink>
        <Button 
          variant="ghost" 
          size="icon" 
          className="ml-auto hover:bg-slate-100"
        >
          <img
            src={Icons.Container} 
            alt="Toggle Menu"
            width={20}
            height={20}
            className="opacity-60" 
          />
        </Button>
      </SidebarHeader>

      <Separator className="bg-slate-300"/>

      <SidebarContent>
        {/* Grup Operasional */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Operasional
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuOperasional.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`flex items-center justify-between px-4 py-6 transition-colors ${
                        isActive 
                          ? "bg-cyan-50! text-cyan-600! hover:bg-cyan-100! hover:text-cyan-700! font-semibold!" 
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <NavLink to={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-5 w-5 items-center justify-center">
                            <img src={item.icon} alt={item.title} width={20} height={20} className="object-contain"/>
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="destructive" className="rounded-full px-3 py-1 text-[10px] bg-red-100 text-red-600 border-none">
                            {item.badge}
                          </Badge>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Grup Manajemen */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Manajemen
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuManajemen.map((item) => {
                const isActive = pathname === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={`flex items-center justify-between px-4 py-6 transition-colors ${
                        isActive
                          ? "bg-cyan-50! text-cyan-600! hover:bg-cyan-100! hover:text-cyan-700! font-semibold!"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      <NavLink to={item.url} className="flex items-center w-full">
                        <div className="flex items-center">
                          <div className="mr-3 flex h-5 w-5 items-center justify-center">
                            <img
                              src={item.icon}
                              alt={item.title}
                              width={20}
                              height={20}
                              className="object-contain"
                            />
                          </div>
                          <span className="font-medium">{item.title}</span>
                        </div>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-slate-100" />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center text-slate-500 px-4 py-6">
              <div className="mr-3 flex h-5 w-5 items-center justify-center">
                <img
                  src={Icons.Pengaturan}
                  alt="Pengaturan"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="font-medium">Pengaturan</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex items-center text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-6">
              <div className="mr-3 flex h-5 w-5 items-center justify-center">
                <img
                  src={Icons.Keluar}
                  alt="Keluar"
                  width={20}
                  height={20}
                  className="object-contain"
                />
              </div>
              <span className="font-medium">Keluar</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}