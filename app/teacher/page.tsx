import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Clock3,
  MessageCircle,
  Sparkles,
  Trophy,
  UsersRound,
} from "lucide-react";
import { teacherService } from "@/lib/teacher-service";
import { teacher } from "@/lib/teacher-data";

const quickActions = [
  {
    href: "/teacher/schedule",
    label: "Lịch dạy",
    note: "2 buổi hôm nay",
    icon: CalendarDays,
    tone: "bg-[#f8e9e2]",
    color: "text-[#c67b6e]",
  },
  {
    href: "/teacher/attendance",
    label: "Điểm danh",
    note: "Bắt đầu nhanh",
    icon: CheckCircle2,
    tone: "bg-[#eaf3e6]",
    color: "text-[#70966b]",
  },
  {
    href: "/teacher/assignments/create",
    label: "Giao bài tập",
    note: "Tạo bài mới",
    icon: ClipboardCheck,
    tone: "bg-[#fff3d7]",
    color: "text-[#c79742]",
  },
  {
    href: "/teacher/grades",
    label: "Chấm điểm",
    note: "12 bài cần chấm",
    icon: Trophy,
    tone: "bg-[#eee8f7]",
    color: "text-[#8870a6]",
  },
  {
    href: "/teacher/chat",
    label: "Chat phụ huynh",
    note: "4 tin chưa đọc",
    icon: MessageCircle,
    tone: "bg-[#e6f1f4]",
    color: "text-[#6b98a5]",
  },
];

export default async function TeacherDashboardPage() {
  const {
    teacherClasses,
    teacherSessions,
    teacherAssignments,
    teacherStudents,
  } = await teacherService.getDashboard();
  const totalStudents = teacherClasses.reduce(
    (total, item) => total + item.students,
    0,
  );
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="teacher-hero relative overflow-hidden p-6 md:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow text-[#aa777c]">Friday, 05 September 2026</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#354052] md:text-5xl">
            Chào cô {teacher.name}! <span className="inline-block">🌷</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#765f64] md:text-base">
            Cô có 2 buổi học hôm nay. Mọi việc quan trọng đều đã được gom lại ở
            đây.
          </p>
          <div className="mt-7 grid max-w-xl grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="teacher-stat">
              <strong>{teacherClasses.length}</strong>
              <span>Lớp phụ trách</span>
            </div>
            <div className="teacher-stat">
              <strong>{totalStudents}</strong>
              <span>Học viên</span>
            </div>
            <div className="teacher-stat">
              <strong>12</strong>
              <span>Bài cần chấm</span>
            </div>
            <div className="teacher-stat">
              <strong>4</strong>
              <span>Tin chưa đọc</span>
            </div>
          </div>
        </div>
        <div className="absolute -right-4 -top-12 text-[150px] leading-none text-[#efc3c0]/60">
          ✦
          <span className="absolute bottom-0 right-20 text-[68px] text-white/70">
            ☁
          </span>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="eyebrow">Your shortcuts</p>
            <h2 className="section-title">Hôm nay cô muốn làm gì?</h2>
          </div>
          <Sparkles className="hidden text-[#d8898c] sm:block" size={22} />
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5">
          {quickActions.map(
            ({ href, label, note, icon: Icon, tone, color }) => (
              <Link href={href} key={href} className="teacher-quick-card">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tone} ${color}`}
                >
                  <Icon size={20} />
                </span>
                <span className="mt-4 block font-bold text-[#354052]">
                  {label}
                </span>
                <span className="mt-1 block text-xs text-[#a28e96]">
                  {note}
                </span>
                <ChevronRight
                  className="absolute right-4 top-5 text-[#b6a4a8]"
                  size={16}
                />
              </Link>
            ),
          )}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="teacher-panel p-5 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Today&apos;s teaching plan</p>
              <h2 className="section-title">Lịch dạy hôm nay</h2>
            </div>
            <span className="date-chip">05/09/2026</span>
          </div>
          <div className="mt-5 space-y-3">
            {teacherSessions.map((session, index) => (
              <div key={session.id} className="rounded-3xl bg-[#faf5f1] p-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-start gap-3">
                    <span
                      className={`mt-1 h-2.5 w-2.5 rounded-full ${index === 0 ? "bg-[#78a875]" : "bg-[#dfb06a]"}`}
                    />
                    <div>
                      <h3 className="font-black text-[#354052]">
                        {session.className}
                      </h3>
                      <p className="mt-1 text-sm text-[#9b858b]">
                        {session.topic}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-bold text-[#695c61]">
                      <Clock3 className="mr-1 inline" size={15} />
                      {session.time}
                    </span>
                    <span className="hidden font-bold text-[#695c61] sm:inline">
                      {session.room}
                    </span>
                    <Link
                      href="/teacher/attendance"
                      className="rounded-full bg-white px-3 py-2 text-xs font-bold text-[#a8656c] shadow-sm"
                    >
                      Điểm danh
                    </Link>
                  </div>
                </div>
                <div className="mt-4 flex items-center justify-between border-t border-[#eee2dc] pt-3 text-xs text-[#9b858b]">
                  <span>
                    {session.students} học viên ·{" "}
                    <strong className="text-[#6d7f6c]">{session.status}</strong>
                  </span>
                  <Link
                    href={`/teacher/classes/${index === 0 ? "b1" : "a2"}`}
                    className="font-bold text-[#a8656c]"
                  >
                    Vào lớp <ArrowRight className="ml-1 inline" size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="teacher-panel p-5 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Class pulse</p>
              <h2 className="section-title">Tình hình lớp học</h2>
            </div>
            <UsersRound className="text-[#d8898c]" size={23} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="teacher-stat">
              <strong>95%</strong>
              <span>Chuyên cần</span>
            </div>
            <div className="teacher-stat">
              <strong>8.2</strong>
              <span>Điểm trung bình</span>
            </div>
            <div className="teacher-stat">
              <strong>86%</strong>
              <span>Hoàn thành bài</span>
            </div>
            <div className="teacher-stat">
              <strong>72%</strong>
              <span>Tiến độ học</span>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-[#fff3d7] p-4">
            <p className="text-sm font-bold text-[#856b36]">
              🌟 Lớp B1 đang học rất đều
            </p>
            <p className="mt-1 text-xs leading-5 text-[#9b8050]">
              18/24 học viên đã nộp Vocabulary Unit 5. Còn 6 bài cần nhắc.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="teacher-panel p-5 md:p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Marking queue</p>
              <h2 className="section-title">Bài tập cần chấm</h2>
            </div>
            <Link
              href="/teacher/assignments"
              className="text-sm font-bold text-[#a8656c]"
            >
              Xem tất cả <ArrowRight className="ml-1 inline" size={15} />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {teacherAssignments.slice(0, 2).map((assignment) => (
              <Link
                href={`/teacher/assignments/${assignment.id}/submissions`}
                key={assignment.id}
                className="block rounded-2xl border border-[#eee5e1] bg-white p-4 transition hover:border-[#e2b4b1]"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-bold text-[#354052]">
                      {assignment.title}
                    </p>
                    <p className="mt-1 text-xs text-[#a28e96]">
                      {assignment.className} · Hạn {assignment.due}
                    </p>
                  </div>
                  <span className="rounded-full bg-[#fff0ef] px-3 py-1 text-xs font-bold text-[#a8656c]">
                    {assignment.total - assignment.graded} cần chấm
                  </span>
                </div>
                <div className="mt-4 flex items-center gap-3">
                  <div className="teacher-progress flex-1">
                    <span
                      style={{
                        width: `${(assignment.graded / assignment.submitted) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-xs font-bold text-[#8c777d]">
                    {assignment.graded}/{assignment.submitted}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="teacher-panel p-5 md:p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="eyebrow">Student spotlight</p>
              <h2 className="section-title">Theo dõi học viên</h2>
            </div>
            <Link
              href="/teacher/students"
              className="text-sm font-bold text-[#a8656c]"
            >
              Danh sách <ArrowRight className="ml-1 inline" size={15} />
            </Link>
          </div>
          <div className="mt-5 space-y-3">
            {teacherStudents.slice(0, 3).map((student) => (
              <Link
                href={`/teacher/students/${student.id}`}
                key={student.id}
                className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-[#fff4f1]"
              >
                <span className="teacher-avatar">{student.initials}</span>
                <span className="min-w-0 flex-1">
                  <strong className="block truncate text-sm text-[#354052]">
                    {student.name}
                  </strong>
                  <span className="text-xs text-[#a28e96]">
                    {student.status}
                  </span>
                </span>
                <span className="text-right">
                  <strong className="block text-sm text-[#354052]">
                    {student.average}
                  </strong>
                  <span className="text-[10px] text-[#a28e96]">Điểm TB</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
