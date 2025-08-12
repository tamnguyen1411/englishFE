"use client";

import { useState } from "react";
import { fixGrammar } from "../api/ai";

export default function AIGrammarBox() {
  const [input, setInput] = useState("");
  const [out, setOut] = useState<{
    corrected?: string;
    explanation?: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const run = async () => {
    if (!input.trim()) return;
    setLoading(true);
    try {
      const { data } = await fixGrammar(input);
      setOut(data);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
        <div className="relative p-6 space-y-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Nhập câu tiếng Anh cần sửa
          </label>
          <textarea
            className="w-full min-h-[120px] rounded-xl border-2 border-gray-200 px-4 py-3 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 focus:outline-none transition-all duration-200 resize-none bg-white/80 backdrop-blur-sm"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ví dụ: I are going to the store yesterday..."
          />
          <button
            onClick={run}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-4 focus:ring-blue-500/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            disabled={loading || !input.trim()}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Đang xử lý...
              </div>
            ) : (
              "Sửa ngay"
            )}
          </button>
        </div>
      </div>

      {out && (
        <div className="relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur-sm border border-white/20 shadow-xl animate-in slide-in-from-bottom-4 duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-emerald-500/5 to-teal-500/5"></div>
          <div className="relative p-6 space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-sm font-semibold shadow-md">
                ✓
              </div>
              <h4 className="text-lg font-bold text-gray-800">
                Kết quả sửa lỗi
              </h4>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/50">
                <div className="flex items-start gap-2 mb-2">
                  <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-100 text-green-800 text-xs font-medium">
                    Bản sửa
                  </span>
                </div>
                <p className="text-gray-800 font-medium leading-relaxed">
                  {out.corrected}
                </p>
              </div>

              {out.explanation && (
                <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
                  <div className="flex items-start gap-2 mb-2">
                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-medium">
                      Giải thích
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {out.explanation}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
