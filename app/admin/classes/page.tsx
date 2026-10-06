"use client";

import {
  CalendarRange,
  Edit3,
  GraduationCap,
  MapPin,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
  X,
} from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

type ClassRoom = {
  maLop: number;
  maLopCode: string;
  tenLop: string;
  maKhoaHoc: number;
  maGiaoVien?: number | null;
  maPhong?: number | null;
  trangThaiCode: string;
  khoaHoc: string;
  giaoVien: string;
  phong: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
  siSoHienTai: number;
  siSoToiDa?: number;
  trangThai: "Đang diễn ra" | "Sắp khai giảng" | "Đã kết thúc" | "Tạm dừng";
};

type ApiClass = {
  maLop: number;
  maLopCode?: string | null;
  tenLop: string;
  maKhoaHoc?: number;
  maGiaoVien?: number | null;
  maPhong?: number | null;
  avatarUrl?: string | null;
  tenKhoaHoc?: string;
  tenGiaoVien?: string | null;
  tenPhong?: string | null;
  ngayBatDau?: string | null;
  ngayKetThuc?: string | null;
  siSoHienTai?: number | null;
  siSoToiDa?: number | null;
  trangThai?: string | null;
};
type ReferenceOption = { id: number; name: string };
type ListResponse<T> = T[] | { data?: T[] };

const pageSize = 5;
const normalizeSearchText = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .trim();

type ClassForm = {
  maLopCode: string;
  tenLop: string;
  khoaHoc: string;
  giaoVien: string;
  phong: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  siSoToiDa: string;
  trangThai: string;
};

const emptyClassForm: ClassForm = {
  maLopCode: "",
  tenLop: "",
  khoaHoc: "",
  giaoVien: "",
  phong: "",
  ngayBatDau: "",
  ngayKetThuc: "",
  siSoToiDa: "",
  trangThai: "SapKhaiGiang",
};

const statusLabels: Record<string, ClassRoom["trangThai"]> = {
  Huy: "Tạm dừng",
  DaKetThuc: "Đã kết thúc",
  DangHoc: "Đang diễn ra",
  SapKhaiGiang: "Sắp khai giảng",
};

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
  const [classes, setClasses] = useState<ClassRoom[]>([]);
  const [courses, setCourses] = useState<ReferenceOption[]>([]);
  const [teachers, setTeachers] = useState<ReferenceOption[]>([]);
  const [rooms, setRooms] = useState<ReferenceOption[]>([]);
  const [courseFilter, setCourseFilter] = useState("Tất cả khóa học");
  const [statusFilter, setStatusFilter] = useState("Tất cả trạng thái");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [classForm, setClassForm] = useState<ClassForm>(emptyClassForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const refreshClasses = async () => {
    const response = await apiRequest<{ data?: ApiClass[] }>("/LopHoc");
    setClasses((response.data ?? []).map((item) => ({
      maLop: item.maLop,
      maLopCode: item.maLopCode ?? "",
      tenLop: item.tenLop,
      maKhoaHoc: item.maKhoaHoc ?? 0,
      maGiaoVien: item.maGiaoVien,
      maPhong: item.maPhong,
      trangThaiCode: item.trangThai ?? "SapKhaiGiang",
      khoaHoc: item.tenKhoaHoc ?? "Chưa gán khóa học",
      giaoVien: item.tenGiaoVien ?? "Chưa phân công",
      phong: item.tenPhong ?? "Chưa xếp phòng",
      ngayBatDau: item.ngayBatDau ?? undefined,
      ngayKetThuc: item.ngayKetThuc ?? undefined,
      siSoHienTai: item.siSoHienTai ?? 0,
      siSoToiDa: item.siSoToiDa ?? undefined,
      trangThai: statusLabels[item.trangThai ?? ""] ?? "Sắp khai giảng",
    })));
  };

  useEffect(() => {
    void Promise.all([
      apiRequest<{ data?: ApiClass[] }>("/LopHoc"),
      apiRequest<ListResponse<{ maKhoaHoc: number; tenKhoaHoc: string }>>("/KhoaHoc"),
      apiRequest<ListResponse<{ maGiaoVien: number; hoTen: string }>>("/GiaoVien"),
      apiRequest<ListResponse<{ maPhong: number; tenPhong: string }>>("/PhongHoc"),
    ])
      .then(([classResponse, courseResponse, teacherResponse, roomResponse]) => {
        setClasses((classResponse.data ?? []).map((item) => ({
          maLop: item.maLop,
          maLopCode: item.maLopCode ?? "",
          tenLop: item.tenLop,
          maKhoaHoc: item.maKhoaHoc ?? 0,
          maGiaoVien: item.maGiaoVien,
          maPhong: item.maPhong,
          trangThaiCode: item.trangThai ?? "SapKhaiGiang",
          khoaHoc: item.tenKhoaHoc ?? "Chưa gán khóa học",
          giaoVien: item.tenGiaoVien ?? "Chưa phân công",
          phong: item.tenPhong ?? "Chưa xếp phòng",
          ngayBatDau: item.ngayBatDau ?? undefined,
          ngayKetThuc: item.ngayKetThuc ?? undefined,
          siSoHienTai: item.siSoHienTai ?? 0,
          siSoToiDa: item.siSoToiDa ?? undefined,
          trangThai: statusLabels[item.trangThai ?? ""] ?? "Sắp khai giảng",
        })));
        const coursesList = Array.isArray(courseResponse) ? courseResponse : courseResponse.data ?? [];
        const teachersList = Array.isArray(teacherResponse) ? teacherResponse : teacherResponse.data ?? [];
        const roomsList = Array.isArray(roomResponse) ? roomResponse : roomResponse.data ?? [];
        setCourses(coursesList.map((item) => ({ id: item.maKhoaHoc, name: item.tenKhoaHoc })));
        setTeachers(teachersList.map((item) => ({ id: item.maGiaoVien, name: item.hoTen })));
        setRooms(roomsList.map((item) => ({ id: item.maPhong, name: item.tenPhong })));
      })
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : "Không tải được dữ liệu lớp học."))
      .finally(() => setIsLoading(false));
  }, []);

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
        (item) => {
          const keyword = normalizeSearchText(searchTerm);
          const matchesSearch =
            !keyword ||
            [
              item.maLopCode,
              item.tenLop,
              item.khoaHoc,
              item.giaoVien,
              item.phong,
              item.trangThai,
              item.ngayBatDau ?? "",
              String(item.maLop),
            ].some((value) => normalizeSearchText(value).includes(keyword));

          return matchesSearch &&
          (courseFilter === "Tất cả khóa học" ||
            item.khoaHoc === courseFilter) &&
          (statusFilter === "Tất cả trạng thái" ||
            item.trangThai === statusFilter);
        },
      ),
    [classes, courseFilter, searchTerm, statusFilter],
  );
  const totalPages = Math.max(1, Math.ceil(filteredClasses.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentClasses = filteredClasses.slice(
    startIndex,
    startIndex + pageSize,
  );

  const stats = [
    { label: "Tổng lớp học", value: classes.length.toLocaleString("vi-VN"), note: "Đang quản lý", icon: GraduationCap, tone: "from-violet-200 via-violet-100 to-pink-100" },
    { label: "Đang diễn ra", value: classes.filter((item) => item.trangThai === "Đang diễn ra").length.toLocaleString("vi-VN"), note: "Lớp hoạt động", icon: Sparkles, tone: "from-emerald-200 via-emerald-100 to-lime-100" },
    { label: "Sĩ số hiện tại", value: classes.reduce((sum, item) => sum + item.siSoHienTai, 0).toLocaleString("vi-VN"), note: "Học viên đang học", icon: Users, tone: "from-sky-200 via-cyan-100 to-emerald-100" },
    { label: "Sắp khai giảng", value: classes.filter((item) => item.trangThai === "Sắp khai giảng").length.toLocaleString("vi-VN"), note: "Lớp sắp mở", icon: CalendarRange, tone: "from-amber-200 via-yellow-100 to-orange-100" },
  ];

  const openEditClassForm = (item: ClassRoom) => {
    setEditingClass(item);
    setClassForm({
      maLopCode: item.maLopCode,
      tenLop: item.tenLop,
      khoaHoc: String(item.maKhoaHoc || ""),
      giaoVien: item.maGiaoVien ? String(item.maGiaoVien) : "",
      phong: item.maPhong ? String(item.maPhong) : "",
      ngayBatDau: item.ngayBatDau?.slice(0, 10) ?? "",
      ngayKetThuc: item.ngayKetThuc?.slice(0, 10) ?? "",
      siSoToiDa: item.siSoToiDa?.toString() ?? "",
      trangThai: item.trangThaiCode,
    });
    setErrorMessage("");
    setIsCreateFormOpen(true);
  };

  const closeClassForm = () => {
    setClassForm(emptyClassForm);
    setEditingClass(null);
    setIsCreateFormOpen(false);
  };

  const handleSaveClass = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setErrorMessage("");
    try {
      await apiRequest(editingClass ? `/LopHoc/${editingClass.maLop}` : "/LopHoc", {
        method: editingClass ? "PUT" : "POST",
        body: {
          maLopCode: editingClass ? classForm.maLopCode.trim() : `CLS-${Date.now()}`,
          tenLop: classForm.tenLop.trim(),
          maKhoaHoc: Number(classForm.khoaHoc),
          maGiaoVien: classForm.giaoVien ? Number(classForm.giaoVien) : null,
          maPhong: classForm.phong ? Number(classForm.phong) : null,
          ngayBatDau: classForm.ngayBatDau || null,
          ngayKetThuc: classForm.ngayKetThuc || null,
          siSoToiDa: classForm.siSoToiDa ? Number(classForm.siSoToiDa) : null,
          trangThai: classForm.trangThai,
        },
      });
      await refreshClasses();
      setCourseFilter("Tất cả khóa học");
      setStatusFilter("Tất cả trạng thái");
      setCurrentPage(1);
      closeClassForm();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể lưu lớp học.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteClass = async (item: ClassRoom) => {
    if (!window.confirm(`Bạn có chắc muốn xóa lớp "${item.tenLop}"?`)) return;
    setErrorMessage("");
    try {
      await apiRequest(`/LopHoc/${item.maLop}`, { method: "DELETE" });
      await refreshClasses();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể xóa lớp học.");
    }
  };

  return (
    <PageShell
      title="Quản lý lớp học"
      description="Theo dõi tiến độ, giáo viên, phòng học và trạng thái của từng lớp học trong hệ thống"
      action={
        <button
            type="button"
            onClick={() => {
              setEditingClass(null);
              setClassForm(emptyClassForm);
              setIsCreateFormOpen(true);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]"
          >
            <Plus className="h-4 w-4" />
            Thêm lớp học
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
              Danh sách lớp học
            </h3>
          </div>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
            {filteredClasses.length} lớp học
          </span>
        </div>

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <span className="sr-only">Tìm kiếm lớp học</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo mã lớp, tên lớp, khóa học, giáo viên hoặc phòng..."
              className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-300"
            />
          </label>
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
                <th className="px-3 py-2 text-right font-semibold">Sĩ số hiện tại / tối đa</th>
                <th className="px-3 py-2 font-semibold">Trạng thái</th>
                <th className="px-3 py-2 font-semibold text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-slate-500">Đang tải lớp học...</td></tr>
              ) : currentClasses.map((item) => (
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
                    {item.siSoHienTai.toLocaleString("vi-VN")} / {item.siSoToiDa?.toLocaleString("vi-VN") ?? "--"}
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
                        onClick={() => openEditClassForm(item)}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                        aria-label={`Cập nhật lớp ${item.tenLop}`}
                        title="Cập nhật"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => void handleDeleteClass(item)}
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
            onSubmit={handleSaveClass}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  {editingClass ? "UpdateLopHocRequest" : "CreateLopHocRequest"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {editingClass ? "Cập nhật lớp học" : "Thêm lớp học"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeClassForm}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng biểu mẫu lớp học"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {editingClass && (
                <label className="text-sm font-medium text-slate-600">
                  Mã lớp
                  <input
                    required
                    maxLength={30}
                    value={classForm.maLopCode}
                    onChange={(event) =>
                      setClassForm({ ...classForm, maLopCode: event.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                  />
                </label>
              )}
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
                Khóa học
                <select
                  required
                  value={classForm.khoaHoc}
                  onChange={(event) =>
                    setClassForm({ ...classForm, khoaHoc: event.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                >
                  <option value="">Chọn khóa học</option>
                  {courses.map((course) => <option key={course.id} value={course.id}>{course.name}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Giáo viên
                <select
                  value={classForm.giaoVien}
                  onChange={(event) =>
                    setClassForm({ ...classForm, giaoVien: event.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                >
                  <option value="">Chưa phân công</option>
                  {teachers.map((teacher) => <option key={teacher.id} value={teacher.id}>{teacher.name}</option>)}
                </select>
              </label>
              <label className="text-sm font-medium text-slate-600">
                Phòng học
                <select
                  value={classForm.phong}
                  onChange={(event) =>
                    setClassForm({ ...classForm, phong: event.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none focus:border-violet-300"
                >
                  <option value="">Chưa xếp phòng</option>
                  {rooms.map((room) => <option key={room.id} value={room.id}>{room.name}</option>)}
                </select>
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
                onClick={closeClassForm}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving || !courses.length}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:opacity-50"
              >
                {isSaving ? "Đang lưu..." : editingClass ? "Lưu cập nhật" : "Thêm lớp học"}
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
