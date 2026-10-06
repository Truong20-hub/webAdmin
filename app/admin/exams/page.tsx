"use client";

import {
  CalendarDays,
  ClipboardCheck,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/api/client";
import { PageShell } from "@/components/admin/PageShell";

type Exam = {
  maKyThi: number;
  maLop: number;
  maLopCode?: string | null;
  tenLop?: string | null;
  tenKyThi: string;
  ngayThi?: string | null;
  loaiKyThi?: string | null;
  diemToiDa?: number | null;
};

type ClassInfo = {
  maLop: number;
  maLopCode: string;
  tenLop: string;
};

type ListResponse<T> = T[] | { data?: T[] };
type ExamForm = {
  maLop: string;
  tenKyThi: string;
  ngayThi: string;
  loaiKyThi: string;
  diemToiDa: string;
};

const examTypes = [
  { value: "QuizNgan", label: "Kiểm tra" },
  { value: "GiuaKy", label: "Giữa kỳ" },
  { value: "CuoiKy", label: "Cuối kỳ" },
  { value: "Mock", label: "Thi thử" },
];
const pageSize = 8;
const emptyForm: ExamForm = {
  maLop: "",
  tenKyThi: "",
  ngayThi: "",
  loaiKyThi: "QuizNgan",
  diemToiDa: "10",
};

function unwrapList<T>(response: ListResponse<T>, name: string): T[] {
  const items = Array.isArray(response) ? response : response.data;
  if (!Array.isArray(items)) throw new Error(`Dữ liệu ${name} từ API không hợp lệ.`);
  return items;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .trim();
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message) return fallback;
  try {
    const body = JSON.parse(error.message) as {
      message?: string;
      title?: string;
    };
    return body.message ?? body.title ?? fallback;
  } catch {
    return error.message.split("\n")[0] || fallback;
  }
}

function formatDate(value?: string | null): string {
  if (!value) return "Chưa xếp lịch";
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function examTypeLabel(value?: string | null): string {
  return examTypes.find((type) => type.value === value)?.label ?? value ?? "Chưa phân loại";
}

export default function ExamManagementPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<Exam | null>(null);
  const [examForm, setExamForm] = useState<ExamForm>(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [examResponse, classResponse] = await Promise.all([
        apiRequest<ListResponse<Exam>>("/KyThi"),
        apiRequest<ListResponse<ClassInfo>>("/LopHoc"),
      ]);
      setExams(unwrapList(examResponse, "kỳ thi"));
      setClasses(unwrapList(classResponse, "lớp học"));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Không thể tải danh sách kỳ thi."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadData);
  }, [loadData]);

  const classesById = useMemo(
    () => new Map(classes.map((item) => [item.maLop, item])),
    [classes],
  );

  const filteredExams = useMemo(() => {
    const keyword = normalizeSearchText(searchTerm);
    return exams.filter((exam) => {
      const classInfo = classesById.get(exam.maLop);
      const searchableText = normalizeSearchText([
        exam.maKyThi,
        exam.maLop,
        exam.tenKyThi,
        exam.tenLop,
        exam.maLopCode,
        examTypeLabel(exam.loaiKyThi),
        exam.ngayThi ? formatDate(exam.ngayThi) : "",
        exam.ngayThi ?? "",
        exam.diemToiDa ?? "",
        classInfo?.tenLop,
        classInfo?.maLopCode,
      ].join(" "));

      return (!keyword || searchableText.includes(keyword)) &&
        (classFilter === "all" || String(exam.maLop) === classFilter) &&
        (typeFilter === "all" || exam.loaiKyThi === typeFilter);
    });
  }, [classFilter, classesById, exams, searchTerm, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredExams.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentExams = filteredExams.slice(startIndex, startIndex + pageSize);
  const upcomingExams = exams.filter(
    (exam) => exam.ngayThi && exam.ngayThi.slice(0, 10) >= new Date().toISOString().slice(0, 10),
  ).length;

  const openCreateForm = () => {
    setEditingExam(null);
    setExamForm({
      ...emptyForm,
      maLop: classes[0] ? String(classes[0].maLop) : "",
    });
    setFormError("");
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openEditForm = (exam: Exam) => {
    setEditingExam(exam);
    setExamForm({
      maLop: String(exam.maLop),
      tenKyThi: exam.tenKyThi,
      ngayThi: exam.ngayThi?.slice(0, 10) ?? "",
      loaiKyThi: exam.loaiKyThi ?? "",
      diemToiDa: exam.diemToiDa?.toString() ?? "",
    });
    setFormError("");
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;
    setIsFormOpen(false);
    setEditingExam(null);
    setExamForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");
    setErrorMessage("");
    try {
      await apiRequest(
        editingExam ? `/KyThi/${editingExam.maKyThi}` : "/KyThi",
        {
          method: editingExam ? "PUT" : "POST",
          body: {
            maLop: Number(examForm.maLop),
            tenKyThi: examForm.tenKyThi.trim(),
            ngayThi: examForm.ngayThi || null,
            loaiKyThi: examForm.loaiKyThi || null,
            diemToiDa: examForm.diemToiDa ? Number(examForm.diemToiDa) : null,
          },
        },
      );
      setIsFormOpen(false);
      setEditingExam(null);
      setExamForm(emptyForm);
      await loadData();
    } catch (error) {
      setFormError(
        getErrorMessage(error, editingExam ? "Không thể cập nhật kỳ thi." : "Không thể tạo kỳ thi."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (exam: Exam) => {
    if (!window.confirm(`Bạn có chắc muốn xóa kỳ thi "${exam.tenKyThi}"?`)) return;
    setDeletingId(exam.maKyThi);
    setErrorMessage("");
    try {
      await apiRequest(`/KyThi/${exam.maKyThi}`, { method: "DELETE" });
      await loadData();
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Không thể xóa kỳ thi. Có thể kỳ thi đã có điểm thi liên kết."),
      );
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <PageShell
      title="Quản lý lịch thi"
      description="Lập và theo dõi lịch kiểm tra, giữa kỳ, cuối kỳ và thi thử theo từng lớp"
      action={
        <button
          type="button"
          onClick={openCreateForm}
          disabled={!classes.length}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Thêm lịch thi
        </button>
      }
    >
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        {[
          { label: "Tổng kỳ thi", value: exams.length, note: "Đang quản lý", icon: ClipboardCheck },
          { label: "Sắp diễn ra", value: upcomingExams, note: "Có ngày thi trong tương lai", icon: CalendarDays },
          { label: "Các lớp", value: new Set(exams.map((exam) => exam.maLop)).size, note: "Có kỳ thi", icon: ClipboardCheck },
        ].map(({ label, value, note, icon: Icon }) => (
          <div key={label} className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]">
            <div className="flex items-center justify-between">
              <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-200 via-violet-100 to-pink-100">
                <Icon className="h-5 w-5 text-slate-700" />
              </span>
              <span className="text-xs text-violet-500">{note}</span>
            </div>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-800">{value.toLocaleString("vi-VN")}</p>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage("")} aria-label="Đóng thông báo lỗi">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="mb-4 flex flex-col gap-3">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Danh sách lịch thi</h3>
            <p className="mt-1 text-sm text-slate-500">{filteredExams.length.toLocaleString("vi-VN")} kỳ thi</p>
          </div>
          <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(180px,220px)_minmax(150px,190px)]">
            <label className="relative block">
              <span className="sr-only">Tìm kiếm kỳ thi</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }}
                placeholder="Tìm tên kỳ thi, lớp, ngày hoặc loại thi..."
                className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none transition focus:border-violet-300"
              />
              {searchTerm && (
                <button type="button" onClick={() => { setSearchTerm(""); setCurrentPage(1); }} aria-label="Xóa từ khóa tìm kiếm" className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-violet-100 hover:text-violet-700">
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
            <select
              value={classFilter}
              onChange={(event) => { setClassFilter(event.target.value); setCurrentPage(1); }}
              aria-label="Lọc theo lớp"
              className="rounded-full border border-violet-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-300"
            >
              <option value="all">Tất cả lớp</option>
              {classes.map((item) => (
                <option key={item.maLop} value={item.maLop}>
                  {item.maLopCode ? `${item.maLopCode} · ` : ""}{item.tenLop}
                </option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(event) => { setTypeFilter(event.target.value); setCurrentPage(1); }}
              aria-label="Lọc theo loại kỳ thi"
              className="rounded-full border border-violet-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-300"
            >
              <option value="all">Tất cả loại thi</option>
              {examTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="px-3 py-2 font-semibold">Kỳ thi</th>
                <th className="px-3 py-2 font-semibold">Lớp học</th>
                <th className="px-3 py-2 font-semibold">Ngày thi</th>
                <th className="px-3 py-2 font-semibold">Loại kỳ thi</th>
                <th className="px-3 py-2 text-right font-semibold">Điểm tối đa</th>
                <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className="px-3 py-10 text-center text-slate-500">Đang tải lịch thi...</td></tr>
              ) : currentExams.length ? currentExams.map((exam) => {
                const classInfo = classesById.get(exam.maLop);
                return (
                  <tr key={exam.maKyThi} className="bg-slate-50 text-sm text-slate-700 shadow-sm">
                    <td className="rounded-l-2xl px-3 py-3">
                      <div className="flex items-center gap-3">
                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                          <ClipboardCheck className="h-5 w-5" />
                        </span>
                        <div>
                          <p className="font-semibold text-slate-800">{exam.tenKyThi}</p>
                          <p className="mt-1 text-xs text-slate-400">Mã kỳ thi: {exam.maKyThi}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium">{exam.tenLop ?? classInfo?.tenLop ?? `Lớp ${exam.maLop}`}</p>
                      <p className="mt-1 text-xs text-slate-400">{exam.maLopCode ?? classInfo?.maLopCode ?? `Mã lớp ${exam.maLop}`}</p>
                    </td>
                    <td className="px-3 py-3">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap">
                        <CalendarDays className="h-4 w-4 text-violet-400" />
                        {formatDate(exam.ngayThi)}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      {exam.loaiKyThi
                        ? <span className="inline-flex rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">{examTypeLabel(exam.loaiKyThi)}</span>
                        : <span className="text-slate-400">Chưa phân loại</span>}
                    </td>
                    <td className="px-3 py-3 text-right">
                      {exam.diemToiDa != null ? exam.diemToiDa.toLocaleString("vi-VN") : "--"}
                    </td>
                    <td className="rounded-r-2xl px-3 py-3 text-right whitespace-nowrap">
                      <button type="button" onClick={() => openEditForm(exam)} aria-label={`Cập nhật kỳ thi ${exam.tenKyThi}`} title="Cập nhật" className="rounded-lg p-2 text-violet-600 transition hover:bg-violet-100">
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button type="button" onClick={() => void handleDelete(exam)} disabled={deletingId === exam.maKyThi} aria-label={`Xóa kỳ thi ${exam.tenKyThi}`} title="Xóa" className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 disabled:opacity-50">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="px-3 py-12 text-center">
                    <ClipboardCheck className="mx-auto h-8 w-8 text-violet-300" />
                    <p className="mt-2 font-medium text-slate-600">
                      {searchTerm || classFilter !== "all" || typeFilter !== "all"
                        ? "Không tìm thấy kỳ thi phù hợp."
                        : "Chưa có lịch thi nào."}
                    </p>
                    {!searchTerm && classFilter === "all" && typeFilter === "all" && classes.length > 0 && (
                      <button type="button" onClick={openCreateForm} className="mt-3 text-sm font-semibold text-violet-600 hover:text-violet-700">
                        Tạo lịch thi đầu tiên
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && filteredExams.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-violet-50 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Hiển thị {startIndex + 1}–{Math.min(startIndex + pageSize, filteredExams.length)} trong {filteredExams.length}
            </p>
            <div className="flex items-center gap-2">
              <button type="button" onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={safePage <= 1} className="rounded-full border border-violet-100 px-4 py-2 text-sm text-slate-600 hover:bg-violet-50 disabled:opacity-40">Trước</button>
              <span className="min-w-20 text-center text-sm text-slate-500">{safePage} / {totalPages}</span>
              <button type="button" onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={safePage >= totalPages} className="rounded-full border border-violet-100 px-4 py-2 text-sm text-slate-600 hover:bg-violet-50 disabled:opacity-40">Sau</button>
            </div>
          </div>
        )}
      </section>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => { if (event.target === event.currentTarget) closeForm(); }}
        >
          <section role="dialog" aria-modal="true" aria-labelledby="exam-form-title" className="my-auto w-full max-w-xl rounded-[28px] border border-violet-100 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Thông tin kỳ thi</p>
                <h3 id="exam-form-title" className="mt-1 text-xl font-bold text-slate-800">
                  {editingExam ? "Cập nhật lịch thi" : "Thêm lịch thi"}
                </h3>
              </div>
              <button type="button" onClick={closeForm} disabled={isSaving} aria-label="Đóng biểu mẫu" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Lớp học <span className="text-rose-500">*</span></span>
                <select required value={examForm.maLop} onChange={(event) => setExamForm((form) => ({ ...form, maLop: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300">
                  <option value="" disabled>Chọn lớp học</option>
                  {classes.map((item) => <option key={item.maLop} value={item.maLop}>{item.maLopCode ? `${item.maLopCode} · ` : ""}{item.tenLop}</option>)}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Tên kỳ thi <span className="text-rose-500">*</span></span>
                <input required maxLength={150} value={examForm.tenKyThi} onChange={(event) => setExamForm((form) => ({ ...form, tenKyThi: event.target.value }))} placeholder="Ví dụ: Kiểm tra Unit 3" className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Ngày thi</span>
                  <input type="date" value={examForm.ngayThi} onChange={(event) => setExamForm((form) => ({ ...form, ngayThi: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-slate-700">Loại kỳ thi</span>
                  <select value={examForm.loaiKyThi} onChange={(event) => setExamForm((form) => ({ ...form, loaiKyThi: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300">
                    <option value="">Chưa phân loại</option>
                    {examTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                  </select>
                </label>
              </div>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Điểm tối đa</span>
                <input type="number" min="0.01" max="999.99" step="0.01" value={examForm.diemToiDa} onChange={(event) => setExamForm((form) => ({ ...form, diemToiDa: event.target.value }))} placeholder="Ví dụ: 10" className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
              </label>
              <div className="flex flex-col-reverse gap-2 border-t border-violet-50 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeForm} disabled={isSaving} className="rounded-full border border-violet-100 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Hủy</button>
                <button type="submit" disabled={isSaving || !classes.length} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(168,85,247,0.18)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
                  {isSaving ? "Đang lưu..." : editingExam ? "Lưu thay đổi" : "Tạo lịch thi"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </PageShell>
  );
}
