"use client";

import {
  ChevronDown,
  Edit3,
  Mail,
  Phone,
  Search,
  Trash2,
  UserRoundCheck,
  X,
} from "lucide-react";
import type { FormEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

type Parent = {
  hoTen: string;
  hocVien: string;
  gioiTinh: string;
  soDienThoai: string;
  email: string;
  diaChi: string;
  ngheNghiep: string;
  dangHoatDong: boolean | null;
};

const emptyForm = {
  hoTen: "",
  hocVien: "",
  gioiTinh: "",
  soDienThoai: "",
  email: "",
  diaChi: "",
  ngheNghiep: "",
  dangHoatDong: "true",
};
const pageSize = 5;

export default function ParentManagementPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [search, setSearch] = useState("");
  const [studentFilter, setStudentFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "Tất cả" | "Đang hoạt động" | "Ngừng hoạt động" | "Chưa cập nhật"
  >("Tất cả");
  const [currentPage, setCurrentPage] = useState(1);
  const [form, setForm] = useState(emptyForm);
  const [editingParent, setEditingParent] = useState<Parent | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStudentMenuOpen, setIsStudentMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    void apiRequest<Array<{
      hoTen: string;
      tenPhuHuynh?: string | null;
      sdtPhuHuynh?: string | null;
      gioiTinh?: string | null;
      diaChi?: string | null;
      dangHoatDong?: boolean;
    }> | { data?: Array<{
      hoTen: string;
      tenPhuHuynh?: string | null;
      sdtPhuHuynh?: string | null;
      gioiTinh?: string | null;
      diaChi?: string | null;
      dangHoatDong?: boolean;
    }> }>("/HocVien")
      .then((response) => {
        const students = Array.isArray(response) ? response : response.data ?? [];
        setParents(students.filter((student) => student.tenPhuHuynh || student.sdtPhuHuynh).map((student) => ({
          hoTen: student.tenPhuHuynh ?? "Chưa cập nhật",
          hocVien: student.hoTen,
          gioiTinh: "",
          soDienThoai: student.sdtPhuHuynh ?? "",
          email: "",
          diaChi: "",
          ngheNghiep: "",
          dangHoatDong: student.dangHoatDong ?? null,
        })));
      })
      .catch((error: unknown) => setErrorMessage(error instanceof Error ? error.message : "Không tải được thông tin phụ huynh."))
      .finally(() => setIsLoading(false));
  }, []);

  const studentOptions = useMemo(
    () =>
      Array.from(
        new Set(parents.map((parent) => parent.hocVien).filter(Boolean)),
      ),
    [parents],
  );
  const matchingStudents = studentOptions.filter((student) =>
    student.toLowerCase().includes(studentFilter.toLowerCase().trim()),
  );

  const filteredParents = useMemo(
    () =>
      parents.filter((parent) => {
        const keyword = search.toLowerCase().trim();
        const matchesSearch =
          !keyword ||
          [
            parent.hoTen,
            parent.email,
            parent.soDienThoai,
            parent.diaChi,
            parent.ngheNghiep,
          ].some((value) => value.toLowerCase().includes(keyword));
        const matchesStudent = parent.hocVien
          .toLowerCase()
          .includes(studentFilter.toLowerCase().trim());
        const status =
          parent.dangHoatDong === null
            ? "Chưa cập nhật"
            : parent.dangHoatDong
              ? "Đang hoạt động"
              : "Ngừng hoạt động";
        return (
          matchesSearch &&
          matchesStudent &&
          (statusFilter === "Tất cả" || status === statusFilter)
        );
      }),
    [parents, search, studentFilter, statusFilter],
  );
  const totalPages = Math.max(1, Math.ceil(filteredParents.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const currentParents = filteredParents.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const openForm = (parent?: Parent) => {
    setEditingParent(parent ?? null);
    setForm(
      parent
        ? {
            hoTen: parent.hoTen,
            hocVien: parent.hocVien,
            gioiTinh: parent.gioiTinh,
            soDienThoai: parent.soDienThoai,
            email: parent.email,
            diaChi: parent.diaChi,
            ngheNghiep: parent.ngheNghiep,
            dangHoatDong:
              parent.dangHoatDong === null
                ? "null"
                : String(parent.dangHoatDong),
          }
        : emptyForm,
    );
    setIsFormOpen(true);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("API hiện chưa hỗ trợ thêm hoặc cập nhật phụ huynh. Hãy chỉnh sửa thông tin liên hệ trong hồ sơ học viên.");
  };

  const handleDelete = (parent: Parent) => {
    setErrorMessage(`API hiện chưa hỗ trợ xóa thông tin phụ huynh ${parent.hoTen}.`);
  };

  return (
    <PageShell
      title="Quản lý phụ huynh"
      description="Thông tin phụ huynh được lấy từ hồ sơ học viên; API hiện chỉ hỗ trợ xem."
    >
      {errorMessage && <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{errorMessage}</div>}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {[
          {
            label: "Tổng phụ huynh",
            value: parents.length,
            icon: UserRoundCheck,
            tone: "bg-violet-50 text-violet-600",
          },
          {
            label: "Đang hoạt động",
            value: parents.filter((parent) => parent.dangHoatDong === true)
              .length,
            icon: Phone,
            tone: "bg-emerald-50 text-emerald-600",
          },
          {
            label: "Học viên được liên kết",
            value: parents.length,
            icon: Mail,
            tone: "bg-pink-50 text-pink-600",
          },
        ].map(({ label, value, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
          </div>
        ))}
      </div>

      <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            Danh sách phụ huynh
          </h3>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block">
              <span className="sr-only">Tìm kiếm phụ huynh</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Tìm theo tên, email..."
                className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 sm:w-64"
              />
            </label>
            <div
              className="relative"
              onBlur={() =>
                window.setTimeout(() => setIsStudentMenuOpen(false), 120)
              }
            >
              <div className="relative">
                <input
                  role="combobox"
                  aria-expanded={isStudentMenuOpen}
                  aria-controls="student-filter-options"
                  value={studentFilter}
                  onFocus={() => setIsStudentMenuOpen(true)}
                  onChange={(event) => {
                    setStudentFilter(event.target.value);
                    setCurrentPage(1);
                    setIsStudentMenuOpen(true);
                  }}
                  placeholder="Chọn học viên"
                  className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none transition focus:border-violet-300 sm:w-56"
                />
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              </div>
              {isStudentMenuOpen && (
                <div
                  id="student-filter-options"
                  role="listbox"
                  className="absolute left-0 top-full z-20 mt-2 max-h-56 w-full overflow-y-auto rounded-2xl border border-violet-100 bg-white p-1.5 shadow-xl sm:w-56"
                >
                  <button
                    type="button"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      setStudentFilter("");
                      setCurrentPage(1);
                      setIsStudentMenuOpen(false);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-500 hover:bg-violet-50"
                  >
                    Tất cả học viên
                  </button>
                  {matchingStudents.map((student) => (
                    <button
                      key={student}
                      type="button"
                      role="option"
                      aria-selected={student === studentFilter}
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => {
                        setStudentFilter(student);
                        setCurrentPage(1);
                        setIsStudentMenuOpen(false);
                      }}
                      className="w-full rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-violet-50 hover:text-violet-700"
                    >
                      {student}
                    </button>
                  ))}
                  {!matchingStudents.length && (
                    <p className="px-3 py-2 text-sm text-slate-400">
                      Không tìm thấy học viên
                    </p>
                  )}
                </div>
              )}
            </div>
            <select
              value={statusFilter}
              onChange={(event) => {
                setStatusFilter(
                  event.target.value as
                    | "Tất cả"
                    | "Đang hoạt động"
                    | "Ngừng hoạt động"
                    | "Chưa cập nhật",
                );
                setCurrentPage(1);
              }}
              className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none"
            >
              <option>Tất cả</option>
              <option>Đang hoạt động</option>
              <option>Ngừng hoạt động</option>
              <option>Chưa cập nhật</option>
            </select>
          </div>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="min-w-[900px] w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-3 py-3 font-semibold">Họ tên</th>
                <th className="px-3 py-3 font-semibold">Học viên</th>
                <th className="px-3 py-3 font-semibold">Giới tính</th>
                <th className="px-3 py-3 font-semibold">Số điện thoại</th>
                <th className="px-3 py-3 font-semibold">Email</th>
                <th className="px-3 py-3 font-semibold">Địa chỉ</th>
                <th className="px-3 py-3 font-semibold">Nghề nghiệp</th>
                <th className="px-3 py-3 font-semibold">Hoạt động</th>
                <th className="px-3 py-3 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className="px-3 py-8 text-center text-slate-500">Đang tải...</td></tr>
              ) : currentParents.map((parent) => (
                <tr
                key={`${parent.hoTen}-${parent.hocVien}`}
                  className="border-t border-slate-100"
                >
                  <td className="px-3 py-4 text-sm font-medium text-slate-700">
                    {parent.hoTen}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {parent.hocVien || "-"}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {parent.gioiTinh || "-"}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {parent.soDienThoai || "-"}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {parent.email || "-"}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {parent.diaChi || "-"}
                  </td>
                  <td className="px-3 py-4 text-sm text-slate-600">
                    {parent.ngheNghiep || "-"}
                  </td>
                  <td className="px-3 py-4">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${parent.dangHoatDong === true ? "bg-emerald-50 text-emerald-600" : parent.dangHoatDong === false ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"}`}
                    >
                      {parent.dangHoatDong === true
                        ? "Đang hoạt động"
                        : parent.dangHoatDong === false
                          ? "Ngừng hoạt động"
                          : "Chưa cập nhật"}
                    </span>
                  </td>
                  <td className="px-3 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openForm(parent)}
                        disabled
                        title="API chưa hỗ trợ chỉnh sửa phụ huynh."
                        className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-300"
                        aria-label={`Sửa ${parent.hoTen}`}
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(parent)}
                        disabled
                        title="API chưa hỗ trợ xóa phụ huynh."
                        className="flex h-9 w-9 cursor-not-allowed items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-300"
                        aria-label={`Xóa ${parent.hoTen}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!currentParents.length && (
            <p className="py-10 text-center text-sm text-slate-400">
              Không tìm thấy phụ huynh phù hợp.
            </p>
          )}
        </div>
        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {currentParents.length ? (safePage - 1) * pageSize + 1 : 0}{" "}
            - {Math.min(safePage * pageSize, filteredParents.length)} /{" "}
            {filteredParents.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={safePage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
            >
              Trước
            </button>
            <span className="text-sm text-slate-500">
              Trang {safePage}/{totalPages}
            </span>
            <button
              type="button"
              disabled={safePage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  Thông tin liên hệ
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {editingParent ? "Cập nhật phụ huynh" : "Thêm phụ huynh"}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingParent(null);
                  setForm(emptyForm);
                  setIsFormOpen(false);
                }}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {(
                [
                  ["hoTen", "Họ tên", "text"],
                  ["hocVien", "Học viên liên kết", "text"],
                  ["gioiTinh", "Giới tính", "text"],
                  ["soDienThoai", "Số điện thoại", "tel"],
                  ["email", "Email", "email"],
                  ["diaChi", "Địa chỉ", "text"],
                  ["ngheNghiep", "Nghề nghiệp", "text"],
                ] as const
              ).map(([key, label, type]) => (
                <label key={key} className="text-sm font-medium text-slate-600">
                  {label}
                  <input
                    required={key === "hoTen"}
                    type={type}
                    value={form[key]}
                    onChange={(event) =>
                      setForm({ ...form, [key]: event.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
                  />
                </label>
              ))}
              <label className="text-sm font-medium text-slate-600">
                Đang hoạt động
                <select
                  value={form.dangHoatDong}
                  onChange={(event) =>
                    setForm({ ...form, dangHoatDong: event.target.value })
                  }
                  className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300"
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
                  setEditingParent(null);
                  setForm(emptyForm);
                  setIsFormOpen(false);
                }}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white"
              >
                {editingParent ? "Lưu thay đổi" : "Thêm phụ huynh"}
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
