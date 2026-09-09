export type TeacherClass = {
  id: string;
  name: string;
  level: string;
  code: string;
  students: number;
  room: string;
  schedule: string;
  attendance: number;
  average: number;
  progress: number;
};

export type TeacherSession = {
  id: string;
  className: string;
  time: string;
  room: string;
  students: number;
  topic: string;
  status: "Sắp bắt đầu" | "Đang diễn ra" | "Đã hủy";
};

export type TeacherAssignment = {
  id: string;
  title: string;
  className: string;
  due: string;
  submitted: number;
  total: number;
  graded: number;
  type: string;
};

export type TeacherStudent = {
  id: string;
  name: string;
  initials: string;
  email: string;
  className: string;
  average: number;
  attendance: number;
  progress: number;
  status: string;
};

export const teacher = {
  name: "Lan",
  fullName: "Nguyễn Thị Lan",
  initials: "LN",
  role: "Giáo viên tiếng Anh",
};

export const teacherClasses: TeacherClass[] = [
  {
    id: "b1",
    name: "English Intermediate B1",
    level: "Intermediate",
    code: "EN-B1-04",
    students: 24,
    room: "A203",
    schedule: "Thứ 3, 5 · 19:00 - 20:30",
    attendance: 95,
    average: 8.2,
    progress: 76,
  },
  {
    id: "a2",
    name: "English Starter A2",
    level: "Pre-intermediate",
    code: "EN-A2-08",
    students: 22,
    room: "B105",
    schedule: "Thứ 2, 4 · 18:00 - 19:30",
    attendance: 92,
    average: 7.8,
    progress: 64,
  },
  {
    id: "kids",
    name: "Young Learners 3",
    level: "Elementary",
    code: "YL-03-12",
    students: 26,
    room: "C101",
    schedule: "Thứ 7 · 09:00 - 10:30",
    attendance: 97,
    average: 8.6,
    progress: 82,
  },
];

export const teacherSessions: TeacherSession[] = [
  {
    id: "session-b1",
    className: "English Intermediate B1",
    time: "19:00 - 20:30",
    room: "A203",
    students: 24,
    topic: "Unit 5 - Speaking",
    status: "Sắp bắt đầu",
  },
  {
    id: "session-a2",
    className: "English Starter A2",
    time: "21:00 - 22:30",
    room: "B105",
    students: 22,
    topic: "Daily routines",
    status: "Sắp bắt đầu",
  },
];

export const teacherAssignments: TeacherAssignment[] = [
  {
    id: "ta1",
    title: "Vocabulary Unit 5",
    className: "English B1",
    due: "08/09/2026 · 23:59",
    submitted: 18,
    total: 24,
    graded: 12,
    type: "Vocabulary",
  },
  {
    id: "ta2",
    title: "Writing: My dream trip",
    className: "English B1",
    due: "10/09/2026 · 23:59",
    submitted: 14,
    total: 24,
    graded: 9,
    type: "Writing",
  },
  {
    id: "ta3",
    title: "Listening practice 03",
    className: "English A2",
    due: "12/09/2026 · 23:59",
    submitted: 19,
    total: 22,
    graded: 18,
    type: "Listening",
  },
];

export const teacherStudents: TeacherStudent[] = [
  {
    id: "student-1",
    name: "Nguyễn Minh Anh",
    initials: "MA",
    email: "minhanh@example.com",
    className: "English B1",
    average: 8.5,
    attendance: 95,
    progress: 72,
    status: "Đang tiến bộ tốt",
  },
  {
    id: "student-2",
    name: "Trần Minh Đức",
    initials: "MD",
    email: "minhduc@example.com",
    className: "English B1",
    average: 7.8,
    attendance: 90,
    progress: 65,
    status: "Ổn định",
  },
  {
    id: "student-3",
    name: "Lê Minh Tuấn",
    initials: "MT",
    email: "minhtuan@example.com",
    className: "English A2",
    average: 8.1,
    attendance: 93,
    progress: 68,
    status: "Đang tiến bộ tốt",
  },
  {
    id: "student-4",
    name: "Phạm Khánh Linh",
    initials: "KL",
    email: "khanhlinh@example.com",
    className: "Young Learners 3",
    average: 8.9,
    attendance: 97,
    progress: 84,
    status: "Nổi bật",
  },
];

export const teacherNotifications = [
  { icon: "📝", text: "Có 6 bài tập đang chờ chấm.", time: "5 phút trước" },
  {
    icon: "💬",
    text: "Nguyễn Văn Minh vừa gửi tin nhắn.",
    time: "12 phút trước",
  },
  { icon: "📚", text: "Bạn có lớp English B1 lúc 19:00.", time: "1 giờ trước" },
];
