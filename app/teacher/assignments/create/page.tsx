import Link from "next/link";
import { ArrowLeft, Paperclip, Send } from "lucide-react";

export default function CreateAssignmentPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link
        href="/teacher/assignments"
        className="inline-flex items-center gap-2 text-sm font-bold text-[#a8656c]"
      >
        <ArrowLeft size={16} /> Quay lại bài tập
      </Link>
      <div>
        <p className="eyebrow text-[#aa777c]">New practice</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight text-[#354052]">
          Giao bài tập mới
        </h1>
        <p className="mt-2 text-sm text-[#917d83]">
          Tạo một hoạt động rõ ràng, vừa sức và dễ theo dõi cho lớp học.
        </p>
      </div>
      <form className="teacher-panel space-y-5 p-5 md:p-7">
        <label className="block text-sm font-bold text-[#806f75]">
          Tên bài tập
          <input
            className="mt-2 block w-full rounded-2xl border border-[#eadfe3] bg-white p-3.5 font-normal outline-none focus:border-[#d8898c]"
            placeholder="Ví dụ: Vocabulary Unit 5"
          />
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-bold text-[#806f75]">
            Lớp
            <select className="mt-2 block w-full rounded-2xl border border-[#eadfe3] bg-white p-3.5 font-normal">
              <option>English Intermediate B1</option>
              <option>English Starter A2</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-[#806f75]">
            Loại bài tập
            <select className="mt-2 block w-full rounded-2xl border border-[#eadfe3] bg-white p-3.5 font-normal">
              <option>Vocabulary</option>
              <option>Grammar</option>
              <option>Listening</option>
              <option>Speaking</option>
              <option>Reading</option>
              <option>Writing</option>
            </select>
          </label>
        </div>
        <label className="block text-sm font-bold text-[#806f75]">
          Mô tả
          <textarea
            className="mt-2 block min-h-28 w-full rounded-2xl border border-[#eadfe3] bg-white p-3.5 font-normal outline-none focus:border-[#d8898c]"
            placeholder="Mục tiêu và hướng dẫn cho học viên..."
          />
        </label>
        <div className="grid gap-5 md:grid-cols-2">
          <label className="block text-sm font-bold text-[#806f75]">
            Hạn nộp
            <input
              type="datetime-local"
              className="mt-2 block w-full rounded-2xl border border-[#eadfe3] bg-white p-3.5 font-normal"
              defaultValue="2026-09-08T23:59"
            />
          </label>
          <label className="block text-sm font-bold text-[#806f75]">
            Tệp đính kèm
            <button
              type="button"
              className="mt-2 flex w-full items-center gap-2 rounded-2xl border border-dashed border-[#dfb8b5] bg-[#fff7f4] p-3.5 text-left text-sm font-normal text-[#a8656c]"
            >
              <Paperclip size={17} /> Chọn PDF, DOCX, ảnh hoặc audio
            </button>
          </label>
        </div>
        <div className="flex justify-end border-t border-[#eee5e1] pt-5">
          <button
            type="button"
            className="primary-button inline-flex bg-[#d8898c] hover:bg-[#c8787d]"
          >
            <Send size={17} /> Giao bài tập
          </button>
        </div>
      </form>
    </div>
  );
}
