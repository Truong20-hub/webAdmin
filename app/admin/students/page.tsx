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
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import * as XLSX from "xlsx";
import { PageShell } from "@/components/admin/PageShell";
import { apiRequest } from "@/api/client";

// Dòng hiển thị trong bảng
type Student = {
  maNguoiDung?: number;
  maHocVien?: number;
  tenDangNhap?: string;
  avatarUrl?: string | null;
  dangHoatDong?: boolean;
  hoTen: string;
  email: string;
  soDienThoai: string;
  maVaiTro: number;
  gioiTinh: string;
  ngaySinh: string;
  diaChi: string;
  tenPhuHuynh?: string;
  sdtPhuHuynh?: string;
  ngayNhapHoc?: string;
};

// Thông tin người dùng (khớp NguoiDungResponse của backend)
type NguoiDung = {
  maNguoiDung: number;
  matKhauHash?: string; // nên bỏ khỏi backend, không trả về client
  tenDangNhap: string;
  hoTen: string;
  email: string | null;
  soDienThoai: string | null;
  maVaiTro: number;
  tenVaiTro?: string | null;
  avatarUrl: string | null;
  dangHoatDong: boolean;
  ngayTao?: string; // ISO 8601
};

// Hồ sơ học viên
type HocVien = {
  maHocVien?: number;
  maNguoiDung: number;
  gioiTinh: string | null;
  ngaySinh: string | null;
  diaChi: string | null;
  tenPhuHuynh: string | null;
  sdtPhuHuynh: string | null;
  ngayNhapHoc: string | null;
};

// Dữ liệu của học viên đang được sửa
type EditingStudent = {
  nguoiDung: NguoiDung;
  hocVien: HocVien;
};

// Khớp với CreateNguoiDungRequest (C#)
export type CreateNguoiDungRequest = {
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  email?: string | null;
  soDienThoai?: string | null;
  maVaiTro: number;
  avatarUrl?: string | null;
};

// Khớp với CreateHocVienRequest (C#)
export type CreateHocVienRequest = {
  maNguoiDung: number;
  gioiTinh?: string | null;
  ngaySinh?: string | null; // "yyyy-MM-dd"
  diaChi?: string | null;
  tenPhuHuynh?: string | null;
  sdtPhuHuynh?: string | null;
  ngayNhapHoc?: string | null; // "yyyy-MM-dd"
};

// Khớp với UpdateNguoiDungRequest (C#) - không có mật khẩu
export type UpdateNguoiDungRequest = {
  tenDangNhap: string;
  hoTen: string;
  email?: string | null;
  soDienThoai?: string | null;
  maVaiTro: number;
  avatarUrl?: string | null;
  dangHoatDong?: boolean | null;
};

// Khớp với UpdateHocVienRequest (C#) - không có maNguoiDung
export type UpdateHocVienRequest = {
  gioiTinh?: string | null;
  ngaySinh?: string | null;
  diaChi?: string | null;
  tenPhuHuynh?: string | null;
  sdtPhuHuynh?: string | null;
  ngayNhapHoc?: string | null;
};

const initialStudents: Student[] = [];

const pageSize = 5;
const PLACEHOLDER = "Chưa cập nhật";

// Toàn bộ dữ liệu của form (dùng chung cho thêm mới và cập nhật)
type StudentForm = {
  tenDangNhap: string;
  matKhau: string; // chỉ dùng khi thêm mới
  hoTen: string;
  email: string;
  soDienThoai: string;
  maVaiTro: string;
  avatarUrl: string;
  dangHoatDong: string; // chỉ dùng khi cập nhật: "true" | "false"
  gioiTinh: string;
  ngaySinh: string;
  diaChi: string;
  tenPhuHuynh: string;
  sdtPhuHuynh: string;
  ngayNhapHoc: string;
};

const emptyStudentForm: StudentForm = {
  tenDangNhap: "",
  matKhau: "",
  hoTen: "",
  email: "",
  soDienThoai: "",
  maVaiTro: "3",
  avatarUrl: "",
  dangHoatDong: "true",
  gioiTinh: "",
  ngaySinh: "",
  diaChi: "",
  tenPhuHuynh: "",
  sdtPhuHuynh: "",
  ngayNhapHoc: "",
};

const inputClass =
  "mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal outline-none focus:border-violet-300";

// "Chưa cập nhật" chỉ là chữ hiển thị trong bảng, khi đổ vào form phải đổi lại thành rỗng
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

// Lấy giá trị ô đầu tiên có dữ liệu trong danh sách tên cột chấp nhận (dùng khi import Excel)
const getCell = (row: Record<string, unknown>, keys: string[]): unknown => {
  for (const key of keys) {
    const value = row[key];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return value;
    }
  }
  return "";
};

// Chuyển ô ngày của Excel (số / dd/MM/yyyy / yyyy-MM-dd) thành "yyyy-MM-dd"
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

// Hiển thị thông tin khi nhấn nút xem
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

// Backend có thể trả lỗi dạng JSON (ProblemDetails) -> lấy ra câu chữ dễ đọc
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

// Chuyển dữ liệu thô từ API /hocvien thành dòng của bảng
const mapStudent = (item: any): Student => ({
  maNguoiDung: item.maNguoiDung,
  maHocVien: item.maHocVien,
  tenDangNhap: item.tenDangNhap,
  avatarUrl: item.avatarUrl ?? null,
  dangHoatDong: item.dangHoatDong ?? true,
  hoTen: item.hoTen ?? PLACEHOLDER,
  email: item.email ?? PLACEHOLDER,
  soDienThoai: item.soDienThoai ?? PLACEHOLDER,
  maVaiTro: item.maVaiTro ?? 3,
  gioiTinh: item.gioiTinh ?? PLACEHOLDER,
  ngaySinh: item.ngaySinh ?? PLACEHOLDER,
  diaChi: item.diaChi ?? PLACEHOLDER,
  tenPhuHuynh: item.tenPhuHuynh ?? "",
  sdtPhuHuynh: item.sdtPhuHuynh ?? "",
  ngayNhapHoc: item.ngayNhapHoc ?? "",
});

export default function StudentManagementPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const requestId = useRef(0); // đếm lần gọi API để bỏ kết quả cũ trả về chậm
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<EditingStudent | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [studentForm, setStudentForm] = useState<StudentForm>(emptyStudentForm);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [viewingStudent, setViewingStudent] = useState<Student | null>(null);

  // Tìm kiếm: searchInput là chữ đang gõ, keyword là từ khóa của lần tìm gần nhất
  const [searchInput, setSearchInput] = useState("");
  const [keyword, setKeyword] = useState("");

  const isEditing = editingStudent !== null;

  // Tải danh sách học viên (kw rỗng = lấy tất cả)
  const loadStudents = useCallback(async (kw: string = "") => {
    const id = ++requestId.current;
    try {
      const url = kw
        ? `/hocvien/search?keyword=${encodeURIComponent(kw)}`
        : `/hocvien`;
      const data = await apiRequest<any[]>(url);
      if (id !== requestId.current) return; // đã có lần gọi mới hơn, bỏ qua
      setStudents(data.map(mapStudent));
    } catch (error) {
      if (id !== requestId.current) return;
      alert(getErrorMessage(error));
    }
  }, []);

  // Tự tìm khi gõ (chờ 400ms sau phím cuối). Cũng chạy lần đầu để tải danh sách.
  useEffect(() => {
    const timer = setTimeout(() => {
      const kw = searchInput.trim();
      setKeyword(kw);
      setCurrentPage(1);
      loadStudents(kw);
    }, 400);

    return () => clearTimeout(timer); // gõ tiếp thì hủy lần chờ trước
  }, [searchInput, loadStudents]);

  // Nhấn Enter hoặc bấm nút Tìm: tìm ngay, không chờ
  const handleSearch = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const kw = searchInput.trim();
    setKeyword(kw);
    setCurrentPage(1);
    await loadStudents(kw);
  };

  // Nút "Xóa tìm": chỉ cần xóa chữ, effect ở trên sẽ tự tải lại tất cả
  const handleClearSearch = () => {
    setSearchInput("");
  };

  const totalPages = Math.ceil(students.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentStudents = students.slice(startIndex, startIndex + pageSize);
  const openViewDetail = (student: Student) => setViewingStudent(student);
  const closeViewDetail = () => setViewingStudent(null);

  // Gộp việc cập nhật từng ô nhập thành một hàm dùng chung
  const setField =
    (key: keyof StudentForm) =>
    (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setStudentForm((prev) => ({ ...prev, [key]: event.target.value }));

  const closeForm = () => {
    setStudentForm(emptyStudentForm);
    setEditingStudent(null);
    setIsFormOpen(false);
  };

  const openCreateForm = () => {
    setEditingStudent(null);
    setStudentForm(emptyStudentForm);
    setIsFormOpen(true);
  };

  // Bấm nút bút chì: tách dòng thành {nguoiDung, hocVien} và đổ vào form để sửa
  const openEditForm = (student: Student) => {
    if (!student.maNguoiDung) {
      alert("Dòng này chưa lưu vào hệ thống nên không thể cập nhật.");
      return;
    }

    const nguoiDung: NguoiDung = {
      maNguoiDung: student.maNguoiDung,
      tenDangNhap: student.tenDangNhap ?? "",
      hoTen: cleanValue(student.hoTen),
      email: cleanValue(student.email) || null,
      soDienThoai: cleanValue(student.soDienThoai) || null,
      maVaiTro: student.maVaiTro,
      avatarUrl: student.avatarUrl ?? null,
      dangHoatDong: student.dangHoatDong ?? true,
    };

    const hocVien: HocVien = {
      maHocVien: student.maHocVien,
      maNguoiDung: student.maNguoiDung,
      gioiTinh: cleanValue(student.gioiTinh) || null,
      ngaySinh: toDateInput(student.ngaySinh) || null,
      diaChi: cleanValue(student.diaChi) || null,
      tenPhuHuynh: cleanValue(student.tenPhuHuynh) || null,
      sdtPhuHuynh: cleanValue(student.sdtPhuHuynh) || null,
      ngayNhapHoc: toDateInput(student.ngayNhapHoc) || null,
    };

    setEditingStudent({ nguoiDung, hocVien });
    setStudentForm({
      tenDangNhap: nguoiDung.tenDangNhap,
      matKhau: "",
      hoTen: nguoiDung.hoTen,
      email: nguoiDung.email ?? "",
      soDienThoai: nguoiDung.soDienThoai ?? "",
      maVaiTro: String(nguoiDung.maVaiTro),
      avatarUrl: nguoiDung.avatarUrl ?? "",
      dangHoatDong: String(nguoiDung.dangHoatDong),
      gioiTinh: hocVien.gioiTinh ?? "",
      ngaySinh: hocVien.ngaySinh ?? "",
      diaChi: hocVien.diaChi ?? "",
      tenPhuHuynh: hocVien.tenPhuHuynh ?? "",
      sdtPhuHuynh: hocVien.sdtPhuHuynh ?? "",
      ngayNhapHoc: hocVien.ngayNhapHoc ?? "",
    });
    setIsFormOpen(true);
  };

  const handleCreateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    let maNguoiDung: number | null = null;

    try {
      // Bước 1: tạo tài khoản người dùng
      const nguoiDungBody: CreateNguoiDungRequest = {
        tenDangNhap: studentForm.tenDangNhap.trim(),
        matKhau: studentForm.matKhau,
        hoTen: studentForm.hoTen.trim(),
        email: studentForm.email.trim() || null,
        soDienThoai: studentForm.soDienThoai.trim() || null,
        maVaiTro: Number(studentForm.maVaiTro),
        avatarUrl: studentForm.avatarUrl.trim() || null,
      };

      await apiRequest("/nguoidung", {
        method: "POST",
        body: nguoiDungBody,
      });

      // Lấy lại người dùng vừa tạo để có mã người dùng
      const user = await apiRequest<NguoiDung>(
        `/NguoiDung/by-username?namelogin=${encodeURIComponent(nguoiDungBody.tenDangNhap)}`,
      );
      const newMaNguoiDung = user?.maNguoiDung;
      if (!newMaNguoiDung) {
        throw new Error(
          "Đã tạo tài khoản nhưng không lấy được mã người dùng. Hãy kiểm tra API /NguoiDung/by-username.",
        );
      }
      maNguoiDung = newMaNguoiDung;

      // Bước 2: tạo hồ sơ học viên gắn với mã người dùng vừa tạo
      const hocVienBody: CreateHocVienRequest = {
        maNguoiDung: newMaNguoiDung,
        gioiTinh: studentForm.gioiTinh || null,
        ngaySinh: studentForm.ngaySinh || null,
        diaChi: studentForm.diaChi.trim() || null,
        tenPhuHuynh: studentForm.tenPhuHuynh.trim() || null,
        sdtPhuHuynh: studentForm.sdtPhuHuynh.trim() || null,
        ngayNhapHoc: studentForm.ngayNhapHoc || null,
      };

      await apiRequest("/hocvien", {
        method: "POST",
        body: hocVienBody,
      });

      // Tải lại danh sách (giữ từ khóa đang tìm) để dòng mới có đủ maNguoiDung + maHocVien
      await loadStudents(keyword);
      setCurrentPage(1);
      closeForm();
      alert("Thêm học viên thành công");
    } catch (error) {
      const message = getErrorMessage(error);
      alert(
        maNguoiDung
          ? `Đã tạo tài khoản nhưng thêm hồ sơ học viên thất bại: ${message}`
          : message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateStudent = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSubmitting || !editingStudent) return;

    const maNguoiDung = editingStudent.nguoiDung.maNguoiDung;
    const maHocVien = editingStudent.hocVien.maHocVien;

    // Kiểm tra trước khi gọi API để không bị cập nhật dở dang
    if (!maHocVien) {
      alert(
        "Không có mã học viên (API /hocvien chưa trả về maHocVien), không thể cập nhật hồ sơ.",
      );
      return;
    }

    setIsSubmitting(true);
    let nguoiDungUpdated = false;

    try {
      // Bước 1: cập nhật thông tin người dùng
      const nguoiDungBody: UpdateNguoiDungRequest = {
        tenDangNhap: studentForm.tenDangNhap.trim(),
        hoTen: studentForm.hoTen.trim(),
        email: studentForm.email.trim() || null,
        soDienThoai: studentForm.soDienThoai.trim() || null,
        maVaiTro: Number(studentForm.maVaiTro),
        avatarUrl: studentForm.avatarUrl.trim() || null,
        dangHoatDong: studentForm.dangHoatDong === "true",
      };

      await apiRequest(`/NguoiDung/${maNguoiDung}`, {
        method: "PUT",
        body: nguoiDungBody,
      });
      nguoiDungUpdated = true;

      // Bước 2: cập nhật hồ sơ học viên
      const hocVienBody: UpdateHocVienRequest = {
        gioiTinh: studentForm.gioiTinh || null,
        ngaySinh: studentForm.ngaySinh || null,
        diaChi: studentForm.diaChi.trim() || null,
        tenPhuHuynh: studentForm.tenPhuHuynh.trim() || null,
        sdtPhuHuynh: studentForm.sdtPhuHuynh.trim() || null,
        ngayNhapHoc: studentForm.ngayNhapHoc || null,
      };

      await apiRequest(`/hocvien/${maHocVien}`, {
        method: "PUT",
        body: hocVienBody,
      });

      // Cập nhật lại đúng dòng đó trong bảng
      setStudents((prev) =>
        prev.map((student) =>
          student.maNguoiDung === maNguoiDung
            ? {
                ...student,
                tenDangNhap: nguoiDungBody.tenDangNhap,
                avatarUrl: nguoiDungBody.avatarUrl,
                dangHoatDong: nguoiDungBody.dangHoatDong ?? true,
                hoTen: nguoiDungBody.hoTen,
                email: nguoiDungBody.email || PLACEHOLDER,
                soDienThoai: nguoiDungBody.soDienThoai || PLACEHOLDER,
                maVaiTro: nguoiDungBody.maVaiTro,
                gioiTinh: hocVienBody.gioiTinh || PLACEHOLDER,
                ngaySinh: hocVienBody.ngaySinh || PLACEHOLDER,
                diaChi: hocVienBody.diaChi || PLACEHOLDER,
                tenPhuHuynh: hocVienBody.tenPhuHuynh || "",
                sdtPhuHuynh: hocVienBody.sdtPhuHuynh || "",
                ngayNhapHoc: hocVienBody.ngayNhapHoc || "",
              }
            : student,
        ),
      );
      closeForm();
      alert("Cập nhật học viên thành công");
    } catch (error) {
      const message = getErrorMessage(error);
      alert(
        nguoiDungUpdated
          ? `Đã cập nhật thông tin người dùng nhưng cập nhật hồ sơ học viên thất bại: ${message}`
          : message,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStudent = async (student: Student) => {
    const confirmed = window.confirm(
      `Bạn có chắc muốn xóa học viên "${student.hoTen}"? Thao tác này không thể hoàn tác.`,
    );
    if (!confirmed) return;

    // Dòng chưa lưu vào hệ thống -> chỉ xóa trên màn hình
    if (!student.maNguoiDung) {
      setStudents((prev) => prev.filter((item) => item !== student));
      return;
    }

    const maNguoiDung = student.maNguoiDung;
    const maHocVien = student.maHocVien;

    // Không dùng mã người dùng thay thế để tránh xóa nhầm hồ sơ khác
    if (!maHocVien) {
      alert(
        "Không có mã học viên (API /hocvien chưa trả về maHocVien), không thể xóa.",
      );
      return;
    }

    // Bỏ dòng khỏi bảng và lùi trang nếu trang hiện tại bị trống
    const removeFromList = () => {
      const remaining = students.filter(
        (item) => item.maNguoiDung !== maNguoiDung,
      );
      setStudents(remaining);
      setCurrentPage((page) =>
        Math.min(page, Math.max(1, Math.ceil(remaining.length / pageSize))),
      );
    };

    setDeletingId(maNguoiDung);
    let hocVienDeleted = false;

    try {
      // Bước 1: xóa hồ sơ học viên (phải xóa trước vì nó tham chiếu tới người dùng)
      await apiRequest(`/hocvien/${maHocVien}`, { method: "DELETE" });
      hocVienDeleted = true;

      // Bước 2: xóa tài khoản người dùng
      await apiRequest(`/NguoiDung/${maNguoiDung}`, { method: "DELETE" });

      removeFromList();
      alert("Đã xóa học viên");
    } catch (error) {
      const message = getErrorMessage(error);
      if (hocVienDeleted) {
        removeFromList(); // hồ sơ học viên đã mất nên danh sách không còn dòng này
        alert(
          `Đã xóa hồ sơ học viên nhưng xóa tài khoản người dùng thất bại: ${message}`,
        );
      } else {
        alert(message);
      }
    } finally {
      setDeletingId(null);
    }
  };

  // Import Excel: mỗi dòng đi qua 3 bước giống form "Thêm học viên" và lưu vào database
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

      // Làm lần lượt từng dòng (không chạy song song) để tránh lỗi trùng/tranh chấp
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const line = i + 2; // dòng 1 là tiêu đề

        const text = (keys: string[]) => String(getCell(row, keys)).trim();

        const tenDangNhap = text(["tenDangNhap", "username", "Tên đăng nhập"]);
        const matKhau = text(["matKhau", "password", "Mật khẩu"]);
        const hoTen = text(["hoTen", "fullName", "Họ tên"]);

        if (!tenDangNhap || !matKhau || !hoTen) {
          errors.push(`Dòng ${line}: thiếu tenDangNhap, matKhau hoặc hoTen`);
          continue;
        }

        const maVaiTro = Number(
          getCell(row, ["maVaiTro", "role", "Mã vai trò"]) || 3,
        );

        const nguoiDungBody: CreateNguoiDungRequest = {
          tenDangNhap,
          matKhau,
          hoTen,
          email: text(["email", "Email"]) || null,
          soDienThoai:
            text(["soDienThoai", "phone", "SĐT", "Số điện thoại"]) || null,
          maVaiTro: Number.isFinite(maVaiTro) ? maVaiTro : 3,
          avatarUrl: null,
        };

        let userCreated = false;
        try {
          // Bước 1: tạo tài khoản
          await apiRequest("/nguoidung", {
            method: "POST",
            body: nguoiDungBody,
          });
          userCreated = true;

          // Bước 2: lấy mã người dùng vừa tạo
          const user = await apiRequest<NguoiDung>(
            `/NguoiDung/by-username?namelogin=${encodeURIComponent(tenDangNhap)}`,
          );
          if (!user?.maNguoiDung) {
            throw new Error("Không lấy được mã người dùng");
          }

          // Bước 3: tạo hồ sơ học viên
          const hocVienBody: CreateHocVienRequest = {
            maNguoiDung: user.maNguoiDung,
            gioiTinh: text(["gioiTinh", "gender", "Giới tính"]) || null,
            ngaySinh: toIsoDate(
              getCell(row, ["ngaySinh", "birthday", "Ngày sinh"]),
            ),
            diaChi: text(["diaChi", "address", "Địa chỉ"]) || null,
            tenPhuHuynh: text(["tenPhuHuynh", "Tên phụ huynh"]) || null,
            sdtPhuHuynh: text(["sdtPhuHuynh", "SĐT phụ huynh"]) || null,
            ngayNhapHoc: toIsoDate(
              getCell(row, ["ngayNhapHoc", "Ngày nhập học"]),
            ),
          };
          await apiRequest("/hocvien", { method: "POST", body: hocVienBody });

          success++;
        } catch (error) {
          const prefix = userCreated
            ? "đã tạo tài khoản nhưng lỗi hồ sơ học viên: "
            : "";
          errors.push(
            `Dòng ${line} (${tenDangNhap}): ${prefix}${getErrorMessage(error)}`,
          );
        }
      }

      // Tải lại danh sách để có đủ maNguoiDung + maHocVien
      await loadStudents(keyword);
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
      event.target.value = ""; // cho phép chọn lại cùng một file
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
            disabled={isImporting}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FileUp className="h-4 w-4" />
            {isImporting ? "Đang import..." : "Import Excel"}
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

          {/* Tự tìm khi gõ (debounce 400ms); Enter hoặc nút Tìm để tìm ngay */}
          <form onSubmit={handleSearch} className="flex items-center gap-2">
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
          </form>
        </div>

        <div className="mt-5 w-full overflow-x-auto">
          <table className="w-full min-w-[980px] border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-3 py-3 text-left font-semibold">Họ tên</th>
                <th className="px-3 py-3 text-left font-semibold">Email</th>
                <th className="px-3 py-3 text-left font-semibold">SĐT</th>
                <th className="px-3 py-3 text-left font-semibold">Giới tính</th>
                <th className="px-3 py-3 text-left font-semibold">Ngày sinh</th>
                <th className="px-3 py-3 text-left font-semibold">Địa chỉ</th>
                <th className="px-3 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {currentStudents.map((student, index) => (
                <tr
                  key={`${student.maNguoiDung ?? student.email}-${index}`}
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
                        onClick={() => openEditForm(student)}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                        aria-label={`Cập nhật ${student.hoTen}`}
                        title="Update"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteStudent(student)}
                        disabled={
                          deletingId !== null &&
                          deletingId === student.maNguoiDung
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-40"
                        aria-label={`Xóa ${student.hoTen}`}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => openViewDetail(student)}
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

      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4">
          <form
            onSubmit={isEditing ? handleUpdateStudent : handleCreateStudent}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  {isEditing
                    ? "UpdateNguoiDungRequest + UpdateHocVienRequest"
                    : "CreateNguoiDungRequest + CreateHocVienRequest"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {isEditing ? "Cập nhật học viên" : "Thêm học viên"}
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
              {/* ===== Phần 1: người dùng ===== */}
              <fieldset className="space-y-4 rounded-2xl border border-violet-100 p-4">
                <legend className="px-2 text-sm font-semibold text-violet-600">
                  Thông tin người dùng
                </legend>
                <label className="block text-sm font-medium text-slate-600">
                  Tên đăng nhập
                  <input
                    required
                    maxLength={50}
                    value={studentForm.tenDangNhap}
                    onChange={setField("tenDangNhap")}
                    className={inputClass}
                  />
                </label>

                {/* Mật khẩu chỉ có khi thêm mới (UpdateNguoiDungRequest không có mật khẩu) */}
                {!isEditing && (
                  <label className="block text-sm font-medium text-slate-600">
                    Mật khẩu
                    <input
                      required
                      minLength={6}
                      maxLength={100}
                      type="password"
                      value={studentForm.matKhau}
                      onChange={setField("matKhau")}
                      className={inputClass}
                    />
                  </label>
                )}

                <label className="block text-sm font-medium text-slate-600">
                  Họ tên
                  <input
                    required
                    maxLength={100}
                    value={studentForm.hoTen}
                    onChange={setField("hoTen")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Email
                  <input
                    type="email"
                    maxLength={100}
                    value={studentForm.email}
                    onChange={setField("email")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Số điện thoại
                  <input
                    type="tel"
                    maxLength={20}
                    value={studentForm.soDienThoai}
                    onChange={setField("soDienThoai")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Avatar URL
                  <input
                    type="url"
                    maxLength={500}
                    value={studentForm.avatarUrl}
                    onChange={setField("avatarUrl")}
                    className={inputClass}
                  />
                </label>

                {/* Trạng thái hoạt động chỉ có khi cập nhật */}
                {isEditing && (
                  <label className="block text-sm font-medium text-slate-600">
                    Đang hoạt động
                    <select
                      value={studentForm.dangHoatDong}
                      onChange={setField("dangHoatDong")}
                      className={inputClass}
                    >
                      <option value="true">Có</option>
                      <option value="false">Không</option>
                    </select>
                  </label>
                )}
              </fieldset>

              {/* ===== Phần 2: học viên ===== */}
              <fieldset className="space-y-4 rounded-2xl border border-violet-100 p-4">
                <legend className="px-2 text-sm font-semibold text-violet-600">
                  Thông tin học viên
                </legend>
                <label className="block text-sm font-medium text-slate-600">
                  Giới tính
                  <select
                    value={studentForm.gioiTinh}
                    onChange={setField("gioiTinh")}
                    className={inputClass}
                  >
                    <option value="">Chưa cập nhật</option>
                    <option value="Nam">Nam</option>
                    <option value="Nữ">Nữ</option>
                    <option value="Khác">Khác</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Ngày sinh
                  <input
                    type="date"
                    value={studentForm.ngaySinh}
                    onChange={setField("ngaySinh")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Địa chỉ
                  <input
                    maxLength={255}
                    value={studentForm.diaChi}
                    onChange={setField("diaChi")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Tên phụ huynh
                  <input
                    maxLength={100}
                    value={studentForm.tenPhuHuynh}
                    onChange={setField("tenPhuHuynh")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  SĐT phụ huynh
                  <input
                    type="tel"
                    maxLength={20}
                    value={studentForm.sdtPhuHuynh}
                    onChange={setField("sdtPhuHuynh")}
                    className={inputClass}
                  />
                </label>
                <label className="block text-sm font-medium text-slate-600">
                  Ngày nhập học
                  <input
                    type="date"
                    value={studentForm.ngayNhapHoc}
                    onChange={setField("ngayNhapHoc")}
                    className={inputClass}
                  />
                </label>
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
                    : "Thêm học viên"}
              </button>
            </div>
          </form>
        </div>
      )}

      {viewingStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                {viewingStudent.avatarUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={viewingStudent.avatarUrl}
                    alt={viewingStudent.hoTen}
                    className="h-16 w-16 rounded-2xl object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50 text-2xl font-bold text-violet-500">
                    {viewingStudent.hoTen.charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-800">
                    {viewingStudent.hoTen}
                  </h3>
                  <span
                    className={[
                      "mt-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-medium",
                      viewingStudent.dangHoatDong === false
                        ? "bg-rose-50 text-rose-500"
                        : "bg-emerald-50 text-emerald-600",
                    ].join(" ")}
                  >
                    {viewingStudent.dangHoatDong === false
                      ? "Ngừng hoạt động"
                      : "Đang hoạt động"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={closeViewDetail}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <section className="rounded-2xl border border-violet-100 p-4">
                <h4 className="text-sm font-semibold text-violet-600">
                  Thông tin người dùng
                </h4>
                <dl className="mt-4 space-y-4">
                  <DetailItem
                    label="Tên đăng nhập"
                    value={viewingStudent.tenDangNhap}
                  />
                  <DetailItem
                    label="Email"
                    value={cleanValue(viewingStudent.email)}
                  />
                  <DetailItem
                    label="Số điện thoại"
                    value={cleanValue(viewingStudent.soDienThoai)}
                  />
                </dl>
              </section>

              <section className="rounded-2xl border border-violet-100 p-4">
                <h4 className="text-sm font-semibold text-violet-600">
                  Thông tin học viên
                </h4>
                <dl className="mt-4 space-y-4">
                  <DetailItem
                    label="Giới tính"
                    value={cleanValue(viewingStudent.gioiTinh)}
                  />
                  <DetailItem
                    label="Ngày sinh"
                    value={formatDate(viewingStudent.ngaySinh)}
                  />
                  <DetailItem
                    label="Địa chỉ"
                    value={cleanValue(viewingStudent.diaChi)}
                  />
                  <DetailItem
                    label="Tên phụ huynh"
                    value={viewingStudent.tenPhuHuynh}
                  />
                  <DetailItem
                    label="SĐT phụ huynh"
                    value={viewingStudent.sdtPhuHuynh}
                  />
                  <DetailItem
                    label="Ngày nhập học"
                    value={formatDate(viewingStudent.ngayNhapHoc)}
                  />
                </dl>
              </section>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeViewDetail}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Đóng
              </button>
              <button
                type="button"
                onClick={() => {
                  const student = viewingStudent;
                  closeViewDetail();
                  openEditForm(student);
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
