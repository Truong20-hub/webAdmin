import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  GraduationCap,
  Mail,
  MapPin,
  MessageCircle,
  Paperclip,
  Send,
  Sparkles,
  UserRound,
} from "lucide-react";
import { assignments, invoices, schedule, student } from "@/lib/student-data";

export function StudentPageHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-6">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-black tracking-tight text-[#354052]">
        {title}
      </h1>
      <p className="mt-2 text-sm text-[#7d877d]">{description}</p>
    </div>
  );
}

export function ScheduleView() {
  return (
    <>
      <StudentPageHeader
        eyebrow="Your week"
        title="Lịch học"
        description="Mọi buổi học sắp tới của bạn, gọn gàng trong một nơi."
      />
      <div className="mb-5 flex gap-2">
        <button className="rounded-full bg-[#6f956d] px-4 py-2 text-sm font-bold text-white">
          Lịch tuần
        </button>
        <button className="rounded-full border border-[#e8e8df] bg-white px-4 py-2 text-sm font-bold text-[#7d877d]">
          Danh sách
        </button>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {schedule.map((item, index) => (
          <Link
            href={`/student/schedule/${item.id}`}
            key={item.id}
            className="soft-panel p-5 transition hover:-translate-y-1"
          >
            <div className="flex items-center justify-between">
              <span className="date-chip">{item.day}</span>
              <span
                className={
                  index === 0
                    ? "status-pill status-success"
                    : "status-pill status-info"
                }
              >
                {index === 0 ? "Sắp học" : "Đã lên lịch"}
              </span>
            </div>
            <p className="mt-5 text-xs font-bold text-[#6f956d]">{item.date}</p>
            <h2 className="mt-2 text-lg font-black text-[#354052]">
              {item.course}
            </h2>
            <p className="mt-2 text-sm text-[#7d877d]">{item.topic}</p>
            <div className="mt-5 border-t border-[#eeeade] pt-4 text-sm font-semibold text-[#566355]">
              <Clock3 className="mr-1 inline" size={15} />
              {item.time}
              <span className="mx-2 text-[#d8d8ca]">·</span>Phòng {item.room}
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export function SessionDetailView({ id }: { id: string }) {
  const item = schedule.find((entry) => entry.id === id) ?? schedule[0];
  return (
    <>
      <Link
        href="/student/schedule"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6f956d]"
      >
        <ArrowLeft size={16} /> Quay lại lịch học
      </Link>
      <div className="soft-panel max-w-3xl p-6 md:p-8">
        <span className="status-pill status-success">Sắp học</span>
        <h1 className="mt-4 text-3xl font-black text-[#354052]">
          {item.course}
        </h1>
        <p className="mt-2 text-[#7d877d]">{item.topic}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[
            ["Ngày học", item.date],
            ["Thời gian", item.time],
            ["Phòng học", item.room],
            ["Giáo viên", item.teacher],
          ].map(([label, value]) => (
            <div className="rounded-2xl bg-[#f7f7f0] p-4" key={label}>
              <p className="label-muted">{label}</p>
              <p className="mt-2 font-bold text-[#354052]">{value}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-2xl border border-[#dbe7d3] bg-[#eef5e9] p-4 text-sm text-[#587052]">
          <CheckCircle2 className="mr-2 inline" size={17} /> Nội dung buổi học
          đã sẵn sàng. Hẹn gặp bạn tại lớp!
        </div>
      </div>
    </>
  );
}

export function AssignmentsView() {
  return (
    <>
      <StudentPageHeader
        eyebrow="Small steps, big progress"
        title="Bài tập"
        description="Hoàn thành bài tập để giữ nhịp học thật đều nhé."
      />
      <div className="mb-5 flex gap-2 overflow-x-auto">
        <button className="whitespace-nowrap rounded-full bg-[#6f956d] px-4 py-2 text-sm font-bold text-white">
          Chưa làm (2)
        </button>
        <button className="whitespace-nowrap rounded-full border border-[#e8e8df] bg-white px-4 py-2 text-sm font-bold text-[#7d877d]">
          Đã nộp
        </button>
        <button className="whitespace-nowrap rounded-full border border-[#e8e8df] bg-white px-4 py-2 text-sm font-bold text-[#7d877d]">
          Đã chấm
        </button>
      </div>
      <div className="space-y-3">
        {assignments.map((item) => (
          <Link
            href={`/student/assignments/${item.id}`}
            className="assignment-row soft-panel"
            key={item.id}
          >
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#eef5e9] text-[#6f956d]">
              <FileText size={21} />
            </span>
            <span className="min-w-0 flex-1">
              <strong className="block text-base text-[#354052]">
                {item.title}
              </strong>
              <span className="mt-1 block text-sm text-[#9a9b83]">
                {item.course} · Hạn {item.due}
              </span>
            </span>
            <span
              className={`status-pill ${item.status === "Quá hạn" ? "status-danger" : item.status === "Đã chấm" ? "status-success" : item.status === "Đã nộp" ? "status-info" : "status-warn"}`}
            >
              {item.score ?? item.status}
            </span>
            <ArrowRight className="hidden text-[#9a9b83] sm:block" size={17} />
          </Link>
        ))}
      </div>
    </>
  );
}

export function AssignmentDetailView({ id }: { id: string }) {
  const item = assignments.find((entry) => entry.id === id) ?? assignments[0];
  return (
    <>
      <Link
        href="/student/assignments"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6f956d]"
      >
        <ArrowLeft size={16} /> Quay lại bài tập
      </Link>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="soft-panel p-6 md:p-8">
          <span className="status-pill status-warn">{item.status}</span>
          <h1 className="mt-4 text-3xl font-black text-[#354052]">
            {item.title}
          </h1>
          <p className="mt-2 text-sm text-[#7d877d]">
            {item.course} · Hạn nộp {item.due}
          </p>
          <div className="mt-8 border-t border-[#eeeade] pt-6">
            <h2 className="text-lg font-black text-[#354052]">Hướng dẫn</h2>
            <p className="mt-3 text-sm leading-7 text-[#637064]">
              Hãy viết 8-10 câu sử dụng các từ vựng trong Unit 5. Đọc lại bài
              trước khi nộp và thử dùng ít nhất hai cụm từ mới.
            </p>
            <div className="mt-6 rounded-2xl bg-[#f7f7f0] p-4 text-sm text-[#566355]">
              <Sparkles className="mr-2 inline text-[#e5b44c]" size={17} /> Bạn
              có thể nộp bài bằng văn bản hoặc đính kèm tệp.
            </div>
          </div>
        </div>
        <div className="soft-panel h-fit p-5">
          <h2 className="font-black text-[#354052]">Nộp bài</h2>
          <textarea
            placeholder="Viết câu trả lời của bạn..."
            className="mt-4 min-h-32 w-full resize-none rounded-2xl border border-[#e8e8df] bg-[#fdfcf7] p-3 text-sm outline-none focus:border-[#9fbe99]"
          />
          <button className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-dashed border-[#c7d9bf] p-3 text-sm font-bold text-[#6f956d]">
            <Paperclip size={17} /> Đính kèm tệp
          </button>
          <button className="primary-button mt-4 flex w-full justify-center">
            <Send size={16} /> Nộp bài
          </button>
        </div>
      </div>
    </>
  );
}

export function ClassesView() {
  return (
    <>
      <StudentPageHeader
        eyebrow="My learning space"
        title="Lớp học của tôi"
        description="Những lớp học đang đồng hành cùng bạn."
      />
      <div className="grid gap-5 md:grid-cols-2">
        <div className="soft-panel overflow-hidden">
          <div className="bg-[#e8f1e2] p-6">
            <span className="status-pill status-success">Đang học</span>
            <h2 className="mt-4 text-2xl font-black text-[#354052]">
              {student.course}
            </h2>
            <p className="mt-1 text-sm text-[#637064]">
              Trình độ B1 · Khóa mùa thu 2026
            </p>
          </div>
          <div className="space-y-4 p-6 text-sm">
            <p>
              <GraduationCap className="mr-2 inline text-[#6f956d]" size={17} />
              Giáo viên: <strong>{student.teacher}</strong>
            </p>
            <p>
              <CalendarDays className="mr-2 inline text-[#6f956d]" size={17} />
              Thứ 3 & Thứ 5 · 19:00 - 20:30
            </p>
            <p>
              <MapPin className="mr-2 inline text-[#6f956d]" size={17} />
              Phòng A203
            </p>
            <Link
              href="/student/schedule"
              className="mt-2 inline-flex items-center gap-2 font-bold text-[#6f956d]"
            >
              Xem lịch học <ArrowRight size={15} />
            </Link>
          </div>
        </div>
        <div className="rounded-[28px] border border-dashed border-[#cbdcc4] bg-[#f2f7ee] p-6">
          <div className="flex h-full flex-col justify-center">
            <span className="text-4xl">🌱</span>
            <h2 className="mt-4 text-xl font-black text-[#354052]">
              Muốn học thêm?
            </h2>
            <p className="mt-2 text-sm leading-6 text-[#71806e]">
              Khám phá các lớp học mới phù hợp với mục tiêu của bạn.
            </p>
            <Link
              href="/student/register-class"
              className="primary-button mt-5 inline-flex w-fit"
            >
              Khám phá lớp <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export function GradesView() {
  return (
    <>
      <StudentPageHeader
        eyebrow="Your progress"
        title="Kết quả học tập"
        description="Nhìn lại những gì bạn đã làm được và bước tiếp theo."
      />
      <div className="grid gap-4 md:grid-cols-4">
        {[
          ["Điểm trung bình", "8.5/10"],
          ["Điểm cao nhất", "9.2/10"],
          ["Kỳ thi", "3"],
          ["Tiến bộ", "+12%"],
        ].map(([label, value]) => (
          <div className="soft-panel p-5" key={label}>
            <p className="label-muted">{label}</p>
            <p className="mt-3 text-2xl font-black text-[#354052]">{value}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 soft-panel p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Latest result</p>
            <h2 className="section-title">Midterm Exam</h2>
          </div>
          <span className="status-pill status-success">8.5 / 10</span>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          {[
            ["Listening", "8.0"],
            ["Speaking", "9.0"],
            ["Reading", "8.5"],
            ["Writing", "8.5"],
          ].map(([label, value]) => (
            <div
              className="rounded-2xl bg-[#f7f7f0] p-4 text-center"
              key={label}
            >
              <p className="text-xs text-[#9a9b83]">{label}</p>
              <p className="mt-2 text-xl font-black text-[#6f956d]">{value}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 rounded-2xl bg-[#fff6dc] p-4 text-sm leading-6 text-[#6f5d32]">
          “Em có khả năng nghe và nói tốt. Cần cải thiện thêm phần từ vựng.”
        </p>
      </div>
    </>
  );
}

export function InvoicesView() {
  return (
    <>
      <StudentPageHeader
        eyebrow="Your payments"
        title="Hóa đơn & học phí"
        description="Theo dõi học phí rõ ràng, không bỏ lỡ hạn thanh toán."
      />
      <div className="grid gap-4 md:grid-cols-3">
        <div className="soft-panel p-5">
          <p className="label-muted">Tổng học phí</p>
          <p className="mt-2 text-2xl font-black text-[#354052]">2.000.000đ</p>
        </div>
        <div className="soft-panel p-5">
          <p className="label-muted">Đã thanh toán</p>
          <p className="mt-2 text-2xl font-black text-[#6f956d]">1.000.000đ</p>
        </div>
        <div className="soft-panel p-5">
          <p className="label-muted">Còn lại</p>
          <p className="mt-2 text-2xl font-black text-[#df8e70]">1.000.000đ</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-[#f1eee4]">
            <div className="h-full w-1/2 rounded-full bg-[#6f956d]" />
          </div>
        </div>
      </div>
      <div className="mt-6 space-y-3">
        {invoices.map((invoice) => (
          <Link
            href={`/student/invoices/${invoice.id}`}
            className="assignment-row soft-panel"
            key={invoice.id}
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fff0e9] text-[#df8e70]">
              <FileText size={20} />
            </span>
            <span className="flex-1">
              <strong className="block text-sm text-[#354052]">
                {invoice.id} · {invoice.course}
              </strong>
              <span className="mt-1 block text-xs text-[#9a9b83]">
                Hạn thanh toán {invoice.due}
              </span>
            </span>
            <span className="text-right">
              <strong className="block text-sm text-[#354052]">
                {invoice.amount}
              </strong>
              <span className="status-pill status-warn mt-1 inline-block">
                {invoice.status}
              </span>
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}

export function InvoiceDetailView({ id }: { id: string }) {
  const invoice = invoices.find((entry) => entry.id === id) ?? invoices[0];
  return (
    <>
      <Link
        href="/student/invoices"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-[#6f956d]"
      >
        <ArrowLeft size={16} /> Quay lại hóa đơn
      </Link>
      <div className="invoice-paper max-w-2xl p-6 md:p-10">
        <div className="flex items-start justify-between border-b border-dashed border-[#d9d5c7] pb-6">
          <div>
            <span className="brand-mark">EB</span>
            <p className="mt-3 font-black text-[#354052]">ENGLISH BUDDY</p>
          </div>
          <div className="text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-[#9a9b83]">
              Hóa đơn học phí
            </p>
            <p className="mt-2 text-sm text-[#7d877d]">{invoice.id}</p>
          </div>
        </div>
        <div className="grid gap-4 py-6 text-sm sm:grid-cols-2">
          <p>
            Học viên
            <br />
            <strong>{student.fullName}</strong>
          </p>
          <p>
            Lớp học
            <br />
            <strong>{invoice.course}</strong>
          </p>
          <p>
            Ngày lập
            <br />
            <strong>04/09/2026</strong>
          </p>
          <p>
            Hạn thanh toán
            <br />
            <strong>{invoice.due}</strong>
          </p>
        </div>
        <div className="space-y-3 border-y border-dashed border-[#d9d5c7] py-6 text-sm">
          <p className="flex justify-between">
            Học phí <strong>2.000.000đ</strong>
          </p>
          <p className="flex justify-between">
            Đã thanh toán{" "}
            <strong className="text-[#6f956d]">-{invoice.paid}</strong>
          </p>
          <p className="flex justify-between text-lg font-black">
            Còn lại <strong className="text-[#df8e70]">1.000.000đ</strong>
          </p>
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="primary-button">
            <CreditCardIcon /> Thanh toán
          </button>
          <button className="rounded-full border border-[#e8e8df] px-5 py-3 text-sm font-bold text-[#7d877d]">
            <Download className="mr-2 inline" size={16} /> Tải hóa đơn
          </button>
        </div>
      </div>
    </>
  );
}
function CreditCardIcon() {
  return <span aria-hidden="true">💳</span>;
}

export function PaymentsView() {
  return (
    <>
      <StudentPageHeader
        eyebrow="Payment center"
        title="Thanh toán"
        description="Một bước đơn giản để giữ hành trình học tập liền mạch."
      />
      <div className="soft-panel max-w-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="eyebrow">Invoice HD001</p>
            <h2 className="mt-2 text-2xl font-black text-[#354052]">
              Số tiền cần thanh toán
            </h2>
          </div>
          <p className="text-2xl font-black text-[#df8e70]">1.000.000đ</p>
        </div>
        <div className="mt-8">
          <p className="text-sm font-bold text-[#354052]">Chọn phương thức</p>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {["💳 Chuyển khoản", "🏦 Ngân hàng", "📱 QR Code"].map(
              (method, index) => (
                <button
                  className={`rounded-2xl border p-4 text-left text-sm font-bold ${index === 0 ? "border-[#9fbe99] bg-[#eef5e9] text-[#587052]" : "border-[#e8e8df] text-[#7d877d]"}`}
                  key={method}
                >
                  {method}
                </button>
              ),
            )}
          </div>
        </div>
        <div className="mt-6 rounded-2xl bg-[#f7f7f0] p-5 text-center text-sm text-[#7d877d]">
          Quét mã QR để thanh toán học phí
          <br />
          <span className="mt-3 inline-flex h-28 w-28 items-center justify-center border-4 border-[#354052] bg-white text-5xl">
            ▦
          </span>
        </div>
        <button className="primary-button mt-5 flex w-full justify-center">
          Tôi đã thanh toán <CheckCircle2 size={17} />
        </button>
      </div>
    </>
  );
}

export function ProfileView() {
  return (
    <>
      <StudentPageHeader
        eyebrow="A little about you"
        title="Hồ sơ cá nhân"
        description="Thông tin của bạn luôn được bảo mật và cập nhật."
      />
      <div className="soft-panel max-w-2xl p-6 md:p-8">
        <div className="flex items-center gap-4 border-b border-[#eeeade] pb-6">
          <span className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[#d8e8d0] text-xl font-black text-[#587052]">
            {student.initials}
          </span>
          <div>
            <h2 className="text-xl font-black text-[#354052]">
              {student.fullName}
            </h2>
            <p className="text-sm text-[#9a9b83]">Học viên từ tháng 08/2026</p>
          </div>
        </div>
        <div className="mt-6 space-y-5 text-sm">
          {[
            [UserRound, "Họ và tên", student.fullName],
            [Mail, "Email", "minhanh.study@gmail.com"],
            [MessageCircle, "Số điện thoại", "0901 234 567"],
            [MapPin, "Địa chỉ", "Hà Nội"],
          ].map(([Icon, label, value]) => {
            const ItemIcon = Icon as typeof UserRound;
            return (
              <div className="flex items-center gap-3" key={label as string}>
                <ItemIcon className="text-[#6f956d]" size={18} />
                <div>
                  <p className="label-muted">{label as string}</p>
                  <p className="mt-1 font-bold text-[#354052]">
                    {value as string}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
        <button className="primary-button mt-8">Chỉnh sửa hồ sơ</button>
      </div>
    </>
  );
}
