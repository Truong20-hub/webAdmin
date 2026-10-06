"use client";

import {
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  Edit3,
  FolderOpen,
  Plus,
  Search,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

// Import dữ liệu khóa học nếu cần mở rộng sau này
// import { courses } from "@/data/courses";

type Course = {
  maKhoaHoc: number;
  tenKhoaHoc: string;
  trinhDo?: string;
  moTa?: string;
  tongSoBuoi?: number;
  soTuanHoc?: number;
  hocPhiChuan?: number;
  dangHoatDong?: boolean;
};

const pageSize = 3;
const levelOptions = [
  ...["A1", "A2", "B1", "B2"].map((level) => ({ value: level, label: level })),
  ...Array.from({ length: 13 }, (_, index) => {
    const band = (3 + index * 0.5).toFixed(1);
    return { value: `IELTS ${band}`, label: `IELTS ${band}` };
  }),
  { value: "TOEIC <120 (dưới A1)", label: "TOEIC <120 (dưới A1)" },
  { value: "TOEIC 120-224 (A1)", label: "TOEIC 120-224 (A1)" },
  { value: "TOEIC 225-549 (A2)", label: "TOEIC 225-549 (A2)" },
  { value: "TOEIC 550-784 (B1)", label: "TOEIC 550-784 (B1)" },
  { value: "TOEIC 785-944 (B2)", label: "TOEIC 785-944 (B2)" },
  { value: "TOEIC 945-990 (C1)", label: "TOEIC 945-990 (C1)" },
];

type CourseForm = {
  tenKhoaHoc: string;
  trinhDo: string;
  moTa: string;
  tongSoBuoi: string;
  soBuoiMoiTuan: string;
  soTuanHoc: string;
  hocPhiChuan: string;
  dangHoatDong: string;
};

const emptyCourseForm: CourseForm = {
  tenKhoaHoc: "",
  trinhDo: "",
  moTa: "",
  tongSoBuoi: "",
  soBuoiMoiTuan: "",
  soTuanHoc: "",
  hocPhiChuan: "",
  dangHoatDong: "true",
};

const getWeeksFromSessions = (totalSessions: string, sessionsPerWeek: string) => {
  const total = Number(totalSessions);
  const weekly = Number(sessionsPerWeek);
  return total > 0 && weekly > 0 ? String(Math.ceil(total / weekly)) : "";
};

export default function CourseManagementPage() {
  const [courseList, setCourseList] = useState<Course[]>([]);
  const [levelFilter, setLevelFilter] = useState("Tất cả trình độ");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourseForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const data = await apiRequest<Course[]>("/KhoaHoc");
      setCourseList(data);
      return true;
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không tải được khóa học.");
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void apiRequest<Course[]>("/KhoaHoc")
      .then(setCourseList)
      .catch((error: unknown) => {
        setErrorMessage(error instanceof Error ? error.message : "Không tải được khóa học.");
      })
      .finally(() => setIsLoading(false));
  }, []);

  const filteredCourses = useMemo(
    () =>
      levelFilter === "Tất cả trình độ"
        ? courseList
        : courseList.filter((course) => course.trinhDo === levelFilter),
    [courseList, levelFilter],
  );
  const visibleCourses = useMemo(() => {
    const keyword = searchTerm.trim().toLocaleLowerCase("vi");
    if (!keyword) return filteredCourses;
    return filteredCourses.filter((course) =>
      [course.tenKhoaHoc, course.trinhDo, course.moTa]
        .some((value) => value?.toLocaleLowerCase("vi").includes(keyword)),
    );
  }, [filteredCourses, searchTerm]);
  const totalPages = Math.max(1, Math.ceil(visibleCourses.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentCourses = visibleCourses.slice(
    startIndex,
    startIndex + pageSize,
  );

  const stats = [
    {
      label: "Tổng khóa học",
      value: courseList.length.toLocaleString("vi-VN"),
      note: "Đang quản lý",
      icon: FolderOpen,
      tone: "from-violet-200 via-violet-100 to-pink-100",
    },
    {
      label: "Đang hoạt động",
      value: courseList.filter((course) => course.dangHoatDong).length.toLocaleString("vi-VN"),
      note: "Khóa học mở",
      icon: BadgeCheck,
      tone: "from-emerald-200 via-emerald-100 to-lime-100",
    },
    {
      label: "Số buổi trung bình",
      value: courseList.length
        ? Math.round(courseList.reduce((sum, course) => sum + (course.tongSoBuoi ?? 0), 0) / courseList.length).toLocaleString("vi-VN")
        : "0",
      note: "Mỗi khóa",
      icon: Clock3,
      tone: "from-sky-200 via-cyan-100 to-emerald-100",
    },
    {
      label: "Học phí trung bình",
      value: courseList.length
        ? `${Math.round(courseList.reduce((sum, course) => sum + (course.hocPhiChuan ?? 0), 0) / courseList.length).toLocaleString("vi-VN")}đ`
        : "0đ",
      note: "Theo khóa",
      icon: CircleDollarSign,
      tone: "from-amber-200 via-yellow-100 to-orange-100",
    },
  ];

  const openCreateForm = () => {
    setEditingCourse(null);
    setCourseForm(emptyCourseForm);
    setErrorMessage("");
    setIsCreateFormOpen(true);
  };

  const openEditForm = (course: Course) => {
    const totalSessions = course.tongSoBuoi?.toString() ?? "";
    const existingWeeks = course.soTuanHoc ?? 0;
    const existingSessionsPerWeek =
      existingWeeks > 0 && course.tongSoBuoi
        ? course.tongSoBuoi / existingWeeks
        : 0;
    const sessionsPerWeek =
      Number.isInteger(existingSessionsPerWeek) &&
      existingSessionsPerWeek >= 1 &&
      existingSessionsPerWeek <= 7
        ? String(existingSessionsPerWeek)
        : "";
    setEditingCourse(course);
    setCourseForm({
      tenKhoaHoc: course.tenKhoaHoc,
      trinhDo: levelOptions.some((level) => level.value === course.trinhDo)
        ? course.trinhDo ?? ""
        : "",
      moTa: course.moTa ?? "",
      tongSoBuoi: totalSessions,
      soBuoiMoiTuan: sessionsPerWeek,
      soTuanHoc: sessionsPerWeek
        ? getWeeksFromSessions(totalSessions, sessionsPerWeek)
        : existingWeeks.toString(),
      hocPhiChuan: course.hocPhiChuan?.toString() ?? "",
      dangHoatDong: course.dangHoatDong == null ? "null" : String(course.dangHoatDong),
    });
    setErrorMessage("");
    setIsCreateFormOpen(true);
  };

  const handleSaveCourse = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    try {
      await apiRequest(editingCourse ? `/KhoaHoc/${editingCourse.maKhoaHoc}` : "/KhoaHoc", {
        method: editingCourse ? "PUT" : "POST",
        body: {
          tenKhoaHoc: courseForm.tenKhoaHoc.trim(),
          trinhDo: courseForm.trinhDo.trim() || null,
          moTa: courseForm.moTa.trim() || null,
          tongSoBuoi: courseForm.tongSoBuoi ? Number(courseForm.tongSoBuoi) : null,
          soTuanHoc: courseForm.soTuanHoc ? Number(courseForm.soTuanHoc) : null,
          hocPhiChuan: courseForm.hocPhiChuan ? Number(courseForm.hocPhiChuan) : null,
          dangHoatDong: courseForm.dangHoatDong === "null" ? null : courseForm.dangHoatDong === "true",
        },
      });
      const reloaded = await loadCourses();
      if (!reloaded) return;
      setLevelFilter("Tất cả trình độ");
      setCurrentPage(1);
      setCourseForm(emptyCourseForm);
      setEditingCourse(null);
      setIsCreateFormOpen(false);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể tạo khóa học.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCourse = async (course: Course) => {
    if (!window.confirm(`Bạn có chắc muốn xóa khóa học "${course.tenKhoaHoc}"?`)) return;
    setErrorMessage("");
    try {
      await apiRequest(`/KhoaHoc/${course.maKhoaHoc}`, { method: "DELETE" });
      await loadCourses();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể xóa khóa học.");
    }
  };

  return (
    <PageShell
      title="Quản lý khóa học"
      description="Theo dõi danh sách khóa học, trình độ và học phí của từng chương trình"
      action={
        <button
          type="button"
          onClick={openCreateForm}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]"
        >
          <Plus className="h-4 w-4" />
          Thêm khóa học
        </button>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, note, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tone}`}
              >
                <Icon className="h-5 w-5 text-slate-700" />
              </div>
              <span className="text-xs text-violet-500">{note}</span>
            </div>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {errorMessage}
        </div>
      )}

      <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <h3 className="text-xl font-bold text-slate-800">
              Danh sách khóa học
            </h3>
          </div>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
            {visibleCourses.length} khóa học
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <label className="relative block flex-1">
            <span className="sr-only">Tìm kiếm khóa học</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên, trình độ hoặc mô tả..."
              className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-300"
            />
          </label>
          <select
            value={levelFilter}
            onChange={(event) => {
              setLevelFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Lọc theo trình độ"
            className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
          >
            <option value="Tất cả trình độ">Tất cả trình độ</option>
            {levelOptions.map((level) => (
              <option key={level.value} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="px-3 py-2 font-semibold">Tên khóa học</th>
                <th className="px-3 py-2 font-semibold">Trình độ</th>
                <th className="px-3 py-2 text-right font-semibold">
                  Tổng buổi
                </th>
                <th className="px-3 py-2 text-right font-semibold">Số tuần</th>
                <th className="px-3 py-2 text-right font-semibold">Học phí</th>
                <th className="px-3 py-2 font-semibold">Trạng thái</th>
                <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-slate-500">Đang tải khóa học...</td></tr>
              ) : currentCourses.map((course) => (
                <tr
                  key={course.maKhoaHoc}
                  className="rounded-2xl bg-slate-50 text-sm text-slate-700 shadow-sm"
                >
                  <td className="rounded-l-2xl px-3 py-3">
                    <div className="font-medium text-slate-700">
                      {course.tenKhoaHoc}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {course.moTa}
                    </div>
                  </td>
                  <td className="px-3 py-3">{course.trinhDo ?? "--"}</td>
                  <td className="px-3 py-3 text-right">
                    {course.tongSoBuoi ?? "--"}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {course.soTuanHoc ?? "--"}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {course.hocPhiChuan != null
                      ? `${course.hocPhiChuan.toLocaleString("vi-VN")}đ`
                      : "--"}
                  </td>
                  <td className="rounded-r-2xl px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                        course.dangHoatDong
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {course.dangHoatDong ? "Đang hoạt động" : "Ngừng"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    <button
                      type="button"
                      onClick={() => openEditForm(course)}
                      className="rounded-lg p-2 text-violet-600 transition hover:bg-violet-50"
                      aria-label={`Sửa khóa học ${course.tenKhoaHoc}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDeleteCourse(course)}
                      className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50"
                      aria-label={`Xóa khóa học ${course.tenKhoaHoc}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!isLoading && !visibleCourses.length && (
            <p className="py-10 text-center text-sm text-slate-400">
              Không tìm thấy khóa học phù hợp.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {currentCourses.length ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + pageSize, visibleCourses.length)} /{" "}
            {visibleCourses.length}
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
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {isCreateFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4">
          <form
            onSubmit={handleSaveCourse}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  {editingCourse ? "Cập nhật khóa học" : "Tạo khóa học"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {editingCourse ? "Cập nhật khóa học" : "Thêm khóa học"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseForm(emptyCourseForm);
                  setEditingCourse(null);
                  setIsCreateFormOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng form thêm khóa học"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-600 sm:col-span-2">
                Tên khóa học
                <input
                  required
                  maxLength={150}
                  value={courseForm.tenKhoaHoc}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      tenKhoaHoc: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Trình độ
                <select
                  required
                  value={courseForm.trinhDo}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      trinhDo: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                >
                  <option value="" disabled>Chọn trình độ</option>
                  {levelOptions.map((level) => (
                    <option key={level.value} value={level.value}>{level.label}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Tổng số buổi
                <input
                  min="1"
                  type="number"
                  value={courseForm.tongSoBuoi}
                  onChange={(event) => {
                    const tongSoBuoi = event.target.value;
                    setCourseForm((form) => ({
                      ...form,
                      tongSoBuoi,
                      soTuanHoc: getWeeksFromSessions(tongSoBuoi, form.soBuoiMoiTuan),
                    }));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Số buổi mỗi tuần
                <select
                  value={courseForm.soBuoiMoiTuan}
                  onChange={(event) => {
                    const soBuoiMoiTuan = event.target.value;
                    setCourseForm((form) => ({
                      ...form,
                      soBuoiMoiTuan,
                      soTuanHoc: getWeeksFromSessions(form.tongSoBuoi, soBuoiMoiTuan),
                    }));
                  }}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                >
                  <option value="">Chọn số buổi/tuần</option>
                  {Array.from({ length: 7 }, (_, index) => index + 1).map((count) => (
                    <option key={count} value={count}>{count} buổi/tuần</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Số tuần học
                <input
                  min="1"
                  type="number"
                  readOnly
                  value={courseForm.soTuanHoc}
                  placeholder="Tự tính khi có tổng buổi và buổi/tuần"
                  className="mt-1.5 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 py-2.5 font-normal text-slate-700 outline-none"
                />
                <span className="mt-1 block text-xs font-normal text-slate-500">
                  Tự tính bằng tổng số buổi chia cho số buổi mỗi tuần, làm tròn lên.
                </span>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Học phí chuẩn
                <input
                  min="0"
                  step="0.01"
                  type="number"
                  value={courseForm.hocPhiChuan}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      hocPhiChuan: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600 sm:col-span-2">
                Mô tả
                <textarea
                  value={courseForm.moTa}
                  onChange={(event) =>
                    setCourseForm({ ...courseForm, moTa: event.target.value })
                  }
                  rows={3}
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Đang hoạt động
                <select
                  value={courseForm.dangHoatDong}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      dangHoatDong: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                >
                  <option value="true">Có</option>
                  <option value="false">Không</option>
                  <option value="null">Chưa cập nhật</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setCourseForm(emptyCourseForm);
                  setEditingCourse(null);
                  setIsCreateFormOpen(false);
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {isSaving ? "Đang lưu..." : editingCourse ? "Lưu thay đổi" : "Thêm khóa học"}
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
