"use client";

import type React from "react";
import { useEffect, useMemo, useState } from "react";
import PromptCard from "../components/PromptCardComponent";
import NewPromptModal from "../components/NewPromptModel";
import {
  createPrompt,
  deletePrompt,
  getPrompts as fetchPrompts,
  updatePrompt,
  upvotePrompt,
} from "../api/prompt";
import toast from "react-hot-toast";

export default function PromptPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");
  const [loading, setLoading] = useState(true);

  const [showCreate, setShowCreate] = useState(false);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  const [editing, setEditing] = useState<any | null>(null);

  const meId = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}")?.id;
    } catch {
      return undefined;
    }
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetchPrompts(page, 10);
      let list = res.data.items as any[];
      if (q.trim())
        list = list.filter(
          (x) =>
            x.title?.toLowerCase().includes(q.toLowerCase()) ||
            x.content?.toLowerCase().includes(q.toLowerCase())
        );
      if (sort === "top")
        list = [...list].sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
      setItems(list);
      setTotal(res.data.total);
    } catch (error) {
      console.error("Error loading prompts:", error);
      toast.error("Không tải được danh sách bài viết");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, sort]);

  const handleCreate = async ({
    title,
    content,
  }: {
    title: string;
    content: string;
  }) => {
    try {
      setSubmittingCreate(true);
      await createPrompt({ title, content });
      setPage(1);
      await load();
      toast.success("Đăng bài thành công!");
    } catch (err: any) {
      console.error("Error creating prompt:", err?.response?.data);

      const reason =
        err?.response?.data?.data?.reason ||
        err?.response?.data?.msg ||
        err?.message ||
        "Đăng bài thất bại";

      toast.error(reason);
      throw err;
    } finally {
      setSubmittingCreate(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    try {
      await updatePrompt(editing._id, {
        title: editing.title,
        content: editing.content,
      });
      setEditing(null);
      load();
      toast.success("Đã cập nhật bài viết");
    } catch (error) {
      console.error("Error updating prompt:", error);
      toast.error("Cập nhật thất bại");
    }
  };

  const Skeleton = () => (
    <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
      <div className="h-5 w-1/3 bg-gray-200 rounded-lg mb-4" />
      <div className="space-y-3">
        <div className="h-4 w-full bg-gray-200 rounded" />
        <div className="h-4 w-5/6 bg-gray-200 rounded" />
        <div className="h-4 w-2/3 bg-gray-200 rounded" />
      </div>
      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded-full" />
          <div className="h-4 w-20 bg-gray-200 rounded" />
        </div>
        <div className="h-8 w-16 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br px-4 sm:px-6 lg:px-10 from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="relative rounded-2xl px-4 sm:px-6 lg:px-10 overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="absolute inset-0 opacity-10 ">
          <div className="absolute top-4 left-4 sm:top-10 sm:left-10 w-12 h-12 sm:w-20 sm:h-20 border border-white rounded-full" />
          <div className="absolute top-16 right-8 sm:top-32 sm:right-20 w-10 h-10 sm:w-16 sm:h-16 border border-white rounded-full" />
          <div className="absolute bottom-10 left-1/4 w-8 h-8 sm:w-12 sm:h-12 border border-white rounded-full" />
          <div className="absolute bottom-16 right-1/3 w-16 h-16 sm:w-24 sm:h-24 border border-white rounded-full" />
        </div>

        <div className="relative mx-auto max-w-6xl px-4 py-8 sm:py-12">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-sm rounded-2xl mb-4">
              <svg
                className="w-6 h-6 sm:w-8 sm:h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">
              Cộng đồng English Learning
            </h1>
            <p className="text-white/90 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed px-4">
              Chia sẻ câu/đoạn tiếng Anh để được góp ý, sửa bài và học cùng nhau
              trong cộng đồng học tập tích cực.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-6 border border-white/20">
            <div className="flex flex-col sm:flex-row lg:flex-row gap-3 sm:gap-4">
              <div className="flex-1 relative">
                <svg
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  value={q}
                  onChange={(e) => setQ(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && load()}
                  placeholder="Tìm kiếm tiêu đề, nội dung..."
                  className="w-full h-11 sm:h-12 pl-12 pr-4 rounded-xl border-0 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50 transition-all text-sm sm:text-base"
                />
              </div>
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as "new" | "top")}
                  className="h-11 sm:h-12 px-3 sm:px-4 pr-10 rounded-xl border-0 bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-white/60 focus:shadow-lg hover:from-white/95 hover:to-white/85 transition-all duration-200 text-sm sm:text-base min-w-0 sm:min-w-[140px] appearance-none cursor-pointer shadow-lg"
                >
                  <option value="new">🕒 Mới nhất</option>
                  <option value="top">🔥 Upvote cao</option>
                </select>
                <button
                  onClick={load}
                  className="h-11 sm:h-12 px-4 sm:px-6 !bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white font-medium transition-all duration-200 border border-white/30 text-sm sm:text-base whitespace-nowrap"
                >
                  Tìm kiếm
                </button>
                <button
                  onClick={() => setShowCreate(true)}
                  className="h-11 sm:h-12 px-4 sm:px-6 bg-white text-gray-900 font-semibold rounded-xl border border-white/30 hover:bg-white/90 transition-all duration-200 text-sm sm:text-base whitespace-nowrap"
                >
                  + Tạo bài viết
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-6xl py-6 sm:py-8">
        <div className="space-y-6">
          {/* Section Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center">
              <svg
                className="w-5 h-5 sm:w-6 sm:h-6 mr-2 text-blue-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3v8m0 0V9a2 2 0 00-2-2H9m10 0V9a2 2 0 00-2-2H9m10 0h2M9 7h2m-2 0V5a2 2 0 012-2h2a2 2 0 012 2v2M9 7V5a2 2 0 012-2h2a2 2 0 012 2v2"
                />
              </svg>
              Bài viết cộng đồng
            </h2>
            <div className="text-sm text-gray-500 bg-white/60 px-3 py-1 rounded-full self-start sm:self-auto">
              {loading ? "Đang tải..." : `${items.length} bài viết`}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 sm:gap-6">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="w-full max-w-2xl">
                    <Skeleton />
                  </div>
                ))
              : items.map((p) => (
                  <div
                    key={p._id}
                    className="w-full max-w-4xl px-0 sm:px-4 lg:px-8 xl:px-16"
                  >
                    <PromptCard
                      prompt={p}
                      mine={p.createdBy?._id === meId}
                      onEdit={setEditing}
                      onDelete={async (id: string) => {
                        try {
                          await deletePrompt(id);
                          load();
                          toast.success("Đã xoá bài");
                        } catch (error) {
                          console.error("Error deleting prompt:", error);
                          toast.error("Xoá bài thất bại");
                        }
                      }}
                      onUpvote={async (id: string) => {
                        setItems((d) =>
                          d.map((x) =>
                            x._id === id
                              ? { ...x, upvotes: (x.upvotes ?? 0) + 1 }
                              : x
                          )
                        );
                        try {
                          await upvotePrompt(id);
                        } catch (error) {
                          console.error("Error upvoting prompt:", error);
                          load();
                          toast.error("Upvote thất bại");
                        }
                      }}
                    />
                  </div>
                ))}
          </div>

          {/* Empty State */}
          {!loading && !items.length && (
            <div className="text-center py-12 sm:py-16 px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Chưa có bài viết nào
              </h3>
              <p className="text-gray-500 mb-6 text-sm sm:text-base">
                {q.trim()
                  ? "Không tìm thấy bài viết phù hợp. Thử từ khóa khác!"
                  : "Hãy là người đầu tiên chia sẻ!"}
              </p>
              <button
                onClick={() => setShowCreate(true)}
                className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  />
                </svg>
                Tạo bài viết đầu tiên
              </button>
            </div>
          )}

          {/* Pagination */}
          {total > 10 && (
            <div className="flex items-center justify-center gap-2 pt-6 sm:pt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="flex items-center px-3 sm:px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm sm:text-base"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="hidden sm:inline">Trước</span>
              </button>

              <div className="flex items-center px-3 sm:px-4 py-2 bg-blue-50 text-blue-700 rounded-xl font-medium text-sm sm:text-base">
                Trang {page}
              </div>

              <button
                onClick={() => setPage((p) => p + 1)}
                className="flex items-center px-3 sm:px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-sm sm:text-base"
              >
                <span className="hidden sm:inline">Sau</span>
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Create Modal */}
      <NewPromptModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onSubmit={handleCreate}
        submitting={submittingCreate}
      />

      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 sm:px-6 py-3 sm:py-4 border-b border-gray-200">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center">
                <svg
                  className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Chỉnh sửa bài viết
              </h3>
            </div>

            <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSaveEdit} className="p-4 sm:p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tiêu đề
                  </label>
                  <input
                    className="w-full h-11 sm:h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                    value={editing.title}
                    onChange={(e) =>
                      setEditing((s: any) => ({ ...s, title: e.target.value }))
                    }
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nội dung
                  </label>
                  <textarea
                    className="w-full min-h-[120px] sm:min-h-[150px] px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-sm sm:text-base"
                    value={editing.content}
                    onChange={(e) =>
                      setEditing((s: any) => ({
                        ...s,
                        content: e.target.value,
                      }))
                    }
                  />
                </div>

                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setEditing(null)}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 font-medium transition-colors text-sm sm:text-base"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition-all duration-200 transform hover:scale-105 text-sm sm:text-base"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
