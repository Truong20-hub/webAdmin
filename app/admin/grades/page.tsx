"use client";

import { ArrowLeft, BarChart3, Search, UserRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

type ClassInfo = {
  maLop: number;
  tenLop: string;
  giaoVien: string;
  khoaHoc: string;
};

type GradeRecord = {
  maLop: number;
  hoTenHocVien: string;
  tenKyThi: string;
  ngayThi: string | null;
  diemNghe: number | null;
  diemNoi: number | null;
  diemDoc: number | null;
  diemViet: number | null;
  tongDiem: number | null;
  nhanXet: string | null;
};

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "--";

export default function GradeManagementPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [classSearch, setClassSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("Tất cả giáo viên");
  const [courseFilter, setCourseFilter] = useState("Tất cả khóa học");
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [selectedRecords, setSelectedRecords] = useState<GradeRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void apiRequest<{ data?: Array<{ maLop: number; tenLop: string; tenGiaoVien?: string; tenKhoaHoc?: string }> }>("/LopHoc")
      .then((response) => setClasses((response.data ?? []).map((item) => ({
        maLop: item.maLop,
        tenLop: item.tenLop,
        giaoVien: item.tenGiaoVien ?? "Chưa phân công",
        khoaHoc: item.tenKhoaHoc ?? "Chưa gán khóa học",
      }))))
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : "Không tải được danh sách lớp."))
      .finally(() => setIsLoading(false));
  }, []);

  const teacherOptions = useMemo(
    () => Array.from(new Set(classes.map((item) => item.giaoVien))),
    [classes],
  );
  const courseOptions = useMemo(
    () => Array.from(new Set(classes.map((item) => item.khoaHoc))),
    [classes],
  );

  const filteredClasses = useMemo(() => {
    const keyword = classSearch.trim().toLowerCase();
    return classes.filter(
      (item) =>
        (!keyword ||
          item.tenLop.toLowerCase().includes(keyword) ||
          item.giaoVien.toLowerCase().includes(keyword) ||
          item.khoaHoc.toLowerCase().includes(keyword)) &&
        (teacherFilter === "Tất cả giáo viên" ||
          item.giaoVien === teacherFilter) &&
        (courseFilter === "Tất cả khóa học" || item.khoaHoc === courseFilter),
    );
  }, [classes, classSearch, courseFilter, teacherFilter]);

  const handleSelectClass = async (item: ClassInfo) => {
    setSelectedClass(item);
    setSelectedRecords([]);
    setErrorMessage("");
    try {
      const records = await apiRequest<GradeRecord[]>(`/BaoCao/diem?maLop=${item.maLop}`);
      setSelectedRecords(records);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không tải được bảng điểm.");
    }
  };

  return (
    <PageShell
      title="Quản lý bảng điểm"
      description="Chọn lớp học để xem và theo dõi bảng điểm của học viên"
      action={
        selectedClass ? (
          <button
            type="button"
            onClick={() => setSelectedClass(null)}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-600 transition hover:bg-violet-50"
          >
            <ArrowLeft className="h-4 w-4" /> Danh sách lớp
          </button>
        ) : null
      }
    >
      {errorMessage && (
        <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}
      {!selectedClass ? (
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Chọn lớp học</h3>
              <p className="mt-1 text-sm text-slate-500">
                Tìm kiếm và chọn lớp để mở danh sách bảng điểm
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <label className="relative block">
                <span className="sr-only">Tìm kiếm lớp học</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={classSearch}
                  onChange={(event) => setClassSearch(event.target.value)}
                  placeholder="Tìm tên lớp hoặc giáo viên..."
                  className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 md:w-72"
                />
              </label>
              <select
                value={teacherFilter}
                onChange={(event) => setTeacherFilter(event.target.value)}
                aria-label="Lọc theo giáo viên"
                className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
              >
                <option>Tất cả giáo viên</option>
                {teacherOptions.map((teacher) => (
                  <option key={teacher}>{teacher}</option>
                ))}
              </select>
              <select
                value={courseFilter}
                onChange={(event) => setCourseFilter(event.target.value)}
                aria-label="Lọc theo khóa học"
                className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
              >
                <option value="Tất cả khóa học">Tất cả khóa học</option>
                {courseOptions.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {isLoading ? <p className="col-span-full py-8 text-center text-sm text-slate-500">Đang tải lớp học...</p> : filteredClasses.map((item) => (
              <button
                key={item.maLop}
                type="button"
                onClick={() => void handleSelectClass(item)}
                className="flex min-h-44 flex-col justify-between rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mt-6 font-bold text-slate-800">
                    {item.tenLop}
                  </h4>
                  <p className="mt-1 text-sm text-violet-600">{item.khoaHoc}</p>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <UserRound className="h-4 w-4 text-violet-400" />
                    {item.giaoVien}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {!filteredClasses.length && (
            <p className="py-10 text-center text-sm text-slate-400">
              Không tìm thấy lớp học phù hợp.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Bảng điểm lớp
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">
                {selectedClass.tenLop}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Giáo viên: {selectedClass.giaoVien}
              </p>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600">
              {selectedRecords.length} bảng điểm
            </span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[1050px] w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-3 py-3 font-semibold">Học viên</th>
                  <th className="px-3 py-3 font-semibold">Kỳ thi</th>
                  <th className="px-3 py-3 text-right font-semibold">Nghe</th>
                  <th className="px-3 py-3 text-right font-semibold">Nói</th>
                  <th className="px-3 py-3 text-right font-semibold">Đọc</th>
                  <th className="px-3 py-3 text-right font-semibold">Viết</th>
                  <th className="px-3 py-3 text-right font-semibold">Tổng điểm</th>
                  <th className="px-3 py-3 font-semibold">Nhận xét</th>
                  <th className="px-3 py-3 font-semibold">Ngày thi</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecords.length ? (
                  selectedRecords.map((record) => (
                    <tr
                      key={`${record.maLop}-${record.hoTenHocVien}-${record.tenKyThi}`}
                      className="border-t border-slate-100 text-sm text-slate-700"
                    >
                      <td className="px-3 py-4 font-medium">
                        {record.hoTenHocVien}
                      </td>
                      <td className="px-3 py-4">{record.tenKyThi}</td>
                      <td className="px-3 py-4 text-right">{record.diemNghe?.toFixed(2) ?? "--"}</td>
                      <td className="px-3 py-4 text-right">{record.diemNoi?.toFixed(2) ?? "--"}</td>
                      <td className="px-3 py-4 text-right">{record.diemDoc?.toFixed(2) ?? "--"}</td>
                      <td className="px-3 py-4 text-right">{record.diemViet?.toFixed(2) ?? "--"}</td>
                      <td className="px-3 py-4 text-right font-semibold">{record.tongDiem?.toFixed(2) ?? "--"}</td>
                      <td className="max-w-xs px-3 py-4 text-slate-500">{record.nhanXet ?? "--"}</td>
                      <td className="px-3 py-4 text-slate-500">{formatDate(record.ngayThi)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
                      className="px-3 py-10 text-center text-sm text-slate-500"
                    >
                      Lớp này chưa có bảng điểm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
}
