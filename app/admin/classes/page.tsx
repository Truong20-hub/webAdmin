"use client";

import {
  CalendarRange,
  Eye,
  FileUp,
  GraduationCap,
  MapPin,
  PencilLine,
  Plus,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useMemo, useState } from "react";
import { PageShell } from "@/components/admin/PageShell";

type ClassRoom = {
  maLop: number;
  maLopCode: string;
  tenLop: string;
  khoaHoc: string;
  giaoVien: string;
  phong: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  siSoToiDa?: number;
  trangThai: "Đang diễn ra" | "Sắp khai giảng" | "Đã kết thúc" | "Tạm dừng";
};

const classList: ClassRoom[] = [
  {
    maLop: 101,
    maLopCode: "IELTS-101",
    tenLop: "IELTS Intensive 1",
    khoaHoc: "IELTS Foundation",
    giaoVien: "Ms. An Ngọc",
    phong: "P.201",
    ngayBatDau: "2026-08-10",
    ngayKetThuc: "2026-10-20",
    siSoToiDa: 18,
    trangThai: "Đang diễn ra",
  },
  {
    maLop: 102,
    maLopCode: "CONV-102",
    tenLop: "Conversation Club A",
    khoaHoc: "Conversation Club",
    giaoVien: "Mr. Dũng Vũ",
    phong: "P.104",
    ngayBatDau: "2026-08-15",
    ngayKetThuc: "2026-09-30",
    siSoToiDa: 16,
    trangThai: "Đang diễn ra",
  },
  {
    maLop: 103,
    maLopCode: "BUS-103",
    tenLop: "Business English Starter",
    khoaHoc: "Business English",
    giaoVien: "Ms. Minh Hạnh",
    phong: "P.305",
    ngayBatDau: "2026-09-05",
    ngayKetThuc: "2026-11-15",
    siSoToiDa: 20,
    trangThai: "Sắp khai giảng",
  },
  {
    maLop: 104,
    maLopCode: "TOEIC-104",
    tenLop: "Toeic Intensive 2",
    khoaHoc: "Toeic Intensive",
    giaoVien: "Mr. Huyền Nam",
    phong: "P.402",
    ngayBatDau: "2026-06-01",
    ngayKetThuc: "2026-07-25",
    siSoToiDa: 22,
    trangThai: "Đã kết thúc",
  },
  {
    maLop: 105,
    maLopCode: "KIDS-105",
    tenLop: "Kids English Explorer",
    khoaHoc: "Kids English",
    giaoVien: "Ms. Lan Anh",
    phong: "P.108",
    ngayBatDau: "2026-08-12",
    ngayKetThuc: "2026-12-05",
    siSoToiDa: 14,
    trangThai: "Tạm dừng",
  },
];

const pageSize = 5;

type ClassForm = {
  maLopCode: string;
  tenLop: string;
  maKhoaHoc: string;
  maGiaoVien: string;
  maPhong: string;
  avatarUrl: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  siSoToiDa: string;
  trangThai: string;
};

const emptyClassForm: ClassForm = {
  maLopCode: "",
  tenLop: "",
  maKhoaHoc: "",
  maGiaoVien: "",
  maPhong: "",
  avatarUrl: "",
  ngayBatDau: "",
  ngayKetThuc: "",
  siSoToiDa: "",
  trangThai: "SapKhaiGiang",
};

const stats = [
  {
    label: "Tổng lớp học",
    value: "5",
    note: "Đang quản lý",
    icon: GraduationCap,
    tone: "from-violet-200 via-violet-100 to-pink-100",
  },
  {
    label: "Đang diễn ra",
    value: "2",
    note: "Lớp hoạt động",
    icon: Sparkles,
    tone: "from-emerald-200 via-emerald-100 to-lime-100",
  },
  {
    label: "Sĩ số trung bình",
    value: "18",
    note: "Học viên / lớp",
    icon: Users,
    tone: "from-sky-200 via-cyan-100 to-emerald-100",
  },
  {
    label: "Sắp khai giảng",
    value: "1",
    note: "Trong tháng",
    icon: CalendarRange,
    tone: "from-amber-200 via-yellow-100 to-orange-100",
  },
];

const getInitials = (value: string) =>
  value
    .split(/[-\s]/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("") || "LH";

const getStatusTone = (status: ClassRoom["trangThai"]) => {
  switch (status) {
    case "Đang diễn ra":
      return "bg-emerald-50 text-emerald-600";
    case "Sắp khai giảng":
      return "bg-amber-50 text-amber-600";
    case "Đã kết thúc":
      return "bg-slate-200 text-slate-600";
    case "Tạm dừng":
      return "bg-rose-50 text-rose-600";
    default:
      return "bg-violet-50 text-violet-600";
  }
};

export default function ClassManagementPage() {
  const [classes, setClasses] = useState<ClassRoom[]>(classList);
  const [courseFilter, setCourseFilter] = useState("Tất cả khóa học");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [classForm, setClassForm] = useState<ClassForm>(emptyClassForm);

  const courseOptions = useMemo(
    () => Array.from(new Set(classes.map((item) => item.khoaHoc))),
    [classes],
  );
  const statusOptions = useMemo(
    () => Array.from(new Set(classes.map((item) => item.trangThai))),
    [classes],
  );
  const filteredClasses = useMemo(
    () =>
      classes.filter(
        (item) =>
          (courseFilter === "Tất cả khóa học" ||
            item.khoaHoc === courseFilter) &&
          (statusFilter === "Tất cả trạng thái" ||
            item.trangThai === statusFilter),
      ),
    [classes, courseFilter, statusFilter],
  );
  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentClasses = filteredClasses.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleCreateClass = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const statusLabels: Record<string, ClassRoom["trangThai"]> = {
      Huy: "Tạm dừng",
      DaKetThuc: "Đã kết thúc",
      DangHoc: "Đang diễn ra",
      SapKhaiGiang: "Sắp khai giảng",
    };
    const nextId = Math.max(0, ...classes.map((item) => item.maLop)) + 1;

    setClasses((items) => [
      {
        maLop: nextId,
        maLopCode: classForm.maLopCode.trim(),
        tenLop: classForm.tenLop.trim(),
        khoaHoc: `Khóa học #${classForm.maKhoaHoc}`,
        giaoVien: classForm.maGiaoVien
          ? `Giáo viên #${classForm.maGiaoVien}`
          : "Chưa phân công",
        phong: classForm.maPhong
          ? `Phòng #${classForm.maPhong}`
          : "Chưa xếp phòng",
        ngayBatDau: classForm.ngayBatDau || undefined,
        ngayKetThuc: classForm.ngayKetThuc || undefined,
        siSoToiDa: classForm.siSoToiDa
          ? Number(classForm.siSoToiDa)
          : undefined,
        trangThai: statusLabels[classForm.trangThai] ?? "Sắp khai giảng",
      },
      ...items,
    ]);
    setCourseFilter("Tất cả khóa học");
    setStatusFilter("Tất cả trạng thái");
    setCurrentPage(1);
    setClassForm(emptyClassForm);
    setIsCreateFormOpen(false);
  };

  return (
    <PageShell
      title="Quản lý lớp học"
      description="Theo dõi tiến độ, giáo viên, phòng học và trạng thái của từng lớp học trong hệ thống"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-600 shadow-sm transition hover:bg-violet-50">
            <FileUp className="h-4 w-4" />
            Import Excel
          </button>
          <button
            type="button"
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]"
          >
            <Plus className="h-4 w-4" />
            Thêm lớp học
          </button>
        </div>
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
              Danh sách lớp học
            </h3>
          </div>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
            {filteredClasses.length} lớp học
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <select
            value={courseFilter}
            onChange={(event) => {
              setCourseFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Lọc theo khóa học"
            className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
          >
            <option>Tất cả khóa học</option>
            {courseOptions.map((course) => (
              <option key={course}>{course}</option>
            ))}
          </select>
          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setCurrentPage(1);
            }}
            aria-label="Lọc theo trạng thái"
            className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
          >
            <option>Tất cả trạng thái</option>
            {statusOptions.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="px-3 py-2 font-semibold">Lớp học</th>
                <th className="px-3 py-2 font-semibold">Khóa học</th>
                <th className="px-3 py-2 font-semibold">Giáo viên</th>
                <th className="px-3 py-2 font-semibold">Phòng</th>
                <th className="px-3 py-2 font-semibold">Ngày khai giảng</th>
                <th className="px-3 py-2 text-right font-semibold">Sĩ số</th>
                <th className="px-3 py-2 font-semibold">Trạng thái</th>
                <th className="px-3 py-2 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentClasses.map((item) => (
                <tr
                  key={item.maLop}
                  className="rounded-2xl bg-slate-50 text-sm text-slate-700 shadow-sm"
                >
                  <td className="rounded-l-2xl px-3 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 via-pink-100 to-emerald-100 text-xs font-bold text-violet-700">
                        {getInitials(item.tenLop)}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-800">
                          {item.tenLop}
                        </div>
                        <div className="mt-1 text-xs text-slate-500">
                          {item.maLopCode}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">{item.khoaHoc}</td>
                  <td className="px-3 py-3">{item.giaoVien}</td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                      <MapPin className="h-3 w-3" />
                      {item.phong}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {item.ngayBatDau ? (
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <CalendarRange className="h-3.5 w-3.5 text-violet-500" />
                        {new Date(item.ngayBatDau).toLocaleDateString("vi-VN")}
                      </span>
                    ) : (
                      "--"
                    )}
                  </td>
                  <td className="px-3 py-3 text-right">
                    {item.siSoToiDa ? `${item.siSoToiDa} học viên` : "--"}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${getStatusTone(item.trangThai)}`}
                    >
                      {item.trangThai}
                    </span>
                  </td>
                  <td className="rounded-r-2xl px-3 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                        aria-label="Xem lớp học"
                        title="View"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-50 text-amber-600 transition hover:bg-amber-100"
                        aria-label="Cập nhật lớp học"
                        title="Update"
                      >
                        <PencilLine className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-50 text-rose-600 transition hover:bg-rose-100"
                        aria-label="Xóa lớp học"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!filteredClasses.length && (
            <p className="py-10 text-center text-sm text-slate-400">
              Không tìm thấy lớp học phù hợp.
            </p>
          )}
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {currentClasses.length ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + pageSize, filteredClasses.length)} /{" "}
            {filteredClasses.length}
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
            onSubmit={handleCreateClass}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  CreateLopHocRequest
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  Thêm lớp học
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setClassForm(emptyClassForm);
                  setIsCreateFormOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng form thêm lớp học"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-600">
                Mã lớp
                <input
                  required
                  maxLength={30}
                  value={classForm.maLopCode}
                  onChange={(event) =>
                    setClassForm({
                      ...classForm,
                      maLopCode: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Tên lớp
                <input
                  required
                  maxLength={150}
                  value={classForm.tenLop}
                  onChange={(event) =>
                    setClassForm({ ...classForm, tenLop: event.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Mã khóa học
                <input
                  required
                  min="1"
                  type="number"
                  value={classForm.maKhoaHoc}
                  onChange={(event) =>
                    setClassForm({
                      ...classForm,
                      maKhoaHoc: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Mã giáo viên
                <input
                  type="number"
                  min="1"
                  value={classForm.maGiaoVien}
                  onChange={(event) =>
                    setClassForm({
                      ...classForm,
                      maGiaoVien: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Mã phòng
                <input
                  type="number"
                  min="1"
                  value={classForm.maPhong}
                  onChange={(event) =>
                    setClassForm({ ...classForm, maPhong: event.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Avatar URL
                <input
                  type="url"
                  maxLength={500}
                  value={classForm.avatarUrl}
                  onChange={(event) =>
                    setClassForm({
                      ...classForm,
                      avatarUrl: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Ngày bắt đầu
                <input
                  type="date"
                  value={classForm.ngayBatDau}
                  onChange={(event) =>
                    setClassForm({
                      ...classForm,
                      ngayBatDau: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Ngày kết thúc
                <input
                  type="date"
                  min={classForm.ngayBatDau || undefined}
                  value={classForm.ngayKetThuc}
                  onChange={(event) =>
                    setClassForm({
                      ...classForm,
                      ngayKetThuc: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Sĩ số tối đa
                <input
                  min="1"
                  type="number"
                  value={classForm.siSoToiDa}
                  onChange={(event) =>
                    setClassForm({
                      ...classForm,
                      siSoToiDa: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                />
              </label>
              <label className="text-sm font-medium text-slate-600">
                Trạng thái
                <select
                  value={classForm.trangThai}
                  onChange={(event) =>
                    setClassForm({
                      ...classForm,
                      trangThai: event.target.value,
                    })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                >
                  <option value="Huy">Hủy</option>
                  <option value="DaKetThuc">Đã kết thúc</option>
                  <option value="DangHoc">Đang học</option>
                  <option value="SapKhaiGiang">Sắp khai giảng</option>
                </select>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setClassForm(emptyClassForm);
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
                Thêm lớp học
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
