"use client";

import { useMemo, useState } from "react";
import { CalendarCheck2 } from "lucide-react";
import { PageShell } from "@/components/admin/PageShell";

const attendanceStats = [
  { label: "Tỷ lệ điểm danh", value: "95%", note: "+3% tuần này" },
  { label: "Học viên có mặt", value: "1,187", note: "95%" },
  { label: "Vắng mặt", value: "63", note: "5%" },
];

type AttendanceRecord = {
  maDiemDanh: number;
  maBuoi: number;
  maHocVien: number;
  tenHocVien: string;
  trangThai: "CoMat" | "VangMat" | "Muon" | "CoPhep";
  ghiChu?: string;
};

const attendanceRecords: AttendanceRecord[] = [
  {
    maDiemDanh: 1001,
    maBuoi: 301,
    maHocVien: 201,
    tenHocVien: "Nguyễn Thị An",
    trangThai: "CoMat",
    ghiChu: "Đúng giờ",
  },
  {
    maDiemDanh: 1002,
    maBuoi: 301,
    maHocVien: 202,
    tenHocVien: "Trần Văn Bình",
    trangThai: "Muon",
    ghiChu: "Đến muộn 10 phút",
  },
  {
    maDiemDanh: 1003,
    maBuoi: 301,
    maHocVien: 203,
    tenHocVien: "Lê Hoài Nam",
    trangThai: "VangMat",
    ghiChu: "Không phép",
  },
  {
    maDiemDanh: 1004,
    maBuoi: 302,
    maHocVien: 204,
    tenHocVien: "Phạm Thu Hà",
    trangThai: "CoPhep",
    ghiChu: "Có phép nghỉ 1 buổi",
  },
  {
    maDiemDanh: 1005,
    maBuoi: 302,
    maHocVien: 205,
    tenHocVien: "Đặng Minh Khang",
    trangThai: "CoMat",
    ghiChu: "Tham gia tích cực",
  },
  {
    maDiemDanh: 1006,
    maBuoi: 303,
    maHocVien: 206,
    tenHocVien: "Vũ Thị Lan",
    trangThai: "VangMat",
    ghiChu: "Vắng do bệnh",
  },
];

const statusLabels: Record<AttendanceRecord["trangThai"], string> = {
  CoMat: "Có mặt",
  VangMat: "Vắng mặt",
  Muon: "Muộn",
  CoPhep: "Có phép",
};

const statusStyles: Record<AttendanceRecord["trangThai"], string> = {
  CoMat: "bg-emerald-50 text-emerald-600",
  VangMat: "bg-rose-50 text-rose-600",
  Muon: "bg-amber-50 text-amber-600",
  CoPhep: "bg-sky-50 text-sky-600",
};

const sessionMeta: Record<number, { className: string; time: string }> = {
  301: { className: "Beginner A", time: "08:00 - 09:30" },
  302: { className: "IELTS Mock", time: "09:45 - 11:15" },
  303: { className: "Conversation Club", time: "13:30 - 15:00" },
};

const classOptions = [
  "Tất cả lớp học",
  "Beginner A",
  "IELTS Mock",
  "Conversation Club",
];

const pageSize = 5;

export default function AttendanceManagementPage() {
  const [selectedClass, setSelectedClass] = useState("Tất cả lớp học");
  const [selectedSession, setSelectedSession] = useState("Tất cả buổi học");
  const [currentPage, setCurrentPage] = useState(1);

  const sessionOptions = useMemo(() => {
    const items = Object.entries(sessionMeta).map(([maBuoi, value]) => ({
      value: String(maBuoi),
      label: `${value.className} • ${value.time}`,
      className: value.className,
    }));

    if (selectedClass === "Tất cả lớp học") {
      return [
        { value: "Tất cả buổi học", label: "Tất cả buổi học", className: "" },
        ...items,
      ];
    }

    return [
      { value: "Tất cả buổi học", label: "Tất cả buổi học", className: "" },
      ...items.filter((item) => item.className === selectedClass),
    ];
  }, [selectedClass]);

  const filteredRecords = useMemo(() => {
    return attendanceRecords.filter((record) => {
      const className = sessionMeta[record.maBuoi]?.className ?? "";
      const matchesClass =
        selectedClass === "Tất cả lớp học" || className === selectedClass;
      const matchesSession =
        selectedSession === "Tất cả buổi học" ||
        String(record.maBuoi) === selectedSession;

      return matchesClass && matchesSession;
    });
  }, [selectedClass, selectedSession]);
  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const currentRecords = filteredRecords.slice(
    startIndex,
    startIndex + pageSize,
  );
  return (
    <PageShell
      title="Quản lý điểm danh"
      description="Theo dõi sĩ số, thời lượng học và mức độ tham gia của học viên"
      action={
        <button className="rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]">
          Gửi nhắc nhở
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {attendanceStats.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <CalendarCheck2 className="h-5 w-5" />
              </div>
              <span className="text-xs text-violet-500">{item.note}</span>
            </div>
            <p className="mt-5 text-sm text-slate-500">{item.label}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            Danh sách điểm danh
          </h3>
          <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
            {filteredRecords.length} bản ghi
          </span>
        </div>

        <div className="mb-5 grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Lớp học
            </span>
            <select
              value={selectedClass}
              onChange={(event) => {
                setSelectedClass(event.target.value);
                setSelectedSession("Tất cả buổi học");
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none ring-0 transition focus:border-violet-400"
            >
              {classOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-slate-600">
              Buổi học
            </span>
            <select
              value={selectedSession}
              onChange={(event) => {
                setSelectedSession(event.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none ring-0 transition focus:border-violet-400"
            >
              {sessionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="px-3 py-2 font-semibold">Lớp / Buổi</th>
                <th className="px-3 py-2 font-semibold">Tên học viên</th>
                <th className="px-3 py-2 font-semibold">Trạng thái</th>
                <th className="px-3 py-2 font-semibold">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => {
                  const session = sessionMeta[record.maBuoi];

                  return (
                    <tr
                      key={record.maDiemDanh}
                      className="rounded-2xl bg-slate-50 text-sm text-slate-700 shadow-sm"
                    >
                      <td className="rounded-l-2xl px-3 py-3">
                        <div className="font-medium text-slate-700">
                          {session?.className ?? "Không xác định"}
                        </div>
                        <div className="text-xs text-slate-500">
                          {session
                            ? `${record.maBuoi} • ${session.time}`
                            : `Buổi ${record.maBuoi}`}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-medium text-slate-700">
                        {record.tenHocVien}
                      </td>
                      <td className="px-3 py-3">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusStyles[record.trangThai]}`}
                        >
                          {statusLabels[record.trangThai]}
                        </span>
                      </td>
                      <td className="rounded-r-2xl px-3 py-3 text-slate-500">
                        {record.ghiChu ?? "--"}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-3 py-6 text-center text-sm text-slate-500"
                  >
                    Không có dữ liệu phù hợp với bộ lọc đã chọn.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {currentRecords.length ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + pageSize, filteredRecords.length)} /{" "}
            {filteredRecords.length}
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
    </PageShell>
  );
}
