"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  Heart,
  MessageCircle,
  Paperclip,
  Search,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import {
  conversations,
  gradeBreakdown,
  initialMessages,
  notifications,
  parent,
  parentAssignments,
  parentInvoices,
  parentSchedule,
} from "@/lib/parent-data";

export function ParentPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#354052]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[#7d877d]">{description}</p>
    </div>
  );
}

export function ParentDashboard() {
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="hero-panel relative overflow-hidden p-6 md:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow text-[#6b8468]">Parent overview</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#354052] md:text-5xl">
            Chào buổi tối, {parent.shortName}!{" "}
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#637064] md:text-base">
            Hãy cùng theo dõi hành trình học tiếng Anh của Minh Anh nhé 🌷
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <div className="relative h-[92px] w-[92px]">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/70"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831"
                />
                <path
                  className="text-[#6f956d]"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray="72, 100"
                  d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-black">
                72%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b8d78]">
                Nguyễn Minh Anh
              </p>
              <p className="mt-1 text-lg font-black">English Intermediate B1</p>
              <p className="mt-1 text-sm text-[#637064]">
                Cô Nguyễn Thị Lan · 18 buổi học
              </p>
            </div>
          </div>
          <p className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-bold text-[#587052]">
            <Sparkles size={16} /> Minh Anh đang tiến bộ rất tốt!
          </p>
        </div>
        <div className="hero-doodle" aria-hidden="true">
          ✦<span>☁</span>
        </div>
      </section>
      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="eyebrow">Stay close to the journey</p>
            <h2 className="section-title">Theo dõi nhanh</h2>
          </div>
          <Heart className="text-[#df8e70]" size={21} />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
          {[
            [
              "/parent/schedule",
              "Lịch học",
              "Buổi sắp tới",
              CalendarDays,
              "quick-sage",
            ],
            [
              "/parent/grades",
              "Điểm số",
              "TB 8.5/10",
              GraduationCap,
              "quick-yellow",
            ],
            [
              "/parent/assignments",
              "Bài tập",
              "3 bài cần xem",
              BookOpen,
              "quick-peach",
            ],
            [
              "/parent/payments",
              "Học phí",
              "Còn 1.000.000đ",
              CreditCard,
              "quick-blue",
            ],
            [
              "/parent/invoices",
              "Hóa đơn",
              "HD001 sắp hạn",
              FileText,
              "quick-yellow",
            ],
            [
              "/parent/chat",
              "Giáo viên",
              "2 tin nhắn mới",
              MessageCircle,
              "quick-sage",
            ],
          ].map(([href, label, note, Icon, tone]) => {
            const ActionIcon = Icon as typeof Bell;
            return (
              <Link
                href={href as string}
                key={label as string}
                className={`quick-card ${tone}`}
              >
                <span className="quick-icon">
                  <ActionIcon size={20} />
                </span>
                <span className="mt-4 block font-bold text-[#354052]">
                  {label as string}
                </span>
                <span className="mt-1 block text-xs text-[#7d877d]">
                  {note as string}
                </span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="soft-panel p-5 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Next on the calendar</p>
              <h2 className="section-title">Buổi học tiếp theo</h2>
            </div>
            <span className="date-chip">08/09/2026</span>
          </div>
          <div className="mt-5 rounded-3xl bg-[#f6f7ee] p-5">
            <div className="flex flex-col justify-between gap-4 sm:flex-row">
              <div>
                <span className="status-pill status-success">Sắp học</span>
                <h3 className="mt-3 text-xl font-black">
                  English Intermediate B1
                </h3>
                <p className="mt-2 text-sm text-[#7d877d]">
                  Unit 5 - Speaking & Listening
                </p>
              </div>
              <div className="text-sm">
                <p>
                  <Clock3 className="mr-1 inline" size={15} />
                  19:00 - 20:30
                </p>
                <p className="mt-2 text-[#7d877d]">
                  Phòng A203 · Cô Nguyễn Thị Lan
                </p>
              </div>
            </div>
            <Link
              href="/parent/schedule"
              className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-[#6f956d]"
            >
              Xem lịch học <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="soft-panel p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Teacher note</p>
              <h2 className="section-title">Tin nhắn từ cô Lan</h2>
            </div>
            <span className="status-pill status-danger">2 tin mới</span>
          </div>
          <div className="mt-5 rounded-3xl bg-[#eef5e9] p-5">
            <div className="flex items-center gap-3">
              <span className="avatar">NL</span>
              <div>
                <p className="font-bold">Nguyễn Thị Lan</p>
                <p className="text-xs text-[#7d877d]">
                  5 phút trước · Giáo viên B1
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-[#566355]">
              “Hôm nay Minh học rất tốt phần Speaking. Em đã tự tin trình bày
              hơn nhiều ạ.”
            </p>
            <Link
              href="/parent/chat"
              className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#6f956d]"
            >
              Xem tin nhắn <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>
      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <div className="soft-panel p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Learning snapshot</p>
              <h2 className="section-title">Tình hình học tập</h2>
            </div>
            <Link
              href="/parent/grades"
              className="text-sm font-bold text-[#6f956d]"
            >
              Chi tiết <ArrowRight className="ml-1 inline" size={15} />
            </Link>
          </div>
          <div className="mt-5 space-y-4">
            {gradeBreakdown.map(([label, value]) => (
              <div key={label}>
                <div className="mb-1 flex justify-between text-sm">
                  <span className="font-semibold">{label}</span>
                  <strong>{(value / 10).toFixed(1)}</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[#f1eee4]">
                  <div
                    className="h-full rounded-full bg-[#8eb08a]"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="soft-panel p-5 md:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="eyebrow">Homework watch</p>
              <h2 className="section-title">Bài tập của Minh Anh</h2>
            </div>
            <Link
              href="/parent/assignments"
              className="text-sm font-bold text-[#6f956d]"
            >
              Xem tất cả
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {parentAssignments.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 rounded-2xl bg-[#f7f7f0] p-3"
              >
                <FileText size={18} className="text-[#6f956d]" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{item.title}</p>
                  <p className="text-xs text-[#9a9b83]">
                    Hạn {item.due.split(" - ")[0]}
                  </p>
                </div>
                <span
                  className={`status-pill ${item.status === "Đã chấm" ? "status-success" : item.status === "Đã nộp" ? "status-info" : "status-warn"}`}
                >
                  {item.status === "Chưa làm" ? "Chưa nộp" : item.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function ParentScheduleView() {
  return (
    <>
      <ParentPageHeader
        eyebrow="Your child's week"
        title="Lịch học của con"
        description="Theo dõi lịch học để luôn đồng hành đúng lúc."
      />
      <div className="mb-5 flex gap-2">
        <button className="rounded-full bg-[#6f956d] px-4 py-2 text-sm font-bold text-white">
          Lịch tuần
        </button>
        <button className="rounded-full border border-[#e8e8df] bg-white px-4 py-2 text-sm font-bold text-[#7d877d]">
          Danh sách
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {parentSchedule.map((item, index) => (
          <div className="soft-panel p-5" key={item.id}>
            <div className="flex justify-between">
              <span className="date-chip">
                {item.day}, {item.date}
              </span>
              <span
                className={
                  index === 0
                    ? "status-pill status-success"
                    : "status-pill status-info"
                }
              >
                {index === 0 ? "Sắp học" : "Đã lên lịch"}
              </span>
            </div>
            <h2 className="mt-5 text-lg font-black">{item.course}</h2>
            <p className="mt-2 text-sm text-[#7d877d]">{item.topic}</p>
            <p className="mt-5 border-t border-[#eeeade] pt-4 text-sm font-semibold">
              <Clock3 className="mr-1 inline" size={15} />
              {item.time} · Phòng {item.room}
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export function ParentClassesView() {
  return (
    <>
      <ParentPageHeader
        eyebrow="Learning space"
        title="Lớp học của con"
        description="Thông tin lớp học và người đang đồng hành cùng Minh Anh."
      />
      <div className="soft-panel max-w-2xl overflow-hidden">
        <div className="bg-[#e8f1e2] p-6">
          <span className="status-pill status-success">Đang học</span>
          <h2 className="mt-4 text-2xl font-black">English Intermediate B1</h2>
          <p className="mt-1 text-sm text-[#637064]">
            Học viên: Nguyễn Minh Anh · Trình độ B1
          </p>
        </div>
        <div className="space-y-4 p-6 text-sm">
          <p>
            <GraduationCap className="mr-2 inline text-[#6f956d]" size={17} />
            Giáo viên: <strong>Nguyễn Thị Lan</strong>
          </p>
          <p>
            <CalendarDays className="mr-2 inline text-[#6f956d]" size={17} />
            Thứ 3 & Thứ 5 · 19:00 - 20:30
          </p>
          <p>
            <BookOpen className="mr-2 inline text-[#6f956d]" size={17} />
            01/08/2026 - 30/11/2026 · Phòng A203
          </p>
        </div>
      </div>
    </>
  );
}

export function RegisterClassView() {
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  return (
    <>
      <ParentPageHeader
        eyebrow="A new step together"
        title="Đăng ký lớp cho con"
        description="Tìm lớp học phù hợp với lịch trình và mục tiêu của Minh Anh."
      />
      <div className="mb-5 flex gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-[#e8e8df] bg-white px-4 py-3 text-sm text-[#9a9b83]">
          <Search size={18} /> Tìm lớp học...
        </div>
        <select className="rounded-2xl border border-[#e8e8df] bg-white px-3 text-sm text-[#7d877d]">
          <option>Tất cả trình độ</option>
          <option>A1 - Beginner</option>
          <option>B1 - Intermediate</option>
        </select>
      </div>
      <div className="soft-panel max-w-2xl p-6">
        <span className="status-pill status-success">Còn 7 chỗ</span>
        <h2 className="mt-4 text-xl font-black">English Beginner A1</h2>
        <p className="mt-2 text-sm text-[#7d877d]">
          Thứ 2 & Thứ 4 · 19:00 - 20:30 · Cô Nguyễn Thị Lan
        </p>
        <p className="mt-4 text-sm font-bold text-[#566355]">
          Học phí: 2.000.000đ
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="primary-button mt-6"
        >
          Đăng ký cho con <ArrowRight size={16} />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#354052]/30 p-4">
          <div className="w-full max-w-md rounded-[28px] bg-[#fffdf8] p-6 shadow-2xl">
            <p className="text-2xl">🌸</p>
            <h2 className="mt-3 text-xl font-black">Xác nhận đăng ký lớp?</h2>
            <p className="mt-3 text-sm leading-6 text-[#7d877d]">
              Bạn đang đăng ký lớp English Beginner A1 cho Nguyễn Minh Anh.
            </p>
            <div className="mt-5 rounded-2xl bg-[#f7f7f0] p-4 text-sm leading-7">
              Giáo viên: <strong>Nguyễn Thị Lan</strong>
              <br />
              Lịch: <strong>Thứ 2 & Thứ 4 - 19:00</strong>
              <br />
              Học phí: <strong>2.000.000đ</strong>
            </div>
            {done ? (
              <div className="mt-5 rounded-2xl bg-[#e8f3e5] p-4 text-sm font-bold text-[#587052]">
                🎉 Đăng ký lớp thành công!
              </div>
            ) : (
              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-full border border-[#e8e8df] px-4 py-3 text-sm font-bold"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={() => setDone(true)}
                  className="primary-button flex-1 justify-center"
                >
                  Xác nhận
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function ParentGradesView() {
  return (
    <>
      <ParentPageHeader
        eyebrow="Your child's progress"
        title="Kết quả học tập của Minh Anh"
        description="Điểm số và nhận xét giúp phụ huynh nhìn thấy sự tiến bộ."
      />
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Điểm trung bình", "8.5/10"],
          ["Điểm cao nhất", "9.0"],
          ["Bài kiểm tra", "3"],
          ["Xu hướng", "+12%"],
        ].map(([label, value]) => (
          <div className="soft-panel p-5" key={label}>
            <p className="label-muted">{label}</p>
            <p className="mt-3 text-2xl font-black">{value}</p>
          </div>
        ))}
      </div>
      <div className="soft-panel mt-6 p-6">
        <p className="eyebrow">Midterm exam · 20/08/2026</p>
        <div className="mt-2 flex items-center justify-between">
          <h2 className="section-title">Midterm Exam</h2>
          <span className="status-pill status-success">8.5 / 10</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {gradeBreakdown.map(([label, value]) => (
            <div
              className="rounded-2xl bg-[#f7f7f0] p-4 text-center"
              key={label}
            >
              <p className="text-xs text-[#9a9b83]">{label}</p>
              <p className="mt-2 text-xl font-black text-[#6f956d]">
                {(value / 10).toFixed(1)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl bg-[#fff6dc] p-4 text-sm leading-6 text-[#6f5d32]">
          <strong>💬 Nhận xét của giáo viên</strong>
          <br />
          “Em có khả năng giao tiếp tốt. Cần cải thiện thêm vốn từ vựng.”
        </div>
      </div>
    </>
  );
}

export function ParentAssignmentsView() {
  return (
    <>
      <ParentPageHeader
        eyebrow="Progress only"
        title="Bài tập của Minh Anh"
        description="Phụ huynh có thể theo dõi tiến độ, nhưng không nộp bài thay học viên."
      />
      <div className="mb-5 flex gap-2 overflow-x-auto">
        <button className="whitespace-nowrap rounded-full bg-[#6f956d] px-4 py-2 text-sm font-bold text-white">
          Tất cả
        </button>
        <button className="whitespace-nowrap rounded-full border border-[#e8e8df] bg-white px-4 py-2 text-sm font-bold text-[#7d877d]">
          Chưa hoàn thành
        </button>
        <button className="whitespace-nowrap rounded-full border border-[#e8e8df] bg-white px-4 py-2 text-sm font-bold text-[#7d877d]">
          Đã chấm
        </button>
      </div>
      <div className="space-y-3">
        {parentAssignments.map((item) => (
          <div className="assignment-row soft-panel" key={item.id}>
            <FileText className="text-[#6f956d]" size={20} />
            <div className="min-w-0 flex-1">
              <strong className="block text-sm">{item.title}</strong>
              <span className="text-xs text-[#9a9b83]">
                {item.course} · Hạn {item.due}
              </span>
            </div>
            <span
              className={`status-pill ${item.status === "Đã chấm" ? "status-success" : item.status === "Đã nộp" ? "status-info" : item.status === "Quá hạn" ? "status-danger" : "status-warn"}`}
            >
              {item.status === "Chưa làm" ? "Chưa nộp" : item.status}
            </span>
            <span className="hidden text-xs font-semibold text-[#9a9b83] sm:inline">
              Chỉ xem
            </span>
          </div>
        ))}
      </div>
    </>
  );
}

export function ParentInvoicesView() {
  return (
    <>
      <ParentPageHeader
        eyebrow="Payment overview"
        title="Học phí & hóa đơn"
        description="Theo dõi chi phí học tập của con một cách rõ ràng."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="soft-panel p-5">
          <p className="label-muted">Tổng học phí</p>
          <p className="mt-2 text-2xl font-black">2.000.000đ</p>
        </div>
        <div className="soft-panel p-5">
          <p className="label-muted">Đã thanh toán</p>
          <p className="mt-2 text-2xl font-black text-[#6f956d]">1.000.000đ</p>
        </div>
        <div className="soft-panel p-5">
          <p className="label-muted">Còn lại</p>
          <p className="mt-2 text-2xl font-black text-[#df8e70]">1.000.000đ</p>
          <div className="mt-3 h-2 rounded-full bg-[#f1eee4]">
            <div className="h-full w-1/2 rounded-full bg-[#6f956d]" />
          </div>
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-[#fff6dc] p-4 text-sm text-[#6f5d32]">
        ⚠️ Hóa đơn HD001 sẽ đến hạn vào 10/09/2026.{" "}
        <Link
          href="/parent/invoices/HD001"
          className="ml-2 font-bold underline"
        >
          Thanh toán ngay
        </Link>
      </div>
      <div className="mt-5 space-y-3">
        {parentInvoices.map((invoice) => (
          <Link
            href={`/parent/invoices/${invoice.id}`}
            className="assignment-row soft-panel"
            key={invoice.id}
          >
            <FileText className="text-[#df8e70]" size={20} />
            <span className="flex-1">
              <strong className="block text-sm">
                {invoice.id} · {invoice.course}
              </strong>
              <span className="text-xs text-[#9a9b83]">Hạn {invoice.due}</span>
            </span>
            <span className="text-right">
              <strong className="block text-sm">{invoice.amount}</strong>
              <span className="status-pill status-warn mt-1 inline-block">
                {invoice.status}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export function ParentInvoiceDetail({ id }: { id: string }) {
  const invoice =
    parentInvoices.find((item) => item.id === id) ?? parentInvoices[0];
  return (
    <>
      <Link
        href="/parent/invoices"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6f956d]"
      >
        <ArrowLeft size={16} /> Quay lại hóa đơn
      </Link>
      <div className="invoice-paper max-w-2xl p-6 md:p-10">
        <div className="flex justify-between border-b border-dashed border-[#d9d5c7] pb-6">
          <div>
            <span className="brand-mark">EB</span>
            <p className="mt-3 font-black">ENGLISH BUDDY</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9a9b83]">
              Hóa đơn học phí
            </p>
            <p className="mt-2 text-sm">{invoice.id}</p>
          </div>
        </div>
        <div className="grid gap-4 py-6 text-sm sm:grid-cols-2">
          <p>
            Học viên
            <br />
            <strong>{parent.child.fullName}</strong>
          </p>
          <p>
            Lớp
            <br />
            <strong>{invoice.course}</strong>
          </p>
          <p>
            Ngày lập
            <br />
            <strong>04/09/2026</strong>
          </p>
          <p>
            Hạn thanh toán
            <br />
            <strong>{invoice.due}</strong>
          </p>
        </div>
        <div className="space-y-3 border-y border-dashed border-[#d9d5c7] py-6 text-sm">
          <p className="flex justify-between">
            Học phí <strong>2.000.000đ</strong>
          </p>
          <p className="flex justify-between">
            Giảm giá <strong>200.000đ</strong>
          </p>
          <p className="flex justify-between text-lg font-black">
            Thành tiền <strong>1.800.000đ</strong>
          </p>
          <p className="flex justify-between">
            Đã thanh toán{" "}
            <strong className="text-[#6f956d]">{invoice.paid}</strong>
          </p>
          <p className="flex justify-between">
            Còn lại <strong className="text-[#df8e70]">1.000.000đ</strong>
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href="/parent/payments" className="primary-button">
            💳 Thanh toán
          </Link>
          <button className="rounded-full border border-[#e8e8df] px-5 py-3 text-sm font-bold">
            <Download className="mr-2 inline" size={16} /> Tải hóa đơn
          </button>
        </div>
        <div className="mt-8 border-t border-[#eeeade] pt-5">
          <p className="label-muted">Lịch sử thanh toán</p>
          <p className="mt-3 text-sm">
            <strong>Thanh toán #TT001</strong> · 1.000.000đ · 04/09/2026
          </p>
          <p className="mt-1 text-xs text-[#9a9b83]">
            💳 Chuyển khoản · Thanh toán học phí tháng 9.
          </p>
        </div>
      </div>
    </>
  );
}

export function ParentPaymentsView() {
  return (
    <>
      <ParentPageHeader
        eyebrow="Payment center"
        title="Thanh toán học phí"
        description="Hoàn tất thanh toán để hành trình học của Minh Anh luôn liền mạch."
      />
      <div className="soft-panel max-w-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Invoice HD001</p>
            <h2 className="mt-2 text-2xl font-black">Số tiền cần thanh toán</h2>
          </div>
          <p className="text-2xl font-black text-[#df8e70]">1.000.000đ</p>
        </div>
        <p className="mt-6 text-sm font-bold">Chọn phương thức thanh toán</p>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {["💳 Chuyển khoản", "🏦 Ngân hàng", "📱 QR Code"].map(
            (method, index) => (
              <button
                key={method}
                className={`rounded-2xl border p-4 text-left text-sm font-bold ${index === 0 ? "border-[#9fbe99] bg-[#eef5e9] text-[#587052]" : "border-[#e8e8df] text-[#7d877d]"}`}
              >
                {method}
              </button>
            ),
          )}
        </div>
        <div className="mt-6 rounded-2xl bg-[#f7f7f0] p-5 text-center text-sm text-[#7d877d]">
          Quét mã QR để thanh toán học phí
          <br />
          <span className="mt-3 inline-flex h-28 w-28 items-center justify-center border-4 border-[#354052] bg-white text-5xl">
            ▦
          </span>
        </div>
        <button className="primary-button mt-5 flex w-full justify-center">
          Tôi đã thanh toán <CheckCircle2 size={17} />
        </button>
      </div>
    </>
  );
}

export function ParentChatView() {
  const [selected, setSelected] = useState(conversations[0]);
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      {
        id: `local-${Date.now()}`,
        sender: "parent",
        text,
        time: "Bây giờ",
        status: "Đã gửi",
      },
    ]);
    setDraft("");
  };
  return (
    <div className="h-[calc(100vh-130px)] min-h-[580px]">
      <ParentPageHeader
        eyebrow="Stay connected"
        title="Chat với giáo viên"
        description="Trao đổi trực tiếp để cùng hỗ trợ Minh Anh tốt hơn."
      />
      <div className="grid h-[calc(100%-90px)] min-h-0 overflow-hidden rounded-[28px] border border-[#e8e8df] bg-[#fffdf8] shadow-[0_14px_40px_rgba(53,64,82,.045)] md:grid-cols-[300px_1fr]">
        <aside className="hidden border-r border-[#eeeade] bg-[#f7f7f0] md:block">
          <div className="border-b border-[#eeeade] p-5">
            <p className="font-black">Cuộc trò chuyện</p>
            <p className="mt-1 text-xs text-[#9a9b83]">
              Nguyễn Minh Anh · 2 giáo viên
            </p>
          </div>
          {conversations.map((conversation) => (
            <button
              type="button"
              key={conversation.id}
              onClick={() => setSelected(conversation)}
              className={`flex w-full items-start gap-3 border-b border-[#eeeade] p-4 text-left ${selected.id === conversation.id ? "bg-[#e8f1e2]" : "hover:bg-white"}`}
            >
              <span className="avatar">{conversation.initials}</span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm">
                  {conversation.teacher}
                </strong>
                <span className="block truncate text-xs text-[#7d877d]">
                  {conversation.course}
                </span>
                <span className="mt-2 block truncate text-xs text-[#9a9b83]">
                  {conversation.preview}
                </span>
              </span>
              {conversation.unread > 0 && (
                <span className="status-pill status-danger">
                  {conversation.unread}
                </span>
              )}
            </button>
          ))}
        </aside>
        <section className="flex min-h-0 flex-1 flex-col">
          <div className="flex items-center gap-3 border-b border-[#eeeade] p-4 md:p-5">
            <span className="avatar">{selected.initials}</span>
            <div>
              <p className="font-black">{selected.teacher}</p>
              <p className="text-xs text-[#7d877d]">
                {selected.course} ·{" "}
                <span
                  className={
                    selected.online ? "text-[#6f956d]" : "text-[#9a9b83]"
                  }
                >
                  {selected.online ? "Đang hoạt động" : "Ngoại tuyến"}
                </span>
              </p>
            </div>
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#fbfcf7] p-4 md:p-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "parent" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[82%] rounded-3xl px-4 py-3 text-sm leading-6 ${message.sender === "parent" ? "rounded-br-md bg-[#6f956d] text-white" : "rounded-bl-md bg-white text-[#566355] shadow-sm"}`}
                >
                  <p>{message.text}</p>
                  <p
                    className={`mt-1 text-[10px] ${message.sender === "parent" ? "text-white/70" : "text-[#9a9b83]"}`}
                  >
                    {message.time} {message.status ? `· ${message.status}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#eeeade] bg-white p-3">
            <div className="flex items-end gap-2 rounded-2xl border border-[#e8e8df] bg-[#fdfcf7] p-2">
              <button
                type="button"
                className="icon-button h-9 w-9 shrink-0"
                aria-label="Đính kèm"
              >
                <Paperclip size={17} />
              </button>
              <textarea
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Nhập tin nhắn..."
                rows={1}
                className="max-h-24 min-h-9 flex-1 resize-none bg-transparent px-2 py-2 text-sm outline-none"
              />
              <button
                type="button"
                onClick={sendMessage}
                className="primary-button h-9 px-4"
                aria-label="Gửi tin nhắn"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export function ParentNotificationsView() {
  return (
    <>
      <ParentPageHeader
        eyebrow="Stay informed"
        title="Thông báo"
        description="Những điều quan trọng về hành trình học của Minh Anh."
      />
      <div className="space-y-3">
        {notifications.map((item) => (
          <Link
            href={item.href}
            className="assignment-row soft-panel"
            key={item.text}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#eef5e9] text-xl">
              {item.icon}
            </span>
            <span className="flex-1">
              <strong className="block text-sm">{item.text}</strong>
              <span className="mt-1 block text-xs text-[#9a9b83]">
                {item.time}
              </span>
            </span>
            <ArrowRight className="text-[#9a9b83]" size={17} />
          </Link>
        ))}
      </div>
    </>
  );
}

export function ParentProfileView() {
  return (
    <>
      <ParentPageHeader
        eyebrow="Your account"
        title="Tài khoản phụ huynh"
        description="Thông tin liên hệ và danh sách học viên được liên kết."
      />
      <div className="soft-panel max-w-2xl p-6">
        <div className="flex items-center gap-4 border-b border-[#eeeade] pb-6">
          <span className="avatar h-16 w-16 text-xl">{parent.initials}</span>
          <div>
            <h2 className="text-xl font-black">{parent.name}</h2>
            <p className="text-sm text-[#9a9b83]">Phụ huynh học viên</p>
          </div>
        </div>
        <div className="mt-6 space-y-5 text-sm">
          <p>
            <UserRound className="mr-2 inline text-[#6f956d]" size={18} />
            Họ và tên: <strong>{parent.name}</strong>
          </p>
          <p>
            <MessageCircle className="mr-2 inline text-[#6f956d]" size={18} />
            Email: <strong>minh.nguyen@example.com</strong>
          </p>
          <p>
            <Heart className="mr-2 inline text-[#df8e70]" size={18} />
            Đang theo dõi: <strong>Nguyễn Minh Anh</strong>
          </p>
        </div>
        <button className="primary-button mt-8">Chỉnh sửa hồ sơ</button>
      </div>
    </>
  );
}
