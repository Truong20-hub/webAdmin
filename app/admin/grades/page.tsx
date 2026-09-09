"use client";

import { ArrowLeft, BarChart3, Search, UserRound } from "lucide-react";
import { useMemo, useState } from "react";
import { PageShell } from "@/components/admin/PageShell";

type ClassInfo = {
  maLop: number;
  tenLop: string;
  giaoVien: string;
};

type GradeRecord = {
  maBangDiem: number;
  maHocVien: number;
  maLop: number;
  diemTrungBinh: number | null;
  diemChuyenCan: number | null;
  xepLoai: string | null;
  nhanXetGv: string | null;
  ngayCap: string | null;
};

const classes: ClassInfo[] = [
  { maLop: 101, tenLop: "IELTS Intensive 1", giaoVien: "Ms. An Ngọc" },
  { maLop: 102, tenLop: "Conversation Club A", giaoVien: "Mr. Dũng Vũ" },
  { maLop: 103, tenLop: "Business English Starter", giaoVien: "Ms. Minh Hạnh" },
  { maLop: 104, tenLop: "Toeic Intensive 2", giaoVien: "Mr. Huyền Nam" },
];

const studentNames: Record<number, string> = {
  201: "Nguyễn Thị Lan",
  202: "Trần Văn Nam",
  203: "Phạm Thảo Vy",
  204: "Lê Hoàng Nam",
  205: "Nguyễn Bảo Châu",
  206: "Huỳnh Gia Hân",
  207: "Đặng Quốc Nam",
};

const gradeRecords: GradeRecord[] = [
  {
    maBangDiem: 1,
    maHocVien: 201,
    maLop: 101,
    diemTrungBinh: 8.6,
    diemChuyenCan: 9.5,
    xepLoai: "Tốt",
    nhanXetGv: "Tiến bộ tốt, chủ động trong giờ học.",
    ngayCap: "2026-08-20",
  },
  {
    maBangDiem: 2,
    maHocVien: 203,
    maLop: 101,
    diemTrungBinh: 8.9,
    diemChuyenCan: 9.8,
    xepLoai: "Xuất sắc",
    nhanXetGv: "Năng lực ổn định, tiếp thu nhanh.",
    ngayCap: "2026-08-20",
  },
  {
    maBangDiem: 3,
    maHocVien: 207,
    maLop: 101,
    diemTrungBinh: 8.3,
    diemChuyenCan: 8.5,
    xepLoai: "Tốt",
    nhanXetGv: "Kiên trì, cần luyện thêm kỹ năng viết.",
    ngayCap: "2026-08-20",
  },
  {
    maBangDiem: 4,
    maHocVien: 202,
    maLop: 102,
    diemTrungBinh: 8.0,
    diemChuyenCan: 8.8,
    xepLoai: "Khá",
    nhanXetGv: "Giao tiếp tự tin, phát âm rõ hơn.",
    ngayCap: "2026-08-22",
  },
  {
    maBangDiem: 5,
    maHocVien: 204,
    maLop: 103,
    diemTrungBinh: 8.2,
    diemChuyenCan: 9.0,
    xepLoai: "Khá",
    nhanXetGv: "Có ý thức học tập tốt.",
    ngayCap: "2026-08-25",
  },
  {
    maBangDiem: 6,
    maHocVien: 205,
    maLop: 104,
    diemTrungBinh: 8.7,
    diemChuyenCan: 9.2,
    xepLoai: "Tốt",
    nhanXetGv: "Kỹ năng đọc và nghe nổi bật.",
    ngayCap: "2026-08-28",
  },
  {
    maBangDiem: 7,
    maHocVien: 206,
    maLop: 104,
    diemTrungBinh: 8.0,
    diemChuyenCan: 8.0,
    xepLoai: "Khá",
    nhanXetGv: "Cần duy trì việc ôn tập đều đặn.",
    ngayCap: "2026-08-28",
  },
];

const formatDate = (date: string | null) =>
  date ? new Date(date).toLocaleDateString("vi-VN") : "--";

export default function GradeManagementPage() {
  const [classSearch, setClassSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("Tất cả giáo viên");
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);

  const teacherOptions = useMemo(
    () => Array.from(new Set(classes.map((item) => item.giaoVien))),
    [],
  );

  const filteredClasses = useMemo(() => {
    const keyword = classSearch.trim().toLowerCase();
    return classes.filter(
      (item) =>
        (!keyword ||
          item.tenLop.toLowerCase().includes(keyword) ||
          item.giaoVien.toLowerCase().includes(keyword)) &&
        (teacherFilter === "Tất cả giáo viên" ||
          item.giaoVien === teacherFilter),
    );
  }, [classSearch, teacherFilter]);

  const selectedRecords = selectedClass
    ? gradeRecords.filter((record) => record.maLop === selectedClass.maLop)
    : [];

  return (
    <PageShell
      title="Quản lý bảng điểm"
      description="Chọn lớp học để xem và theo dõi bảng điểm của học viên"
      action={
        selectedClass ? (
          <button
            type="button"
            onClick={() => setSelectedClass(null)}
            className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white px-4 py-2 text-sm font-medium text-violet-600 transition hover:bg-violet-50"
          >
            <ArrowLeft className="h-4 w-4" /> Danh sách lớp
          </button>
        ) : null
      }
    >
      {!selectedClass ? (
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Chọn lớp học</h3>
              <p className="mt-1 text-sm text-slate-500">
                Tìm kiếm và chọn lớp để mở danh sách bảng điểm
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <label className="relative block">
                <span className="sr-only">Tìm kiếm lớp học</span>
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  value={classSearch}
                  onChange={(event) => setClassSearch(event.target.value)}
                  placeholder="Tìm tên lớp hoặc giáo viên..."
                  className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 md:w-72"
                />
              </label>
              <select
                value={teacherFilter}
                onChange={(event) => setTeacherFilter(event.target.value)}
                aria-label="Lọc theo giáo viên"
                className="rounded-full border border-violet-100 bg-slate-50 px-3 py-2.5 text-sm text-slate-600 outline-none transition focus:border-violet-300"
              >
                <option>Tất cả giáo viên</option>
                {teacherOptions.map((teacher) => (
                  <option key={teacher}>{teacher}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {filteredClasses.map((item) => (
              <button
                key={item.maLop}
                type="button"
                onClick={() => setSelectedClass(item)}
                className="flex min-h-44 flex-col justify-between rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 via-white to-pink-50 p-5 text-left shadow-sm transition hover:-translate-y-1 hover:border-violet-300 hover:shadow-lg"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-violet-600 shadow-sm">
                  <BarChart3 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="mt-6 font-bold text-slate-800">
                    {item.tenLop}
                  </h4>
                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                    <UserRound className="h-4 w-4 text-violet-400" />
                    {item.giaoVien}
                  </p>
                </div>
              </button>
            ))}
          </div>
          {!filteredClasses.length && (
            <p className="py-10 text-center text-sm text-slate-400">
              Không tìm thấy lớp học phù hợp.
            </p>
          )}
        </div>
      ) : (
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                Bảng điểm lớp
              </p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">
                {selectedClass.tenLop}
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Giáo viên: {selectedClass.giaoVien}
              </p>
            </div>
            <span className="rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600">
              {selectedRecords.length} bảng điểm
            </span>
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="min-w-[1050px] w-full border-separate border-spacing-0 text-left">
              <thead>
                <tr className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                  <th className="px-3 py-3 text-right font-semibold">
                    Mã bảng điểm
                  </th>
                  <th className="px-3 py-3 font-semibold">Học viên</th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Điểm trung bình
                  </th>
                  <th className="px-3 py-3 text-right font-semibold">
                    Điểm chuyên cần
                  </th>
                  <th className="px-3 py-3 font-semibold">Xếp loại</th>
                  <th className="px-3 py-3 font-semibold">Nhận xét GV</th>
                  <th className="px-3 py-3 font-semibold">Ngày cấp</th>
                </tr>
              </thead>
              <tbody>
                {selectedRecords.length ? (
                  selectedRecords.map((record) => (
                    <tr
                      key={record.maBangDiem}
                      className="border-t border-slate-100 text-sm text-slate-700"
                    >
                      <td className="px-3 py-4 text-right font-medium">
                        {record.maBangDiem}
                      </td>
                      <td className="px-3 py-4 font-medium">
                        {studentNames[record.maHocVien] ??
                          `Học viên #${record.maHocVien}`}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {record.diemTrungBinh?.toFixed(2) ?? "--"}
                      </td>
                      <td className="px-3 py-4 text-right">
                        {record.diemChuyenCan?.toFixed(2) ?? "--"}
                      </td>
                      <td className="px-3 py-4">
                        <span className="rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-700">
                          {record.xepLoai ?? "--"}
                        </span>
                      </td>
                      <td className="max-w-xs px-3 py-4 text-slate-500">
                        {record.nhanXetGv ?? "--"}
                      </td>
                      <td className="px-3 py-4 text-slate-500">
                        {formatDate(record.ngayCap)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-3 py-10 text-center text-sm text-slate-500"
                    >
                      Lớp này chưa có bảng điểm.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </PageShell>
  );
}
