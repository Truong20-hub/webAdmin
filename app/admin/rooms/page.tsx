"use client";

import { DoorOpen, Edit3, MapPin, Plus, Search, Trash2, Users, X } from "lucide-react";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { apiRequest } from "@/api/client";
import { PageShell } from "@/components/admin/PageShell";

type Room = {
  maPhong: number;
  tenPhong: string;
  sucChua: number | null;
  viTri: string | null;
};

type RoomForm = {
  tenPhong: string;
  sucChua: string;
  viTri: string;
};

type ApiListResponse<T> = T[] | { data?: T[] };

const emptyForm: RoomForm = { tenPhong: "", sucChua: "", viTri: "" };
const pageSize = 8;

function getRoomList(response: ApiListResponse<Room>): Room[] {
  const rooms = Array.isArray(response) ? response : response.data;
  if (!Array.isArray(rooms)) {
    throw new Error("Dữ liệu danh sách phòng học không hợp lệ.");
  }
  return rooms;
}

function getErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof Error) || !error.message) return fallback;

  try {
    const response = JSON.parse(error.message) as {
      message?: string;
      title?: string;
    };
    return response.message ?? response.title ?? fallback;
  } catch {
    return error.message.split("\n")[0] || fallback;
  }
}

export default function RoomManagementPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [roomForm, setRoomForm] = useState<RoomForm>(emptyForm);
  const [errorMessage, setErrorMessage] = useState("");
  const [formError, setFormError] = useState("");

  const loadRooms = useCallback(async (keyword: string) => {
    setIsLoading(true);
    setErrorMessage("");
    try {
      const endpoint = keyword.trim()
        ? `/PhongHoc/search?keyword=${encodeURIComponent(keyword.trim())}`
        : "/PhongHoc";
      const response = await apiRequest<ApiListResponse<Room>>(endpoint);
      setRooms(getRoomList(response));
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Không thể tải danh sách phòng học."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void loadRooms(searchTerm);
    }, searchTerm ? 250 : 0);
    return () => window.clearTimeout(timer);
  }, [loadRooms, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(rooms.length / pageSize));
  const safePage = Math.min(currentPage, totalPages);
  const currentRooms = useMemo(
    () => rooms.slice((safePage - 1) * pageSize, safePage * pageSize),
    [rooms, safePage],
  );

  const stats = [
    {
      label: "Tổng phòng học",
      value: rooms.length.toLocaleString("vi-VN"),
      note: "Phòng trong danh sách",
      icon: DoorOpen,
      tone: "from-violet-200 via-violet-100 to-pink-100",
    },
    {
      label: "Tổng sức chứa",
      value: rooms.reduce((total, room) => total + (room.sucChua ?? 0), 0).toLocaleString("vi-VN"),
      note: "Chỗ ngồi tối đa",
      icon: Users,
      tone: "from-sky-200 via-cyan-100 to-emerald-100",
    },
    {
      label: "Có thông tin vị trí",
      value: rooms.filter((room) => Boolean(room.viTri?.trim())).length.toLocaleString("vi-VN"),
      note: "Phòng đã định vị",
      icon: MapPin,
      tone: "from-amber-200 via-yellow-100 to-orange-100",
    },
  ];

  const openForm = (room?: Room) => {
    setEditingRoom(room ?? null);
    setRoomForm(
      room
        ? {
            tenPhong: room.tenPhong,
            sucChua: room.sucChua?.toString() ?? "",
            viTri: room.viTri ?? "",
          }
        : emptyForm,
    );
    setFormError("");
    setErrorMessage("");
    setIsFormOpen(true);
  };

  const closeForm = () => {
    if (isSaving) return;
    setIsFormOpen(false);
    setEditingRoom(null);
    setRoomForm(emptyForm);
    setFormError("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    setFormError("");
    setErrorMessage("");

    try {
      await apiRequest(
        editingRoom ? `/PhongHoc/${editingRoom.maPhong}` : "/PhongHoc",
        {
          method: editingRoom ? "PUT" : "POST",
          body: {
            tenPhong: roomForm.tenPhong.trim(),
            sucChua: roomForm.sucChua ? Number(roomForm.sucChua) : null,
            viTri: roomForm.viTri.trim() || null,
          },
        },
      );
      setIsFormOpen(false);
      setEditingRoom(null);
      setRoomForm(emptyForm);
      await loadRooms(searchTerm);
    } catch (error) {
      setFormError(
        getErrorMessage(error, editingRoom ? "Không thể cập nhật phòng học." : "Không thể thêm phòng học."),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (room: Room) => {
    if (!window.confirm(`Bạn có chắc muốn xóa phòng "${room.tenPhong}"?`)) return;

    setDeletingRoomId(room.maPhong);
    setErrorMessage("");
    try {
      await apiRequest(`/PhongHoc/${room.maPhong}`, { method: "DELETE" });
      await loadRooms(searchTerm);
    } catch (error) {
      setErrorMessage(
        getErrorMessage(error, "Không thể xóa phòng học. Phòng có thể đang được lớp học sử dụng."),
      );
    } finally {
      setDeletingRoomId(null);
    }
  };

  return (
    <PageShell
      title="Quản lý phòng học"
      description="Quản lý tên phòng, sức chứa và vị trí các phòng học"
      action={
        <button
          type="button"
          onClick={() => openForm()}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-4 py-2.5 text-sm font-medium text-white shadow-[0_12px_30px_rgba(168,85,247,0.2)] transition hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4" />
          Thêm phòng học
        </button>
      }
    >
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        {stats.map(({ label, value, note, icon: Icon, tone }) => (
          <div
            key={label}
            className="rounded-[24px] border border-violet-100 bg-white p-5 shadow-[0_18px_40px_rgba(140,122,255,0.05)]"
          >
            <div className="flex items-center justify-between">
              <div className={`flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tone}`}>
                <Icon className="h-5 w-5 text-slate-700" />
              </div>
              <span className="text-xs text-violet-500">{note}</span>
            </div>
            <p className="mt-5 text-sm text-slate-500">{label}</p>
            <h3 className="mt-2 text-3xl font-bold text-slate-800">{value}</h3>
          </div>
        ))}
      </div>

      {errorMessage && (
        <div role="alert" className="mb-4 flex items-start justify-between gap-3 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <span>{errorMessage}</span>
          <button type="button" onClick={() => setErrorMessage("")} aria-label="Đóng thông báo lỗi">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <section className="rounded-[28px] border border-violet-100 bg-white p-5 shadow-[0_20px_50px_rgba(140,122,255,0.06)]">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Danh sách phòng học</h3>
            <p className="mt-1 text-sm text-slate-500">
              {rooms.length.toLocaleString("vi-VN")} phòng học
            </p>
          </div>
          <label className="relative block w-full sm:max-w-sm">
            <span className="sr-only">Tìm kiếm phòng học</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setCurrentPage(1);
              }}
              placeholder="Tìm theo tên, vị trí hoặc sức chứa..."
              className="w-full rounded-full border border-violet-100 bg-slate-50 py-2.5 pl-9 pr-4 text-sm text-slate-700 outline-none transition focus:border-violet-300"
            />
          </label>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-y-2 text-left">
            <thead>
              <tr className="text-sm text-slate-500">
                <th className="px-3 py-2 font-semibold">Tên phòng</th>
                <th className="px-3 py-2 font-semibold">Vị trí</th>
                <th className="px-3 py-2 text-right font-semibold">Sức chứa</th>
                <th className="px-3 py-2 text-right font-semibold">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="px-3 py-10 text-center text-slate-500">Đang tải phòng học...</td></tr>
              ) : currentRooms.length ? currentRooms.map((room) => (
                <tr key={room.maPhong} className="bg-slate-50 text-sm text-slate-700 shadow-sm">
                  <td className="rounded-l-2xl px-3 py-3">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
                        <DoorOpen className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-slate-800">{room.tenPhong}</p>
                        <p className="mt-0.5 text-xs text-slate-400">Mã phòng: {room.maPhong}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <span className="inline-flex items-center gap-1.5 text-slate-600">
                      <MapPin className="h-4 w-4 text-violet-400" />
                      {room.viTri?.trim() || "Chưa cập nhật"}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">
                    {room.sucChua != null ? `${room.sucChua} chỗ` : "Chưa cập nhật"}
                  </td>
                  <td className="rounded-r-2xl px-3 py-3 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => openForm(room)}
                      className="rounded-lg p-2 text-violet-600 transition hover:bg-violet-100"
                      aria-label={`Sửa phòng ${room.tenPhong}`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => void handleDelete(room)}
                      disabled={deletingRoomId === room.maPhong}
                      className="rounded-lg p-2 text-rose-500 transition hover:bg-rose-50 disabled:opacity-50"
                      aria-label={`Xóa phòng ${room.tenPhong}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={4} className="px-3 py-12 text-center">
                    <DoorOpen className="mx-auto h-8 w-8 text-violet-300" />
                    <p className="mt-2 font-medium text-slate-600">
                      {searchTerm ? "Không tìm thấy phòng phù hợp." : "Chưa có phòng học nào."}
                    </p>
                    {!searchTerm && (
                      <button type="button" onClick={() => openForm()} className="mt-3 text-sm font-semibold text-violet-600 hover:text-violet-700">
                        Thêm phòng học đầu tiên
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {!isLoading && rooms.length > 0 && (
          <div className="mt-4 flex flex-col gap-3 border-t border-violet-50 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Hiển thị {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, rooms.length)} trong {rooms.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={safePage <= 1}
                className="rounded-full border border-violet-100 px-4 py-2 text-sm text-slate-600 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Trước
              </button>
              <span className="min-w-20 text-center text-sm text-slate-500">{safePage} / {totalPages}</span>
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={safePage >= totalPages}
                className="rounded-full border border-violet-100 px-4 py-2 text-sm text-slate-600 transition hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Sau
              </button>
            </div>
          </div>
        )}
      </section>

      {isFormOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-slate-900/40 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeForm();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="room-form-title"
            className="my-auto w-full max-w-lg rounded-[28px] border border-violet-100 bg-white p-6 shadow-2xl"
          >
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-violet-400">Thông tin phòng</p>
                <h3 id="room-form-title" className="mt-1 text-xl font-bold text-slate-800">
                  {editingRoom ? "Cập nhật phòng học" : "Thêm phòng học"}
                </h3>
              </div>
              <button type="button" onClick={closeForm} disabled={isSaving} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Đóng biểu mẫu">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && <div role="alert" className="mb-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{formError}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Tên phòng <span className="text-rose-500">*</span></span>
                <input
                  required
                  maxLength={50}
                  value={roomForm.tenPhong}
                  onChange={(event) => setRoomForm((form) => ({ ...form, tenPhong: event.target.value }))}
                  placeholder="Ví dụ: Phòng 101"
                  className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Sức chứa</span>
                <input
                  type="number"
                  min={1}
                  step={1}
                  value={roomForm.sucChua}
                  onChange={(event) => setRoomForm((form) => ({ ...form, sucChua: event.target.value }))}
                  placeholder="Số học viên tối đa"
                  className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-slate-700">Vị trí</span>
                <input
                  maxLength={100}
                  value={roomForm.viTri}
                  onChange={(event) => setRoomForm((form) => ({ ...form, viTri: event.target.value }))}
                  placeholder="Ví dụ: Tầng 2, khu A"
                  className="w-full rounded-xl border border-violet-100 bg-slate-50 px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-violet-300 focus:bg-white"
                />
              </label>
              <div className="flex flex-col-reverse gap-2 border-t border-violet-50 pt-4 sm:flex-row sm:justify-end">
                <button type="button" onClick={closeForm} disabled={isSaving} className="rounded-full border border-violet-100 px-5 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:opacity-50">
                  Hủy
                </button>
                <button type="submit" disabled={isSaving} className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-violet-500 to-pink-400 px-5 py-2.5 text-sm font-medium text-white shadow-[0_10px_24px_rgba(168,85,247,0.18)] transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
                  {isSaving ? "Đang lưu..." : editingRoom ? "Lưu thay đổi" : "Thêm phòng"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </PageShell>
  );
}
