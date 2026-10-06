"use client";

import { Activity, BarChart3, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

type AttendanceReport = { tenLop: string; tongSoBuoi: number; tongLuotDiemDanh: number; soLuotCoMat: number; tyLeThamDu: number };
type TuitionReport = { tongTienDaThu: number; tongTienConNo: number };
type GradeReport = { tongDiem: number | null };

export default function StatisticsPage() {
  const [attendance, setAttendance] = useState<AttendanceReport[]>([]);
  const [tuition, setTuition] = useState<TuitionReport[]>([]);
  const [grades, setGrades] = useState<GradeReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void Promise.all([
      apiRequest<AttendanceReport[]>("/BaoCao/chuyen-can"),
      apiRequest<TuitionReport[]>("/BaoCao/hoc-phi"),
      apiRequest<GradeReport[]>("/BaoCao/diem"),
    ])
      .then(([attendanceData, tuitionData, gradeData]) => {
        setAttendance(attendanceData);
        setTuition(tuitionData);
        setGrades(gradeData);
      })
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : "Không tải được báo cáo thống kê."))
      .finally(() => setIsLoading(false));
  }, []);

  const attended = attendance.reduce((sum, row) => sum + row.soLuotCoMat, 0);
  const totalAttendance = attendance.reduce((sum, row) => sum + row.tongLuotDiemDanh, 0);
  const attendanceRate = totalAttendance ? Math.round(attended / totalAttendance * 100) : 0;
  const statCards = [
    { label: "Học phí đã thu", value: `${tuition.reduce((sum, row) => sum + row.tongTienDaThu, 0).toLocaleString("vi-VN")}đ` },
    { label: "Học phí còn nợ", value: `${tuition.reduce((sum, row) => sum + row.tongTienConNo, 0).toLocaleString("vi-VN")}đ` },
    { label: "Điểm trung bình", value: grades.length ? (grades.reduce((sum, row) => sum + (row.tongDiem ?? 0), 0) / grades.filter((row) => row.tongDiem !== null).length || 0).toFixed(2) : "0" },
  ];

  return (
    <PageShell
      title="Báo cáo thống kê"
      description="Tổng hợp học phí, điểm thi và chuyên cần từ báo cáo backend"
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-xs text-violet-500">{isLoading ? "Đang tải" : "Theo báo cáo"}</span>
            </div>
            <p className="mt-5 text-sm text-slate-500">{item.label}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      {errorMessage && <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr] mb-6">
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">
              Xu hướng học tập
            </h3>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
              <TrendingUp className="h-3.5 w-3.5" />
              Theo lớp học
            </div>
          </div>

          <div className="mt-8 flex h-56 items-end gap-3">
            {attendance.slice(0, 7).map((row) => (
              <div
                key={row.tenLop}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className="w-full rounded-t-2xl bg-gradient-to-t from-violet-400 to-pink-300"
                  style={{ height: `${Math.max(4, Math.min(100, Number(row.tyLeThamDu)))}%` }}
                />
                <span className="max-w-full truncate text-xs text-slate-400" title={row.tenLop}>{row.tenLop}</span>
              </div>
            ))}
            {!attendance.length && <p className="w-full self-center text-center text-sm text-slate-500">{isLoading ? "Đang tải..." : "Chưa có dữ liệu chuyên cần."}</p>}
          </div>
        </div>

        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <h3 className="text-xl font-bold text-slate-800">Tổng hợp KPI</h3>
          <div className="mt-6 space-y-4">
            {[
              ["Tỷ lệ tham dự", `${attendanceRate}%`],
              ["Tổng lượt điểm danh", totalAttendance.toLocaleString("vi-VN")],
              ["Số bài có điểm", grades.length.toLocaleString("vi-VN")],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-700">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Theo dõi lớp học</h3>
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-600">
            <Activity className="h-3.5 w-3.5" />
            Báo cáo chuyên cần
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="pb-3 font-medium">Lớp học</th>
                <th className="pb-3 text-right font-medium">Tỷ lệ tham dự</th>
                <th className="pb-3 text-right font-medium">Số buổi</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((row) => (
                <tr key={row.tenLop} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-700">
                    {row.tenLop}
                  </td>
                  <td className="py-3 pr-4 text-right text-slate-500">
                    {Number(row.tyLeThamDu).toFixed(1)}%
                  </td>
                  <td className="py-3 pr-4 text-right text-emerald-600">
                    {row.tongSoBuoi}
                  </td>
                </tr>
              ))}
              {!attendance.length && <tr><td colSpan={3} className="py-8 text-center text-slate-500">{isLoading ? "Đang tải..." : "Không có báo cáo chuyên cần."}</td></tr>}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
