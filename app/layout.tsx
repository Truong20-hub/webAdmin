import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "English Class Management",
  description: "Admin dashboard for an English class management system",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#f6f7ff] text-slate-700">
        {children}
      </body>
    </html>
  );
}
