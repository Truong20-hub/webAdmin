import { ArrowRight, Clock3, GraduationCap, Search, Users } from "lucide-react";
import { StudentPageHeader } from "@/components/student/StudentViews";
export default function RegisterClassPage() {
  return (
    <>
      <StudentPageHeader
        eyebrow="Find your next class"
        title="Khám phá lớp học"
        description="Chọn lịch học phù hợp và bắt đầu chặng đường mới."
      />
      <div className="mb-5 flex flex-col gap-3 sm:flex-row">
        <div className="flex flex-1 items-center gap-2 rounded-2xl border border-[#e8e8df] bg-white px-4 py-3 text-sm text-[#9a9b83]">
          <Search size={18} /> Tìm lớp học...
        </div>
        <select className="rounded-2xl border border-[#e8e8df] bg-white px-4 py-3 text-sm text-[#7d877d]">
          <option>Tất cả trình độ</option>
          <option>A1 - Beginner</option>
          <option>B1 - Intermediate</option>
        </select>
      </div>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="soft-panel p-6">
          <span className="status-pill status-success">Còn chỗ</span>
          <h2 className="mt-4 text-xl font-black text-[#354052]">
            English Beginner A1
          </h2>
          <p className="mt-2 text-sm text-[#7d877d]">
            Bắt đầu từ nền tảng, học nói tự tin từng ngày.
          </p>
          <div className="mt-5 space-y-3 text-sm text-[#566355]">
            <p>
              <GraduationCap className="mr-2 inline text-[#6f956d]" size={17} />
              Giáo viên: Lê Ngọc Mai
            </p>
            <p>
              <Clock3 className="mr-2 inline text-[#6f956d]" size={17} />
              Thứ 2 & Thứ 4 · 19:00 - 20:30
            </p>
            <p>
              <Users className="mr-2 inline text-[#6f956d]" size={17} />
              18/25 học viên · Học phí 2.000.000đ
            </p>
          </div>
          <button className="primary-button mt-6">
            Đăng ký lớp <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
