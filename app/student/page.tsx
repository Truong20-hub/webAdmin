import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChevronRight,
  Clock3,
  Flame,
  Headphones,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";
import { assignments, schedule, student } from "@/lib/student-data";

const quickActions = [
  {
    href: "/student/schedule",
    label: "Lịch học",
    note: "Xem buổi sắp tới",
    icon: CalendarDays,
    tone: "sage",
  },
  {
    href: "/student/assignments",
    label: "Bài tập",
    note: "2 bài cần làm",
    icon: BookOpen,
    tone: "peach",
  },
  {
    href: "/student/grades",
    label: "Điểm của tôi",
    note: "Theo dõi tiến bộ",
    icon: Trophy,
    tone: "yellow",
  },
  {
    href: "/student/invoices",
    label: "Học phí",
    note: "Còn 1.000.000đ",
    icon: Star,
    tone: "blue",
  },
];

const statusTone: Record<string, string> = {
  "Chưa làm": "status-warn",
  "Đã nộp": "status-info",
  "Đã chấm": "status-success",
  "Quá hạn": "status-danger",
};

export default function StudentDashboardPage() {
  const nextSession = schedule[0];
  return (
    <div className="space-y-6 md:space-y-8">
      <section className="hero-panel relative overflow-hidden p-6 md:p-9">
        <div className="relative z-10 max-w-2xl">
          <p className="eyebrow text-[#6b8468]">Friday, 04 September 2026</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-[#354052] md:text-5xl">
            Chào buổi tối, {student.name}!{" "}
            <span className="inline-block animate-bounce">👋</span>
          </h1>
          <p className="mt-3 max-w-lg text-sm leading-6 text-[#637064] md:text-base">
            Mỗi bước nhỏ hôm nay đưa bạn gần hơn tới phiên bản tự tin nói tiếng
            Anh.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-5">
            <div className="relative h-[88px] w-[88px]">
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
                  strokeDasharray={`${student.progress}, 100`}
                  d="M18 2.0845a15.9155 15.9155 0 1 1 0 31.831a15.9155 15.9155 0 1 1 0-31.831"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-lg font-black text-[#354052]">
                {student.progress}%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#7b8d78]">
                Khóa học hiện tại
              </p>
              <p className="mt-1 text-lg font-black text-[#354052]">
                {student.course}
              </p>
              <p className="mt-1 text-sm text-[#637064]">
                Cùng cô {student.teacher} · 18 buổi học
              </p>
            </div>
          </div>
          <Link
            href="/student/classes"
            className="primary-button mt-7 inline-flex"
          >
            Tiếp tục học <ArrowRight size={17} />
          </Link>
        </div>
        <div className="hero-doodle" aria-hidden="true">
          ✦<span>☁</span>
        </div>
      </section>

      <section>
        <div className="mb-3 flex items-end justify-between">
          <div>
            <p className="eyebrow">Your shortcuts</p>
            <h2 className="section-title">Hôm nay bạn muốn làm gì?</h2>
          </div>
          <Sparkles className="hidden text-[#e6b85c] sm:block" size={22} />
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {quickActions.map(({ href, label, note, icon: Icon, tone }) => (
            <Link href={href} key={href} className={`quick-card quick-${tone}`}>
              <span className="quick-icon">
                <Icon size={20} />
              </span>
              <span className="mt-4 block font-bold text-[#354052]">
                {label}
              </span>
              <span className="mt-1 block text-xs text-[#7d877d]">{note}</span>
              <ChevronRight
                className="absolute right-4 top-5 text-[#9a9b83]"
                size={16}
              />
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="soft-panel p-5 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Coming up next</p>
              <h2 className="section-title">Buổi học tiếp theo</h2>
            </div>
            <span className="date-chip">
              {nextSession.day}, {nextSession.date}
            </span>
          </div>
          <div className="mt-6 rounded-3xl bg-[#f6f7ee] p-5">
            <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-sm font-semibold text-[#6f956d]">
                  <span className="pulse-dot" /> Sắp học
                </div>
                <h3 className="mt-3 text-xl font-black text-[#354052]">
                  {nextSession.course}
                </h3>
                <p className="mt-2 text-sm text-[#7d877d]">
                  {nextSession.topic}
                </p>
              </div>
              <div className="flex gap-5 text-sm">
                <div>
                  <p className="label-muted">Thời gian</p>
                  <p className="mt-1 font-bold text-[#354052]">
                    <Clock3 className="mr-1 inline" size={15} />
                    {nextSession.time}
                  </p>
                </div>
                <div>
                  <p className="label-muted">Phòng</p>
                  <p className="mt-1 font-bold text-[#354052]">
                    {nextSession.room}
                  </p>
                </div>
              </div>
            </div>
            <div className="mt-5 flex items-center justify-between border-t border-[#e5e9dc] pt-4">
              <p className="text-xs text-[#7d877d]">
                Giáo viên:{" "}
                <strong className="text-[#566355]">
                  {nextSession.teacher}
                </strong>
              </p>
              <Link
                href="/student/schedule"
                className="text-sm font-bold text-[#6f956d]"
              >
                Xem chi tiết <ArrowRight className="ml-1 inline" size={15} />
              </Link>
            </div>
          </div>
        </div>
        <div className="soft-panel p-5 md:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="eyebrow">Keep going</p>
              <h2 className="section-title">Năng lượng học tập</h2>
            </div>
            <Flame className="text-[#df8e70]" size={23} />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="metric-tile">
              <Flame className="text-[#df8e70]" size={21} />
              <strong>{student.streak}</strong>
              <span>Chuỗi ngày học</span>
            </div>
            <div className="metric-tile">
              <Star className="text-[#e5b44c]" size={21} />
              <strong>{student.xp}</strong>
              <span>Kinh nghiệm</span>
            </div>
          </div>
          <div className="mt-5 rounded-2xl bg-[#fff6dc] p-4">
            <p className="text-sm font-bold text-[#6f5d32]">
              🌟 Còn một chút nữa thôi!
            </p>
            <p className="mt-1 text-xs leading-5 text-[#89784e]">
              Hoàn thành 2 bài tập để mở khóa huy hiệu Homework Hero.
            </p>
          </div>
        </div>
      </section>

      <section className="soft-panel p-5 md:p-6">
        <div className="flex items-end justify-between">
          <div>
            <p className="eyebrow">Your practice list</p>
            <h2 className="section-title">Bài tập cần làm</h2>
          </div>
          <Link
            href="/student/assignments"
            className="text-sm font-bold text-[#6f956d]"
          >
            Xem tất cả <ArrowRight className="ml-1 inline" size={15} />
          </Link>
        </div>
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          {assignments.slice(0, 3).map((assignment) => (
            <Link
              href={`/student/assignments/${assignment.id}`}
              key={assignment.id}
              className="assignment-row"
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f1eee4] text-[#8d9a83]">
                <Headphones size={18} />
              </span>
              <span className="min-w-0 flex-1">
                <strong className="block truncate text-sm text-[#354052]">
                  {assignment.title}
                </strong>
                <span className="mt-1 block text-xs text-[#9a9b83]">
                  Hạn {assignment.due}
                </span>
              </span>
              <span className={`status-pill ${statusTone[assignment.status]}`}>
                {assignment.status}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
