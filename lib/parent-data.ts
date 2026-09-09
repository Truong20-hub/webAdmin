import { assignments, invoices, schedule, student } from "@/lib/student-data";

export const parent = {
  name: "Nguyễn Văn Minh",
  shortName: "anh Minh",
  initials: "NM",
  child: student,
};

export const children = [
  student,
  {
    ...student,
    name: "Minh Đức",
    fullName: "Nguyễn Minh Đức",
    initials: "MD",
    course: "English Elementary A2",
    progress: 61,
    teacher: "Trần Quốc Nam",
  },
];

export const parentSchedule = schedule;
export const parentAssignments = assignments;
export const parentInvoices = invoices;

export const gradeBreakdown = [
  ["Listening", 80],
  ["Speaking", 90],
  ["Reading", 85],
  ["Writing", 85],
] as const;

export type ChatMessage = {
  id: string;
  sender: "teacher" | "parent";
  text: string;
  time: string;
  status?: "Đã gửi" | "Đã xem";
};

export const conversations = [
  {
    id: "lan",
    teacher: "Nguyễn Thị Lan",
    initials: "NL",
    course: "English Intermediate B1",
    preview: "Minh hôm nay học rất tốt ạ.",
    time: "19:45",
    unread: 2,
    online: true,
  },
  {
    id: "nam",
    teacher: "Trần Quốc Nam",
    initials: "TN",
    course: "English Elementary A2",
    preview: "Em nhớ ôn lại từ vựng Unit 3 nhé.",
    time: "Hôm qua",
    unread: 0,
    online: false,
  },
];

export const initialMessages: ChatMessage[] = [
  {
    id: "m1",
    sender: "teacher",
    text: "Chào anh Minh, hôm nay Minh học phần Speaking khá tốt ạ.",
    time: "19:42",
  },
  {
    id: "m2",
    sender: "teacher",
    text: "Em đã tự tin trình bày và phát âm tiến bộ rõ rệt.",
    time: "19:43",
  },
  {
    id: "m3",
    sender: "parent",
    text: "Cảm ơn cô. Cô có thể cho em biết Minh cần cải thiện phần nào không ạ?",
    time: "19:45",
    status: "Đã xem",
  },
];

export const notifications = [
  {
    icon: "📚",
    text: "Minh có buổi học vào 19:00 hôm nay.",
    time: "10 phút trước",
    href: "/parent/schedule",
  },
  {
    icon: "🏆",
    text: "Minh vừa đạt 9.0 điểm Speaking!",
    time: "1 giờ trước",
    href: "/parent/grades",
  },
  {
    icon: "💬",
    text: "Cô Lan vừa gửi tin nhắn.",
    time: "2 giờ trước",
    href: "/parent/chat",
  },
  {
    icon: "💳",
    text: "Hóa đơn HD001 sắp đến hạn.",
    time: "Hôm qua",
    href: "/parent/invoices/HD001",
  },
];
