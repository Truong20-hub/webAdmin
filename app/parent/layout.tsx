import type { ReactNode } from "react";
import { ParentShell } from "@/components/parent/ParentShell";

export const metadata = {
  title: "English Buddy | Parent Portal",
  description: "Cổng phụ huynh English Buddy",
};

export default function ParentLayout({ children }: { children: ReactNode }) {
  return <ParentShell>{children}</ParentShell>;
}
