import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  ClipboardList,
  Plus,
  Search,
  Send,
  UsersRound,
} from "lucide-react";
import {
  teacherAssignments,
  teacherClasses,
  teacherNotifications,
  teacherSessions,
  teacherStudents,
} from "@/lib/teacher-data";

type Section =
  | "classes"
  | "schedule"
  | "students"
  | "attendance"
  | "assignments"
  | "grades"
  | "chat"
  | "notifications"
  | "profile";

const sectionCopy: Record<
  Section,
  { eyebrow: string; title: string; description: string }
> = {
  classes: {
    eyebrow: "Your classrooms",
    title: "Lớp học cô đang phụ trách",
    description: "Theo dõi tiến độ, học viên và hoạt động của từng lớp.",
  },
  schedule: {
    eyebrow: "Teaching calendar",
    title: "Lịch dạy của cô",
    description: "Hai buổi học hôm nay đã được sắp xếp sẵn.",
  },
  students: {
    eyebrow: "Learner directory",
    title: "Danh sách học viên",
    description: "Tìm kiếm và theo dõi tiến độ học tập của từng em.",
  },
  attendance: {
    eyebrow: "Quick attendance",
    title: "Điểm danh lớp học",
    description: "Chọn lớp, đánh dấu trạng thái và lưu trong vài giây.",
  },
  assignments: {
    eyebrow: "Practice library",
    title: "Bài tập của cô",
    description: "Quản lý bài đã giao và mở hàng đợi chấm bài.",
  },
  grades: {
    eyebrow: "Progress book",
    title: "Chấm điểm & kết quả",
    description: "Nhập điểm kiểm tra và gửi nhận xét cho học viên.",
  },
  chat: {
    eyebrow: "Family connection",
    title: "Chat với phụ huynh",
    description: "Trao đổi rõ ràng, ấm áp về việc học của từng em.",
  },
  notifications: {
    eyebrow: "Stay in the loop",
    title: "Thông báo",
    description: "Những việc cần chú ý trong lớp học của cô.",
  },
  profile: {
    eyebrow: "About you",
    title: "Hồ sơ cá nhân",
    description: "Thông tin tài khoản và cài đặt thông báo.",
  },
};

export function TeacherSectionPage({ section }: { section: Section }) {
  const copy = sectionCopy[section];
  return (
    <div className="space-y-6">
      <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="eyebrow text-[#aa777c]">{copy.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#354052]">
            {copy.title}
          </h1>
          <p className="mt-2 text-sm text-[#917d83]">{copy.description}</p>
        </div>
        {section === "assignments" && (
          <Link
            href="/teacher/assignments/create"
            className="primary-button inline-flex self-start bg-[#d8898c] hover:bg-[#c8787d]"
          >
            <Plus size={17} /> Giao bài tập
          </Link>
        )}
        {section === "classes" && (
          <Link
            href="/teacher/attendance"
            className="primary-button inline-flex self-start bg-[#d8898c] hover:bg-[#c8787d]"
          >
            <CheckCircle2 size={17} /> Điểm danh nhanh
          </Link>
        )}
      </header>
      {section === "classes" && <ClassesView />}
      {section === "schedule" && <ScheduleView />}
      {section === "students" && <StudentsView />}
      {section === "attendance" && <AttendanceView />}
      {section === "assignments" && <AssignmentsView />}
      {section === "grades" && <GradesView />}
      {section === "chat" && <ChatView />}
      {section === "notifications" && <NotificationsView />}
      {section === "profile" && <ProfileView />}
    </div>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="teacher-panel p-5 md:p-6">{children}</div>;
}
function ClassesView() {
  return (
    <div className="grid gap-5 lg:grid-cols-3">
      {teacherClasses.map((item) => (
        <Panel key={item.id}>
          <div className="flex items-start justify-between">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fbe6e4] text-[#a8656c]">
              <UsersRound size={20} />
            </span>
            <span className="status-pill status-success">Đang hoạt động</span>
          </div>
          <h2 className="mt-5 text-xl font-black text-[#354052]">
            {item.name}
          </h2>
          <p className="mt-1 text-xs font-bold uppercase tracking-wider text-[#a28e96]">
            {item.code} · {item.level}
          </p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="teacher-stat">
              <strong>{item.students}</strong>
              <span>Học viên</span>
            </div>
            <div className="teacher-stat">
              <strong>{item.average}</strong>
              <span>Điểm TB</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-[#806f75]">
            {item.schedule} · Phòng {item.room}
          </p>
          <div className="mt-5 flex gap-2">
            <Link
              href={`/teacher/classes/${item.id}`}
              className="flex-1 rounded-full bg-[#fbe6e4] px-3 py-2 text-center text-xs font-bold text-[#a8656c]"
            >
              Xem lớp
            </Link>
            <Link
              href="/teacher/attendance"
              className="rounded-full border border-[#eadfe3] px-3 py-2 text-xs font-bold text-[#806f75]"
            >
              Điểm danh
            </Link>
          </div>
        </Panel>
      ))}
    </div>
  );
}
function ScheduleView() {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_.8fr]">
      <Panel>
        <div className="flex items-center justify-between">
          <h2 className="section-title mt-0">Thứ sáu, 05/09/2026</h2>
          <span className="date-chip">Tuần này</span>
        </div>
        <div className="mt-6 space-y-3">
          {teacherSessions.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-3xl bg-[#faf5f1] p-5 sm:flex-row sm:items-center"
            >
              <div className="min-w-32 text-lg font-black text-[#a8656c]">
                {item.time}
              </div>
              <div className="flex-1">
                <h3 className="font-black text-[#354052]">{item.className}</h3>
                <p className="mt-1 text-sm text-[#917d83]">
                  {item.topic} · Phòng {item.room}
                </p>
              </div>
              <Link
                href="/teacher/attendance"
                className="rounded-full bg-white px-4 py-2 text-xs font-bold text-[#a8656c]"
              >
                Mở buổi học
              </Link>
            </div>
          ))}
        </div>
      </Panel>
      <Panel>
        <p className="eyebrow">Upcoming</p>
        <h2 className="section-title">Tuần tới</h2>
        <div className="mt-5 space-y-4 text-sm">
          <p>
            <strong>Thứ 2 · 07/09</strong>
            <br />
            <span className="text-[#917d83]">English A2 · 18:00</span>
          </p>
          <p>
            <strong>Thứ 3 · 08/09</strong>
            <br />
            <span className="text-[#917d83]">English B1 · 19:00</span>
          </p>
          <p>
            <strong>Thứ 7 · 12/09</strong>
            <br />
            <span className="text-[#917d83]">Young Learners 3 · 09:00</span>
          </p>
        </div>
      </Panel>
    </div>
  );
}
function StudentsView() {
  return (
    <Panel>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 rounded-full border border-[#eadfe3] bg-white px-4 py-2 text-sm text-[#a28e96]">
          <Search size={16} /> Tìm học viên...
        </div>
        <select
          className="rounded-full border border-[#eadfe3] bg-white px-4 py-2 text-sm text-[#806f75]"
          defaultValue="all"
        >
          <option value="all">Tất cả lớp</option>
          <option>English B1</option>
          <option>English A2</option>
        </select>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-[#eee5e1] text-xs uppercase tracking-wider text-[#a28e96]">
            <tr>
              <th className="px-3 py-3">Học viên</th>
              <th className="px-3 py-3">Lớp</th>
              <th className="px-3 py-3">Điểm TB</th>
              <th className="px-3 py-3">Chuyên cần</th>
              <th className="px-3 py-3">Tiến độ</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {teacherStudents.map((student) => (
              <tr
                key={student.id}
                className="border-b border-[#f2ebe7] last:border-0"
              >
                <td className="px-3 py-4">
                  <div className="flex items-center gap-3">
                    <span className="teacher-avatar">{student.initials}</span>
                    <span>
                      <strong className="block text-[#354052]">
                        {student.name}
                      </strong>
                      <small className="text-[#a28e96]">{student.email}</small>
                    </span>
                  </div>
                </td>
                <td className="px-3 py-4 text-[#806f75]">
                  {student.className}
                </td>
                <td className="px-3 py-4 font-bold">{student.average}</td>
                <td className="px-3 py-4">{student.attendance}%</td>
                <td className="px-3 py-4">
                  <div className="flex items-center gap-2">
                    <div className="teacher-progress w-20">
                      <span style={{ width: `${student.progress}%` }} />
                    </div>
                    {student.progress}%
                  </div>
                </td>
                <td className="px-3 py-4">
                  <Link
                    href={`/teacher/students/${student.id}`}
                    className="font-bold text-[#a8656c]"
                  >
                    Xem
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
function AttendanceView() {
  return (
    <Panel>
      <div className="grid gap-3 md:grid-cols-3">
        <label className="text-xs font-bold text-[#a28e96]">
          Lớp
          <select
            className="mt-2 block w-full rounded-2xl border border-[#eadfe3] bg-white p-3 text-sm"
            defaultValue="b1"
          >
            <option value="b1">English Intermediate B1</option>
            <option value="a2">English Starter A2</option>
          </select>
        </label>
        <label className="text-xs font-bold text-[#a28e96]">
          Ngày
          <input
            type="date"
            defaultValue="2026-09-05"
            className="mt-2 block w-full rounded-2xl border border-[#eadfe3] bg-white p-3 text-sm"
          />
        </label>
        <label className="text-xs font-bold text-[#a28e96]">
          Buổi học
          <select className="mt-2 block w-full rounded-2xl border border-[#eadfe3] bg-white p-3 text-sm">
            <option>19:00 - 20:30</option>
          </select>
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
        <button className="rounded-full bg-[#eaf3e6] px-4 py-2 text-xs font-bold text-[#70966b]">
          ✓ Có mặt tất cả
        </button>
        <button className="rounded-full bg-[#fbe6e4] px-4 py-2 text-xs font-bold text-[#a8656c]">
          × Vắng tất cả
        </button>
        <button className="rounded-full border border-[#eadfe3] px-4 py-2 text-xs font-bold text-[#806f75]">
          Đặt lại
        </button>
      </div>
      <div className="mt-5 space-y-2">
        {teacherStudents.slice(0, 3).map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between gap-3 rounded-2xl bg-[#faf5f1] p-3"
          >
            <div className="flex items-center gap-3">
              <span className="teacher-avatar">{student.initials}</span>
              <strong className="text-sm">{student.name}</strong>
            </div>
            <div className="flex gap-1">
              <button className="rounded-full bg-[#eaf3e6] px-3 py-2 text-xs font-bold text-[#70966b]">
                Có mặt
              </button>
              <button className="rounded-full border border-[#eadfe3] px-3 py-2 text-xs font-bold text-[#806f75]">
                Vắng
              </button>
              <button className="rounded-full border border-[#eadfe3] px-3 py-2 text-xs font-bold text-[#806f75]">
                Muộn
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="primary-button mt-6 inline-flex bg-[#d8898c] hover:bg-[#c8787d]">
        Lưu điểm danh
      </button>
    </Panel>
  );
}
function AssignmentsView() {
  return (
    <div className="grid gap-4">
      {teacherAssignments.map((item) => (
        <Panel key={item.id}>
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="flex items-start gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[#fff3d7] text-[#c79742]">
                <ClipboardList size={20} />
              </span>
              <div>
                <h2 className="font-black text-[#354052]">{item.title}</h2>
                <p className="mt-1 text-sm text-[#917d83]">
                  {item.className} · Hạn {item.due}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-5 text-sm">
              <span>
                <strong>
                  {item.submitted}/{item.total}
                </strong>
                <br />
                <small className="text-[#a28e96]">Đã nộp</small>
              </span>
              <span>
                <strong>{item.graded}</strong>
                <br />
                <small className="text-[#a28e96]">Đã chấm</small>
              </span>
              <Link
                href={`/teacher/assignments/${item.id}/submissions`}
                className="rounded-full bg-[#fbe6e4] px-4 py-2 text-xs font-bold text-[#a8656c]"
              >
                Xem bài nộp <ArrowRight className="ml-1 inline" size={13} />
              </Link>
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}
function GradesView() {
  return (
    <Panel>
      <div className="flex items-center justify-between">
        <div>
          <p className="eyebrow">English Intermediate B1</p>
          <h2 className="section-title">Điểm kiểm tra Unit 5</h2>
        </div>
        <button className="primary-button inline-flex bg-[#d8898c] hover:bg-[#c8787d]">
          Lưu tất cả
        </button>
      </div>
      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="border-b border-[#eee5e1] text-xs uppercase tracking-wider text-[#a28e96]">
            <tr>
              <th className="px-3 py-3">Học viên</th>
              <th>Listening</th>
              <th>Speaking</th>
              <th>Reading</th>
              <th>Writing</th>
              <th>Tổng</th>
            </tr>
          </thead>
          <tbody>
            {teacherStudents.slice(0, 3).map((student) => (
              <tr key={student.id} className="border-b border-[#f2ebe7]">
                <td className="px-3 py-4 font-bold">{student.name}</td>
                {["8", "9", "8.5", "8.5"].map((score, index) => (
                  <td key={index}>
                    <input
                      className="w-20 rounded-xl border border-[#eadfe3] p-2"
                      defaultValue={score}
                      type="number"
                      min="0"
                      max="10"
                      step="0.5"
                    />
                  </td>
                ))}
                <td className="font-black">8.5</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Panel>
  );
}
function ChatView() {
  return (
    <div className="grid min-h-[560px] gap-0 overflow-hidden rounded-[28px] border border-[#eee5e1] bg-[#fffdfa] shadow-[0_14px_40px_rgba(75,62,67,.045)] md:grid-cols-[280px_1fr]">
      <div className="border-b border-[#eee5e1] p-4 md:border-b-0 md:border-r">
        <div className="flex items-center justify-between">
          <h2 className="font-black">Phụ huynh</h2>
          <span className="status-pill status-warn">4 mới</span>
        </div>
        {["Nguyễn Văn Minh", "Trần Thị Hoa", "Lê Văn Nam"].map(
          (name, index) => (
            <button
              key={name}
              className={`mt-3 flex w-full items-center gap-3 rounded-2xl p-3 text-left ${index === 0 ? "bg-[#fff0ef]" : "hover:bg-[#faf5f1]"}`}
            >
              <span className="teacher-avatar">
                {name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(-2)
                  .join("")}
              </span>
              <span>
                <strong className="block text-sm">{name}</strong>
                <small className="text-[#a28e96]">
                  Phụ huynh của {index === 0 ? "Minh Anh" : "học viên"}
                </small>
              </span>
            </button>
          ),
        )}
      </div>
      <div className="flex flex-col">
        <div className="border-b border-[#eee5e1] p-5">
          <h2 className="font-black">Nguyễn Văn Minh</h2>
          <p className="text-xs text-[#a28e96]">
            Phụ huynh của Nguyễn Minh Anh · English B1
          </p>
        </div>
        <div className="flex-1 space-y-4 p-5">
          <div className="max-w-md rounded-3xl rounded-tl-md bg-[#faf5f1] p-4 text-sm">
            Cô cho em hỏi Minh cần cải thiện kỹ năng nào không cô?
            <small className="mt-2 block text-xs text-[#a28e96]">
              19:42 · Đã nhận
            </small>
          </div>
          <div className="ml-auto max-w-md rounded-3xl rounded-tr-md bg-[#fbe6e4] p-4 text-sm">
            Em cần luyện thêm từ vựng và Reading ạ. 🌟
            <small className="mt-2 block text-xs text-[#a8656c]">
              19:45 · Đã xem
            </small>
          </div>
        </div>
        <div className="flex gap-2 border-t border-[#eee5e1] p-4">
          <input
            className="flex-1 rounded-full border border-[#eadfe3] px-4 py-3 text-sm outline-none"
            placeholder="Nhập tin nhắn..."
          />
          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d8898c] text-white">
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
function NotificationsView() {
  return (
    <Panel>
      <div className="space-y-2">
        {teacherNotifications.map((item) => (
          <div
            key={item.text}
            className="flex items-start gap-4 rounded-2xl p-4 transition hover:bg-[#faf5f1]"
          >
            <span className="text-2xl">{item.icon}</span>
            <div>
              <p className="font-bold text-[#354052]">{item.text}</p>
              <p className="mt-1 text-xs text-[#a28e96]">{item.time}</p>
            </div>
            <ArrowRight className="ml-auto text-[#c2aeb2]" size={17} />
          </div>
        ))}
      </div>
    </Panel>
  );
}
function ProfileView() {
  return (
    <Panel>
      <div className="flex flex-col items-center gap-4 border-b border-[#eee5e1] pb-6 sm:flex-row">
        <span className="flex h-20 w-20 items-center justify-center rounded-full bg-[#f7d9d7] text-xl font-black text-[#a8656c]">
          LN
        </span>
        <div>
          <h2 className="text-xl font-black">Nguyễn Thị Lan</h2>
          <p className="text-sm text-[#a28e96]">
            Giáo viên tiếng Anh · lan.nguyen@example.com
          </p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="text-xs font-bold text-[#a28e96]">
          Họ và tên
          <input
            className="mt-2 block w-full rounded-2xl border border-[#eadfe3] p-3 text-sm"
            defaultValue="Nguyễn Thị Lan"
          />
        </label>
        <label className="text-xs font-bold text-[#a28e96]">
          Email
          <input
            className="mt-2 block w-full rounded-2xl border border-[#eadfe3] p-3 text-sm"
            defaultValue="lan.nguyen@example.com"
          />
        </label>
      </div>
      <button className="primary-button mt-6 inline-flex bg-[#d8898c] hover:bg-[#c8787d]">
        Lưu thay đổi
      </button>
    </Panel>
  );
}
