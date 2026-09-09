import { Activity, ArrowUpRight, BarChart3, TrendingUp } from "lucide-react";
import { PageShell } from "@/components/admin/PageShell";

const statCards = [
  { label: "Doanh thu khóa học", value: "$48.2K", change: "+18.5%" },
  { label: "Học viên mới", value: "312", change: "+24%" },
  { label: "Tỷ lệ hoàn thành", value: "87%", change: "+6.2%" },
];

const reportRows = [
  { name: "Beginner A", completion: "86%", growth: "+12%" },
  { name: "Intermediate B", completion: "91%", growth: "+16%" },
  { name: "IELTS Intensive", completion: "88%", growth: "+9%" },
  { name: "Conversation Club", completion: "94%", growth: "+14%" },
];

export default function StatisticsPage() {
  return (
    <PageShell
      title="Báo cáo thống kê"
      description="Hiệu suất tổng quan, xu hướng học tập và KPI hoạt động của hệ thống"
      action={
        <button className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]">
          Xem báo cáo nâng cao <ArrowUpRight className="h-4 w-4" />
        </button>
      }
    >
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        {statCards.map((item) => (
          <div
            key={item.label}
            className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <span className="text-xs text-emerald-500">{item.change}</span>
            </div>
            <p className="mt-5 text-sm text-slate-500">{item.label}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">
              {item.value}
            </h3>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr] mb-6">
        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-slate-800">
              Xu hướng học tập
            </h3>
            <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-2.5 py-1 text-xs font-medium text-violet-600">
              <TrendingUp className="h-3.5 w-3.5" />
              Mùa học 2026
            </div>
          </div>

          <div className="mt-8 flex h-56 items-end gap-3">
            {[50, 62, 58, 78, 74, 92, 88].map((value, index) => (
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
                  {["T1", "T2", "T3", "T4", "T5", "T6", "T7"][index]}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
          <h3 className="text-xl font-bold text-slate-800">Tổng hợp KPI</h3>
          <div className="mt-6 space-y-4">
            {[
              ["Attendance", "95%"],
              ["Completion", "87%"],
              ["Satisfaction", "4.8/5"],
            ].map(([label, value]) => (
              <div key={label} className="rounded-2xl bg-slate-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">{label}</span>
                  <span className="font-semibold text-slate-700">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-slate-800">Theo dõi lớp học</h3>
          <div className="inline-flex items-center gap-2 rounded-full bg-pink-50 px-2.5 py-1 text-xs font-medium text-pink-600">
            <Activity className="h-3.5 w-3.5" />
            Updated today
          </div>
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-400">
                <th className="pb-3 font-medium">Lớp học</th>
                <th className="pb-3 text-right font-medium">Hoàn thành</th>
                <th className="pb-3 text-right font-medium">Tăng trưởng</th>
              </tr>
            </thead>
            <tbody>
              {reportRows.map((row) => (
                <tr key={row.name} className="border-t border-slate-100">
                  <td className="py-3 pr-4 font-medium text-slate-700">
                    {row.name}
                  </td>
                  <td className="py-3 pr-4 text-right text-slate-500">
                    {row.completion}
                  </td>
                  <td className="py-3 pr-4 text-right text-emerald-600">
                    {row.growth}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageShell>
  );
}
