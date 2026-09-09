import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { teacherStudents } from "@/lib/teacher-data";

export default async function TeacherStudentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const student =
    teacherStudents.find((entry) => entry.id === id) ?? teacherStudents[0];
  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/teacher/students"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#a8656c]"
      >
        <ArrowLeft size={16} /> Danh sách học viên
      </Link>
      <section className="teacher-panel p-6 md:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-full bg-[#f7d9d7] text-lg font-black text-[#a8656c]">
            {student.initials}
          </span>
          <div className="flex-1">
            <p className="eyebrow">Learning profile</p>
            <h1 className="mt-1 text-2xl font-black text-[#354052]">
              {student.name}
            </h1>
            <p className="mt-1 text-sm text-[#917d83]">
              {student.className} · {student.email}
            </p>
          </div>
          <Link
            href="/teacher/chat"
            className="primary-button inline-flex self-start bg-[#d8898c] hover:bg-[#c8787d]"
          >
            <MessageCircle size={16} /> Nhắn phụ huynh
          </Link>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-4">
          <div className="teacher-stat">
            <strong>{student.progress}%</strong>
            <span>Tiến độ</span>
          </div>
          <div className="teacher-stat">
            <strong>{student.average}</strong>
            <span>Điểm trung bình</span>
          </div>
          <div className="teacher-stat">
            <strong>{student.attendance}%</strong>
            <span>Chuyên cần</span>
          </div>
          <div className="teacher-stat">
            <strong>8/10</strong>
            <span>Bài tập</span>
          </div>
        </div>
      </section>
      <section className="teacher-panel p-6">
        <p className="eyebrow">Skill snapshot</p>
        <h2 className="section-title">Năng lực theo kỹ năng</h2>
        {[
          ["Listening", 78],
          ["Speaking", 86],
          ["Reading", 72],
          ["Writing", 81],
        ].map(([label, value]) => (
          <div key={label as string} className="mt-5">
            <div className="mb-2 flex justify-between text-sm font-bold">
              <span>{label as string}</span>
              <span>{value as number}%</span>
            </div>
            <div className="teacher-progress">
              <span style={{ width: `${value}%` }} />
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
