import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { teacherAssignments, teacherStudents } from "@/lib/teacher-data";

export default async function AssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assignment =
    teacherAssignments.find((entry) => entry.id === id) ??
    teacherAssignments[0];
  return (
    <div className="space-y-6">
      <Link
        href="/teacher/assignments"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#a8656c]"
      >
        <ArrowLeft size={16} /> Tất cả bài tập
      </Link>
      <div>
        <p className="eyebrow text-[#aa777c]">Submission inbox</p>
        <h1 className="mt-2 text-3xl font-black text-[#354052]">
          {assignment.title}
        </h1>
        <p className="mt-2 text-sm text-[#917d83]">
          {assignment.className} · {assignment.submitted}/{assignment.total} đã
          nộp · Hạn {assignment.due}
        </p>
      </div>
      <div className="teacher-panel overflow-x-auto p-5">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-[#eee5e1] text-xs uppercase tracking-wider text-[#a28e96]">
            <tr>
              <th className="px-3 py-3">Học viên</th>
              <th>Ngày nộp</th>
              <th>Trạng thái</th>
              <th>Điểm</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {teacherStudents
              .concat([
                {
                  id: "missing",
                  name: "Lê Minh Tuấn",
                  initials: "MT",
                  email: "",
                  className: "",
                  average: 0,
                  attendance: 0,
                  progress: 0,
                  status: "",
                },
              ])
              .map((student, index) => (
                <tr key={student.id} className="border-b border-[#f2ebe7]">
                  <td className="px-3 py-4 font-bold">{student.name}</td>
                  <td className="text-[#917d83]">
                    {index < 3 ? "08/09 · 20:10" : "-"}
                  </td>
                  <td>
                    <span
                      className={
                        index < 2
                          ? "status-pill status-success"
                          : "status-pill status-warn"
                      }
                    >
                      {index < 2 ? "Đã nộp" : "Chưa nộp"}
                    </span>
                  </td>
                  <td className="font-bold">
                    {index === 0 ? "9.0" : index === 1 ? "8.0" : "-"}
                  </td>
                  <td>
                    <Link
                      href={`/teacher/assignments/${assignment.id}/submissions/${student.id}`}
                      className="font-bold text-[#a8656c]"
                    >
                      {index < 2 ? "Chấm bài" : "Nhắc nộp"}
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
