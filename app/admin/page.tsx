import {
  ArrowUpRight,
  BookOpenText,
  CalendarCheck2,
  TrendingUp,
  Users2,
} from "lucide-react";
import { PageShell } from "@/components/admin/PageShell";

const stats = [
  {
    title: "Học viên",
    value: "1,250",
    change: "+8.2%",
    icon: Users2,
    tone: "from-violet-200 via-violet-100 to-pink-100",
  },
  {
    title: "Giáo viên",
    value: "35",
    change: "+2.4%",
    icon: BookOpenText,
    tone: "from-sky-200 via-cyan-100 to-emerald-100",
  },
  {
    title: "Người dùng",
    value: "1,320",
    change: "+5.7%",
    icon: Users2,
    tone: "from-pink-200 via-rose-100 to-orange-100",
  },
  {
    title: "Điểm danh",
    value: "95%",
    change: "+3.1%",
    icon: CalendarCheck2,
    tone: "from-emerald-200 via-mint-100 to-lime-100",
  },
];

const recentActivities = [
  {
    title: "Bài kiểm tra IELTS mock 2 đã được cập nhật",
    time: "10 phút trước",
  },
  { title: "Lớp Beginner A có 2 học viên mới đăng ký", time: "1 giờ trước" },
  { title: "Kế hoạch dạy học tuần này đã được phê duyệt", time: "Hôm nay" },
  { title: "Có 8 học viên vắng mặt trong buổi sáng", time: "Hôm nay" },
];

export default function AdminDashboardPage() {
  return (
    <PageShell
      title="Dashboard"
      description="Tổng quan hoạt động hệ thống quản lý lớp học tiếng Anh"
      action={
        <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] transition hover:translate-y-[-1px]">
          Xem báo cáo <ArrowUpRight className="h-4 w-4" />
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 mb-6">
        {stats.map(({ title, value, change, icon: Icon, tone }) => (
          <div
            key={title}
            className="rounded-[26px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]"
          >
            <div className="flex items-center justify-between">
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${tone}`}
              >
                <Icon className="h-5 w-5 text-slate-700" />
              </div>
              <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-600">
                {change}
              </span>
            </div>

            <p className="mt-5 text-sm text-slate-500">{title}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-500">Biểu đồ tiến độ học tập</p>
              <h3 className="mt-1 text-xl font-bold text-slate-800">
                Tăng trưởng học viên
              </h3>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-600">
              <TrendingUp className="h-3.5 w-3.5" />
              +12.5%
            </div>
          </div>

          <div className="mt-8 flex h-56 items-end gap-3">
            {[42, 58, 48, 72, 68, 90, 86].map((value, index) => (
              <div
                key={value}
                className="flex flex-1 flex-col items-center gap-2"
              >
                <div
                  className={`w-full rounded-t-2xl bg-gradient-to-t ${
                    index % 2 === 0
                      ? "from-violet-400 to-pink-300"
                      : "from-emerald-400 to-cyan-300"
                  }`}
                  style={{ height: `${value}%` }}
                />
                <span className="text-xs text-slate-400">
                  {["T2", "T3", "T4", "T5", "T6", "T7", "CN"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <h3 className="text-xl font-bold text-slate-800">
            Hoạt động gần đây
          </h3>
          <div className="mt-6 space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.title}
                className="flex items-start gap-3 rounded-2xl bg-violet-50/70 p-3"
              >
                <div className="mt-1 h-2.5 w-2.5 rounded-full bg-violet-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">
                    {activity.title}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
}
