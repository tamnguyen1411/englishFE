import { useEffect, useMemo, useState } from "react";
import PromptCard from "./PromptCardComponent";
import {
  createPrompt,
  deletePrompt,
  getPrompts as fetchPrompts,
  updatePrompt,
  upvotePrompt,
} from "../api/prompt";


export default function PromptPage() {
  const [items, setItems] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<"new" | "top">("new");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({ title: "", content: "" });
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
    const res = await fetchPrompts(page, 10);
    let list = res.data.items as any[];
    // filter & sort (client)
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
    setLoading(false);
  };

  useEffect(() => {
    load(); /* eslint-disable-next-line */
  }, [page, sort]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    await createPrompt(form);
    setForm({ title: "", content: "" });
    setPage(1);
    load();
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    await updatePrompt(editing._id, {
      title: editing.title,
      content: editing.content,
    });
    setEditing(null);
    load();
  };

  const Skeleton = () => (
    <div className="animate-pulse rounded-xl border bg-white p-4">
      <div className="h-4 w-1/3 bg-gray-200 rounded" />
      <div className="mt-2 h-3 w-full bg-gray-200 rounded" />
      <div className="mt-2 h-3 w-2/3 bg-gray-200 rounded" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="mx-auto max-w-5xl px-4 py-8">
          <h1 className="text-2xl md:text-3xl font-bold">
            📝 Prompt cộng đồng
          </h1>
          <p className="text-white/90 mt-1">
            Chia sẻ câu/đoạn tiếng Anh để được góp ý, sửa bài và học cùng nhau.
          </p>

          {/* Toolbar */}
          <div className="mt-4 flex flex-col md:flex-row gap-3">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              placeholder="Tìm tiêu đề, nội dung…"
              className="w-full md:w-2/3 rounded-md border bg-white/90 px-3 py-2 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
            />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="rounded-md border bg-white/90 px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-white"
            >
              <option value="new">Mới nhất</option>
              <option value="top">Upvote cao</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Create form */}
        <form
          onSubmit={handleCreate}
          className="mb-6 rounded-xl bg-white p-4 shadow space-y-3"
        >
          <div className="flex flex-col md:flex-row gap-3">
            <input
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tiêu đề"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
            <button className="md:w-40 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
              Đăng prompt
            </button>
          </div>
          <textarea
            className="w-full min-h-[110px] rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nội dung (câu/đoạn cần góp ý, ngữ cảnh, yêu cầu sửa...)"
            value={form.content}
            onChange={(e) =>
              setForm((f) => ({ ...f, content: e.target.value }))
            }
          />
        </form>

        {/* List */}
        <div className="grid gap-4 md:grid-cols-2">
          {loading
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} />)
            : items.map((p) => (
                <PromptCard
                  key={p._id}
                  prompt={p}
                  mine={p.createdBy?._id === meId}
                  onEdit={setEditing}
                  onDelete={async (id: string) => {
                    await deletePrompt(id);
                    load();
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
                    } catch {
                      load();
                    }
                  }}
                />
              ))}
        </div>

        {/* Empty state */}
        {!loading && !items.length && (
          <div className="mt-10 text-center text-gray-500">
            Chưa có prompt nào khớp tìm kiếm. Hãy là người đầu tiên đăng bài! 🚀
          </div>
        )}

        {/* Pagination đơn giản */}
        {total > 10 && (
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded border px-3 py-1 disabled:opacity-50"
            >
              Prev
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => setPage((p) => p + 1)}
              className="rounded border px-3 py-1"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {editing && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/40 p-4">
          <form
            onSubmit={handleSaveEdit}
            className="w-full max-w-lg rounded-xl bg-white p-5 shadow-xl space-y-3"
          >
            <h3 className="text-lg font-semibold">Sửa Prompt</h3>
            <input
              className="w-full rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editing.title}
              onChange={(e) =>
                setEditing((s: any) => ({ ...s, title: e.target.value }))
              }
            />
            <textarea
              className="w-full min-h-[120px] rounded border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={editing.content}
              onChange={(e) =>
                setEditing((s: any) => ({ ...s, content: e.target.value }))
              }
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded border px-4 py-2"
              >
                Huỷ
              </button>
              <button className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
                Lưu
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
