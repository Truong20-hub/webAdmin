"use client";

import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, CalendarCheck2, Search, UserRound } from "lucide-react";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

type AttendanceRecord = {
  maDiemDanh: number;
  maBuoi: number;
  maHocVien: number;
  maLop: number;
  tenLop: string;
  ngayHoc: string;
  gioBatDau?: string | null;
  gioKetThuc?: string | null;
  trangThai: string;
  ghiChu?: string;
};

type ClassInfo = {
  maLop: number;
  tenLop: string;
  tenGiaoVien: string;
  khoaHoc: string;
};

type Student = { maHocVien: number; hoTen?: string; tenHocVien?: string };

const statusLabels: Record<string, string> = {
  CoMat: "Có mặt",
  Vang: "Vắng mặt",
  TreCoPhep: "Đi trễ (có phép)",
  VangCoPhep: "Vắng (có phép)",
  VangMat: "Vắng mặt",
  Muon: "Muộn",
  CoPhep: "Có phép",
};

const statusStyles: Record<string, string> = {
  CoMat: "bg-emerald-50 text-emerald-600",
  Vang: "bg-rose-50 text-rose-600",
  TreCoPhep: "bg-amber-50 text-amber-600",
  VangCoPhep: "bg-sky-50 text-sky-600",
  VangMat: "bg-rose-50 text-rose-600",
  Muon: "bg-amber-50 text-amber-600",
  CoPhep: "bg-sky-50 text-sky-600",
};

const pageSize = 5;

export default function AttendanceManagementPage() {
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [classSearch, setClassSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("Tất cả khóa học");
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [selectedSession, setSelectedSession] = useState("Tất cả buổi học");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void Promise.all([
      apiRequest<AttendanceRecord[]>("/DiemDanh"),
      apiRequest<Student[] | { data?: Student[] }>("/HocVien"),
      apiRequest<{ data?: Array<{ maLop: number; tenLop: string; tenGiaoVien?: string | null; tenKhoaHoc?: string | null }> }>("/LopHoc"),
    ])
      .then(([records, studentResult, classResult]) => {
        setAttendanceRecords(records);
        setStudents(Array.isArray(studentResult) ? studentResult : studentResult.data ?? []);
        setClasses((classResult.data ?? []).map((item) => ({
          maLop: item.maLop,
          tenLop: item.tenLop,
          tenGiaoVien: item.tenGiaoVien ?? "Chưa phân công",
          khoaHoc: item.tenKhoaHoc ?? "Chưa gán khóa học",
        })));
      })
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : "Không tải được dữ liệu điểm danh.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const courseOptions = useMemo(
    () => Array.from(new Set(classes.map((item) => item.khoaHoc))),
    [classes],
  );

  const filteredClasses = useMemo(() => {
    const keyword = classSearch.trim().toLocaleLowerCase("vi");
    return classes.filter((item) =>
      (!keyword ||
        item.tenLop.toLocaleLowerCase("vi").includes(keyword) ||
        item.tenGiaoVien.toLocaleLowerCase("vi").includes(keyword) ||
        item.khoaHoc.toLocaleLowerCase("vi").includes(keyword)) &&
      (courseFilter === "Tất cả khóa học" || item.khoaHoc === courseFilter),
    );
  }, [classes, classSearch, courseFilter]);

  const classRecords = useMemo(
    () => selectedClass
      ? attendanceRecords.filter((record) => record.maLop === selectedClass.maLop)
      : [],
    [attendanceRecords, selectedClass],
  );
  const sessionOptions = useMemo(() => {
    const sessions = new Map<number, AttendanceRecord>();
    classRecords.forEach((record) => sessions.set(record.maBuoi, record));
    return [
      { value: "Tất cả buổi học", label: "Tất cả buổi học" },
      ...Array.from(sessions.values()).map((record) => ({
        value: String(record.maBuoi),
        label: `${record.tenLop} • ${new Date(record.ngayHoc).toLocaleDateString("vi-VN")}${record.gioBatDau ? ` • ${record.gioBatDau}` : ""}`,
      })),
    ];
  }, [classRecords]);

  const filteredRecords = useMemo(() => {
    return classRecords.filter((record) =>
      selectedSession === "Tất cả buổi học" ||
      String(record.maBuoi) === selectedSession,
    );
  }, [classRecords, selectedSession]);
  const presentCount = classRecords.filter((record) => record.trangThai === "CoMat").length;
  const attendanceRate = classRecords.length
    ? Math.round((presentCount / classRecords.length) * 100)
    : 0;
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentRecords = filteredRecords.slice(
    startIndex,
    startIndex + pageSize,
  );
  const handleSelectClass = (item: ClassInfo) => {
    setSelectedClass(item);
    setSelectedSession("Tất cả buổi học");
    setCurrentPage(1);
    setErrorMessage("");
  };
  return (
    <PageShell
      title="Quản lý điểm danh"
      description="Chọn lớp học để xem tình hình điểm danh của học viên"
      action={
        selectedClass ? (
          <button
            type="button"
            onClick={() => {
              setSelectedClass(null);
              setCurrentPage(1);
            }}
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
                Tìm kiếm và chọn lớp để mở danh sách điểm danh
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <span className="sr-only">Tìm kiếm lớp học</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={classSearch}
                  onChange={(event) => setClassSearch(event.target.value)}
                  placeholder="Tìm tên lớp, giáo viên hoặc khóa học..."
                  className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 md:w-72"
                />
              </label>
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
            {isLoading ? (
              <p className="col-span-full py-8 text-center text-sm text-slate-500">Đang tải lớp học...</p>
            ) : filteredClasses.map((item) => {
              const recordCount = attendanceRecords.filter((record) => record.maLop === item.maLop).length;
              return (
                <button
                  key={item.maLop}
                  type="button"
                  onClick={() => handleSelectClass(item)}
                  className="flex min-h-44 flex-col justify-between rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                    <CalendarCheck2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="mt-6 font-bold text-slate-800">{item.tenLop}</h4>
                    <p className="mt-1 text-sm text-violet-600">{item.khoaHoc}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                      <UserRound className="h-4 w-4 text-violet-400" />
                      {item.tenGiaoVien}
                    </p>
                    <p className="mt-1 text-xs text-violet-500">{recordCount} bản ghi điểm danh</p>
                  </div>
                </button>
              );
            })}
          </div>
          {!isLoading && !filteredClasses.length && (
            <p className="py-10 text-center text-sm text-slate-400">Không tìm thấy lớp học phù hợp.</p>
          )}
        </div>
      ) : (
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Điểm danh lớp
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">{selectedClass.tenLop}</h3>
              <p className="mt-1 text-sm text-slate-500">Giáo viên: {selectedClass.tenGiaoVien}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600">
                {classRecords.length} bản ghi
              </span>
              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-600">
                Có mặt {attendanceRate}%
              </span>
            </div>
          </div>

          <div className="mt-5 flex justify-end">
            <label className="text-sm font-medium text-slate-600">
              <span className="sr-only">Lọc theo buổi học</span>
              <select
                value={selectedSession}
                onChange={(event) => {
                  setSelectedSession(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-full border border-violet-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-700 outline-none transition focus:border-violet-300 sm:w-80"
              >
                {sessionOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[760px] w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-3 py-3 font-semibold">Buổi học</th>
                  <th className="px-3 py-3 font-semibold">Học viên</th>
                  <th className="px-3 py-3 font-semibold">Trạng thái</th>
                  <th className="px-3 py-3 font-semibold">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr><td colSpan={4} className="px-3 py-10 text-center text-sm text-slate-500">Đang tải dữ liệu...</td></tr>
                ) : currentRecords.length ? currentRecords.map((record) => {
                  const student = students.find((item) => item.maHocVien === record.maHocVien);
                  const statusStyle = statusStyles[record.trangThai] ?? "bg-slate-100 text-slate-600";
                  return (
                    <tr key={record.maDiemDanh} className="border-t border-slate-100 text-sm text-slate-700">
                      <td className="px-3 py-4">
                        <div className="font-medium">{new Date(record.ngayHoc).toLocaleDateString("vi-VN")}</div>
                        <div className="text-xs text-slate-500">
                          {record.gioBatDau ?? "--"}{record.gioKetThuc ? ` - ${record.gioKetThuc}` : ""}
                        </div>
                      </td>
                      <td className="px-3 py-4 font-medium">{student?.hoTen ?? student?.tenHocVien ?? "Không xác định"}</td>
                      <td className="px-3 py-4">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}>
                          {statusLabels[record.trangThai] ?? record.trangThai}
                        </span>
                      </td>
                      <td className="px-3 py-4 text-slate-500">{record.ghiChu ?? "--"}</td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={4} className="px-3 py-10 text-center text-sm text-slate-500">
                      Lớp này chưa có dữ liệu điểm danh phù hợp.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Hiển thị {currentRecords.length ? startIndex + 1 : 0} - {Math.min(startIndex + pageSize, filteredRecords.length)} / {filteredRecords.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage === 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                const isActive = pageNumber === safePage;
                return (
                  <button
                    key={pageNumber}
                    type="button"
                    onClick={() => setCurrentPage(pageNumber)}
                    aria-label={`Chuyển đến trang ${pageNumber}`}
                    aria-current={isActive ? "page" : undefined}
                    className={[
                      "h-8 w-8 rounded-full text-sm font-medium transition",
                      isActive
                        ? "bg-gradient-to-r from-violet-500 to-pink-400 text-white shadow-[0_8px_18px_rgba(168,85,247,0.25)]"
                        : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-600",
                    ].join(" ")}
                  >
                    {pageNumber}
                  </button>
                );
              })}
              <button
                type="button"
                disabled={safePage === totalPages}
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
