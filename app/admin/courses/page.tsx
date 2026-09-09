"use client";

import {
  BadgeCheck,
  CircleDollarSign,
  Clock3,
  FolderOpen,
  Plus,
  Sparkles,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { PageShell } from "@/components/admin/PageShell";

// Import dữ liệu khóa học nếu cần mở rộng sau này
// import { courses } from "@/data/courses";

type Course = {
  maKhoaHoc: number;
  tenKhoaHoc: string;
  maCode?: string;
  trinhDo?: string;
  moTa?: string;
  tongSoBuoi?: number;
  soTuanHoc?: number;
  hocPhiChuan?: number;
  dangHoatDong?: boolean;
};

const courses: Course[] = [
  {
    maKhoaHoc: 1,
    tenKhoaHoc: "IELTS Foundation",
    maCode: "IELTS-FND",
    trinhDo: "A2-B1",
    moTa: "Khóa học nền tảng cho học viên bắt đầu luyện IELTS.",
    tongSoBuoi: 24,
    soTuanHoc: 12,
    hocPhiChuan: 4200000,
    dangHoatDong: true,
  },
  {
    maKhoaHoc: 2,
    tenKhoaHoc: "Conversation Club",
    maCode: "CONV-CLB",
    trinhDo: "B1-B2",
    moTa: "Rèn kỹ năng giao tiếp thực tế qua các chủ đề đời sống.",
    tongSoBuoi: 16,
    soTuanHoc: 8,
    hocPhiChuan: 2600000,
    dangHoatDong: true,
  },
  {
    maKhoaHoc: 3,
    tenKhoaHoc: "Business English",
    maCode: "BUS-ENG",
    trinhDo: "B2",
    moTa: "Khóa học tiếng Anh thương mại cho môi trường công việc.",
    tongSoBuoi: 20,
    soTuanHoc: 10,
    hocPhiChuan: 3900000,
    dangHoatDong: true,
  },
  {
    maKhoaHoc: 4,
    tenKhoaHoc: "Toeic Intensive",
    maCode: "TOEIC-INT",
    trinhDo: "B1-B2",
    moTa: "Khóa tập trung luyện thi Toeic với đề mô phỏng thực tế.",
    tongSoBuoi: 30,
    soTuanHoc: 15,
    hocPhiChuan: 4800000,
    dangHoatDong: false,
  },
];

const stats = [
  {
    label: "Tổng khóa học",
    value: "4",
    note: "Đang quản lý",
    icon: FolderOpen,
    tone: "from-violet-200 via-violet-100 to-pink-100",
  },
  {
    label: "Đang hoạt động",
    value: "3",
    note: "Khóa học mở",
    icon: BadgeCheck,
    tone: "from-emerald-200 via-emerald-100 to-lime-100",
  },
  {
    label: "Số buổi trung bình",
    value: "22",
    note: "Mỗi khóa",
    icon: Clock3,
    tone: "from-sky-200 via-cyan-100 to-emerald-100",
  },
  {
    label: "Học phí trung bình",
    value: "3.7M",
    note: "Theo khóa",
    icon: CircleDollarSign,
    tone: "from-amber-200 via-yellow-100 to-orange-100",
  },
];

const pageSize = 3;

type CourseForm = {
  tenKhoaHoc: string;
  maCode: string;
  trinhDo: string;
  moTa: string;
  avatarUrl: string;
  tongSoBuoi: string;
  soTuanHoc: string;
  hocPhiChuan: string;
  dangHoatDong: string;
};

const emptyCourseForm: CourseForm = {
  tenKhoaHoc: "",
  maCode: "",
  trinhDo: "",
  moTa: "",
  avatarUrl: "",
  tongSoBuoi: "",
  soTuanHoc: "",
  hocPhiChuan: "",
  dangHoatDong: "true",
};

export default function CourseManagementPage() {
  const [courseList, setCourseList] = useState<Course[]>(courses);
  const [levelFilter, setLevelFilter] = useState("Tất cả trình độ");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [courseForm, setCourseForm] = useState<CourseForm>(emptyCourseForm);
  const levelOptions = useMemo(
    () =>
      Array.from(
        new Set(courseList.map((course) => course.trinhDo).filter(Boolean)),
      ),
    [courseList],
  );
  const filteredCourses = useMemo(
    () =>
      levelFilter === "Tất cả trình độ"
        ? courseList
        : courseList.filter((course) => course.trinhDo === levelFilter),
    [courseList, levelFilter],
  );
  const totalPages = Math.max(1, Math.ceil(filteredCourses.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentCourses = filteredCourses.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleCreateCourse = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!courseForm.tenKhoaHoc.trim()) return;

    const nextCourse: Course = {
      maKhoaHoc:
        Math.max(0, ...courseList.map((course) => course.maKhoaHoc)) + 1,
      tenKhoaHoc: courseForm.tenKhoaHoc.trim(),
      maCode: courseForm.maCode.trim() || undefined,
      trinhDo: courseForm.trinhDo.trim() || undefined,
      moTa: courseForm.moTa.trim() || undefined,
      tongSoBuoi: courseForm.tongSoBuoi
        ? Number(courseForm.tongSoBuoi)
        : undefined,
      soTuanHoc: courseForm.soTuanHoc
        ? Number(courseForm.soTuanHoc)
        : undefined,
      hocPhiChuan: courseForm.hocPhiChuan
        ? Number(courseForm.hocPhiChuan)
        : undefined,
      dangHoatDong: courseForm.dangHoatDong === "true",
    };

    setCourseList((items) => [nextCourse, ...items]);
    setLevelFilter("Tất cả trình độ");
    setCurrentPage(1);
    setCourseForm(emptyCourseForm);
    setIsCreateFormOpen(false);
  };

  return (
    <PageShell
      title="Quản lý khóa học"
      description="Theo dõi danh sách khóa học, mã code, trình độ và học phí của từng chương trình"
      action={
        <button
          type="button"
          onClick={() => setIsCreateFormOpen(true)}
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

      <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            <h3 className="text-xl font-bold text-slate-800">
              Danh sách khóa học
            </h3>
          </div>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
            {filteredCourses.length} khóa học
          </span>
        </div>

        <div className="mb-4 flex items-center gap-3">
          <select
            value={levelFilter}
            onChange={(event) => {
              setLevelFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Lọc theo trình độ"
            className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
          >
            <option>Tất cả trình độ</option>
            {levelOptions.map((level) => (
              <option key={level}>{level}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="px-3 py-2 font-semibold">Tên khóa học</th>
                <th className="px-3 py-2 font-semibold">Mã code</th>
                <th className="px-3 py-2 font-semibold">Trình độ</th>
                <th className="px-3 py-2 text-right font-semibold">
                  Tổng buổi
                </th>
                <th className="px-3 py-2 text-right font-semibold">Số tuần</th>
                <th className="px-3 py-2 text-right font-semibold">Học phí</th>
                <th className="px-3 py-2 font-semibold">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {currentCourses.map((course) => (
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
                  <td className="px-3 py-3">{course.maCode ?? "--"}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredCourses.length && (
            <p className="py-10 text-center text-sm text-slate-400">
              Không tìm thấy khóa học phù hợp.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {currentCourses.length ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + pageSize, filteredCourses.length)} /{" "}
            {filteredCourses.length}
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
            onSubmit={handleCreateCourse}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  CreateKhoaHocRequest
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  Thêm khóa học
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCourseForm(emptyCourseForm);
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
                Mã khóa học
                <input
                  maxLength={20}
                  value={courseForm.maCode}
                  onChange={(event) =>
                    setCourseForm({ ...courseForm, maCode: event.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Trình độ
                <input
                  maxLength={50}
                  value={courseForm.trinhDo}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      trinhDo: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Tổng số buổi
                <input
                  min="1"
                  type="number"
                  value={courseForm.tongSoBuoi}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      tongSoBuoi: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Số tuần học
                <input
                  min="1"
                  type="number"
                  value={courseForm.soTuanHoc}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      soTuanHoc: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
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
              <label className="text-sm font-medium text-slate-600">
                Avatar URL
                <input
                  type="url"
                  value={courseForm.avatarUrl}
                  onChange={(event) =>
                    setCourseForm({
                      ...courseForm,
                      avatarUrl: event.target.value,
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
                  setIsCreateFormOpen(false);
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Thêm khóa học
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
