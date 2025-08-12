"use client";
import { useState } from "react";
import CommentList from "./CommentList";

interface PromptCardProps {
  prompt: {
    _id: string;
    title: string;
    content: string;
    upvotes?: number;
    createdBy?: {
      _id: string;
      name?: string;
    };
    createdAt?: string;
  };
  mine: boolean;
  onEdit: (prompt: any) => void;
  onDelete: (id: string) => Promise<void>;
  onUpvote: (id: string) => Promise<void>;
}

export default function PromptCard({
  prompt,
  mine,
  onEdit,
  onDelete,
  onUpvote,
}: PromptCardProps) {

  const [showComments, setShowComments] = useState(false);
  const formatDate = (dateString?: string): string => {
    if (!dateString) return "Vừa xong";
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

  const handleEdit = (): void => {
    onEdit(prompt);
  };

  const handleDelete = async (): Promise<void> => {
    await onDelete(prompt._id);
  };

  const handleUpvote = async (): Promise<void> => {
    await onUpvote(prompt._id);
  };

  return (
    <article className="group relative bg-white rounded-2xl border border-gray-200/60 hover:border-blue-200 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden">
      {/* Gradient Border Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-blue-900 transition-colors">
              {prompt.title}
            </h3>
          </div>

          {/* Action Buttons - Giữ nguyên logic cũ */}
          {mine && (
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <button
                onClick={handleEdit}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors text-sm font-medium"
                type="button"
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
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                <span>Sửa</span>
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 transition-colors text-sm font-medium"
                type="button"
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
                <span>Xóa</span>
              </button>
            </div>
          )}
        </div>

        {/* Content - Giữ nguyên logic */}
        <div className="mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-base">
            {prompt.content}
          </p>
        </div>

        {/* Footer - Giữ nguyên logic cũ */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          {/* Author Info */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-sm">
              <span className="text-white font-medium text-sm">
                {prompt.createdBy?.name
                  ? prompt.createdBy.name.charAt(0).toUpperCase()
                  : "?"}
              </span>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-700">
                bởi {prompt.createdBy?.name || "Ẩn danh"}
              </span>
              {prompt.createdAt && (
                <div className="text-xs text-gray-500">
                  {formatDate(prompt.createdAt)}
                </div>
              )}
            </div>
            {mine && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                <svg
                  className="w-3 h-3 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Của bạn
              </span>
            )}
          </div>

          {/* Upvote Button - Giữ nguyên logic cũ */}
          <button
            onClick={handleUpvote}
            className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition-all duration-200 group/upvote"
            type="button"
          >
            <svg
              className="w-5 h-5 group-hover/upvote:scale-110 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
              />
            </svg>
            <span className="font-semibold">{prompt.upvotes || 0}</span>
          </button>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setShowComments((prev) => !prev)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700"
          >
            {showComments ? "Ẩn bình luận" : "Xem bình luận"}
          </button>
        </div>

        {/* CommentList chỉ hiển thị khi bấm nút */}
        {showComments && (
          <div className="mt-4">
            <CommentList promptId={prompt._id} />
          </div>
        )}
      
      </div>
    </article>
  );
}
