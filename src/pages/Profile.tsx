"use client";

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetProfile, apiUpdateProfile } from "../api/auth";
import {
  getMyStats,
  deletePrompt,
  getPrompts as fetchPrompts,
  upvotePrompt,
} from "../api/prompt";
import PromptCard from "../components/PromptCardComponent";
import toast from "react-hot-toast";

export interface UserStats {
  totalPosts: number;
  totalUpvotes: number;
}

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  joinedDate?: string;
  bio?: string;
}

export default function ProfilePage() {
  // ====== Profile / Stats state ======
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ====== UI Tabs ======
  const [activeTab, setActiveTab] = useState<"overview" | "posts" | "settings">(
    "overview"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ name: "", bio: "" });

  // ====== Posts list state ======
  const [items, setItems] = useState<any[]>([]);
  // const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");
  const [postsLoading, setPostsLoading] = useState(false);

  // Unused in bản này nhưng giữ nếu sau cần mở modal tạo bài

  // const [editing, setEditing] = useState<any | null>(null);

  const navigate = useNavigate();

  // Lấy meId từ localStorage (fallback sang user sau khi profile về)
  const meId = useMemo(() => {
    try {
      const cached = JSON.parse(localStorage.getItem("user") || "{}")?.id;
      return cached || user?.id;
    } catch {
      return user?.id;
    }
  }, [user]);

  // ====== Load profile khi vào trang ======
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setProfileLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/login");
          return;
        }

        const res = await apiGetProfile();
        const u = res.data?.data || res.data?.user || res.data;
        if (!u) throw new Error("Không lấy được dữ liệu người dùng");

        const mapped: UserProfile = {
          id: u._id || u.id,
          name: u.name,
          email: u.email,
          bio: u.bio,
          joinedDate: u.joinedDate || u.createdAt,
          avatar: u.avatar,
        };

        if (!isMounted) return;

        setUser(mapped);
        setEditForm({ name: mapped.name || "", bio: mapped.bio || "" });
        localStorage.setItem("user", JSON.stringify(mapped));
      } catch (e: any) {
        if (e?.response?.status === 401) {
          navigate("/login");
          return;
        }
        setError(e?.response?.data?.message || e.message || "Có lỗi xảy ra");
      } finally {
        if (isMounted) setProfileLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  // ====== Load stats sau khi có token (độc lập với profile) ======
  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        setStatsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await getMyStats();
        const data = res.data?.data || res.data;
        if (!isMounted) return;

        setStats({
          totalPosts: data?.totalPosts ?? 0,
          totalUpvotes: data?.totalUpvotes ?? 0,
        });
      } catch (e: any) {
        console.warn("Load stats error:", e?.response?.data || e);
        setStats({ totalPosts: 0, totalUpvotes: 0 });
      } finally {
        if (isMounted) setStatsLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, []);

  // ====== Loader cho danh sách bài viết (lọc theo user hiện tại) ======
  const loadPosts = async () => {
    setPostsLoading(true);
    try {
      const res = await fetchPrompts(page, 10);
      let list = (res.data?.items as any[]) || [];

      // Lọc theo người tạo nếu BE chưa có filter
      if (meId) {
        list = list.filter((x) => {
          const owner =
            x.createdBy?._id || x.createdBy?.id || x.createdBy || x.userId;
          // phòng trường hợp các field khác nhau giữa BE/FE
          return String(owner) === String(meId);
        });
      }

      // Search
      if (q.trim()) {
        const qq = q.toLowerCase();
        list = list.filter(
          (x) =>
            x.title?.toLowerCase().includes(qq) ||
            x.content?.toLowerCase().includes(qq)
        );
      }

      // Sort
      if (sort === "top") {
        list = [...list].sort((a, b) => (b.upvotes ?? 0) - (a.upvotes ?? 0));
      } else {
        list = [...list].sort(
          (a, b) =>
            new Date(b.createdAt || b.updatedAt || 0).getTime() -
            new Date(a.createdAt || a.updatedAt || 0).getTime()
        );
      }

      setItems(list);
      // Nếu BE trả total theo toàn bộ hệ thống, ta dùng chiều dài list đã lọc
      // setTotal(res.data?.total ?? list.length);
    } catch (error) {
      console.error("Error loading prompts:", error);
      toast.error("Không tải được danh sách bài viết");
    } finally {
      setPostsLoading(false);
    }
  };

  // Gọi loadPosts khi chuyển sang tab "posts" hoặc khi các tham số đổi
  useEffect(() => {
    if (activeTab !== "posts") return;
    // Chờ có meId (khi profile đã về) để lọc chính xác
    if (!meId) return;
    loadPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, page, q, sort, meId]);

  // ====== Update profile ======
  const handleSaveProfile = async () => {
    if (!user) return;
    setSaving(true);
    setError(null);

    const prev = user;
    const next = { ...user, name: editForm.name, bio: editForm.bio };
    setUser(next);

    try {
      const res = await apiUpdateProfile({
        name: editForm.name,
        bio: editForm.bio,
      });
      const u = res.data?.data || res.data?.user || res.data;
      const mapped: UserProfile = {
        id: u._id || u.id,
        name: u.name,
        email: u.email,
        bio: u.bio,
        joinedDate: u.joinedDate || u.createdAt,
        avatar: u.avatar,
      };

      setUser(mapped);
      localStorage.setItem("user", JSON.stringify(mapped));
      setIsEditing(false);
      toast.success("Đã cập nhật hồ sơ");
    } catch (e: any) {
      setUser(prev);
      setError(e?.response?.data?.message || e.message || "Cập nhật thất bại");
      toast.error("Cập nhật thất bại");
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  // ====== UI Loading/Error tổng cho profile ======
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white shadow rounded-xl p-6 text-center">
          <p className="text-red-600 font-medium mb-4">{error}</p>
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            Đăng nhập lại
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  // ====== Skeleton cho PromptCard ======
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-20 h-20 border border-white rounded-full animate-pulse" />
          <div className="absolute top-32 right-20 w-16 h-16 border border-white rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-20 left-1/4 w-12 h-12 border border-white rounded-full animate-pulse delay-2000" />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row items-center lg:items-end space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-sm rounded-3xl flex items-center justify-center border-4 border-white/30 shadow-2xl">
                <span className="text-4xl font-bold text-white">
                  {(user.name || "?").charAt(0).toUpperCase()}
                </span>
              </div>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center lg:text-left">
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                {user.name || "Người dùng"}
              </h1>
              <p className="text-white/90 text-lg mb-4">{user.email || ""}</p>

              {user.joinedDate && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-4 text-white/80">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Tham gia {formatDate(user.joinedDate)}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Counters */}
            <div className="grid grid-cols-2 gap-6 text-center">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">
                  {stats?.totalPosts ?? 0}
                </div>
                <div className="text-white/80 text-sm">Bài viết</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
                <div className="text-2xl font-bold text-white">
                  {stats?.totalUpvotes ?? 0}
                </div>
                <div className="text-white/80 text-sm">Upvotes</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4">
          <nav className="flex space-x-8">
            {[
              { id: "overview", label: "Tổng quan", icon: "📊" },
              { id: "posts", label: "Bài viết", icon: "📝" },
              { id: "settings", label: "Cài đặt", icon: "⚙️" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "overview" && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Bio Section */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Giới thiệu
                  </h2>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Chỉnh sửa
                  </button>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  {user.bio || "Chưa có thông tin giới thiệu."}
                </p>
              </div>
            </div>

            {/* Right Column — Quick Stats */}
            <div className="space-y-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  Thống kê
                </h3>

                {statsLoading ? (
                  <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng bài viết</span>
                      <span className="font-semibold text-gray-900">
                        {stats?.totalPosts ?? 0}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng upvotes</span>
                      <span className="font-semibold text-gray-900">
                        {stats?.totalUpvotes ?? 0}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "posts" && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
              <h2 className="text-xl font-bold text-gray-900">
                Bài viết của tôi
              </h2>
              <div className="flex gap-3">
                <input
                  value={q}
                  onChange={(e) => {
                    setPage(1);
                    setQ(e.target.value);
                  }}
                  placeholder="Tìm theo tiêu đề/nội dung..."
                  className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[220px]"
                />
                <select
                  value={sort}
                  onChange={(e) => {
                    setPage(1);
                    setSort(e.target.value as "new" | "top");
                  }}
                  className="px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="new">Mới nhất</option>
                  <option value="top">Nhiều upvotes</option>
                </select>
              </div>
            </div>

            <div className="text-center py-6">
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                {postsLoading ? (
                  Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="w-full max-w-2xl">
                      <Skeleton />
                    </div>
                  ))
                ) : items.length > 0 ? (
                  items.map((p) => (
                    <div
                      key={p._id}
                      className="w-full max-w-4xl px-0 sm:px-4 lg:px-8 xl:px-16"
                    >
                      <PromptCard
                        prompt={p}
                        mine={
                          (p.createdBy?._id ||
                            p.createdBy?.id ||
                            p.createdBy ||
                            p.userId) === meId
                        }
                        onEdit={() => console.log("Edit not implemented")}
                        onDelete={async (id: string) => {
                          try {
                            await deletePrompt(id);
                            await loadPosts();
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
                            await loadPosts();
                            toast.error("Upvote thất bại");
                          }
                        }}
                      />
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500">Chưa có bài viết nào.</div>
                )}
              </div>

              {/* Pagination (đơn giản) */}
              <div className="mt-8 flex items-center justify-center gap-3">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={postsLoading || page === 1}
                  className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-60"
                >
                  Trang trước
                </button>
                <span className="text-sm text-gray-600">Trang {page}</span>
                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={postsLoading || items.length < 10}
                  className="px-3 py-2 rounded-lg border border-gray-200 disabled:opacity-60"
                >
                  Trang sau
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "settings" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/60">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Cài đặt tài khoản
              </h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user.email || ""}
                    disabled
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className={`w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 ${
                    saving
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:from-blue-700 hover:to-purple-700"
                  }`}
                >
                  {saving ? "Đang lưu..." : "Lưu thay đổi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal Edit Profile */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl">
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Chỉnh sửa hồ sơ
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) =>
                      setEditForm({ ...editForm, name: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Giới thiệu
                  </label>
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm({ ...editForm, bio: e.target.value })
                    }
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                >
                  Hủy
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-70"
                >
                  {saving ? "Đang lưu..." : "Lưu"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
