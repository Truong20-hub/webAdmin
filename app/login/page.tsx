"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/api/client";

type LoginResponse = {
  token: string;
  maNguoiDung: number;
  hoTen: string;
  tenDangNhap: string;
  vaiTro: string;
};

export default function LoginPage() {
  const router = useRouter();
  const [tenDangNhap, setTenDangNhap] = useState("admin");
  const [matKhau, setMatKhau] = useState("admin123");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const click = () => {
    console.log("tenDangNhap:", tenDangNhap);
    console.log("matKhau:", matKhau);
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await apiRequest<LoginResponse>("/NguoiDung/login", {
        method: "POST",
        body: { tenDangNhap: tenDangNhap.trim(), matKhau },
      });

      if (!result.token) {
        throw new Error("API không trả về token đăng nhập.");
      }

      window.localStorage.setItem("accessToken", result.token);
      window.localStorage.setItem("currentUser", JSON.stringify(result));
      router.push("/admin");
      } catch (ex) {
      let msg = "Đã có lỗi xảy ra.";
      if (ex instanceof Error) {
        try {
          // lỗi dạng {"message":"..."} -> lấy phần message
          msg = JSON.parse(ex.message).message ?? ex.message;
        } catch {
          msg = ex.message; // không phải JSON thì giữ nguyên
        }
      }
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[radial-gradient(circle_at_top,_#f5e8ff,_#eef2ff_35%,_#f8fafc_100%)] p-6">
      <div className="w-full max-w-md rounded-[32px] border border-violet-100 bg-white p-8 shadow-[0_30px_80px_rgba(139,92,246,0.10)]">
        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-200 via-pink-200 to-emerald-200 text-2xl shadow-sm">
            🌸
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.32em] text-violet-400">
            English Class
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">Đăng nhập</h1>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Tên đăng nhập
            </label>
            <input
              type="text"
              required
              autoComplete="username"
              value={tenDangNhap}
              onChange={(event) => setTenDangNhap(event.target.value)}
              className="w-full rounded-2xl border border-violet-100 bg-violet-50/30 px-4 py-3 text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Mật khẩu
            </label>
            <input
              type="password"
              required
              minLength={6}
              autoComplete="current-password"
              value={matKhau}
              onChange={(event) => setMatKhau(event.target.value)}
              className="w-full rounded-2xl border border-violet-100 bg-violet-50/30 px-4 py-3 text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
            />
          </div>

          {error && <p className="text-sm text-rose-600">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            onClick={click}
            className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-3 text-sm font-semibold text-white shadow-[0_18px_30px_rgba(168,85,247,0.25)] transition hover:translate-y-[-1px]"
          >
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-500">
          Chưa có tài khoản?{" "}
          <Link
            href="/admin"
            className="font-semibold text-violet-600 hover:text-violet-700"
          >
            Đi đến admin
          </Link>
        </div>
      </div>
    </main>
  );
}
