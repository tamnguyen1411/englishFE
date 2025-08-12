"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { createComment, deleteComment, getComments } from "../api/comment";

export default function CommentList({ promptId }: { promptId: string }) {
  const [items, setItems] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getComments(promptId);
      setItems(data);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [promptId]);

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Vừa xong";
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`;
    return date.toLocaleDateString("vi-VN");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      await createComment(promptId, text);
      setText("");
      await load();
    } catch (error) {
      console.error("Error creating comment:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      await deleteComment(commentId);
      await load();
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  return (
    <div className="mt-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/60 overflow-hidden">
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-2 border-b border-gray-200/50">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 flex items-center text-base">
            <svg
              className="w-5 h-5 mr-2 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            Bình luận
          </h3>
          <div className="flex items-center space-x-2 text-xs text-gray-600">
            <span className="bg-white/60 px-2 py-0.5 rounded-full">
              {items.length} bình luận
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Comments List */}
        <div className="space-y-3">
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex space-x-3">
                    <div className="w-9 h-9 bg-gray-200 rounded-full"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3.5 bg-gray-200 rounded w-1/4"></div>
                      <div className="h-3.5 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3.5 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : items.length ? (
            items.map((c) => (
              <div
                key={c._id}
                className="group bg-gray-50/50 hover:bg-white border border-gray-200/50 hover:border-blue-200 rounded-2xl p-4 transition-all duration-300 hover:shadow-md"
              >
                <div className="flex space-x-3">
                  <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-white font-medium text-xs">
                      {c.createdBy?.name
                        ? c.createdBy.name.charAt(0).toUpperCase()
                        : "?"}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {c.createdBy?.name || "Ẩn danh"}
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {c.createdAt
                            ? formatTimeAgo(c.createdAt)
                            : "Vừa xong"}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(c._id)}
                        className="opacity-0 group-hover:opacity-100 p-1 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-all duration-200"
                        title="Xóa bình luận"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Comment Text (giảm mb) */}
                    <div className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
                      {c.content}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            // Empty State (giảm padding)
            <div className="text-center py-6">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg
                  className="w-7 h-7 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              </div>
              <h3 className="text-base font-medium text-gray-900 mb-1.5">
                Chưa có bình luận
              </h3>
              <p className="text-gray-500 text-sm">
                Hãy là người đầu tiên chia sẻ góp ý cho bài viết này!
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-gray-200/70 pt-4" />

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="relative">
            <textarea
              className="w-full min-h-[60px] px-3 py-2 rounded-xl border-2 border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300 resize-none placeholder-gray-400"
              placeholder="Chia sẻ góp ý, nhận xét của bạn..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={submitting}
              maxLength={500}
            />
            <div className="absolute bottom-2 right-3 text-xs text-gray-400">
              {text.length}/500
            </div>
          </div>

          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={!text.trim() || submitting}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-400 text-white font-medium rounded-xl transition-all duration-200 disabled:cursor-not-allowed shadow"
            >
              {submitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  <span>Gửi bình luận</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
