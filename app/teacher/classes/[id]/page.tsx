import Link from "next/link";
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  ClipboardList,
  UsersRound,
} from "lucide-react";
import { teacherClasses } from "@/lib/teacher-data";

export default async function TeacherClassDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item =
    teacherClasses.find((entry) => entry.id === id) ?? teacherClasses[0];
  return (
    <div className="space-y-6">
      <Link
        href="/teacher/classes"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#a8656c]"
      >
        <ArrowLeft size={16} /> Tất cả lớp học
      </Link>
      <section className="teacher-hero p-6 md:p-8">
        <p className="eyebrow text-[#aa777c]">Class overview</p>
        <h1 className="mt-2 text-3xl font-black text-[#354052]">{item.name}</h1>
        <p className="mt-2 text-sm text-[#765f64]">
          {item.code} · {item.level} · {item.schedule} · Phòng {item.room}
        </p>
        <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
          <div className="teacher-stat">
            <strong>{item.students}</strong>
            <span>Học viên</span>
          </div>
          <div className="teacher-stat">
            <strong>{item.attendance}%</strong>
            <span>Chuyên cần</span>
          </div>
          <div className="teacher-stat">
            <strong>{item.average}</strong>
            <span>Điểm TB</span>
          </div>
          <div className="teacher-stat">
            <strong>{item.progress}%</strong>
            <span>Tiến độ</span>
          </div>
        </div>
      </section>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Học viên", UsersRound, "/teacher/students"],
          ["Lịch học", BookOpen, "/teacher/schedule"],
          ["Bài tập", ClipboardList, "/teacher/assignments"],
          ["Điểm danh", CheckCircle2, "/teacher/attendance"],
        ].map(([label, Icon, href]) => (
          <Link
            href={href as string}
            key={label as string}
            className="teacher-panel flex items-center gap-3 p-5 transition hover:-translate-y-1"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#fbe6e4] text-[#a8656c]">
              <Icon size={18} />
            </span>
            <span className="font-bold">{label as string}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
