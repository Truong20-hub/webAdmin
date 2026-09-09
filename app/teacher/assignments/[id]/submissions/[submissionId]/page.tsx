import Link from "next/link";
import { ArrowLeft, Paperclip } from "lucide-react";

export default async function GradeSubmissionPage({
  params,
}: {
  params: Promise<{ id: string; submissionId: string }>;
}) {
  await params;
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/teacher/assignments/ta1/submissions"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#a8656c]"
      >
        <ArrowLeft size={16} /> Danh sách bài nộp
      </Link>
      <div>
        <p className="eyebrow text-[#aa7777c]">Review submission</p>
        <h1 className="mt-2 text-3xl font-black text-[#354052]">
          Chấm bài của Nguyễn Minh Anh
        </h1>
        <p className="mt-2 text-sm text-[#917d83]">
          Vocabulary Unit 5 · Nộp ngày 08/09/2026 lúc 20:10
        </p>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
        <section className="teacher-panel p-6">
          <h2 className="section-title mt-0">Bài làm của học viên</h2>
          <div className="mt-5 rounded-3xl bg-[#faf5f1] p-5 text-sm leading-7 text-[#66585e]">
            1. improve · 2. confident · 3. opportunity
            <br />
            Em đã đặt câu với các từ mới và hoàn thành phần luyện tập theo hướng
            dẫn.
          </div>
          <button className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#eadfe3] px-4 py-2 text-xs font-bold text-[#806f75]">
            <Paperclip size={15} /> MinhAnh_Vocabulary5.pdf
          </button>
        </section>
        <section className="teacher-panel p-6">
          <h2 className="section-title mt-0">Chấm điểm</h2>
          <label className="mt-5 block text-sm font-bold text-[#806f75]">
            Điểm
            <input
              type="number"
              min="0"
              max="10"
              step="0.5"
              defaultValue="9"
              className="mt-2 block w-full rounded-2xl border border-[#eadfe3] p-3.5"
            />
          </label>
          <label className="mt-4 block text-sm font-bold text-[#806f75]">
            Nhận xét
            <textarea
              className="mt-2 block min-h-32 w-full rounded-2xl border border-[#eadfe3] p-3.5"
              defaultValue="Em làm bài tốt. Cần chú ý thêm cách sử dụng một số từ vựng."
            />
          </label>
          <button className="primary-button mt-5 inline-flex w-full justify-center bg-[#d8898c] hover:bg-[#c8787d]">
            Lưu điểm
          </button>
        </section>
      </div>
    </div>
  );
}
