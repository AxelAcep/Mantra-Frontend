import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

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
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";

import { Icons } from "@/assets";
import { useTotalUnreadChatCount } from "@/hooks/use-activity";

type MenuItem = {
  title: string;
  icon: string;
  url: string;
  badge?: number;
  children?: { title: string; url: string }[];
};

const getMenuOperasional = (unreadChatCount: number): MenuItem[] => [
  { title: "Beranda", icon: Icons.Beranda, url: "/dashboard" },
  { title: "Notifikasi", icon: Icons.Notifikasi, url: "/notifikasi/chat", badge: unreadChatCount },
  { title: "Pengadaan Barang", icon: Icons.Pengadaan, url: "/pengadaan-barang", badge: 3 },
  { title: "Daftar Perusahaan", icon: Icons.DaftarPerusahaan, url: "/perusahaan" },
];

const getMenuManajemen = (): MenuItem[] => {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isMaster = user?.role === "MASTER";
  const isSupervisi = user?.role === "SUPERVISI";

  const menu: MenuItem[] = [
    isSupervisi
      ? {
          title: "Daily Activity",
          icon: Icons.AktivitasHarian,
          url: "/dailyactivity",
          children: [
            { title: "Aktivitas Saya", url: "/dailyactivity" },
            { title: "Manajemen Staff", url: "/dailyactivity/supervisi" },
          ],
        }
      : {
          title: "Daily Activity",
          icon: Icons.AktivitasHarian,
          url: "/dailyactivity",
        },
  ];

  if (isMaster) {
    menu.push({
      title: "Akun Karyawan",
      icon: Icons.AkunKaryawan,
      url: "/akunkaryawan",
    });
  }

  return menu;
};

function SidebarInner({ onNavigate }: { onNavigate?: () => void }) {
  const location = useLocation();
  const pathname = location.pathname;
  const navigate = useNavigate();

  const { data: unreadChatCount = 0 } = useTotalUnreadChatCount();

  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const renderMenu = (items: MenuItem[]) =>
    items.map((item) => {
      const hasChildren = item.children && item.children.length > 0;
      const isOpen = openMenus.includes(item.title);
      const isActive =
        pathname === item.url ||
        pathname.startsWith(`${item.url}/`) ||
        (item.url === "/dailyactivity" && pathname.includes("/kpi"));

      if (hasChildren) {
        return (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton
              onClick={() => toggleMenu(item.title)}
              isActive={isActive}
              className={`flex items-center justify-between px-4 py-6 transition-colors ${
                isActive
                  ? "bg-cyan-50! text-cyan-600! hover:bg-cyan-100! hover:text-cyan-700! font-semibold!"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <div className="flex items-center gap-3 w-full justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                    <img
                      src={item.icon}
                      alt={item.title}
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                  </div>
                  <span className="font-medium group-data-[collapsible=icon]:hidden">
                    {item.title}
                  </span>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`transition-transform group-data-[collapsible=icon]:hidden ${
                    isOpen ? "rotate-180" : ""
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </SidebarMenuButton>

            {isOpen && (
              <div className="ml-8 mt-1 flex flex-col gap-1 group-data-[collapsible=icon]:hidden">
                {item.children!.map((child) => {
                  const isChildActive =
                    pathname === child.url ||
                    (child.url !== "/dailyactivity" &&
                      pathname.startsWith(`${child.url}/`));
                  return (
                    <NavLink
                      key={child.title}
                      to={child.url}
                      onClick={onNavigate}
                      className={`text-sm px-3 py-2 rounded-md transition-colors ${
                        isChildActive
                          ? "bg-cyan-50 text-cyan-600 font-semibold"
                          : "text-slate-500 hover:bg-slate-50"
                      }`}
                    >
                      {child.title}
                    </NavLink>
                  );
                })}
              </div>
            )}
          </SidebarMenuItem>
        );
      }

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
            <NavLink
              to={item.url}
              className="flex items-center justify-between w-full"
              onClick={onNavigate}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                  <img
                    src={item.icon}
                    alt={item.title}
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium group-data-[collapsible=icon]:hidden">
                  {item.title}
                </span>
              </div>
              {"badge" in item && item.badge ? (
                <Badge
                  variant="destructive"
                  className="rounded-full px-3 py-1 text-[10px] bg-red-100 text-red-600 border-none group-data-[collapsible=icon]:hidden"
                >
                  {item.badge}
                </Badge>
              ) : null}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <>
      <SidebarHeader className="p-4 h-16 flex flex-row items-center justify-between gap-3 border-b border-slate-200 group-data-[collapsible=icon]:p-2 group-data-[collapsible=icon]:justify-center">
        <NavLink
          to="/dashboard"
          className="flex items-center gap-3 overflow-hidden group-data-[collapsible=icon]:hidden"
          onClick={onNavigate}
        >
          <img
            src={Icons.Mantra}
            alt="Mantra Logo"
            width={150}
            height={24}
            className="object-contain"
          />
        </NavLink>
        <SidebarTrigger />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Operasional
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenu(getMenuOperasional(unreadChatCount))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Manajemen
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {renderMenu(getMenuManajemen())}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator className="bg-slate-100/50" />

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="flex items-center text-slate-500 px-4 py-6"
            >
              <NavLink
                to="/pengaturan"
                onClick={onNavigate}
                className="flex items-center gap-3 w-full"
              >
                <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                  <img
                    src={Icons.Pengaturan}
                    alt="Pengaturan"
                    width={16}
                    height={16}
                    className="object-contain"
                  />
                </div>
                <span className="font-medium group-data-[collapsible=icon]:hidden">
                  Pengaturan
                </span>
              </NavLink>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="flex items-center gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-6 w-full"
            >
              <div className="flex h-4 w-4 shrink-0 items-center justify-center">
                <img
                  src={Icons.Keluar}
                  alt="Keluar"
                  width={16}
                  height={16}
                  className="object-contain"
                />
              </div>
              <span className="font-medium group-data-[collapsible=icon]:hidden">
                Keluar
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}

export function AppSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-slate-200 shadow-sm"
        aria-label="Buka menu"
      >
        <div className="flex flex-col gap-1">
          <span className="block w-5 h-0.5 bg-slate-600" />
          <span className="block w-5 h-0.5 bg-slate-600" />
          <span className="block w-5 h-0.5 bg-slate-600" />
        </div>
      </button>

      <div className="hidden md:flex h-full">
        <Sidebar className="border-r border-slate-200" collapsible="icon">
          <SidebarInner />
        </Sidebar>
      </div>

      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
            onClick={() => setMobileOpen(false)}
          />

          <div className="fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl flex flex-col md:hidden animate-in slide-in-from-left duration-200">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              aria-label="Tutup menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <SidebarInner onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}
    </>
  );
}
