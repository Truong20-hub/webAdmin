export type ScheduleItem = {
  id: string;
  day: string;
  date: string;
  time: string;
  course: string;
  room: string;
  teacher: string;
  topic: string;
  cancelled?: boolean;
};

export type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  status: "Chưa làm" | "Đã nộp" | "Đã chấm" | "Quá hạn";
  score?: string;
};

export const student = {
  name: "Minh Anh",
  fullName: "Nguyễn Minh Anh",
  initials: "MA",
  course: "English Intermediate B1",
  teacher: "Nguyễn Thị Lan",
  progress: 72,
  xp: "1.250 XP",
  streak: "7 ngày",
};

export const schedule: ScheduleItem[] = [
  {
    id: "session-1",
    day: "Thứ 3",
    date: "08/09/2026",
    time: "19:00 - 20:30",
    course: "English Intermediate B1",
    room: "A203",
    teacher: "Nguyễn Thị Lan",
    topic: "Unit 5 - Speaking & Listening",
  },
  {
    id: "session-2",
    day: "Thứ 5",
    date: "10/09/2026",
    time: "19:00 - 20:30",
    course: "English Intermediate B1",
    room: "A203",
    teacher: "Nguyễn Thị Lan",
    topic: "Unit 5 - Vocabulary",
  },
  {
    id: "session-3",
    day: "Thứ 7",
    date: "12/09/2026",
    time: "09:00 - 10:30",
    course: "English Intermediate B1",
    room: "A203",
    teacher: "Nguyễn Thị Lan",
    topic: "Workshop: Travel English",
  },
];

export const assignments: Assignment[] = [
  {
    id: "a1",
    title: "Vocabulary Unit 5",
    course: "English Intermediate B1",
    due: "08/09/2026 - 23:59",
    status: "Chưa làm",
  },
  {
    id: "a2",
    title: "Listening Practice",
    course: "English Intermediate B1",
    due: "10/09/2026 - 23:59",
    status: "Đã nộp",
  },
  {
    id: "a3",
    title: "Grammar Unit 4",
    course: "English Intermediate B1",
    due: "12/09/2026 - 23:59",
    status: "Đã chấm",
    score: "9.0/10",
  },
  {
    id: "a4",
    title: "Writing: My dream trip",
    course: "English Intermediate B1",
    due: "02/09/2026 - 23:59",
    status: "Quá hạn",
  },
];

export const invoices = [
  {
    id: "HD001",
    course: "English Intermediate B1",
    amount: "1.800.000đ",
    due: "10/09/2026",
    status: "Thanh toán một phần",
    paid: "1.000.000đ",
  },
  {
    id: "HD002",
    course: "English A2",
    amount: "1.800.000đ",
    due: "05/08/2026",
    status: "Đã thanh toán",
    paid: "1.800.000đ",
  },
];
