"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  ChevronDown,
  ClipboardList,
  DoorOpen,
  GraduationCap,
  LayoutDashboard,
  Library,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Presentation,
  UserRoundCheck,
  Users,
} from "lucide-react";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },

  { href: "/admin/students", label: "Quản lý học viên", icon: GraduationCap },
  { href: "/admin/teachers", label: "Quản lý giáo viên", icon: Presentation },
  { href: "/admin/courses", label: "Quản lý khóa học", icon: Library },
  { href: "/admin/rooms", label: "Quản lý phòng học", icon: DoorOpen },
  { href: "/admin/classes", label: "Quản lý lớp học", icon: Library },
  { href: "/admin/schedules", label: "Quản lý lịch học và lịch dạy", icon: CalendarDays },
  { href: "/admin/exams", label: "Quản lý lịch thi", icon: ClipboardCheck },
  { href: "/admin/grades", label: "Quản lý bảng điểm", icon: ClipboardList },
  {
    href: "/admin/attendance",
    label: "Quản lý điểm danh",
    icon: CalendarCheck,
  },
  { href: "/admin/statistics", label: "Báo cáo thống kê", icon: BarChart3 },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  useEffect(() => {
    if (isMobile) {
      setMobileOpen(false);
    }
  }, [pathname, isMobile]);

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen((value) => !value);
      return;
    }

    setSidebarExpanded((value) => !value);
  };

  const isActive = (href: string) => {
    if (href === "/admin") {
      return pathname === href;
    }

    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#f6f7ff] text-slate-700">
      <header className="fixed inset-x-0 top-0 z-50 h-20 border-b border-violet-100 bg-white/85 backdrop-blur-xl shadow-[0_12px_40px_rgba(141,126,255,0.08)]">
        <div className="flex h-full items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleSidebar}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600 transition hover:-translate-y-0.5 hover:bg-violet-100"
              aria-label="Toggle sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 via-pink-200 to-emerald-200 text-lg shadow-sm">
                🌸
              </div>
              <div className="hidden sm:block">
                <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-violet-400">
                  Admin portal
                </p>
                <h1 className="text-base font-bold text-slate-800">
                  English Class Management
                </h1>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50 text-violet-600 transition hover:bg-violet-100"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-pink-400 text-[9px] font-bold text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 rounded-full border border-violet-100 bg-violet-50/60 px-2 py-1.5 shadow-sm">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-pink-400 text-sm font-bold text-white">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-[10px] text-slate-400">Administrator</p>
                <p className="text-sm font-semibold text-slate-700">
                  Admin User
                </p>
              </div>
              <ChevronDown className="h-4 w-4 text-slate-500" />
            </div>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-600 transition hover:bg-rose-100"
              aria-label="Đăng xuất"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Đăng xuất</span>
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-20">
        <aside
          className={[
            "fixed inset-y-0 left-0 z-40 border-r border-violet-100 bg-white/90 shadow-[12px_0_30px_rgba(148,163,184,0.08)] backdrop-blur-xl transition-all duration-300",
            isMobile
              ? mobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : sidebarExpanded
                ? "translate-x-0 w-72"
                : "translate-x-0 w-24",
            "overflow-hidden",
          ].join(" ")}
        >
          <div className="flex items-center justify-between border-b border-violet-100 px-4 py-4">
            {(sidebarExpanded || isMobile) && (
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 via-pink-200 to-emerald-200 text-base shadow-sm">
                  🌸
                </div>
                <span className="text-base font-bold text-slate-800">
                  English Class
                </span>
              </div>
            )}

            {!isMobile && (
              <button
                type="button"
                onClick={() => setSidebarExpanded((value) => !value)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-500 transition hover:bg-violet-50 hover:text-violet-700"
                aria-label="Collapse sidebar"
              >
                {sidebarExpanded ? (
                  <PanelLeftClose className="h-4 w-4" />
                ) : (
                  <PanelLeftOpen className="h-4 w-4" />
                )}
              </button>
            )}
          </div>

          <nav className="space-y-2 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              const showText = !isMobile ? sidebarExpanded : true;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => isMobile && setMobileOpen(false)}
                  className={[
                    "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 font-medium transition-all duration-200",
                    active
                      ? "bg-gradient-to-r from-violet-200 via-pink-100 to-emerald-100 text-violet-700 shadow-[0_10px_24px_rgba(168,85,247,0.12)]"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                    !showText ? "justify-center" : "",
                  ].join(" ")}
                >
                  <Icon className="h-5 w-5 shrink-0" />

                  {showText ? (
                    <span className="truncate">{item.label}</span>
                  ) : (
                    <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 rounded-xl bg-slate-800 px-2.5 py-1 text-xs text-white opacity-0 shadow-lg transition-opacity duration-200 group-hover:opacity-100">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {isMobile && mobileOpen && (
          <button
            type="button"
            aria-label="Close mobile sidebar"
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 z-30 bg-slate-900/20"
          />
        )}

        <main
          className={[
            "flex-1 transition-all duration-300",
            isMobile ? "ml-0" : sidebarExpanded ? "ml-72" : "ml-24",
          ].join(" ")}
        >
          <div className="min-h-[calc(100vh-5rem)] p-4 md:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
