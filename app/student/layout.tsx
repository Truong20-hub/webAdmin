import type { ReactNode } from "react";
import { StudentShell } from "@/components/student/StudentShell";

export const metadata = {
  title: "English Buddy | Student Portal",
  description: "Cổng học viên English Buddy",
};

export default function StudentLayout({ children }: { children: ReactNode }) {
  return <StudentShell>{children}</StudentShell>;
}
