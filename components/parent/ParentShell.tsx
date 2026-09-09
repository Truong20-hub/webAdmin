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
  MessageCircle,
  Menu,
  PanelLeftClose,
  PanelLeftOpen,
  Trophy,
  UserRound,
  X,
} from "lucide-react";
import { children, notifications, parent } from "@/lib/parent-data";

const navItems = [
  { href: "/parent/dashboard", label: "Tổng quan", icon: LayoutDashboard },
  { href: "/parent/schedule", label: "Lịch học của con", icon: CalendarDays },
  { href: "/parent/classes", label: "Lớp học của con", icon: BookOpen },
  { href: "/parent/assignments", label: "Bài tập", icon: ClipboardList },
  { href: "/parent/grades", label: "Kết quả học tập", icon: Trophy },
  { href: "/parent/payments", label: "Học phí", icon: CreditCard },
  { href: "/parent/invoices", label: "Hóa đơn", icon: FileText },
  { href: "/parent/chat", label: "Chat với giáo viên", icon: MessageCircle },
  { href: "/parent/notifications", label: "Thông báo", icon: Bell },
  { href: "/parent/profile", label: "Tài khoản", icon: UserRound },
];

export function ParentShell({
  children: content,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [expanded, setExpanded] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [childOpen, setChildOpen] = useState(false);
  const [selectedChild, setSelectedChild] = useState(children[0]);
  const currentPage =
    navItems.find((item) => pathname.startsWith(item.href))?.label ??
    "Tổng quan";

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
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationOpen((value) => !value)}
                className="icon-button relative"
                aria-label="Thông báo"
              >
                <Bell size={19} />
                <span className="notification-dot">4</span>
              </button>
              {notificationOpen && (
                <div className="notification-popover">
                  <p className="font-bold text-[#354052]">Thông báo mới</p>
                  {notifications.slice(0, 2).map((item) => (
                    <Link
                      href={item.href}
                      key={item.text}
                      className="mt-3 block text-sm text-[#566355]"
                    >
                      {item.icon} {item.text}
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <Link
              href="/parent/chat"
              className="icon-button relative"
              aria-label="Tin nhắn"
            >
              <MessageCircle size={19} />
              <span className="notification-dot">2</span>
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={() => setChildOpen((value) => !value)}
                className="flex items-center gap-2 rounded-full border border-[#e8e8df] bg-white px-2 py-1.5 text-left"
              >
                <span className="avatar">{selectedChild.initials}</span>
                <span className="hidden sm:block">
                  <span className="block text-[10px] text-[#9a9b83]">
                    Đang theo dõi
                  </span>
                  <span className="block text-sm font-bold text-[#354052]">
                    {selectedChild.name}
                  </span>
                </span>
                <ChevronDown size={15} className="text-[#9a9b83]" />
              </button>
              {childOpen && (
                <div className="notification-popover right-0 w-64">
                  <p className="label-muted">Chọn học viên</p>
                  {children.map((child) => (
                    <button
                      type="button"
                      key={child.initials}
                      onClick={() => {
                        setSelectedChild(child);
                        setChildOpen(false);
                      }}
                      className="mt-3 flex w-full items-center gap-3 rounded-2xl p-2 text-left hover:bg-[#eef5e9]"
                    >
                      <span className="avatar">{child.initials}</span>
                      <span>
                        <strong className="block text-sm">
                          {child.fullName}
                        </strong>
                        <span className="text-xs text-[#9a9b83]">
                          {child.course}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <aside
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r border-[#e8e8df] bg-[#fffdf8] transition-all duration-300",
          expanded ? "md:translate-x-0" : "md:w-[84px]",
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        ].join(" ")}
      >
        <div className="flex h-[74px] items-center justify-between border-b border-[#e8e8df] px-5">
          <Link
            href="/parent/dashboard"
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
                  Parent portal
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
              pathname === item.href ||
              (item.href !== "/parent/dashboard" &&
                pathname.startsWith(item.href));
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
            <span className="avatar">{parent.initials}</span>
            {(expanded || mobileOpen) && (
              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{parent.name}</p>
                <p className="text-xs text-[#708269]">
                  Phụ huynh của {selectedChild.name}
                </p>
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
          {content}
        </div>
      </main>
      <nav className="fixed inset-x-3 bottom-3 z-30 flex items-center justify-around rounded-3xl border border-[#e8e8df] bg-[#fffdf8]/95 p-2 shadow-[0_16px_40px_rgba(53,64,82,0.14)] backdrop-blur-xl md:hidden">
        {navItems
          .filter((item) =>
            [
              "/parent/dashboard",
              "/parent/schedule",
              "/parent/assignments",
              "/parent/chat",
              "/parent/profile",
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
                  {item.href === "/parent/dashboard"
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
