"use client";

import { ArrowUpRight, BookOpenText, CalendarCheck2, Users2 } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

type ListResponse<T> = T[] | { data?: T[] };
type Attendance = { trangThai: string };

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState({ students: 0, teachers: 0, users: 0, attendanceRate: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void Promise.all([
      apiRequest<ListResponse<unknown>>("/HocVien"),
      apiRequest<ListResponse<unknown>>("/GiaoVien"),
      apiRequest<ListResponse<unknown>>("/NguoiDung"),
      apiRequest<ListResponse<Attendance>>("/DiemDanh"),
    ])
      .then(([studentResponse, teacherResponse, userResponse, attendanceResponse]) => {
        const students = Array.isArray(studentResponse) ? studentResponse : studentResponse.data ?? [];
        const teachers = Array.isArray(teacherResponse) ? teacherResponse : teacherResponse.data ?? [];
        const users = Array.isArray(userResponse) ? userResponse : userResponse.data ?? [];
        const attendance = Array.isArray(attendanceResponse) ? attendanceResponse : attendanceResponse.data ?? [];
        const present = attendance.filter((record) => record.trangThai === "CoMat").length;
        setCounts({ students: students.length, teachers: teachers.length, users: users.length, attendanceRate: attendance.length ? Math.round(present / attendance.length * 100) : 0 });
      })
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : "Không tải được dữ liệu tổng quan."))
      .finally(() => setIsLoading(false));
  }, []);

  const stats = [
    { title: "Học viên", value: counts.students.toLocaleString("vi-VN"), icon: Users2, tone: "from-violet-200 via-violet-100 to-pink-100" },
    { title: "Giáo viên", value: counts.teachers.toLocaleString("vi-VN"), icon: BookOpenText, tone: "from-sky-200 via-cyan-100 to-emerald-100" },
    { title: "Người dùng", value: counts.users.toLocaleString("vi-VN"), icon: Users2, tone: "from-pink-200 via-rose-100 to-orange-100" },
    { title: "Tỷ lệ có mặt", value: `${counts.attendanceRate}%`, icon: CalendarCheck2, tone: "from-emerald-200 via-mint-100 to-lime-100" },
  ];
  return (
    <PageShell
      title="Dashboard"
      description="Tổng quan hoạt động hệ thống quản lý lớp học tiếng Anh"
      action={
        <Link href="/admin/statistics" className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] transition hover:translate-y-[-1px]">
          Xem báo cáo <ArrowUpRight className="h-4 w-4" />
        </Link>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {stats.map(({ title, value, icon: Icon, tone }) => (
          <div
            key={title}
            className="rounded-[26px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone}`}
              >
                <Icon className="h-5 w-5 text-slate-700" />
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                {isLoading ? "Đang tải" : "Dữ liệu thực"}
              </span>
            </div>

            {errorMessage && <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}

            <p className="mt-5 text-sm text-slate-500">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Dữ liệu trực tiếp</p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">
                Quy mô hệ thống
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600">
              {isLoading ? "Đang tải" : "Đã đồng bộ"}
            </div>
          </div>

          <div className="mt-8 grid h-56 grid-cols-3 gap-4">
            {stats.slice(0, 3).map(({ title, value, tone }) => (
              <div key={title} className={`flex flex-col justify-end rounded-2xl bg-gradient-to-t ${tone} p-4`}>
                <span className="text-2xl font-bold text-slate-800">{isLoading ? "—" : value}</span>
                <span className="mt-1 text-sm text-slate-600">{title}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <h3 className="text-xl font-bold text-slate-800">
            Trạng thái dữ liệu
          </h3>
          <div className="mt-6 space-y-4">
            {["Học viên", "Giáo viên", "Người dùng", "Điểm danh"].map((label) => (
              <div key={label} className="flex items-center justify-between rounded-2xl bg-violet-50/70 p-3">
                <p className="text-sm font-medium text-slate-700">{label}</p>
                <span className="text-xs text-violet-600">{errorMessage ? "Lỗi tải" : isLoading ? "Đang tải" : "Đã đồng bộ"}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
