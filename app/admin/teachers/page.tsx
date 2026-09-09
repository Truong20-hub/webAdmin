"use client";

import {
  BookMarked,
  CalendarRange,
  Eye,
  FileUp,
  Pencil,
  Plus,
  Presentation,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { PageShell } from "@/components/admin/PageShell";

type Teacher = {
  hoTen: string;
  gioiTinh: string;
  soDienThoai: string;
  email: string;
  chuyenMon: string;
  trangThai: "Đang dạy" | "Nghỉ";
};

const initialTeachers: Teacher[] = [
  {
    hoTen: "Nguyễn Thị Lan",
    gioiTinh: "Nữ",
    soDienThoai: "0901234567",
    email: "lannguyen@gmail.com",
    chuyenMon: "IELTS Writing",
    trangThai: "Đang dạy",
  },
  {
    hoTen: "Trần Văn Nam",
    gioiTinh: "Nam",
    soDienThoai: "0912345678",
    email: "namtran@gmail.com",
    chuyenMon: "Speaking",
    trangThai: "Đang dạy",
  },
  {
    hoTen: "Lê Thị Hạnh",
    gioiTinh: "Nữ",
    soDienThoai: "0987654321",
    email: "hanhle@gmail.com",
    chuyenMon: "Grammar",
    trangThai: "Nghỉ",
  },
  {
    hoTen: "Võ Minh Huy",
    gioiTinh: "Nam",
    soDienThoai: "0978123456",
    email: "huyvo@gmail.com",
    chuyenMon: "Conversation",
    trangThai: "Đang dạy",
  },
  {
    hoTen: "Phạm Quỳnh Anh",
    gioiTinh: "Nữ",
    soDienThoai: "0934567890",
    email: "quynhanh@gmail.com",
    chuyenMon: "Toeic",
    trangThai: "Đang dạy",
  },
  {
    hoTen: "Đặng Hoàng Thắng",
    gioiTinh: "Nam",
    soDienThoai: "0945678901",
    email: "thangdang@gmail.com",
    chuyenMon: "Business English",
    trangThai: "Nghỉ",
  },
];

const pageSize = 5;

type TeacherForm = {
  tenDangNhap: string;
  matKhau: string;
  maVaiTro: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  email: string;
  avatarUrl: string;
  dangHoatDong: string;
  chuyenMon: string;
  ngayVaoLam: string;
  luongTheoGio: string;
};

const emptyTeacherForm: TeacherForm = {
  tenDangNhap: "",
  matKhau: "",
  maVaiTro: "2",
  hoTen: "",
  gioiTinh: "",
  ngaySinh: "",
  soDienThoai: "",
  email: "",
  avatarUrl: "",
  dangHoatDong: "true",
  chuyenMon: "",
  ngayVaoLam: "",
  luongTheoGio: "",
};

export default function TeacherManagementPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [currentPage, setCurrentPage] = useState(1);
  const [specialtyFilter, setSpecialtyFilter] = useState("Tất cả chuyên môn");
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [teacherForm, setTeacherForm] = useState<TeacherForm>(emptyTeacherForm);

  const specialtyOptions = useMemo(
    () => Array.from(new Set(teachers.map((teacher) => teacher.chuyenMon))),
    [teachers],
  );
  const filteredTeachers = useMemo(
    () =>
      specialtyFilter === "Tất cả chuyên môn"
        ? teachers
        : teachers.filter((teacher) => teacher.chuyenMon === specialtyFilter),
    [specialtyFilter, teachers],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentTeachers = filteredTeachers.slice(
    startIndex,
    startIndex + pageSize,
  );

  const handleCreateTeacher = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setTeachers((previousTeachers) => [
      {
        hoTen: teacherForm.hoTen.trim(),
        gioiTinh: teacherForm.gioiTinh || "Chưa cập nhật",
        soDienThoai: teacherForm.soDienThoai || "Chưa cập nhật",
        email: teacherForm.email || "Chưa cập nhật",
        chuyenMon: teacherForm.chuyenMon || "Chưa cập nhật",
        trangThai: teacherForm.dangHoatDong === "true" ? "Đang dạy" : "Nghỉ",
      },
      ...previousTeachers,
    ]);
    setSpecialtyFilter("Tất cả chuyên môn");
    setCurrentPage(1);
    setTeacherForm(emptyTeacherForm);
    setIsCreateFormOpen(false);
  };

  const handleImportExcel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(
        firstSheet,
        {
          defval: "",
        },
      );

      const importedTeachers = rows
        .map((row) => {
          const hoTen = String(
            row.hoTen ??
              row.fullName ??
              row["Họ tên"] ??
              row["Tên giáo viên"] ??
              "",
          ).trim();
          const gioiTinh = String(
            row.gioiTinh ?? row.gender ?? row["Giới tính"] ?? "",
          ).trim();
          const soDienThoai = String(
            row.soDienThoai ?? row.phone ?? row["Số điện thoại"] ?? "",
          ).trim();
          const email = String(row.email ?? row["Email"] ?? "").trim();
          const chuyenMon = String(
            row.chuyenMon ?? row.subject ?? row["Chuyên môn"] ?? "",
          ).trim();
          const trangThai = String(
            row.trangThai ?? row.status ?? row["Trạng thái"] ?? "Đang dạy",
          ).trim();

          if (!hoTen || !email) return null;

          return {
            hoTen,
            gioiTinh: gioiTinh || "Nam",
            soDienThoai: soDienThoai || "Chưa cập nhật",
            email,
            chuyenMon: chuyenMon || "Chưa cập nhật",
            trangThai:
              trangThai === "Nghỉ" || trangThai === "nghi"
                ? "Nghỉ"
                : "Đang dạy",
          } satisfies Teacher;
        })
        .filter(Boolean) as Teacher[];

      if (!importedTeachers.length) {
        alert(
          "File không chứa dữ liệu hợp lệ. Vui lòng dùng file Excel/CSV với các cột: hoTen, gioiTinh, soDienThoai, email, chuyenMon, trangThai.",
        );
        return;
      }

      setTeachers((prev) => [...importedTeachers, ...prev]);
      setCurrentPage(1);
      alert(`Đã import ${importedTeachers.length} giáo viên thành công.`);
    } catch (error) {
      console.error(error);
      alert("Import file thất bại. Vui lòng kiểm tra định dạng Excel/CSV.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <PageShell
      title="Quản lý giáo viên"
      description="Quản lý lịch giảng dạy, chuyên môn và hiệu suất của giáo viên"
      action={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]"
          >
            <FileUp className="h-4 w-4" />
            Import giáo viên
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImportExcel}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => setIsCreateFormOpen(true)}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]"
          >
            <Plus className="h-4 w-4" />
            Thêm giáo viên
          </button>
        </div>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <Presentation className="h-5 w-5" />
            </div>
            <span className="text-xs text-violet-500">Active</span>
          </div>
          <p className="mt-5 text-sm text-slate-500">Tổng giáo viên</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">35</h3>
        </div>

        <div className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <CalendarRange className="h-5 w-5" />
            </div>
            <span className="text-xs text-emerald-500">Booked</span>
          </div>
          <p className="mt-5 text-sm text-slate-500">Lịch dạy tuần</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">118</h3>
        </div>

        <div className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
              <BookMarked className="h-5 w-5" />
            </div>
            <span className="text-xs text-pink-500">Top</span>
          </div>
          <p className="mt-5 text-sm text-slate-500">Đánh giá trung bình</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">4.8</h3>
        </div>
      </div>

      <div className="w-full rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            Danh sách giáo viên
          </h3>

          <div className="flex items-center gap-3">
            <label className="relative block">
              <span className="sr-only">Tìm kiếm</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 md:w-64"
              />
            </label>
            <select
              value={specialtyFilter}
              onChange={(event) => {
                setSpecialtyFilter(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Lọc theo chuyên môn"
              className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
            >
              <option>Tất cả chuyên môn</option>
              {specialtyOptions.map((specialty) => (
                <option key={specialty}>{specialty}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-5 w-full overflow-x-auto">
          <table className="w-full min-w-[1000px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-3 py-3 text-left font-semibold">Họ tên</th>
                <th className="px-3 py-3 text-left font-semibold">Giới tính</th>
                <th className="px-3 py-3 text-left font-semibold">
                  Số điện thoại
                </th>
                <th className="px-3 py-3 text-left font-semibold">Email</th>
                <th className="px-3 py-3 text-left font-semibold">
                  Chuyên môn
                </th>
                <th className="px-3 py-3 text-left font-semibold">
                  Trạng thái
                </th>
                <th className="px-3 py-3 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentTeachers.map((teacher, index) => (
                <tr
                  key={`${teacher.email}-${index}`}
                  className="border-t border-slate-100"
                >
                  <td className="px-3 py-3 align-middle text-left text-sm font-medium text-slate-700">
                    {teacher.hoTen}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {teacher.gioiTinh}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {teacher.soDienThoai}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {teacher.email}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {teacher.chuyenMon}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm">
                    <span
                      className={[
                        "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                        teacher.trangThai === "Đang dạy"
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600",
                      ].join(" ")}
                    >
                      {teacher.trangThai}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                        aria-label={`Cập nhật ${teacher.hoTen}`}
                        title="Update"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                        aria-label={`Xóa ${teacher.hoTen}`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                        aria-label={`Xem chi tiết ${teacher.hoTen}`}
                        title="Chi tiết"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {currentTeachers.length > 0 ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + pageSize, filteredTeachers.length)} /{" "}
            {filteredTeachers.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trước
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
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
              disabled={currentPage === totalPages}
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
            onSubmit={handleCreateTeacher}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  CreateTeacherRequest
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  Thêm giáo viên
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setTeacherForm(emptyTeacherForm);
                  setIsCreateFormOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng form thêm giáo viên"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <fieldset className="space-y-4 rounded-2xl border border-violet-100 p-4">
                <legend className="px-2 text-sm font-semibold text-violet-600">
                  Thông tin tài khoản
                </legend>
                <label className="block text-sm font-medium text-slate-600">
                  Tên đăng nhập
                  <input
                    required
                    value={teacherForm.tenDangNhap}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        tenDangNhap: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Mật khẩu
                  <input
                    required
                    minLength={6}
                    type="password"
                    value={teacherForm.matKhau}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        matKhau: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Mã vai trò
                  <input
                    required
                    type="number"
                    value={teacherForm.maVaiTro}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        maVaiTro: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Avatar URL
                  <input
                    type="url"
                    value={teacherForm.avatarUrl}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        avatarUrl: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
              </fieldset>

              <fieldset className="space-y-4 rounded-2xl border border-violet-100 p-4">
                <legend className="px-2 text-sm font-semibold text-violet-600">
                  Thông tin chung
                </legend>
                <label className="block text-sm font-medium text-slate-600">
                  Họ tên
                  <input
                    required
                    value={teacherForm.hoTen}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        hoTen: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Giới tính
                  <select
                    value={teacherForm.gioiTinh}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        gioiTinh: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  >
                    <option value="">Chưa cập nhật</option>
                    <option>Nam</option>
                    <option>Nữ</option>
                    <option>Khác</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Ngày sinh
                  <input
                    type="date"
                    value={teacherForm.ngaySinh}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        ngaySinh: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Số điện thoại
                  <input
                    type="tel"
                    value={teacherForm.soDienThoai}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        soDienThoai: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Email
                  <input
                    type="email"
                    value={teacherForm.email}
                    onChange={(event) =>
                      setTeacherForm({
                        ...teacherForm,
                        email: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
              </fieldset>

              <fieldset className="space-y-4 rounded-2xl border border-violet-100 p-4 md:col-span-2">
                <legend className="px-2 text-sm font-semibold text-violet-600">
                  Thông tin giáo viên
                </legend>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block text-sm font-medium text-slate-600">
                    Chuyên môn
                    <input
                      value={teacherForm.chuyenMon}
                      onChange={(event) =>
                        setTeacherForm({
                          ...teacherForm,
                          chuyenMon: event.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Ngày vào làm
                    <input
                      type="date"
                      value={teacherForm.ngayVaoLam}
                      onChange={(event) =>
                        setTeacherForm({
                          ...teacherForm,
                          ngayVaoLam: event.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Lương theo giờ
                    <input
                      min="0"
                      step="0.01"
                      type="number"
                      value={teacherForm.luongTheoGio}
                      onChange={(event) =>
                        setTeacherForm({
                          ...teacherForm,
                          luongTheoGio: event.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600 sm:col-span-3">
                    Đang hoạt động
                    <select
                      value={teacherForm.dangHoatDong}
                      onChange={(event) =>
                        setTeacherForm({
                          ...teacherForm,
                          dangHoatDong: event.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                    >
                      <option value="true">Có</option>
                      <option value="false">Không</option>
                    </select>
                  </label>
                </div>
              </fieldset>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setTeacherForm(emptyTeacherForm);
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
                Thêm giáo viên
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
