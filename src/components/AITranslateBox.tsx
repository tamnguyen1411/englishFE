"use client";

import { useState } from "react";
import { smartTranslate } from "../api/ai";

type LanguageType = "vi" | "en" | "ja" | "ko" | "zh" | "fr" | "de";

export default function AITranslateBox() {
  const [text, setText] = useState("");
  const [target, setTarget] = useState<LanguageType>("vi");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [out, setOut] = useState<any>(null);

  const run = async () => {
    if (!text.trim()) return;
    setLoading(true);
    setErr(null);
    setOut(null);
    try {
      const { data } = await smartTranslate({ text, target_lang: target });
      setOut(data);
    } catch (e: any) {
      setErr(e?.response?.data?.msg || "Có lỗi khi dịch.");
    } finally {
      setLoading(false);
    }
  };

  const languageOptions = [
    { code: "vi" as LanguageType, name: "Tiếng Việt", flag: "🇻🇳" },
    { code: "en" as LanguageType, name: "English", flag: "🇺🇸" },
    { code: "ja" as LanguageType, name: "日本語", flag: "🇯🇵" },
    { code: "ko" as LanguageType, name: "한국어", flag: "🇰🇷" },
    { code: "zh" as LanguageType, name: "中文", flag: "🇨🇳" },
    { code: "fr" as LanguageType, name: "Français", flag: "🇫🇷" },
    { code: "de" as LanguageType, name: "Deutsch", flag: "🇩🇪" },
  ];

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 backdrop-blur-sm border border-white/20 shadow-xl">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>

      <div className="relative p-8 space-y-6">
        <div className="text-center">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            🌐 Dịch Thông Minh
          </h3>
          <p className="text-gray-600 mt-2">Dịch thuật chính xác với AI</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Văn bản cần dịch
            </label>
            <textarea
              className="w-full min-h-[160px] rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 text-gray-800 placeholder-gray-400 transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none resize-none"
              placeholder="Nhập hoặc dán văn bản cần dịch..."
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
            <div className="absolute bottom-3 right-3 text-xs text-gray-400">
              {text.length} ký tự
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ngôn ngữ đích
              </label>
              <div className="relative">
                <select
                  className="w-full appearance-none rounded-xl border-2 border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3 pr-10 text-gray-800 transition-all duration-200 focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none cursor-pointer"
                  value={target}
                  onChange={(e) => setTarget(e.target.value as LanguageType)}
                >
                  {languageOptions.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg
                    className="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={run}
              disabled={loading || !text.trim()}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Đang dịch...
                </div>
              ) : (
                "Dịch ngay"
              )}
            </button>
          </div>
        </div>

        {err && (
          <div className="rounded-xl border-2 border-red-200 bg-red-50/80 backdrop-blur-sm p-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-red-500">⚠️</div>
              <div className="text-red-700 font-medium">Lỗi dịch thuật</div>
            </div>
            <div className="text-red-600 mt-1 text-sm">{err}</div>
          </div>
        )}

        {out && (
          <div className="rounded-xl border-2 border-green-200 bg-green-50/80 backdrop-blur-sm p-6 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-green-200">
              <div className="w-6 h-6 text-green-600">✅</div>
              <div className="font-semibold text-green-800">Kết quả dịch</div>
            </div>

            <div className="bg-white/60 rounded-lg p-4 border border-green-100">
              <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {out.translation}
              </div>
            </div>

            {out.notes_vi && (
              <div className="bg-blue-50/60 rounded-lg p-3 border border-blue-100">
                <div className="flex items-start gap-2">
                  <div className="text-blue-600 mt-0.5">💡</div>
                  <div className="text-blue-800 text-sm leading-relaxed">
                    <strong>Ghi chú:</strong> {out.notes_vi}
                  </div>
                </div>
              </div>
            )}

            {out.keywords?.length > 0 && (
              <div className="bg-purple-50/60 rounded-lg p-3 border border-purple-100">
                <div className="flex items-start gap-2">
                  <div className="text-purple-600 mt-0.5">📚</div>
                  <div className="text-purple-800 text-sm">
                    <strong>Từ khóa quan trọng:</strong>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {out.keywords.map((keyword: string, index: number) => (
                        <span
                          key={index}
                          className="inline-block bg-purple-100 text-purple-700 px-2 py-1 rounded-md text-xs font-medium"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {out.meta && (
              <div className="text-xs text-gray-500 bg-gray-50/60 rounded-lg p-3 border border-gray-100">
                <div className="flex flex-wrap gap-4">
                  <span>
                    <strong>Ngôn ngữ nguồn:</strong>{" "}
                    {out.meta.detected_source_lang}
                  </span>
                  <span>
                    <strong>Ngôn ngữ đích:</strong> {out.meta.target_lang}
                  </span>
                  <span>
                    <strong>Phong cách:</strong> {out.meta.style}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
