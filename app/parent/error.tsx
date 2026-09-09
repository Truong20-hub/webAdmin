"use client";

export default function ParentError({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="soft-panel max-w-md p-8 text-center">
        <p className="text-4xl">😿</p>
        <h1 className="mt-4 text-xl font-black text-[#354052]">
          Không thể tải dữ liệu
        </h1>
        <p className="mt-2 text-sm leading-6 text-[#7d877d]">
          Vui lòng thử lại sau. Chúng tôi sẽ giữ nguyên hành trình học của Minh
          Anh.
        </p>
        <button type="button" onClick={reset} className="primary-button mt-5">
          Thử lại
        </button>
      </div>
    </div>
  );
}
