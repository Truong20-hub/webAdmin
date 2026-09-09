"use client";

import {
  Edit3,
  EyeOff,
  FileImage,
  FileUp,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import * as XLSX from "xlsx";
import { apiRequest } from "@/api/client";
import { PageShell } from "@/components/admin/PageShell";

const pageSize = 5;

type UserForm = {
  maNguoiDung: string;
  tenDangNhap: string;
  matKhau: string;
  hoTen: string;
  email: string;
  soDienThoai: string;
  maVaiTro: string;
  avatarUrl: string;
  dangHoatDong: boolean;
};

const emptyUserForm: UserForm = {
  maNguoiDung: "",
  tenDangNhap: "",
  matKhau: "",
  hoTen: "",
  email: "",
  soDienThoai: "",
  maVaiTro: "",
  avatarUrl: "",
  dangHoatDong: true,
};

type Account = UserForm & {
  tenVaiTro: string;
  ngayTao?: string;
};

type UserResponse = Omit<Account, "matKhau" | "maNguoiDung" | "maVaiTro"> & {
  maNguoiDung: number;
  maVaiTro: number;
};

const mapUserResponse = (user: UserResponse): Account => ({
  ...user,
  maNguoiDung: String(user.maNguoiDung),
  maVaiTro: String(user.maVaiTro),
  matKhau: "",
  email: user.email ?? "",
  soDienThoai: user.soDienThoai ?? "",
  avatarUrl: user.avatarUrl ?? "",
  dangHoatDong: user.dangHoatDong ?? true,
});

export default function UserManagementPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [userForm, setUserForm] = useState<UserForm>(emptyUserForm);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const userFormFields = [
    ["tenDangNhap", "Tên đăng nhập", "text", true],
    ["matKhau", "Mật khẩu", "password", true],
    ["hoTen", "Họ tên", "text", true],
    ["email", "Email", "email", false],
    ["soDienThoai", "Số điện thoại", "tel", false],
    ["maVaiTro", "Mã vai trò", "number", true],
  ] as const;

  const filteredAccounts = accounts.filter((account) =>
    [account.tenDangNhap, account.hoTen, account.email, account.tenVaiTro]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()),
  );
  const totalPages = Math.ceil(filteredAccounts.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const currentAccounts = filteredAccounts.slice(
    startIndex,
    startIndex + pageSize,
  );

  const loadAccounts = async () => {
    setIsLoading(true);
    setError("");
    try {
      const users = await apiRequest<UserResponse[]>("/NguoiDung");
      setAccounts(users.map(mapUserResponse));
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Không thể tải danh sách người dùng.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Load the authoritative list from the API when the admin page opens.
  useEffect(() => {
    void Promise.resolve().then(loadAccounts);
  }, []);

  const openUserForm = (account?: Account) => {
    setEditingAccount(account ?? null);
    setUserForm(account ? { ...account } : emptyUserForm);
    setIsCreateFormOpen(true);
  };

  const closeUserForm = () => {
    setEditingAccount(null);
    setUserForm(emptyUserForm);
    setIsCreateFormOpen(false);
  };

  const handleAvatarChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        setUserForm((form) => ({ ...form, avatarUrl: result }));
      }
    };
    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleSubmitUser = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setError("");

    try {
      const commonData = {
        hoTen: userForm.hoTen.trim(),
        email: userForm.email.trim() || null,
        soDienThoai: userForm.soDienThoai.trim() || null,
        maVaiTro: Number(userForm.maVaiTro),
        avatarUrl: userForm.avatarUrl.trim() || null,
      };

      if (editingAccount) {
        await apiRequest(`/NguoiDung/${editingAccount.maNguoiDung}`, {
          method: "PUT",
          body: { ...commonData, dangHoatDong: userForm.dangHoatDong },
        });
      } else {
        await apiRequest("/NguoiDung", {
          method: "POST",
          body: {
            ...commonData,
            maNguoiDung: 0,
            tenDangNhap: userForm.tenDangNhap.trim(),
            matKhau: userForm.matKhau.trim(),
          },
        });
      }

      await loadAccounts();
      setCurrentPage(1);
      closeUserForm();
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Không thể lưu người dùng.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUser = async (account: Account) => {
    if (!window.confirm(`Bạn có chắc muốn xóa người dùng ${account.hoTen}?`))
      return;

    setError("");
    try {
      await apiRequest(`/NguoiDung/${account.maNguoiDung}`, {
        method: "DELETE",
      });
      await loadAccounts();
    } catch (deleteError) {
      setError(
        deleteError instanceof Error
          ? deleteError.message
          : "Không thể xóa người dùng.",
      );
    }
  };

  const handleImportExcel = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, string>>(
        firstSheet,
        {
          defval: "",
        },
      );

      const importedAccounts = rows
        .map((row) => {
          const getValue = (...keys: string[]) => {
            const value = keys.find((key) => row[key] !== undefined);
            return value ? String(row[value]).trim() : "";
          };

          const username = getValue(
            "username",
            "tenDangNhap",
            "TenDangNhap",
            "Tên đăng nhập",
          );
          const password = getValue(
            "password",
            "matKhau",
            "MatKhau",
            "Mật khẩu",
          );
          const fullName = getValue("fullName", "hoTen", "HoTen", "Họ tên");

          if (!username || !fullName) return null;

          return {
            tenDangNhap: username,
            matKhau: password || "123456",
            hoTen: fullName,
            email: getValue("email", "Email"),
            soDienThoai: getValue(
              "soDienThoai",
              "SoDienThoai",
              "Số điện thoại",
            ),
            maVaiTro: getValue("maVaiTro", "MaVaiTro", "Mã vai trò") || "1",
            avatarUrl: getValue("avatarUrl", "AvatarUrl", "Ảnh đại diện"),
          };
        })
        .filter(Boolean) as Array<{
        tenDangNhap: string;
        matKhau: string;
        hoTen: string;
        email: string;
        soDienThoai: string;
        maVaiTro: string;
        avatarUrl: string;
      }>;

      if (!importedAccounts.length) {
        alert(
          "File không chứa dữ liệu hợp lệ. Cần có các cột username và fullName (hoặc Tên đăng nhập và Họ tên).",
        );
        return;
      }

      await Promise.all(
        importedAccounts.map((account) =>
          apiRequest("/NguoiDung", {
            method: "POST",
            body: {
              ...account,
              maNguoiDung: 0,
              maVaiTro: Number(account.maVaiTro),
              email: account.email || null,
              soDienThoai: account.soDienThoai || null,
              avatarUrl: account.avatarUrl || null,
            },
          }),
        ),
      );
      await loadAccounts();
      setCurrentPage(1);
      alert(`Đã import ${importedAccounts.length} tài khoản thành công.`);
    } catch (error) {
      console.error(error);
      alert("Import file thất bại. Vui lòng kiểm tra định dạng Excel/CSV.");
    } finally {
      event.target.value = "";
    }
  };

  return (
    <PageShell
      title="Quản lý người dùng"
      description="Danh sách tài khoản người dùng trong hệ thống"
      action={
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]"
          >
            <FileUp className="h-4 w-4" />
            Import Excel
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleImportExcel}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => openUserForm()}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)]"
          >
            <Plus className="h-4 w-4" />
            Thêm người dùng
          </button>
        </div>
      }
    >
      <div className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <h3 className="text-xl font-bold text-slate-800">
            Danh sách tài khoản
          </h3>

          <div className="flex items-center gap-3">
            <label className="relative block">
              <span className="sr-only">Tìm kiếm</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setCurrentPage(1);
                }}
                className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 md:w-64"
              />
            </label>
          </div>
        </div>

        {error && (
          <p className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-600">
            {error}
          </p>
        )}

        <div className="mt-5 overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left">
            <thead>
              <tr className="bg-slate-50 text-xs uppercase tracking-[0.12em] text-slate-500">
                <th className="px-4 py-3 text-left font-semibold">
                  Tên đăng nhập
                </th>
                <th className="px-4 py-3 text-left font-semibold">Mật khẩu</th>
                <th className="px-4 py-3 text-left font-semibold">Họ tên</th>
                <th className="px-4 py-3 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Đang tải danh sách người dùng...
                  </td>
                </tr>
              ) : currentAccounts.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-sm text-slate-500"
                  >
                    Không có người dùng phù hợp.
                  </td>
                </tr>
              ) : (
                currentAccounts.map((account) => (
                  <tr
                    key={`${account.tenDangNhap}-${account.hoTen}`}
                    className="border-t border-slate-100"
                  >
                    <td className="px-4 py-3 align-middle text-left text-sm font-medium text-slate-700">
                      {account.tenDangNhap}
                    </td>
                    <td className="px-4 py-3 align-middle text-left text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="tracking-[0.2em]">********</span>
                        <button
                          type="button"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 transition hover:bg-slate-100 hover:text-violet-600"
                          aria-label={`Xem mật khẩu ${account.tenDangNhap}`}
                        >
                          <EyeOff className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-3 align-middle text-left text-sm text-slate-700">
                      {account.hoTen}
                    </td>
                    <td className="px-4 py-3 align-middle text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-600 transition hover:bg-violet-100"
                          onClick={() => openUserForm(account)}
                          aria-label={`Sửa ${account.hoTen}`}
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-rose-100 bg-rose-50 text-rose-500 transition hover:bg-rose-100"
                          onClick={() => void handleDeleteUser(account)}
                          aria-label={`Xóa ${account.hoTen}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Hiển thị {currentAccounts.length > 0 ? startIndex + 1 : 0} -{" "}
            {Math.min(startIndex + pageSize, accounts.length)} /{" "}
            {accounts.length}
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Trước
            </button>

            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;
              const isActive = pageNumber === currentPage;

              return (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setCurrentPage(pageNumber)}
                  className={[
                    "h-8 w-8 rounded-full text-sm font-medium transition",
                    isActive
                      ? "bg-gradient-to-r from-violet-500 to-pink-400 text-white shadow-[0_8px_18px_rgba(168,85,247,0.25)]"
                      : "border border-slate-200 bg-white text-slate-600 hover:border-violet-200 hover:text-violet-600",
                  ].join(" ")}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() =>
                setCurrentPage((page) => Math.min(totalPages, page + 1))
              }
              className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-600 transition hover:border-violet-200 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Sau
            </button>
          </div>
        </div>
      </div>

      {isCreateFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/25 p-4">
          <form
            onSubmit={handleSubmitUser}
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-[28px] bg-white p-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">
                  {editingAccount
                    ? "UpdateNguoiDungRequest"
                    : "CreateNguoiDungRequest"}
                </p>
                <h3 className="mt-1 text-xl font-bold text-slate-800">
                  {editingAccount ? "Cập nhật người dùng" : "Thêm người dùng"}
                </h3>
              </div>
              <button
                type="button"
                onClick={closeUserForm}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-slate-200"
                aria-label="Đóng form người dùng"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {userFormFields
                .filter(([key]) => !(editingAccount && key === "matKhau"))
                .map(([key, label, type, required]) => (
                  <label
                    key={key}
                    className="text-sm font-medium text-slate-600"
                  >
                    {label}
                    <input
                      required={required}
                      minLength={key === "matKhau" ? 6 : undefined}
                      maxLength={
                        key === "tenDangNhap"
                          ? 50
                          : key === "matKhau"
                            ? 100
                            : key === "hoTen"
                              ? 100
                              : key === "soDienThoai"
                                ? 20
                                : undefined
                      }
                      type={type}
                      value={String(userForm[key as keyof UserForm])}
                      onChange={(event) =>
                        setUserForm({
                          ...userForm,
                          [key]: event.target.value,
                        })
                      }
                      className="mt-1.5 w-full rounded-xl border border-slate-200 px-3 py-2.5 font-normal text-slate-700 outline-none transition focus:border-violet-300"
                    />
                  </label>
                ))}

              {editingAccount && (
                <label className="flex items-center gap-3 text-sm font-medium text-slate-600">
                  <input
                    type="checkbox"
                    checked={userForm.dangHoatDong}
                    onChange={(event) =>
                      setUserForm({
                        ...userForm,
                        dangHoatDong: event.target.checked,
                      })
                    }
                    className="h-4 w-4 accent-violet-600"
                  />
                  Tài khoản đang hoạt động
                </label>
              )}

              <div className="text-sm font-medium text-slate-600 sm:col-span-2">
                Ảnh đại diện
                <div className="mt-1.5 flex flex-wrap items-center gap-4 rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-4">
                  {userForm.avatarUrl ? (
                    <img
                      src={userForm.avatarUrl}
                      alt="Ảnh đại diện người dùng"
                      className="h-20 w-20 rounded-2xl object-cover ring-2 ring-white shadow-sm"
                    />
                  ) : (
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-white text-violet-300 ring-1 ring-violet-100">
                      <FileImage className="h-8 w-8" />
                    </div>
                  )}
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700">
                    <FileImage className="h-4 w-4" />
                    {userForm.avatarUrl ? "Đổi ảnh" : "Chọn ảnh"}
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={closeUserForm}
                className="rounded-full border border-slate-200 px-4 py-2 text-sm text-slate-600 transition hover:bg-slate-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-full bg-violet-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-violet-700"
              >
                {isSaving
                  ? "Đang lưu..."
                  : editingAccount
                    ? "Lưu thay đổi"
                    : "Thêm người dùng"}
              </button>
            </div>
          </form>
        </div>
      )}
    </PageShell>
  );
}
