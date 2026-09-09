"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  ChevronDown,
  ClipboardList,
  CreditCard,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { student } from "@/lib/student-data";

const navItems = [
  { href: "/student", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/student/schedule", label: "Lịch học", icon: CalendarDays },
  { href: "/student/classes", label: "Lớp học của tôi", icon: BookOpen },
  { href: "/student/assignments", label: "Bài tập", icon: ClipboardList },
  { href: "/student/grades", label: "Điểm của tôi", icon: Trophy },
  { href: "/student/payments", label: "Thanh toán", icon: CreditCard },
  { href: "/student/invoices", label: "Hóa đơn", icon: FileText },
  { href: "/student/profile", label: "Hồ sơ cá nhân", icon: UserRound },
];

export function StudentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const currentPage =
    navItems.find(
      (item) => item.href !== "/student" && pathname.startsWith(item.href),
    )?.label ?? "Tổng quan";

  return (
    <div className="student-app min-h-screen text-[#354052]">
      <header className="student-header fixed inset-x-0 top-0 z-40 h-[74px] border-b border-[#e8e8df] bg-[#fffdf8]/90 px-4 backdrop-blur-xl md:px-8">
        <div className="flex h-full items-center justify-between gap-4 md:ml-[260px]">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="icon-button md:hidden"
              aria-label="Mở menu"
            >
              <Menu size={20} />
            </button>
            <button
              type="button"
              onClick={() => setExpanded((value) => !value)}
              className="icon-button hidden md:flex"
              aria-label="Thu gọn menu"
            >
              {expanded ? (
                <PanelLeftClose size={19} />
              ) : (
                <PanelLeftOpen size={19} />
              )}
            </button>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#9a9b83]">
                {currentPage}
              </p>
              <p className="hidden text-sm text-[#9a9b83] sm:block">
                Thứ sáu, 04 tháng 9, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationsOpen((value) => !value)}
                className="icon-button relative"
                aria-label="Thông báo"
              >
                <Bell size={19} />
                <span className="notification-dot">3</span>
              </button>
              {notificationsOpen && (
                <div className="notification-popover">
                  <p className="font-bold text-[#354052]">Thông báo mới</p>
                  <p className="mt-3 text-sm">
                    📚 Buổi học hôm nay bắt đầu lúc 19:00.
                  </p>
                  <p className="mt-3 text-sm">
                    📝 Vocabulary Unit 5 sắp đến hạn.
                  </p>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={() => router.push("/student/profile")}
              className="flex items-center gap-2 rounded-full border border-[#e8e8df] bg-white px-2 py-1.5 text-left transition hover:border-[#8ea886]"
            >
              <span className="avatar">{student.initials}</span>
              <span className="hidden sm:block">
                <span className="block text-[10px] text-[#9a9b83]">
                  Học viên
                </span>
                <span className="block text-sm font-bold text-[#354052]">
                  {student.name}
                </span>
              </span>
              <ChevronDown size={15} className="text-[#9a9b83]" />
            </button>
          </div>
        </div>
      </header>

      <aside
        className={[
          "student-sidebar fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#e8e8df] bg-[#fffdf8] transition-transform duration-300",
          expanded ? "md:translate-x-0" : "md:w-[84px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-[74px] items-center justify-between border-b border-[#e8e8df] px-5">
          <Link
            href="/student"
            className={
              expanded || mobileOpen ? "flex items-center gap-3" : "mx-auto"
            }
          >
            <span className="brand-mark">EB</span>
            {(expanded || mobileOpen) && (
              <span>
                <span className="block font-black tracking-tight text-[#354052]">
                  English Buddy
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#9a9b83]">
                  Student portal
                </span>
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="icon-button md:hidden"
            aria-label="Đóng menu"
          >
            <X size={19} />
          </button>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/student"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={!expanded && !mobileOpen ? item.label : undefined}
                className={[
                  "sidebar-link group",
                  active ? "sidebar-link-active" : "",
                  !expanded && !mobileOpen ? "justify-center px-0" : "",
                ].join(" ")}
              >
                <Icon size={19} />
                {(expanded || mobileOpen) && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>
        <div
          className={
            expanded || mobileOpen
              ? "m-3 rounded-3xl bg-[#eaf1e5] p-4"
              : "m-2 rounded-2xl bg-[#eaf1e5] p-2"
          }
        >
          <div className="flex items-center gap-3">
            <span className="avatar">{student.initials}</span>
            {(expanded || mobileOpen) && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{student.fullName}</p>
                <p className="text-xs text-[#708269]">{student.xp}</p>
              </div>
            )}
          </div>
          {(expanded || mobileOpen) && (
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-4 flex w-full items-center gap-2 text-xs font-semibold text-[#aa6d62]"
            >
              <LogOut size={15} /> Đăng xuất
            </button>
          )}
        </div>
      </aside>
      {mobileOpen && (
        <button
          type="button"
          onClick={() => setMobileOpen(false)}
          aria-label="Đóng menu"
          className="fixed inset-0 z-40 bg-[#354052]/20 md:hidden"
        />
      )}
      <main
        className={[
          "min-h-screen pt-[74px] transition-all duration-300",
          expanded ? "md:pl-[260px]" : "md:pl-[84px]",
        ].join(" ")}
      >
        <div className="mx-auto max-w-[1440px] p-4 pb-24 md:p-8 md:pb-10">
          {children}
        </div>
      </main>
      <nav className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-around rounded-3xl border border-[#e8e8df] bg-[#fffdf8]/95 p-2 shadow-[0_16px_40px_rgba(53,64,82,0.14)] backdrop-blur-xl md:hidden">
        {navItems
          .filter((item) =>
            [
              "/student",
              "/student/schedule",
              "/student/assignments",
              "/student/grades",
              "/student/profile",
            ].includes(item.href),
          )
          .map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href ? "bottom-link-active" : "bottom-link"
                }
              >
                <Icon size={19} />
                <span>
                  {item.href === "/student"
                    ? "Trang chủ"
                    : item.label.split(" ")[0]}
                </span>
              </Link>
            );
          })}
      </nav>
    </div>
  );
}
