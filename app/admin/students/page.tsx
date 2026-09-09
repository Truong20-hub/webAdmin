"use client";

import {
  Award,
  BookOpenText,
  Eye,
  FileUp,
  GraduationCap,
  Pencil,
  Search,
  Trash2,
  UserRoundPlus,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { PageShell } from "@/components/admin/PageShell";

type Student = {
  hoTen: string;
  email: string;
  soDienThoai: string;
  maVaiTro: number;
  gioiTinh: string;
  ngaySinh: string;
  diaChi: string;
};

const initialStudents: Student[] = [
  {
    hoTen: "Nguyễn Thị An",
    email: "nguyenthian@gmail.com",
    soDienThoai: "0901234567",
    maVaiTro: 3,
    gioiTinh: "Nữ",
    ngaySinh: "2006-04-14",
    diaChi: "Hà Nội",
  },
  {
    hoTen: "Phạm Quốc Duy",
    email: "phamquocduy@gmail.com",
    soDienThoai: "0912345678",
    maVaiTro: 3,
    gioiTinh: "Nam",
    ngaySinh: "2005-08-09",
    diaChi: "Đà Nẵng",
  },
  {
    hoTen: "Lê Minh Đức",
    email: "leminhduc@gmail.com",
    soDienThoai: "0934567890",
    maVaiTro: 3,
    gioiTinh: "Nam",
    ngaySinh: "2005-12-10",
    diaChi: "Hải Dương",
  },
  {
    hoTen: "Trần Thị Hà",
    email: "tranthiha@gmail.com",
    soDienThoai: "0978123456",
    maVaiTro: 3,
    gioiTinh: "Nữ",
    ngaySinh: "2004-11-21",
    diaChi: "Hồ Chí Minh",
  },
  {
    hoTen: "Bùi Khánh Vy",
    email: "buikhanhvy@gmail.com",
    soDienThoai: "0945123789",
    maVaiTro: 3,
    gioiTinh: "Nữ",
    ngaySinh: "2006-02-03",
    diaChi: "Cần Thơ",
  },
  {
    hoTen: "Đinh Hoàng Nam",
    email: "dinhhoangnam@gmail.com",
    soDienThoai: "0923456789",
    maVaiTro: 3,
    gioiTinh: "Nam",
    ngaySinh: "2005-05-19",
    diaChi: "Bắc Ninh",
  },
  {
    hoTen: "Võ Lan Anh",
    email: "volanhanh@gmail.com",
    soDienThoai: "0987654123",
    maVaiTro: 3,
    gioiTinh: "Nữ",
    ngaySinh: "2007-07-27",
    diaChi: "Thái Nguyên",
  },
  {
    hoTen: "Ngô Gia Huy",
    email: "ngogiahuy@gmail.com",
    soDienThoai: "0888123456",
    maVaiTro: 3,
    gioiTinh: "Nam",
    ngaySinh: "2005-10-31",
    diaChi: "Nghệ An",
  },
  {
    hoTen: "Huỳnh Thảo Nhi",
    email: "huynhthaonhi@gmail.com",
    soDienThoai: "0936987456",
    maVaiTro: 3,
    gioiTinh: "Nữ",
    ngaySinh: "2006-01-15",
    diaChi: "Quảng Ninh",
  },
  {
    hoTen: "Lý Hoàng Minh",
    email: "lyhoangminh@gmail.com",
    soDienThoai: "0956789234",
    maVaiTro: 3,
    gioiTinh: "Nam",
    ngaySinh: "2004-09-02",
    diaChi: "Hưng Yên",
  },
  {
    hoTen: "Tô Bảo Châu",
    email: "tobaochau@gmail.com",
    soDienThoai: "0904567891",
    maVaiTro: 3,
    gioiTinh: "Nữ",
    ngaySinh: "2005-03-06",
    diaChi: "Vĩnh Phúc",
  },
  {
    hoTen: "Mai Thanh Tùng",
    email: "maithanhtung@gmail.com",
    soDienThoai: "0919876543",
    maVaiTro: 3,
    gioiTinh: "Nam",
    ngaySinh: "2006-06-18",
    diaChi: "Bình Dương",
  },
];

const pageSize = 5;

type StudentForm = {
  tenDangNhap: string;
  matKhau: string;
  maVaiTro: string;
  avatarUrl: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  tenPhuHuynh: string;
  sdtPhuHuynh: string;
  ngayNhapHoc: string;
  dangHoatDong: string;
};

const emptyStudentForm: StudentForm = {
  tenDangNhap: "",
  matKhau: "",
  maVaiTro: "3",
  avatarUrl: "",
  hoTen: "",
  gioiTinh: "",
  ngaySinh: "",
  soDienThoai: "",
  email: "",
  diaChi: "",
  tenPhuHuynh: "",
  sdtPhuHuynh: "",
  ngayNhapHoc: "",
  dangHoatDong: "true",
};

export default function StudentManagementPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [studentForm, setStudentForm] = useState<StudentForm>(emptyStudentForm);

  const totalPages = Math.ceil(students.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentStudents = students.slice(startIndex, startIndex + pageSize);

  const handleCreateStudent = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStudents((previousStudents) => [
      {
        hoTen: studentForm.hoTen.trim(),
        email: studentForm.email.trim() || "Chưa cập nhật",
        soDienThoai: studentForm.soDienThoai.trim() || "Chưa cập nhật",
        maVaiTro: Number(studentForm.maVaiTro) || 3,
        gioiTinh: studentForm.gioiTinh.trim() || "Chưa cập nhật",
        ngaySinh: studentForm.ngaySinh || "Chưa cập nhật",
        diaChi: studentForm.diaChi.trim() || "Chưa cập nhật",
      },
      ...previousStudents,
    ]);
    setCurrentPage(1);
    setStudentForm(emptyStudentForm);
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

      const importedStudents = rows
        .map((row) => {
          const hoTen = String(
            row.hoTen ?? row.fullName ?? row["Họ tên"] ?? "",
          ).trim();
          const email = String(
            row.email ?? row.Email ?? row["Email"] ?? "",
          ).trim();
          const soDienThoai = String(
            row.soDienThoai ??
              row.phone ??
              row["SĐT"] ??
              row["Số điện thoại"] ??
              "",
          ).trim();
          const gioiTinh = String(
            row.gioiTinh ?? row.gender ?? row["Giới tính"] ?? "",
          ).trim();
          const ngaySinh = String(
            row.ngaySinh ?? row.birthday ?? row["Ngày sinh"] ?? "",
          ).trim();
          const diaChi = String(
            row.diaChi ?? row.address ?? row["Địa chỉ"] ?? "",
          ).trim();
          const maVaiTro = Number(
            row.maVaiTro ?? row.role ?? row["Mã vai trò"] ?? 3,
          );

          if (!hoTen || !email) return null;

          return {
            hoTen,
            email,
            soDienThoai: soDienThoai || "Chưa cập nhật",
            maVaiTro: Number.isFinite(maVaiTro) ? maVaiTro : 3,
            gioiTinh: gioiTinh || "Chưa cập nhật",
            ngaySinh: ngaySinh || "Chưa cập nhật",
            diaChi: diaChi || "Chưa cập nhật",
          } satisfies Student;
        })
        .filter(Boolean) as Student[];

      if (!importedStudents.length) {
        alert(
          "File không chứa dữ liệu hợp lệ. Vui lòng dùng file Excel/CSV với các cột: hoTen, email, soDienThoai, gioiTinh, ngaySinh, diaChi.",
        );
        return;
      }

      setStudents((prev) => [...importedStudents, ...prev]);
      setCurrentPage(1);
      alert(`Đã import ${importedStudents.length} học viên thành công.`);
    } catch (error) {
      console.error(error);
      alert("Import file thất bại. Vui lòng kiểm tra định dạng Excel/CSV.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <PageShell
      title="Quản lý học viên"
      description="Theo dõi danh sách học viên, thông tin cá nhân và trạng thái tham gia"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]"
          >
            <FileUp className="h-4 w-4" />
            Import Excel
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
            <UserRoundPlus className="h-4 w-4" />
            Thêm học viên
          </button>
        </div>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
              <GraduationCap className="h-5 w-5" />
            </div>
            <span className="text-xs text-violet-500">+8%</span>
          </div>
          <p className="mt-5 text-sm text-slate-500">Tổng học viên</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">1,250</h3>
        </div>

        <div className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
              <BookOpenText className="h-5 w-5" />
            </div>
            <span className="text-xs text-emerald-500">Live</span>
          </div>
          <p className="mt-5 text-sm text-slate-500">Lớp đang học</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">28</h3>
        </div>

        <div className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]">
          <div className="flex items-center justify-between">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-pink-50 text-pink-600">
              <Award className="h-5 w-5" />
            </div>
            <span className="text-xs text-pink-500">Top</span>
          </div>
          <p className="mt-5 text-sm text-slate-500">Điểm trung bình</p>
          <h3 className="mt-2 text-3xl font-bold text-slate-800">8.7</h3>
        </div>
      </div>

      <div className="w-full rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            Danh sách học viên
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
          </div>
        </div>

        <div className="mt-5 w-full overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-3 py-3 text-left font-semibold">Họ tên</th>
                <th className="px-3 py-3 text-left font-semibold">Email</th>
                <th className="px-3 py-3 text-left font-semibold">SĐT</th>
                <th className="px-3 py-3 text-right font-semibold">
                  Mã vai trò
                </th>
                <th className="px-3 py-3 text-left font-semibold">Giới tính</th>
                <th className="px-3 py-3 text-left font-semibold">Ngày sinh</th>
                <th className="px-3 py-3 text-left font-semibold">Địa chỉ</th>
                <th className="px-3 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={`${student.hoTen}-${index}`}
                  className="border-t border-slate-100"
                >
                  <td className="px-3 py-3 align-middle text-left text-sm font-medium text-slate-700">
                    {student.hoTen}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {student.email}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {student.soDienThoai}
                  </td>
                  <td className="px-3 py-3 align-middle text-right text-sm font-medium text-slate-700">
                    {student.maVaiTro}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {student.gioiTinh}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {student.ngaySinh}
                  </td>
                  <td className="px-3 py-3 align-middle text-left text-sm text-slate-600">
                    {student.diaChi}
                  </td>
                  <td className="px-3 py-3 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                        aria-label={`Cập nhật ${student.hoTen}`}
                        title="Update"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                        aria-label={`Xóa ${student.hoTen}`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-600 transition hover:bg-sky-100"
                        aria-label={`Xem chi tiết ${student.hoTen}`}
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
            Hiển thị {currentStudents.length > 0 ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + pageSize, students.length)} /{" "}
            {students.length}
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
            onSubmit={handleCreateStudent}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  CreateHocVienRequest
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  Thêm học viên
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStudentForm(emptyStudentForm);
                  setIsCreateFormOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng form thêm học viên"
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
                    value={studentForm.tenDangNhap}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
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
                    value={studentForm.matKhau}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
                        matKhau: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Mã vai trò
                  <input
                    type="number"
                    value={studentForm.maVaiTro}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
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
                    value={studentForm.avatarUrl}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
                        avatarUrl: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
              </fieldset>

              <fieldset className="space-y-4 rounded-2xl border border-violet-100 p-4">
                <legend className="px-2 text-sm font-semibold text-violet-600">
                  Thông tin học viên
                </legend>
                <label className="block text-sm font-medium text-slate-600">
                  Họ tên
                  <input
                    required
                    value={studentForm.hoTen}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
                        hoTen: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Giới tính
                  <select
                    value={studentForm.gioiTinh}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
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
                    value={studentForm.ngaySinh}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
                        ngaySinh: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Số điện thoại
                  <input
                    maxLength={20}
                    type="tel"
                    value={studentForm.soDienThoai}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
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
                    value={studentForm.email}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
                        email: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Địa chỉ
                  <input
                    value={studentForm.diaChi}
                    onChange={(event) =>
                      setStudentForm({
                        ...studentForm,
                        diaChi: event.target.value,
                      })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
              </fieldset>

              <fieldset className="space-y-4 rounded-2xl border border-violet-100 p-4 md:col-span-2">
                <legend className="px-2 text-sm font-semibold text-violet-600">
                  Thông tin phụ huynh và nhập học
                </legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-medium text-slate-600">
                    Tên phụ huynh
                    <input
                      value={studentForm.tenPhuHuynh}
                      onChange={(event) =>
                        setStudentForm({
                          ...studentForm,
                          tenPhuHuynh: event.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    SĐT phụ huynh
                    <input
                      type="tel"
                      value={studentForm.sdtPhuHuynh}
                      onChange={(event) =>
                        setStudentForm({
                          ...studentForm,
                          sdtPhuHuynh: event.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Ngày nhập học
                    <input
                      type="date"
                      value={studentForm.ngayNhapHoc}
                      onChange={(event) =>
                        setStudentForm({
                          ...studentForm,
                          ngayNhapHoc: event.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Đang hoạt động
                    <select
                      value={studentForm.dangHoatDong}
                      onChange={(event) =>
                        setStudentForm({
                          ...studentForm,
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
                  setStudentForm(emptyStudentForm);
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
                Thêm học viên
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
