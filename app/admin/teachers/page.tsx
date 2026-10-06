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
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as XLSX from "xlsx";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

// Dòng hiển thị trong bảng (khớp GiaoVienResponse của backend)
type Teacher = {
  maGiaoVien?: number;
  maNguoiDung?: number;
  tenDangNhap?: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  email: string;
  chuyenMon: string;
  ngayVaoLam: string;
  luongTheoGio: number | null;
  dangHoatDong: boolean;
};

// Khớp với CreateTeacherRequest (C#) - 1 request tạo cả tài khoản + hồ sơ giáo viên
export type CreateTeacherRequest = {
  tenDangNhap: string;
  matKhau: string;
  maVaiTro: number;
  hoTen: string;
  gioiTinh?: string | null;
  ngaySinh?: string | null; // "yyyy-MM-dd"
  soDienThoai?: string | null;
  email?: string | null;
  avatarUrl?: string | null;
  dangHoatDong: boolean;
  chuyenMon?: string | null;
  ngayVaoLam?: string | null; // "yyyy-MM-dd"
  luongTheoGio?: number | null;
};

// Khớp với UpdateTeacherRequest (C#) - không có mật khẩu
// (field nào backend không có thì ASP.NET tự bỏ qua)
export type UpdateTeacherRequest = Omit<CreateTeacherRequest, "matKhau">;

const pageSize = 5;
const PLACEHOLDER = "Chưa cập nhật";
const ALL_SPECIALTIES = "Tất cả chuyên môn";

type TeacherForm = {
  tenDangNhap: string;
  matKhau: string; // chỉ dùng khi thêm mới
  maVaiTro: string;
  hoTen: string;
  gioiTinh: string;
  ngaySinh: string;
  soDienThoai: string;
  email: string;
  avatarUrl: string;
  dangHoatDong: string; // "true" | "false"
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

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300";

const cleanValue = (value?: string | null) =>
  !value || value === PLACEHOLDER ? "" : value;

// Ô <input type="date"> chỉ nhận "yyyy-MM-dd"
const toDateInput = (value?: string | null) => {
  const clean = cleanValue(value);
  return /^\d{4}-\d{2}-\d{2}/.test(clean) ? clean.slice(0, 10) : "";
};

// yyyy-MM-dd -> dd/MM/yyyy
const formatDate = (value?: string | null) => {
  const date = toDateInput(value);
  if (!date) return PLACEHOLDER;
  const [year, month, day] = date.split("-");
  return `${day}/${month}/${year}`;
};

// Lấy giá trị ô đầu tiên có dữ liệu trong danh sách tên cột chấp nhận (import Excel)
const getCell = (row: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
};

// Ô ngày của Excel (số / dd/MM/yyyy / yyyy-MM-dd) -> "yyyy-MM-dd"
const toIsoDate = (value: unknown): string | null => {
  if (value === "" || value === null || value === undefined) return null;
  const pad = (n: number) => String(n).padStart(2, "0");

  if (typeof value === "number") {
    const d = XLSX.SSF.parse_date_code(value);
    return d ? `${d.y}-${pad(d.m)}-${pad(d.d)}` : null;
  }

  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);
  const m = text.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/);
  return m ? `${m[3]}-${pad(Number(m[2]))}-${pad(Number(m[1]))}` : null;
};

// "true"/"có"/"đang dạy"... -> boolean (import Excel)
const toBool = (value: unknown): boolean => {
  const t = String(value ?? "")
    .trim()
    .toLowerCase();
  if (!t) return true;
  return !["false", "0", "không", "khong", "nghỉ", "nghi"].includes(t);
};

const formatMoney = (value: number | null | undefined) =>
  value === null || value === undefined
    ? PLACEHOLDER
    : `${value.toLocaleString("vi-VN")} đ/giờ`;

function DetailItem({
  label,
  value,
}: {
  label: string;
  value?: string | number | null;
}) {
  const text =
    value === undefined || value === null || value === ""
      ? PLACEHOLDER
      : String(value);

  return (
    <div>
      <dt className="text-xs font-medium text-slate-400">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-slate-700">
        {text}
      </dd>
    </div>
  );
}

// Backend có thể trả lỗi dạng JSON (ProblemDetails) hoặc chuỗi thường
function getErrorMessage(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  try {
    const data = JSON.parse(raw);
    if (data?.errors) return Object.values(data.errors).flat().join("\n");
    return data?.message ?? data?.title ?? raw;
  } catch {
    return raw;
  }
}

// Chuyển dữ liệu thô từ API /GiaoVien thành dòng của bảng
const mapTeacher = (item: any): Teacher => ({
  maGiaoVien: item.maGiaoVien,
  maNguoiDung: item.maNguoiDung,
  tenDangNhap: item.tenDangNhap ?? "",
  hoTen: item.hoTen ?? PLACEHOLDER,
  gioiTinh: item.gioiTinh ?? PLACEHOLDER,
  ngaySinh: item.ngaySinh ?? "",
  soDienThoai: item.soDienThoai ?? PLACEHOLDER,
  email: item.email ?? PLACEHOLDER,
  chuyenMon: item.chuyenMon ?? PLACEHOLDER,
  ngayVaoLam: item.ngayVaoLam ?? "",
  luongTheoGio: item.luongTheoGio ?? null,
  dangHoatDong: item.dangHoatDong ?? true,
});

export default function TeacherManagementPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const requestId = useRef(0); // bỏ kết quả cũ trả về chậm
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [specialtyFilter, setSpecialtyFilter] = useState(ALL_SPECIALTIES);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [viewingTeacher, setViewingTeacher] = useState<Teacher | null>(null);
  const [teacherForm, setTeacherForm] = useState<TeacherForm>(emptyTeacherForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const isEditing = editingTeacher !== null;

  // Tải danh sách giáo viên (kw rỗng = lấy tất cả)
  const loadTeachers = useCallback(async (kw: string = "") => {
    const id = ++requestId.current;
    try {
      const url = kw
        ? `/GiaoVien/search?keyword=${encodeURIComponent(kw)}`
        : `/GiaoVien`;
      const data = await apiRequest<any[]>(url);
      if (id !== requestId.current) return;
      setTeachers(data.map(mapTeacher));
    } catch (error) {
      if (id !== requestId.current) return;
      const message = getErrorMessage(error);
      // Backend trả 404 "Không tìm thấy giáo viên." khi không có kết quả -> coi là danh sách rỗng
      if (kw && message.includes("Không tìm thấy")) {
        setTeachers([]);
        return;
      }
      alert(message);
    }
  }, []);

  // Tự tìm khi gõ (chờ 400ms). Cũng chạy lần đầu để tải danh sách.
  useEffect(() => {
    const timer = setTimeout(() => {
      const kw = searchInput.trim();
      setKeyword(kw);
      setCurrentPage(1);
      loadTeachers(kw);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput, loadTeachers]);

  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const kw = searchInput.trim();
    setKeyword(kw);
    setCurrentPage(1);
    await loadTeachers(kw);
  };

  const handleClearSearch = () => setSearchInput("");

  const specialtyOptions = useMemo(
    () =>
      Array.from(
        new Set(
          teachers
            .map((t) => t.chuyenMon)
            .filter((c) => c && c !== PLACEHOLDER),
        ),
      ),
    [teachers],
  );

  const filteredTeachers = useMemo(
    () =>
      specialtyFilter === ALL_SPECIALTIES
        ? teachers
        : teachers.filter((t) => t.chuyenMon === specialtyFilter),
    [specialtyFilter, teachers],
  );

  const totalPages = Math.max(1, Math.ceil(filteredTeachers.length / pageSize));
  const startIndex = (currentPage - 1) * pageSize;
  const currentTeachers = filteredTeachers.slice(
    startIndex,
    startIndex + pageSize,
  );

  const setField =
    (key: keyof TeacherForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setTeacherForm((prev) => ({ ...prev, [key]: event.target.value }));

  const closeForm = () => {
    setTeacherForm(emptyTeacherForm);
    setEditingTeacher(null);
    setIsFormOpen(false);
  };

  const openCreateForm = () => {
    setEditingTeacher(null);
    setTeacherForm(emptyTeacherForm);
    setIsFormOpen(true);
  };

  const openEditForm = (teacher: Teacher) => {
    if (!teacher.maGiaoVien) {
      alert("Dòng này chưa có mã giáo viên nên không thể cập nhật.");
      return;
    }
    setEditingTeacher(teacher);
    setTeacherForm({
      tenDangNhap: teacher.tenDangNhap ?? "",
      matKhau: "",
      maVaiTro: "2",
      hoTen: cleanValue(teacher.hoTen),
      gioiTinh: cleanValue(teacher.gioiTinh),
      ngaySinh: toDateInput(teacher.ngaySinh),
      soDienThoai: cleanValue(teacher.soDienThoai),
      email: cleanValue(teacher.email),
      avatarUrl: "",
      dangHoatDong: String(teacher.dangHoatDong),
      chuyenMon: cleanValue(teacher.chuyenMon),
      ngayVaoLam: toDateInput(teacher.ngayVaoLam),
      luongTheoGio:
        teacher.luongTheoGio === null ? "" : String(teacher.luongTheoGio),
    });
    setIsFormOpen(true);
  };

  // Dựng body dùng chung cho thêm / sửa
  const buildBody = (): UpdateTeacherRequest => ({
    tenDangNhap: teacherForm.tenDangNhap.trim(),
    maVaiTro: Number(teacherForm.maVaiTro) || 2,
    hoTen: teacherForm.hoTen.trim(),
    gioiTinh: teacherForm.gioiTinh || null,
    ngaySinh: teacherForm.ngaySinh || null,
    soDienThoai: teacherForm.soDienThoai.trim() || null,
    email: teacherForm.email.trim() || null,
    avatarUrl: teacherForm.avatarUrl.trim() || null,
    dangHoatDong: teacherForm.dangHoatDong === "true",
    chuyenMon: teacherForm.chuyenMon.trim() || null,
    ngayVaoLam: teacherForm.ngayVaoLam || null,
    luongTheoGio:
      teacherForm.luongTheoGio === "" ? null : Number(teacherForm.luongTheoGio),
  });

  const handleCreateTeacher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      const body: CreateTeacherRequest = {
        ...buildBody(),
        matKhau: teacherForm.matKhau,
      };
      await apiRequest("/GiaoVien", { method: "POST", body });

      setSpecialtyFilter(ALL_SPECIALTIES);
      await loadTeachers(keyword);
      setCurrentPage(1);
      closeForm();
      alert("Thêm giáo viên thành công");
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTeacher = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !editingTeacher) return;

    const maGiaoVien = editingTeacher.maGiaoVien;
    if (!maGiaoVien) {
      alert("Không có mã giáo viên, không thể cập nhật.");
      return;
    }

    setIsSubmitting(true);
    try {
      const body = buildBody();
      await apiRequest(`/GiaoVien/${maGiaoVien}`, { method: "PUT", body });

      setTeachers((prev) =>
        prev.map((t) =>
          t.maGiaoVien === maGiaoVien
            ? {
                ...t,
                tenDangNhap: body.tenDangNhap,
                hoTen: body.hoTen,
                gioiTinh: body.gioiTinh || PLACEHOLDER,
                ngaySinh: body.ngaySinh || "",
                soDienThoai: body.soDienThoai || PLACEHOLDER,
                email: body.email || PLACEHOLDER,
                chuyenMon: body.chuyenMon || PLACEHOLDER,
                ngayVaoLam: body.ngayVaoLam || "",
                luongTheoGio: body.luongTheoGio ?? null,
                dangHoatDong: body.dangHoatDong,
              }
            : t,
        ),
      );
      closeForm();
      alert("Cập nhật giáo viên thành công");
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTeacher = async (teacher: Teacher) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa giáo viên "${teacher.hoTen}"? Thao tác này không thể hoàn tác.`,
    );
    if (!confirmed) return;

    const maGiaoVien = teacher.maGiaoVien;
    if (!maGiaoVien) {
      alert("Không có mã giáo viên, không thể xóa.");
      return;
    }

    setDeletingId(maGiaoVien);
    try {
      await apiRequest(`/GiaoVien/${maGiaoVien}`, { method: "DELETE" });

      const remaining = teachers.filter((t) => t.maGiaoVien !== maGiaoVien);
      setTeachers(remaining);
      setCurrentPage((page) =>
        Math.min(page, Math.max(1, Math.ceil(remaining.length / pageSize))),
      );
      alert("Đã xóa giáo viên");
    } catch (error) {
      alert(getErrorMessage(error));
    } finally {
      setDeletingId(null);
    }
  };

  // Import Excel: mỗi dòng gọi POST /GiaoVien một lần
  // Cột bắt buộc: tenDangNhap, matKhau, hoTen
  const handleImportExcel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || isImporting) return;

    setIsImporting(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
      });

      if (!rows.length) {
        alert("File không có dữ liệu.");
        return;
      }

      let success = 0;
      const errors: string[] = [];

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const line = i + 2; // dòng 1 là tiêu đề
        const text = (keys: string[]) => String(getCell(row, keys)).trim();

        const tenDangNhap = text(["tenDangNhap", "username", "Tên đăng nhập"]);
        const matKhau = text(["matKhau", "password", "Mật khẩu"]);
        const hoTen = text(["hoTen", "fullName", "Họ tên", "Tên giáo viên"]);

        if (!tenDangNhap || !matKhau || !hoTen) {
          errors.push(`Dòng ${line}: thiếu tenDangNhap, matKhau hoặc hoTen`);
          continue;
        }

        const maVaiTro = Number(
          getCell(row, ["maVaiTro", "role", "Mã vai trò"]) || 2,
        );
        const luong = getCell(row, ["luongTheoGio", "Lương theo giờ"]);

        const body: CreateTeacherRequest = {
          tenDangNhap,
          matKhau,
          hoTen,
          maVaiTro: Number.isFinite(maVaiTro) ? maVaiTro : 2,
          gioiTinh: text(["gioiTinh", "gender", "Giới tính"]) || null,
          ngaySinh: toIsoDate(
            getCell(row, ["ngaySinh", "birthday", "Ngày sinh"]),
          ),
          soDienThoai:
            text(["soDienThoai", "phone", "SĐT", "Số điện thoại"]) || null,
          email: text(["email", "Email"]) || null,
          avatarUrl: null,
          dangHoatDong: toBool(
            getCell(row, ["dangHoatDong", "trangThai", "status", "Trạng thái"]),
          ),
          chuyenMon: text(["chuyenMon", "subject", "Chuyên môn"]) || null,
          ngayVaoLam: toIsoDate(getCell(row, ["ngayVaoLam", "Ngày vào làm"])),
          luongTheoGio:
            luong !== "" && Number.isFinite(Number(luong))
              ? Number(luong)
              : null,
        };

        try {
          await apiRequest("/GiaoVien", { method: "POST", body });
          success++;
        } catch (error) {
          errors.push(
            `Dòng ${line} (${tenDangNhap}): ${getErrorMessage(error)}`,
          );
        }
      }

      await loadTeachers(keyword);
      setCurrentPage(1);

      const shown = errors.slice(0, 5).join("\n");
      const more =
        errors.length > 5 ? `\n... và ${errors.length - 5} lỗi khác` : "";
      alert(
        `Import xong: thành công ${success}/${rows.length} dòng.` +
          (errors.length ? `\n\nLỗi:\n${shown}${more}` : ""),
      );
    } catch (error) {
      console.error(error);
      alert("Import file thất bại. Vui lòng kiểm tra định dạng Excel/CSV.");
    } finally {
      setIsImporting(false);
      event.target.value = "";
    }
  };

  return (
    <PageShell
      title="Quản lý giáo viên"
      description="Quản lý lịch giảng dạy, chuyên môn và hiệu suất của giáo viên"
      action={
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isImporting}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileUp className="h-4 w-4" />
            {isImporting ? "Đang import..." : "Import giáo viên"}
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
            onClick={openCreateForm}
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

          <form
            onSubmit={handleSearch}
            className="flex flex-wrap items-center gap-2"
          >
            <label className="relative block">
              <span className="sr-only">Tìm kiếm</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Tìm theo tên, email, SĐT..."
                className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 md:w-64"
              />
            </label>
            <button
              type="submit"
              className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
            >
              Tìm
            </button>
            {keyword && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="rounded-full border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Xóa tìm
              </button>
            )}
            <select
              value={specialtyFilter}
              onChange={(event) => {
                setSpecialtyFilter(event.target.value);
                setCurrentPage(1);
              }}
              aria-label="Lọc theo chuyên môn"
              className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
            >
              <option>{ALL_SPECIALTIES}</option>
              {specialtyOptions.map((specialty) => (
                <option key={specialty}>{specialty}</option>
              ))}
            </select>
          </form>
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
                  key={`${teacher.maGiaoVien ?? teacher.email}-${index}`}
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
                        teacher.dangHoatDong
                          ? "bg-emerald-50 text-emerald-600"
                          : "bg-amber-50 text-amber-600",
                      ].join(" ")}
                    >
                      {teacher.dangHoatDong ? "Đang dạy" : "Nghỉ"}
                    </span>
                  </td>
                  <td className="px-3 py-3 align-middle text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => openEditForm(teacher)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                        aria-label={`Cập nhật ${teacher.hoTen}`}
                        title="Update"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteTeacher(teacher)}
                        disabled={
                          deletingId !== null &&
                          deletingId === teacher.maGiaoVien
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Xóa ${teacher.hoTen}`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setViewingTeacher(teacher)}
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
              disabled={currentPage >= totalPages}
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

      {/* ===== Form thêm / sửa ===== */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4">
          <form
            onSubmit={isEditing ? handleUpdateTeacher : handleCreateTeacher}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  {isEditing ? "UpdateTeacherRequest" : "CreateTeacherRequest"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {isEditing ? "Cập nhật giáo viên" : "Thêm giáo viên"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeForm}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng form"
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
                    maxLength={50}
                    value={teacherForm.tenDangNhap}
                    onChange={setField("tenDangNhap")}
                    className={inputClass}
                  />
                </label>

                {/* Mật khẩu chỉ có khi thêm mới */}
                {!isEditing && (
                  <label className="block text-sm font-medium text-slate-600">
                    Mật khẩu
                    <input
                      required
                      minLength={6}
                      maxLength={100}
                      type="password"
                      value={teacherForm.matKhau}
                      onChange={setField("matKhau")}
                      className={inputClass}
                    />
                  </label>
                )}

                <label className="block text-sm font-medium text-slate-600">
                  Avatar URL
                  <input
                    type="url"
                    maxLength={500}
                    value={teacherForm.avatarUrl}
                    onChange={setField("avatarUrl")}
                    className={inputClass}
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
                    maxLength={100}
                    value={teacherForm.hoTen}
                    onChange={setField("hoTen")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Giới tính
                  <select
                    value={teacherForm.gioiTinh}
                    onChange={setField("gioiTinh")}
                    className={inputClass}
                  >
                    <option value="">Chưa cập nhật</option>
                    <option value="Nam">Nam</option>
                    <option value="Nu">Nữ</option>
                    <option value="Khac">Khác</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Ngày sinh
                  <input
                    type="date"
                    value={teacherForm.ngaySinh}
                    onChange={setField("ngaySinh")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Số điện thoại
                  <input
                    type="tel"
                    maxLength={20}
                    value={teacherForm.soDienThoai}
                    onChange={setField("soDienThoai")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Email
                  <input
                    type="email"
                    maxLength={100}
                    value={teacherForm.email}
                    onChange={setField("email")}
                    className={inputClass}
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
                      maxLength={100}
                      value={teacherForm.chuyenMon}
                      onChange={setField("chuyenMon")}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Ngày vào làm
                    <input
                      type="date"
                      value={teacherForm.ngayVaoLam}
                      onChange={setField("ngayVaoLam")}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600">
                    Lương theo giờ
                    <input
                      min="0"
                      step="0.01"
                      type="number"
                      value={teacherForm.luongTheoGio}
                      onChange={setField("luongTheoGio")}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm font-medium text-slate-600 sm:col-span-3">
                    Đang hoạt động
                    <select
                      value={teacherForm.dangHoatDong}
                      onChange={setField("dangHoatDong")}
                      className={inputClass}
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
                onClick={closeForm}
                disabled={isSubmitting}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting
                  ? "Đang lưu..."
                  : isEditing
                    ? "Lưu thay đổi"
                    : "Thêm giáo viên"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ===== Xem chi tiết ===== */}
      {viewingTeacher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-2xl font-bold text-violet-500">
                  {viewingTeacher.hoTen.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {viewingTeacher.hoTen}
                  </h3>
                  <span
                    className={[
                      "mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                      viewingTeacher.dangHoatDong
                        ? "bg-emerald-50 text-emerald-600"
                        : "bg-rose-50 text-rose-500",
                    ].join(" ")}
                  >
                    {viewingTeacher.dangHoatDong ? "Đang dạy" : "Nghỉ"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingTeacher(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <section className="rounded-2xl border border-violet-100 p-4">
                <h4 className="text-sm font-semibold text-violet-600">
                  Thông tin chung
                </h4>
                <dl className="mt-4 space-y-4">
                  <DetailItem
                    label="Tên đăng nhập"
                    value={viewingTeacher.tenDangNhap}
                  />
                  <DetailItem
                    label="Giới tính"
                    value={cleanValue(viewingTeacher.gioiTinh)}
                  />
                  <DetailItem
                    label="Ngày sinh"
                    value={formatDate(viewingTeacher.ngaySinh)}
                  />
                  <DetailItem
                    label="Số điện thoại"
                    value={cleanValue(viewingTeacher.soDienThoai)}
                  />
                  <DetailItem
                    label="Email"
                    value={cleanValue(viewingTeacher.email)}
                  />
                </dl>
              </section>

              <section className="rounded-2xl border border-violet-100 p-4">
                <h4 className="text-sm font-semibold text-violet-600">
                  Thông tin giáo viên
                </h4>
                <dl className="mt-4 space-y-4">
                  <DetailItem
                    label="Chuyên môn"
                    value={cleanValue(viewingTeacher.chuyenMon)}
                  />
                  <DetailItem
                    label="Ngày vào làm"
                    value={formatDate(viewingTeacher.ngayVaoLam)}
                  />
                  <DetailItem
                    label="Lương theo giờ"
                    value={formatMoney(viewingTeacher.luongTheoGio)}
                  />
                </dl>
              </section>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setViewingTeacher(null)}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const teacher = viewingTeacher;
                  setViewingTeacher(null);
                  openEditForm(teacher);
                }}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                Chỉnh sửa
              </button>
            </div>
          </div>
        </div>
      )}
    </PageShell>
  );
}
