"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Trophy,
  UserRound,
  UsersRound,
  X,
} from "lucide-react";
import { teacher, teacherNotifications } from "@/lib/teacher-data";

const navItems = [
  { href: "/teacher/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/teacher/classes", label: "Lớp học", icon: BookOpen },
  { href: "/teacher/schedule", label: "Lịch dạy", icon: CalendarDays },
  { href: "/teacher/students", label: "Học viên", icon: UsersRound },
  { href: "/teacher/attendance", label: "Điểm danh", icon: CheckCircle2 },
  { href: "/teacher/assignments", label: "Bài tập", icon: ClipboardList },
  { href: "/teacher/grades", label: "Chấm điểm", icon: Trophy },
  { href: "/teacher/chat", label: "Chat phụ huynh", icon: MessageCircle },
  { href: "/teacher/notifications", label: "Thông báo", icon: Bell },
  { href: "/teacher/profile", label: "Hồ sơ cá nhân", icon: UserRound },
];

export function TeacherShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const currentPage =
    navItems.find((item) => pathname.startsWith(item.href))?.label ??
    "Tổng quan";

  return (
    <div className="teacher-app min-h-screen text-[#354052]">
      <header className="student-header fixed inset-x-0 top-0 z-40 h-[74px] border-b border-[#eadfe3] bg-[#fffdf9]/90 px-4 backdrop-blur-xl md:px-8">
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
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a28e96]">
                {currentPage}
              </p>
              <p className="hidden text-sm text-[#a28e96] sm:block">
                Thứ sáu, 05 tháng 9, 2026
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen((value) => !value)}
                className="icon-button relative"
                aria-label="Thông báo"
              >
                <Bell size={19} />
                <span className="notification-dot teacher-dot">3</span>
              </button>
              {notificationOpen && (
                <div className="notification-popover">
                  <p className="font-bold text-[#354052]">Thông báo mới</p>
                  {teacherNotifications.map((item) => (
                    <p key={item.text} className="mt-3 text-sm">
                      {item.icon} {item.text}
                    </p>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/teacher/chat"
              className="icon-button relative"
              aria-label="Tin nhắn"
            >
              <MessageCircle size={19} />
              <span className="notification-dot teacher-dot">4</span>
            </Link>
            <button
              type="button"
              onClick={() => router.push("/teacher/profile")}
              className="flex items-center gap-2 rounded-full border border-[#eadfe3] bg-white px-2 py-1.5 text-left transition hover:border-[#df9c9d]"
            >
              <span className="teacher-avatar">{teacher.initials}</span>
              <span className="hidden sm:block">
                <span className="block text-[10px] text-[#a28e96]">
                  Giáo viên
                </span>
                <span className="block text-sm font-bold text-[#354052]">
                  Cô {teacher.name}
                </span>
              </span>
              <ChevronDown size={15} className="text-[#a28e96]" />
            </button>
          </div>
        </div>
      </header>
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#eadfe3] bg-[#fffdf9] transition-all duration-300",
          expanded ? "md:translate-x-0" : "md:w-[84px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-[74px] items-center justify-between border-b border-[#eadfe3] px-5">
          <Link
            href="/teacher/dashboard"
            className={
              expanded || mobileOpen ? "flex items-center gap-3" : "mx-auto"
            }
          >
            <span className="teacher-brand-mark">EB</span>
            {(expanded || mobileOpen) && (
              <span>
                <span className="block font-black tracking-tight text-[#354052]">
                  English Buddy
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a28e96]">
                  Teacher portal
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
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === "/teacher/dashboard"
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                title={!expanded && !mobileOpen ? item.label : undefined}
                className={[
                  "sidebar-link teacher-sidebar-link",
                  active ? "teacher-sidebar-active" : "",
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
              ? "m-3 rounded-3xl bg-[#fff0ef] p-4"
              : "m-2 rounded-2xl bg-[#fff0ef] p-2"
          }
        >
          <div className="flex items-center gap-3">
            <span className="teacher-avatar">{teacher.initials}</span>
            {(expanded || mobileOpen) && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{teacher.fullName}</p>
                <p className="text-xs text-[#a8757b]">{teacher.role}</p>
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
      <nav className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-around rounded-3xl border border-[#eadfe3] bg-[#fffdf9]/95 p-2 shadow-[0_16px_40px_rgba(53,64,82,0.14)] backdrop-blur-xl md:hidden">
        {navItems
          .filter((item) =>
            [
              "/teacher/dashboard",
              "/teacher/schedule",
              "/teacher/assignments",
              "/teacher/chat",
            ].includes(item.href),
          )
          .map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={
                  pathname === item.href
                    ? "bottom-link-active teacher-bottom-active"
                    : "bottom-link"
                }
              >
                <Icon size={19} />
                <span>
                  {item.href === "/teacher/dashboard"
                    ? "Trang chủ"
                    : item.label.split(" ")[0]}
                </span>
              </Link>
            );
          })}
        <Link href="/teacher/classes" className="bottom-link">
          <Menu size={19} />
          <span>Thêm</span>
        </Link>
      </nav>
    </div>
  );
}
