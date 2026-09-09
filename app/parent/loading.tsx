export default function ParentLoading() {
  return (
    <div className="space-y-6" aria-label="Đang tải dữ liệu">
      <div className="h-64 animate-pulse rounded-[32px] bg-[#e8f1e2]" />
      <div className="grid gap-4 md:grid-cols-4">
        <div className="h-28 animate-pulse rounded-3xl bg-white" />
        <div className="h-28 animate-pulse rounded-3xl bg-white" />
        <div className="h-28 animate-pulse rounded-3xl bg-white" />
        <div className="h-28 animate-pulse rounded-3xl bg-white" />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="h-64 animate-pulse rounded-[28px] bg-white" />
        <div className="h-64 animate-pulse rounded-[28px] bg-white" />
      </div>
    </div>
  );
}
