import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { teacherAssignments } from "@/lib/teacher-data";

export default async function TeacherAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assignment =
    teacherAssignments.find((item) => item.id === id) ?? teacherAssignments[0];
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link
        href="/teacher/assignments"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#a8656c]"
      >
        <ArrowLeft size={16} /> Tất cả bài tập
      </Link>
      <section className="teacher-panel p-6 md:p-8">
        <p className="eyebrow text-[#aa777c]">Assignment details</p>
        <h1 className="mt-2 text-3xl font-black text-[#354052]">
          {assignment.title}
        </h1>
        <p className="mt-2 text-sm text-[#917d83]">
          {assignment.className} · {assignment.type} · Hạn {assignment.due}
        </p>
        <div className="mt-7 grid grid-cols-3 gap-3">
          <div className="teacher-stat">
            <strong>{assignment.submitted}</strong>
            <span>Đã nộp</span>
          </div>
          <div className="teacher-stat">
            <strong>{assignment.graded}</strong>
            <span>Đã chấm</span>
          </div>
          <div className="teacher-stat">
            <strong>{assignment.total - assignment.submitted}</strong>
            <span>Chưa nộp</span>
          </div>
        </div>
        <Link
          href={`/teacher/assignments/${assignment.id}/submissions`}
          className="primary-button mt-7 inline-flex bg-[#d8898c] hover:bg-[#c8787d]"
        >
          Xem bài nộp <ArrowRight size={16} />
        </Link>
      </section>
    </div>
  );
}
