import type { ReactNode } from "react";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata = {
  title: "English Class Management",
  description: "Admin dashboard for English class management system",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
