"use client";

import {
  CalendarDays,
  Check,
  Clock3,
  Edit3,
  MapPin,
  Plus,
  Search,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/api/client";
import { PageShell } from "@/components/admin/PageShell";

type ScheduleMode = "weekly" | "teaching";
type Schedule = {
  maLich: number;
  maLop: number;
  maLopCode?: string | null;
  tenLop?: string | null;
  thuTrongTuan: string;
  gioBatDau: string;
  gioKetThuc: string;
};
type TeachingSession = {
  maBuoi: number;
  maLop: number;
  maLopCode?: string | null;
  tenLop?: string | null;
  ngayHoc: string;
  gioBatDau?: string | null;
  gioKetThuc?: string | null;
  noiDung?: string | null;
  biHuy?: boolean | null;
};
type ClassInfo = {
  maLop: number;
  maLopCode: string;
  tenLop: string;
  tenGiaoVien?: string | null;
  tenPhong?: string | null;
};
type ListResponse<T> = T[] | { data?: T[] };
type ScheduleForm = {
  maLop: string;
  thuTrongTuan: string;
  gioBatDau: string;
  gioKetThuc: string;
};
type TeachingForm = {
  maLop: string;
  ngayHoc: string;
  gioBatDau: string;
  gioKetThuc: string;
  noiDung: string;
  biHuy: string;
};

const weekDays = [
  { value: "T2", label: "Thứ Hai" },
  { value: "T3", label: "Thứ Ba" },
  { value: "T4", label: "Thứ Tư" },
  { value: "T5", label: "Thứ Năm" },
  { value: "T6", label: "Thứ Sáu" },
  { value: "T7", label: "Thứ Bảy" },
  { value: "CN", label: "Chủ Nhật" },
];
const pageSize = 8;
const emptyScheduleForm: ScheduleForm = {
  maLop: "",
  thuTrongTuan: "T2",
  gioBatDau: "",
  gioKetThuc: "",
};
const emptyTeachingForm: TeachingForm = {
  maLop: "",
  ngayHoc: "",
  gioBatDau: "",
  gioKetThuc: "",
  noiDung: "",
  biHuy: "false",
};

function unwrapList<T>(response: ListResponse<T>, name: string): T[] {
  const items = Array.isArray(response) ? response : response.data;
  if (!Array.isArray(items)) throw new Error(`Dữ liệu ${name} từ API không hợp lệ.`);
  return items;
}

function timeValue(value?: string | null): string {
  return value?.slice(0, 5) ?? "";
}

function displayTime(value?: string | null): string {
  const time = timeValue(value);
  return time || "--:--";
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

function formatDate(value: string): string {
  const [year, month, day] = value.slice(0, 10).split("-");
  return year && month && day ? `${day}/${month}/${year}` : value;
}

function normalizeSearchText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("vi")
    .trim();
}

export default function ScheduleManagementPage() {
  const [mode, setMode] = useState<ScheduleMode>("weekly");
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [sessions, setSessions] = useState<TeachingSession[]>([]);
  const [classes, setClasses] = useState<ClassInfo[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const [editingSession, setEditingSession] = useState<TeachingSession | null>(null);
  const [scheduleForm, setScheduleForm] = useState<ScheduleForm>(emptyScheduleForm);
  const [teachingForm, setTeachingForm] = useState<TeachingForm>(emptyTeachingForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const [scheduleResponse, sessionResponse, classResponse] = await Promise.all([
        apiRequest<ListResponse<Schedule>>("/LichHoc"),
        apiRequest<ListResponse<TeachingSession>>("/BuoiHoc"),
        apiRequest<ListResponse<ClassInfo>>("/LopHoc"),
      ]);
      setSchedules(unwrapList(scheduleResponse, "lịch học"));
      setSessions(unwrapList(sessionResponse, "lịch dạy"));
      setClasses(unwrapList(classResponse, "lớp học"));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Không thể tải dữ liệu lịch học và lịch dạy."));
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

  const filteredSchedules = useMemo(() => {
    const keyword = normalizeSearchText(searchTerm);
    return schedules.filter((item) => {
      const classInfo = classesById.get(item.maLop);
      const text = [
        item.maLich.toString(),
        item.maLop.toString(),
        item.tenLop,
        item.maLopCode,
        classInfo?.tenLop,
        classInfo?.maLopCode,
        classInfo?.tenGiaoVien,
        classInfo?.tenPhong,
        item.thuTrongTuan,
        weekDays.find((day) => day.value === item.thuTrongTuan)?.label,
        displayTime(item.gioBatDau),
        displayTime(item.gioKetThuc),
      ].join(" ").toLocaleLowerCase("vi");
      return !keyword || normalizeSearchText(text).includes(keyword);
    });
  }, [classesById, schedules, searchTerm]);

  const filteredSessions = useMemo(() => {
    const keyword = normalizeSearchText(searchTerm);
    return sessions.filter((item) => {
      const classInfo = classesById.get(item.maLop);
      const text = [
        item.maBuoi.toString(),
        item.maLop.toString(),
        item.tenLop,
        item.maLopCode,
        classInfo?.tenLop,
        classInfo?.maLopCode,
        classInfo?.tenGiaoVien,
        classInfo?.tenPhong,
        item.noiDung,
        item.ngayHoc,
        formatDate(item.ngayHoc),
        displayTime(item.gioBatDau),
        displayTime(item.gioKetThuc),
        item.biHuy ? "da huy bi huy huy" : "da len lich chua huy",
      ].join(" ").toLocaleLowerCase("vi");
      return (!keyword || normalizeSearchText(text).includes(keyword)) &&
        (statusFilter === "all" || String(Boolean(item.biHuy)) === statusFilter);
    });
  }, [classesById, searchTerm, sessions, statusFilter]);

  const visibleCount = mode === "weekly" ? filteredSchedules.length : filteredSessions.length;
  const totalPages = Math.max(1, Math.ceil(visibleCount / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const currentSchedules = filteredSchedules.slice((safePage - 1) * pageSize, safePage * pageSize);
  const currentSessions = filteredSessions.slice((safePage - 1) * pageSize, safePage * pageSize);

  const openCreateForm = () => {
    setEditingSchedule(null);
    setEditingSession(null);
    setScheduleForm({
      ...emptyScheduleForm,
      maLop: classes[0] ? String(classes[0].maLop) : "",
    });
    setTeachingForm({
      ...emptyTeachingForm,
      maLop: classes[0] ? String(classes[0].maLop) : "",
    });
    setFormError("");
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openScheduleEditor = (item: Schedule) => {
    setEditingSchedule(item);
    setEditingSession(null);
    setScheduleForm({
      maLop: String(item.maLop),
      thuTrongTuan: item.thuTrongTuan,
      gioBatDau: timeValue(item.gioBatDau),
      gioKetThuc: timeValue(item.gioKetThuc),
    });
    setFormError("");
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const openSessionEditor = (item: TeachingSession) => {
    setEditingSession(item);
    setEditingSchedule(null);
    setTeachingForm({
      maLop: String(item.maLop),
      ngayHoc: item.ngayHoc.slice(0, 10),
      gioBatDau: timeValue(item.gioBatDau),
      gioKetThuc: timeValue(item.gioKetThuc),
      noiDung: item.noiDung ?? "",
      biHuy: String(Boolean(item.biHuy)),
    });
    setFormError("");
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;
    setIsFormOpen(false);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");
    setErrorMessage("");

    try {
      if (mode === "weekly") {
        const isEditing = editingSchedule !== null;
        await apiRequest(
          isEditing ? `/LichHoc/${editingSchedule.maLich}` : "/LichHoc",
          {
            method: isEditing ? "PUT" : "POST",
            body: {
              maLop: Number(scheduleForm.maLop),
              thuTrongTuan: scheduleForm.thuTrongTuan,
              gioBatDau: scheduleForm.gioBatDau,
              gioKetThuc: scheduleForm.gioKetThuc,
            },
          },
        );
      } else {
        const isEditing = editingSession !== null;
        await apiRequest(
          isEditing ? `/BuoiHoc/${editingSession.maBuoi}` : "/BuoiHoc",
          {
            method: isEditing ? "PUT" : "POST",
            body: {
              maLop: Number(teachingForm.maLop),
              ngayHoc: teachingForm.ngayHoc,
              gioBatDau: teachingForm.gioBatDau || null,
              gioKetThuc: teachingForm.gioKetThuc || null,
              noiDung: teachingForm.noiDung.trim() || null,
              biHuy: teachingForm.biHuy === "true",
            },
          },
        );
      }
      setIsFormOpen(false);
      setEditingSchedule(null);
      setEditingSession(null);
      await loadData();
    } catch (error) {
      setFormError(
        getErrorMessage(error, mode === "weekly" ? "Không thể lưu lịch học." : "Không thể lưu buổi dạy."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (item: Schedule | TeachingSession) => {
    const isWeekly = mode === "weekly";
    const id = isWeekly ? (item as Schedule).maLich : (item as TeachingSession).maBuoi;
    const label = isWeekly ? "lịch học định kỳ" : "buổi dạy";
    if (!window.confirm(`Bạn có chắc muốn xóa ${label} này?`)) return;

    setDeletingId(id);
    setErrorMessage("");
    try {
      await apiRequest(`/${isWeekly ? "LichHoc" : "BuoiHoc"}/${id}`, { method: "DELETE" });
      await loadData();
    } catch (error) {
      setErrorMessage(getErrorMessage(error, `Không thể xóa ${label}.`));
    } finally {
      setDeletingId(null);
    }
  };

  const handleModeChange = (nextMode: ScheduleMode) => {
    setMode(nextMode);
    setSearchTerm("");
    setStatusFilter("all");
    setCurrentPage(1);
    setErrorMessage("");
    setIsFormOpen(false);
    setEditingSchedule(null);
    setEditingSession(null);
  };

  const stats = mode === "weekly"
    ? [
        { label: "Lịch học định kỳ", value: schedules.length, note: "Khung giờ hàng tuần", icon: CalendarDays },
        { label: "Số lớp có lịch", value: new Set(schedules.map((item) => item.maLop)).size, note: "Lớp được xếp lịch", icon: Check },
        { label: "Ngày học trong tuần", value: new Set(schedules.map((item) => item.thuTrongTuan)).size, note: "Ngày có lịch", icon: Clock3 },
      ]
    : [
        { label: "Tổng buổi dạy", value: sessions.length, note: "Buổi trong hệ thống", icon: CalendarDays },
        { label: "Sắp diễn ra", value: sessions.filter((item) => !item.biHuy && item.ngayHoc >= new Date().toISOString().slice(0, 10)).length, note: "Chưa bị hủy", icon: Clock3 },
        { label: "Đã hủy", value: sessions.filter((item) => Boolean(item.biHuy)).length, note: "Buổi bị hủy", icon: X },
      ];

  const isEditing = editingSchedule !== null || editingSession !== null;
  const formClassValue = mode === "weekly" ? scheduleForm.maLop : teachingForm.maLop;

  return (
    <PageShell
      title="Quản lý lịch học và lịch dạy"
      description="Thiết lập lịch học hàng tuần và quản lý từng buổi dạy theo lớp"
      action={
        <button
          type="button"
          onClick={openCreateForm}
          disabled={!classes.length}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Plus className="h-4 w-4" />
          {mode === "weekly" ? "Thêm lịch học" : "Thêm buổi dạy"}
        </button>
      }
    >
      <div className="mb-5 flex flex-wrap gap-2 rounded-[22px] border border-violet-100 bg-white p-2 shadow-[0_12px_32px_rgba(140,122,255,0.04)]">
        <button
          type="button"
          onClick={() => handleModeChange("weekly")}
          aria-pressed={mode === "weekly"}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === "weekly" ? "bg-violet-100 text-violet-700" : "text-slate-500 hover:bg-slate-50"}`}
        >
          <CalendarDays className="h-4 w-4" /> Lịch học định kỳ
        </button>
        <button
          type="button"
          onClick={() => handleModeChange("teaching")}
          aria-pressed={mode === "teaching"}
          className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${mode === "teaching" ? "bg-violet-100 text-violet-700" : "text-slate-500 hover:bg-slate-50"}`}
        >
          <UserRound className="h-4 w-4" /> Lịch dạy theo buổi
        </button>
      </div>

      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, note, icon: Icon }) => (
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
          <button type="button" onClick={() => setErrorMessage("")} aria-label="Đóng thông báo lỗi"><X className="h-4 w-4" /></button>
        </div>
      )}

      <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              {mode === "weekly" ? "Lịch học các lớp" : "Các buổi dạy"}
            </h3>
            <p className="mt-1 text-sm text-slate-500">{visibleCount.toLocaleString("vi-VN")} lịch</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative block sm:min-w-72">
              <span className="sr-only">
                Tìm kiếm {mode === "weekly" ? "lịch học" : "buổi dạy"}
              </span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={searchTerm}
                onChange={(event) => { setSearchTerm(event.target.value); setCurrentPage(1); }}
                placeholder={mode === "weekly"
                  ? "Tìm lớp, giáo viên, phòng, thứ hoặc giờ..."
                  : "Tìm lớp, giáo viên, phòng, ngày hoặc nội dung..."}
                className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-10 text-sm text-slate-700 outline-none transition focus:border-violet-300"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => { setSearchTerm(""); setCurrentPage(1); }}
                  aria-label="Xóa từ khóa tìm kiếm"
                  className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-violet-100 hover:text-violet-700"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </label>
            {mode === "teaching" && (
              <select
                value={statusFilter}
                onChange={(event) => { setStatusFilter(event.target.value); setCurrentPage(1); }}
                aria-label="Lọc trạng thái buổi dạy"
                className="rounded-full border border-violet-100 bg-slate-50 px-4 py-2.5 text-sm text-slate-600 outline-none focus:border-violet-300"
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="false">Chưa hủy</option>
                <option value="true">Đã hủy</option>
              </select>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left">
            {mode === "weekly" ? (
              <>
                <thead><tr className="text-sm text-slate-500">
                  <th className="px-3 py-2 font-semibold">Lớp học</th>
                  <th className="px-3 py-2 font-semibold">Thứ</th>
                  <th className="px-3 py-2 font-semibold">Thời gian</th>
                  <th className="px-3 py-2 font-semibold">Giáo viên</th>
                  <th className="px-3 py-2 font-semibold">Phòng</th>
                  <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
                </tr></thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="px-3 py-10 text-center text-slate-500">Đang tải lịch học...</td></tr>
                  ) : currentSchedules.length ? currentSchedules.map((item) => {
                    const classInfo = classesById.get(item.maLop);
                    return (
                      <tr key={item.maLich} className="bg-slate-50 text-sm text-slate-700 shadow-sm">
                        <td className="rounded-l-2xl px-3 py-3">
                          <p className="font-semibold text-slate-800">{item.tenLop ?? classInfo?.tenLop ?? `Lớp ${item.maLop}`}</p>
                          <p className="mt-1 text-xs text-slate-400">{item.maLopCode ?? classInfo?.maLopCode ?? `Mã ${item.maLop}`}</p>
                        </td>
                        <td className="px-3 py-3">{weekDays.find((day) => day.value === item.thuTrongTuan)?.label ?? item.thuTrongTuan}</td>
                        <td className="px-3 py-3 whitespace-nowrap">{displayTime(item.gioBatDau)} – {displayTime(item.gioKetThuc)}</td>
                        <td className="px-3 py-3">{classInfo?.tenGiaoVien || "Chưa phân công"}</td>
                        <td className="px-3 py-3">{classInfo?.tenPhong || "Chưa xếp phòng"}</td>
                        <td className="rounded-r-2xl px-3 py-3 text-right whitespace-nowrap">
                          <button type="button" onClick={() => openScheduleEditor(item)} aria-label={`Sửa lịch của ${item.tenLop ?? classInfo?.tenLop ?? "lớp học"}`} className="rounded-lg p-2 text-violet-600 hover:bg-violet-100"><Edit3 className="h-4 w-4" /></button>
                          <button type="button" onClick={() => void handleDelete(item)} disabled={deletingId === item.maLich} aria-label="Xóa lịch học" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={6} className="px-3 py-12 text-center text-slate-500">{searchTerm ? "Không tìm thấy lịch phù hợp." : "Chưa có lịch học định kỳ."}</td></tr>
                  )}
                </tbody>
              </>
            ) : (
              <>
                <thead><tr className="text-sm text-slate-500">
                  <th className="px-3 py-2 font-semibold">Ngày / buổi học</th>
                  <th className="px-3 py-2 font-semibold">Lớp học</th>
                  <th className="px-3 py-2 font-semibold">Giáo viên</th>
                  <th className="px-3 py-2 font-semibold">Phòng</th>
                  <th className="px-3 py-2 font-semibold">Trạng thái</th>
                  <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
                </tr></thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="px-3 py-10 text-center text-slate-500">Đang tải lịch dạy...</td></tr>
                  ) : currentSessions.length ? currentSessions.map((item) => {
                    const classInfo = classesById.get(item.maLop);
                    return (
                      <tr key={item.maBuoi} className="bg-slate-50 text-sm text-slate-700 shadow-sm">
                        <td className="rounded-l-2xl px-3 py-3">
                          <p className="font-semibold text-slate-800">{formatDate(item.ngayHoc)}</p>
                          <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                            <Clock3 className="h-3.5 w-3.5" /> {displayTime(item.gioBatDau)} – {displayTime(item.gioKetThuc)}
                          </p>
                        </td>
                        <td className="px-3 py-3">
                          <p className="font-medium">{item.tenLop ?? classInfo?.tenLop ?? `Lớp ${item.maLop}`}</p>
                          <p className="mt-1 max-w-56 truncate text-xs text-slate-400">{item.noiDung || item.maLopCode || classInfo?.maLopCode || `Buổi ${item.maBuoi}`}</p>
                        </td>
                        <td className="px-3 py-3">{classInfo?.tenGiaoVien || "Chưa phân công"}</td>
                        <td className="px-3 py-3"><span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4 text-violet-400" />{classInfo?.tenPhong || "Chưa xếp phòng"}</span></td>
                        <td className="px-3 py-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${item.biHuy ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"}`}>
                            {item.biHuy ? "Đã hủy" : "Đã lên lịch"}
                          </span>
                        </td>
                        <td className="rounded-r-2xl px-3 py-3 text-right whitespace-nowrap">
                          <button type="button" onClick={() => openSessionEditor(item)} aria-label={`Sửa buổi học ngày ${formatDate(item.ngayHoc)}`} className="rounded-lg p-2 text-violet-600 hover:bg-violet-100"><Edit3 className="h-4 w-4" /></button>
                          <button type="button" onClick={() => void handleDelete(item)} disabled={deletingId === item.maBuoi} aria-label="Xóa buổi dạy" className="rounded-lg p-2 text-rose-500 hover:bg-rose-50 disabled:opacity-50"><Trash2 className="h-4 w-4" /></button>
                        </td>
                      </tr>
                    );
                  }) : (
                    <tr><td colSpan={6} className="px-3 py-12 text-center text-slate-500">{searchTerm || statusFilter !== "all" ? "Không tìm thấy buổi dạy phù hợp." : "Chưa có buổi dạy nào."}</td></tr>
                  )}
                </tbody>
              </>
            )}
          </table>
        </div>

        {!isLoading && visibleCount > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-violet-50 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Hiển thị {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, visibleCount)} trong {visibleCount}
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
          <section role="dialog" aria-modal="true" aria-labelledby="schedule-form-title" className="my-auto w-full max-w-xl rounded-[28px] border border-violet-100 bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Lịch giảng dạy</p>
                <h3 id="schedule-form-title" className="mt-1 text-xl font-bold text-slate-800">
                  {isEditing ? "Cập nhật" : "Thêm"} {mode === "weekly" ? "lịch học định kỳ" : "buổi dạy"}
                </h3>
              </div>
              <button type="button" onClick={closeForm} disabled={isSaving} aria-label="Đóng biểu mẫu" className="rounded-xl p-2 text-slate-400 hover:bg-slate-100"><X className="h-5 w-5" /></button>
            </div>

            {formError && <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</div>}
            {!classes.length && <div role="alert" className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-700">Cần có lớp học trước khi tạo lịch.</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Lớp học <span className="text-rose-500">*</span></span>
                <select
                  required
                  value={formClassValue}
                  onChange={(event) => mode === "weekly"
                    ? setScheduleForm((form) => ({ ...form, maLop: event.target.value }))
                    : setTeachingForm((form) => ({ ...form, maLop: event.target.value }))}
                  className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300"
                >
                  <option value="" disabled>Chọn lớp học</option>
                  {classes.map((item) => (
                    <option key={item.maLop} value={item.maLop}>
                      {item.maLopCode ? `${item.maLopCode} · ` : ""}{item.tenLop}
                    </option>
                  ))}
                </select>
              </label>

              {mode === "weekly" ? (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">Ngày học trong tuần</span>
                    <select value={scheduleForm.thuTrongTuan} onChange={(event) => setScheduleForm((form) => ({ ...form, thuTrongTuan: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300">
                      {weekDays.map((day) => <option key={day.value} value={day.value}>{day.label}</option>)}
                    </select>
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Giờ bắt đầu</span>
                      <input type="time" required value={scheduleForm.gioBatDau} onChange={(event) => setScheduleForm((form) => ({ ...form, gioBatDau: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Giờ kết thúc</span>
                      <input type="time" required value={scheduleForm.gioKetThuc} onChange={(event) => setScheduleForm((form) => ({ ...form, gioKetThuc: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
                    </label>
                  </div>
                </>
              ) : (
                <>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">Ngày dạy</span>
                    <input type="date" required value={teachingForm.ngayHoc} onChange={(event) => setTeachingForm((form) => ({ ...form, ngayHoc: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Giờ bắt đầu</span>
                      <input type="time" value={teachingForm.gioBatDau} onChange={(event) => setTeachingForm((form) => ({ ...form, gioBatDau: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
                    </label>
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">Giờ kết thúc</span>
                      <input type="time" value={teachingForm.gioKetThuc} onChange={(event) => setTeachingForm((form) => ({ ...form, gioKetThuc: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">Nội dung buổi học</span>
                    <textarea maxLength={255} rows={3} value={teachingForm.noiDung} onChange={(event) => setTeachingForm((form) => ({ ...form, noiDung: event.target.value }))} placeholder="Ví dụ: Unit 5 - Travel and holidays" className="w-full resize-y rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300" />
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-medium text-slate-700">Trạng thái buổi học</span>
                    <select value={teachingForm.biHuy} onChange={(event) => setTeachingForm((form) => ({ ...form, biHuy: event.target.value }))} className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none focus:border-violet-300">
                      <option value="false">Đã lên lịch</option>
                      <option value="true">Đã hủy</option>
                    </select>
                  </label>
                </>
              )}

              <div className="flex flex-col-reverse gap-2 border-t border-violet-50 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeForm} disabled={isSaving} className="rounded-full border border-violet-100 px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50">Hủy</button>
                <button type="submit" disabled={isSaving || !classes.length} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(168,85,247,0.18)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
                  {isSaving ? "Đang lưu..." : isEditing ? "Lưu thay đổi" : "Tạo lịch"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </PageShell>
  );
}
